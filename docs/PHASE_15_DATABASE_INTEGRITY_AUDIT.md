# Phase 15 — Database Integrity & Backend Architecture Audit

Tanggal: 17 November 2026 · Branch: `artha` (HEAD `94d04ed` saat audit) · Lokasi repo: `C:\Users\itsupport.nr\Documents\New folder\WebsiteDiagnova`

**Sifat dokumen: audit dan proposal saja.** Tidak ada kode, schema, migration, atau data persisten yang diubah. Dokumen pendamping:
- [`PHASE_15_BACKEND_FIX_PROPOSALS.md`](PHASE_15_BACKEND_FIX_PROPOSALS.md): desain perbaikan, urutan implementasi, dan daftar file.
- [`PHASE_15_MIGRATION_SAFETY_REVIEW.md`](PHASE_15_MIGRATION_SAFETY_REVIEW.md): keamanan baseline migration.

Dokumen yang diminta sebagai bacaan awal, `docs/MASTER_REQUIREMENT_MATRIX.md` dan `docs/MASTER_ROADMAP.md`, **tidak ada di repository**. Sebagai gantinya dipakai requirement matrix di `docs/PHASE_13_REQUIREMENT_REVALIDATION.md` §3 dan roadmap Phase 15–19 dari instruksi.

---

## 0. Metode dan Bukti

| Sumber bukti | Keterangan |
|---|---|
| Pembacaan kode | `prisma/schema.prisma`, `lib/models/*`, `lib/controllers/*`, `lib/magic-link.ts`, `app/api/**`, halaman admin terkait. Referensi ditulis `file:baris`. |
| Probe Phase 14 | 8 order serentak, CSV 120 lead, urutan prioritas, dan input tidak valid. Dijalankan di DB sementara `diagnova_baseline_test`; lihat `PHASE_14_BASELINE_MIGRATION_TEST.md` §9.3. |
| Reproduksi seed (Phase 15) | DB sementara `diagnova_p15_seed_test` dan `diagnova_p15_seed_clean`, dibuat dengan `db push` + data sintetis |
| Uji line ending/checksum (Phase 15) | DB sementara `diagnova_p15_eol_test` |
| Pemeriksaan read-only DB dev `diagnova_v2` | Hanya `SELECT`: jumlah item nonaktif di JSON CMS dan kunci item testimoni. Ditambah `GET /` ke dev server untuk memeriksa isi payload halaman. |
| Audit CMS terperinci | Dilakukan agen baca-saja, lalu klaim utamanya diverifikasi ulang langsung di kode (CMS-02, CMS-04) |

Skala severity:

| Severity | Arti |
|---|---|
| **Critical** | Kehilangan atau kebocoran data, atau celah keamanan aktif |
| **High** | Fungsi inti salah atau gagal, atau integritas data terancam pada pemakaian normal |
| **Medium** | Salah pada kondisi tertentu (konkurensi, input tidak valid, skala) |
| **Low** | Kualitas, konsistensi, atau risiko kecil |
| **Info** | Catatan desain |

## 1. Ringkasan Struktur Database

Strukturnya identik dengan DB dev (Phase 14). Katalog lengkap ada di `docs/audit/PHASE_14_SCHEMA_CATALOG.txt`.

| Model (tabel) | Kunci / unique | FK keluar (ON DELETE) | Nullable penting | Default penting |
|---|---|---|---|---|
| Role (`roles`) | `name` unique | — | `description` | — |
| User (`users`) | `email` unique (case-sensitive di DB) | `role_id → roles` SET NULL (tanpa index) | `password_hash` (USER tanpa password), `role_id`, field demo | `status = 1` (Int tanpa CHECK) |
| Lead (`leads`) | Tidak ada unique selain PK | `user_id → users` SET NULL | `user_id`, tanggal demo, voucher | `status = 1` (Int tanpa CHECK); `approval_status = pending`; **`demo_duration_days = 3`** |
| DemoMagicLink (`demo_magic_links`) | `token_hash` unique, ditambah index duplikat | `lead_id → leads` CASCADE; `user_id → users` SET NULL (tanpa index) | `used_at`, `user_id` | — |
| AuditLog (`audit_logs`) | — | **Tanpa FK** (sengaja) | `user_id`, `record_id`, nilai lama/baru | — |
| Patient (`patients`) | `mrn` unique + index duplikat; `national_id` unique (nullable) | — | `national_id`, `phone`, `address` | — |
| Physician (`physicians`) | `external_code` unique | — | — | — |
| TestCatalog (`test_catalogs`) | `code` unique | — | `unit` | `is_active = true`, `tat_minutes = 60` |
| LabOrder (`lab_orders`) | `order_number` unique + index duplikat | `patient_id → patients` RESTRICT; `physician_id → physicians` SET NULL (tanpa index) | `physician_id`, `clinical_notes` | `priority = routine`, `status = ordered` |
| LabOrderItem (`lab_order_items`) | **Tidak ada unique (order, test)** | `order_id` CASCADE; `test_catalog_id` RESTRICT | — | — |
| Specimen (`specimens`) | `barcode_number` unique + index duplikat | `order_id → lab_orders` CASCADE | waktu terima/tolak | `status = collected`, `volume = '3.0 mL'` |
| CmsSection (`cms_sections`) | `section_key` unique | — | `extra_content` (JSON tanpa schema DB) | `is_published = true` |

Enum PostgreSQL: 11. Tiga di antaranya tidak dipakai kolom mana pun (`lead_status`, `user_role`, `user_status`). Urutan `order_priority` adalah `routine, cito, urgent`.

Semua timestamp bertipe `timestamp(3) without time zone` dan diisi UTC oleh Prisma.

## 2. Peta Batas Transaksi

| Operasi | Lokasi | Transaksi? | Catatan |
|---|---|---|---|
| Buat Magic Link (nonaktifkan link lama + buat baru) | `lib/magic-link.ts:75-89` | Ya (batch) | Dua approval serentak bisa menghasilkan 2 link aktif (tanpa lock/unique) |
| Konsumsi Magic Link | `lib/magic-link.ts:183-191` | Atomik (`updateMany` bersyarat) | Langkah sesudahnya (`:193-266`) **tidak** transaksional |
| Approve lead | `lib/models/lead.model.ts:326-464` | **Tidak** | Buat/ubah user → buat link → update lead adalah 3–4 tulisan terpisah |
| Reject lead | `lead.model.ts:484-498` | Ya (batch) | — |
| Transisi status lead | `lead.model.ts:85-91` | Atomik (`updateMany where status=from`) | Aman |
| Perpanjang demo | `lead.model.ts:600-603` | Ya (batch) | — |
| Buat order LIS | `lib/models/order.model.ts:163-203` | Ya (interaktif) | **Penomoran order dan barcode dihitung di luar transaksi** (`:152-160`) |
| Terima spesimen | `lib/models/specimen.model.ts:77-104` | Ya | Pemeriksaan status sebelum transaksi (`:62-72`), jadi rentan TOCTOU |
| Tolak spesimen | `specimen.model.ts:149-157` | Tidak (1 tulisan) | Tanpa guard status, dan status order tidak dihitung ulang |
| Hapus user | `lib/models/user.model.ts:233-241` | Tidak | Cek lead, lalu hapus (TOCTOU kecil) |
| Simpan CMS hub (homepage, menu, item) | `lib/models/cms.model.ts:121-1043` | Tidak | Read-modify-write JSON tanpa lock |
| Simpan layout / hero / konten global | `cms-layout.model.ts:226-313`, `site-content.model.ts:232-236` | Tidak | `assertNotStale` lalu `upsert`; tidak atomik |
| Audit log | Semua controller/model | **Di luar transaksi** aksi | Aksi bisa tersimpan sementara audit gagal, dan respons menjadi 500 |

## 3. Pola Akses Database

| Aspek | Temuan |
|---|---|
| Raw SQL | **Tidak ada** `$queryRaw`/`$executeRaw` di kode aplikasi, sehingga tidak ada permukaan SQL injection. Raw SQL hanya ada di skrip QA. |
| N+1 | Tidak ada pola N+1 yang signifikan; relasi dimuat dengan `include` (batched). Loop `tx.specimen.create` per tabung (`order.model.ts:187-200`) dibatasi jumlah jenis tabung (≤ 8). |
| Paginasi | Lead, order, dan pasien sudah berpaginasi dan di-clamp ≤ 100. **Tanpa batas:** `getAllUsers` (`user.model.ts:111-119`, termasuk relasi leads) dan `listPhysicians` (`physician.model.ts:15`). Audit log hanya punya `take` tanpa offset/cursor (`audit.model.ts:48-58`). Riwayat lead `take: 200` (`lead.model.ts:632`). Homepage membaca **semua** baris `cms_sections` beserta JSON penuhnya pada setiap render (`cms.model.ts:54`). |
| Validasi input | zod untuk lead, user, CMS layout/site, dan auth. **Manual** atau tidak ada untuk LIS, query string daftar lead, CMS hub (`/api/admin/cms/homepage`), dan menu. |
| Penghapusan | Hard delete: `user.delete` (dengan guard), item CMS (splice array JSON), dan menu. Cascade: lead → magic link; order → item + spesimen (tidak ada API hapus order). **Tidak ada soft delete atau arsip** di model mana pun. |
| Data minimization | Daftar order LIS menyertakan seluruh data pasien: NIK, telepon, alamat (`order.model.ts:376-386`). Hanya ADMIN yang dapat mengakses. |

