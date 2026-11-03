@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Portofolio Pribadi - TypeScript TSX
where npm >nul 2>nul
if errorlevel 1 (
  echo Node.js belum terpasang. Install Node.js dari https://nodejs.org/
  echo Setelah instalasi, jalankan file ini lagi.
  pause
  exit /b 1
)
if not exist "node_modules\solid-js" (
  echo Menginstal dependensi website untuk pertama kalinya...
  call npm install
  if errorlevel 1 (
    echo Instalasi gagal. Periksa koneksi internet dan coba lagi.
    pause
    exit /b 1
  )
)
echo Website siap dibuka di browser.
call npm run dev
pause
