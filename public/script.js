// load products
async function loadProducts(){
  const res = await fetch('/api/products');
  const data = await res.json();
  const sec = document.getElementById('products');
  sec.innerHTML = '';
  let total = 0;
  
  // Lấy thời gian từ API thay vì localStorage
  let endTimeStr = localStorage.getItem('auctionEndTime');
  let endTime = null;
  let isAuctionEnded = false;
  
  if (endTimeStr) {
    endTime = new Date(endTimeStr.replace(' ', 'T'));
    const now = new Date();
    isAuctionEnded = now >= endTime;
  }
  
  data.forEach(p => {
    // Tính tổng từ GiaHienTai nếu có, nếu không thì dùng GiaKhoiDiem
    if (p.GiaHienTai != null && p.GiaHienTai > 0) {
      total += Number(p.GiaHienTai);
    } else {
      total += Number(p.GiaKhoiDiem);
    }
    
    const bidder = p.TenNguoiDauGia || 'Chưa có người đấu giá';
    const div = document.createElement('div');
    div.className = 'card';
    
    // Lấy ảnh đầu tiên nếu có nhiều ảnh
    let firstImg = '/uploads/placeholder.png';
    if (p.HinhAnh) {
      if (p.HinhAnh.includes(',')) {
        firstImg = p.HinhAnh.split(',')[0].trim();
      } else {
        firstImg = p.HinhAnh;
      }
    }
    
    // Hiển thị giá hiện tại: nếu có GiaHienTai thì dùng, nếu không thì dùng Giá khởi điểm
    let hienTaiText = Number(p.GiaKhoiDiem).toLocaleString();
    if (p.GiaHienTai != null && p.GiaHienTai > 0) {
      hienTaiText = Number(p.GiaHienTai).toLocaleString();
    }
    
    div.innerHTML = `
      <img src="${firstImg}">
      <h3>${p.TenProduct}</h3>
      <p>Giá khởi điểm: ${Number(p.GiaKhoiDiem).toLocaleString()}</p>
      <p>Giá hiện tại: <strong>${hienTaiText}</strong></p>
      <p>Người đấu giá mới nhất: ${bidder}</p>

      <div class="card-buttons">
        <button class="bidBtn"
                data-id="${p.MaProduct}"
                data-name="${p.TenProduct}"
                data-start="${p.GiaKhoiDiem}"
                data-current="${p.GiaHienTai || p.GiaKhoiDiem}"
                ${isAuctionEnded ? 'disabled title="Đã hết thời gian đấu giá"' : ''}>
          Đấu giá
        </button>
        <button class="detailBtn"
                data-id="${p.MaProduct}"
                data-name="${p.TenProduct}">
          Chi tiết
        </button>
      </div>
    `;

    sec.appendChild(div);
  });

  // Hiển thị tổng Giá Hiện tại với format đẹp hơn
  const totalPriceEl = document.getElementById('totalPrice');
  if (totalPriceEl) {
    totalPriceEl.innerHTML = `💰 <strong>Tổng Giá Hiện Tại: ${total.toLocaleString()} VNĐ</strong>`;
  }

  // gán sự kiện cho nút
  document.querySelectorAll('.bidBtn').forEach(b => {
    if (isAuctionEnded) {
      b.disabled = true;
      b.classList.add('disabled-bid-btn');
      b.style.opacity = '0.5';
      b.style.pointerEvents = 'none';
    }
    b.addEventListener('click', openBid);
  });
  document.querySelectorAll('.detailBtn').forEach(b => b.addEventListener('click', openDetail));
}

// Hàm load thời gian từ server
async function loadAuctionTime() {
  try {
    const res = await fetch('/api/auction-time');
    const data = await res.json();
    
    if (data.endTime) {
      localStorage.setItem('auctionEndTime', data.endTime);
      console.log('Loaded auction time from server:', data);
      
      // Cập nhật countdown timer
      updateCountdownTimer(data.endTime);
    } else {
      console.log('No auction time set on server');
      // Ẩn countdown nếu chưa set thời gian
      const countdownEl = document.getElementById('countdownTimer');
      if (countdownEl) {
        countdownEl.style.display = 'none';
      }
    }
  } catch (err) {
    console.error('Error loading auction time:', err);
  }
}