---

## 4. Temuan

Setiap temuan memuat: ID, severity, bukti, akar masalah, file terdampak, dampak database, usulan implementasi (rinci di dokumen proposal, §P-x), kebutuhan migration, kriteria penerimaan, dan rencana uji regresi.

### 4.1 Integritas Database Umum

#### DB-01 — Kolom status berupa Int tanpa CHECK; tiga enum tidak terpakai
| | |
|---|---|
| Severity | Medium |
| Bukti | `users.status`, `leads.status` bertipe `integer` (katalog Phase 14). Tidak ada `CHECK`. Enum `lead_status`, `user_role`, `user_status` ada di DB tetapi tidak dipakai kolom mana pun (`schema.prisma:234-266`). |
| Akar masalah | Desain awal memakai enum, lalu kode beralih ke angka (1–4, 0/1) tanpa membersihkan schema. |
| File | `prisma/schema.prisma`; `lib/models/lead.model.ts:42-68`; `lib/validations.ts` |
| Dampak DB | Nilai di luar domain (mis. `status = 9`) bisa masuk lewat skrip atau SQL manual tanpa ditolak DB. Enum yatim membingungkan. |
| Usulan | P-9: `CHECK (status BETWEEN 1 AND 4)` untuk leads dan `CHECK (status IN (0,1))` untuk users; hapus 3 enum tak terpakai setelah verifikasi. |
| Migration | **Ya**, setelah baseline diadopsi |
| Kriteria terima | Insert/update dengan status di luar domain ditolak DB; seluruh suite QA tetap lulus |
| Uji regresi | Uji Prisma Client: `update status=9` → error; seluruh suite QA |

#### DB-02 — Index duplikat dan index FK yang kurang
| | |
|---|---|
| Severity | Low |
| Bukti | Katalog Phase 14: `token_hash`, `mrn`, `order_number`, `barcode_number` masing-masing punya unique index + index biasa. Tidak ada index pada `users.role_id`, `demo_magic_links.user_id`, `lab_orders.physician_id`. |
| Akar masalah | `@unique` dan `@@index` dideklarasikan bersamaan pada kolom yang sama (`schema.prisma:90, 128, 181, 220`) |
| File | `prisma/schema.prisma` |
| Dampak DB | Biaya tulis dan storage berlebih. Penghapusan role/user/physician memindai tabel anak (`SET NULL`) tanpa index. Dampaknya kecil pada volume demo. |
| Usulan | P-9: hapus 4 `@@index` duplikat; tambah `@@index` pada 3 FK |
| Migration | **Ya** (non-destruktif terhadap data) |
| Kriteria terima | `migrate diff` hanya berisi `DROP INDEX` duplikat dan `CREATE INDEX` FK; tidak ada perubahan kolom |
| Uji regresi | Uji Prisma Client (unique masih berlaku, P2002); seluruh suite QA |

#### DB-03 — Constraint yang hilang (item order ganda, link aktif ganda, email case-insensitive)
| | |
|---|---|
| Severity | Low |
| Bukti | `lab_order_items` tanpa unique `(order_id, test_catalog_id)`. Tidak ada constraint "maksimal satu link aktif per lead": `createDemoMagicLink` (`magic-link.ts:75-89`) memakai batch tanpa lock, sehingga dua approval serentak bisa meninggalkan 2 link aktif. `users.email` unique tetapi case-sensitive di DB; normalisasi lowercase hanya di aplikasi (`user.model.ts:43, 293`; `lead.model.ts:203`). |
| Akar masalah | Invarian dijaga di aplikasi saja |
| File | `prisma/schema.prisma`, `lib/magic-link.ts`, `lib/models/user.model.ts` |
| Dampak DB | Skrip atau SQL manual dapat membuat email beda kapitalisasi. Dua link aktif berarti dua token valid untuk satu lead (risiko rendah: keduanya untuk email pemohon yang sama). |
| Usulan | P-9: unique `(order_id, test_catalog_id)`; unique index `lower(email)` (raw SQL di migration). Link aktif: kunci baris lead (`SELECT … FOR UPDATE`) di transaksi approve (P-5). |
| Migration | Ya untuk unique/index; tidak untuk penguncian approve |
| Kriteria terima | Insert email beda kapitalisasi ditolak; dua approve serentak menyisakan tepat 1 link aktif |
| Uji regresi | Uji konkurensi approve ×5 → `count(link aktif) = 1`; uji Prisma Client email `A@x` vs `a@x` |

#### DB-04 — Tulisan multi-langkah tanpa transaksi (approve, konsumsi Magic Link, audit)
| | |
|---|---|
| Severity | **High** |
| Bukti | `approveLead` (`lead.model.ts:388-456`): `user.create`/`user.update` → `createDemoMagicLink` → `lead.update` sebagai operasi terpisah. `verifyAndConsumeMagicLink` (`magic-link.ts:193-266`): setelah token dikonsumsi, `user.create`, `demoMagicLink.update`, `lead.update`, `user.update`, audit, dan transisi status berjalan terpisah. Audit log selalu ditulis setelah aksi. |
| Akar masalah | Tidak ada unit of work. Kegagalan di tengah meninggalkan keadaan setengah jadi. |
| File | `lib/models/lead.model.ts`, `lib/magic-link.ts`, `lib/models/audit.model.ts` |
| Dampak DB | (a) Approve gagal setelah user dibuat: user tanpa lead disetujui. (b) Link dibuat tetapi lead belum APPROVED, sehingga link ditolak `not_approved`. (c) Token sudah terpakai lalu `user.create` gagal (mis. P2002 karena email dibuat proses lain): klien terkunci, link hangus. (d) Dua approve serentak untuk lead tanpa user: keduanya mencoba `user.create` email yang sama, sehingga satu gagal P2002 → 500. |
| Usulan | P-5: bungkus approve dan langkah pasca-konsumsi dalam `$transaction` interaktif dengan kunci baris lead; `upsert` user by email; audit di dalam transaksi yang sama (atau outbox). |
| Migration | Tidak |
| Kriteria terima | Injeksi kegagalan di setiap langkah tidak meninggalkan keadaan parsial; 5 approve serentak → 1 user, 1 link aktif, lead APPROVED, tanpa 500 |
| Uji regresi | Suite `demo-workflow` (57) + uji konkurensi baru (approve ×5, konsumsi ×3) + uji injeksi kegagalan (mock error pada langkah ke-2) |

#### DB-05 — Check-then-act (TOCTOU) di beberapa jalur
| | |
|---|---|
| Severity | Medium |
| Bukti | `deleteUser` menghitung lead lalu menghapus (`user.model.ts:233-241`). `receiveSpecimen` memeriksa status di luar transaksi (`specimen.model.ts:62-72`). `ensureDefaultCatalog`: `count()` lalu `createMany` tanpa `skipDuplicates` (`catalog.model.ts:100-102, 224`). Penomoran LIS (LIS-02). CMS hub read-modify-write (CMS-03). `assertNotStale` lalu `upsert` (`site-content.model.ts:232-236`). |
| Akar masalah | Validasi dan tulisan tidak atomik |
| File | Lihat bukti |
| Dampak DB | Lost update, P2002 → 500, atau penghapusan user yang baru saja mendapat lead (lead menjadi `user_id NULL`) |
| Usulan | Pola umum P-0: tulisan bersyarat (`updateMany where …`/`deleteMany where …` dengan cek `count`), `createMany({ skipDuplicates: true })`, dan versi optimistik atomik `updateMany({ where: { sectionKey, updatedAt: base } })` |
| Migration | Tidak |
| Kriteria terima | Uji balapan untuk tiap jalur menghasilkan 409/no-op, bukan 500 atau lost update |
| Uji regresi | Uji konkurensi per jalur (lihat proposal §T) |

