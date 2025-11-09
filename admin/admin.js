// ========== QUẢN LÝ THỜI GIAN ĐẤU GIÁ ==========

// Load thời gian từ server
async function loadCurrentTime() {
  try {
    const res = await fetch('/api/auction-time');
    
    // Kiểm tra response có phải JSON không
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Response is not JSON:', await res.text());
      return;
    }
    
    const data = await res.json();
    
    // Kiểm tra phần tử tồn tại trước khi cập nhật
    const currentStartTimeEl = document.getElementById('currentStartTime');
    const currentEndTimeEl = document.getElementById('currentEndTime');
    
    if (data.startTime) {
      if (currentStartTimeEl) {
        currentStartTimeEl.textContent = formatDateTime(data.startTime);
      }
      const startInput = document.getElementById('startTime');
      if (startInput) {
        startInput.value = data.startTime.replace(' ', 'T').substring(0, 16);
      }
    } else {
      if (currentStartTimeEl) {
        currentStartTimeEl.textContent = 'Chưa thiết lập';
      }
    }
    
    if (data.endTime) {
      if (currentEndTimeEl) {
        currentEndTimeEl.textContent = formatDateTime(data.endTime);
      }
      const endInput = document.getElementById('endTime');
      if (endInput) {
        endInput.value = data.endTime.replace(' ', 'T').substring(0, 16);
      }
    } else {
      if (currentEndTimeEl) {
        currentEndTimeEl.textContent = 'Chưa thiết lập';
      }
    }
    
    updateAuctionStatus(data.startTime, data.endTime);
  } catch (err) {
    console.error('Error loading auction time:', err);
  }
}

// Format datetime để hiển thị
function formatDateTime(dateTimeStr) {
  if (!dateTimeStr) return 'Chưa thiết lập';
  const date = new Date(dateTimeStr);
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

// Cập nhật trạng thái đấu giá
function updateAuctionStatus(startTime, endTime) {
  const statusEl = document.getElementById('auctionStatus');
  
  if (!statusEl) {
    console.warn('Element auctionStatus not found');
    return;
  }
  
  if (!startTime || !endTime) {
    statusEl.textContent = 'Chưa thiết lập';
    statusEl.className = 'status-badge';
    return;
  }
  
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  if (now < start) {
    statusEl.textContent = 'Chưa bắt đầu';
    statusEl.className = 'status-badge status-upcoming';
  } else if (now >= start && now <= end) {
    statusEl.textContent = 'Đang diễn ra';
    statusEl.className = 'status-badge status-active';
  } else {
    statusEl.textContent = 'Đã kết thúc';
    statusEl.className = 'status-badge status-ended';
  }
}

// Lưu thời gian đấu giá
function saveAuctionTime() {
  const startTimeInput = document.getElementById('startTime');
  const endTimeInput = document.getElementById('endTime');
  
  if (!startTimeInput || !endTimeInput) {
    alert('⚠️ Không tìm thấy input thời gian!');
    return;
  }
  
  const startTime = startTimeInput.value;
  const endTime = endTimeInput.value;
  
  if (!startTime || !endTime) {
    alert('⚠️ Vui lòng nhập đầy đủ thời gian bắt đầu và kết thúc!');
    return;
  }
  
  if (new Date(startTime) >= new Date(endTime)) {
    alert('⚠️ Thời gian bắt đầu phải trước thời gian kết thúc!');
    return;
  }
  
  // Gửi dữ liệu lên server
  fetch('/api/auction-time', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      startTime: startTime,
      endTime: endTime
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert('✅ Đã lưu thời gian đấu giá thành công!');
      loadCurrentTime();
    } else {
      alert('❌ Lỗi khi lưu thời gian đấu giá!');
    }
  })
  .catch(err => {
    console.error('Error saving auction time:', err);
    alert('❌ Lỗi khi lưu thời gian đấu giá!');
  });
}

