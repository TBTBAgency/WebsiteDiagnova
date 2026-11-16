# Migrasi Database Diagnova

Prosedur menerapkan restrukturisasi database (Phase 4–5, diperkeras Phase 8.1).

Bukti pengujian:
- `audit/execution/PHASE_2_3_4_DESIGN_AND_MIGRATION_REPORT.md` — uji awal.
- `audit/execution/PHASE_8_DEEP_DATABASE_MIGRATION_AUDIT.md` — audit.
- `audit/execution/PHASE_8_1_MIGRATION_REMEDIATION_REPORT.md` — fixture & hasil uji.

> **Status:** migration ini **belum pernah dijalankan pada database development/staging/produksi**. Seluruh uji dilakukan pada server PostgreSQL sekali-pakai.

## 1. Isi folder `prisma/migrations`

| # | Migration | Isi | Catatan |
|---|---|---|---|
| 1–3 | `20261013162422_init_leads`, `20261016022305_add_users_and_audit`, `20261016060944_add_lis_core_preanalytic` | Migration historis | Tidak diubah |
| 4 | `20261116090000_reconcile_legacy_history` | Membawa DB hasil migration 1–3 ke struktur yang selama ini dibuat `prisma db push` (= schema `main` @ `c944f9a`) | **Berisi statement destruktif** (`DROP TABLE lead_notes`, `DROP COLUMN` + `ADD COLUMN` untuk `leads.status`/`users.status`, `DROP COLUMN users.role`, `DROP CONSTRAINT` FK). Guard di awal file **membatalkan** migration bila tabel `users/leads/lead_notes/audit_logs`/LIS berisi data, sehingga statement tersebut hanya pernah berjalan pada DB kosong. DB berisi data → di-*baseline* (§3), bukan dijalankan |
| 5 | `20261116090100_restructure_users_leads_demo_access` | Role ADMIN/USER (`roles.code`), `users.status` enum + `deleted_at`, `leads.status` → `lead_stage`, kolom penyelesaian demo, tabel `demo_accesses`, magic link → periode akses, 10 CHECK | **Precheck fail-closed** (§4) sebelum perubahan apa pun |
| 6 | `20261116090200_audit_append_only_and_cms_pages` | Snapshot pelaku & trigger append-only `audit_logs`; `cms_sections` jadi pusat CMS; isi 4 tabel anak CMS disalin ke JSON | Precheck TimeZone. Tabel anak lama tidak dihapus (DEPRECATE) |

Migration 5 dan 6 tidak berisi `DROP TABLE`/`DROP COLUMN`. Yang di-DROP:
- index redundan `demo_magic_links_token_hash_idx`;
- index UNIQUE `cms_sections_section_key_key`, diganti UNIQUE `(page_key, section_key)`;
- DEFAULT lama `leads.status`/`users.status` (diganti default baru);
- DEFAULT sementara `cms_sections.page_key` (hanya untuk backfill).

## 2. Database BARU (kosong)

```bash
npx prisma migrate deploy                          # migration 1–6 (guard #4 lolos karena DB kosong)
# set SEED_ADMIN_PASSWORD (min. 12 karakter) di environment terlebih dahulu
npm run db:seed                                    # HANYA role + akun ADMIN awal; tidak membuat data LIS
npm run db:seed:cms                                # konten CMS default (tidak menimpa yang sudah ada)
```

**Data LIS sintetis (pasien/order/katalog contoh) hanya untuk lingkungan demo/test** dan wajib memakai flag eksplisit: `SEED_DEMO_LIS=1 npm run db:seed:demo-lis`. Skrip ini menolak berjalan bila `NODE_ENV`/`APP_ENV`/`DIAGNOVA_ENV` = `production`. **Jangan** dijalankan pada database produksi.

Seed memakai `tsx` yang dipin di `devDependencies` (tidak mengunduh paket saat dijalankan).

## 3. Database LAMA berisi data (dibangun dengan `prisma db push`)

