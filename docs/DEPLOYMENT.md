# Deployment Diagnova — Checklist Kesiapan Produksi

Status: **belum di-deploy.** Deployment dilakukan setelah infrastruktur tersedia dan disetujui.

## 1. Environment variable

| Variabel | Wajib | Keterangan |
|---|---|---|
| `DATABASE_URL` | Ya | PostgreSQL 15+. Gunakan user DB khusus aplikasi (bukan superuser) |
| `AUTH_SECRET` | Ya | Acak ≥ 32 karakter. Aplikasi menolak start di production bila kosong/pendek. Mengganti nilai ini mengakhiri semua sesi |
| `APP_BASE_URL` | Ya | URL publik HTTPS (dipakai di magic link). Wajib di production |
| `NEXT_PUBLIC_APP_URL` | Ya | URL publik (sitemap, metadata) |
| `UPLOAD_DIR` | Ya | Direktori upload CMS di **volume persisten** (OD-08) |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Sekali | Hanya untuk membuat ADMIN awal lewat `npm run db:seed`; hapus setelahnya |
| `SALES_NOTIFICATION_EMAIL`, provider email | Opsional | Notifikasi lead & tautan akses |

**Tidak ada** `CRON_SECRET` dan tidak ada job terjadwal: status periode akses demo diturunkan dari waktu.

## 2. Infrastruktur

- **Reverse proxy wajib** menimpa header `X-Forwarded-For`/`X-Real-IP` (dipakai pembatas laju login & form). Tanpa proxy, pembatas laju per IP tidak aktif (per akun tetap aktif).
- **HTTPS** wajib (cookie sesi `Secure` di production; HSTS dikirim aplikasi).
- **Storage upload**: `UPLOAD_DIR` pada volume persisten yang ikut di-backup. Untuk multi-instance gunakan storage bersama (NFS/object storage — adapter `lib/uploads.ts`).
- **Database**: backup terjadwal + uji restore berkala. Disarankan role DB terpisah tanpa hak `TRUNCATE`/`ALTER` untuk aplikasi.
- **Email & domain**: konfigurasi SPF/DKIM untuk pengiriman tautan akses (saat ini tautan juga dapat dikirim admin via WhatsApp).

## 3. Urutan rilis

1. Backup + uji restore DB produksi.
2. Deploy kode **dalam mode maintenance** (kode baru tidak kompatibel dengan schema lama).
3. Ikuti `docs/DATABASE_MIGRATION.md` bagian B.
4. `npm run db:seed:cms` (menambah konten default halaman yang belum ada).
5. Smoke test: login admin, buka Leads, beri akses ke lead uji (`@example.com`), login via tautan di browser, Tandai Demo Selesai, edit CMS & lihat halaman publik.
6. Ganti password akun ADMIN bawaan bila masih memakai password lama yang pernah ada di repository.
7. Semua sesi lama (role berbasis nama) otomatis tidak valid → admin login ulang.

## 4. Verifikasi pasca-rilis

- `npx prisma migrate status` → semua applied.
- Header keamanan (`X-Frame-Options`, `Content-Security-Policy: frame-ancestors 'none'`, HSTS).
- `/api/lis/*`, `/api/admin/*` tanpa sesi → 401.
- Upload gambar CMS tersaji dari `/uploads/...` setelah restart aplikasi (membuktikan volume persisten).
