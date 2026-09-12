@echo off
setlocal
cd /d %~dp0
if not exist .env copy .env.example .env
call npm install
if errorlevel 1 exit /b 1
call npm run dev
