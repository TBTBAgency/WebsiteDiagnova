# Diagnova — Docker Development Environment Guide

Panduan ini menjelaskan arsitektur, cara penggunaan, dan pemecahan masalah (*troubleshooting*) untuk menjalankan Diagnova (Next.js 14 + Prisma + PostgreSQL) di dalam Docker Desktop pada lingkungan Windows.

---

## 1. Prasyarat Sistem

1. **Windows 10 / 11** dengan WSL2 (*Windows Subsystem for Linux*) aktif.
2. **Docker Desktop for Windows** terpasang dan dalam status **Running**.
3. Service **PostgreSQL 15 lokal** aktif di port 5433 (Opsi 1 default).

---

## 2. Arsitektur & Strategi Database

Project ini dirancang dengan pendekatan **Dual-Strategy** yang aman terhadap data lokal:

### Pendekatan 1 (Default Aktif): Next.js di Docker + Database Lokal Windows (Port 5433)
- Container Next.js (`diagnova_app`) terhubung langsung ke PostgreSQL 15 di Windows host menggunakan hostname `host.docker.internal:5433`.
- **Keamanan Data:** 100% menggunakan data yang sudah ada tanpa risiko *reset* atau kehilangan data.
- **Port Host:** Port `5432` dan `5433` di Windows tetap aman dan tidak ditimpa container.

### Pendekatan 2 (Opsional): Database Container Terisolasi
- Jika ingin menjalankan database PostgreSQL 15 baru di dalam container (misal untuk testing bersih):
  ```bash
  docker compose --profile with-db up -d
  ```
- Database container ini menggunakan *named volume* terpisah (`diagnova_db_data`) dan port host alternatif **5434:5432** sehingga tidak akan pernah bentrok dengan port lokal 5432 maupun 5433.

---

## 3. Menjalankan Diagnova

Masuk ke direktori `WebsiteDiagnova`:

```bash
cd WebsiteDiagnova
```

### A. Menjalankan Container (Background)
```bash
docker compose up -d
```
Aplikasi akan dapat diakses di: **[http://localhost:3000](http://localhost:3000)**

### B. Melihat Log Aplikasi (Real-time)
```bash
docker compose logs -f app
```
Tekan `Ctrl + C` untuk keluar dari tampilan log.

### C. Menghentikan Container
```bash
docker compose down
```

### D. Rebuild Image (Setelah Menambah Dependency di `package.json`)
Jika Anda menginstal package baru atau memperbarui `package.json`, rebuild image:
```bash
docker compose build --no-cache
docker compose up -d
```

---

## 4. Menjalankan Perintah Prisma di Container

Prisma Client secara otomatis di-generate setiap kali container dijalankan (`npx prisma generate`).

Jika Anda ingin menjalankan perintah Prisma di dalam container:

### Generate Prisma Client:
```bash
docker compose exec app npx prisma generate
```

### Memeriksa Status Migrasi:
```bash
docker compose exec app npx prisma migrate status
```

### Menerapkan Migrasi yang Belum Terpasang (Aman):
```bash
docker compose exec app npx prisma migrate deploy
```

> ⚠️ **PERINGATAN KEAMANAN DATABASE:**  
> - **JANGAN** menjalankan `npx prisma migrate reset` karena akan menghapus seluruh data tabel.  
> - **JANGAN** menjalankan `npx prisma db push --force-reset`.

---

## 5. Penjelasan Docker Volumes & Hot Reload

Konfigurasi `compose.yaml` menggunakan tiga volume penting:

1. **`.:/app` (Bind Mount)**:  
   Menghubungkan folder source code di Windows langsung ke `/app` di container. Setiap perubahan kode di VS Code/editor langsung terbaca di container.
2. **`/app/node_modules` (Anonymous Volume)**:  
   Mengisolasi folder `node_modules` di dalam container Linux agar tidak tertimpa oleh `node_modules` host Windows yang memiliki binary native berbeda.
3. **`/app/.next` (Anonymous Volume)**:  
   Menjaga cache build Next.js tetap berada di lingkungan Linux container demi performa maksimal.
4. **`WATCHPACK_POLLING=true`**:  
   Diaktifkan di environment agar event perubahan file di Windows filesystem dapat dideteksi secara instan oleh Webpack/Next.js Fast Refresh.

---

## 6. Troubleshooting Windows & Docker Desktop

### 1. Pesan `failed to connect to the docker API`
- **Penyebab:** Docker Desktop belum dijalankan di Windows.
- **Solusi:** Buka aplikasi **Docker Desktop** dari Start Menu Windows dan tunggu hingga ikon Docker di system tray berwarna hijau (*Engine running*).

### 2. Error BuildKit: `invalid file request ...` (OneDrive Cloud Sync)
- **Penyebab:** Windows OneDrive Files-on-Demand mengubah file menjadi *cloud reparse points*.
- **Solusi:** Pastikan folder project selalu tersimpan offline. Klik kanan folder project di Windows File Explorer dan pilih **"Always keep on this device"**. Jika masih terjadi, jalankan script konversi reparse point.

### 3. Koneksi Database Menolak (`Connection Refused` ke 5433)
- Pastikan Service Windows `postgresql-x64-15` sedang running:
  ```powershell
  Get-Service postgresql-x64-15
  ```
- Jika stopped, jalankan:
  ```powershell
  Start-Service postgresql-x64-15
  ```

### 4. Port 3000 Bentrok
- Jika port 3000 sudah digunakan oleh proses lain di Windows:
  Periksa dengan PowerShell:
  ```powershell
  Get-NetTCPConnection -LocalPort 3000
  ```
  Anda dapat mengubah pemetaan port di `compose.yaml` (misal `"3001:3000"`).
