# Migrasi Database Diagnova

Dokumen ini menjelaskan cara menerapkan restrukturisasi database (Phase 4–5) secara aman.
Semua langkah sudah diuji pada database klon dan database test (lihat laporan `audit/execution/PHASE_4_MIGRATION_REPORT.md`).

## Isi folder `prisma/migrations`

| Migration | Isi | Catatan |
|---|---|---|
| `20261013162422_init_leads`, `20261016022305_add_users_and_audit`, `20261016060944_add_lis_core_preanalytic` | Migration historis | Dipertahankan apa adanya |
| `20261116090000_reconcile_legacy_history` | Membawa DB hasil migration lama ke struktur yang selama ini dibuat `db push` | **Hanya** berjalan pada DB kosong (ada guard). DB berisi data → `migrate resolve --applied` |
| `20261116090100_restructure_users_leads_demo_access` | `roles.code`, `users.status` enum + `deleted_at`, `leads.status` → `lead_stage`, kolom penyelesaian demo, tabel `demo_accesses`, magic link → periode akses, CHECK constraint | Precheck membatalkan migrasi bila ada lead status 4 (OD-21) atau data yang tidak dapat dipetakan |
| `20261116090200_audit_append_only_and_cms_pages` | Snapshot pelaku & trigger append-only `audit_logs`; `cms_sections` jadi pusat CMS (`page_key`, versi, soft delete); isi 4 tabel anak CMS disalin ke JSON | Tabel anak lama tidak dihapus (DEPRECATE) |

Tidak ada `DROP TABLE`/`DROP COLUMN` data. Yang di-drop hanya index redundan dan index UNIQUE `section_key` yang diganti UNIQUE `(page_key, section_key)`.
Seluruh file migration berjalan dalam satu transaksi: gagal = tidak ada perubahan (diuji).

## A. Database BARU (kosong)

```bash
npx prisma migrate deploy        # menjalankan seluruh migration
SEED_ADMIN_PASSWORD='<min 12 karakter>' npm run db:seed   # role + akun ADMIN awal + data LIS contoh
npm run db:seed:cms              # konten CMS default seluruh halaman (tidak menimpa yang sudah ada)
```

## B. Database yang SUDAH berisi data (dibangun dengan `prisma db push`) — dev, staging, produksi

1. **Backup & uji restore** (wajib):
   ```bash
   pg_dump -Fc -d diagnova -f diagnova_<tanggal>.dump
   createdb diagnova_restore_check && pg_restore --no-owner -d diagnova_restore_check diagnova_<tanggal>.dump
   ```
   Bandingkan jumlah baris per tabel antara asal dan hasil restore.
2. **Review data lama** yang diblokir precheck: `SELECT id, status FROM leads WHERE status NOT IN (1,2,3);` — status 4 harus diputuskan manual (OD-21).
3. **Baseline** (menandai migration yang strukturnya sudah ada, tanpa menjalankannya). Jalankan dari checkout yang
   memuat `.gitattributes` (file migration ber-EOL LF) agar checksum yang tercatat konsisten di semua OS:
   ```bash
   npx prisma migrate resolve --applied 20261013162422_init_leads
   npx prisma migrate resolve --applied 20261016022305_add_users_and_audit
   npx prisma migrate resolve --applied 20261016060944_add_lis_core_preanalytic
   npx prisma migrate resolve --applied 20261116090000_reconcile_legacy_history
   ```
4. **Terapkan**: `npx prisma migrate deploy`
5. **Verifikasi**:
   ```bash
   npx prisma migrate diff --from-url "$DATABASE_URL" --to-schema-datamodel prisma/schema.prisma   # harus "No difference detected"
   npm run db:seed:cms
   ```
   Bandingkan jumlah baris (seluruh tabel sama) dan checksum tabel LIS (harus identik).

## Rollback

- Sebelum `migrate deploy` selesai: otomatis (transaksi).
- Setelah berhasil: **restore dari backup langkah B.1** (cara yang teruji). Tidak disediakan down-migration SQL karena konversi enum → integer dan penghapusan kolom baru berisiko kehilangan data yang ditulis setelah migrasi.
- Kode aplikasi lama tidak kompatibel dengan schema baru; rollback DB harus disertai rollback aplikasi.

## Pemeliharaan audit log

`audit_logs` append-only di level database (trigger). Penghapusan resmi (kebijakan retensi OD-12) hanya oleh DBA:
```sql
BEGIN; SET LOCAL diagnova.audit_maintenance = 'on'; DELETE FROM audit_logs WHERE created_at < '...'; COMMIT;
```
Proteksi penuh terhadap akun DB aplikasi membutuhkan role database terpisah (lihat DEPLOYMENT.md).

## Mencegah drift

Jangan memakai `prisma db push` di lingkungan bersama. Perubahan schema selalu lewat migration baru yang ditulis/di-review manual.
Cek drift: `SHADOW_DATABASE_URL=... npm run db:drift-check`.
