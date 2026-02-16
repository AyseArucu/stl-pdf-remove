
$ports = 3000..3005
Write-Host "Checking for stuck processes on ports $ports..."

foreach ($port in $ports) {
    $processes = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    foreach ($proc in $processes) {
        try {
            $pidToKill = $proc.OwningProcess
            Write-Host "Killing process on port $port (PID: $pidToKill)..."
            Stop-Process -Id $pidToKill -Force -ErrorAction SilentlyContinue
        } catch {
            Write-Host "Could not kill process on port $port. It might already be gone."
        }
    }
}

if (Test-Path ".next") {
    Write-Host "Cleaning .next cache..."
    Remove-Item -Recurse -Force .next
    Write-Host "Cache cleaned."
} else {
    Write-Host ".next cache not found, skipping."
}

if (Test-Path "node_modules/.cache") {
    Write-Host "Cleaning node_modules cache..."
    Remove-Item -Recurse -Force "node_modules/.cache"
    Write-Host "Node cache cleaned."
}


Write-Host "Syncing database schema..."
npx prisma db push

Write-Host "Regenerating Prisma Client..."
npx prisma generate

Write-Host "Starting Next.js server..."
npm run dev
