# Phase 15 — Migration Safety Review

Tanggal: 17 November 2026 · Branch: `artha`

**Status:**
- Baseline **lulus uji di DB sementara** (Phase 14).
- Baseline **belum disetujui** untuk DB dev utama maupun production.
- Dokumen ini tidak menjalankan `migrate deploy` atau `migrate resolve` terhadap DB persisten mana pun.

Uji tambahan Phase 15 hanya dilakukan di DB sementara `diagnova_p15_eol_test`.

---

## 1. Ringkasan Bukti Phase 14

| Skenario (DB sementara) | Hasil |
|---|---|
| A. DB kosong + `migrate deploy` baseline | Sukses; `_prisma_migrations` benar; struktur identik dengan `schema.prisma` dan DB dev (Prisma diff + katalog `pg_catalog` 221 baris) |
| B. DB berisi data (dibangun `db push`) + `migrate deploy` **tanpa** resolve | Ditolak **P3005**; tidak ada perubahan apa pun |
| B. DB berisi data + `migrate resolve --applied` | Hanya mencatat riwayat (`applied_steps_count = 0`); data (md5) dan struktur tidak berubah; `migrate deploy` sesudahnya: "No pending migrations" |
| C. 3 migration lama + baseline dalam satu folder | Gagal **P3018** (`type "lead_status" already exists`); DDL di-rollback, tetapi baris migration gagal tertinggal di `_prisma_migrations` dan memblokir deploy berikutnya |
| Aplikasi penuh di atas DB baseline | QA 401/401; Prisma Client 23/23 |

## 2. Syarat: DB Baru / Kosong

1. DB benar-benar kosong: tidak ada tabel di schema `public` dan tidak ada `_prisma_migrations`.
2. Folder `prisma/migrations` hanya berisi folder baseline (+ `migration_lock.toml`). Migration lama **sudah diarsipkan** di luar folder itu.
3. Isi `migration.sql` baseline **identik** dengan proposal yang diuji (SHA-256 isi, diabaikan line ending; lihat §6).
4. Jalankan `prisma migrate deploy` (bukan `migrate dev`), lalu `prisma migrate status` → "up to date".
5. Seed hanya setelah SEED-01 diperbaiki (lihat `PHASE_15_BACKEND_FIX_PROPOSALS.md` P-10).

## 3. Syarat: DB yang Sudah Berisi Data (dev utama, production)

1. **Persetujuan tertulis pemilik** untuk DB tersebut.
2. **Backup** `pg_dump -Fc` sebelum langkah apa pun, plus **uji restore** ke DB sementara (bukan sekadar file ada).
3. **Cek drift read-only:** `prisma migrate diff --from-url <DB> --to-schema-datamodel prisma/schema.prisma --exit-code` harus **exit 0**. Bila exit 2, **berhenti** dan analisis perbedaannya. Jangan resolve.
4. **Cek riwayat:** apakah `_prisma_migrations` ada, dan baris apa saja isinya (lihat §7 skenario D). DB dev saat ini: tabel **tidak ada**.
5. `prisma migrate resolve --applied <timestamp>_baseline`. Ini **tidak menjalankan SQL**.
6. `prisma migrate status` → "up to date". Bandingkan fingerprint data sebelum dan sesudah: harus identik.
7. Catat di audit/log operasional: siapa, kapan, dan hash baseline.

## 4. Mengapa Migration Lama Tidak Boleh Berdampingan dengan Baseline

- Prisma menerapkan migration berurutan berdasarkan nama folder. Migration lama (`20261013…`, `20261016…`) berjalan **sebelum** baseline (`20261117…`).
- Pada DB baru, migration lama membuat tipe/tabel (mis. `lead_status`, `users` dengan kolom enum) yang lalu dibuat ulang oleh baseline. Hasilnya **P3018** (terbukti, skenario C), dan DB tertahan dengan migration gagal.
- Pada DB yang sudah di-resolve baseline, deploy akan mencoba menjalankan migration lama sebagai "pending", lalu gagal atau menghasilkan objek yang salah (`lead_notes`, `user_role` lama).
- Membuat migration "maju" dari riwayat lama ke schema sekarang menghasilkan SQL **destruktif** (Phase 14 §3):
  - `DROP COLUMN` `users.role`, `users.status`, `leads.status`;
  - `DROP TABLE lead_notes`;
  - `DROP TYPE user_role_old`.
