> **Status dokumen (17 Nov 2026):** lampiran Phase 12 (audit statis schema & backend).
> Ringkasan, verifikasi terhadap database aktual, dan status tindak lanjut tiap temuan ada di
> `docs/FINAL_DEVELOPMENT_REVIEW.md` §9–§12. Temuan yang **sudah diperbaiki** pada fase ini:
> #5 (token/PII di log), #6 (error.message ke klien), #12 sebagian (batas `limit` LIS),
> A.7 (hapus USER yang punya riwayat lead kini ditolak 409), C.7 (notes stub kini cek admin),
> serta D.4 untuk endpoint CMS baru (optimistic locking). Temuan lain berstatus rekomendasi /
> NEEDS APPROVAL. Catatan pada baris 6 di bawah merujuk ke pekerjaan Phase 8 yang berjalan
> paralel saat audit ini dibuat.

# Audit Schema & Backend — WebsiteDiagnova (read-only, statis)

Tanggal: 2026-11-17. Cakupan: `prisma/schema.prisma`, `prisma/migrations/*`, seed, `scripts/*`, `app/api/**`, `lib/**`, `middleware.ts`.
Tidak ada file proyek yang diubah, tidak ada query ke DB. Kondisi DB riil (FK/index yang benar-benar ada) **belum diverifikasi** — semua temuan B bersifat statis.

> Catatan: selama audit berjalan muncul file baru (sekitar pukul 11:47–11:53) yang sedang dikerjakan pihak lain: `lib/models/site-content.model.ts`, `app/api/admin/cms/site/route.ts`, `lib/site-content*.ts`, `lib/cms-hero-defaults.ts`; `lib/cms-layout.ts` dan `lib/cms-hero.ts` juga ikut berubah. Bagian ini hanya diulas sekilas (C.7).

---

## Ringkasan prioritas

| # | Temuan | Severity | Lokasi |
|---|---|---|---|
| 1 | Migration history tidak menghasilkan schema saat ini (3 tabel, ±20 kolom, 1 enum, 4 FK tidak ada; enum `user_role` berbeda nilai; `lead_notes` + FK audit_logs ada di migration tapi tidak di schema). `migrate deploy` (disarankan di DOCKER_SETUP.md:85) pada DB baru menghasilkan schema yang salah | Tinggi | B |
| 2 | Nomor order & barcode LIS: pola read-max-lalu-+1 di luar transaksi → bentrok saat dibuat bersamaan (P2002 → 500). Selain itu urutan string rusak setelah urutan 9999 per hari | Tinggi | order.model.ts:63-114,152-160 |
| 3 | Worklist LIS “CITO didahulukan” terbalik: `orderBy priority asc` mengikuti urutan enum (routine, cito, urgent) sehingga ROUTINE tampil pertama | Sedang | order.model.ts:355-358, overview/route.ts:46 |
| 4 | CMS JSON (hero/partner/comparison/testimonial/nav/solution/module/integration/layout/toggle menu) memakai read-modify-write tanpa lock → lost update bila 2 admin menyimpan bersamaan | Sedang | cms.model.ts, menu.model.ts:47-89, cms-layout.model.ts:215-221 |
| 5 | Token Magic Link mentah dan PII lead ditulis ke stdout (mock email) | Tinggi (keamanan log) | email.ts:17-32, 59-84 (URL di :75) |
| 6 | `error.message` dikembalikan ke klien pada 8 handler (termasuk pesan Prisma, mis. P2000 pada users PUT) | Sedang | C.2 |
| 7 | Alur approve & konsumsi magic link: banyak write tanpa transaksi; kegagalan di tengah membakar token / meninggalkan data setengah jadi | Sedang | lead.model.ts:385-453, magic-link.ts:183-266 |
| 8 | Field demo tidak sinkron: `User.demoDurationDays` praktis tidak dipakai saat aktivasi (Lead selalu menang), `Lead.voucherExpiry` ≠ `User.demoExpiresAt`, `Lead.demoDate` hanya cermin kolom lain | Sedang | A.3 |
| 9 | Export CSV lead diam-diam terpotong 100 baris (minta 1000, model membatasi 100) | Sedang | lead.controller.ts:446 + lead.model.ts:234 |
| 10 | Timeline 14 hari di dashboard dihitung dari hanya 5 lead/order terbaru → angka salah | Sedang | overview/route.ts:40-53,106-125 |
| 11 | Spesimen: receive/reject tanpa guard status (bisa re-receive, reject spesimen yang sudah diterima); status order tidak dihitung ulang setelah reject | Sedang | specimen.model.ts:57-175 |
| 12 | LIS input tanpa zod: `listPatients` tanpa batas `limit` (bulk dump PII pasien), sex/birthDate/panjang field tidak divalidasi | Sedang | lis.controller.ts:93-96,113-127,223-247; patient.model.ts:116-125 |

---

## A. Audit Prisma schema

### A.1 Model