#### DB-06 — Field demo terduplikasi di User dan Lead; default durasi tidak konsisten
| | |
|---|---|
| Severity | Medium (dampak bisnis) |
| Bukti | `Lead.demoDurationDays @default(3)` (`schema.prisma:61`) vs `approveLead` default 7 (`lead.model.ts:383`). `formatLeadRecord` fallback `|| 3` (`:151`). Drawer mengisi durasi approve dengan `lead.demoDurationDays \|\| 7` (`leads/page.tsx:267`). Karena DB selalu mengisi 3, **form approval secara default menawarkan 3 hari**, padahal teks UI/WA dan fallback lain memakai 7 (`leads/page.tsx:464, 1216, 1340`). Masa akses tersimpan di `users.demo_expires_at`, sedangkan `leads.voucher_expiry` hanya cermin; `demo_date` mencerminkan `confirmed_demo_date`. |
| Akar masalah | Dua sumber kebenaran, ditambah default schema lama (3) yang tidak diselaraskan |
| File | `prisma/schema.prisma`, `lib/models/lead.model.ts`, `app/admin/(dashboard)/leads/page.tsx`, `lib/magic-link.ts:222` |
| Dampak DB | Durasi aktual bergantung pada apakah admin mengubah angka di form. Laporan voucher bisa berbeda dari masa akses sebenarnya. |
| Usulan | P-6 (**NEEDS APPROVAL, aturan bisnis**): tetapkan satu default (mis. 7). Ubah `@default` (migration) atau set eksplisit di `createLead`. `users.demo_expires_at` menjadi satu-satunya sumber; `voucher_*`/`demo_date` dibekukan sebagai field turunan. |
| Migration | Ya bila `@default` diubah; tidak bila hanya kode |
| Kriteria terima | Form approval, API, dan pesan WA menampilkan default yang sama; lead baru tersimpan dengan durasi default yang disetujui |
| Uji regresi | `demo-workflow` (durasi), uji UI form approval, uji `formatLeadRecord` |

#### DB-07 — Field approval dipakai ulang untuk penolakan
| | |
|---|---|
| Severity | Low |
| Bukti | `rejectLead` menulis `approvedAt`/`approvedBy` untuk penolakan (`lead.model.ts:489-490`). Drawer REJECTED tidak menampilkan siapa/kapan (`leads/page.tsx:1349-1357`). |
| Akar masalah | Tidak ada kolom `rejected_at`/`rejected_by` |
| File | `prisma/schema.prisma`, `lib/models/lead.model.ts`, `leads/page.tsx` |
| Dampak DB | Arti kolom ambigu. Approve ulang menimpa jejak penolakan; riwayat hanya tersisa di audit log. |
| Usulan | P-9: kolom `decided_at`/`decided_by` (netral), atau `rejected_at`/`rejected_by`, dengan backfill dari data lama |
| Migration | Ya |
| Kriteria terima | Drawer REJECTED menampilkan penolak dan waktunya; approve ulang tidak menghapus jejak penolakan |
| Uji regresi | `demo-workflow` §11 (reject), uji drawer |

#### DB-08 — Query tanpa batas dan pembacaan berlebih
| | |
|---|---|
| Severity | Low (Medium saat data tumbuh) |
| Bukti | `getAllUsers` tanpa `take` dan memuat leads (`user.model.ts:111-119`). `listPhysicians` tanpa batas. Audit log hanya `take` tanpa cursor. Homepage membaca semua baris `cms_sections` (`cms.model.ts:54`), termasuk `layout_*`, `footer`, `faq`, dan `page_*` yang tidak dibutuhkan. |
| Akar masalah | Volume data demo kecil, sehingga paginasi belum dibuat |
| File | `lib/models/user.model.ts`, `physician.model.ts`, `audit.model.ts`, `cms.model.ts` |
| Dampak DB | Respons membesar linear terhadap jumlah user/audit; render homepage membawa JSON yang tidak perlu |
| Usulan | P-8: paginasi user dan audit dengan cursor `(created_at, id)`; homepage `findMany({ where: { sectionKey: { in: HOMEPAGE_KEYS } } })` |
| Migration | Tidak (index `created_at` audit sudah ada) |
| Kriteria terima | Endpoint daftar menerima `page/limit` atau `cursor` dengan batas ≤ 100; homepage hanya membaca key yang dipakai |
| Uji regresi | Suite `admin`, `security` (audit), `cms` |

#### DB-09 — Tidak ada soft delete atau arsip; audit log tidak dilindungi
| | |
|---|---|
| Severity | Medium |
| Bukti | Tidak ada `deletedAt` di model mana pun. Item CMS dihapus dengan `filter()` (`cms.model.ts:265-275, 367-377, 477-487, 585-595, 815-821, 927, 979, 1031`) dan audit hapusnya hanya mencatat id (CMS-01). `audit_logs` dapat dihapus siapa pun yang memegang koneksi DB; skrip QA memang menghapus audit (pernah menyebabkan kehilangan audit admin, Phase 12). |
| Akar masalah | Belum ada kebijakan retensi/arsip |
| File | `lib/models/cms.model.ts`, `prisma/schema.prisma`, skrip QA |
| Dampak DB | Konten yang terhapus tidak dapat dipulihkan dari aplikasi; jejak audit bisa hilang |
| Usulan | P-7 (soft delete CMS). Audit: role DB aplikasi tanpa hak `DELETE` pada `audit_logs` (keputusan infra), skrip QA hanya di DB sementara. |
| Migration | Bergantung opsi (lihat P-7) |
| Kriteria terima | Lihat CMS-01 |
| Uji regresi | Lihat CMS-01 |

#### DB-10 — Zona waktu
| | |
|---|---|
| Severity | Info, menjadi Medium bersama LEAD-03 dan LIS-03 |
| Bukti | Timestamp disimpan UTC (`timestamp without time zone`). Kode menghitung tanggal dengan waktu lokal server: prefix nomor order (`order.model.ts:64-68, 92-96, 156-160`), filter tanggal (`lead.model.ts:261-262`), timeline (`overview/route.ts:107-110`), dan CSV (`lead.controller.ts:475, 484-486`). Di Vercel waktu lokal = UTC; di mesin developer = WIB. |
| Akar masalah | Tidak ada zona waktu bisnis yang eksplisit |
| File | Lihat bukti |
| Dampak DB | Data tidak berubah, tetapi tampilan, filter, dan penomoran bergeser 7 jam tergantung server |
| Usulan | P-0: konstanta `BUSINESS_TIMEZONE = "Asia/Jakarta"` dan helper tanggal di `lib/datetime.ts` |
| Migration | Tidak |
| Kriteria terima | Hasil sama di server UTC dan WIB (uji dengan `TZ=UTC` dan `TZ=Asia/Jakarta`) |
| Uji regresi | Unit test helper tanggal dengan dua nilai `TZ` |

### 4.2 LIS (Task 2)

#### LIS-01 — Worklist menampilkan ROUTINE di atas CITO
| | |
|---|---|
| Severity | **High** (salah secara fungsi; kritis bila kelak dipakai operasional) |
| Bukti | Probe Phase 14: urutan `["routine","cito"]`. Kode memakai `orderBy: [{ priority: "asc" }, { orderedAt: "desc" }]` (`order.model.ts:355-359`) dan hal yang sama di dashboard (`app/api/admin/overview/route.ts:44-46`). |
| Akar masalah | PostgreSQL mengurutkan enum menurut **urutan deklarasi** (`routine, cito, urgent`), bukan alfabet. `asc` → routine < cito < urgent; `desc` → urgent, cito, routine. Tidak satu pun menghasilkan "CITO dulu". Komentar di kode keliru. |
| File | `lib/models/order.model.ts:313-443`, `app/api/admin/overview/route.ts:44-53`, `app/admin/(dashboard)/orders/page.tsx` |
| Dampak DB | Tidak ada data yang salah, hanya urutan baca. Index `priority` sudah ada. |
| Usulan | P-2: urutan eksplisit berbasis rank. Tanpa migration: query ID terurut via `$queryRaw` (`ORDER BY CASE priority …, ordered_at DESC LIMIT/OFFSET`), lalu muat detail dengan `findMany({ where: { id: { in } } })` dan susun ulang. Jangka panjang: kolom `priority_rank` + index komposit. **Keputusan klinis diperlukan: urutan CITO vs URGENT.** |
| Migration | Tidak (opsi A); ya (opsi B, kolom rank) |
| Kriteria terima | Worklist dan dashboard mengurutkan sesuai rank yang disetujui, lalu `ordered_at` terbaru; paginasi konsisten (tidak ada order hilang/ganda antar halaman); filter prioritas tetap bekerja |
| Uji regresi | Tes baru: 3 order (routine, cito, urgent) dibuat dalam urutan acak → halaman 1 sesuai rank; paginasi `limit=1` di 3 halaman → 3 order unik |

