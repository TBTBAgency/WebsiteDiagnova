# Phase 14 — Baseline Migration Test

Tanggal: 17 November 2026 · Branch: `artha` · Lingkungan: lokal (PostgreSQL 15 di container Docker `diagnova_db`, Prisma 5.22.0)

> **Kesimpulan: PASS (di database sementara).**
> Baseline menghasilkan struktur yang identik dengan `prisma/schema.prisma` dan dengan DB dev.
> PASS ini **bukan izin** untuk menerapkan apa pun ke DB dev utama atau production. Penerapan tetap NEEDS APPROVAL (§11).

Tidak ada perubahan pada DB dev utama, DB production, folder `prisma/migrations`, maupun migration lama. Tidak ada push, merge, atau deploy.

---

## 1. Tujuan

Membuktikan di database sementara bahwa usulan baseline `docs/proposals/baseline_schema_20261117.sql`:
1. dapat diterapkan tanpa error ke DB kosong melalui `prisma migrate deploy`, dan riwayatnya tercatat benar;
2. menghasilkan struktur yang sama persis dengan `schema.prisma` dan DB dev (tabel, kolom, tipe, nullable, default, PK/FK, unique, index, enum);
3. dapat diadopsi oleh DB yang **sudah berisi data** tanpa menjalankan SQL dan tanpa mengubah data;
4. dapat dipakai Prisma Client dan aplikasi (seluruh suite QA API);

serta mengonfirmasi ulang mengapa 3 migration lama tidak aman.

## 2. Database Pengujian

Semua dibuat khusus oleh proses ini, di container lokal yang sama, dan diberi `COMMENT ON DATABASE` penanda:

| Database | Dibuat dengan | Fungsi |
|---|---|---|
| `diagnova_baseline_test` | `CREATE DATABASE` (kosong) → `prisma migrate deploy` baseline | Skenario A: DB baru |
| `diagnova_baseline_adopt_test` | `CREATE DATABASE` → `prisma db push` → seed sintetis | Skenario B: DB berisi data yang dibangun dengan `db push`, persis seperti DB dev |
| `diagnova_legacy_migration_test` | `CREATE DATABASE` → `prisma migrate deploy` 3 migration lama | Skenario C: bukti risiko migration lama |

Pengamanan koneksi:
- Semua perintah dijalankan lewat wrapper yang membaca `.env` lokal, lalu **hanya mengganti nama database**.
- Wrapper menolak host selain `localhost`/`127.0.0.1` dan menolak nama DB di luar daftar uji di atas.
- DB dev (`diagnova_v2`) hanya boleh dipakai untuk introspeksi read-only (`migrate diff`, query katalog).
- Connection string tidak pernah dicetak. Output Prisma mengonfirmasi target, misalnya `PostgreSQL database "diagnova_baseline_test" … at "localhost:5435"`.
- Credential production tidak digunakan.

Data uji hanya sintetis:
- seed bawaan repo (`prisma/seed.ts`, `prisma/seed-cms.ts`, `scripts/sync_page_hero_defaults.js`);
- baris berawalan `p14-`/`P14PROBE` dengan email `@example.test`.

Tidak ada data dev atau production yang disalin.

Folder migration sementara dibuat di scratchpad sesi, **bukan** di `prisma/migrations`:
- `baseline/migrations/20261117000000_baseline/migration.sql`, salinan byte-identik proposal (SHA-256 `ad9f57fc…9233b3`);
- `legacy/migrations/` berisi salinan 3 migration lama.

## 3. Baseline Migration yang Diuji

| Item | Nilai |
|---|---|
| File | `docs/proposals/baseline_schema_20261117.sql` (386 baris; 307 baris non-kosong) |
| Asal | `prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script` |
| Masih sesuai schema saat ini? | **Ya.** Di-generate ulang hari ini. Bagian SQL identik baris-per-baris, dan satu-satunya perbedaan adalah 20 baris komentar header proposal. `schema.prisma` terakhir berubah di commit `a67511a` (sebelum proposal dibuat). |
| Pernyataan destruktif | **0** `DROP` / `TRUNCATE` / `DELETE`. Kata "DELETE" hanya muncul di klausa `ON DELETE` pada FK. |
| Isi | 11 `CREATE TYPE`, 12 `CREATE TABLE`, 34 index (24 `CREATE INDEX` + 10 `CREATE UNIQUE INDEX`), 9 FK |