// Reset thời gian về mặc định
function resetAuctionTime() {
  if (!confirm('Bạn có chắc muốn reset thời gian về mặc định?')) {
    return;
  }
  
  // Gửi yêu cầu reset lên server
  fetch('/api/auction-time/reset', {
    method: 'POST'
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert('✅ Đã reset thời gian về mặc định!');
      loadCurrentTime();
    } else {
      alert('❌ Lỗi khi reset thời gian đấu giá!');
    }
  })
  .catch(err => {
    console.error('Error resetting auction time:', err);
    alert('❌ Lỗi khi reset thời gian đấu giá!');
  });
}

// ========== QUẢN LÝ SẢN PHẨM ==========

// Load danh sách sản phẩm
async function loadProducts() {
  try {
    const res = await fetch('/api/products');
    const data = await res.json();
    const tbody = document.querySelector('#tbl tbody');
    
    if (!tbody) {
      console.error('Table body not found');
      return;
    }
    
    tbody.innerHTML = '';
    
    data.forEach(p => {
      const tr = document.createElement('tr');
      
      // Lấy ảnh đầu tiên
      let firstImg = '/uploads/placeholder.png';
      if (p.HinhAnh) {
        if (p.HinhAnh.includes(',')) {
          firstImg = p.HinhAnh.split(',')[0].trim();
        } else {
          firstImg = p.HinhAnh;
        }
      }
      
      const giaHienTai = p.GiaHienTai != null ? Number(p.GiaHienTai).toLocaleString() : 'Chưa có';
      const nguoiDauGia = p.TenNguoiDauGia || 'Chưa có';
      
      tr.innerHTML = `
        <td>${p.MaProduct}</td>
        <td>${p.TenProduct}</td>
        <td>${Number(p.GiaKhoiDiem).toLocaleString()}</td>
        <td>${giaHienTai}</td>
        <td>${nguoiDauGia}</td>
        <td><img src="${firstImg}" alt="${p.TenProduct}"></td>
        <td>
          <button class="edit-btn" data-id="${p.MaProduct}">✏️ Sửa</button>
          <button class="delete-btn" data-id="${p.MaProduct}">🗑️ Xóa</button>
        </td>
      `;
      
      tbody.appendChild(tr);
    });
    
    // Gán sự kiện cho nút Sửa và Xóa
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', openEditModal);
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', deleteProduct);
    });
    
  } catch (err) {
    console.error('Error loading products:', err);
    alert('Lỗi khi tải danh sách sản phẩm!');
  }
}

// Thêm sản phẩm mới
function initAddProductForm() {
  const formAdd = document.getElementById('formAdd');
  if (!formAdd) {
    console.warn('Form add not found');
    return;
  }
  
  formAdd.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        body: formData
      });
      
      const result = await res.json();
      
      if (res.ok) {
        alert('✅ Thêm sản phẩm thành công!');
        this.reset();
        loadProducts();
      } else {
        alert('❌ Lỗi: ' + (result.message || 'Không thể thêm sản phẩm'));
      }
    } catch (err) {
      console.error('Error adding product:', err);
      alert('❌ Lỗi khi thêm sản phẩm!');
    }
  });
}

