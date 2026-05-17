# Installer Directory

## Nội Dung

- **RetainPDF-installer.nsi** - NSIS Installer script với giao diện tiếng Việt
  - Được sử dụng bởi electron-builder
  - Hỗ trợ cài đặt, gỡ cài đặt, tạo shortcut
  - Mọi text đều tiếng Việt

- **installer.nsi** - Script installer cơ bản (có thể xóa nếu không cần)

## Sử Dụng

File NSIS installer sẽ được tự động sử dụng khi bạn chạy:

```bash
npm run dist:win32-installer
```

hoặc sử dụng script batch:

```bash
build_windows_installer_vi.bat
```

## Tùy Chỉnh

Để tùy chỉnh installer, hãy chỉnh sửa file `RetainPDF-installer.nsi`:

1. Thay đổi các string tiếng Việt trong section "LANGUAGE AND STRINGS"
2. Thay đổi các icon trong section "MUI2 SETTINGS"
3. Thay đổi các hành động trong section "INSTALLER SECTION"

Sau khi chỉnh sửa, build lại installer để áp dụng các thay đổi.