#### LIS-02 — Pembuatan order serentak gagal 500 (6 dari 8)
| | |
|---|---|
| Severity | **High** |
| Bukti | Probe Phase 14: 8 POST serentak → 2× 201, 6× 500. Unique constraint mencegah duplikat (4 order / 4 nomor unik). |
| Akar masalah | `generateOrderNumber()` dan `getNextBarcodeSequence()` membaca `MAX` **di luar** transaksi (`order.model.ts:152-155`), sehingga request paralel mendapat nomor yang sama. Insert kedua melanggar `lab_orders_order_number_key` (P2002), transaksi dibatalkan, dan controller memetakan semua error ke 500 (`lis.controller.ts:267-276`). Barcode berbagi pola yang sama, sehingga order yang lolos nomor order masih bisa bentrok di barcode. |
| File | `lib/models/order.model.ts:60-221`, `lib/controllers/lis.controller.ts:233-277` |
| Dampak DB | Tidak ada duplikat (unique bekerja), tetapi request sah ditolak. Tidak ada data parsial (transaksi rollback). |
| Usulan | P-1: alokasi nomor atomik **di dalam** transaksi yang sama dengan insert. Opsi A (tanpa migration): `pg_advisory_xact_lock` per hari. Opsi B (direkomendasikan jangka panjang): tabel counter `lis_number_sequences` dengan `INSERT … ON CONFLICT DO UPDATE … RETURNING`. Retry pada P2002 hanya sebagai jaring pengaman, **bukan** solusi utama (alasan di P-1). |
| Migration | Opsi A: tidak. Opsi B: ya (tabel baru). |
| Kriteria terima | 20 POST serentak → 20× 201; nomor order dan barcode unik dan berurutan tanpa celah dalam satu hari (opsi B) atau unik (opsi A); tidak ada 500 |
| Uji regresi | Tes konkurensi ×20 (adaptasi probe Phase 14); suite `lis` (117) |

#### LIS-03 — Format penomoran: overflow 9999, urutan leksikal, zona waktu
| | |
|---|---|
| Severity | Medium |
| Bukti | `padStart(4)` + `orderBy: { orderNumber: "desc" }` (leksikal) di `order.model.ts:70-85, 98-113`. Setelah `…-9999`, nomor berikutnya `…-10000` tetap kalah secara leksikal dari `…-9999`, sehingga MAX selalu `9999` dan setiap order berikutnya hari itu bentrok. Barcode memakai satu counter harian untuk semua tabung, jadi batas ini tercapai lebih cepat. Tanggal memakai waktu lokal server (DB-10). |
| Akar masalah | Nomor urut diturunkan dari string, bukan dari counter numerik |
| File | `lib/models/order.model.ts` |
| Dampak DB | Setelah 9999 order/barcode per hari, semua pembuatan order gagal. Di Vercel, order setelah 00:00 WIB dan sebelum 07:00 WIB mendapat tanggal kemarin. |
| Usulan | P-1: counter numerik (opsi B) atau `MAX(CAST(split_part(...)))` di bawah lock (opsi A); lebar minimal 4 digit tanpa batas atas; tanggal menurut `Asia/Jakarta` |
| Migration | Mengikuti LIS-02 |
| Kriteria terima | Uji dengan counter awal 9998: 3 order berikutnya → `9999`, `10000`, `10001`; prefix tanggal sesuai WIB di server ber-`TZ=UTC` |
| Uji regresi | Unit test formatter + uji integrasi dengan counter yang di-seed |

#### LIS-04 — Validasi input lemah menghasilkan 500
| | |
|---|---|
| Severity | Medium |
| Bukti | Probe Phase 14: `sex`/`birthDate` tidak valid → 500; `testCatalogCodes` string → 500; `priority=bogus` → 201 tersimpan ROUTINE. Kode: `createPatientController` hanya memeriksa kehadiran field (`lis.controller.ts:130-135`); `createPatient` memakai `new Date(...)` dan `sexToPrismaGender[...]` tanpa validasi (`patient.model.ts:84-95`); `createOrderController` meng-cast `priority` (`:253`) dan tidak memeriksa tipe array (`:242`); `createLabOrder` diam-diam membuang kode tes yang tidak dikenal (`order.model.ts:125-134`); `patientId`/`physicianId` yang tidak ada → P2003 → 500. Pesan P2002 selalu "MRN sudah terdaftar", padahal unique bisa juga dari `national_id` (`lis.controller.ts:148-156`). Error domain order → 500 (`:274`), sementara receive/reject memetakan **semua** error (termasuk error DB) ke 400 (`:308, :353`). |
| Akar masalah | Tidak ada schema validasi (zod) dan tidak ada error domain bertipe untuk LIS |
| File | `lib/controllers/lis.controller.ts`, `lib/models/patient.model.ts`, `lib/models/order.model.ts`, `lib/models/specimen.model.ts`, `lib/validations.ts` |
| Dampak DB | Data tidak rusak (DB menolak), tetapi klien mendapat 500 dan prioritas tidak valid tersimpan sebagai ROUTINE |
| Usulan | P-3: zod untuk patient, order, reject, dan parameter barcode; `LisError(httpStatus)`; pemetaan Prisma `P2002` → 409 (sebut field via `meta.target`), `P2003` → 400, `P2025` → 404; kode tes tak dikenal → 400 berisi daftar kodenya |
| Migration | Tidak |
| Kriteria terima | Semua kasus probe → 400 dengan pesan field; tidak ada 500 untuk input klien; pesan tidak memuat PII |
| Uji regresi | Perluas `lis.test.mjs` dengan matriks input tidak valid (≥ 20 kasus) |

#### LIS-05 — State machine spesimen tanpa guard
| | |
|---|---|
| Severity | Medium |
| Bukti | `receiveSpecimen` hanya menolak REJECTED, sehingga terima ulang menimpa `receivedAt`/`receivedBy` (`specimen.model.ts:70-85`). `rejectSpecimen` dapat menolak spesimen yang sudah RECEIVED atau ARCHIVED (`:139-157`). Status order tidak dihitung ulang setelah penolakan; hitung "pending" hanya memeriksa COLLECTED (`:88-93`), sehingga order dengan tabung ditolak tetap bisa menjadi SPECIMEN_RECEIVED. Audit tanpa `userId` (`:107, :160`). Alasan penolakan tanpa batas panjang. |
| Akar masalah | Transisi tidak dimodelkan; validasi di luar transaksi |
| File | `lib/models/specimen.model.ts`, `lib/controllers/lis.controller.ts` |
| Dampak DB | Riwayat penerimaan bisa tertimpa; status order tidak mencerminkan spesimen |
| Usulan | P-4: transisi bersyarat atomik (`updateMany where status IN allowed`); tabel transisi eksplisit; rekalkulasi status order di transaksi yang sama; `userId` aktor di audit. **Aturan transisi perlu persetujuan** (mis. bolehkah menolak setelah diterima?). |
| Migration | Tidak |
| Kriteria terima | Terima dua kali → 409 tanpa menimpa; tolak setelah terima sesuai aturan yang disetujui; status order konsisten |
| Uji regresi | Tes baru: matriks transisi × status awal; terima/tolak serentak ×5 |

#### LIS-06 — Idempotensi pembuatan order
| | |
|---|---|
| Severity | Medium (future-ready) |
| Bukti | Tidak ada kunci idempotensi: klik ganda atau retry jaringan membuat order kedua dengan nomor baru (`createOrderController`) |
| Akar masalah | POST non-idempoten tanpa deduplikasi |
| File | `lib/controllers/lis.controller.ts`, `lib/models/order.model.ts`, UI `app/admin/(dashboard)/orders/page.tsx` |
| Dampak DB | Order ganda yang sah secara constraint |
| Usulan | P-1.5: header `Idempotency-Key` (UUID dari klien) disimpan di `lab_orders.idempotency_key` UNIQUE. Request ulang dengan kunci sama mengembalikan order yang sudah ada (200). Jangka pendek: tombol submit dinonaktifkan saat request berjalan. |
| Migration | Ya (kolom + unique), sebaiknya sekaligus dengan opsi B LIS-02 |
| Kriteria terima | Dua POST dengan kunci sama → 1 order, respons identik; kunci berbeda → 2 order |
| Uji regresi | Tes idempotensi serentak ×5 dengan kunci sama |