// Hàm cập nhật countdown timer
function updateCountdownTimer(endTimeStr) {
  if (!endTimeStr) return;
  
  const endTime = new Date(endTimeStr.replace(' ', 'T'));
  const countdownEl = document.getElementById('countdownTimer');
  const cdDays = document.getElementById('cdDays');
  const cdHours = document.getElementById('cdHours');
  const cdMinutes = document.getElementById('cdMinutes');
  const cdSeconds = document.getElementById('cdSeconds');
  
  if (!countdownEl || !cdDays || !cdHours || !cdMinutes || !cdSeconds) return;
  
  // Hiển thị countdown
  countdownEl.style.display = 'flex';
  
  function pad2(n) { return n < 10 ? '0' + n : n; }
  
  function update() {
    const now = new Date();
    let remainingSeconds = Math.floor((endTime - now) / 1000);
    
    if (remainingSeconds < 0) remainingSeconds = 0;
    
    const days = Math.floor(remainingSeconds / 86400);
    const hours = Math.floor((remainingSeconds % 86400) / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    const seconds = remainingSeconds % 60;
    
    cdDays.textContent = pad2(days);
    cdHours.textContent = pad2(hours);
    cdMinutes.textContent = pad2(minutes);
    cdSeconds.textContent = pad2(seconds);
    
    // Hiệu ứng rung khi còn dưới 10 giây
    [cdDays, cdHours, cdMinutes, cdSeconds].forEach(el => el.classList.remove('countdown-urgent'));
    if (remainingSeconds > 0 && remainingSeconds <= 10) {
      cdSeconds.classList.add('countdown-urgent');
    }
    
    // Hết giờ
    if (remainingSeconds === 0) {
      [cdDays, cdHours, cdMinutes, cdSeconds].forEach(el => {
        el.classList.add('countdown-ended');
        el.classList.remove('countdown-urgent');
      });
      
      // Disable tất cả nút đấu giá
      document.querySelectorAll('.bidBtn').forEach(btn => {
        btn.disabled = true;
        btn.classList.add('disabled-bid-btn');
        btn.style.opacity = '0.5';
        btn.style.pointerEvents = 'none';
      });
      
      clearInterval(window._countdownInterval);
    }
  }
  
  // Clear interval cũ nếu có
  if (window._countdownInterval) {
    clearInterval(window._countdownInterval);
  }
  
  // Cập nhật ngay lập tức
  update();
  
  // Cập nhật mỗi giây
  window._countdownInterval = setInterval(update, 1000);
}

function openBid(e){
  const btn = e.currentTarget;
  // Nếu nút đã bị disable thì không mở modal
  if (btn.disabled) return;
  
  // Kiểm tra thời gian đấu giá
  const endTimeStr = localStorage.getItem('auctionEndTime') || '2025-11-04T23:59:59';
  const endTime = new Date(endTimeStr.replace(' ', 'T'));
  const now = new Date();
  
  if (now >= endTime) {
    alert('Đã hết thời gian đấu giá!');
    btn.disabled = true;
    btn.classList.add('disabled-bid-btn');
    btn.style.opacity = '0.5';
    btn.style.pointerEvents = 'none';
    return;
  }
  
  const id = btn.dataset.id;
  const tenProduct = btn.dataset.name; // Lấy tên sản phẩm từ data-name
  const current = parseFloat(btn.dataset.current);
  const start = parseFloat(btn.dataset.start);
  const modal = document.getElementById('bidModal');

  modal.style.display = 'block';
  modal.dataset.id = id;
  modal.dataset.current = current;
  modal.dataset.start = start;

  // Hiển thị tên sản phẩm thay vì mã
  document.getElementById('modalTitle').textContent = 'Đấu giá sản phẩm: ' + tenProduct;

  document.getElementById('bidName').value='';
  document.getElementById('bidAmount').value='';
}


document.getElementById('bidCancel').onclick = ()=> {
  document.getElementById('bidModal').style.display = 'none';
};

document.getElementById('bidOk').onclick = async () => {
  const modal = document.getElementById('bidModal');
  const id = modal.dataset.id;
  const name = document.getElementById('bidName').value.trim();
  const amount = parseFloat(document.getElementById('bidAmount').value);
  
  if(!name || !amount){ 
    alert('Nhập tên và số tiền'); 
    return; 
  }
  
  const current = parseFloat(modal.dataset.current) || parseFloat(modal.dataset.start);
  if(amount <= current){ 
    alert('Số tiền phải lớn hơn giá hiện tại'); 
    return; 
  }

  try {
    const res = await fetch('/api/bid', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ 
        maProduct: id, 
        tenNguoiDauGia: name, 
        giaHienTai: amount 
      })
    });
    
    const r = await res.json();
    
    if (r.success) {
      alert('✅ Đấu giá thành công!');
      document.getElementById('bidModal').style.display = 'none';
      // Reload lại danh sách sản phẩm và tổng giá
      await loadProducts();
    } else {
      alert('❌ ' + (r.message || 'Lỗi đấu giá'));
    }
  } catch (err) {
    console.error('Error bidding:', err);
    alert('❌ Lỗi khi đấu giá!');
  }
};