| Model (tabel) | Fungsi bisnis | PK | FK + onDelete | Unique | Index | Enum | Timestamps | Soft-delete |
|---|---|---|---|---|---|---|---|---|
| Role (`roles`) | Peran akses: ADMIN / USER (legacy “Super Admin” masih diterima di auth-secret.ts) | id cuid | – | name | (unique) | – | createdAt | Tidak |
| User (`users`) | Akun admin (password) dan klien demo (magic link, tanpa password) + masa aktif demo | id cuid | roleId→Role (default **SetNull**, optional) | email | (unique saja) — **roleId tanpa index** | – (status Int) | createdAt, updatedAt | Tidak (status 0/1 = nonaktif, delete = hard) |
| Lead (`leads`) | Permohonan demo dari form publik + workflow CRM/approval | id cuid | userId→User (tidak ditulis → default **SetNull** karena optional) | – | userId, email, status, approvalStatus, createdAt | InstitutionType, LeadApprovalStatus | createdAt, updatedAt | Tidak |
| DemoMagicLink (`demo_magic_links`) | Token sekali pakai (hash SHA-256) untuk login klien demo | id cuid | leadId→Lead **Cascade**; userId→User **SetNull** | tokenHash | tokenHash (**duplikat**), email, leadId — **userId tanpa index** | – | createdAt (+expiresAt, usedAt) | Tidak |
| AuditLog (`audit_logs`) | Jejak audit append-only | id cuid | **Tidak ada FK** (userId string bebas) | – | userId, (entity,recordId), createdAt | – | createdAt | Tidak |
| Patient (`patients`) | Master pasien LIS | id cuid | – | mrn, nationalId | mrn (**duplikat**), name | gender | createdAt, updatedAt | Tidak |
| Physician (`physicians`) | Dokter pengirim | id cuid | – | externalCode | (unique) | – | createdAt, updatedAt | Tidak |
| TestCatalog (`test_catalogs`) | Katalog pemeriksaan + jenis spesimen/tabung | id cuid | – | code | category | SpecimenType, TubeColor | createdAt, updatedAt | `isActive` (flag, bukan soft-delete) |
| LabOrder (`lab_orders`) | Order lab | id cuid | patientId→Patient (default **Restrict**, required); physicianId→Physician (default **SetNull**) | orderNumber | orderNumber (**duplikat**), patientId, status, priority, orderedAt — **physicianId tanpa index** | OrderPriority, OrderStatus | orderedAt, createdAt, updatedAt | Tidak |
| LabOrderItem (`lab_order_items`) | Item tes per order | id cuid | orderId→LabOrder **Cascade**; testCatalogId→TestCatalog (default **Restrict**) | – (tidak ada unique (orderId,testCatalogId)) | orderId, testCatalogId | – | createdAt | Tidak |
| Specimen (`specimens`) | Tabung/barcode spesimen per order | id cuid | orderId→LabOrder **Cascade** | barcodeNumber | barcodeNumber (**duplikat**), orderId, status | SpecimenType, TubeColor, SpecimenStatus | collectedAt, receivedAt, rejectedAt, createdAt, updatedAt | Tidak |
| CmsSection (`cms_sections`) | Semua konten CMS (homepage, navigasi, halaman dalam, layout_*, footer/faq/announcement) dalam satu baris per key + JSON `extraContent` | id cuid | – | sectionKey | (unique) | – | createdAt, updatedAt | `isPublished` (flag) |

### A.2 Field per model (tipe / nullable / default)

| Model | Field (tipe, ? = nullable, default) |
|---|---|
| Role | name VarChar(50); description? VarChar(255); createdAt now() |
| User | name VarChar(100); email VarChar(255); passwordHash? VarChar(255); institution? VarChar(150); jobTitle? VarChar(100); phone? VarChar(30); roleId?; status Int =1; demoDurationDays? Int; demoActivatedAt?; demoExpiresAt?; createdAt; updatedAt |
| Lead | userId?; name VarChar(100); institution VarChar(150); jobTitle VarChar(100) (**tanpa @map → kolom "jobTitle" camelCase**, tidak konsisten dengan snake_case lain); email VarChar(255); phone VarChar(30); institutionType =HOSPITAL; notes? Text; status Int =1; approvalStatus =PENDING; approvedAt?; approvedBy? VarChar(100) (nama, bukan id); rejectionReason?; requestedDemoDate?; confirmedDemoDate?; demoDate?; demoDurationDays Int =**3**; voucherCode? VarChar(50); voucherExpiry?; createdAt; updatedAt |
| DemoMagicLink | tokenHash VarChar(128); email VarChar(255); leadId; userId?; expiresAt; usedAt?; ipAddress? VarChar(50); userAgent? VarChar(255); createdAt |
| AuditLog | userId?; action VarChar(100); entity VarChar(100); recordId? VarChar(100); oldValue? Json; newValue? Json; ipAddress?; userAgent?; createdAt |
| Patient | mrn VarChar(50); nationalId? VarChar(30); name VarChar(120); birthDate DateTime; sex gender; phone?; address? Text |
| Physician | externalCode VarChar(50); name VarChar(120); specialization VarChar(100); department VarChar(100) |
| TestCatalog | code VarChar(50); name VarChar(150); category VarChar(100); specimenType =WHOLE_BLOOD; tubeColor =LAVENDER_EDTA; unit? VarChar(30); tatMinutes Int =60; isActive =true |
| LabOrder | orderNumber VarChar(50); patientId; physicianId?; sourceLocation VarChar(100); priority =ROUTINE; clinicalNotes? Text; status =ORDERED; orderedAt now() |
| LabOrderItem | orderId; testCatalogId; createdAt |
| Specimen | barcodeNumber VarChar(50); orderId; specimenType; tubeColor; volume? ="3.0 mL"; collectedAt now(); receivedAt?; status =COLLECTED; rejectionReason?; rejectedBy? VarChar(100); rejectedAt?; receivedBy? VarChar(100) |
| CmsSection | sectionKey VarChar(50); badgeId/badgeEn/titleId/titleEn/subtitleId/subtitleEn? Text; extraContent? Json; isPublished =true; updatedBy? VarChar(100) (berisi userId atau "SYSTEM", tanpa FK) |

### A.3 Enum

