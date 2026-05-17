; RetainPDF Installer Script (Tiếng Việt)
; Unicode NSIS Installer for RetainPDF Desktop Application

!include "MUI2.nsh"
!include "x64.nsh"
!include "WinVer.nsh"

; ============================================================================
; CẤAUSE HẠT CHÍNH
; ============================================================================

Name "RetainPDF"
OutFile "RetainPDF-Windows-${VERSION}-Setup.exe"
InstallDir "$PROGRAMFILES\RetainPDF"
InstallDirRegKey HKLM "Software\RetainPDF" "InstallLocation"

; Yêu cầu quyền admin
RequestExecutionLevel admin

; ============================================================================
; MODERN UI CẤP HÌNH
; ============================================================================

!define MUI_LANGUAGE "Vietnamese"

; Hình ảnh installer
!define MUI_WELCOMEFINISHPAGE_BITMAP "${NSISDIR}\Contrib\Graphics\Wizard\nsis3-wizard.bmp"
!define MUI_UNWELCOMEFINISHPAGE_BITMAP "${NSISDIR}\Contrib\Graphics\Wizard\nsis3-unwizard.bmp"

; Icon
!define MUI_ICON "build\icon.ico"
!define MUI_UNICON "build\icon.ico"

; ============================================================================
; TRANG INSTALLER
; ============================================================================

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

; ============================================================================
; TRANG UNINSTALLER
; ============================================================================

!insertmacro MUI_UNPAGE_WELCOME
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_UNPAGE_FINISH

; ============================================================================
; NGÔN NGỮ
; ============================================================================

!insertmacro MUI_LANGUAGE "Vietnamese"

; Strings tiếng Việt
LangString MUI_TEXT_WELCOME_INFO_TITLE ${LANG_VIETNAMESE} "Chào mừng đến với RetainPDF"
LangString MUI_TEXT_WELCOME_INFO_TEXT ${LANG_VIETNAMESE} "Trợ lý cài đặt này sẽ hướng dẫn bạn cài đặt RetainPDF.$\r$\n$\r$\nVui lòng đóng tất cả các cửa sổ RetainPDF khác trước khi tiếp tục cài đặt.$\r$\n$\r$\nClick Next để tiếp tục."

LangString MUI_TEXT_DIRECTORY_TITLE ${LANG_VIETNAMESE} "Chọn vị trí cài đặt"
LangString MUI_TEXT_DIRECTORY_SUBTITLE ${LANG_VIETNAMESE} "Chọn thư mục để cài đặt RetainPDF"

LangString MUI_BUTTONTEXT_FINISH ${LANG_VIETNAMESE} "Hoàn thành"
LangString MUI_TEXT_FINISH_INFO_TITLE ${LANG_VIETNAMESE} "Hoàn tất Trợ lý cài đặt RetainPDF"
LangString MUI_TEXT_FINISH_INFO_TEXT ${LANG_VIETNAMESE} "RetainPDF đã được cài đặt thành công.$\r$\n$\r$\nClick Hoàn thành để đóng trợ lý này."

LangString MUI_TEXT_FINISH_RUN ${LANG_VIETNAMESE} "Khởi chạy RetainPDF ngay bây giờ"

; ============================================================================
; CỤC BỘ
; ============================================================================

Var StartMenuFolder

; ============================================================================
; INSTALLER SECTION
; ============================================================================

Section "Cài đặt RetainPDF" SecRetainPDF
  SectionIn RO
  
  ; Set output path to the installation directory
  SetOutPath "$INSTDIR"
  
  ; Copy files from dist directory
  File /r "dist\RetainPDF\*.*"
  
  ; Create shortcuts
  !insertmacro MUI_STARTMENU_WRITE_BEGIN Application
    CreateDirectory "$SMPROGRAMS\$StartMenuFolder"
    CreateShortcut "$SMPROGRAMS\$StartMenuFolder\RetainPDF.lnk" "$INSTDIR\RetainPDF.exe"
    CreateShortcut "$SMPROGRAMS\$StartMenuFolder\Gỡ cài đặt RetainPDF.lnk" "$INSTDIR\Uninstall.exe"
    CreateShortcut "$DESKTOP\RetainPDF.lnk" "$INSTDIR\RetainPDF.exe"
  !insertmacro MUI_STARTMENU_WRITE_END
  
  ; Write uninstall information
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\RetainPDF" "DisplayName" "RetainPDF"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\RetainPDF" "UninstallString" "$INSTDIR\Uninstall.exe"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\RetainPDF" "DisplayIcon" "$INSTDIR\RetainPDF.exe"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\RetainPDF" "DisplayVersion" "${VERSION}"
  
  ; Create uninstaller
  WriteUninstaller "$INSTDIR\Uninstall.exe"
  WriteRegStr HKLM "Software\RetainPDF" "InstallLocation" "$INSTDIR"
SectionEnd

; ============================================================================
; UNINSTALLER SECTION
; ============================================================================

Section "Uninstall"
  ; Remove shortcuts
  !insertmacro MUI_STARTMENU_GETFOLDER Application $StartMenuFolder
  Delete "$SMPROGRAMS\$StartMenuFolder\RetainPDF.lnk"
  Delete "$SMPROGRAMS\$StartMenuFolder\Gỡ cài đặt RetainPDF.lnk"
  RMDir "$SMPROGRAMS\$StartMenuFolder"
  Delete "$DESKTOP\RetainPDF.lnk"
  
  ; Remove installation directory
  RMDir /r "$INSTDIR"
  
  ; Remove registry entries
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\RetainPDF"
  DeleteRegKey HKLM "Software\RetainPDF"
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
  MessageBox MB_YESNO|MB_ICONINFORMATION "Cài đặt thành công! Bạn muốn khởi chạy RetainPDF ngay bây giờ?" /SD IDNO IDYES LaunchApp IDNO Done
  LaunchApp:
    Exec "$INSTDIR\RetainPDF.exe"
  Done:
FunctionEnd
