# VaxTrack Startup Script
# This script starts both backend and frontend

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   VaxTrack - Starting System" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Start Backend in new window
Write-Host "Starting Backend Server..." -ForegroundColor Yellow
$backendPath = Join-Path $PSScriptRoot "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host 'Starting Spring Boot Backend...' -ForegroundColor Green; mvn spring-boot:run"

Write-Host "Backend server starting in new window..." -ForegroundColor Green
Write-Host "Waiting for backend to initialize (15 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Open Frontend in Browser
Write-Host ""
Write-Host "Opening Frontend..." -ForegroundColor Yellow
$frontendPath = Join-Path $PSScriptRoot "index.html"
Start-Process $frontendPath

Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "   System Started Successfully!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend: http://localhost:8080" -ForegroundColor Cyan
Write-Host "Frontend: Opened in default browser" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C in the backend window to stop the server" -ForegroundColor Yellow
Write-Host ""
