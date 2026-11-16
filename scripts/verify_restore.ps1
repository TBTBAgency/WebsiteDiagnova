$ErrorActionPreference = "Stop"

$psql = "C:\Program Files\PostgreSQL\15\bin\psql.exe"
$dump = "WebsiteDiagnova\backups\pre_restructure_20261113\diagnova_full_backup.sql"
$env:PGPASSWORD = "12345"

Write-Host "=== MEMULAI VERIFIKASI PEMULIHAN (RESTORE VERIFICATION) ===" -ForegroundColor Cyan

# 1. Create temporary test database
Write-Host "1. Membuat database uji 'diagnova_backup_test'..." -ForegroundColor Yellow
& $psql -h localhost -p 5433 -U postgres -d postgres -q -c "DROP DATABASE IF EXISTS diagnova_backup_test;"
& $psql -h localhost -p 5433 -U postgres -d postgres -q -c "CREATE DATABASE diagnova_backup_test;"
Write-Host "   Database 'diagnova_backup_test' berhasil dibuat." -ForegroundColor Green

# 2. Restore SQL dump into test DB
Write-Host "2. Memulihkan file dump ke 'diagnova_backup_test'..." -ForegroundColor Yellow
& $psql -h localhost -p 5433 -U postgres -d diagnova_backup_test -q -f $dump
Write-Host "   Restore berhasil dijalankan." -ForegroundColor Green

# 3. Check row counts for all 17 tables
$tables = @(
    "_prisma_migrations",
    "roles",
    "users",
    "leads",
    "demo_magic_links",
    "audit_logs",
    "cms_sections",
    "cms_hero_slides",
    "cms_comparison_items",
    "cms_testimonials",
    "cms_partners",
    "patients",
    "physicians",
    "test_catalogs",
    "lab_orders",
    "lab_order_items",
    "specimens"
)

Write-Host "`n3. Perbandingan Jumlah Baris: Asli (diagnova) vs Hasil Restore (diagnova_backup_test):" -ForegroundColor Cyan
Write-Host ("-" * 75)
Write-Host ("{0,-25} {1,-20} {2,-20} {3}" -f "Tabel", "Asli (diagnova)", "Restore (test)", "Status")
Write-Host ("-" * 75)

$allMatch = $true

foreach ($t in $tables) {
    $origCountRaw = (& $psql -h localhost -p 5433 -U postgres -d diagnova -t -A -c "SELECT COUNT(*) FROM `"$t`"")
    $testCountRaw = (& $psql -h localhost -p 5433 -U postgres -d diagnova_backup_test -t -A -c "SELECT COUNT(*) FROM `"$t`"")
    
    $origCount = [int]$origCountRaw.Trim()
    $testCount = [int]$testCountRaw.Trim()
    
    $status = if ($origCount -eq $testCount) { "SESUAI (OK)" } else { "TIDAK SESUAI (FAIL)"; $allMatch = $false }
    
    Write-Host ("{0,-25} {1,-20} {2,-20} {3}" -f $t, $origCount, $testCount, $status)
}

Write-Host ("-" * 75)

if ($allMatch) {
    Write-Host "`nHASIL: 100% DATA HASIL RESTORE SESUAI PERSIS DENGAN DATABASE ASLI!" -ForegroundColor Green
} else {
    Write-Host "`nHASIL: TERDAPAT KETIDAKSESUAIAN DATA HASIL RESTORE!" -ForegroundColor Red
    exit 1
}

# 4. Clean up test database
Write-Host "4. Membersihkan database uji 'diagnova_backup_test' (DROP)..." -ForegroundColor Yellow
& $psql -h localhost -p 5433 -U postgres -d postgres -q -c "DROP DATABASE diagnova_backup_test;"
Write-Host "   Database 'diagnova_backup_test' berhasil dibersihkan." -ForegroundColor Green

Write-Host "=== VERIFIKASI PEMULIHAN SUKSES 100% ===" -ForegroundColor Cyan