| Enum (DB type) | Dipakai di model? | Dipakai kode? | Catatan |
|---|---|---|---|
| LeadApprovalStatus (`lead_approval_status`) | Lead.approvalStatus | Ya | – |
| **LeadStatus** (`lead_status`) | **Tidak** (Lead.status = Int 1-4) | Tidak (types/index.ts:9 `LeadStatus = number` adalah alias TS terpisah) | **Tidak terpakai**; sisa migration 1 |
| InstitutionType | Lead | Ya | – |
| **UserRole** (`user_role`) | **Tidak** (pakai tabel Role) | Tidak | **Tidak terpakai**; nilai di schema (`admin`,`user`) ≠ migration 2 (`super_admin`,`sales_admin`,`lab_staff`,`pathologist`) |
| **UserStatus** (`user_status`) | **Tidak** (User.status = Int) | Tidak | **Tidak terpakai** |
| OrderPriority | LabOrder | Ya | Urutan deklarasi ROUTINE<CITO<URGENT → sort `asc` salah (lihat D.3) |
| OrderStatus | LabOrder | Hanya ORDERED & SPECIMEN_RECEIVED pernah di-set | PROCESSING/PARTIALLY_VALIDATED/COMPLETED/CANCELLED belum ada alurnya |
| SpecimenStatus | Specimen | COLLECTED/RECEIVED_IN_LAB/REJECTED | PROCESSING/ARCHIVED belum pernah di-set |
| SpecimenType, TubeColor | TestCatalog, Specimen | Ya | TubeColor `other` huruf kecil tanpa @map (gaya beda, nilai DB tetap 'other') |
| gender | Patient | Ya | Nama enum huruf kecil (gaya beda) |

Rekomendasi: hapus LeadStatus/UserRole/UserStatus dari schema **setelah** baseline migration (D-drop type), usages = 0 di lib/, app/, components/, prisma/seed*, scripts/ (grep `LeadStatus|UserRole|UserStatus` hanya menemukan nama fungsi `updateLeadStatus*`/`toggleUserStatus` dan alias TS).

### A.4 Pemakaian model (grep `db|prisma|tx.<model>.`)

