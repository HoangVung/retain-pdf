@echo off
setlocal enabledelayedexpansion

echo.
echo ========================================
echo     RetainPDF - Windows Installer
echo     Build Script (Vietnamese UI)
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Navigate to desktop directory
cd /d "%~dp0desktop"
if %errorlevel% neq 0 (
    echo [ERROR] Cannot navigate to desktop directory
    pause
    exit /b 1
)

REM Check if npm dependencies are installed
if not exist "node_modules" (
    echo [1/4] Cai dat cac thu vien Node.js can thiet...
    echo        (Dieu nay co the mat 5-10 phut, vui long cho doi)
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install npm dependencies
        pause
        exit /b 1
    )
) else (
    echo [1/4] Thu vien Node.js da san sang
)

echo.
echo [2/4] Chuan bi ung dung (build frontend va bundle)...
echo        (Dieu nay co the mat 3-5 phut)
echo.
call npm run prepare-app
if %errorlevel% neq 0 (
    echo [ERROR] Failed to prepare app
    pause
    exit /b 1
)

echo.
echo [3/4] Dang tao file cai dat (.exe installer)...
echo       (Dieu nay co the mat 2-3 phut, vui long cho doi)
echo.

REM Build using electron-builder with NSIS
call npm run dist:win32-installer
if %errorlevel% neq 0 (
    echo [ERROR] Failed to build installer
    pause
    exit /b 1
)

echo.
echo [4/4] Qua trinh hoan tat!
echo.
echo ========================================
echo     Installer Build Complete
echo ========================================
echo.

REM Open the output folder
if exist "win" (
    echo.
    echo Dang mo thu muc output...
    start "" "%CD%\win"
) else (
    echo.
    echo Luu y: Thu muc win\ chua duoc tao. Kiem tra qua trinh build.
)

echo.
echo Ban co the tim thay file cai dat (.exe) trong thu muc: win\
echo.
pause
