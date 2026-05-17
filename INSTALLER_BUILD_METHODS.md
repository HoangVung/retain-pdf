# RetainPDF Installer Build Methods

Có 3 cách để tạo Windows installer (.exe) cho RetainPDF:

## 1️⃣ Batch Script (Đơn giản - Khuyến Khích)

**File:** `build_windows_installer_vi.bat`

```bash
build_windows_installer_vi.bat
```

**Ưu điểm:**
- ✅ Đơn giản, chỉ cần double-click
- ✅ Tự động mở thư mục output
- ✅ Thông báo rõ ràng tiếng Việt
- ✅ Tự động mở folder chứa installer

**Nhược điểm:**
- Không có tùy chọn nâng cao
- Khó debug nếu có lỗi

## 2️⃣ PowerShell Script (Nâng Cao)

**File:** `build_windows_installer_vi.ps1`

```powershell
# Chạy theo mặc định (tự động mở folder)
.\build_windows_installer_vi.ps1

# Hoặc với các tùy chọn:
.\build_windows_installer_vi.ps1 -SkipNodeCheck -SkipInstall -OpenFolder

# Giải thích các tùy chọn:
# -SkipNodeCheck  : Bỏ qua kiểm tra Node.js (nếu bạn đã biết nó được cài đặt)
# -SkipInstall    : Bỏ qua npm install (nếu dependencies đã được cài)
# -OpenFolder     : Mở thư mục output sau khi build xong (mặc định: $true)
```

**Ưu điểm:**
- ✅ Có tùy chọn nâng cao
- ✅ Output đẹp với màu sắc
- ✅ Xử lý lỗi tốt hơn

**Nhược điểm:**
- Cần bật PowerShell execution policy nếu gặp vấn đề

**Lưu ý:** Nếu bạn gặp lỗi "execution policy", hãy chạy:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 3️⃣ npm Commands (Thủ Công)

**Các lệnh npm:**

```bash
# 1. Di chuyển vào thư mục desktop
cd desktop

# 2. Cài đặt dependencies (lần đầu)
npm install

# 3. Xây dựng ứng dụng
npm run prepare-app

# 4. Tạo installer NSIS
npm run dist:win32-installer

# Hoặc nếu bạn muốn portable executable (không cần installer):
npm run dist:win32
```

**Ưu điểm:**
- ✅ Kiểm soát toàn bộ quá trình
- ✅ Có thể chạy từng bước riêng
- ✅ Dễ debug

**Nhược điểm:**
- Cần hiểu npm và quá trình build
- Phải chạy nhiều lệnh

## 📊 So Sánh

| Tiêu Chí | Batch | PowerShell | npm Commands |
|---------|-------|-----------|--------------|
| Dễ sử dụng | ⭐⭐⭐ | ⭐⭐ | ⭐ |
| Tính năng | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| Thông báo lỗi | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| Tốc độ | ⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| Khuyến khích cho... | Người mới | Dev nâng cao | Dev giàu kinh nghiệm |

## 🎯 Khuyến Cáo

**Cho người mới:** Sử dụng **Batch Script** (cách 1)
```bash
build_windows_installer_vi.bat
```

**Cho developer:** Sử dụng **PowerShell** hoặc **npm commands** (cách 2 hoặc 3)

**Cho CI/CD automation:** Sử dụng **npm commands** hoặc **PowerShell script** với tùy chọn

## 📍 Output Location

Không kể bạn chọn cách nào, file installer sẽ được tạo ở:
```
desktop/win/RetainPDF-Windows-[version]-Setup.exe
```

Ví dụ:
```
desktop/win/RetainPDF-Windows-4.1.1-Setup.exe
desktop/win/RetainPDF-Windows-4.1.2-Setup.exe
```

## ⏱️ Thời Gian Dự Kiến

| Hoạt động | Thời gian | Ghi chú |
|-----------|----------|--------|
| Lần đầu tiên (Node check + install) | 15-30 phút | Tùy vào tốc độ mạng |
| Lần thứ 2+ (chỉ rebuild) | 5-10 phút | Nhanh hơn vì dependencies đã có |
| Prepare-app (frontend build) | 3-5 phút | Phụ thuộc vào kích thước frontend |
| Build installer | 2-3 phút | Thường nhanh |

## 🔍 Kiểm Tra Kết Quả

Sau khi build xong, kiểm tra file installer:

```powershell
# Danh sách các file installer
Get-ChildItem -Path "desktop\win\*.exe"

# Xem chi tiết file
Get-ChildItem -Path "desktop\win\*.exe" -Detailed
```

## 🚀 Tiếp Theo

Sau khi tạo installer, bạn có thể:

1. **Kiểm tra installer:**
   - Cài đặt trên máy test
   - Chạy ứng dụng để kiểm tra
   - Gỡ cài đặt để kiểm tra gỡ cài đặt

2. **Phân phối:**
   - Upload lên GitHub Release
   - Tạo website tải xuống
   - Phân phối qua AppStore

3. **Ký chữ ký (tùy chọn):**
   - Sử dụng SignTool.exe để ký code
   - Tránh cảnh báo SmartScreen của Windows

---

**Tham khảo:** [INSTALLER_GUIDE_VI.md](./INSTALLER_GUIDE_VI.md)
