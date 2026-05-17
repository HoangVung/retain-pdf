; Unicode NSIS Installer for RetainPDF - Vietnamese UI
; ============================================================================

!include "MUI2.nsh"
!include "x64.nsh"
!include "WinVer.nsh"
!include "nsDialogs.nsh"

SetCompress off
SetCompressor /SOLID lzma

; ============================================================================
; VERSION AND GENERAL SETTINGS
; ============================================================================

!define VERSION "4.1.1"
!define PRODUCT_NAME "RetainPDF"
!define COMPANY_NAME "wxyhgk"
!define WEB_SITE "https://github.com/wxyhgk/retain-pdf"

; Use LZMA compression
SetCompressor /SOLID lzma
SetCompressorDictSize 32

; Unicode support for Vietnamese
Unicode True

; ============================================================================
; MUI2 SETTINGS
; ============================================================================

!define MUI_ABORTWARNING
!define MUI_ICON "build\icon.ico"
!define MUI_UNICON "build\icon.ico"
!define MUI_HEADERIMAGE
!define MUI_HEADERIMAGE_RIGHT
!define MUI_WELCOMEFINISHPAGE_BITMAP "build\icons\icon256x256.ico"

; ============================================================================
; INSTALLER PAGES
; ============================================================================

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

; ============================================================================
; UNINSTALLER PAGES
; ============================================================================

!insertmacro MUI_UNPAGE_WELCOME
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_UNPAGE_FINISH

; ============================================================================
; LANGUAGE AND STRINGS (Vietnamese)
; ============================================================================

!insertmacro MUI_LANGUAGE "Vietnamese"

; === WELCOME PAGE ===
LangString MUI_WELCOMEPAGE_TITLE ${LANG_VIETNAMESE} "Chào mừng đến với ${PRODUCT_NAME}"
LangString MUI_WELCOMEPAGE_TEXT ${LANG_VIETNAMESE} "Trợ lý cài đặt sẽ hướng dẫn bạn cài đặt ${PRODUCT_NAME}.$\r$\n$\r$\nBạn được khuyến nghị đóng tất cả các ứng dụng khác trước khi tiếp tục.$\r$\n$\r$\nClick 'Tiếp theo' để tiếp tục cài đặt."

; === DIRECTORY PAGE ===
LangString MUI_PAGE_DIRECTORY_TITLE ${LANG_VIETNAMESE} "Chọn vị trí cài đặt"
LangString MUI_PAGE_DIRECTORY_SUBTITLE ${LANG_VIETNAMESE} "Vui lòng chọn thư mục để cài đặt ${PRODUCT_NAME}"

; === INSTFILES PAGE ===
LangString MUI_PAGE_INSTFILES_TITLE ${LANG_VIETNAMESE} "Đang cài đặt"
LangString MUI_PAGE_INSTFILES_SUBTITLE ${LANG_VIETNAMESE} "Vui lòng đợi trong khi ${PRODUCT_NAME} đang được cài đặt..."

; === FINISH PAGE ===
LangString MUI_PAGE_FINISH_TITLE ${LANG_VIETNAMESE} "Hoàn tất cài đặt"
LangString MUI_PAGE_FINISH_SUBTITLE ${LANG_VIETNAMESE} "Trợ lý cài đặt đã hoàn tất thành công."
LangString MUI_TEXT_FINISH_INFO_TITLE ${LANG_VIETNAMESE} "Hoàn tất Trợ lý cài đặt ${PRODUCT_NAME}"
LangString MUI_TEXT_FINISH_INFO_TEXT ${LANG_VIETNAMESE} "${PRODUCT_NAME} đã được cài đặt thành công trên máy tính của bạn.$\r$\n$\r$\nClick 'Hoàn thành' để đóng trợ lý này."
LangString MUI_TEXT_FINISH_RUN ${LANG_VIETNAMESE} "Chạy ${PRODUCT_NAME} ngay bây giờ"
LangString MUI_TEXT_FINISH_RUN_CHECKED ${LANG_VIETNAMESE} "Khởi chạy ${PRODUCT_NAME}"