Prosedur ini **hanya** sah untuk database yang strukturnya identik dengan schema `main` @ `c944f9a`. **DB lokal port 5433 dari branch `artha` diketahui berbeda** (role ADMIN/USER, menu, perubahan `extraContent`): DB tersebut **tidak boleh** memakai prosedur ini tanpa rekonsiliasi khusus yang di-review.

### 3.0 Maintenance window (wajib)
1. Umumkan downtime. **Durasi tidak dapat diperkirakan di muka**: migration 5 & 6 me-*rewrite* tabel `users`, `leads`, `demo_magic_links`, `audit_logs`, `cms_sections` (lock `ACCESS EXCLUSIVE`). Ukur dengan menjalankan langkah 3.1–3.6 pada salinan DB target berukuran sama.
2. Hentikan aplikasi dan semua proses yang menulis ke database (tidak ada job terjadwal bawaan; periksa integrasi eksternal). Pastikan tidak ada koneksi aplikasi: `SELECT usename, application_name FROM pg_stat_activity WHERE datname = current_database();`
3. Backup terbaru → uji restore (3.1).
4. Precheck (3.2–3.3) → baseline (3.4) → migrate (3.5) → verifikasi (3.6).
5. Aktifkan aplikasi **versi baru** hanya setelah verifikasi lulus. Aplikasi versi lama tidak kompatibel dengan schema baru.

### 3.1 Backup & uji restore
```bash
pg_dump -Fc -d <db> -f diagnova_<tanggal>.dump
createdb diagnova_restore_check && pg_restore --no-owner -d diagnova_restore_check diagnova_<tanggal>.dump
```
Bandingkan jumlah baris per tabel dan checksum data LIS antara asal dan hasil restore. Simpan checksum file dump (`sha256sum`).

### 3.2 Verifikasi struktur sebelum baseline (H-01) — read-only
```bash
# cmd:        set TARGET_DATABASE_URL=postgresql://...
# PowerShell: $env:TARGET_DATABASE_URL="postgresql://..."
# bash:       export TARGET_DATABASE_URL=postgresql://...
npm run db:baseline-check
```
Skrip ini:
- memastikan file acuan `prisma/baseline/schema.c944f9a.prisma` identik dengan `c944f9a:prisma/schema.prisma` (hash blob `882accd9…`), bukan schema branch aktif;
- menjalankan `prisma migrate diff --from-url <target> --to-schema-datamodel <acuan> --exit-code`.

**Exit 0** = identik dan boleh lanjut. **Exit 2** = berbeda: **STOP**. Jangan baseline, jangan `db push`; perbedaan memerlukan migration rekonsiliasi khusus.

### 3.3 Precheck data (H-02, H-03, M-01, M-02, L-04, L-09) — read-only
```bash
psql "<url>" -v ON_ERROR_STOP=1 -f prisma/sql/precheck-restructure.sql
```
Setiap baris `BLOCKER` harus `LULUS`. Baris `INFO` menjelaskan transformasi yang akan terjadi. Ringkasannya:

| Pemeriksaan | Aturan |
|---|---|
| H-01 objek di luar Prisma | DB hasil `db push` harus punya 0 CHECK / trigger / function di schema `public` (Prisma diff tidak melihatnya) |
| H-03 TimeZone | Sesi harus `UTC`/`Etc/UTC`. Kolom `timestamp` lama diasumsikan UTC; konfirmasi juga bahwa TimeZone server tidak pernah diubah sejak data ditulis |
| H-02 pemetaan role | `Super Admin` → ADMIN · `Demo User` → USER · `Sales Admin`/`Lab Staff`/`Pathologist` → tanpa akses (OD-01 PENDING) · role lain yang dipakai user → **batal** · minimal 1 user aktif `Super Admin` ber-password |
| OD-21 | Lead status di luar 1..3 (termasuk 4) → batal, review manual |
| M-02 | Aktivasi demo lama tanpa lead kandidat → batal. `demo_expires_at` ≠ aktivasi + durasi × 24 jam → batal |
| L-04 | `demo_magic_links.user_id` ≠ `leads.user_id` → batal |
| Durasi / email / status user | Durasi ∉ {3,7,14,30}, email bukan huruf kecil, status ∉ {0,1} → batal |
| M-01 (INFO) | Lead status 3 tanpa login demo → menjadi **Dihubungi** |
| L-09 (INFO) | Lead approved tanpa user → tidak dibuatkan periode akses maupun user |
| L-03 (INFO) | Tautan lama yang dicabut hotfix (dengan memajukan `expires_at`) tercatat **Berakhir**, bukan **Dicabut**. Data tidak diubah dengan heuristik |

