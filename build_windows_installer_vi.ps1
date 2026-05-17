# RetainPDF Windows Installer Build Script (PowerShell)
# This script builds the Windows installer (.exe) for RetainPDF with Vietnamese UI

param(
    [switch]$SkipNodeCheck = $false,
    [switch]$SkipInstall = $false,
    [switch]$OpenFolder = $true
)

# Color output functions
function Write-Success {
    param([string]$Message)
    Write-Host $Message -ForegroundColor Green
}

function Write-Error-Custom {
    param([string]$Message)
    Write-Host $Message -ForegroundColor Red
}

function Write-Info {
    param([string]$Message)
    Write-Host $Message -ForegroundColor Cyan
}

function Write-Warning-Custom {
    param([string]$Message)
    Write-Host $Message -ForegroundColor Yellow
}

# ============================================================================
# HEADER
# ============================================================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Magenta
Write-Host "  RetainPDF - Windows Installer" -ForegroundColor Magenta
Write-Host "  Build Script (Vietnamese UI)" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta
Write-Host ""

# ============================================================================
# NAVIGATE TO DESKTOP FOLDER
# ============================================================================

Write-Info "Navigating to desktop directory..."
Push-Location ".\desktop"
if ($LASTEXITCODE -ne 0) {
    Write-Error-Custom "[ERROR] Cannot navigate to desktop directory"
    exit 1
}

Write-Success "✓ Working directory: $(Get-Location)"
Write-Host ""

if (-not $SkipNodeCheck) {
    Write-Info "[1/4] Checking Node.js installation..."
    
    $nodeVersion = node --version 2>$null
    if ($null -eq $nodeVersion) {
        Write-Error-Custom "[ERROR] Node.js is not installed or not in PATH"
        Write-Warning-Custom "Please install Node.js from https://nodejs.org/"
        Write-Warning-Custom "After installation, restart PowerShell and try again."
        exit 1
    }
    
    Write-Success "✓ Node.js found: $nodeVersion"
    
    $npmVersion = npm --version 2>$null
    Write-Success "✓ npm found: $npmVersion"
} else {
    Write-Info "[1/4] Skipping Node.js check (as requested)"
}

Write-Host ""

# ============================================================================
# INSTALL DEPENDENCIES
# ============================================================================

if (-not $SkipInstall) {
    Write-Info "[2/4] Installing npm dependencies..."
    
    $nodeModulesPath = ".\node_modules"
    if (Test-Path $nodeModulesPath) {
        Write-Success "✓ npm dependencies already installed"
    } else {
        Write-Warning-Custom "Installing npm packages (this may take a few minutes)..."
        
        npm install
        if ($LASTEXITCODE -ne 0) {
            Write-Error-Custom "[ERROR] Failed to install npm dependencies"
            Pop-Location
            exit 1
        }
        
        Write-Success "✓ npm dependencies installed successfully"
    }
} else {
    Write-Info "[2/4] Skipping npm install (as requested)"
}

Write-Host ""

# ============================================================================
# PREPARE APP
# ============================================================================

Write-Info "[3/4] Preparing application (building frontend and bundling)..."
Write-Warning-Custom "This may take a few minutes, please wait..."
Write-Host ""

npm run prepare-app
if ($LASTEXITCODE -ne 0) {
    Write-Error-Custom "[ERROR] Failed to prepare app"
    Write-Warning-Custom "Check the error messages above and try again"
    Pop-Location
    exit 1
}

Write-Success "✓ Application prepared successfully"

Write-Host ""

# ============================================================================
# BUILD INSTALLER
# ============================================================================

Write-Info "[4/4] Building Windows installer (.exe)..."
Write-Warning-Custom "This step may take several minutes, please wait..."
Write-Host ""

npm run dist:win32-installer
if ($LASTEXITCODE -ne 0) {
    Write-Error-Custom "[ERROR] Failed to build installer"
    Write-Warning-Custom "Check the error messages above and try again"
    Pop-Location
    exit 1
}

Pop-Location

Write-Host ""

# ============================================================================
# SUCCESS MESSAGE
# ============================================================================

Write-Host "========================================" -ForegroundColor Green
Write-Host "  Installer Build Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Success "✓ RetainPDF installer has been created successfully"
Write-Host ""
Write-Host "Output folder: desktop\win\" -ForegroundColor Yellow
Write-Host "Filename pattern: RetainPDF-Windows-[version]-Setup.exe" -ForegroundColor Yellow
Write-Host ""

# ============================================================================
# OPEN OUTPUT FOLDER
# ============================================================================

if ($OpenFolder) {
    $outputPath = Join-Path (Get-Location) "desktop\win"
    if (Test-Path $outputPath) {
        Write-Info "Opening output folder..."
        Start-Process "explorer.exe" -ArgumentList $outputPath
    } else {
        Write-Warning-Custom "Output folder not found at: $outputPath"
    }
}

Write-Host ""
Write-Success "Done! You can now distribute the .exe file to users."
Write-Host ""
