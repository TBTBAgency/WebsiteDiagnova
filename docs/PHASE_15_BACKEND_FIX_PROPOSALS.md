# Phase 15 — Backend Fix Proposals

Tanggal: 17 November 2026 · Branch: `artha`

**Status: PROPOSAL. Belum ada yang diimplementasikan, dan semua butir menunggu persetujuan.**

ID temuan merujuk ke [`PHASE_15_DATABASE_INTEGRITY_AUDIT.md`](PHASE_15_DATABASE_INTEGRITY_AUDIT.md). Butir yang memerlukan migration hanya boleh dikerjakan **setelah baseline diadopsi** (lihat [`PHASE_15_MIGRATION_SAFETY_REVIEW.md`](PHASE_15_MIGRATION_SAFETY_REVIEW.md)).

Prinsip yang dipakai di semua proposal:
1. Otorisasi ADMIN-only (`requireAdmin` di handler + middleware) tidak berubah.
2. LIS tetap modul demonstrasi. Tidak ada data pasien nyata, alur klinis baru, atau model tenant.
3. Integritas dijaga di DB bila memungkinkan (unique/constraint/transaksi), bukan hanya pemeriksaan sebelum insert.
4. Aturan bisnis lead tidak diubah tanpa persetujuan; setiap usulan yang mengubahnya diberi tanda **[BISNIS]** dan dampaknya dijelaskan.
5. Setiap perubahan disertai uji yang dijalankan di **DB sementara**, tidak pernah di DB dev utama.

---

## P-0 Fondasi Bersama (tanpa migration)

| Komponen | Isi |
|---|---|
| `lib/errors.ts` | `DomainError(message, httpStatus)` sebagai induk `LeadWorkflowError`, `UserManagementError`, `SiteContentError`, dan `LisError` baru. Helper `toHttpError(err)` memetakan: `DomainError` → status-nya; Prisma `P2002` → 409 (field dari `meta.target`, tanpa nilai); `P2003` → 400; `P2025` → 404; zod → 400; lainnya → 500 dengan pesan generik. |
| `lib/datetime.ts` | `BUSINESS_TIMEZONE = "Asia/Jakarta"`; `businessDateParts(date)` dengan `Intl.DateTimeFormat`; `parseBusinessDate("YYYY-MM-DD")` → rentang UTC `[start, endExclusive)`; formatter tampilan/CSV. Menangani DB-10, LEAD-03, LIS-03, dan LEAD-04. |
| Tulisan bersyarat | Konvensi: transisi status selalu `updateMany({ where: { id, status: { in: allowed } } })` lalu cek `count`; lock optimistik CMS memakai `updateMany({ where: { sectionKey, updatedAt: base } })`. `assertNotStale` + `upsert` diganti dengan update bersyarat (DB-05). |
| Audit di transaksi | `recordAuditLog(data, tx?)` menerima klien transaksi, sehingga aksi dan jejaknya commit atau rollback bersama (DB-04) |
| Harness uji | `scripts/qa/lib/disposable-db.mjs`: membuat DB sementara (nama berprefiks `diagnova_qa_tmp_`, `COMMENT` penanda), `migrate deploy` baseline / `db push`, seed sintetis, dan drop hanya bila penanda cocok. Semua tes konkurensi baru memakai harness ini. |

## P-1 Penomoran Order & Barcode LIS — LIS-02, LIS-03

### Mengapa retry saja tidak cukup
- Pola sekarang adalah "baca MAX lalu +1" **di luar** transaksi. Pada N request serentak, semua membaca MAX yang sama; retry membaca ulang MAX yang lagi-lagi sama untuk sebagian besar request. Jumlah percobaan tumbuh kira-kira O(N) per request, dan tanpa backoff yang tepat bisa melebihi batas sehingga request tetap gagal.
- P2002 di dalam transaksi interaktif PostgreSQL membatalkan **seluruh** transaksi (order + item + spesimen), sehingga retry berarti mengulang semua langkah.
- Barcode adalah counter harian **bersama** untuk semua order. Tiap order mengalokasikan 1..k barcode, sehingga tabrakan barcode tetap terjadi walau nomor order sudah berbeda.
- Overflow leksikal setelah 9999 (LIS-03) membuat retry tidak pernah berhasil.
- Kesimpulan: retry hanya jaring pengaman untuk kasus langka. Yang dibutuhkan adalah **alokasi nomor atomik di dalam transaksi yang sama dengan insert**.

### Opsi A — Advisory lock per hari (tanpa migration)