// Mở modal sửa sản phẩm
async function openEditModal(e) {
  const id = e.currentTarget.dataset.id;
  const modal = document.getElementById('editModal');
  
  if (!modal) {
    console.error('Edit modal not found');
    return;
  }
  
  try {
    const res = await fetch(`/api/products/${id}`);
    const product = await res.json();
    
    const editId = document.getElementById('editId');
    const editTen = document.getElementById('editTen');
    const editGiaKhoiDiem = document.getElementById('editGiaKhoiDiem');
    const editGiaHienTai = document.getElementById('editGiaHienTai');
    const editTenNguoiDauGia = document.getElementById('editTenNguoiDauGia');
    const editMoTa = document.getElementById('editMoTa');
    
    if (editId) editId.value = product.MaProduct;
    if (editTen) editTen.value = product.TenProduct;
    if (editGiaKhoiDiem) editGiaKhoiDiem.value = product.GiaKhoiDiem;
    if (editMoTa) editMoTa.value = product.MoTa || '';
    
    // Hiển thị giá hiện tại nếu có
    if (editGiaHienTai) {
      editGiaHienTai.value = product.GiaHienTai != null ? product.GiaHienTai : '';
    }
    
    // Hiển thị tên người đấu giá nếu có
    if (editTenNguoiDauGia) {
      editTenNguoiDauGia.value = product.TenNguoiDauGia || '';
    }
    
    // Hiển thị ảnh
    const imgSlider = document.getElementById('editImgSlider');
    const editImg = document.getElementById('editImg');
    
    if (imgSlider && editImg) {
      imgSlider.innerHTML = '';
      
      if (product.HinhAnh) {
        const images = product.HinhAnh.split(',').map(img => img.trim());
        
        // Hiển thị ảnh đầu tiên
        editImg.src = images[0];
        
        // Hiển thị slider nếu có nhiều ảnh
        if (images.length > 1) {
          images.forEach((img, index) => {
            const imgEl = document.createElement('img');
            imgEl.src = img;
            imgEl.className = index === 0 ? 'active' : '';
            imgEl.addEventListener('click', function() {
              editImg.src = img;
              imgSlider.querySelectorAll('img').forEach(i => i.classList.remove('active'));
              this.classList.add('active');
            });
            imgSlider.appendChild(imgEl);
          });
        }
      }
    }
    
    modal.style.display = 'flex';
    
  } catch (err) {
    console.error('Error loading product:', err);
    alert('❌ Lỗi khi tải thông tin sản phẩm!');
  }
}

// Đóng modal sửa
function initEditModalClose() {
  const editCloseBtn = document.getElementById('editClose');
  const editModal = document.getElementById('editModal');
  
  if (editCloseBtn && editModal) {
    editCloseBtn.addEventListener('click', function() {
      editModal.style.display = 'none';
    });
  }
}

// Lưu chỉnh sửa sản phẩm
function initEditProductForm() {
  const formEdit = document.getElementById('formEdit');
  if (!formEdit) {
    console.warn('Form edit not found');
    return;
  }
  
  formEdit.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const editIdEl = document.getElementById('editId');
    const editTenEl = document.getElementById('editTen');
    const editGiaKhoiDiemEl = document.getElementById('editGiaKhoiDiem');
    const editGiaHienTaiEl = document.getElementById('editGiaHienTai');
    const editTenNguoiDauGiaEl = document.getElementById('editTenNguoiDauGia');
    const editMoTaEl = document.getElementById('editMoTa');
    const editHinhAnhEl = document.getElementById('editHinhAnh');
    
    // Kiểm tra các phần tử bắt buộc
    if (!editIdEl || !editTenEl || !editGiaKhoiDiemEl) {
      alert('❌ Thiếu thông tin sản phẩm!');
      return;
    }
    
    const id = editIdEl.value;
    const formData = new FormData();
    
    formData.append('tenProduct', editTenEl.value);
    formData.append('giaKhoiDiem', editGiaKhoiDiemEl.value);
    formData.append('moTa', editMoTaEl ? editMoTaEl.value : '');
    
    // Thêm giá hiện tại nếu có giá trị
    if (editGiaHienTaiEl && editGiaHienTaiEl.value.trim() !== '') {
      const giaHienTai = parseFloat(editGiaHienTaiEl.value);
      const giaKhoiDiem = parseFloat(editGiaKhoiDiemEl.value);
      
      // Kiểm tra giá hiện tại phải >= giá khởi điểm
      if (giaHienTai < giaKhoiDiem) {
        alert('⚠️ Giá hiện tại phải lớn hơn hoặc bằng giá khởi điểm!');
        return;
      }
      
      formData.append('giaHienTai', giaHienTai);
    }
    
    // Thêm tên người đấu giá nếu có
    if (editTenNguoiDauGiaEl && editTenNguoiDauGiaEl.value.trim() !== '') {
      formData.append('tenNguoiDauGia', editTenNguoiDauGiaEl.value.trim());
    }
    
    // Thêm file ảnh mới nếu có
    if (editHinhAnhEl && editHinhAnhEl.files && editHinhAnhEl.files.length > 0) {
      const files = editHinhAnhEl.files;
      console.log(`Uploading ${files.length} new image(s)`);
      for (let i = 0; i < files.length; i++) {
        formData.append('hinhAnh', files[i]);
      }
    }
    
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        body: formData
      });
      
      const result = await res.json();
      
      if (res.ok) {
        alert('✅ Cập nhật sản phẩm thành công!');
        const editModal = document.getElementById('editModal');
        if (editModal) {
          editModal.style.display = 'none';
        }
        // Reset form để xóa file input
        formEdit.reset();
        loadProducts();
      } else {
        alert('❌ Lỗi: ' + (result.message || 'Không thể cập nhật sản phẩm'));
      }
    } catch (err) {
      console.error('Error updating product:', err);
      alert('❌ Lỗi khi cập nhật sản phẩm!');
    }
  });
}

