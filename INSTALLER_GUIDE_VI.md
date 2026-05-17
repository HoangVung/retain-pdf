# Hướng Dẫn Cài Đặt RetainPDF - Windows Installer

## 📋 Yêu Cầu

### Phần Mềm Bắt Buộc:
1. **Node.js** (phiên bản 16 hoặc cao hơn)
   - Tải từ: https://nodejs.org/
   - Sau khi cài đặt, kiểm tra: `node --version` và `npm --version`

2. **NSIS** (Nullsoft Scriptable Install System) - *Tùy chọn, nếu muốn custom installer*
   - Tải từ: https://nsis.sourceforge.io/
   - Cài đặt vào đường dẫn mặc định (C:\Program Files\NSIS)

### Phần Mềm Khuyến Khích:
- **Git** để quản lý phiên bản code
- **Visual Studio Code** để chỉnh sửa code
- **Windows 10/11** (64-bit hoặc 32-bit)

## 🚀 Cách Tạo Installer

### Cách 1: Sử Dụng Script Batch (Khuyến Khích)

Cách đơn giản nhất là chạy script batch được chuẩn bị sẵn:

```bash
# Từ thư mục gốc của dự án
build_windows_installer_vi.bat
```

Script này sẽ:
1. Kiểm tra Node.js
2. Cài đặt dependencies (npm install)
3. Xây dựng frontend (npm run prepare-app)
4. Tạo installer NSIS (.exe)
5. Mở thư mục chứa file installer

**⏱️ Thời gian dự kiến:** 5-15 phút (tùy vào tốc độ máy)

### Cách 2: Sử Dụng npm Command Trực Tiếp

Nếu bạn muốn có nhiều quyền kiểm soát hơn:

```bash
cd desktop

# Cài đặt dependencies (chỉ cần lần đầu)
npm install

# Xây dựng frontend và bundle
npm run prepare-app

# Tạo portable executable (file .exe đơn giản, không cần installer)
npm run dist:win32

# HOẶC Tạo installer NSIS (file .exe setup)
npm run dist:win32-installer
```

## 📁 Vị Trí Output

File installer sẽ được tạo ra ở:
```
desktop/win/RetainPDF-Windows-[version]-Setup.exe
```

Ví dụ: `desktop/win/RetainPDF-Windows-4.1.1-Setup.exe`

## 🎨 Giao Diện Tiếng Việt

Installer được cấu hình để hiển thị **100% tiếng Việt**:
- ✅ Tiêu đề: "Chào mừng đến với RetainPDF"
- ✅ Nút bấm: "Tiếp theo", "Quay lại", "Hoàn thành"
- ✅ Thông báo: Tất cả bằng tiếng Việt
- ✅ Các phím tắt: Gỡ cài đặt, Khởi chạy ứng dụng

## 🔧 Tùy Chỉnh Installer

Nếu muốn tùy chỉnh installer (thay đổi icon, text, v.v.), hãy chỉnh sửa file:

```
desktop/installer/RetainPDF-installer.nsi
```

Các tùy chỉnh chính:
- **Icon**: Thay đổi `build/icon.ico`
- **Văn bản**: Tìm section "LANGUAGE AND STRINGS"
- **Vị trí cài đặt mặc định**: Thay đổi `InstallDir` ở đầu file
- **Tên sản phẩm**: Thay đổi `PRODUCT_NAME`

Sau khi chỉnh sửa, chạy lại script build để tạo installer mới.

## 🖥️ Phân Phối Installer

Sau khi tạo file `.exe`, bạn có thể:

1. **Phân phối trực tiếp**: Gửi file `.exe` cho người dùng
2. **Upload lên GitHub**: Thêm vào Release section
3. **Tạo website cài đặt**: Tạo trang web để tải xuống
4. **Phân phối qua công cụ**: Sử dụng AppStore, Microsoft Store, v.v.

## ⚙️ Khắc Phục Sự Cố

### Lỗi: "Node.js is not installed"
**Giải pháp:** 
- Cài đặt Node.js từ https://nodejs.org/
- Khởi động lại Command Prompt hoặc PowerShell
- Kiểm tra: `node --version`

### Lỗi: "npm install failed"
**Giải pháp:**
```bash
cd desktop
npm cache clean --force
rm -r node_modules
npm install
```

### Lỗi: "Build failed"
**Giải pháp:**
- Đảm bảo bạn đang ở thư mục gốc của dự án
- Kiểm tra xem `npm run prepare-app` chạy thành công chưa
- Xóa thư mục build cũ: `rm -r desktop/win`
- Chạy lại script build

### Lỗi: "NSIS not found"
**Giải pháp:**
- Cài đặt NSIS từ https://nsis.sourceforge.io/
- Đảm bảo NSIS được cài đặt ở `C:\Program Files\NSIS`
- Khởi động lại Command Prompt

## 📊 Thông Tin Bản Dựng

| Thông Tin | Chi Tiết |
|-----------|---------|
| Tên ứng dụng | RetainPDF |
| Phiên bản | 4.1.1-beta6 |
| Nền tảng | Windows 32-bit/64-bit |
| Loại installer | NSIS (Modern UI) |
| Ngôn ngữ | Tiếng Việt |
| Kích thước | ~100-200 MB (tùy vào bản dựng) |

## 📖 Tài Liệu Tham Khảo

- **electron-builder**: https://www.electron.build/
- **NSIS**: https://nsis.sourceforge.io/
- **Node.js**: https://nodejs.org/

## 💡 Mẹo Hữu Ích

1. **Build lần đầu có thể mất thời gian**: Electron-builder cần tải các dependency, build lần thứ 2 sẽ nhanh hơn

2. **Giải phóng dung lượng**: Nếu bạn không cần bản build desktop, có thể xóa thư mục `desktop/win` sau khi lấy file installer

3. **Tư động kiểm tra**: Trước khi phân phối, hãy cài đặt file `.exe` trên máy tính khác để kiểm tra

4. **Ký chữ ký**: Nếu muốn ứng dụng được tin cậy bởi Windows (tránh cảnh báo SmartScreen), hãy ký chữ ký code

---

**Phát triển bởi:** wxyhgk  
**Dự án:** RetainPDF  
**Liên kết:** https://github.com/wxyhgk/retain-pdf