```ts
await db.$transaction(async (tx) => {
  const { ymd } = businessDateParts(new Date());                 // Asia/Jakarta
  await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${"lis-numbering:" + ymd}))`;
  const [{ next_order }] = await tx.$queryRaw<{ next_order: number }[]>`
    SELECT COALESCE(MAX(CAST(split_part(order_number, '-', 3) AS integer)), 0) + 1 AS next_order
    FROM lab_orders WHERE order_number LIKE ${"ORD-" + ymd + "-%"}`;
  const [{ next_bc }] = await tx.$queryRaw<{ next_bc: number }[]>`
    SELECT COALESCE(MAX(CAST(split_part(barcode_number, '-', 3) AS integer)), 0) + 1 AS next_bc
    FROM specimens WHERE barcode_number LIKE ${"SP-" + ymd.slice(2) + "-%"}`;
  // insert order + items + specimens (barcodes next_bc .. next_bc+k-1)
}, { timeout: 10_000 });
```

| Karakteristik | Keterangan |
|---|---|
| Kelebihan | Tanpa migration; nomor berurutan tanpa celah; lock dilepas otomatis saat commit/rollback; MAX numerik (bukan leksikal) menghilangkan bug 9999 |
| Kekurangan | Pembuatan order tersérialisasi per hari (cukup untuk demo: ±10–30 ms per order); `MAX` memindai index `LIKE prefix%` (memadai, index unique sudah ada); memperkenalkan raw SQL pertama di kode aplikasi (selalu parameterized `$queryRaw` tagged template, tidak pernah `Unsafe`) |
| Catatan | `hashtext` bisa bertabrakan antar kunci lain, tetapi dampaknya hanya serialisasi berlebih, bukan kesalahan |

### Opsi B — Tabel counter (direkomendasikan jangka panjang; perlu migration)

```sql
CREATE TABLE lis_number_sequences (
  scope       varchar(20) NOT NULL,      -- 'ORDER' | 'SPECIMEN'
  period      date        NOT NULL,      -- tanggal bisnis (Asia/Jakarta)
  last_value  integer     NOT NULL,
  updated_at  timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (scope, period)
);
-- alokasi n nomor sekaligus, atomik, di dalam transaksi pembuatan order:
INSERT INTO lis_number_sequences (scope, period, last_value) VALUES ($1, $2, $3)
ON CONFLICT (scope, period) DO UPDATE SET last_value = lis_number_sequences.last_value + EXCLUDED.last_value,
                                          updated_at = CURRENT_TIMESTAMP
