# Deployment Diagnova — Checklist Kesiapan Produksi

Status: **belum di-deploy.** Deployment dilakukan setelah infrastruktur tersedia dan disetujui.

## 1. Environment variable

| Variabel | Wajib | Keterangan |
|---|---|---|
| `DATABASE_URL` (runtime aplikasi) | Ya | PostgreSQL 15+. **Wajib role `diagnova_app`** (bukan superuser, bukan pemilik tabel) — lihat §2 |
| `DATABASE_URL` (langkah migrasi) | Saat migrasi | Role pemilik schema `diagnova_owner`, hanya di proses `prisma migrate deploy`; jangan dipakai aplikasi |
| `AUTH_SECRET` | Ya | Acak ≥ 32 karakter. Bila kosong/pendek di production, aplikasi **tetap start** tetapi setiap operasi sesi gagal: login dan seluruh area admin tidak dapat dipakai, dan error muncul saat request pertama, bukan saat start. Mengganti nilai ini mengakhiri semua sesi |
| `APP_BASE_URL` | Ya | URL publik HTTPS (dipakai di magic link). Wajib di production |
| `NEXT_PUBLIC_APP_URL` | Ya | URL publik (sitemap, metadata) |
| `UPLOAD_DIR` | Ya | Direktori upload CMS di **volume persisten** (OD-08) |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Sekali | Hanya untuk membuat ADMIN awal lewat `npm run db:seed` (tidak membuat data LIS); hapus setelahnya |
| `SEED_DEMO_LIS` | **Jangan di produksi** | `1` hanya untuk lingkungan demo/test (`npm run db:seed:demo-lis`); skrip menolak bila `NODE_ENV`/`APP_ENV`/`DIAGNOVA_ENV` = `production` |
| `SALES_NOTIFICATION_EMAIL`, provider email | Opsional | Notifikasi lead & tautan akses |

**Tidak ada** `CRON_SECRET` dan tidak ada job terjadwal: status periode akses demo diturunkan dari waktu.

## 2. Role database (wajib sebelum klaim audit append-only berlaku)

Jalankan `prisma/sql/db-roles.sql` oleh DBA sebagai langkah terpisah, setelah backup dan migrasi. Password dikirim lewat variabel psql; file tidak berisi credential.

| Role | Login | Dipakai oleh | Hak |
|---|---|---|---|
| `diagnova_owner` | Ya | `prisma migrate deploy` saja | Pemilik seluruh objek schema `public` |
| `diagnova_app` | Ya | Aplikasi (runtime) | DML tabel bisnis; `audit_logs` hanya SELECT + INSERT; tanpa akses `_prisma_migrations`; bukan superuser/pemilik |
| `diagnova_audit_maintainer` | Tidak (grup) | Login DBA tertentu untuk retensi (OD-12) | SELECT + DELETE `audit_logs`. UPDATE/TRUNCATE tetap ditolak trigger |

Diuji pada server sekali-pakai (Phase 8.1, `AP-*`):
- `diagnova_app` **tidak dapat** UPDATE, DELETE, TRUNCATE, DISABLE/DROP TRIGGER, DROP FUNCTION, memakai GUC lama, atau `SET ROLE` ke maintainer.
- Seluruh suite integrasi (56 test) lulus dengan aplikasi berjalan sebagai `diagnova_app`.

**Batasan yang tetap ada:** superuser dan `diagnova_owner` (pemilik) tetap dapat menonaktifkan trigger. Simpan credential keduanya terpisah dari aplikasi dan batasi aksesnya.

## 3. Infrastruktur

- **Reverse proxy wajib menimpa** `X-Forwarded-For`/`X-Real-IP` (dipakai pembatas laju login & form). Next.js mengisi header ini dari koneksi bila kosong, tetapi header kiriman klien diterima apa adanya, sehingga tanpa proxy pembatas laju per IP dapat dipalsukan. Pembatas per akun tetap aktif.
- **HTTPS** wajib (cookie sesi `Secure` di production; HSTS dikirim aplikasi).
- **Storage upload**: `UPLOAD_DIR` pada volume persisten yang ikut di-backup. Untuk multi-instance gunakan storage bersama (NFS/object storage — adapter `lib/uploads.ts`).
- **Database**: TimeZone server `UTC` (precheck migrasi menolak selain itu); backup terjadwal + uji restore berkala.
- **Email & domain**: konfigurasi SPF/DKIM untuk pengiriman tautan akses (saat ini tautan juga dapat dikirim admin via WhatsApp).

## 4. Urutan rilis

1. Maintenance window: hentikan aplikasi & proses yang menulis ke DB (`docs/DATABASE_MIGRATION.md` §3.0).
2. Backup + uji restore DB produksi.
3. `npm run db:baseline-check` (harus exit 0) dan `prisma/sql/precheck-restructure.sql` (semua BLOCKER `LULUS`). Bila gagal: **STOP**.
4. Baseline + `prisma migrate deploy` sebagai `diagnova_owner` (`DATABASE_MIGRATION.md` §3.4–3.5).
5. `prisma/sql/verify-post-migration.sql` → `RINGKASAN = OK`; bandingkan jumlah baris & checksum LIS.
6. `prisma/sql/db-roles.sql` (bila belum) → aplikasi memakai `diagnova_app`.
7. `npm run db:seed:cms` (menambah konten default halaman yang belum ada).
8. Deploy & nyalakan kode baru.
9. Smoke test: login admin, buka Leads, beri akses ke lead uji (`@example.com`), login via tautan di browser, Tandai Demo Selesai, edit CMS & lihat halaman publik.
10. Ganti password akun ADMIN bawaan bila masih memakai password lama yang pernah ada di repository.
11. Semua sesi admin lama (role berbasis nama di JWT) otomatis tidak valid → admin login ulang.

Bila langkah 4 gagal: ikuti `DATABASE_MIGRATION.md` §4 (P3009, `migrate resolve --rolled-back`). Pemulihan paling andal adalah restore backup langkah 2.

## 5. Verifikasi pasca-rilis

- `npx prisma migrate status` → semua applied.
- `verify-post-migration.sql` → OK; `SELECT current_user` dari aplikasi = `diagnova_app`.
- Header keamanan (`X-Frame-Options`, `Content-Security-Policy: frame-ancestors 'none'`, HSTS).
- `/api/lis/*`, `/api/admin/*` tanpa sesi → 401.
- Upload gambar CMS tersaji dari `/uploads/...` setelah restart aplikasi (membuktikan volume persisten).