| Model | lib/ & app/ | prisma/seed* | scripts/ |
|---|---|---|---|
| role | lib/models/user.model.ts, lib/models/lead.model.ts, lib/magic-link.ts, app/api/admin/users/route.ts | seed.ts | check_pre_migration, migrate_roles_users, verify_roles_users, verify_tahap6_complete, verify_user_management, qa/{admin,cms-layout,lis,security} |
| user | user.model, lead.model, magic-link, auth-guard, app/api/admin/overview | seed.ts | check_pre_migration, migrate_roles_users, verify_database_tables, verify_roles_users, verify_tahap6_complete, verify_user_management, qa/* (6) |
| lead | lead.model, magic-link, overview route | – | qa/{demo-workflow,magic-link-misconfig,security} |
| demoMagicLink | magic-link, lead.model | – | qa/{demo-workflow,magic-link-misconfig} |
| auditLog | audit.model, lead.model (getLeadHistory) | – | qa/* (7) |
| patient | patient.model | seed.ts | qa/lis, verify_tahap6_complete |
| physician | physician.model | seed.ts | – |
| testCatalog | catalog.model, order.model | seed.ts | – |
| labOrder | order.model, specimen.model, overview route | seed.ts | qa/lis, verify_tahap6_complete |
| labOrderItem | order.model | (nested create di seed.ts) | qa/lis |
| specimen | order.model, specimen.model, overview route | (nested di seed.ts) | qa/lis |
| cmsSection | cms.model, cms-layout.model, menu.model, site-content.model (baru) | seed-cms.ts | 17 script (lihat E) |

### A.5 Field yang tidak/kurang terpakai & data yang bisa tidak sinkron

| Field | Ditulis | Dibaca | Temuan |
|---|---|---|---|
| Lead.voucherCode | approveLead (lead.model.ts:435,450) | formatLeadRecord :152, CSV export, overview API | Tidak ditampilkan di UI mana pun; `handleCopyVoucher` di leads/page.tsx:421 tidak pernah dipanggil (dead UI). Tidak dipakai untuk autentikasi. Kandidat hapus (perlu ubah 4 file + types) |
| Lead.voucherExpiry | approve (:436-437 = waktu approve + durasi), extend (:599) | CSV, overview | **Tidak sinkron** dengan User.demoExpiresAt (masa aktif riil dihitung sejak login pertama, magic-link.ts:220-227). Hanya sinkron setelah “extend” |
| Lead.demoDate | createLead :205, approve :448, updateLeadStatus :538 | hanya fallback di formatLeadRecord :138-150 | Kolom cermin requested/confirmed; redundan. Hapus setelah backfill `requested_demo_date = COALESCE(requested_demo_date, demo_date)` |
| Lead.requestedDemoDate / confirmedDemoDate | ya | leads/page.tsx, email, CSV | Terpakai |
| Lead.demoDurationDays (default 3) vs User.demoDurationDays (null, createUser default 7) | approve menulis keduanya (:409/:419, :449) | aktivasi: `lead.demoDurationDays \|\| user.demoDurationDays \|\| 7` (magic-link.ts:222) | Lead selalu ≥1 → **User.demoDurationDays tidak pernah menentukan durasi**; input “Alokasi Voucher Demo” di users/page.tsx:664-675 tidak berpengaruh. Default berbeda-beda: schema 3, formatLeadRecord 3, approve 7, createUser 7, email 7 |
| User.demoActivatedAt/ExpiresAt | magic-link aktivasi, extend | middleware (via JWT), leads/users page | Satu periode per **user**, bukan per lead: lead ke-2 untuk email yang sama yang di-approve setelah demo pertama habis → link selalu gagal `demo_expired` (magic-link.ts:178) kecuali admin “extend” |
| Lead.approvedAt / approvedBy | approve; **juga dipakai untuk reject** (lead.model.ts:486-487) | UI | Semantik ganda (tanggal/nama penolak disimpan di kolom “approved”) |
| Specimen.receivedBy / rejectedBy, Lead.approvedBy | nama admin (string) | UI | Bukan id → tidak bisa ditelusuri bila nama berubah; audit receive/reject **tanpa userId** (specimen.model.ts:107,160) |
| AuditLog.userName (DTO) | – | audit.model.ts:63 selalu `null` | Halaman audit tidak bisa menampilkan aktor |
| CmsSection.updatedBy | updateCmsSection, savePageLayout/Hero, toggleMenuStatus (`"SYSTEM"` bila tanpa user, menu.model.ts:74) | sync_page_hero_defaults.js (skip bila terisi) | Tidak di-set oleh saveHeroSlide/savePartner/… (cms.model.ts) → inkonsisten |

### A.6 Index

| Jenis | Detail | Aksi (butuh migration) |
|---|---|---|
| Redundan (`@unique` + `@@index` kolom sama) | DemoMagicLink.tokenHash (:78/:90), Patient.mrn (:117/:128), LabOrder.orderNumber (:166/:181), Specimen.barcodeNumber (:204/:220) | Hapus `@@index` (DROP INDEX), risiko rendah |
| Tidak efektif | Lead.email, Patient.name: hanya dipakai lewat `contains … insensitive` (ILIKE '%x%') yang tidak memakai B-tree | Bila perlu: GIN pg_trgm |
| Kurang (FK tanpa index) | DemoMagicLink.userId, User.roleId, LabOrder.physicianId | Tambah `@@index` (dibutuhkan saat SetNull pada delete user/role/physician) |
| Kurang (pola query) | Patient.createdAt (listPatients/searchPatients orderBy createdAt, patient.model.ts:41,126); LabOrder (priority, orderedAt) untuk worklist (order.model.ts:355-358); opsional Lead (approvalStatus, createdAt) | Tambah index komposit |

### A.7 Relasi / FK — dampak hapus User (`deleteUser`, user.model.ts:200-236)

- Tidak ada relasi **required** ke User → **tidak terjadi P2003**. Lead.userId (default SetNull) dan DemoMagicLink.userId (SetNull eksplisit) menjadi NULL; AuditLog.userId dibiarkan (tanpa FK) → aktor tampil “Pengguna terhapus” (lead.model.ts:651).
- Efek samping: riwayat aktivasi demo hilang; bila lead di-approve ulang/link valid dipakai, user baru dibuat dengan `demoActivatedAt = null` → **periode demo baru penuh**.
- Peringatan: perilaku di atas berlaku **bila DB dibuat via `db push`**. Bila FK `audit_logs_user_id_fkey` dari migration 2 masih ada, audit_logs.user_id juga di-SET NULL. Wajib cek DB riil.
- Role → User default SetNull: menghapus role ADMIN membuat admin kehilangan akses (hanya dilakukan scripts/migrate_roles_users.js).
- Patient → LabOrder Restrict, TestCatalog → LabOrderItem Restrict: belum ada endpoint delete, aman.

---

## B. Migration history (statis)

| Folder | Isi |
|---|---|
| 20261013162422_init_leads | enum `lead_status`, `institution_type`; tabel `leads` (status **enum** default 'new', tanpa user_id/approval); index email, status, created_at |
| 20261016022305_add_users_and_audit | enum `user_role` (super_admin, sales_admin, lab_staff, pathologist), `user_status`; tabel `users` (password_hash **NOT NULL**, kolom `role` enum, `status` enum), **`lead_notes`**, `audit_logs`; FK lead_notes→leads CASCADE, lead_notes→users SET NULL, **audit_logs.user_id→users SET NULL** |
| 20261016060944_add_lis_core_preanalytic | enum gender, order_priority, order_status, specimen_type, tube_color, specimen_status; tabel patients, physicians, test_catalogs, lab_orders, lab_order_items, specimens + semua index/FK LIS — **sesuai schema** |

`migration_lock.toml`: provider = "postgresql". **Tidak ada DROP statement** di ketiga migration.

### Ada di schema.prisma tetapi TIDAK dibuat migration

| Objek | Detail |
|---|---|
| Tabel | `roles`, `demo_magic_links`, `cms_sections` (seluruh kolom, unique & index-nya) |
| Enum | `lead_approval_status`; nilai `user_role` berbeda total (schema: admin,user) |
| users | kolom institution, job_title, phone, role_id (+FK→roles), demo_duration_days, demo_activated_at, demo_expires_at; `status` Int (migration: enum); `password_hash` nullable (migration: NOT NULL); kolom `role` enum ada di migration tapi tidak di schema |
| leads | user_id (+FK, + index leads_user_id_idx), `status` Int default 1 (migration: enum), approval_status (+index), approved_at, approved_by, rejection_reason, requested_demo_date, confirmed_demo_date, demo_date, demo_duration_days, voucher_code, voucher_expiry |
| FK | users.role_id→roles; leads.user_id→users; demo_magic_links.lead_id→leads CASCADE; demo_magic_links.user_id→users SET NULL |
| Ada di migration, tidak di schema | tabel `lead_notes` + 2 FK + 2 index; FK `audit_logs_user_id_fkey` |

Konsekuensi: `prisma migrate deploy` pada DB kosong (DOCKER_SETUP.md:85) membuat schema lama → Prisma Client gagal runtime (kolom tidak ada, tipe status salah). Pada DB yang dibuat `db push` tanpa `_prisma_migrations`, deploy akan gagal (type sudah ada). `migrate diff` dari history → schema akan berisi DROP (`lead_notes`, kolom `users.role`, ubah tipe status). Perbaikan: baseline migration dari schema saat ini + `migrate resolve --applied` di DB yang sudah sinkron (setelah backup).

---

## C. Peta arsitektur backend

### C.1 Alur per domain

| Domain | Frontend → API → controller/service → model Prisma | Validasi | Authz | Transaksi | Pagination | Catatan |
|---|---|---|---|---|---|---|
| Authentication | admin/login/page.tsx → `POST /api/auth/login` → auth.controller.loginController → user.model.findUserByEmail → User, Role, AuditLog; `logout`, `me` | zod loginSchema | publik + rate limit in-memory 5/15 mnt (IP+email) | – | – | LOGIN_FAILED menyimpan `attemptedEmail` ke audit (auth.controller.ts:57). `/api/auth/me` mengembalikan payload JWT tanpa cek DB. Rate-limit memakai X-Forwarded-For pertama (auth-guard.ts:54) → bisa dipalsukan bila tidak di belakang proxy tepercaya |
| Authorization | middleware.ts (matcher :81: /admin, /api/admin, /api/lis; cek JWT + role) + `requireAdmin()` (auth-guard.ts:18, cek ulang DB) | – | Semua handler admin/LIS memanggil requireAdmin **kecuali** `POST /api/admin/leads/[id]/notes` (stub, hanya middleware) | – | – | Baik: defence in depth |
| Users | admin/users/page.tsx → `/api/admin/users` (GET/POST), `/[id]` (PUT/DELETE), `/[id]/status` (PATCH) → user.model → User, Role | zod create/update/status | requireAdmin + proteksi akun admin (route **dan** model, duplikat) | – | **GET tanpa limit** (getAllUsers, user.model.ts:99) | P2002 → 400 (sebaiknya 409). Schema tanpa max length institution/jobTitle/phone → P2000 → 500 dengan pesan Prisma dibocorkan di PUT. `status` create tanpa batas (validations.ts:104), update tidak `.int()` (:115) |
| Leads | admin/leads/page.tsx → `/api/admin/leads` (+`[id]`, approve, reject, complete, extend, history, export) → lead.controller → lead.model → Lead, User, Role, DemoMagicLink, AuditLog | zod (approve/reject/status/extend); query list manual (`parseInt`, NaN → 500) | requireAdmin | reject & extend: `$transaction([])`; **approve tidak** | list: take ≤100; **export dipotong 100** (lead.controller.ts:446 vs lead.model.ts:234) | `lib/leads.ts` = wrapper re-export (getLeads tidak dipakai) |
| Demo workflow | createLead → status 2; magic link login pertama 2→3; admin complete 3→4; manual 1→2 | – | – | Transisi atomik `updateMany where {id,status:from}` (lead.model.ts:85-91) — **terkonfirmasi** dipakai di updateLeadStatus :528, completeLead :562, magic-link :250 | – | approve tidak menjaga approvalStatus (approve setelah reject diizinkan = “reissue”); reject tidak mencabut sesi aktif klien |
| Magic Link | Email/WA → `/auth/verify-magic-link` (GET, inspectMagicLink, tidak konsumsi) → form POST `/api/auth/magic-link` → verifyAndConsumeMagicLink → DemoMagicLink, User, Role, Lead, AuditLog | regex token 64 hex | Same-origin check + rate limit 20/15 mnt | Konsumsi atomik (`updateMany usedAt null`, magic-link.ts:183-191); **langkah sesudahnya tidak dalam transaksi** (:193-266) | – | Token hanya hash di DB (baik); tetapi URL mentah di-log email.ts:75 |
| CMS homepage hub | admin/cms/page.tsx → `/api/admin/cms/homepage` GET/PUT (type=section/hero_slide/…/navigation/solution_item/…) → cms.model → CmsSection | **Tidak ada** (body langsung ke model; `data.id` saat data undefined → TypeError) | requireAdmin | Tidak; read-modify-write JSON | findMany all (kecil) | URL di JSON tidak divalidasi (berbeda dengan layout yang memakai isSafeCmsUrl) |
| CMS layout | admin/page-sections/page.tsx → `/api/admin/cms/layout` → cms-layout.model (savePageLayout/savePageHero) → CmsSection | zod ketat + isSafeCmsUrl | requireAdmin | upsert tunggal, tapi baca `existing` lalu merge (:215-221) | – | Error domain CmsLayoutError → 400; selain itu pesan generik (baik) |
| Navigasi | Navbar.tsx → `/api/menus` → cms.model.getPublicCmsNavigationMenus; admin edit lewat **cms/homepage type=navigation**. `/api/admin/menus*` (GET/POST/PUT/DELETE/PATCH status) → menu.model (wrapper cms.model) | homepage: none; menus: zod (field `sectionId` tidak cocok dengan `sectionKey` di model; `url` nullable padahal tipe string) | requireAdmin | Tidak | – | **/api/admin/menus\*, /api/admin/roles tidak dipanggil frontend** (admin/menus/page.tsx hanya redirect ke /admin/cms?tab=navigation). Komentar “Soft delete” (menus/[id]/route.ts:78) tidak benar—hard remove dari JSON |
| Upload | ImageUploader/BulkImageUploader → `POST /api/admin/cms/upload` → fs.writeFile `public/uploads/cms`; disajikan `GET /uploads/cms/[filename]` | magic bytes, SVG filter, 10 MB/file, nama disanitasi | requireAdmin (upload); publik (serve, regex nama aman + CSP sandbox) | – | Jumlah file per request tidak dibatasi | Tidak ada record DB (model Media sudah dihapus) → file yatim tidak terlacak; filesystem serverless (Vercel) tidak persisten |
| LIS | admin/orders/page.tsx → `/api/lis/{catalog,patients,physicians,orders,orders/[id],specimens/[barcode]/receive|reject}` → lis.controller → catalog/patient/physician/order/specimen.model | **manual** (cek keberadaan field saja) | requireAdmin di setiap handler | createLabOrder & receiveSpecimen pakai tx; nomor dibuat di luar tx; rejectSpecimen tanpa tx | orders take ≤100; **patients `limit` tanpa batas** (lis.controller.ts:94 → patient.model.ts:125); physicians/catalog unbounded (kecil) | GET catalog menulis data (`ensureDefaultCatalog`, race createMany → P2002) |
| Audit log | admin/audit-logs/page.tsx → `/api/admin/audit-logs` → audit.model.getAuditLogs(limit 100) | – | requireAdmin | – | Fixed 100, tanpa filter/pagination dari query | userName selalu null |
| Request-demo | (marketing)/request-demo/page.tsx → `POST /api/request-demo` → lib/leads.saveLead → lead.model.createLead → User (lookup), Lead; AuditLog; email mock | zod demoRequestSchema (email tanpa max 255) | publik, rate limit 5/jam/IP | – | – | Tidak ada dedupe lead per email |
| Overview | admin/dashboard → `/api/admin/overview` | – | requireAdmin | – | – | Timeline 14 hari dari 5 baris saja; activeUsers termasuk admin |

