
const express = require('express');
const sql = require('mssql');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const config = require('./dbconfig');
const XLSX = require('xlsx'); // ← QUAN TRỌNG: Phải có dòng này

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// API test: trả về thông tin user đăng nhập (TẠM THỜI TRẢ VỀ MOCK DATA)
app.get('/api/whoami', (req, res) => {
  res.json({
    authenticated: false,
    message: 'Windows Authentication is temporarily disabled'
  });
});

// --- SOCKET.IO ---
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

// Gửi socket.io client
app.get('/socket.io.js', (req, res) => {
  res.sendFile(require.resolve('socket.io-client/dist/socket.io.js'));
});

// ensure uploads folder exists
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Tạo pool toàn cục, tái sử dụng cho mọi truy vấn
let poolPromise;
function getPool() {
  if (!poolPromise) {
    poolPromise = sql.connect(config);
  }
  return poolPromise;
}

// Kiểm tra kết nối khi khởi động
getPool().then(() => {
  console.log('✅ Connected to SQL Server');
}).catch(err => {
  console.error('❌ DB Connection Error:', err.message || err);
});

// multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const safe = Date.now() + '_' + file.originalname.replace(/\s+/g, '_');
    cb(null, safe);
  }
});
const upload = multer({ storage });

// ========== API QUẢN LÝ THỜI GIAN ĐẤU GIÁ ==========

// Biến lưu thời gian đấu giá (có thể lưu vào DB nếu cần)
let auctionTimes = {
  startTime: null,
  endTime: null
};

// Lấy thời gian đấu giá hiện tại
app.get('/api/auction-time', (req, res) => {
  res.json(auctionTimes);
});

// Cập nhật thời gian đấu giá (Admin)
app.post('/api/auction-time', (req, res) => {
  const { startTime, endTime } = req.body;
  
  if (!startTime || !endTime) {
    return res.status(400).json({ success: false, message: 'Thiếu thông tin thời gian' });
  }
  
  if (new Date(startTime) >= new Date(endTime)) {
    return res.status(400).json({ success: false, message: 'Thời gian bắt đầu phải trước thời gian kết thúc' });
  }
  
  auctionTimes.startTime = startTime;
  auctionTimes.endTime = endTime;
  
  // Broadcast thời gian mới đến tất cả clients
  io.emit('auctionTimeUpdated', auctionTimes);
  
  res.json({ success: true, message: 'Cập nhật thời gian thành công', data: auctionTimes });
});

// Reset thời gian về null
app.post('/api/auction-time/reset', async (req, res) => {
  auctionTimes.startTime = null;
  auctionTimes.endTime = null;
  
  // Broadcast reset đến tất cả clients
  io.emit('auctionTimeUpdated', auctionTimes);
  
  res.json({ success: true, message: 'Đã reset thời gian đấu giá' });
});

// ========== API SẢN PHẨM ==========

// API: get products
app.get('/api/products', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM Product ORDER BY MaProduct');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching products');
  }
});

// API: get product by id (for admin edit modal)
app.get('/api/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Product WHERE MaProduct = @id');
    if (!result.recordset.length) return res.status(404).send('Product not found');
    res.json(result.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching product');
  }
});

