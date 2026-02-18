@echo off
chcp 65001 >nul
REM SIMRS Bun Setup Script for Windows
REM Script ini akan menginstall dependencies menggunakan Bun

echo 🚀 Setting up SIMRS with Bun...

REM Check if Bun is installed
bun --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Bun tidak ditemukan. Menginstall Bun...
    powershell -Command "irm bun.sh/install.ps1|iex"
    
    echo ⚠️  Silakan restart terminal Anda setelah instalasi selesai
    pause
    exit /b 1
)

echo ✅ Bun version: 
bun --version

REM Install dependencies
echo 📦 Installing dependencies with Bun...
bun install

REM Check if node_modules exists
if exist "node_modules" (
    echo ✅ Dependencies installed successfully!
    echo.
    echo 🎉 Setup complete! You can now run:
    echo    bun run bun:dev     # Start development server
    echo    bun run bun:build   # Build for production
    echo    bun test            # Run tests
) else (
    echo ❌ Failed to install dependencies
    exit /b 1
)

pause