#### LIS-07 — `GET /api/lis/catalog` dapat menulis data dan berbalapan
| | |
|---|---|
| Severity | Low |
| Bukti | `getCatalogController` memanggil `ensureDefaultCatalog()` (`lis.controller.ts:65`); fungsi itu menjalankan `count()` lalu `createMany` tanpa `skipDuplicates` (`catalog.model.ts:100-102, 224`) |
| Akar masalah | Seeding dilakukan saat request baca |
| File | `lib/controllers/lis.controller.ts`, `lib/models/catalog.model.ts` |
| Dampak DB | GET pertama yang berjalan serentak pada DB kosong: satu request 500 (P2002). GET bukan operasi read-only. |
| Usulan | Pindahkan seeding katalog ke seed, atau `createMany({ skipDuplicates: true })` |
| Migration | Tidak |
| Kriteria terima | GET tidak menulis data (atau idempoten); 5 GET serentak pada DB kosong → 5× 200 |
| Uji regresi | Tes serentak di DB sementara kosong |

#### LIS-08 — Halaman Order LIS: 15 order tanpa paginasi; data pasien penuh di daftar
| | |
|---|---|
| Severity | Low |
| Bukti | `orders/page.tsx:276` memanggil `/api/lis/orders` tanpa `page/limit` (default 15) dan kartu metrik dihitung dari 15 order itu (`:501-519`). Daftar order menyertakan NIK, telepon, dan alamat pasien (`order.model.ts:376-386`). |
| Akar masalah | UI belum berpaginasi; DTO daftar = DTO detail |
| File | `app/admin/(dashboard)/orders/page.tsx`, `lib/models/order.model.ts` |
| Dampak DB | Tidak ada perubahan data; metrik menyesatkan; PII berlebih di respons daftar |
| Usulan | Paginasi UI; metrik dari endpoint agregat; DTO daftar ringkas (nama, MRN) |
| Migration | Tidak |
| Kriteria terima | Semua order dapat dijelajahi; metrik = agregat DB; respons daftar tanpa NIK/alamat |
| Uji regresi | Suite `lis` + tes bentuk respons daftar |

### 4.3 Leads & Dashboard (Task 3)

#### LEAD-01 — Export CSV hanya 100 dari 120 dan mengabaikan filter
| | |
|---|---|
| Severity | **High** (data ekspor tidak lengkap tanpa peringatan) |
| Bukti | Probe Phase 14: 100 dari 120. `exportLeadsCsvController` memanggil `getLeadsWithPagination({ limit: 1000 })` (`lead.controller.ts:446`), lalu fungsi itu meng-clamp ke 100 (`lead.model.ts:237`). Tautan UI tidak mengirim filter (`leads/page.tsx:532`) dan controller tidak membacanya. Tanggal diformat dengan zona waktu server (`lead.controller.ts:475, 484-486`). Netralisasi formula juga mengubah nomor `+62…` menjadi `'+62…` (`:451`). |
| Akar masalah | Fungsi paginasi UI dipakai ulang untuk ekspor massal |
| File | `lib/controllers/lead.controller.ts`, `lib/models/lead.model.ts`, `app/admin/(dashboard)/leads/page.tsx` |
| Dampak DB | Tidak ada perubahan data; laporan bisnis tidak lengkap |
| Usulan | P-6.1: fungsi ekspor khusus dengan iterasi cursor (batch 500, batas atas mis. 10.000 dengan header peringatan); terapkan filter yang sama dengan daftar; format tanggal `Asia/Jakarta`; kolom telepon ditulis sebagai teks aman |
| Migration | Tidak |
| Kriteria terima | 120 lead → 120 baris; dengan filter → sama persis dengan total daftar berfilter; 10.001 lead → 10.000 baris + header `X-Export-Truncated` |
| Uji regresi | Tes ekspor dengan 0, 1, 120, dan 250 lead + filter status/tanggal; netralisasi formula tetap lulus |

#### LEAD-02 — Query string tidak valid menghasilkan 500
| | |
|---|---|
| Severity | Medium |
| Bukti | Probe Phase 14: `limit=abc`, `page=abc`, `startDate=not-a-date` → 500. `parseInt` tanpa cek NaN (`lead.controller.ts:57-58`) → `Math.max(1, NaN) = NaN` → `take: NaN` (`lead.model.ts:236-238`). `new Date("not-a-date")` → Invalid Date ke Prisma (`:258`). `institutionType` tidak divalidasi (`lead.controller.ts:52-53`). |
| Akar masalah | Query string tidak divalidasi (berbeda dengan LIS yang memakai `clampInt`) |
| File | `lib/controllers/lead.controller.ts`, `lib/models/lead.model.ts`, `lib/validations.ts` |
| Dampak DB | Tidak ada |
| Usulan | P-6.2: zod `leadListQuerySchema` (coerce + default + clamp); tanggal `YYYY-MM-DD` ketat → 400 bila tidak valid |
| Migration | Tidak |
| Kriteria terima | Paging tidak valid → default (200); tanggal tidak valid → 400 dengan pesan; tidak ada 500 |
| Uji regresi | Tes matriks query (≥ 10 kasus) |

#### LEAD-03 — Filter tanggal bergeser zona waktu dan tidak simetris
| | |
|---|---|
| Severity | Medium |
| Bukti | `startDate` di-parse sebagai UTC 00:00, sedangkan `endDate` memakai `setHours(23,59,59,999)` waktu **lokal server** (`lead.model.ts:257-263`) |
| Akar masalah | Campuran UTC dan waktu lokal; tidak ada zona waktu bisnis |
| File | `lib/models/lead.model.ts` |
| Dampak DB | Lead yang dibuat 00:00–06:59 WIB masuk ke hari sebelumnya; hasil filter berbeda antara server UTC dan WIB |
| Usulan | P-6.2: rentang `[start 00:00 WIB, end+1 hari 00:00 WIB)` dengan batas atas eksklusif (`lt`) |
| Migration | Tidak |
| Kriteria terima | Lead 2026-11-17 00:30 WIB muncul pada filter 17 Nov, tidak pada 16 Nov, di server UTC maupun WIB |
| Uji regresi | Tes dengan lead sintetis di batas jam (23:59 / 00:00 / 06:59 WIB), dijalankan dengan `TZ=UTC` dan `TZ=Asia/Jakarta` |

#### LEAD-04 — Statistik dashboard tidak akurat
| | |
|---|---|
| Severity | Medium |
| Bukti | Timeline 14 hari dihitung dari `take: 5` lead/order terbaru (`overview/route.ts:40-53, 112-117`), sehingga setiap hari maksimal 5 dan data lama hilang. Bucket memakai UTC (`toISOString`) sementara label memakai waktu lokal (`:109-110`). `recentAuditLogs` selalu `[]` (`:189`). `activeUsers` ikut menghitung admin (`:39`). Kartu "Baru" praktis selalu 0 karena lead baru langsung berstatus 2 (aturan bisnis, `lead.model.ts:209`). |
| Akar masalah | Satu query "recent" dipakai untuk dua kebutuhan |
| File | `app/api/admin/overview/route.ts`, `app/admin/(dashboard)/dashboard/page.tsx` |
| Dampak DB | Tidak ada |
| Usulan | P-6.3: agregasi harian di DB (`date_trunc('day', created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta')`, 14 hari) atau ambil `createdAt` saja dalam rentang 14 hari lalu bucket WIB; isi atau hapus `recentAuditLogs`; `activeUsers` hanya role USER. Kartu "Baru" dipertahankan (aturan bisnis) dengan keterangan "data lama". |
| Migration | Tidak |
| Kriteria terima | Dengan 30 lead sintetis tersebar 14 hari: jumlah per hari = hitungan SQL acuan; total timeline = jumlah lead 14 hari |
| Uji regresi | Tes overview dengan data sintetis terkontrol (nilai, bukan hanya status 200) |

#### LEAD-05 — Kelengkapan data drawer lead
| | |
|---|---|
| Severity | Low |
| Bukti | Drawer REJECTED tidak menampilkan penolak/waktu (`leads/page.tsx:1349-1357`), meski tersimpan di `approvedBy/At` (DB-07). Record lead hanya membawa link **terakhir** (`lead.model.ts:96-100`); riwayat lengkap tersedia via `/history` (`:615-660`, `take: 200`). Record tidak membawa `updatedAt`. Default durasi pada form approval = 3 (DB-06). |
| Akar masalah | DTO dan drawer tidak diselaraskan dengan status REJECTED dan riwayat |
| File | `lib/models/lead.model.ts`, `app/admin/(dashboard)/leads/page.tsx`, `types` |
| Dampak DB | Tidak ada |
| Usulan | P-6.4: tampilkan aktor dan waktu keputusan, `updatedAt`, dan jumlah link; setelah DB-07 dipakai kolom baru |
| Migration | Tidak (kecuali bergantung DB-07) |
| Kriteria terima | Drawer menampilkan siapa/kapan untuk APPROVED dan REJECTED |
| Uji regresi | Uji UI drawer (browser test di repo, Phase 18) |