Migration 5 menjalankan pemeriksaan yang sama di blok precheck-nya (fail-closed) dan menulis `RAISE NOTICE`. Prisma tidak selalu menampilkan NOTICE, karena itu skrip read-only ini wajib dijalankan dan hasilnya disimpan sebagai bukti.

### 3.4 Baseline
Jalankan dari checkout yang memuat `.gitattributes` (file migration ber-EOL LF) agar checksum yang tercatat sama di semua OS:
```bash
npx prisma migrate resolve --applied 20261013162422_init_leads
npx prisma migrate resolve --applied 20261016022305_add_users_and_audit
npx prisma migrate resolve --applied 20261016060944_add_lis_core_preanalytic
npx prisma migrate resolve --applied 20261116090000_reconcile_legacy_history
```
Jangan mengubah `_prisma_migrations` secara manual.

### 3.5 Terapkan
`npx prisma migrate deploy` (memakai `DATABASE_URL` milik role **pemilik schema**, lihat `DEPLOYMENT.md` §2).

### 3.6 Verifikasi pasca-migrasi
```bash
npx prisma migrate status                                       # semua applied
npx prisma migrate diff --from-url "<url>" --to-schema-datamodel prisma/schema.prisma --exit-code   # exit 0
psql "<url>" -v ON_ERROR_STOP=1 -f prisma/sql/verify-post-migration.sql                             # RINGKASAN = OK
npm run db:seed:cms
```
`prisma migrate diff` **tidak** memeriksa CHECK constraint, trigger, function, maupun status validasi constraint. `verify-post-migration.sql` memeriksa 49 objek, antara lain:
- 11 CHECK;
- 9 FK;
- 12 index penting + 2 index yang harus sudah tidak ada;
- 2 trigger + 1 function (termasuk memastikan tidak ada bypass GUC);
- 3 enum;
- 9 kolom/default.

Bandingkan juga jumlah baris seluruh tabel dan checksum data LIS dengan hasil 3.1 (harus identik).

## 4. Kegagalan & pemulihan

`prisma migrate deploy` menerapkan migration **satu per satu**. Setiap file berjalan dalam transaksinya sendiri. **Tidak ada transaksi global** untuk ketiga migration (dibuktikan fixture RB-1/RB-2).

| Kegagalan pada | Yang dibatalkan | Yang tetap terpasang | `_prisma_migrations` |
|---|---|---|---|
| Migration 4 (fresh deploy, guard) | Seluruh isi migration 4 | Migration 1–3 | Baris migration 4 tercatat gagal |
| Migration 5 (precheck/constraint/transformasi) | Seluruh isi migration 5 | Baseline 1–4 | Baris migration 5 tercatat gagal |
| Migration 6 | Seluruh isi migration 6 | **Migration 5 tetap terpasang** (schema leads/users/demo baru) | Migration 5 selesai, migration 6 gagal |
| Koneksi terputus | Transaksi file yang sedang berjalan | Migration sebelumnya | Baris migration dapat tertinggal tanpa `finished_at` |

Setelah gagal, `migrate deploy` berikutnya **diblokir dengan `P3009`**. Prosedur:
1. Jangan menyalakan aplikasi (versi lama maupun baru).
2. Baca pesan error. Untuk precheck, pesannya menyebut kode temuan dan contoh id.
3. Perbaiki penyebabnya. Perbaikan data lama adalah keputusan bisnis (mis. OD-21, pemetaan role), bukan improvisasi.
4. `npx prisma migrate resolve --rolled-back <nama_migration_yang_gagal>`
5. `npx prisma migrate deploy`, lalu ulangi verifikasi 3.6.