**Mengapa 3 migration lama berisiko** (diuji ulang di skenario C, §5.3):
- Ketiganya bisa diterapkan ke DB kosong, tetapi hasilnya **berbeda jauh** dari schema:
  - tidak ada tabel `roles`, `demo_magic_links`, dan `cms_sections`;
  - enum `lead_approval_status` tidak ada;
  - `user_role` berisi `super_admin,sales_admin,lab_staff,pathologist`;
  - ada tabel `lead_notes` yang tidak dikenal schema;
  - `users.role`, `users.status`, dan `leads.status` bertipe enum, padahal schema memakai `Int`/relasi.
- Menutup selisih itu dengan migration "maju" **destruktif**. SQL yang dihasilkan Prisma mengandung:
  - `DROP COLUMN users.role`, `DROP COLUMN users.status`, `DROP COLUMN leads.status`;
  - `DROP TABLE lead_notes`;
  - `DROP TYPE user_role_old`;
  - `DROP CONSTRAINT audit_logs_user_id_fkey`.

## 4. Hasil Penerapan

### Skenario A — DB baru (`diagnova_baseline_test`)

| Langkah | Hasil |
|---|---|
| `prisma migrate deploy` | `Applying migration 20261117000000_baseline` → "All migrations have been successfully applied." (exit 0) |
| `prisma migrate status` | "Database schema is up to date!" |
| `_prisma_migrations` | 1 baris. `finished_at` terisi, `rolled_back_at` kosong, `applied_steps_count = 1`, `logs` kosong. Checksum `ad9f57fc433c…9233b3` **sama dengan SHA-256 file**. |
| Seed sintetis | `seed.ts` (role, 2 akun, 10 katalog, 2 pasien contoh, 1 order), `seed-cms.ts`, dan `sync_page_hero_defaults.js` berhasil. `scripts/seed_other_pages_cms.js` **gagal** karena bug script, bukan karena schema (lihat §7, temuan T-1). |

### Skenario B — Adopsi pada DB berisi data (`diagnova_baseline_adopt_test`)

Persiapan:
- DB dibangun dengan `prisma db push`, sama seperti DB dev.
- Seed sintetis, ditambah 1 user, 1 lead (Jadwal Demo/approved), 1 magic link terpakai, dan 1 audit log.
- Fingerprint data md5 per tabel dicatat sebelum langkah pertama.

| Langkah | Hasil |
|---|---|
| B0 `migrate diff` DB → schema | No difference detected |
| A' `migrate deploy` **tanpa** resolve (kesalahan operator) | **Ditolak** dengan `P3005 The database schema is not empty`. Tidak ada SQL yang dijalankan, `_prisma_migrations` **tidak dibuat**, data tidak berubah. |
| B1 `migrate status` | "Following migration have not yet been applied: 20261117000000_baseline" |
| B2 `migrate resolve --applied 20261117000000_baseline` | "marked as applied" (`applied_steps_count = 0`, SQL tidak dijalankan) |
| B3 `migrate status` | "Database schema is up to date!" |
| B4 `migrate deploy` | "No pending migrations to apply." |
| B5 `migrate diff` DB → schema | No difference detected |
| Data (md5, 12 tabel) | **Tidak berubah** setelah A' dan setelah B2–B4 |
| Struktur (katalog) | **Identik** sebelum dan sesudah adopsi; satu-satunya tambahan adalah tabel `_prisma_migrations` |

### Skenario C — Migration lama + baseline dalam satu folder (`diagnova_legacy_migration_test`)

Tujuannya mensimulasikan kesalahan menambahkan baseline **tanpa** mengarsipkan 3 migration lama.

| Langkah | Hasil |
|---|---|
| `migrate deploy` 3 migration lama | Berhasil, tetapi schema salah (§3) |
| Tambah folder baseline, lalu `migrate deploy` | **Gagal** `P3018` / `42710 type "lead_status" already exists` |
| Dampak | DDL di-rollback atomik, katalog **tidak berubah**. Namun `_prisma_migrations` kini menyimpan baris baseline yang **gagal** (`finished_at` kosong), sehingga deploy berikutnya diblokir sampai `migrate resolve --rolled-back`. |