#### LEAD-06 — Approve: konkurensi, reopen, dan demo berakhir
| | |
|---|---|
| Severity | Medium |
| Bukti | (a) Tidak transaksional (DB-04). (b) Approve atas lead REJECTED diperbolehkan tanpa langkah "reopen" eksplisit di backend; UI punya tombol "Buka Kembali" (`leads/page.tsx:1358+`). (c) Approve ulang untuk demo yang sudah berakhir tetap menerbitkan link yang pasti ditolak `demo_expired` (`approveLead` tidak memeriksa `demoExpiresAt`; jalur User Management memeriksanya). (d) Approve ulang menimpa `approvedAt/approvedBy` dan `voucherExpiry` (`lead.model.ts:442-455`). |
| Akar masalah | Aturan re-approve tidak dirumuskan di backend |
| File | `lib/models/lead.model.ts`, `lib/magic-link-eligibility.ts`, `lib/controllers/lead.controller.ts` |
| Dampak DB | Jejak keputusan tertimpa; link mati terbit |
| Usulan | P-5 + P-6.5: transaksi; pakai `evaluateMagicLinkEligibility` juga di jalur Leads (demo berakhir → 409 dengan saran "perpanjang akses"); re-approve tidak menimpa `approvedAt` asli (catat di audit). **Perubahan aturan (b), (c), dan (d) memerlukan persetujuan**; dampaknya didokumentasikan di P-6.5. |
| Migration | Tidak |
| Kriteria terima | Sesuai aturan yang disetujui; tidak ada link mati; konkurensi seperti DB-04 |
| Uji regresi | `demo-workflow` + kasus baru reopen/expired |

#### LEAD-07 — Transisi status lead
| | |
|---|---|
| Severity | Info (sudah benar) |
| Bukti | `transitionLeadStatus` atomik (`lead.model.ts:85-91`); transisi manual dibatasi `MANUAL_STATUS_TRANSITIONS`; login pertama 2→3 idempoten; diuji `demo-workflow` (55/55 di DB baseline). Satu-satunya celah: transisi lama 1→2 belum diuji, dan audit transisi ditulis di luar transaksi. |
| Akar masalah | — |
| File | `lib/models/lead.model.ts`, `lib/magic-link.ts:250-266` |
| Dampak DB | — |
| Usulan | Tambahkan tes 1→2; audit di transaksi (DB-04) |
| Migration | Tidak |
| Kriteria terima | Tes 1→2 lulus |
| Uji regresi | `demo-workflow` |

#### LEAD-08 — Penolakan tidak mencabut sesi/akses demo yang aktif
| | |
|---|---|
| Severity | Low (keputusan bisnis) |
| Bukti | `rejectLead` hanya menonaktifkan link yang belum dipakai (`lead.model.ts:494-497`); user yang sudah login tetap aktif sampai `demoExpiresAt` |
| Akar masalah | Aturan pencabutan akses belum ditetapkan |
| File | `lib/models/lead.model.ts`, `middleware.ts` |
| Dampak DB | — |
| Usulan | NEEDS APPROVAL: opsi set `users.demo_expires_at = now()` saat reject lead yang sudah aktif, atau dibiarkan |
| Migration | Tidak |
| Kriteria terima | Sesuai keputusan |
| Uji regresi | `demo-workflow` §11 |

### 4.4 CMS & Soft Delete (Task 4)