; === BUTTON TEXTS ===
LangString MUI_BUTTONTEXT_NEXT ${LANG_VIETNAMESE} "Tiếp theo >"
LangString MUI_BUTTONTEXT_BACK ${LANG_VIETNAMESE} "< Quay lại"
LangString MUI_BUTTONTEXT_FINISH ${LANG_VIETNAMESE} "Hoàn thành"
LangString MUI_BUTTONTEXT_CANCEL ${LANG_VIETNAMESE} "Hủy bỏ"
LangString MUI_BUTTONTEXT_BROWSE ${LANG_VIETNAMESE} "Duyệt..."
LangString MUI_BUTTONTEXT_EXPLORE ${LANG_VIETNAMESE} "Mở thư mục"

; === MESSAGES ===
LangString MUI_ABORTWARNING_TEXT ${LANG_VIETNAMESE} "Bạn chắc chắn muốn thoát khỏi trợ lý cài đặt ${PRODUCT_NAME}?"
LangString MUI_UNABORTWARNING_TEXT ${LANG_VIETNAMESE} "Bạn chắc chắn muốn thoát khỏi trợ lý gỡ cài đặt ${PRODUCT_NAME}?"

; === UNINSTALL PAGE STRINGS ===
LangString MUI_UNPAGE_WELCOME_TITLE ${LANG_VIETNAMESE} "Gỡ cài đặt ${PRODUCT_NAME}"
LangString MUI_UNPAGE_WELCOME_SUBTITLE ${LANG_VIETNAMESE} "Xóa ${PRODUCT_NAME} khỏi máy tính của bạn"
LangString MUI_UNPAGE_WELCOME_TEXT ${LANG_VIETNAMESE} "Trợ lý gỡ cài đặt sẽ gỡ bỏ ${PRODUCT_NAME} từ máy tính của bạn.$\r$\n$\r$\nTrước khi bắt đầu, hãy đảm bảo rằng ${PRODUCT_NAME} không đang chạy.$\r$\n$\r$\nClick 'Tiếp theo' để tiếp tục."

LangString MUI_UNPAGE_CONFIRM_TITLE ${LANG_VIETNAMESE} "Xác nhận gỡ cài đặt"
LangString MUI_UNPAGE_CONFIRM_SUBTITLE ${LANG_VIETNAMESE} "Xóa ${PRODUCT_NAME} từ máy tính của bạn"
LangString MUI_TEXT_UNCONFIRM_TITLE ${LANG_VIETNAMESE} "Gỡ cài đặt ${PRODUCT_NAME}"
LangString MUI_TEXT_UNCONFIRM_SUBTITLE ${LANG_VIETNAMESE} "Đang gỡ bỏ ${PRODUCT_NAME}..."

LangString MUI_UNPAGE_FINISH_TITLE ${LANG_VIETNAMESE} "Hoàn tất gỡ cài đặt"
LangString MUI_UNPAGE_FINISH_SUBTITLE ${LANG_VIETNAMESE} "Trợ lý gỡ cài đặt đã hoàn tất thành công."
LangString MUI_TEXT_UNFINISH_INFO_TITLE ${LANG_VIETNAMESE} "Hoàn tất gỡ cài đặt ${PRODUCT_NAME}"
LangString MUI_TEXT_UNFINISH_INFO_TEXT ${LANG_VIETNAMESE} "${PRODUCT_NAME} đã được gỡ cài đặt thành công.$\r$\n$\r$\nClick 'Hoàn thành' để đóng trợ lý này."
LangString MUI_TEXT_UNFINISH_RUN_CHECKED ${LANG_VIETNAMESE} "Khởi chạy"

; ============================================================================
; INSTALLER CONFIGURATION
; ============================================================================

