@echo off
title AIEP Status
cd /d "D:\WORKING - 2026\AI ENGINEER PLATFORM"
echo ================================================
echo   AIEP - STATUS
echo ================================================
node bin\aiep.js status
echo.
echo ================================================
echo   AIEP - VALIDATE (quality gates)
echo ================================================
node bin\aiep.js validate
echo.
echo ================================================
echo   Nhan phim bat ky de dong cua so...
echo ================================================
pause >nul