RETURNING last_value;          -- nomor terakhir; rentang = last_value - n + 1 .. last_value
```

| Karakteristik | Keterangan |
|---|---|
| Kelebihan | Lock baris per (scope, hari), sehingga kontensi minimal dan konstan; rentang barcode dialokasikan sekali; gapless karena counter ikut rollback bersama transaksi; siap untuk operasional (counter per lokasi/lab bisa ditambah kelak tanpa mengubah format) |
| Kekurangan | Butuh migration dan backfill: `INSERT … SELECT MAX(...)` per hari dari data yang ada, dijalankan dalam migration yang sama |
| Unique tetap dipertahankan | `order_number` dan `barcode_number` unique tetap menjadi pertahanan terakhir |

### Format & zona waktu
- Format tetap `ORD-YYYYMMDD-NNNN` / `SP-YYMMDD-NNNN`, lebar **minimal** 4 digit tanpa batas atas (`10000` sah).
- Tanggal diambil dari `Asia/Jakarta`.
- Pengurutan nomor selalu numerik; nomor tidak pernah diturunkan dari sort string.

### P-1.5 Idempotensi (LIS-06)
- Klien membuat `crypto.randomUUID()` per pengiriman form dan mengirimnya sebagai `Idempotency-Key`.
- Server: kolom `lab_orders.idempotency_key varchar(64) UNIQUE NULL`. Insert dilakukan di transaksi yang sama.
- Bila P2002 terjadi pada `idempotency_key`, server mengembalikan order yang sudah ada (200, `Idempotent-Replay: true`).
- Kunci yang sama dengan payload berbeda → 422 (hash payload disimpan).
- Tanpa migration (sementara): tombol dinonaktifkan selama request berjalan. Ini hanya mengurangi risiko, bukan solusi.

### Rekomendasi
- **Sekarang:** opsi A (tanpa migration) + format/zona waktu + pemetaan error.
- **Setelah baseline diadopsi:** migrasi ke opsi B + P-1.5 dalam satu migration.

## P-2 Urutan Prioritas Worklist — LIS-01

**[KEPUTUSAN KLINIS]** Urutan yang diusulkan: **CITO (0) → URGENT (1) → ROUTINE (2)**, lalu `ordered_at DESC`. Bila pemilik menetapkan URGENT di atas CITO, cukup ubah tabel rank.

| Opsi | Cara | Migration |
|---|---|---|
| A (sekarang) | `$queryRaw` mengambil ID terurut: `SELECT id FROM lab_orders WHERE … ORDER BY CASE priority WHEN 'cito' THEN 0 WHEN 'urgent' THEN 1 ELSE 2 END, ordered_at DESC, id LIMIT $n OFFSET $m`, lalu `findMany({ where: { id: { in: ids } }, include })` dan susun ulang mengikuti urutan ID. Filter (status/prioritas/pencarian) dibangun sebagai fragmen `Prisma.sql` yang parameterized. `count` tetap lewat Prisma. | Tidak |
| B (nanti) | Kolom `priority_rank smallint NOT NULL` yang diisi aplikasi saat create/update (atau kolom generated via raw SQL di migration) + index `(priority_rank, ordered_at DESC)`; Prisma `orderBy: [{ priorityRank: "asc" }, { orderedAt: "desc" }]` | Ya |
| Ditolak | Mengubah urutan enum PostgreSQL | PostgreSQL tidak bisa mengurutkan ulang label enum. Caranya harus membuat tipe baru + `ALTER COLUMN … USING` + `DROP TYPE` lama: berisiko dan tidak perlu. |

- `id` ditambahkan sebagai tie-breaker agar paginasi stabil (tidak ada baris ganda atau hilang antar halaman).
- Diterapkan juga di `app/api/admin/overview/route.ts` (order terbaru dashboard).

## P-3 Validasi Input LIS — LIS-04

zod di `lib/validations/lis.ts`:

| Schema | Aturan |
|---|---|
| `createPatientSchema` | `mrn` trim 1–50 `[A-Za-z0-9-/]`; `name` 1–120; `birthDate` `YYYY-MM-DD`, tidak di masa depan, ≥ 1900-01-01; `sex` `male\|female` (sesuai enum `gender`; label UI terpisah); `nationalId` opsional, 16 digit; `phone` opsional ≤ 30; `address` opsional ≤ 500 |
| `createOrderSchema` | `patientId` string 1–40; `physicianId` opsional; `sourceLocation` ≤ 100, default "Poliklinik"; `priority` `routine\|cito\|urgent` (nilai lain → 400; tidak lagi diam-diam ROUTINE); `clinicalNotes` ≤ 2000; `testCatalogCodes` array 1–30 string ≤ 50, unik setelah uppercase |
| `rejectSpecimenSchema` | `reason` trim 3–500 |
| Parameter barcode | `^SP-\d{6}-\d{4,}$` |

Aturan tambahan:
- Kode tes yang tidak dikenal atau nonaktif → **400** dengan daftar kodenya (sebelumnya dibuang diam-diam).
- Pasien atau dokter tidak ditemukan → 400 (dicek di transaksi; P2003 dipetakan).
- P2002 pada `mrn` vs `national_id` → pesan 409 yang tepat, tanpa menyebut nilainya.
- Semua controller LIS memakai `toHttpError` (P-0). Error DB tidak lagi menjadi 400 di receive/reject, dan error domain tidak lagi 500 di create.

## P-4 State Machine Spesimen — LIS-05

**[KEPUTUSAN LAB]** Tabel transisi yang diusulkan (perlu persetujuan):

| Dari \ Ke | RECEIVED_IN_LAB | REJECTED |
|---|---|---|
| COLLECTED | ✔ | ✔ |
| RECEIVED_IN_LAB | ✖ (409 "sudah diterima") | ✔ (penolakan pasca-terima, mis. hemolisis), **atau** ✖, tergantung keputusan |
| REJECTED | ✖ | ✖ |
| PROCESSING / ARCHIVED | ✖ | ✖ |

Implementasi, seluruhnya dalam satu transaksi:
1. `updateMany({ where: { barcodeNumber, status: { in: allowedFrom } }, data })`; `count === 0` → baca status → 409/404.
2. Rekalkulasi status order: semua spesimen non-REJECTED berstatus RECEIVED dan minimal satu ada → `SPECIMEN_RECEIVED`; semua REJECTED → status yang disepakati (mis. tetap `ORDERED` dengan flag, atau `CANCELLED` **[KEPUTUSAN]**).
3. Audit dengan `userId` aktor (`guard.session.userId`).

## P-5 Transaksi Approve & Konsumsi Magic Link — DB-04, DB-03, LEAD-06

Approve, dalam satu `$transaction` interaktif (isolation `ReadCommitted` + lock baris):
1. `SELECT … FROM leads WHERE id = $1 FOR UPDATE` (via `$queryRaw`), sehingga approve/reject serentak pada lead yang sama tersérialisasi.
2. Validasi eligibility (lihat P-6.5).
3. `user.upsert({ where: { email }, create: …, update: { demoDurationDays, status: 1 } })` (mengganti find-then-create yang bisa P2002).
4. Nonaktifkan link aktif + buat link baru.
5. Update lead + audit (`recordAuditLog(…, tx)`).

`getAppBaseUrl()` tetap divalidasi sebelum transaksi.

Konsumsi Magic Link:
- Langkah 1 (atomik, sudah ada) dipindah ke dalam transaksi bersama: upsert user, tautkan user ke link/lead, aktivasi masa demo, audit, dan transisi 2→3.
- Bila ada langkah gagal, **token tidak ikut terpakai** (rollback), sehingga klien dapat mencoba lagi.
- Cookie sesi baru di-set setelah commit.

Kriteria: uji injeksi kegagalan dan uji konkurensi (lihat §T).

## P-6 Leads & Dashboard

### P-6.1 Export CSV — LEAD-01
- `lib/models/lead-export.model.ts`: `iterateLeadsForExport(filter)` dengan cursor `(createdAt DESC, id DESC)`, batch 500, batas `EXPORT_MAX_ROWS = 10000` (header `X-Export-Truncated: true` + baris catatan bila terpotong).
- Filter: `buildLeadWhere(query)` dipakai bersama oleh daftar dan ekspor, sehingga hasilnya dijamin sama. UI menambahkan query filter aktif ke URL ekspor.
- Format: tanggal `Asia/Jakarta` (`dd/MM/yyyy HH:mm`).
- Telepon: netralisasi formula tetap dipakai untuk semua sel. Bentuk `="+62…"` tidak dipakai, karena justru formula. Pilihan untuk kolom telepon: tulis `62…` tanpa `+` di kolom "Telepon (E.164 tanpa +)", atau pertahankan `'+62` dengan catatan di header. **[PILIHAN FORMAT]**
- Respons di-stream (`ReadableStream`) agar memori konstan.