### C.2 `error.message` / `err.message` yang dikirim ke klien

| File:baris | Status | Risiko |
|---|---|---|
| app/api/admin/cms/homepage/route.ts:151 | 500 | TypeError / pesan Prisma (mis. P2025) terekspos |
| app/api/admin/menus/route.ts:83 | 400 | sama; semua error jadi 400 |
| app/api/admin/menus/[id]/route.ts:70 dan :104 | 400 | sama |
| app/api/admin/menus/[id]/status/route.ts:57 | 500 | sama |
| app/api/admin/users/[id]/route.ts:97 dan :162 | 403/500 | P2000 (value too long) dari Prisma dikembalikan; status ditentukan dari `message.includes("Akses ditolak")` (rapuh) |
| app/api/admin/users/[id]/status/route.ts:90 | 403/500 | sama |
| lib/controllers/lis.controller.ts:32 (`safeLisErrorMessage`) | 400/500 | Error Prisma difilter (baik), tetapi TypeError dari input tak valid (mis. `testCatalogCodes` string → `.map is not a function`, `mrn` angka → `.trim is not a function`) tetap terekspos |

Aman (pesan generik/domain): auth.controller, lead.controller (`workflowErrorResponse` :124-130), cms/layout, cms/site, upload, overview, audit-logs, roles, request-demo.