Inventaris lengkap ada di [Lampiran A](#lampiran-a--inventaris-cms-dan-jalur-hapus).

#### CMS-01 — Penghapusan konten CMS permanen dan tidak dapat dipulihkan
| | |
|---|---|
| Severity | **High** |
| Bukti | Semua hapus item adalah `filter()` lalu `update` seluruh `extraContent`: slide `cms.model.ts:265-275`, partner `:367-377`, komparasi `:477-487`, testimoni `:585-595`, menu `:815-821`, item solusi/modul/integrasi `:927, :979, :1031`. Audit hapus hanya mencatat id tanpa `oldValue` (`:277-282, 379-384, 489-494, 597-602, 834-839, 932-937`). Komentar "Soft delete" di `app/api/admin/menus/[id]/route.ts:86` keliru. Footer/FAQ/announcement/section kustom/metrik hero dihapus dengan mengganti seluruh dokumen dari klien. |
| Akar masalah | Tidak ada konsep tempat sampah atau revisi |
| File | `lib/models/cms.model.ts`, `cms-layout.model.ts`, `site-content.model.ts`, `menu.model.ts`, halaman admin `cms`, `page-sections`, `site-content` |
| Dampak DB | Konten hilang permanen kecuali dari backup DB |
| Usulan | P-7: bertahap. (1) Interim tanpa migration: simpan item yang dihapus / `extraContent` sebelumnya sebagai `oldValue` di audit. (2) Soft delete level item (`deletedAt`, `deletedBy` di JSON) + tampilan Sampah + Pulihkan. (3) Jangka menengah: tabel revisi `cms_section_revisions` (migration). |
| Migration | (1), (2) tidak; (3) ya |
| Kriteria terima | Item terhapus tidak tampil publik dan tidak ada di payload; muncul di Sampah; Pulihkan mengembalikan id, urutan, dan gambar; hapus permanen hanya dari Sampah |
| Uji regresi | Tes baru per entitas (hapus → tidak publik → pulihkan → publik) + `cms`, `cms-layout`, `site-content` |

#### CMS-02 — Payload homepage membawa seluruh `extraContent` dan `updatedBy`
| | |
|---|---|
| Severity | Medium (laten) |
| Bukti | `getCmsHomepageContent` memfilter array item, tetapi tetap mengembalikan baris penuh sebagai `section` (`cms.model.ts:88, 92, 96, 99, 103, 106, 109, 113`). Baris itu diteruskan ke komponen `"use client"` (`app/(marketing)/page.tsx:57-75`; `components/sections/Hero.tsx:1, 100`). Verifikasi read-only pada dev server: HTML homepage memuat `extraContent` ×6 dan `updatedBy` ×6. Saat ini DB dev memiliki **0** item nonaktif, sehingga belum ada konten tersembunyi yang bocor. Section yang disembunyikan lewat layout (testimoni, mitra) **tidak** ikut terkirim (0 dari 4 id testimoni, 0 dari 6 id mitra). |
| Akar masalah | DTO publik = baris DB mentah |
| File | `lib/models/cms.model.ts`, `app/(marketing)/page.tsx`, `components/sections/{Hero,TrustedByBar,ComparisonSection,TestimonialsSection,CTABanner}.tsx`, `cms-layout.model.ts:77-85` (CTA halaman dalam) |
| Dampak DB | Item yang dinonaktifkan atau kelak di-soft-delete tetap terbaca di page source; nama admin (`updatedBy`) terekspos |
| Usulan | P-7.0 (prasyarat soft delete): DTO publik eksplisit (`toPublicSection`: badge/judul/subjudul + field yang dipakai), tanpa `extraContent` mentah dan `updatedBy` |
| Migration | Tidak |
| Kriteria terima | Payload homepage tidak memuat `extraContent`/`updatedBy`; item nonaktif tidak ada di HTML |
| Uji regresi | Perluas `site-content`/`cms` dengan pemeriksaan payload untuk item nonaktif per entitas |

#### CMS-03 — CMS hub (`PUT /api/admin/cms/homepage`) tanpa validasi dan locking; menimpa seluruh JSON
| | |
|---|---|
| Severity | **High** |
| Bukti | `type:"section"` mengganti seluruh `extraContent` dengan salinan form klien (`cms.model.ts:121-170`; `cms/page.tsx:213-225`), untuk **sectionKey apa pun** termasuk `footer`, `navigation`, `layout_*`. Hub juga mengedit `page_platform`/`page_nova_ai` sehingga dapat menghapus CTA dan metrik hero yang disimpan `savePageHero`. Item disimpan dengan `...spread` tanpa zod maupun `isSafeCmsUrl`. Tidak ada optimistic locking. |
| Akar masalah | Endpoint lama sebelum pola zod dan locking diperkenalkan |
| File | `app/api/admin/cms/homepage/route.ts`, `lib/models/cms.model.ts`, `app/admin/(dashboard)/cms/page.tsx` |
| Dampak DB | Lost update antar-admin dan antar-layar; URL tidak aman bisa tersimpan (misalnya `javascript:` di link slide) |
| Usulan | P-7.1: zod per tipe; whitelist sectionKey per tipe; merge (bukan replace) hanya untuk key milik hub; `baseUpdatedAt` + update bersyarat atomik; `isSafeCmsUrl` untuk semua URL |
| Migration | Tidak |
| Kriteria terima | Hub tidak bisa menyentuh `footer/navigation/layout_*/hero.*`; simpan basi → 409; URL `javascript:` → 400; metrik hero tetap utuh setelah simpan dari hub |
| Uji regresi | Perluas `cms.test.mjs`: tiap tipe (valid/tidak valid/basi) + uji silang hub ↔ Halaman & Section |

#### CMS-04 — Edit menu induk menimpa submenu; pindah induk menggandakan submenu
| | |
|---|---|
| Severity | Medium |
| Bukti | Form edit menu induk berisi salinan menu termasuk `submenus` (`cms/page.tsx:1239`). Model melakukan `{...menus[idx], ...menuData}` (`cms.model.ts:742-747`), sehingga submenu yang dihapus admin lain kembali dan submenu baru hilang. Mengubah induk submenu menambahkannya ke induk baru tanpa menghapus dari induk lama (`:698-720`). |
| Akar masalah | Payload edit membawa data anak; tidak ada operasi "pindah" |
| File | `lib/models/cms.model.ts:671-842`, `app/admin/(dashboard)/cms/page.tsx` |
| Dampak DB | Navigasi publik berisi menu ganda atau menu yang sudah dihapus |
| Usulan | P-7.1: whitelist field saat edit induk (abaikan `submenus`); operasi pindah = hapus dari induk lama + tambah ke induk baru dalam satu tulisan; validasi id unik lintas induk/anak |
| Migration | Tidak |
| Kriteria terima | Edit induk tidak mengubah submenu; pindah submenu → tepat 1 salinan |
| Uji regresi | Tes `cms` baru untuk kedua skenario |

#### CMS-05 — Berkas upload tidak pernah dihapus dan tidak persisten di Vercel
| | |
|---|---|
| Severity | Medium |
| Bukti | `app/api/admin/cms/upload/route.ts` hanya POST, menulis ke `public/uploads/cms` (`:140-142`) tanpa catatan DB. Mengosongkan gambar hanya mengubah URL menjadi `""` (`components/admin/ImageUploader.tsx:203`). Tidak ada indeks referensi. |
| Akar masalah | Tidak ada abstraksi storage atau media library |
| File | `app/api/admin/cms/upload/route.ts`, `app/uploads/cms/[filename]/route.ts`, `components/admin/ImageUploader.tsx` |
| Dampak DB | File yatim menumpuk; di Vercel upload gagal/hilang |
| Usulan | Phase 16: abstraksi storage + object storage (NEEDS APPROVAL). Soft delete item **tidak** menghapus file; penghapusan file hanya lewat job purge yang memindai referensi seluruh JSON. |
| Migration | Opsional (tabel media) |
| Kriteria terima | Ditentukan di Phase 16 |
| Uji regresi | Suite `security` (upload) + tes referensi |

#### CMS-06 — Resolver dan zod membuang field yang tidak dikenal (prasyarat soft delete)
| | |
|---|---|
| Severity | Info (desain) |
| Bukti | `resolveFooter`/`resolveAnnouncement` (`lib/site-content.ts:187-243`), `resolveFaq` (`lib/site-content-faq.ts:309-322`), `resolvePageLayout` (`lib/cms-layout.ts:455-474`), dan `stored.push` (`cms-layout.model.ts:202, 212`) membangun ulang objek per field. zod `z.object` membuang key yang tidak dikenal, dan `contentSchema` bersifat `.strict()` (`cms-layout.model.ts:147`). Batas `.max()` akan ikut menghitung item yang di-soft-delete. |
| Akar masalah | — |
| File | File di atas |
| Dampak DB | Field `deletedAt` yang ditambahkan ke JSON akan hilang saat dibaca/disimpan bila resolver/schema tidak diperbarui |
| Usulan | P-7.2: tambahkan `deletedAt`/`deletedBy` ke semua tipe item, resolver, dan zod; hitung batas hanya untuk item yang tidak dihapus |
| Migration | Tidak |
| Kriteria terima | Round-trip simpan/baca mempertahankan `deletedAt` |
| Uji regresi | Unit test resolver + tes API simpan/baca |

#### CMS-07 — `isPublished` tidak konsisten; kode CMS mati
| | |
|---|---|
| Severity | Low |
| Bukti | `isPublished` dihormati untuk `layout_*`, hero `page_*`, `cta`, dan section homepage selain hero, tetapi diabaikan untuk hero homepage, `navigation`, `footer`, `faq`, `announcement`. Tidak ada toggle di UI. Getter `getSolutionsPageData`/`getModulesPageData`/`getIntegrationsPageData`/`getNovaAiPageData`/`getPlatformPageData` (`cms.model.ts:1055-1102`) dan `getPublicNavigationMenus` (`menu.model.ts:16`) tidak dipanggil. Edit `solution_item` tidak pernah dirender. `/api/admin/menus*` duplikat dan tidak dipakai. |
| Akar masalah | Sisa iterasi CMS sebelumnya |
| File | `lib/models/cms.model.ts`, `lib/models/menu.model.ts`, `app/api/admin/menus/**` |
| Dampak DB | Admin dapat mengedit data yang tidak pernah tampil |
| Usulan | Phase 15 roadmap (cakupan CMS): putuskan render atau hapus. Hapus kode mati setelah persetujuan. |
| Migration | Tidak |
| Kriteria terima | Setiap field yang bisa diedit di admin benar-benar tampil, atau disembunyikan dari admin |
| Uji regresi | `cms` + inventaris |

### 4.5 Seed (Task 5)

#### SEED-01 — `npm run db:seed` gagal: konflik format modul ESM/CommonJS
| | |
|---|---|
| Severity | Medium (onboarding, CI, environment baru; tidak memengaruhi runtime production) |
| Bukti | Reproduksi di DB sementara `diagnova_p15_seed_test` (rangkaian `db:seed` sama, env lewat wrapper): `seed.ts` dan `seed-cms.ts` sukses, lalu `seed_other_pages_cms.js` gagal dengan `SyntaxError: The requested module '../content/integrations' does not provide an export named 'integrationsData'`. Uji isolasi tanpa DB: **keempat** modul (`solutions`, `modules`, `integrations`, `nova-ai`) gagal di-import secara named. Import namespace menunjukkan ekspornya hanya `default` + `module.exports`. |
| Akar masalah | `scripts/seed_other_pages_cms.js` ditulis dengan sintaks ESM (`import`), sementara `package.json` tidak memiliki `"type": "module"`. Node 22+ (terpasang v26) mendeteksi file `.js` itu sebagai ESM, sedangkan tsx mengompilasi `content/*.ts` sebagai **CommonJS**. ESM hanya bisa mengambil named export CommonJS yang terdeteksi analisis statis; output esbuild (`__export(...)`) tidak terdeteksi, sehingga hanya `default` tersedia. Pada Node lama, file yang sama gagal dengan error berbeda. **Bukan** salah akses Prisma, bukan data seed, bukan schema mismatch, bukan konfigurasi env. |
| File | `scripts/seed_other_pages_cms.js`, `package.json` (`db:seed`) |
| Dampak DB | Saat gagal, rangkaian berhenti sebelum `sync_page_hero_defaults`; baris `page_*` tidak dibuat oleh seed ini (lihat SEED-02) |
| Usulan | P-10: ubah menjadi `scripts/seed_other_pages_cms.ts` (isi sama) dan perbarui `db:seed`. **Diverifikasi** dengan salinan `.ts` di DB sementara bersih `diagnova_p15_seed_clean`: 5 baris `page_*` terisi (`items` 5/5/6, `submodules` 4, `workflowSteps` 4, dst.), dan rangkaian kedua menghasilkan isi identik (idempoten). |
| Migration | Tidak |
| Kriteria terima | `npm run db:seed` exit 0 pada DB kosong (diuji di DB sementara); dijalankan dua kali → isi `cms_sections` identik |
| Uji regresi | Langkah CI: DB sementara → `migrate deploy` → `db:seed` ×2 → fingerprint |

#### SEED-02 — Seed tidak konvergen setelah pernah gagal
| | |
|---|---|
| Severity | Medium |
| Bukti | Reproduksi: setelah kegagalan SEED-01, `sync_page_hero_defaults.js` (bila dijalankan terpisah, seperti terjadi di Phase 14) membuat baris `page_*` dengan `extraContent: {}` (`sync_page_hero_defaults.js:25-30`). Salinan `.ts` yang sudah diperbaiki lalu mencetak `[PASS] Seeded section` **tetapi tidak mengubah apa pun**, karena `upsert` memakai `update: {}` (`seed_other_pages_cms.js:15, 69, 98, 127, 150`). Hash isi sebelum dan sesudah identik dan `extraContent` tetap kosong. |
| Akar masalah | Upsert "create-only" dikombinasikan dengan skrip lain yang membuat baris kosong; log yang menyesatkan |
| File | `scripts/seed_other_pages_cms.js`, `scripts/sync_page_hero_defaults.js` |
| Dampak DB | Environment yang pernah gagal seed tetap tanpa item halaman dalam (admin hub kosong). Tidak berdampak ke halaman publik saat ini, karena getter tersebut tidak dipakai (CMS-07). |
| Usulan | P-10: isi field `extraContent` yang **kosong** saja (pola `fillEmptyArrays` seperti `seed-cms.ts`), jangan menimpa isi yang sudah diedit; log `CREATED/FILLED/SKIPPED` yang jujur |
| Migration | Tidak |
| Kriteria terima | Pada DB pasca-gagal: seed terisi; pada DB yang sudah diedit admin: tidak berubah |
| Uji regresi | Skenario CI: gagal-lalu-ulang dan edit-lalu-ulang |

#### SEED-03 — Efek samping seed pada data yang sudah ada
| | |
|---|---|
| Severity | Low |
| Bukti | `prisma/seed.ts`: `upsert` admin/sales dengan `update: { status: 1, roleId: ADMIN, name }`, sehingga menjalankan ulang seed **mengaktifkan kembali** akun seed yang sudah dinonaktifkan (password tidak direset). Password memakai fallback default development bila `SEED_ADMIN_PASSWORD` tidak diset (`.env` lokal tidak mengisinya). `sync_page_hero_defaults.js` selalu mencatat `[UPDATE]` dan memperbarui `updated_at` walau nilainya sama. |
| Akar masalah | Upsert terlalu luas |
| File | `prisma/seed.ts`, `scripts/sync_page_hero_defaults.js` |
| Dampak DB | Akun yang dinonaktifkan karena alasan keamanan bisa aktif lagi bila seed dijalankan di DB bersama |
| Usulan | P-10: `update: {}` untuk akun (create-only); wajibkan `SEED_ADMIN_PASSWORD` kecuali `NODE_ENV=development` + DB localhost; sync hanya menulis bila nilai berbeda |
| Migration | Tidak |
| Kriteria terima | Seed ulang tidak mengubah status akun; tanpa env di non-lokal → seed menolak |
| Uji regresi | Skenario CI seed ×2 + akun dinonaktifkan |

---

## 5. Ringkasan Temuan

| ID | Judul singkat | Severity | Migration |
|---|---|---|---|
| DB-04 | Tulisan multi-langkah tanpa transaksi | High | Tidak |
| LIS-01 | ROUTINE di atas CITO | High | Opsional |
| LIS-02 | Order serentak 500 | High | Opsional (A: tidak, B: ya) |
| LEAD-01 | CSV 100/120 | High | Tidak |
| CMS-01 | Hapus CMS permanen | High | Bertahap |
| CMS-03 | CMS hub tanpa validasi/locking | High | Tidak |
| DB-01 | Status Int tanpa CHECK, enum yatim | Medium | Ya |
| DB-05 | TOCTOU | Medium | Tidak |
| DB-06 | Default durasi 3 vs 7 | Medium | Opsional |
| DB-09 | Tanpa soft delete/arsip | Medium | Bertahap |
| LIS-03 | Overflow 9999 / zona waktu | Medium | Mengikuti LIS-02 |
| LIS-04 | Validasi LIS → 500 | Medium | Tidak |
| LIS-05 | State machine spesimen | Medium | Tidak |
| LIS-06 | Idempotensi order | Medium | Ya |
| LEAD-02 | Query tidak valid → 500 | Medium | Tidak |
| LEAD-03 | Filter tanggal zona waktu | Medium | Tidak |
| LEAD-04 | Statistik dashboard | Medium | Tidak |
| LEAD-06 | Aturan re-approve | Medium | Tidak |
| CMS-02 | Payload homepage | Medium | Tidak |
| CMS-04 | Submenu tertimpa/ganda | Medium | Tidak |
| CMS-05 | Upload yatim / tidak persisten | Medium | Opsional |
| SEED-01 | ESM/CJS | Medium | Tidak |
| SEED-02 | Seed tidak konvergen | Medium | Tidak |
| DB-02, DB-03, DB-07, DB-08, LIS-07, LIS-08, LEAD-05, LEAD-08, CMS-07, SEED-03 | Lihat di atas | Low | Campuran |
| DB-10, LEAD-07, CMS-06 | Catatan desain | Info | — |

Total: 0 Critical, 6 High, 17 Medium, 10 Low, 3 Info.

---

## Lampiran A — Inventaris CMS dan Jalur Hapus

| Entitas | Penyimpanan (baris → path JSON) | Tulis (model) | Pembaca publik | Hapus sekarang | Sembunyikan | Validasi / lock |
|---|---|---|---|---|---|---|
| Slide hero | `hero` → `slides[]` | `cms.model.ts:175-285` | `Hero.tsx` | Splice | Item `isActive` | Tidak / tidak |
| Logo mitra | `trusted_by` → `partners[]` | `:290-387` | `TrustedByBar.tsx` | Splice | Item `isActive` + layout | Tidak / tidak |
| Komparasi | `comparison` → `items[]` | `:392-497` | `ComparisonSection.tsx` | Splice | Item `isActive` | Tidak / tidak |
| Testimoni | `testimonials` → `items[]` | `:502-605` | `TestimonialsSection.tsx` | Splice | Item `isActive` + layout | Tidak / tidak |
| About / CTA / workflow / infra | Kolom + `steps[]`, `cards[]` | `updateCmsSection :121-170` (replace) | Section terkait; CTA halaman dalam | Hanya via replace | Baris `isPublished` | Tidak / tidak |
| Menu + submenu | `navigation` → `menus[].submenus[]` | `:671-842`; API duplikat `menu.model.ts` | `Navbar.tsx` ← `/api/menus` | Splice (induk ikut menghapus anak) | `isActive` | Tidak / tidak |
| Teks hero halaman dalam | Kolom `page_*` | `savePageHero` **dan** hub | `getCmsPageHero` | — | `isPublished` | zod + lock (PS); tidak (hub) |
| CTA + metrik hero | `page_*` → `hero.*` | `savePageHero cms-layout.model.ts:277-329` | `lib/cms-hero.ts` | Replace array | Metrik `isActive` | zod + lock |
| Layout + section kustom | `layout_<page>` → `sections[]` | `savePageLayout :177-246` | `CmsSectionList` | Replace (builtin tidak bisa dihapus) | `isActive` | zod + lock |
| Footer | `footer` | `saveSiteContent` | `Footer.tsx` | Replace | `isActive` per kolom/link/sosial | zod + lock |
| FAQ | `faq` → `categories[]`, `items[]` | `saveSiteContent` | `FAQSection.tsx` | Replace (kategori terpakai tidak bisa dihapus) | Item `isActive` | zod + lock |
| Announcement | `announcement` | `saveSiteContent` | `AnnouncementBar.tsx` | Replace | `enabled` + periode + item `isActive` | zod + lock |
| Item solusi/modul/integrasi | `page_*` → `items[]` | `:892-1043` | **Tidak ada** | Splice | — | Tidak / tidak |
| Gambar upload | `public/uploads/cms/*` (tanpa DB) | `upload/route.ts` | `/uploads/cms/[filename]` | **Tidak pernah** | — | Magic bytes / — |

## Lampiran B — Pembersihan Lingkungan Uji Phase 15

| Database sementara | Fungsi | Status |
|---|---|---|
| `diagnova_p15_seed_test` | Reproduksi kegagalan seed dan kondisi pasca-gagal | **Dihapus** setelah dokumen disimpan (penanda `COMMENT` cocok, 0 koneksi) |
| `diagnova_p15_seed_clean` | Verifikasi perbaikan dan idempotensi | **Dihapus** (idem) |
| `diagnova_p15_eol_test` | Uji checksum CRLF/LF | **Dihapus** (idem) |

Database yang tersisa sama dengan sebelum Phase 15: `diagnova`, `diagnova_restore_check`, `diagnova_test`, `diagnova_v2`, `postgres`.

DB dev `diagnova_v2` hanya dibaca. Fingerprint md5 per baris 12 tabel **identik** dengan fingerprint awal Phase 14, dan tabel `_prisma_migrations` tetap tidak ada.

Salinan skrip seed yang diperbaiki untuk verifikasi hanya ada di scratchpad sesi; `scripts/seed_other_pages_cms.js` tidak diubah.