- Karena itu baseline hanya aman bila 3 migration lama **diarsipkan** (dipindah dari `prisma/migrations`, riwayat git tetap ada) dalam commit yang sama dengan penambahan baseline.

## 5. Mengapa `prisma migrate dev` Tidak Aman Saat Ini

1. `migrate dev` memutar ulang **seluruh riwayat** di shadow database, membandingkannya dengan `schema.prisma`, lalu membuat migration baru untuk selisihnya. Dengan riwayat lama, selisih itu adalah SQL destruktif di §4 (terbukti lewat `migrate diff`: 136 baris termasuk DROP).
2. Terhadap DB yang dibuat dengan `db push` (DB dev tidak punya `_prisma_migrations`), `migrate dev` mendeteksi drift dan **menawarkan reset schema**, yang menghapus semua data. Di terminal interaktif ini cukup satu konfirmasi.
3. `migrate dev` membutuhkan hak membuat shadow database. Akun production biasanya tidak punya hak itu, dan `migrate dev` memang tidak pernah boleh dijalankan ke production.
4. Bahkan setelah baseline diadopsi, `migrate dev` hanya boleh dipakai di **DB pengembangan sekali pakai**. Migration baru diuji di DB sementara, lalu diterapkan ke DB berisi data dengan `migrate deploy`.

Dokumentasi repo masih menyarankan perintah berisiko: `DOCKER_SETUP.md:80-85` menyarankan `migrate deploy` dengan riwayat lama. Untuk DB Docker baru, perintah itu membangun schema yang salah.

## 6. Line Ending & Checksum (uji baru Phase 15)

| Pemeriksaan | Hasil |
|---|---|
| Penyimpanan di git | `i/lf` (LF) untuk proposal baseline, 3 migration lama, dan `schema.prisma` |
| Working copy di mesin ini | `w/crlf` (`core.autocrlf=true`, tanpa `.gitattributes`) |
| SHA-256 file baseline | CRLF `ad9f57fc…` (dipakai Phase 14) vs LF `36b23ae0…`, berbeda |
| Deploy dari salinan CRLF, lalu `migrate status` + `migrate deploy` dari salinan LF (DB sementara) | "Database schema is up to date!" dan "No pending migrations"; **tidak ada error** pada Prisma 5.22 |

**Kesimpulan:** perbedaan line ending antara checkout Windows dan Linux (Vercel/CI) **tidak memblokir** `migrate status`/`deploy` pada versi Prisma saat ini. Checksum yang tercatat tetap bergantung pada mesin yang menjalankan, dan perilaku `migrate dev` terhadap checksum yang berbeda **tidak diuji**. Rekomendasi: tambahkan `.gitattributes` (`prisma/migrations/**/*.sql text eol=lf`) agar checksum deterministik di semua mesin.

## 7. Informasi Production yang Belum Diketahui

| # | Informasi | Mengapa penting |
|---|---|---|
| 1 | Penyedia dan versi PostgreSQL production (Vercel Postgres/Neon/Supabase/lainnya) | Kompatibilitas SQL baseline (diuji di PG 15) |
| 2 | Apakah production punya `_prisma_migrations`, dan isinya | Menentukan jalur adopsi (skenario B vs D) |
| 3 | Drift production terhadap `schema.prisma` (hasil `migrate diff` read-only) | Resolve hanya aman bila "No difference" |
| 4 | Volume data, ukuran DB, jendela pemeliharaan | Durasi backup/restore dan migration lanjutan (P-9) |
| 5 | Ketersediaan backup otomatis / PITR dan prosedur restore yang teruji | Rollback |
| 6 | Connection pooling (PgBouncer/pooler) | `schema.prisma` belum punya `directUrl`; perintah migration lewat pooler mode transaksi bisa gagal (advisory lock Prisma) |
| 7 | Hak akses akun DB (CREATE, ALTER, pemilik tabel) | Resolve/deploy dan migration lanjutan |
| 8 | Siapa yang memegang credential dan mengeksekusi | Akuntabilitas; credential belum dirotasi |
| 9 | Apakah build Vercel menjalankan migration | Saat ini **tidak**: `build` = `prisma generate && next build`, dan tidak ada `vercel.json`. Ini harus tetap begitu. |
| 10 | Apakah DB yang dipakai Vercel sama dengan yang dipakai admin untuk approval | Konsistensi data (catatan checklist Vercel) |