### C.3 Logging PII / rahasia

| Lokasi | Isi |
|---|---|
| lib/email.ts:17-32 | Setiap request-demo: nama, email, telepon, catatan ke stdout |
| lib/email.ts:59-84 | Setiap approve: email + **URL magic link berisi token mentah** (:75) → siapa pun dengan akses log dapat login sebagai klien selama 24 jam |
| lis.controller.ts:67,102,137,175,212,258,292,337,365 | `console.error(error)`; PrismaClientValidationError memuat argumen query (data pasien) |
| lib/db.ts | `log: ["query"]` hanya di development (parameter tidak dicetak) — OK |

### C.4 Transaksi yang hilang (multi-step write)

| Fungsi | Langkah terpisah | Dampak bila gagal di tengah |
|---|---|---|
| approveLead (lead.model.ts:385-453) | role.create? → user.create/update → createDemoMagicLink (tx sendiri, mematikan link lama) → lead.update | Link lama sudah mati, link baru ada, lead belum APPROVED → link baru ditolak `not_approved` |
| verifyAndConsumeMagicLink (magic-link.ts:183-266) | consume → role/user.create → link.update → lead.update → user.update (aktivasi) → audit → transisi | Token terbakar tanpa sesi; user tanpa aktivasi |
| updateLeadStatus (lead.model.ts:518-540) | transisi status → update tanggal | Status berubah, tanggal gagal (minor) |
| createLabOrder (order.model.ts:152-160) | nomor dihitung **sebelum** tx | Lihat D.1 |
| receiveSpecimen (specimen.model.ts:62-72) | cek status di luar tx | check-then-act race dengan reject |
| rejectSpecimen (:149-157) | tidak menghitung ulang status order | Order bisa macet ORDERED |
| CMS JSON (semua save/delete di cms.model.ts, menu.model.ts:47-89, cms-layout.model.ts:215-221) | read → modify → write | Lost update (D.4) |

### C.5 Duplicate handling (P2002)

Ditangani: users POST (→400), patients POST (→409). **Tidak ditangani** (jadi 500 generik): approveLead `user.create` & magic-link `user.create` (race email sama), `role.create("USER")` paralel (lead.model.ts:392, magic-link.ts:196), createLabOrder (orderNumber/barcode), ensureDefaultCatalog createMany paralel (catalog.model.ts:101-102,224).

### C.6 Konsistensi respons

ApiResponse `{success,message,data?,errors?}` (types/index.ts:116) dipakai hampir semua route. Pengecualian: `/api/admin/leads/export` (CSV; error = teks polos "Error generating CSV"), `/api/auth/magic-link` (redirect 303), `/uploads/cms/[filename]` (biner/teks), `/api/admin/leads/[id]/notes` (stub `success:true` tanpa aksi). Kode status tidak seragam: semua error menus → 400, LIS receive/reject → 400 bahkan untuk error DB, P2002 user → 400 vs pasien → 409.

### C.7 Logika terduplikasi / file tak terpakai di lib/

| Item | Status |
|---|---|
| lib/leads.ts | Wrapper re-export; hanya `saveLead` dipakai (request-demo). `getLeads` tidak dipakai |
| lib/models/menu.model.ts | Wrapper cms.model; hanya dipakai oleh endpoint `/api/admin/menus*` yang **tidak dipanggil frontend**. `getPublicNavigationMenus` tidak dipakai |
| Endpoint yatim | `/api/admin/menus` (GET/POST), `/api/admin/menus/[id]` (PUT/DELETE), `/api/admin/menus/[id]/status`, `/api/admin/roles`, `/api/admin/leads/[id]/notes` (stub) |
| Fungsi tak dipakai | cms.model.ts:1051-1098 (getSolutionsPageData, getModulesPageData, getIntegrationsPageData, getNovaAiPageData, getPlatformPageData); magic-link.getLatestMagicLinkForLead; patient.findPatientByMrn; physician.getPhysicianById; catalog.findTestByCode, specimenTypeToPrisma, tubeColorToPrisma; specimen.specimenStatusToPrisma; opsi filter getAuditLogs |
| Duplikasi | Mapping LabOrder→DTO 2x (order.model.ts:245-307 & 372-434); mapping User→SafeUser 5x (user.model.ts); pembuatan role USER 2x (lead.model.ts:390-398, magic-link.ts:194-198); katalog default 2x (catalog.model.ts:104-222 & seed.ts:86+); proteksi admin di route + model; dua jalur simpan navigasi dengan validasi berbeda |
| Gaya | cms.model.ts:1042-1049 `import` di tengah file |
| Baru (WIP) | site-content.model.ts + `/api/admin/cms/site`: zod lengkap, error domain → 400, simpan dokumen utuh (last-write-wins, bukan merge) — pola yang baik |