Pelajaran: langkah "arsipkan 3 migration lama" **wajib** dilakukan sebelum baseline ditambahkan ke `prisma/migrations`.

## 5. Schema Comparison

### 5.1 Prisma (`prisma migrate diff --exit-code`, 0 = sama)

| # | Dari → ke | Hasil |
|---|---|---|
| 1 | DB baseline → `schema.prisma` | No difference (exit 0) |
| 2 | `schema.prisma` → DB baseline | No difference (exit 0) |
| 3 | DB baseline → DB dev (read-only) | No difference (exit 0) |
| 3b | DB dev → DB baseline | No difference (exit 0) |
| 4 | DB dev → `schema.prisma` (drift DB dev) | No difference (exit 0) |
| 5 | DB adopsi (setelah resolve) → `schema.prisma` | No difference (exit 0) |
| 6 | DB legacy → `schema.prisma` | **Berbeda.** 136 baris SQL, termasuk DROP (§3) |

### 5.2 Katalog PostgreSQL langsung (independen dari Prisma)

Prisma bisa saja menganggap dua struktur "sama" sementara ada detail yang tidak dibandingkan. Karena itu katalog `pg_catalog`/`information_schema` juga dibandingkan langsung.

Setiap objek dinormalisasi menjadi satu baris:
- kolom: tipe, panjang, presisi, nullable, default, dan **posisi**;
- constraint: `pg_get_constraintdef`, termasuk `ON DELETE`/`ON UPDATE`;
- index: `pg_get_indexdef`;
- enum: label beserta **urutannya**;
- sequence, trigger, view, dan extension.

| Jenis objek | Baseline | DB dev | Legacy |
|---|---|---|---|
| Tabel | 12 | 12 | 10 |
| Kolom | 131 | 131 | 92 |
| Constraint (12 PK + 9 FK) | 21 | 21 | 18 |
| Index (termasuk 12 index PK) | 46 | 46 | 38 |
| Enum | 11 | 11 | 10 |
| Sequence / trigger / view / extension | 0 | 0 | 0 |

**Baseline vs DB dev: identik baris-per-baris (221 baris), termasuk urutan kolom.**
Katalog lengkap disimpan di [`docs/audit/PHASE_14_SCHEMA_CATALOG.txt`](audit/PHASE_14_SCHEMA_CATALOG.txt).

FK dan perilaku hapus (terverifikasi di katalog dan diuji perilakunya di §9):

| FK | ON DELETE |
|---|---|
| `users.role_id → roles` | SET NULL |
| `leads.user_id → users` | SET NULL |
| `demo_magic_links.lead_id → leads` | CASCADE |
| `demo_magic_links.user_id → users` | SET NULL |
| `lab_orders.patient_id → patients` | RESTRICT |
| `lab_orders.physician_id → physicians` | SET NULL |
| `lab_order_items.order_id → lab_orders` | CASCADE |
| `lab_order_items.test_catalog_id → test_catalogs` | RESTRICT |
| `specimens.order_id → lab_orders` | CASCADE |
| `audit_logs.user_id` | **Tanpa FK** (by design; riwayat audit dipertahankan) |

## 6. Daftar Perbedaan