**Skenario D (belum diuji, butuh info #2):** production sudah memiliki baris 3 migration lama di `_prisma_migrations`, lalu schema-nya dimutakhirkan dengan `db push`. Setelah migration lama diarsipkan, Prisma akan melaporkan migration yang "applied but missing locally". Jalur aman harus diuji dulu di DB sementara yang meniru kondisi itu (schema dari dump struktur production, tanpa data) sebelum diputuskan.

## 8. Temuan Migration

#### MIG-01 — Riwayat migration tidak dapat membangun schema saat ini
| | |
|---|---|
| Severity | High |
| Bukti | Phase 14 skenario C dan §3: migration lama menghasilkan 10 tabel / 92 kolom vs schema 12 / 131; `migrate diff` ke schema berisi DROP |
| Akar masalah | Schema dikembangkan dengan `db push` tanpa membuat migration |
| File | `prisma/migrations/*`, `DOCKER_SETUP.md` |
| Dampak DB | DB baru dari `migrate deploy` salah; "migration maju" destruktif |
| Usulan | Adopsi baseline (§2, §3) + arsipkan migration lama |
| Migration | Ya (adopsi = resolve; tanpa SQL di DB berisi data) |
| Kriteria terima | DB baru dari `migrate deploy` identik dengan `schema.prisma`; DB dev/production "up to date" tanpa perubahan data |
| Uji regresi | Ulangi skenario A/B Phase 14 + seluruh suite QA di DB baseline |

#### MIG-02 — Baseline + migration lama dalam satu folder gagal (P3018)
| | |
|---|---|
| Severity | High (bila terjadi) |
| Bukti | Phase 14 skenario C |
| Akar masalah | Urutan nama folder; objek dibuat dua kali |
| File | `prisma/migrations/` |
| Dampak DB | DDL di-rollback, tetapi baris migration gagal memblokir deploy berikutnya sampai `migrate resolve --rolled-back` |
| Usulan | Satu commit: arsipkan lama + tambah baseline. Pemeriksaan CI: folder `prisma/migrations` tidak boleh berisi migration bertanggal sebelum baseline. |
| Migration | — |
| Kriteria terima | CI menolak commit yang berisi keduanya |
| Uji regresi | Langkah CI `migrate deploy` ke DB kosong |

#### MIG-03 — `migrate dev` dapat menghapus data
| | |
|---|---|
| Severity | High |
| Bukti | §5 |
| Akar masalah | Riwayat tidak konsisten dan DB dev tanpa `_prisma_migrations` |
| File | Dokumentasi developer |
| Dampak DB | Reset schema (kehilangan semua data) setelah satu konfirmasi |
| Usulan | Larangan tertulis di `DOCKER_SETUP.md`/README; `migrate dev` hanya ke DB sekali pakai; pertimbangkan skrip pembungkus yang menolak DB non-sementara |
| Migration | — |
| Kriteria terima | Dokumentasi diperbarui; skrip pembungkus menolak `diagnova_v2` |
| Uji regresi | — |

#### MIG-04 — Kondisi production tidak diketahui
| | |
|---|---|
| Severity | High (blocking) |
| Bukti | §7 |
| Akar masalah | Tidak ada akses/izin ke production selama audit |
| File | — |
| Dampak DB | Risiko resolve pada schema yang drift |
| Usulan | Pemilik menyediakan info #1–#10; `migrate diff` read-only + dump **struktur** (`pg_dump --schema-only`) untuk uji skenario D di DB sementara |
| Migration | — |
| Kriteria terima | Semua butir §7 terjawab dan terdokumentasi |
| Uji regresi | Skenario D di DB sementara |

#### MIG-05 — Dokumentasi Docker menyarankan perintah yang membangun schema salah
| | |
|---|---|
| Severity | Medium |
| Bukti | `DOCKER_SETUP.md:80-85` |
| Akar masalah | Ditulis sebelum diketahui riwayatnya rusak |
| File | `DOCKER_SETUP.md` |
| Dampak DB | DB Docker baru salah schema |
| Usulan | Sampai baseline diadopsi: `prisma db push` untuk DB lokal **kosong** saja; setelah adopsi: `migrate deploy` |
| Migration | — |
| Kriteria terima | Mengikuti dokumen menghasilkan DB identik dengan schema |
| Uji regresi | Ikuti dokumen di DB sementara |

#### MIG-06 — Line ending tidak deterministik
| | |
|---|---|
| Severity | Low |
| Bukti | §6 |
| Akar masalah | `core.autocrlf=true` tanpa `.gitattributes` |
| File | **baru** `.gitattributes` |
| Dampak DB | Checksum di `_prisma_migrations` berbeda per mesin; tidak memblokir deploy/status (teruji) |
| Usulan | `.gitattributes`: `prisma/migrations/**/*.sql text eol=lf` |
| Migration | — |
| Kriteria terima | Checksum sama di Windows dan Linux |
| Uji regresi | Hash file setelah checkout ulang |

#### MIG-07 — Tidak ada `directUrl` untuk migration lewat pooler
| | |
|---|---|
| Severity | Low (bergantung info production #6) |
| Bukti | `schema.prisma` hanya punya `url = env("DATABASE_URL")` |
| Akar masalah | Konfigurasi awal |
| File | `prisma/schema.prisma`, env production |
| Dampak DB | Perintah migration via pooler mode transaksi bisa gagal atau menggantung |
| Usulan | Tambahkan `directUrl = env("DIRECT_DATABASE_URL")` bila production memakai pooler (perubahan env = NEEDS APPROVAL) |
| Migration | Tidak (konfigurasi) |
| Kriteria terima | `migrate status` berjalan lewat koneksi langsung |
| Uji regresi | — |

## 9. Runbook Adopsi (TIDAK dijalankan; untuk persetujuan)

1. **[Repo]** Satu commit:
   - pindahkan `prisma/migrations/2026101*` ke `prisma/migrations_legacy/`;
   - tambah `prisma/migrations/20261117000000_baseline/migration.sql` (isi = proposal);
   - tambah `.gitattributes`;
   - perbarui `DOCKER_SETUP.md`.
2. **[DB sementara]** Ulangi skenario A, B, dan C; jalankan seluruh suite QA di DB baseline. Wajib hijau.
3. **[DB dev utama]** Setelah persetujuan:
   - backup;
   - uji restore;
   - `migrate diff` (exit 0);
   - `migrate resolve --applied`;
   - `migrate status`;
   - fingerprint sebelum/sesudah identik.
4. **[Production]** Hanya setelah §7 lengkap dan persetujuan terpisah: langkah yang sama dengan langkah 3, pada jendela pemeliharaan, dengan rencana rollback (restore backup langkah 3; `resolve` sendiri tidak mengubah data).
5. **[Sesudahnya]** Migration lanjutan (P-9, P-1 B, P-1.5, P-2 B, P-7.3) satu per satu: uji di DB sementara → persetujuan → `migrate deploy`.

## 10. Penilaian

| Aspek | Penilaian |
|---|---|
| Baseline benar secara struktur | **Ya** (terbukti) |
| Aman untuk DB baru | **Ya**, dengan syarat §2 |
| Aman untuk DB berisi data | **Ya**, dengan syarat §3 (resolve, tanpa SQL). Terbukti pada DB sintetis bentuk `db push`. |
| Siap untuk production | **Belum dapat dinilai.** Info §7 belum ada (MIG-04 blocking). |
| Tindakan pada DB persisten di Phase 15 | **Tidak ada** |
