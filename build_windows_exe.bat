@echo off
echo [1/3] Cai dat cac thu vien Python can thiet...
pip install -r desktop\requirements-desktop-windows.txt
pip install pyinstaller

echo [2/3] Dang build file cai dat (.exe)...
REM Luu y: Ban hay thay "desktop\main.py" ben duoi bang ten file chay chinh xac cua ung dung nhe!
pyinstaller --noconfirm --onedir --windowed --name "RetainPDF" "desktop\main.py"

echo [3/3] Qua trinh build hoan tat! 
echo Ban co the tim thay ung dung RetainPDF.exe trong thu muc "dist\RetainPDF\"
pause