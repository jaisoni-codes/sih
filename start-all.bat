@echo off
title JSICP Full Stack Launcher
echo ========================================================
echo  JSICP - Jharkhand Societal Innovation Platform
echo  Starting AI Engine (FastAPI :8000) and Web App (:3000)
echo ========================================================

set "PATH=C:\Users\HP\AppData\Local\Programs\nodejs;%PATH%"

echo [1/2] Starting AI Engine (FastAPI) on port 8000...
start "JSICP AI Engine (:8000)" cmd /k "cd /d "%~dp0services\ai-service" && "C:\Users\HP\anaconda3\python.exe" -m uvicorn app:app --host 0.0.0.0 --port 8000"

echo [2/2] Starting Web Platform (Vite) on port 3000...
start "JSICP Web Platform (:3000)" cmd /k "cd /d "%~dp0apps\web" && npm run dev"

echo.
echo ========================================================
echo  Both services launched in separate windows!
echo  Web Portal: http://localhost:3000
echo  AI API Docs: http://localhost:8000/docs
echo ========================================================
ping 127.0.0.1 -n 4 >nul