**Pemulihan paling andal setelah kegagalan parsial (mis. migration 6 gagal setelah migration 5 terpasang) adalah restore dari backup 3.1**, disertai rollback aplikasi. Tidak ada down-migration SQL.

## 5. Audit log append-only

Trigger `audit_logs_append_only_*`:
- `UPDATE` dan `TRUNCATE` selalu ditolak.
- `DELETE` hanya diizinkan bagi login yang menjadi anggota role `diagnova_audit_maintainer` (retensi OD-12). Bila role itu tidak ada, tidak ada pengecualian.
- **Tidak ada** bypass lewat `SET`/GUC (mekanisme `diagnova.audit_maintenance` lama sudah dihapus).

**Batasan:** superuser dan **pemilik tabel** tetap dapat menonaktifkan atau menghapus trigger. Proteksi efektif terhadap aplikasi **hanya** bila aplikasi memakai role `diagnova_app` (bukan superuser, bukan pemilik). Lihat `prisma/sql/db-roles.sql` dan `DEPLOYMENT.md` §2.

Retensi oleh DBA yang menjadi anggota `diagnova_audit_maintainer`: `DELETE FROM audit_logs WHERE created_at < '...';`

## 6. Mencegah drift

- Jangan memakai `prisma db push` di lingkungan bersama.
- Perubahan schema selalu lewat migration baru yang ditulis dan di-review manual.
- Cek drift dengan `npm run db:drift-check -- --confirm-shadow-wipe` (sama di Windows/Linux/macOS). `SHADOW_DATABASE_URL` wajib menunjuk database **sekali-pakai** yang namanya mengandung `shadow`:
  - cmd: `set SHADOW_DATABASE_URL=postgresql://.../diagnova_shadow`
  - PowerShell: `$env:SHADOW_DATABASE_URL="postgresql://.../diagnova_shadow"`
  - bash: `export SHADOW_DATABASE_URL=postgresql://.../diagnova_shadow`
- **Prisma mengosongkan shadow database.** Skrip menolak URL yang sama dengan `DATABASE_URL` aplikasi/`TARGET`/`STAGING`/`PRODUCTION`, nama DB yang dilindungi, dan berjalan tanpa `--confirm-shadow-wipe`.

## 7. Catatan transparansi

**M-07 — checksum diubah manual di Phase 7.** Checksum 3 migration lama pada dua DB uji lama (`diagnova_test`, `diagnova_restore_check`) diubah dengan `UPDATE _prisma_migrations`, karena baseline dilakukan saat file masih CRLF lalu dinormalisasi ke LF.
- **Dampak:** riwayat checksum kedua DB itu tidak mencerminkan proses `resolve` yang asli.
- Selain itu, migration 5 & 6 sudah direvisi di Phase 8.1, sehingga kedua DB tersebut kini tercatat dengan **checksum versi lama**. Keduanya harus dianggap usang dan dibangun ulang dari backup sebelum dipakai lagi.
- **Pencegahan:** `.gitattributes` memaksa LF; baseline hanya dari checkout bersih; checksum tidak pernah diubah manual.

**Data lama yang sengaja tidak diubah:**
- `granted_by_id` periode hasil backfill = NULL (pemberi akses lama hanya tercatat sebagai nama di `leads.approved_by`).
- Tabel anak CMS lama tetap ada tetapi tidak lagi diperbarui. Rollback aplikasi tanpa restore DB akan menampilkan konten lama.
- Section CMS **tidak pernah di-hard-delete** oleh aplikasi; FK CASCADE ke tabel anak lama hanya relevan untuk penghapusan manual.

**CHECK besar (L-10):** constraint ditambahkan dan langsung divalidasi dalam transaksi yang sama dengan `ALTER TYPE`, yang sudah memegang lock `ACCESS EXCLUSIVE`. Pola `NOT VALID` → `VALIDATE` tidak mengurangi lock di dalam satu file. Untuk tabel sangat besar, gunakan migration terpisah dengan pola tersebut setelah review.