// API: add product (admin) - handles file upload
app.post('/api/products', upload.array('hinhAnh', 4), async (req, res) => {
  try {
    const { tenProduct, giaKhoiDiem, moTa } = req.body;
    let hinhAnh = null;
    if (req.files && req.files.length > 0) {
      hinhAnh = req.files.map(f => '/uploads/' + f.filename).join(',');
    }
    const pool = await getPool();
    await pool.request()
      .input('tenProduct', sql.NVarChar, tenProduct)
      .input('giaKhoiDiem', sql.Float, parseFloat(giaKhoiDiem))
      .input('hinhAnh', sql.NVarChar, hinhAnh)
      .input('moTa', sql.NVarChar, moTa)
      .query('INSERT INTO Product (TenProduct, GiaKhoiDiem, GiaHienTai, TenNguoiDauGia, HinhAnh, MoTa) VALUES (@tenProduct, @giaKhoiDiem, @giaKhoiDiem, NULL, @hinhAnh, @moTa)');
    io.emit('productsChanged');
    res.json({ message: 'Product added' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding product');
  }
});

// API: update product (admin)
app.put('/api/products/:id', upload.array('hinhAnh', 4), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { tenProduct, giaKhoiDiem, moTa, giaHienTai, tenNguoiDauGia } = req.body;
    
    const pool = await getPool();
    
    // Lấy thông tin sản phẩm hiện tại
    const currentProduct = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT HinhAnh FROM Product WHERE MaProduct = @id');
    
    if (!currentProduct.recordset.length) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    let hinhAnhPath = currentProduct.recordset[0].HinhAnh;
    
    // Nếu có upload ảnh mới, thay thế ảnh cũ
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(f => '/uploads/' + f.filename);
      hinhAnhPath = newImages.join(', ');
    }
    
    // Chuẩn bị câu query động
    let updateQuery = `
      UPDATE Product 
      SET TenProduct = @tenProduct,
          GiaKhoiDiem = @giaKhoiDiem,
          MoTa = @moTa,
          HinhAnh = @hinhAnh
    `;
    
    const request = pool.request()
      .input('id', sql.Int, id)
      .input('tenProduct', sql.NVarChar, tenProduct)
      .input('giaKhoiDiem', sql.Float, parseFloat(giaKhoiDiem))
      .input('moTa', sql.NVarChar, moTa || '')
      .input('hinhAnh', sql.NVarChar, hinhAnhPath);
    
    // Thêm giá hiện tại nếu có
    if (giaHienTai !== undefined && giaHienTai !== null && giaHienTai !== '') {
      updateQuery += ', GiaHienTai = @giaHienTai';
      request.input('giaHienTai', sql.Float, parseFloat(giaHienTai));
    }
    
    // Thêm tên người đấu giá nếu có
    if (tenNguoiDauGia !== undefined && tenNguoiDauGia !== null && tenNguoiDauGia.trim() !== '') {
      updateQuery += ', TenNguoiDauGia = @tenNguoiDauGia';
      request.input('tenNguoiDauGia', sql.NVarChar, tenNguoiDauGia.trim());
    } else if (tenNguoiDauGia === '') {
      // Nếu để trống, xóa người đấu giá
      updateQuery += ', TenNguoiDauGia = NULL';
    }
    
    updateQuery += ' WHERE MaProduct = @id';
    
    await request.query(updateQuery);
    
    io.emit('productsChanged');
    res.json({ success: true, message: 'Product updated successfully' });
    
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ success: false, message: 'Error updating product: ' + err.message });
  }
});

// API: delete product (admin)
app.delete('/api/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const pool = await getPool();
    // get image name to delete
    const q = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT HinhAnh FROM Product WHERE MaProduct=@id');
    if (q.recordset.length) {
      const img = q.recordset[0].HinhAnh;
      if (img) {
        // Hỗ trợ nhiều ảnh, xóa từng file nếu tồn tại
        const imgArr = img.split(',').map(s => s.trim()).filter(Boolean);
        for (const imgPath of imgArr) {
          const p = path.join(__dirname, 'public', imgPath.startsWith('/') ? imgPath.slice(1) : imgPath);
          if (fs.existsSync(p)) {
            try { fs.unlinkSync(p); } catch(e) { /* Bỏ qua lỗi nếu file không tồn tại */ }
          }
        }
      }
    }
    // Xóa tất cả các bản ghi liên quan trong bảng Daugia trước
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Daugia WHERE MaProduct=@id');
    // Sau đó mới xóa sản phẩm
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Product WHERE MaProduct=@id');
    io.emit('productsChanged');
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting product');
  }
});

// ========== API ĐẤU GIÁ ==========

// API lấy chi tiết đấu giá kèm thông tin sản phẩm và tất cả người đấu giá
app.get('/api/bid-detail/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const pool = await getPool();
    // Lấy thông tin sản phẩm
    const prodQ = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT MaProduct, TenProduct, GiaKhoiDiem, GiaHienTai, TenNguoiDauGia, HinhAnh, GhiChu, MoTa FROM Product WHERE MaProduct = @id');
    if (!prodQ.recordset.length) return res.status(404).send('Product not found');
    const product = prodQ.recordset[0];
    // Lấy tất cả lượt đấu giá (mới nhất lên đầu)
    const bidsQ = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT TenNguoiDauGia, GiaHienTai, Note, CreatedAt FROM Daugia WHERE MaProduct = @id ORDER BY CreatedAt DESC');
    res.json({
      product,
      bids: bidsQ.recordset
    });
  } catch(err) {
    console.error(err);
    res.status(500).send('Error fetching bid details');
  }
});

