@echo off
echo ==========================================
echo    🧱 BrickForge Pro - Starting Server
echo ==========================================
echo.

:: Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    if errorlevel 1 (
        echo Failed to install dependencies!
        pause
        exit /b 1
    )
)

echo Starting server...
echo Access the game at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo ==========================================
node server.js

pause
