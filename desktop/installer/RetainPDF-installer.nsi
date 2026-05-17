; RetainPDF - Custom NSIS script for electron-builder
; Only contains hook macros — electron-builder handles pages, sections, etc.
; ============================================================================

!macro customHeader
  ; Additional includes if needed
!macroend

!macro customInit
  ; Custom initialization — runs inside .onInit
!macroend

!macro customInstall
  ; Runs after files are installed
  ; Create desktop shortcut
  CreateShortCut "$DESKTOP\RetainPDF.lnk" "$INSTDIR\RetainPDF.exe"
!macroend

!macro customUnInit
  ; Custom uninstall initialization
!macroend

!macro customUnInstall
  ; Runs during uninstall — clean up custom artifacts
  Delete "$DESKTOP\RetainPDF.lnk"
!macroend