// API: place bid
app.post('/api/bid', async (req, res) => {
  try {
    const { maProduct, tenNguoiDauGia, giaHienTai } = req.body;
    const pid = parseInt(maProduct);
    const bid = parseFloat(giaHienTai);
    
    if (!pid || !tenNguoiDauGia || !bid) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing fields' 
      });
    }

    // Always get pool before using it
    const pool = await getPool();

    // Lấy displayName từ SSO nếu có, lưu vào bảng Users nếu chưa có
    let username = '';
    let userId = null;
    if (req.sso && req.sso.user && req.sso.user.displayName) {
      username = req.sso.user.displayName;
      // Lưu vào bảng Users nếu chưa có
      const userCheck = await pool.request()
        .input('username', sql.NVarChar, username)
        .query('SELECT UserID FROM Users WHERE Username = @username');
      if (!userCheck.recordset.length) {
        const insertUser = await pool.request()
          .input('username', sql.NVarChar, username)
          .query('INSERT INTO Users (Username) OUTPUT INSERTED.UserID VALUES (@username)');
        userId = insertUser.recordset[0].UserID;
      } else {
        userId = userCheck.recordset[0].UserID;
      }
    }
    
    // get current price and start price
    const r = await pool.request()
      .input('pid', sql.Int, pid)
      .query('SELECT GiaHienTai, GiaKhoiDiem FROM Product WHERE MaProduct=@pid');
    
    if (!r.recordset.length) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }
    
    const row = r.recordset[0];
    const current = row.GiaHienTai != null ? parseFloat(row.GiaHienTai) : parseFloat(row.GiaKhoiDiem);

    if (bid <= current) {
      return res.json({ 
        success: false, 
        message: 'Bid must be greater than current price' 
      });
    }

    // insert into Daugia (lưu UserID nếu có)
    const request = pool.request()
      .input('pid', sql.Int, pid)
      .input('tenNguoiDauGia', sql.NVarChar, tenNguoiDauGia)
      .input('bid', sql.Float, bid);
    
    if (userId) {
      request.input('userId', sql.Int, userId);
      await request.query("INSERT INTO Daugia (MaProduct, TenNguoiDauGia, GiaHienTai, Note, UserID) VALUES (@pid, @tenNguoiDauGia, @bid, N'Đấu giá', @userId)");
    } else {
      await request.query("INSERT INTO Daugia (MaProduct, TenNguoiDauGia, GiaHienTai, Note) VALUES (@pid, @tenNguoiDauGia, @bid, N'Đấu giá')");
    }

    // update product current price and last bidder and append note
    // get existing note
    const notesQ = await pool.request()
      .input('pid', sql.Int, pid)
      .query('SELECT GhiChu FROM Product WHERE MaProduct=@pid');
    
    let notes = notesQ.recordset.length ? (notesQ.recordset[0].GhiChu || '') : '';
    const newNote = notes ? (notes + ', ' + tenNguoiDauGia) : tenNguoiDauGia;
    
    await pool.request()
      .input('bid', sql.Float, bid)
      .input('tenNguoiDauGia', sql.NVarChar, tenNguoiDauGia)
      .input('newNote', sql.NVarChar, newNote)
      .input('pid', sql.Int, pid)
      .query('UPDATE Product SET GiaHienTai=@bid, TenNguoiDauGia=@tenNguoiDauGia, GhiChu=@newNote WHERE MaProduct=@pid');

    io.emit('productsChanged');
    res.json({ success: true, message: 'Bid successful' });
    
  } catch (err) {
    console.error('Error placing bid:', err);
    // TRẢ VỀ JSON THAY VÌ TEXT
    res.status(500).json({ 
      success: false, 
      message: 'Error placing bid: ' + err.message 
    });
  }
});

// serve admin page route
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'admin.html'));
});

// ========== SOCKET.IO ==========

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // GỬI THỜI GIAN HIỆN TẠI CHO CLIENT MỚI KẾT NỐI
  socket.emit('auctionTimeUpdated', auctionTimes);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// ========== API XUẤT EXCEL ==========

// API: Xuất thống kê sản phẩm ra Excel
app.get('/api/export-excel', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM Product ORDER BY MaProduct');
    
    // Chuẩn bị dữ liệu cho Excel
    const excelData = result.recordset.map(p => ({
      'Mã sản phẩm': p.MaProduct,
      'Tên sản phẩm': p.TenProduct,
      'Giá khởi điểm': p.GiaKhoiDiem,
      'Giá hiện tại': p.GiaHienTai || p.GiaKhoiDiem,
      'Người đấu giá': p.TenNguoiDauGia || 'Chưa có',
      'Hình ảnh': p.HinhAnh || '',
      'Mô tả': p.MoTa || '',
      'Ghi chú': p.GhiChu || ''
    }));
    
    // Tạo workbook và worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    
    // Tự động điều chỉnh độ rộng cột
    const colWidths = [
      { wch: 12 },  // Mã sản phẩm
      { wch: 30 },  // Tên sản phẩm
      { wch: 15 },  // Giá khởi điểm
      { wch: 15 },  // Giá hiện tại
      { wch: 25 },  // Người đấu giá
      { wch: 40 },  // Hình ảnh
      { wch: 40 },  // Mô tả
      { wch: 30 }   // Ghi chú
    ];
    ws['!cols'] = colWidths;
    
    // Thêm worksheet vào workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Danh sách sản phẩm');
    
    // Tạo buffer từ workbook
    const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    
    // Tạo tên file với timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `ThongKe_DauGia_${timestamp}.xlsx`;
    
    // Gửi file về client
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(excelBuffer);
    
  } catch (err) {
    console.error('Error exporting Excel:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi khi xuất file Excel: ' + err.message 
    });
  }
});

// ... rest of code ...
