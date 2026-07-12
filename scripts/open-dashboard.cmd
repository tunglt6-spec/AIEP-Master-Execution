@echo off
title AIEP Dashboard
cd /d "D:\WORKING - 2026\AI ENGINEER PLATFORM"
echo ================================================
echo   AIEP Dashboard
echo   Server: http://127.0.0.1:4173
echo   Dong cua so nay de dung dashboard.
echo ================================================
echo.
REM Mo trinh duyet sau 4 giay (cho server khoi dong xong)
start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep 4; Start-Process 'http://127.0.0.1:4173'"
REM Build du lieu that + phuc vu dashboard (chan cua so nay lai)
node bin\aiep.js dashboard --port 4173