| Perbandingan | Perbedaan |
|---|---|
| Baseline ↔ `schema.prisma` | **Tidak ada** |
| Baseline ↔ DB dev | **Tidak ada**, termasuk urutan kolom |
| Proposal ↔ SQL hasil generate ulang hari ini | Hanya 20 baris komentar header |
| Baseline ↔ 3 migration lama | Besar (§3, §5.1 #6). Inilah alasan baseline dibutuhkan. |

Catatan kualitas schema. Ini **bukan** perbedaan; baseline mereproduksinya persis seperti di DB dev:
- **Index duplikat:** `token_hash`, `mrn`, `order_number`, dan `barcode_number` masing-masing punya unique index **dan** index biasa.
- **Enum yang dideklarasikan tetapi tidak dipakai kolom mana pun:** `lead_status`, `user_role`, `user_status`.
- **Urutan enum `order_priority` adalah `routine, cito, urgent`.** Ini akar bug urutan worklist LIS (§9, Phase 13 R-38).
- **Kolom `leads."jobTitle"`** memakai camelCase (tanpa `@map`).
- **`prisma format --check`** melaporkan `schema.prisma` belum terformat. Ini kosmetik dan tidak memengaruhi struktur. `prisma validate`: valid.

Perbaikan butir-butir ini butuh migration baru **setelah** baseline diadopsi, dan perlu persetujuan.

## 7. Risiko Kehilangan Data

| Skenario | Risiko | Bukti |
|---|---|---|
| Baseline di DB baru/kosong (`migrate deploy`) | Tidak ada | 0 DROP; diterapkan bersih (§4-A) |
| Adopsi di DB berisi data (`migrate resolve --applied`) | Tidak ada; SQL tidak dijalankan | Data md5 dan katalog tidak berubah (§4-B) |
| Operator salah menjalankan `migrate deploy` di DB berisi data tanpa resolve | Tidak ada; ditolak P3005 sebelum ada perubahan | §4-B A' |
| Baseline ditambahkan tanpa mengarsipkan migration lama | Tidak ada kehilangan data, tetapi deploy gagal dan meninggalkan catatan migration gagal | §4-C |
| `prisma migrate dev` atau "migration maju" dari migration lama | **TINGGI.** DROP kolom/tabel (`users.role`, `users.status`, `leads.status`, `lead_notes`); `migrate dev` juga dapat menawarkan reset DB | §3 |
| DB production berbeda dari `schema.prisma` (drift tidak diketahui) | **Belum diketahui.** DB production tidak diperiksa (tidak ada akses dan tidak diizinkan). | Wajib `migrate diff` read-only + backup sebelum resolve |
| `DOCKER_SETUP.md` masih menyarankan `migrate deploy` dengan migration lama | Developer baru mendapat schema salah | Dokumentasi; perbaikan termasuk rencana §11 |

**Temuan tambahan (bukan schema):**
- **T-1:** rangkaian `npm run db:seed` **gagal di environment baru**. `scripts/seed_other_pages_cms.js` mengimpor `integrationsData` dari `content/integrations.ts` dan gagal dengan `SyntaxError … does not provide an export named 'integrationsData'`. Akibatnya konten CMS untuk halaman solusi/modul/integrasi tidak ter-seed. Situs tetap berjalan dengan konten bawaan. Belum diperbaiki (di luar cakupan Phase 14).
- **T-2:** `.env` lokal tidak berisi `SEED_ADMIN_PASSWORD`. Seed dan skrip QA memakai password default development yang tertulis di kode. Hanya untuk lokal, tetapi tidak boleh dipakai di environment bersama.

## 8. Prisma Validation

| Pemeriksaan | Hasil |
|---|---|
| `prisma validate` | "The schema at prisma\schema.prisma is valid" |
| `prisma format --check` | Belum terformat (kosmetik, tidak diubah) |
| `prisma migrate status` (baseline, adopsi) | Up to date |
| `prisma generate` / tipe | Client yang sama dipakai seluruh uji. `tsc --noEmit`: 0 error |

## 9. Hasil Pengujian

### 9.1 Prisma Client langsung pada DB baseline — 23/23 PASS

Skrip sintetis; semua baris uji dihapus kembali (terverifikasi). Yang diuji:
- **Default:** `users.status = 1`, `password_hash` null, `leads.status = 1`, `approval_status = PENDING`, `lab_orders.priority = ROUTINE`, `status = ORDERED`.
- **Unique → P2002:** `users.email`, `demo_magic_links.token_hash`, `patients.mrn`, `lab_orders.order_number`, `specimens.barcode_number`, `cms_sections.section_key`.
- **FK → P2003:** lead tidak dikenal. RESTRICT berlaku pada hapus pasien yang punya order dan hapus katalog yang dipakai.
- **Perilaku hapus:**
  - SET NULL: user → leads/magic link; physician → order.
  - CASCADE: lead → magic link; order → item + spesimen.
- **Lainnya:**
  - Enum menolak nilai tidak valid.
  - `audit_logs` menerima `user_id` tanpa FK.
  - JSON `extra_content` round-trip, termasuk karakter non-ASCII.

Skrip yang sama juga lulus 23/23 pada DB adopsi.

### 9.2 Aplikasi penuh pada DB baseline — 401/401 PASS

Dev server dijalankan sementara dengan `DATABASE_URL` → `diagnova_baseline_test`. Koneksi diverifikasi lewat `pg_stat_activity`: hanya DB baseline yang terhubung. Seluruh suite QA kemudian dijalankan:

| Suite | Hasil |
|---|---|
| security | 28/28 |
| demo-workflow | 55/55 |
| admin | 25/25 |
| cms | 19/19 |
| lis | 117/117 |
| cms-layout | 43/43 |
| site-content | 77/77 |
| unit app-url + eligibility | 23/23 + 14/14 |

- Selisih 3 check dari run Phase 12 (404) **bukan kegagalan**. Ketiganya hanya aktif bila `EXPECT_APP_URL` diset untuk QA mode production (`demo-workflow.test.mjs:121,127`, `site-content.test.mjs:245`), dan run ini memakai dev server.
- Output QA tidak mengandung token 64-hex atau hash bcrypt.
- Setelah selesai, dev server dikembalikan ke DB dev (dan terverifikasi terhubung ke `diagnova_v2`).

### 9.3 Probe bug (data sintetis, server terikat DB baseline)

Probe ini untuk memastikan temuan Phase 13 dengan bukti, bukan hanya membaca kode. Seluruh data probe dihapus (terverifikasi 0 sisa).

| Probe | Hasil | Arti |
|---|---|---|
| `GET /api/admin/leads?limit=abc` / `?page=abc` / `?startDate=not-a-date` | 500 / 500 / 500 | Input tidak divalidasi |
| Export CSV dengan 120 lead | 100 baris | Terpotong diam-diam |
| Worklist LIS (order routine lalu cito) | `["routine","cito"]` | ROUTINE di atas CITO, kebalikan dari yang seharusnya |
| 8 `POST /api/lis/orders` bersamaan | 2× 201, 6× 500 | Race nomor order. Unique constraint mencegah duplikat (4 order / 4 nomor unik; 4 spesimen / 4 barcode unik), tetapi request gagal. |
| `POST /api/lis/patients` sex/birthDate tidak valid | 500 / 500 | Seharusnya 400 |
| `POST /api/lis/orders` `testCatalogCodes` berupa string | 500 | Seharusnya 400 |
| `POST /api/lis/orders` `priority=bogus` | 201, tersimpan `ROUTINE` | Nilai tidak valid diterima diam-diam |

### 9.4 Keamanan data selama pengujian

| Pemeriksaan | Hasil |
|---|---|
| DB dev `diagnova_v2`: fingerprint md5 per baris (12 tabel) sebelum vs sesudah seluruh Phase 14 | **Identik** |
| DB dev: tabel `_prisma_migrations` | Tetap tidak ada (riwayat migration DB dev tidak diubah) |
| DB lain (`diagnova`, `diagnova_restore_check`, `diagnova_test`) | Tidak disentuh; ukuran sama sebelum dan sesudah |
| `prisma/migrations` dan migration lama | Tidak diubah (`git status` bersih untuk folder `prisma/`) |
| Backup | Tidak ada yang dihapus |

## 10. Kesimpulan

**PASS** untuk tujuan Phase 14 di database sementara:
- Baseline diterapkan bersih dan riwayatnya tercatat benar (checksum cocok).
- Struktur **identik** dengan `schema.prisma` dan DB dev, baik menurut Prisma maupun menurut katalog PostgreSQL langsung.
- Tidak ada pernyataan destruktif.
- Jalur adopsi `migrate resolve --applied` untuk DB berisi data tidak mengubah data maupun struktur.
- Prisma Client dan seluruh suite QA aplikasi bekerja di atasnya.

Batasan PASS ini:
- Tidak mencakup DB production, yang strukturnya belum diperiksa.
- Tidak memperbaiki kualitas schema (§6) maupun bug aplikasi (§9.3).

## 11. Rekomendasi Sebelum Penerapan ke Database Utama

Semua langkah di bawah **NEEDS APPROVAL** dan tidak dijalankan.

1. **Persetujuan pemilik** untuk adopsi baseline, termasuk siapa yang menjalankan dan kapan.
2. **Satu commit perubahan repo:**
   - pindahkan 3 migration lama ke arsip, misalnya `prisma/migrations_legacy/` (riwayat tetap ada di git);
   - salin proposal ke `prisma/migrations/<timestamp>_baseline/migration.sql`, dengan **isi byte-identik** agar checksum sama di semua environment;
   - perbarui `DOCKER_SETUP.md`.
   - Jangan pernah menaruh baseline berdampingan dengan migration lama (§4-C).
3. **Untuk setiap DB berisi data (dev, lalu production):**
   1. Backup (`pg_dump -Fc`) dan uji restore.
   2. `prisma migrate diff --from-url <DB> --to-schema-datamodel prisma/schema.prisma --exit-code` harus exit 0. Bila tidak, **berhenti** dan analisis drift.
   3. `prisma migrate resolve --applied <timestamp>_baseline`. Tidak ada SQL yang dijalankan.
   4. `prisma migrate status` harus "up to date".
4. **DB baru** (developer baru, CI, staging kosong): cukup `prisma migrate deploy`.
5. **Larangan operasional:**
   - Jangan `prisma migrate dev`, `prisma migrate reset`, atau `db push --accept-data-loss` terhadap DB berisi data.
   - Perubahan schema berikutnya dibuat sebagai migration baru di atas baseline, diuji di DB sementara dulu.
6. **Sesudah baseline diadopsi** (migration terpisah, masing-masing dengan persetujuan):
   - hapus index duplikat;
   - putuskan enum yang tidak dipakai;
   - perbaikan urutan prioritas LIS (lihat Phase 17);
   - tambahkan index FK yang belum ada (`users.role_id`, `demo_magic_links.user_id`, `lab_orders.physician_id`).
7. Perbaiki `scripts/seed_other_pages_cms.js` (T-1) agar `npm run db:seed` berjalan di environment baru.

---

### Lampiran A — Perintah utama (target DB diatur wrapper; tidak ada connection string di argumen)

```text
prisma migrate deploy  --schema <tmp>/baseline/schema.prisma            # skenario A, C
prisma migrate status  --schema <tmp>/baseline/schema.prisma
prisma migrate resolve --applied 20261117000000_baseline --schema <tmp>/baseline/schema.prisma   # skenario B
prisma db push --skip-generate                                         # skenario B (persiapan)
prisma migrate diff --from-schema-datasource <ds>.prisma --to-schema-datamodel prisma/schema.prisma --exit-code
prisma migrate diff --from-schema-datasource <ds_baseline>.prisma --to-schema-datasource <ds_ref>.prisma --exit-code
prisma validate ; prisma format --check
```

`<ds>.prisma` hanya berisi blok `datasource` yang membaca URL dari variabel environment. URL itu dibentuk oleh wrapper dan tidak pernah dicetak.

### Lampiran B — Query katalog

Query read-only atas `pg_class`, `information_schema.columns`, `pg_constraint` (`pg_get_constraintdef`), `pg_indexes`, `pg_enum` (diurutkan `enumsortorder`), `information_schema.sequences`/`triggers`/`views`, dan `pg_extension`. Tabel `_prisma_migrations` dikecualikan. Hasil: `docs/audit/PHASE_14_SCHEMA_CATALOG.txt`.

### Lampiran C — Pembersihan

Setelah laporan ini dan katalog disimpan, setiap database sementara diperiksa:
1. komentar penanda `Phase 14 disposable … created 2026-11-17 by Claude Code` harus cocok;
2. koneksi aktif (`pg_stat_activity`) harus 0.

Hanya bila kedua syarat terpenuhi, database itu di-`DROP`.

| Database | Hasil |
|---|---|
| `diagnova_baseline_test` | Dihapus (penanda cocok, 0 koneksi) |
| `diagnova_baseline_adopt_test` | Dihapus (penanda cocok, 0 koneksi) |
| `diagnova_legacy_migration_test` | Dihapus (penanda cocok, 0 koneksi) |

Database yang tersisa: `diagnova`, `diagnova_restore_check`, `diagnova_test`, `diagnova_v2`, dan `postgres`. Semuanya sudah ada sebelum Phase 14 dan tidak disentuh.

Sisa artefak:
- File query katalog `/tmp/p14_catalog.sql` di dalam container. Isinya hanya query struktur, tanpa data. Penghapusannya diblokir oleh pengaman perintah, jadi dibiarkan.
- Skrip uji di scratchpad sesi, yang tidak ikut ke repository.