---

## D. Integritas & race condition

### D.1 Nomor order & barcode LIS

| Aspek | Order number | Barcode spesimen |
|---|---|---|
| Format | `ORD-YYYYMMDD-NNNN` | `SP-YYMMDD-NNNN` |
| Cara | `findFirst startsWith prefix orderBy desc` → +1 (order.model.ts:63-86) | sama (:91-114), lalu increment lokal per tabung (:188) |
| Lokasi | **di luar** `$transaction` (:152, :155) | sama |
| Race | Dua request bersamaan membaca nilai max yang sama → nomor sama | sama; juga antar-order |
| Unique DB | Ya `lab_orders_order_number_key` | Ya `specimens_barcode_number_key` |
| Hasil bentrok | Insert kedua P2002 → tx rollback → 500 “Gagal membuat order lab.” (**bukan duplikat diam-diam**, tapi order gagal) | sama |
| Bug tambahan | Sort string: setelah `-9999`, `-10000` < `-9999` → max selalu 9999 → P2002 permanen sampai ganti hari | sama (lebih cepat tercapai: 1 order = beberapa tabung) |
| Zona waktu | Tanggal dari jam server (`new Date()` lokal); di server UTC, order 00:00–07:00 WIB memakai tanggal kemarin | sama |

Usulan:

| Opsi | Cara | Migration? | Dampak |
|---|---|---|---|
| A (cepat) | Retry 3–5x saat P2002 pada `orderNumber`/`barcodeNumber` (regenerasi nomor) | Tidak | Hilangkan error di beban normal; tidak menyelesaikan bug >9999 |
| B | Interactive `$transaction` + `SELECT pg_advisory_xact_lock(<konstanta>)` lalu hitung nomor **di dalam** tx | Tidak | Serialisasi pembuatan order (cukup untuk volume RS); tetap perbaiki sort |
| C (disarankan jangka panjang) | Tabel counter `(scope, date)` + `INSERT … ON CONFLICT DO UPDATE SET value = value + n RETURNING value` di dalam tx (reservasi n barcode sekaligus) | Ya (model baru) | Atomik, tanpa scan max, reset harian alami |
| Perbaikan sort | Ambil max numerik: `MAX(split_part(order_number,'-',3)::int)` via raw SQL atau padding 6 digit | Tidak | Menghindari macet di 9999 |
| Zona waktu | Hitung tanggal dengan `Asia/Jakarta` eksplisit | Tidak | Konsisten dengan operasional |

### D.2 Celah validasi input LIS

| Endpoint | Celah |
|---|---|
| POST /api/lis/patients (lis.controller.ts:113-127) | Hanya cek field ada. `sex` tidak divalidasi (nilai lain → undefined → Prisma error 500); `birthDate` tidak diparse (Invalid Date → 500); tipe non-string → TypeError bocor; tanpa max length (mrn 50, name 120, nationalId 30, phone 30) → P2000 → 500 |
| GET /api/lis/patients (:93-96) | `page`/`limit` tanpa clamp; `limit=100000` mengembalikan seluruh data pasien; NaN → 500 |
| POST /api/lis/orders (:229-247) | `patientId` tidak dicek → P2003 → 500 (seharusnya 400/404); `physicianId` sama; `testCatalogCodes` tidak dicek array/string; kode tidak dikenal **dibuang diam-diam** (order.model.ts:125-134, hanya gagal bila semua invalid); `priority` invalid → diam-diam ROUTINE; `sourceLocation` >100 → 500; tanpa batas jumlah item |
| GET /api/lis/orders (:162-163) | `parseInt` NaN → 500 |
| POST specimens/[barcode]/receive | Tidak ada guard status selain REJECTED: bisa re-receive (menimpa receivedAt/By), menerima ARCHIVED/PROCESSING |
| POST specimens/[barcode]/reject | `reason` tanpa max; tidak ada guard status (bisa reject spesimen RECEIVED/PROCESSING, reject ulang); status order tidak dievaluasi ulang → bila tabung terakhir yang COLLECTED ditolak, order tetap ORDERED; bila sisanya diterima, order jadi SPECIMEN_RECEIVED walau ada yang ditolak |

### D.3 Urutan prioritas worklist

`orderBy: [{ priority: "asc" }, { orderedAt: "desc" }]` (order.model.ts:355-358, overview/route.ts:46). PostgreSQL mengurutkan enum menurut urutan deklarasi (`routine`, `cito`, `urgent`) → **ROUTINE di atas**, berlawanan dengan komentar “CITO didahulukan”. Perbaikan tanpa migration: sort di aplikasi atau raw `ORDER BY CASE priority WHEN 'cito' THEN 0 WHEN 'urgent' THEN 1 ELSE 2 END`. Dengan migration: ubah urutan enum (rumit di PG) atau kolom `priority_rank`.

### D.4 Race read-modify-write lain