### P-6.2 Validasi query daftar lead & filter tanggal — LEAD-02, LEAD-03
- `leadListQuerySchema`:
  - `page` coerce int ≥ 1 default 1;
  - `limit` coerce int 1–100 default 10 (nilai rusak → default, konsisten dengan `clampInt` LIS);
  - `status` 1–4 | all;
  - `approvalStatus` enum | all;
  - `institutionType` enum | all;
  - `search` ≤ 100;
  - `startDate`/`endDate` `YYYY-MM-DD`, dengan `start ≤ end` dan rentang ≤ 366 hari.
- Tanggal tidak valid → **400** dengan pesan field.
- Rentang: `gte = start 00:00 WIB`, `lt = (end + 1 hari) 00:00 WIB` (batas atas eksklusif).

### P-6.3 Statistik dashboard — LEAD-04
- Timeline: satu query agregat per jenis (parameterized `$queryRaw`):
  ```sql
  SELECT (created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta')::date AS d, count(*)::int
  FROM leads WHERE created_at >= $from GROUP BY 1
  ```
  Hal yang sama untuk `lab_orders.ordered_at`. Hari kosong diisi 0 di aplikasi.
  - Alternatif tanpa raw SQL: `findMany({ where: { createdAt: { gte: from } }, select: { createdAt: true } })` (≤ 14 hari) lalu bucket WIB di aplikasi.
- Order terbaru memakai urutan P-2.
- `activeUsers` hanya role USER. `recentAuditLogs`: isi 10 entri terakhir, atau hapus dari kontrak.
- Kartu "Baru" **tidak diubah** (aturan bisnis: form → Dihubungi). Ditambahkan keterangan "hanya data lama" **[BISNIS: tanpa perubahan aturan]**.

### P-6.4 Drawer lead — LEAD-05
- Tampilkan pemutus keputusan dan waktunya untuk APPROVED dan REJECTED; `updatedAt`; jumlah tautan dari `/history`.
- Default durasi pada form approval mengikuti P-6.6.

### P-6.5 Aturan re-approve — LEAD-06 **[BISNIS]**