Name "${PRODUCT_NAME} ${VERSION}"
OutFile "${PRODUCT_NAME}-Windows-${VERSION}-Setup.exe"
InstallDir "$PROGRAMFILES\${PRODUCT_NAME}"
InstallDirRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "InstallLocation"

RequestExecutionLevel admin
BrandingText "${COMPANY_NAME}"
ShowInstDetails show
ShowUninstDetails show

Var StartMenuFolder

; ============================================================================
; INSTALLER SECTION
; ============================================================================

Section "!${PRODUCT_NAME}" SecInstall
  SectionIn RO
  
  SetOutPath "$INSTDIR"
  
  ; Copy all files from build output
  File /r "dist\RetainPDF\*.*"
  
  ; Create Uninstaller
  WriteUninstaller "$INSTDIR\Uninstall.exe"
  
  ; Write installation info to registry
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "DisplayName" "${PRODUCT_NAME} ${VERSION}"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "DisplayVersion" "${VERSION}"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "Publisher" "${COMPANY_NAME}"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "URLInfoAbout" "${WEB_SITE}"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "DisplayIcon" "$INSTDIR\${PRODUCT_NAME}.exe"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "UninstallString" "$INSTDIR\Uninstall.exe"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "InstallLocation" "$INSTDIR"
  WriteRegDWord HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "NoModify" "1"
  WriteRegDWord HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "NoRepair" "1"
  
  ; Create shortcuts
  CreateDirectory "$SMPROGRAMS\${PRODUCT_NAME}"
  CreateShortCut "$SMPROGRAMS\${PRODUCT_NAME}\${PRODUCT_NAME}.lnk" "$INSTDIR\${PRODUCT_NAME}.exe"
  CreateShortCut "$SMPROGRAMS\${PRODUCT_NAME}\Gỡ cài đặt.lnk" "$INSTDIR\Uninstall.exe"
  CreateShortCut "$DESKTOP\${PRODUCT_NAME}.lnk" "$INSTDIR\${PRODUCT_NAME}.exe"
  
  ; Set installation location registry key
  WriteRegStr HKLM "Software\${PRODUCT_NAME}" "InstallLocation" "$INSTDIR"
  
SectionEnd

; ============================================================================
; UNINSTALLER SECTION
; ============================================================================

Section "Uninstall"
  
  ; Remove shortcuts
  Delete "$SMPROGRAMS\${PRODUCT_NAME}\${PRODUCT_NAME}.lnk"
  Delete "$SMPROGRAMS\${PRODUCT_NAME}\Gỡ cài đặt.lnk"
  RMDir "$SMPROGRAMS\${PRODUCT_NAME}"
  Delete "$DESKTOP\${PRODUCT_NAME}.lnk"
  
  ; Remove uninstaller
  Delete "$INSTDIR\Uninstall.exe"
  
  ; Remove installation directory
  RMDir /r "$INSTDIR"
  
  ; Remove registry entries
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}"
  DeleteRegKey HKLM "Software\${PRODUCT_NAME}"
  
SectionEnd

; ============================================================================
; FUNCTIONS
; ============================================================================

Function .onInit
  ${If} ${RunningX64}
    SetRegView 64
  ${EndIf}
FunctionEnd

Function .onInstSuccess
  MessageBox MB_YESNO|MB_ICONINFORMATION "Cài đặt thành công! Bạn muốn khởi chạy ${PRODUCT_NAME} ngay bây giờ?" /SD IDNO IDYES LaunchApp IDNO Done
  LaunchApp:
    Exec "$INSTDIR\${PRODUCT_NAME}.exe"
  Done:
FunctionEnd

Function un.onInit
  MessageBox MB_ICONINFORMATION|MB_OK "Bạn sắp gỡ cài đặt ${PRODUCT_NAME}.$\r$\nVui lòng đảm bảo ứng dụng không đang chạy."
FunctionEnd

Function un.onUninstSuccess
  MessageBox MB_ICONINFORMATION|MB_OK "Gỡ cài đặt ${PRODUCT_NAME} thành công."
FunctionEnd
