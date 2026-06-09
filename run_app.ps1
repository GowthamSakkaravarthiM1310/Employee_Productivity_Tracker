# Run Backend
Start-Process -FilePath "npm.cmd" -ArgumentList "start" -WorkingDirectory ".\backend"

# Run Frontend
Start-Process -FilePath "npm.cmd" -ArgumentList "run dev" -WorkingDirectory ".\frontend"

Write-Host "CSEHACKATHON MVP Started!"
Write-Host "Backend: http://localhost:5000"
Write-Host "Frontend: http://localhost:5173"