| Butir | Perilaku sekarang | Usulan | Dampak bila disetujui |
|---|---|---|---|
| Approve atas REJECTED | Diizinkan langsung | Tetap diizinkan, tetapi audit mencatat `REOPENED_AND_APPROVED` | Tidak ada perubahan alur; hanya jejak lebih jelas |
| Approve ulang ketika demo sudah berakhir | Link terbit tetapi pasti ditolak `demo_expired` | 409: "Masa demo berakhir — gunakan Perpanjang Akses" (sama dengan jalur User Management) | Admin tidak lagi mengirim tautan mati |
| Approve ulang menimpa `approvedAt/approvedBy` | Ya | Pertahankan nilai pertama; penerbitan ulang tercatat sebagai `MAGIC_LINK_REISSUED` | Laporan "disetujui pada" tetap akurat |
| Reject lead yang aksesnya aktif (LEAD-08) | Akses tetap sampai berakhir | Opsi: akhiri akses (`demo_expires_at = now`) **atau** biarkan | Klien yang ditolak kehilangan akses seketika |

### P-6.6 Default durasi demo — DB-06 **[BISNIS]**
- Tetapkan satu nilai default. Usulannya **7 hari**, sesuai teks UI/WA dan `approveLead`.
- Implementasi tanpa migration: form approval selalu memakai `DEFAULT_DEMO_DAYS` bila lead belum pernah disetujui, dan `createLead` menulis `demoDurationDays: DEFAULT_DEMO_DAYS` secara eksplisit.
- Setelah baseline: `@default(7)` lewat migration.
- Dampak: lead baru yang disetujui tanpa mengubah angka mendapat 7 hari, bukan 3 seperti perilaku efektif saat ini.

## P-7 CMS: Hardening & Soft Delete — CMS-01..07

### P-7.0 DTO publik (prasyarat, tanpa migration) — CMS-02
`toPublicSection(row)` hanya berisi kolom teks dan field `extraContent` yang dipakai komponen. `extraContent` mentah dan `updatedBy` tidak pernah dikirim ke komponen klien. Berlaku untuk homepage dan CTA halaman dalam.

### P-7.1 Hardening CMS hub — CMS-03, CMS-04
- zod per `type` (`section`, `slide`, `partner`, `comparison`, `testimonial`, `navigation`, `solution_item`), dengan `isSafeCmsUrl` untuk semua URL.
- Whitelist `sectionKey` yang boleh disentuh hub: `hero`, `trusted_by`, `about`, `comparison`, `workflow`, `infrastructure`, `testimonials`, `cta`, `navigation`, `page_solutions.items`.
- `type:"section"` melakukan **merge** pada key milik hub. Hub tidak lagi mengedit `page_platform`/`page_nova_ai` (dipindah ke Halaman & Section), atau kunci `hero.*` dilindungi.
- Locking: setiap tulisan hub menerima `baseUpdatedAt`; update bersyarat atomik (`updateMany where updatedAt = base`); 409 bila basi.
- Menu: edit induk mengabaikan `submenus` dari payload; operasi `move` eksplisit (hapus dari induk lama + tambah ke induk baru dalam satu tulisan); validasi id unik lintas induk/anak.

### P-7.2 Soft delete level item (tanpa migration)

**Bentuk data.** Setiap item array JSON menerima `deletedAt?: string | null` dan `deletedBy?: string | null`. Item yang dihapus tetap di array dengan `sortOrder` aslinya.

