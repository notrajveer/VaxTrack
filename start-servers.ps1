# VaxTrack Server Startup Script
Write-Host "Starting VaxTrack servers..." -ForegroundColor Green

# Start Backend Server
Write-Host "`nStarting backend server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\code\ECE Project\backend'; Write-Host 'Backend Server' -ForegroundColor Green; mvn spring-boot:run"

# Wait for backend to initialize
Write-Host "Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Start Frontend Server
Write-Host "`nStarting frontend server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\code\ECE Project'; Write-Host 'Frontend Server' -ForegroundColor Green; python -m http.server 3000"

Write-Host "`nBoth servers started!" -ForegroundColor Green
Write-Host "  Backend:  http://10.101.147.166:8080" -ForegroundColor White
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "`nClose the PowerShell windows to stop the servers." -ForegroundColor Yellow
