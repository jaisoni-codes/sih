@echo off
title JSICP Web Platform
echo ===================================================
echo Starting JSICP - Jharkhand Innovation Portal...
echo ===================================================
set "PATH=C:\Users\HP\AppData\Local\Programs\nodejs;%PATH%"
cd /d "%~dp0apps\web"
echo Running npm run dev...
npm run dev
pause