| Aspek | Desain |
|---|---|
| Rendering publik | Filter `!deletedAt && isActive !== false` di setiap pembaca server: `getCmsHomepageContent`, `publicFooter`, `publicFaq`, `publicAnnouncement`, `toPublicLayout`, `getCmsPageHero`, dan `getCmsNavigationMenus` (`/api/menus`). DTO publik (P-7.0) memastikan item terhapus tidak ada di payload. **Catatan:** beberapa komponen jatuh ke konten bawaan hardcoded bila daftar kosong (`Hero.tsx:127`, `TrustedByBar:26`, `Testimonials:57`, `Comparison:62`, Navbar `:608, :631`). Bila semua item dihapus, konten demo statis akan muncul. Komponen perlu membedakan "belum pernah disimpan" dari "sengaja kosong". |
| Daftar admin | Default menyembunyikan item terhapus; tab **Sampah** per entitas menampilkan item terhapus dengan `deletedAt/deletedBy`. Batas `.max()` zod hanya menghitung item yang tidak dihapus. |
| Pulihkan | Mengosongkan `deletedAt`; item kembali ke `sortOrder` lama. Bila bertabrakan, item ditempatkan di akhir (layout di-renormalisasi ×10). Simpan-by-id atas item di Sampah ditolak (409) sampai dipulihkan. |
| Hapus permanen | Hanya dari Sampah, oleh ADMIN, dengan konfirmasi. Item yang dihapus permanen dicatat lengkap di audit (`oldValue`). Opsional: purge otomatis setelah N hari **[KEPUTUSAN]**. |
| Unique | `sectionKey` tidak terpengaruh (baris tidak pernah di-soft-delete). Id item tetap unik **termasuk** item di Sampah (`uniqueIds` sudah menghitung semua item). Slug item solusi tidak boleh dipakai ulang selama masih di Sampah. |
| Relasi | FAQ: kategori tidak bisa dihapus bila dipakai item aktif. Item di Sampah yang merujuk kategori yang kemudian dihapus permanen dipulihkan ke "Umum" **[KEPUTUSAN]**. Layout: section kustom di Sampah tidak dirender dan tidak dihitung batas 40. Metrik hero: maks. 6 aktif. |
| Navigasi | Menghapus induk menandai induk saja. Anak tersembunyi secara efektif karena induk tersembunyi, tetapi `deletedAt` anak tidak diubah. Pulihkan induk mengembalikan anak sesuai status masing-masing. Submenu yang dihapus sendiri tetap di Sampah. Anchor `/#sectionKey` tidak berubah. |
| Media | Soft delete **tidak** menghapus berkas; gambar tetap direferensikan item di Sampah sehingga pulihkan utuh. Penghapusan berkas hanya lewat job purge (Phase 16) yang memindai referensi di seluruh `extraContent`, termasuk `logoUrl` footer dan `content.imageUrl` section kustom. |
| Resolver & schema | Semua resolver (`resolveFooter`, `resolveFaq`, `resolveAnnouncement`, `resolvePageLayout`, `stored.push`) dan zod (`contentSchema` `.strict()`) diperbarui agar mempertahankan `deletedAt/deletedBy` (CMS-06) |
| Audit | `CMS_ITEM_SOFT_DELETED`, `CMS_ITEM_RESTORED`, `CMS_ITEM_PURGED` dengan `oldValue` berisi item lengkap |

Jalur tulis yang harus diubah:
- `cms.model.ts`: `deleteHeroSlide`, `deleteTrustedPartner`, `deleteComparisonItem`, `deleteTestimonialItem`, `deleteCmsNavigationMenu`, `delete{Solution,Module,Integration}Item`, dan `updateCmsSection` (merge);
- `savePageLayout` (section kustom), `savePageHero` (metrik), `saveSiteContent` (kolom/link/sosial footer, item/kategori FAQ, tombol announcement);
- UI: `cms/page.tsx`, `page-sections/page.tsx`, `site-content/page.tsx`.

### P-7.3 Riwayat revisi (perlu migration, setelah baseline)
- Tabel `cms_section_revisions(id, section_key, version, snapshot jsonb, created_by, created_at, reason)`.
- Snapshot ditulis di transaksi yang sama sebelum setiap simpan; tambah `cms_sections.version int` untuk compare-and-swap.
- Menutup semua jalur penggantian (termasuk skrip), dan memungkinkan UI "versi sebelumnya".
- Perlu kebijakan retensi (mis. 50 revisi per key).

### Opsi yang tidak direkomendasikan
`deleted_at` level baris pada `cms_sections`: baris adalah singleton yang tidak pernah dihapus, dan `section_key` unique akan menghalangi pembuatan ulang (perlu partial unique index).

## P-8 Paginasi — DB-08, LIS-08
- `GET /api/admin/users?page&limit` (≤ 100) dengan `orderBy createdAt desc, id`.
- Audit log memakai cursor `(createdAt, id)`.
- Daftar dokter `take` ≤ 200 + pencarian.
- Homepage hanya membaca key homepage.
- Halaman Order LIS berpaginasi, dan metriknya diambil dari agregat DB.
- DTO daftar order tanpa NIK/alamat/telepon.

## P-9 Paket Higiene Schema (perlu migration, setelah baseline)

Satu migration, diuji di DB sementara dulu, berisi:
1. Hapus 4 `@@index` duplikat.
2. Index FK `users.role_id`, `demo_magic_links.user_id`, `lab_orders.physician_id`.
3. `CHECK` status leads (1–4) dan users (0–1).
4. Unique `lab_order_items(order_id, test_catalog_id)`.
5. Unique index `lower(email)` di `users`.
6. `decided_at/decided_by` (atau `rejected_*`) di leads + backfill.
7. Hapus enum `lead_status`, `user_role`, `user_status` (pastikan tidak ada dependensi).
8. `@default(7)` durasi demo bila P-6.6 disetujui.

Opsional dalam paket ini: `priority_rank` (P-2 B), `lis_number_sequences` + `idempotency_key` (P-1 B, P-1.5).

Wajib sebelum diterapkan:
- tidak ada data yang melanggar (cek `SELECT` di DB dev read-only);
- `migrate diff` hanya berisi pernyataan yang diharapkan.