| Area | Pola | Risiko | Usulan |
|---|---|---|---|
| CMS JSON (cms.model.ts: saveHeroSlide :194-240, deleteHeroSlide, savePartner, saveComparisonItem, saveTestimonial, saveCmsNavigationMenu :683-787, delete*, saveSolution/Module/IntegrationItem :888-1039; menu.model.ts:47-76; cms-layout.model.ts:215-221) | Baca seluruh `extraContent` → ubah array → tulis seluruh JSON | Dua admin (atau dua tab) menyimpan bersamaan → perubahan salah satu hilang tanpa error | Optimistic lock dengan `updatedAt` yang sudah ada: `updateMany({ where:{ sectionKey, updatedAt: prev }})` → bila count 0 kembalikan 409 (tanpa migration); atau interactive tx + `SELECT … FOR UPDATE` |
| Lead status | `updateMany where {id, status: from}` | **Aman** (terkonfirmasi) | – |
| Magic link consume | `updateMany where {id, usedAt: null, expiresAt > now}` | **Aman** | – |
| extendDemoAccess (lead.model.ts:593-600) | Baca demoExpiresAt → hitung → tulis | Dua extend bersamaan: satu perpanjangan hilang | Update relatif via raw SQL atau guard `where demoExpiresAt = prev` |
| ensureDefaultCatalog | count → createMany | Dua GET catalog pertama paralel → P2002 → 500 | `createMany({ skipDuplicates: true })` |
| savePageLayout / savePageHero | findUnique → upsert | Lost update pada merge `extraContent` (layout) | Sama seperti CMS JSON |

---

## E. Kode legacy / script

### E.1 Script yang mereferensikan model/tabel yang sudah tidak ada (akan crash)

| Script | Referensi mati | Risiko bila dijalankan |
|---|---|---|
| scripts/seed_menus.js | `prisma.menu` | TypeError (delegate undefined) |
| scripts/verify_menus.js | `prisma.menu` (+ `deleteMany` :135) | Crash |
| scripts/migrate_menus_to_cms_json.js | `prisma.menu` | Crash setelah findMany cmsSection; upsert navigation tidak tercapai |
| scripts/migrate_cms_to_json.js | `cmsHeroSlide`, `cmsComparisonItem`, `cmsPartner`, `cmsTestimonial` | Crash |
| scripts/inspect_cms.js, inspect_child_cms.js, verify_cms_json_merge.js | model cms_* lama | Crash |
| scripts/audit_actual_condition.js | `media`, `menu`, model cms_* lama | Crash |
| scripts/verify_tahap6_complete.js | `media`, `menu`, `cmsPartner` (delete :147, :190) | Crash; sebelum crash bisa menulis data uji |
| scripts/export_json_snapshot.js | `SELECT * FROM` cms_hero_slides/… (try/catch per tabel) | Tidak crash, tetapi **mendump seluruh tabel termasuk users.password_hash, leads, patients** ke `backups/…json` (folder sudah di-.gitignore) |
| scripts/check_media_columns.js, check_menus_columns.js | query information_schema tabel lama | Hasil kosong (aman) |

### E.2 Script/seed destruktif atau mengubah data

| File | Operasi | Risiko |
|---|---|---|
| scripts/migrate_roles_users.js | `role.deleteMany({ name notIn [ADMIN,USER] })` (:78) dalam tx; meng-update role akun tertentu via **email pribadi yang di-hardcode** | Sekali pakai; berbahaya bila dijalankan ulang di env lain; mengandung PII di kode |
| scripts/verify_user_management.js | create + `deleteMany`/`delete` user uji (:163, :184) | Tanpa guard localhost/production |
| scripts/qa/*.test.mjs (7 file) | `deleteMany` user/lead/auditLog/cmsSection uji | Ada guard: hanya jalan bila DATABASE_URL localhost dan NODE_ENV ≠ production |
| scripts/verify_restore.ps1 | `DROP DATABASE diagnova_backup_test` | Hanya DB uji |
| scripts/append_cms_helpers.js, append_page_getters.js, fix_type_errors.js, fix_uploader_props.js, update_cms_homepage_page.js, update_sections_image.js, update_testimonial_avatar.js | **Menulis ulang file source** (cms.model.ts, halaman admin, komponen) | Menjalankan ulang dapat merusak kode saat ini; kandidat dihapus/diarsipkan |
| prisma/seed.ts | upsert role & 2 admin (password **tidak** di-reset pada update), createMany katalog bila kosong, sampel pasien/dokter/order bila kosong | Tidak destruktif. Password default development ada di kode (:42, :63) tetapi ditolak di production |
| prisma/seed-cms.ts | upsert section hanya bila belum ada (kecuali `SEED_CMS_OVERWRITE=true`); `seedItems` mengisi array bila kosong | Bila admin sengaja mengosongkan daftar item, seed berikutnya mengisinya kembali |
| scripts/seed_other_pages_cms.js | upsert `update: {}` | Aman |
| scripts/sync_page_hero_defaults.js | update hero bila `updatedBy` kosong | Aman selama admin menyimpan lewat jalur yang mengisi updatedBy |

---

## Rekomendasi berurutan (tanpa menghapus apa pun sebelum usages dicek ulang)

1. Backup DB → buat **baseline migration** dari schema saat ini → `migrate resolve --applied` di DB yang ada; perbarui DOCKER_SETUP.md.
2. Hentikan log token magic link & PII di lib/email.ts.
3. Ganti `err.message` di 8 handler (C.2) dengan pesan generik + map error domain.
4. LIS: retry/advisory lock untuk nomor (D.1), perbaiki sort numerik & prioritas (D.3), zod untuk patients/orders/specimens, clamp `limit`, guard status spesimen.
5. CMS: optimistic locking memakai `updatedAt`.
6. Bungkus approveLead & langkah pasca-konsumsi magic link dalam `$transaction`.
7. Rapikan data demo: satu sumber kebenaran durasi/kedaluwarsa (User), hentikan/hapus voucherCode/voucherExpiry/demoDate setelah backfill; perbaiki export CSV (pagination atau batas terpisah) dan timeline overview.
8. Migration kecil: hapus 4 index redundan, tambah index FK (DemoMagicLink.userId, User.roleId, LabOrder.physicianId) & Patient.createdAt; hapus enum LeadStatus/UserRole/UserStatus.
9. Arsipkan script legacy (E.1, file-rewriter E.2) dan endpoint yatim (`/api/admin/menus*`, `/api/admin/roles`, `notes`) setelah konfirmasi tidak dipakai klien eksternal.