// Xóa sản phẩm
async function deleteProduct(e) {
  const id = e.currentTarget.dataset.id;
  
  if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
    return;
  }
  
  try {
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE'
    });
    
    const result = await res.json();
    
    if (res.ok) {
      alert('✅ Xóa sản phẩm thành công!');
      loadProducts();
    } else {
      alert('❌ Lỗi: ' + (result.message || 'Không thể xóa sản phẩm'));
    }
  } catch (err) {
    console.error('Error deleting product:', err);
    alert('❌ Lỗi khi xóa sản phẩm!');
  }
}

// ========== KHỞI TẠO KHI TRANG LOAD ==========

document.addEventListener('DOMContentLoaded', function() {
  // Load thời gian đấu giá
  loadCurrentTime();
  
  // Load danh sách sản phẩm
  loadProducts();
  
  // Cập nhật trạng thái mỗi phút
  setInterval(() => {
    loadCurrentTime(); // Gọi lại để cập nhật trạng thái
  }, 60000);
  
  // Gán sự kiện cho các nút
  const saveBtn = document.getElementById('saveTimeBtn');
  if (saveBtn) saveBtn.addEventListener('click', saveAuctionTime);
  
  const resetBtn = document.getElementById('resetTimeBtn');
  if (resetBtn) resetBtn.addEventListener('click', resetAuctionTime);
  
  // Khởi tạo form thêm sản phẩm
  initAddProductForm();
  
  // Khởi tạo form sửa sản phẩm
  initEditProductForm();
  
  // Khởi tạo nút đóng modal
  initEditModalClose();
});

// ========== SOCKET.IO - CẬP NHẬT REAL-TIME ==========

const socket = io();

// Lắng nghe sự kiện thay đổi sản phẩm
socket.on('productsChanged', function() {
  loadProducts();
});

// Lắng nghe sự kiện đấu giá mới
socket.on('newBid', function(data) {
  loadProducts();
  console.log('New bid received:', data);
});

// Lắng nghe sự kiện cập nhật thời gian đấu giá
socket.on('auctionTimeUpdated', function(data) {
  console.log('Auction time updated:', data);
  loadCurrentTime();
});

// ========== XỬ LÝ XUẤT EXCEL ==========

// Xuất Excel cơ bản
document.getElementById('exportExcelBtn').addEventListener('click', async () => {
  try {
    const response = await fetch('/api/export-excel');
    
    if (!response.ok) {
      throw new Error('Lỗi khi xuất file Excel');
    }
    
    // Lấy tên file từ header
    const contentDisposition = response.headers.get('Content-Disposition');
    let filename = 'ThongKe_DauGia.xlsx';
    if (contentDisposition) {
      const matches = /filename="(.+)"/.exec(contentDisposition);
      if (matches && matches[1]) {
        filename = matches[1];
      }
    }
    
    // Tải file
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    alert('✅ Xuất file Excel thành công!');
  } catch (err) {
    console.error('Error exporting Excel:', err);
    alert('❌ Lỗi khi xuất file Excel: ' + err.message);
  }
});