## P-10 Seed — SEED-01..03
1. Ganti nama `scripts/seed_other_pages_cms.js` → `.ts` (isi sama). Perbarui `db:seed` di `package.json`. **Terverifikasi** di DB sementara bersih: rangkaian lengkap exit 0 dan idempoten.
2. Ganti `upsert({ update: {} })` dengan "isi bila kosong": isi `extraContent.<field>` hanya bila kosong/absen, jangan sentuh field yang sudah diisi admin. Log `CREATED / FILLED / SKIPPED`.
3. `prisma/seed.ts`: akun seed create-only (`update: {}`); tolak tanpa `SEED_ADMIN_PASSWORD` kecuali DB localhost + `NODE_ENV !== "production"`.
4. `sync_page_hero_defaults.js`: tulis hanya bila nilai berbeda.
5. Tambahkan `"seed:check"` yang menjalankan seed ×2 di DB sementara (harness P-0) untuk CI.

---

## §T Strategi Uji Regresi

| Kelompok | Tes baru / diperluas | Lingkungan |
|---|---|---|
| LIS penomoran | 20 POST serentak → 20×201, nomor unik; counter awal 9998 → 9999, 10000, 10001; `TZ=UTC` vs `Asia/Jakarta` → prefix WIB | DB sementara + server terikat ke DB itu |
| LIS prioritas | 3 prioritas acak → urutan rank; paginasi `limit=1` stabil | idem |
| LIS validasi | ≥ 20 kasus input tidak valid → 400, tidak ada 500, tidak ada PII di pesan | idem |
| LIS spesimen | Matriks transisi; terima/tolak serentak ×5; status order konsisten | idem |
| LIS idempotensi | 5 POST serentak dengan kunci sama → 1 order | idem |
| Approve/konsumsi | Approve ×5 serentak → 1 user, 1 link aktif; konsumsi ×3 → 1 sukses; injeksi kegagalan → tidak ada keadaan parsial, token tidak terbakar | idem |
| Leads | Matriks query (≥ 10); ekspor 0/1/120/250 + filter; batas tanggal WIB; timeline dengan data sintetis terkontrol | idem |
| CMS | Per entitas: hapus → tidak publik dan tidak di payload → Sampah → pulihkan; hub: validasi, whitelist, 409 basi, metrik hero utuh; menu: edit induk tidak mengubah anak, pindah → 1 salinan | idem |
| Seed | `db:seed` ×2 di DB kosong → identik; skenario pasca-gagal; akun nonaktif tetap nonaktif | DB sementara |
| Regresi penuh | Seluruh suite QA (401 + 3 check mode production), browser test yang dimasukkan ke repo (Phase 18) | DB sementara / klon |

Aturan: setiap tes yang menulis data hanya berjalan di DB yang dibuat oleh harness (penanda `COMMENT`), dan fingerprint DB dev dicek sebelum/sesudah.

---

## §Plan Urutan Implementasi yang Diusulkan

| Langkah | Isi | Temuan | Migration | Persetujuan yang dibutuhkan |
|---|---|---|---|---|
| 1 | P-0 fondasi + harness DB sementara | — | Tidak | Persetujuan mulai implementasi |
| 2 | P-3 validasi LIS + P-1 opsi A + P-2 opsi A | LIS-02, 03, 04, 01 | Tidak | Urutan CITO/URGENT |
| 3 | P-4 spesimen | LIS-05 | Tidak | Tabel transisi spesimen |
| 4 | P-6.1–6.3 ekspor, query, tanggal, dashboard | LEAD-01..04 | Tidak | Format kolom telepon |
| 5 | P-5 transaksi approve/konsumsi | DB-04, DB-03 | Tidak | — |
| 6 | P-6.4–6.6 drawer, re-approve, durasi | LEAD-05, 06, DB-06 | Tidak (kode) | **[BISNIS]** aturan re-approve & default durasi |
| 7 | P-7.0 + P-7.1 DTO publik & hardening hub/menu | CMS-02, 03, 04 | Tidak | — |
| 8 | P-7.2 soft delete item | CMS-01, 06, DB-09 | Tidak | Kebijakan purge |
| 9 | P-10 seed | SEED-01..03 | Tidak | — |
| 10 | P-8 paginasi | DB-08, LIS-08 | Tidak | — |
| 11 | **Adopsi baseline** (dokumen migration safety) | MIG-* | Resolve saja | **Wajib**: pemilik |
| 12 | P-9 paket higiene + P-1 B + P-1.5 + P-2 B + P-7.3 | DB-01, 02, 03, 07, LIS-06 | **Ya** | Per migration |
| 13 | Phase 16 storage (CMS-05) | CMS-05 | Opsional | Pilihan object storage |