// ✅ Hàm format thời gian Việt Nam - FIXED
function formatVietnameseDateTime(dateStr) {
  if (!dateStr) return '-';
  
  console.log('DEBUG formatVietnameseDateTime input:', dateStr);
  
  try {
    // SQL Server trả về: "2025-11-09 21:45:25" (đã là giờ local VN)
    // Parse trực tiếp từ string thay vì dùng Date() để tránh timezone conversion
    
    const parts = dateStr.split(/[\s-:]/); // Split by space, dash, colon
    console.log('DEBUG parts:', parts);
    
    if (parts.length >= 6) {
      // parts: [year, month, day, hour, minute, second]
      const year = parts[0];
      const month = parts[1].padStart(2, '0');
      const day = parts[2].padStart(2, '0');
      const hours = parts[3].padStart(2, '0');
      const minutes = parts[4].padStart(2, '0');
      const seconds = parts[5].padStart(2, '0');
      
      const result = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
      console.log('DEBUG result:', result);
      return result;
    }
    
    // Fallback: nếu format khác, parse như cũ
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', dateStr);
      return dateStr;
    }
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  } catch (err) {
    console.error('Error formatting date:', err, 'Input:', dateStr);
    return dateStr;
  }
}

// Cập nhật hàm openDetail - phần hiển thị lịch sử đấu giá
function openDetail(e){
  const btn = e.currentTarget;
  const id = btn.dataset.id;
  const modal = document.getElementById('detailModal');
  modal.style.display = 'block';

  const tbody = document.querySelector('#detailTable tbody');
  tbody.innerHTML = '';

  // reset info
  document.getElementById('detailImg').src = '';
  document.getElementById('detailTen').textContent = '';
  document.getElementById('detailGiaKhoiDiem').textContent = '';
  document.getElementById('detailGiaHienTai').textContent = '';
  document.getElementById('detailMoTa').textContent = '';
  document.getElementById('detailImgSlider').innerHTML = '';

  fetch(`/api/bid-detail/${id}`)
    .then(async res => {
      if (!res.ok) {
        const text = await res.text();
        throw new Error('API error: ' + res.status + ' ' + text);
      }
      return res.json();
    })
    .then(data => {
      document.getElementById('modalAuctionTitleText').className = 'modal-auction-title modal-auction-title-black';
      if(!data || !data.product){
        document.getElementById('modalAuctionProductName').textContent = '';
        tbody.innerHTML = `<tr><td colspan="3">Không tìm thấy sản phẩm</td></tr>`;
        document.getElementById('detailTen').textContent = '';
        document.getElementById('detailGiaKhoiDiem').textContent = '';
        document.getElementById('detailGiaHienTai').textContent = '';
        document.getElementById('detailMoTa').textContent = '';
        document.getElementById('detailImg').src = '/uploads/placeholder.png';
        document.getElementById('detailImgSlider').innerHTML = '';
        return;
      }
      const p = data.product;
      document.getElementById('modalAuctionProductName').textContent = p.TenProduct || '';
      
      // Hỗ trợ nhiều ảnh
      let imgs = [];
      if (p.HinhAnh && p.HinhAnh.includes(',')) {
        imgs = p.HinhAnh.split(',').map(s => s.trim()).filter(Boolean);
      } else if (p.HinhAnh) {
        imgs = [p.HinhAnh];
      } else {
        imgs = ['/uploads/placeholder.png'];
      }
      
      let currentImg = 0;
      function showImg(idx) {
        const moTaEl = document.getElementById('detailMoTa');
        moTaEl.innerHTML = (p.MoTa || '').replace(/\n/g, '<br>');
        moTaEl.style.fontFamily = document.getElementById('detailTen').style.fontFamily;
        moTaEl.style.fontSize = document.getElementById('detailTen').style.fontSize;
        moTaEl.style.fontWeight = document.getElementById('detailTen').style.fontWeight;
        document.getElementById('detailGiaKhoiDiem').textContent = p.GiaKhoiDiem != null ? Number(p.GiaKhoiDiem).toLocaleString() : '';
        document.getElementById('detailGiaHienTai').textContent = p.GiaHienTai != null ? Number(p.GiaHienTai).toLocaleString() : '';
        
        const imgEl = document.getElementById('detailImg');
        imgEl.onerror = function() {
          this.onerror = null;
          this.src = '/uploads/placeholder.png';
        };
        imgEl.onload = function() {
          this.style.display = 'block';
        };
        imgEl.src = imgs[idx] || '/uploads/placeholder.png';
        
        // Sự kiện click để phóng to ảnh
        imgEl.onclick = function() {
          if (this.src && !this.src.includes('placeholder.png')) {
            openImageZoom(this.src, imgs, idx);
          }
        };
        
        // highlight thumb
        document.querySelectorAll('#detailImgSlider img').forEach((el,i)=>{
          el.classList.toggle('active',i===idx);
        });
      }
      
      // render slider
      const slider = document.getElementById('detailImgSlider');
      slider.innerHTML = '';
      imgs.forEach((src,i)=>{
        const im = document.createElement('img');
        im.src = src;
        im.onclick = ()=>{ currentImg=i; showImg(i); };
        if(i===0) im.classList.add('active');
        slider.appendChild(im);
      });
      showImg(0);

      document.getElementById('detailTen').textContent = p.TenProduct || '';

      const bids = data.bids || [];
      if(bids.length === 0){
        tbody.innerHTML = `<tr><td colspan="3">Chưa có lượt đấu giá nào</td></tr>`;
      } else {
        bids.forEach(d => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${d.TenNguoiDauGia || '-'}</td>
            <td>${d.GiaHienTai != null ? Number(d.GiaHienTai).toLocaleString() : '-'}</td>
            <td>${formatVietnameseDateTime(d.CreatedAt)}</td>
          `;
          tbody.appendChild(tr);
        });
      }
    })
    .catch(err => {
  alert('Lỗi khi tải chi tiết sản phẩm: ' + err);
  console.error('Chi tiết lỗi:', err);
      document.getElementById('modalAuctionTitleText').className = 'modal-auction-title modal-auction-title-black';
      document.getElementById('modalAuctionProductName').textContent = '';
      tbody.innerHTML = `<tr><td colspan="3">Lỗi khi tải dữ liệu</td></tr>`;
    });
}

// đóng modal chi tiết
document.getElementById('detailClose').onclick = () => {
  document.getElementById('detailModal').style.display = 'none';
};

// Hiển thị modal Sửa
function openEditModal() {
  document.getElementById('editModal').style.display = 'flex';
}

// Ẩn modal Sửa
function closeEditModal() {
  document.getElementById('editModal').style.display = 'none';
}

// Gắn sự kiện cho các nút Sửa (class edit-btn) nếu có
const editBtns = document.querySelectorAll('.edit-btn');
if (editBtns && editBtns.length > 0) {
  editBtns.forEach(btn => {
    btn.addEventListener('click', openEditModal);
  });
}

// Gắn sự kiện cho nút đóng trong modal nếu có
const closeEditBtn = document.querySelector('#editModal .detail-close-btn');
if (closeEditBtn) {
  closeEditBtn.addEventListener('click', closeEditModal);
}

// --- SOCKET.IO ---
const script = document.createElement('script');
script.src = '/socket.io.js';
script.onload = () => {
  const socket = window.io();
  
  // Lắng nghe thay đổi sản phẩm
  socket.on('productsChanged', () => {
    console.log('Products changed, reloading...');
    loadProducts();
  });
  
  // Lắng nghe đấu giá mới
  socket.on('newBid', (data) => {
    console.log('New bid received:', data);
    loadProducts();
  });
  
  // Lắng nghe cập nhật thời gian đấu giá
  socket.on('auctionTimeUpdated', (data) => {
    console.log('Auction time updated:', data);
    
    if (data.endTime) {
      localStorage.setItem('auctionEndTime', data.endTime);
      
      // Cập nhật countdown timer
      updateCountdownTimer(data.endTime);
      
      // Reload products để cập nhật trạng thái nút
      loadProducts();
    } else {
      // Reset nếu admin xóa thời gian
      localStorage.removeItem('auctionEndTime');
      const countdownEl = document.getElementById('countdownTimer');
      if (countdownEl) {
        countdownEl.style.display = 'none';
      }
      if (window._countdownInterval) {
        clearInterval(window._countdownInterval);
      }
      loadProducts();
    }
  });
  
  console.log('Socket.IO connected');
};
document.head.appendChild(script);

// Load dữ liệu khi trang load
window.onload = async () => {
  await loadAuctionTime(); // Load thời gian trước
  await loadProducts();     // Sau đó load sản phẩm
};

// Hàm mở ảnh phóng to
function openImageZoom(src) {
  // Tạo overlay
  const overlay = document.createElement('div');
  overlay.id = 'imageZoomOverlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    cursor: pointer;
  `;
  
  // Tạo ảnh phóng to
  const zoomImg = document.createElement('img');
  zoomImg.src = src;
  zoomImg.style.cssText = `
    max-width: 90%;
    max-height: 90%;
    object-fit: contain;
    cursor: zoom-out;
  `;
  
  // Thêm sự kiện click ra ngoài để đóng
  overlay.onclick = function(e) {
    if (e.target === this) {
      closeImageZoom();
    }
  };
  
  // Thêm sự kiện ESC để đóng
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeImageZoom();
    }
  });
  
  // Thêm sự kiện click vào ảnh để đóng
  zoomImg.onclick = closeImageZoom;
  
  overlay.appendChild(zoomImg);
  document.body.appendChild(overlay);
}

// Hàm đóng ảnh phóng to
function closeImageZoom() {
  const overlay = document.getElementById('imageZoomOverlay');
  if (overlay) {
    overlay.remove();
    document.removeEventListener('keydown', closeImageZoom);
  }
}


// ========== PHÓNG TO ẢNH VỚI ĐIỀU HƯỚNG ==========

// Biến lưu trữ danh sách ảnh và index hiện tại
let zoomImages = [];
let currentZoomIndex = 0;

// Khởi tạo overlay phóng to ảnh
function initImageZoom() {
  const overlay = document.getElementById('imageZoomOverlay');
  const zoomedImage = document.getElementById('zoomedImage');
  const closeBtn = document.querySelector('.zoom-close');
  const prevBtn = document.getElementById('zoomPrev');
  const nextBtn = document.getElementById('zoomNext');
  const counter = document.getElementById('zoomCounter');
  
  if (!overlay || !zoomedImage || !closeBtn || !prevBtn || !nextBtn || !counter) {
    console.warn('Image zoom elements not found');
    return;
  }
  
  // Hàm cập nhật hiển thị ảnh
  function updateZoomImage() {
    if (zoomImages.length === 0) return;
    
    zoomedImage.src = zoomImages[currentZoomIndex];
    counter.textContent = `${currentZoomIndex + 1} / ${zoomImages.length}`;
    
    // Disable/enable nút prev/next
    prevBtn.disabled = currentZoomIndex === 0;
    nextBtn.disabled = currentZoomIndex === zoomImages.length - 1;
    
    // Ẩn nút nếu chỉ có 1 ảnh
    if (zoomImages.length <= 1) {
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
      counter.style.display = 'none';
    } else {
      prevBtn.style.display = 'block';
      nextBtn.style.display = 'block';
      counter.style.display = 'block';
    }
  }
  
  // Hàm mở overlay phóng to với danh sách ảnh
  window.openImageZoom = function(imageSrc, allImages = null, startIndex = 0) {
    // Nếu có danh sách ảnh, sử dụng nó; nếu không, chỉ hiển thị 1 ảnh
    if (allImages && Array.isArray(allImages) && allImages.length > 0) {
      zoomImages = allImages.filter(img => img && !img.includes('placeholder.png'));
    } else {
      zoomImages = [imageSrc];
    }
    
    // Tìm index của ảnh hiện tại trong danh sách
    currentZoomIndex = zoomImages.indexOf(imageSrc);
    if (currentZoomIndex === -1) {
      currentZoomIndex = startIndex || 0;
    }
    
    updateZoomImage();
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };
  
  // Hàm đóng overlay phóng to
  function closeImageZoom() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    zoomedImage.src = '';
    zoomImages = [];
    currentZoomIndex = 0;
  }
  
  // Hàm chuyển ảnh trước
  function showPrevImage() {
    if (currentZoomIndex > 0) {
      currentZoomIndex--;
      updateZoomImage();
    }
  }
  
  // Hàm chuyển ảnh sau
  function showNextImage() {
    if (currentZoomIndex < zoomImages.length - 1) {
      currentZoomIndex++;
      updateZoomImage();
    }
  }
  
  // Click vào nút X để đóng
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeImageZoom();
  });
  
  // Click vào nút prev/next
  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showPrevImage();
  });
  
  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showNextImage();
  });
  
  // Click vào ảnh để đóng
  zoomedImage.addEventListener('click', (e) => {
    e.stopPropagation();
    closeImageZoom();
  });
  
  // Click vào overlay (nền tối) để đóng
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeImageZoom();
    }
  });
  
  // Nhấn phím để điều khiển
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('active')) return;
    
    switch(e.key) {
      case 'Escape':
        closeImageZoom();
        break;
      case 'ArrowLeft':
        showPrevImage();
        break;
      case 'ArrowRight':
        showNextImage();
        break;
    }
  });
}

// Khởi tạo khi trang load
document.addEventListener('DOMContentLoaded', () => {
  initImageZoom();
});