Langkah 2–10 tidak bergantung pada baseline dan dapat dikerjakan bertahap dengan uji di DB sementara.

## §Files Berkas yang Diperkirakan Berubah

| Langkah | File |
|---|---|
| 1 | **Baru:** `lib/errors.ts`, `lib/datetime.ts`, `scripts/qa/lib/disposable-db.mjs`. **Ubah:** `lib/models/audit.model.ts` |
| 2 | `lib/models/order.model.ts`, `lib/controllers/lis.controller.ts`, `lib/models/patient.model.ts`, `lib/validations.ts` (atau **baru** `lib/validations/lis.ts`), `app/api/admin/overview/route.ts`, `scripts/qa/lis.test.mjs`, **baru** `scripts/qa/lis-concurrency.test.mjs` |
| 3 | `lib/models/specimen.model.ts`, `lib/controllers/lis.controller.ts`, `scripts/qa/lis.test.mjs` |
| 4 | `lib/controllers/lead.controller.ts`, `lib/models/lead.model.ts`, **baru** `lib/models/lead-export.model.ts`, `lib/validations.ts`, `app/api/admin/overview/route.ts`, `app/admin/(dashboard)/leads/page.tsx`, `app/admin/(dashboard)/dashboard/page.tsx`, `scripts/qa/admin.test.mjs`, **baru** `scripts/qa/leads-export.test.mjs` |
| 5 | `lib/models/lead.model.ts`, `lib/magic-link.ts`, `lib/models/user-magic-link.model.ts`, `scripts/qa/demo-workflow.test.mjs`, **baru** `scripts/qa/demo-concurrency.test.mjs` |
| 6 | `lib/models/lead.model.ts`, `lib/magic-link-eligibility.ts`, `app/admin/(dashboard)/leads/page.tsx`, `types/index.ts`, `scripts/qa/magic-link-eligibility.test.ts` |
| 7 | `lib/models/cms.model.ts`, `app/api/admin/cms/homepage/route.ts`, `app/(marketing)/page.tsx`, `components/sections/{Hero,TrustedByBar,ComparisonSection,TestimonialsSection,CTABanner}.tsx`, `lib/models/cms-layout.model.ts`, `app/admin/(dashboard)/cms/page.tsx`, `scripts/qa/cms.test.mjs` |
| 8 | `lib/models/cms.model.ts`, `lib/models/cms-layout.model.ts`, `lib/models/site-content.model.ts`, `lib/site-content.ts`, `lib/site-content-faq.ts`, `lib/cms-layout.ts`, `lib/cms-hero.ts`, `app/api/menus/route.ts`, `components/layout/Navbar.tsx`, `app/admin/(dashboard)/{cms,page-sections,site-content}/page.tsx`, `scripts/qa/{cms,cms-layout,site-content}.test.mjs` |
| 9 | `scripts/seed_other_pages_cms.js` → `scripts/seed_other_pages_cms.ts`, `scripts/sync_page_hero_defaults.js`, `prisma/seed.ts`, `package.json` |
| 10 | `lib/models/user.model.ts`, `app/api/admin/users/route.ts`, `app/admin/(dashboard)/users/page.tsx`, `lib/models/audit.model.ts`, `app/api/admin/audit-logs/route.ts`, `lib/models/physician.model.ts`, `app/admin/(dashboard)/orders/page.tsx`, `lib/models/order.model.ts` |
| 11 | `prisma/migrations/` (arsip 3 migration lama + folder baseline), `DOCKER_SETUP.md`, **baru** `.gitattributes` |
| 12 | `prisma/schema.prisma`, migration baru, model terkait |

Tidak ada perubahan pada middleware otorisasi, aturan status lead, atau data pasien yang sudah ada.

## §D Keputusan yang Dibutuhkan dari Pemilik

1. Mulai implementasi langkah 1–10 (tanpa migration).
2. Urutan prioritas klinis: CITO vs URGENT (P-2).
3. Tabel transisi spesimen dan status order bila semua tabung ditolak (P-4).
4. Aturan re-approve, demo berakhir, dan pencabutan akses saat reject (P-6.5).
5. Default durasi demo (P-6.6).
6. Format kolom telepon di CSV (P-6.1).
7. Kebijakan purge Sampah CMS (P-7.2).
8. Adopsi baseline (lihat dokumen migration safety), lalu persetujuan per migration (P-9, P-1 B, P-1.5, P-2 B, P-7.3).
9. Pilihan object storage (Phase 16).
