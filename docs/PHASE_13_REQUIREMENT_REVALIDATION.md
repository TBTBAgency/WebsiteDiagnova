# Phase 13 — Repository & Requirement Revalidation

Tanggal: 17 November 2026 · Branch: `artha` · HEAD sebelum Phase 13: `fbdfbb4`

Tujuan dokumen ini adalah memastikan kondisi project sesuai laporan Phase 1–12 dan tidak ada requirement yang terlewat.

Status hanya diberikan berdasarkan bukti: file, fungsi, endpoint, dan hasil uji. Bukti uji utama Phase 13 adalah **run baru** seluruh suite QA (401/401) dan probe bug. Keduanya dijalankan pada database sementara hasil baseline migration dengan data sintetis (lihat `docs/PHASE_14_BASELINE_MIGRATION_TEST.md` §9). Tidak ada data dev atau production yang diubah.

Status yang dipakai:

| Status | Arti |
|---|---|
| **VERIFIED** | Implementasi ada dan diuji otomatis (QA API/unit/probe) |
| **PARTIAL** | Sebagian requirement belum terpenuhi atau ada bug terkonfirmasi |
| **NOT IMPLEMENTED** | Belum ada |
| **NEEDS TEST** | Implementasi ada, belum ada uji otomatis |
| **BLOCKED** | Menunggu keputusan pemilik atau dependency |

Uji browser yang pernah dijalankan pada Phase 8–12 (64/64) memakai skrip di luar repository. Karena itu uji tersebut **tidak** dihitung sebagai bukti di sini.

---

## 1. Ringkasan Kondisi Repository

| Pemeriksaan | Hasil |
|---|---|
| Lokasi | `C:\Users\itsupport.nr\Documents\New folder\WebsiteDiagnova`. Instruksi menyebut `C:\Users\artaa\OneDrive\Documents\DIAGNOVA VOL 1.0\WebsiteDiagnova`, tetapi path itu tidak ada di mesin ini. Remote-nya sama (`TBTBAgency/WebsiteDiagnova`) dan branch-nya sama. |
| Branch | `artha` |
| Working tree | Bersih: tidak ada perubahan yang belum di-commit, tidak ada file untracked, tidak ada stash |
| Commit terakhir | `fbdfbb4` docs: final development review (Phase 8–12) |
| Commit lokal yang belum ada di remote mana pun | **18** (`git log HEAD --not --remotes`), dari `65cc9fc` (Phase 1) sampai `fbdfbb4` |
| "ahead 267" terhadap `origin/artha` | Artefak riwayat. `origin/artha` (`a67511a`) adalah commit sebelum PR #5 di-merge ke `main`. Branch lokal sudah memuat `origin/main` (`b181637`), sehingga hitungan itu ikut menyertakan riwayat `main`. Pekerjaan baru yang belum di-push hanya 18 commit. |
| Remote berubah? | Diperiksa dengan `git ls-remote` (tanpa fetch dan tanpa mengubah ref): `artha` = `a67511a`, `main` = `b181637`, sama dengan ref lokal. Tidak ada commit remote baru yang perlu digabung. |
| `.gitignore` | Mengabaikan `.env`, `.env*.local`, `.env.docker`, `/backups/`, `*.dump`, `*.sql.gz`, `*full_backup*.sql`, dan `*.pem` |
| File sensitif yang ter-track | Tidak ada `.env` atau dump. Yang ter-track hanya contoh env (`.env.example`, `.env.docker.example`), SQL migration/proposal (struktur saja), dan `scripts/qa/secret-scan.mjs`. |
| Secret scan (`npm run scan:secrets`) | **0 HIGH**, 7 MEDIUM (tidak ada yang baru, semuanya data contoh atau fixture): password contoh di `.env.docker.example`, NIK contoh di `prisma/seed.ts` dan `scripts/qa/lis.test.mjs`, password uji di `scripts/qa/admin.test.mjs`. |
| Backup lokal (di-ignore, tidak dihapus) | `backups/pre_phase12_diagnova_v2_20261117_120854.dump`, `backups/pre_restructure_20261113/` (SQL penuh, schema, migration lama, snapshot JSON), `backups/pre_restructuring_20261113/` (SQL penuh). Semuanya berisi data sensitif dan harus tetap di luar git. |
| Struktur | `app/` (App Router: `(marketing)`, `admin`, `api`, `auth`, `uploads`), `components/`, `content/`, `lib/` (`controllers/`, `models/`), `prisma/`, `public/`, `scripts/` (44 skrip + `scripts/qa/` 11 file), `types/`, `docs/` |
| Dokumentasi | `docs/AUDIT_REPORT.md` (Phase 1–7), `docs/CMS_BACKEND_REVIEW.md`, `docs/FINAL_DEVELOPMENT_REVIEW.md` (Phase 8–12), `docs/audit/SCHEMA_BACKEND_AUDIT.md`, `docs/proposals/baseline_schema_20261117.sql`, ditambah PRD/desain. Ketidaksesuaian yang diketahui: `DOCKER_SETUP.md` masih menyarankan `migrate deploy` dengan migration lama, dan `docs/CMS_BACKEND_REVIEW.md` §10 sudah usang (dicatat di review §17). |
| TypeScript | `tsc --noEmit`: 0 error |
| Kondisi aman untuk lanjut? | **Ya.** Tidak ada perubahan lokal milik developer yang bisa tertimpa, dan tidak ada operasi git yang mengubah riwayat. |

## 2. Status Database

| Item | Kondisi |
|---|---|
| DB dev utama | `diagnova_v2` (PostgreSQL 15, container `diagnova_db`, port lokal 5435). Hanya diakses read-only. Fingerprint md5 per baris 12 tabel **identik** sebelum dan sesudah Phase 13–14. |
| Isi DB dev | users 3, roles 2, leads 1, demo_magic_links 1, audit_logs 47, cms_sections 15, patients 2, physicians 2, test_catalogs 10, lab_orders 1, lab_order_items 2, specimens 2 |
| DB lain di container | `diagnova`, `diagnova_restore_check`, `diagnova_test`: tidak disentuh |
| Prisma schema | 12 model, 11 enum (3 tidak dipakai: `LeadStatus`, `UserRole`, `UserStatus`). `prisma validate`: valid. `prisma format --check`: belum terformat (kosmetik). |
| Relasi / FK | 9 FK. `audit_logs.user_id` sengaja tanpa FK. Rincian `ON DELETE` dan uji perilakunya ada di Phase 14 §5.2 dan §9.1. |
| Unique | `users.email`, `roles.name`, `demo_magic_links.token_hash`, `patients.mrn`, `patients.national_id`, `physicians.external_code`, `test_catalogs.code`, `lab_orders.order_number`, `specimens.barcode_number`, `cms_sections.section_key` |
| Index | 46, termasuk PK. Ada 4 pasangan duplikat (unique + index biasa): `token_hash`, `mrn`, `order_number`, `barcode_number`. Belum ada index pada `users.role_id`, `demo_magic_links.user_id`, dan `lab_orders.physician_id`. |
| Migration history | `prisma/migrations` berisi 3 migration lama yang **tidak** membangun schema saat ini. DB dev **tidak** punya `_prisma_migrations` karena dibuat dengan `db push`. |
| Schema ↔ DB dev | **No difference** (`prisma migrate diff`, read-only) |
| Baseline proposal | Masih sesuai schema saat ini, dan diuji **PASS** di DB sementara (Phase 14) |
| Seed | `npm run db:seed` **gagal** di langkah `scripts/seed_other_pages_cms.js` pada environment baru (Phase 14 T-1) |

## 3. Requirement Matrix

Singkatan bukti uji:
- `sec` = `scripts/qa/security.test.mjs`
- `dw` = `demo-workflow.test.mjs`
- `adm` = `admin.test.mjs`
- `cms` = `cms.test.mjs`
- `lay` = `cms-layout.test.mjs`
- `site` = `site-content.test.mjs`
- `lis` = `lis.test.mjs`
- `unit` = `app-url.test.ts` / `magic-link-eligibility.test.ts`
- `probe` = probe Phase 14 §9.3

Semua suite lulus pada run 17 Nov di DB baseline.

### 3.1 Admin & User Management

| # | Requirement | Implementasi | Bukti uji | Status | Catatan |
|---|---|---|---|---|---|
| R-1 | Role ADMIN dan USER | Tabel `roles`; `User.roleId`; `isAdminRole()` (`lib/auth-secret.ts`); login password hanya untuk ADMIN (`lib/controllers/auth.controller.ts`) | sec "admin login -> 200", "USER password login -> 403"; adm "USER cannot log in with email + password" | VERIFIED | Role lama "Super Admin" masih diterima sebagai admin. Enum `UserRole` tidak dipakai. |
| R-2 | Akun ADMIN dipisahkan dari User Management | `getAllUsers("USER")` (`lib/models/user.model.ts`). Edit, hapus, dan status akun ADMIN → 403 di route dan model. `POST /api/admin/users` selalu memakai role USER. | adm "user list contains no ADMIN account", "editing an ADMIN account … -> 403", "deleting an ADMIN account … -> 403", "roleId=ADMIN in create payload is ignored" | VERIFIED | `PATCH …/status` terhadap ADMIN belum diuji. Pengelolaan akun admin hanya lewat seed. |
| R-3 | Pembatasan akses berdasarkan role | `middleware.ts` (`/admin/*`, `/api/admin/*`, `/api/lis/*`) dan `requireAdmin()` (`lib/auth-guard.ts`), yang memeriksa ulang ke DB di setiap handler | sec "… without session -> 401", "JWT claiming ADMIN for a USER account -> 403", "deactivated admin … -> 403"; lis §1–5 | VERIFIED (API) | Redirect halaman `/admin/*` belum punya uji otomatis di repo |
| R-4 | Pengelolaan akun demo | `/admin/users`; `GET/POST /api/admin/users`, `PUT/DELETE /api/admin/users/[id]`, `PATCH …/status`, `GET/POST …/magic-link`; `POST /api/admin/leads/[id]/extend` | adm "create/update/deactivate/delete USER", "audit log contains USER_*"; site "deleting USER with demo-request history -> 409"; dw "expiry extended by exactly 5 days" | VERIFIED | Batas durasi berbeda: user 1–365 hari, approve/extend 1–90 hari |
| R-5a | Akun manual | `createUser()`; USER tanpa password | adm "no default password set", "password sent by client is NOT stored"; site "manual USER: POST magic-link -> 409" | VERIFIED | — |
| R-5b | Alur undangan akun manual | Tidak ada. Backend menolak dengan kode `NO_DEMO_REQUEST` (`lib/magic-link-eligibility.ts`). | unit "manual USER without demo request -> NO_DEMO_REQUEST" | **BLOCKED** | Menunggu keputusan pemilik, termasuk aturan status lead untuk akun manual |

### 3.2 Leads & Demo Workflow

| # | Requirement | Implementasi | Bukti uji | Status | Catatan |
|---|---|---|---|---|---|
| R-6 | Pengajuan demo | `app/(marketing)/request-demo/page.tsx`; `POST /api/request-demo` (zod, rate limit 5/jam/IP) → `createLead()` (`lib/models/lead.model.ts`), audit `LEAD_CREATED` | dw "POST /api/request-demo -> 201", "invalid date -> 400", "6th submission … -> 429" | VERIFIED | Notifikasi email masih mock. Rate limit disimpan in-memory, jadi tidak berlaku lintas instance. |
| R-7 | Approval dan rejection | `POST /api/admin/leads/[id]/approve` → `approveLead()`; `POST …/reject` (alasan 2–500 karakter) → `rejectLead()`, yang ikut menonaktifkan link aktif | dw "approve -> 200", "status still 2 after approval", "link unusable after rejection", "approve for an ADMIN email -> 409" | VERIFIED | Backend tidak menjaga approve atas lead REJECTED. UI memang menyediakan "Buka Kembali". |
| R-8 | Pembuatan Magic Link | `createDemoMagicLink()` (`lib/magic-link.ts`): token 32 byte, hanya hash SHA-256 yang disimpan, TTL 24 jam; origin dari `lib/app-url.ts` | dw "magic link URL returned once on approval", "lead detail does not expose token or hash"; unit app-url 23/23 | VERIFIED | Pengiriman email masih mock: admin menyalin tautan secara manual |
| R-9 | Perubahan status Leads | `LEAD_STATUS`, `MANUAL_STATUS_TRANSITIONS`, dan `transitionLeadStatus()` yang atomik (`lead.model.ts`); first login 2→3 (`magic-link.ts`); `POST …/complete` 3→4 | dw "new lead status = 2", "status 2 -> 3 after first login", "manual 3 -> 2 rejected (409)", "complete 3 -> 4", "complete twice -> 409" | VERIFIED | Transisi lama 1→2 belum diuji |
| R-10 | Durasi demo | Ditetapkan saat approve (1–90, default 7); dihitung sejak login pertama; extend menambah dari tanggal berakhir saat ini | dw "demo duration = approved 7 days", "expiry extended by exactly 5 days", "extend with 0 days -> 400" | VERIFIED | Default tidak konsisten: schema `Lead.demoDurationDays @default(3)` dan fallback 3 di `formatLeadRecord`, sementara di tempat lain 7 |
| R-11 | First login | GET `/auth/verify-magic-link` hanya memeriksa token. Token dikonsumsi lewat POST `/api/auth/magic-link` (same-origin, rate limit), yang mengaktifkan USER dan memberi sesi 24 jam. | dw "token not consumed by GET", "cross-origin POST -> 403", "valid token -> 303 to /", "exactly one of 3 parallel requests succeeds" | VERIFIED | Klien diarahkan ke `/` karena belum ada area demo khusus. Cakupan akses demo masih keputusan pemilik. |
| R-12 | Resend / re-issue Magic Link | Dari Leads: approve ulang (audit `MAGIC_LINK_REISSUED`). Dari User Management: `POST /api/admin/users/[id]/magic-link` → `reissueMagicLinkForUser()`. | dw "older unused link superseded by newer one", "second login with new link succeeds"; site "approved-lead USER: POST -> 200 with link", "inactive USER -> 409", "expired demo -> 409"; unit eligibility 14/14 | VERIFIED | Dua jalur ini tidak konsisten. `approveLead` tidak memeriksa masa demo, sehingga dari Leads tautan tetap terbit untuk demo yang sudah berakhir; tautan itu akan ditolak `demo_expired` saat dipakai. Approve ulang juga menimpa `approvedAt`/`approvedBy`. |
| R-13 | Link kedaluwarsa | Alasan `link_expired`, `used`, dan `demo_expired` → kartu gagal atau `/demo-expired` | dw "reused token -> error=used", "login after demo expiry -> /demo-expired", "status stays 3 (not Selesai) after expiry" | VERIFIED | Kedaluwarsa alami 24 jam memakai jalur kode yang sama dengan "superseded". Sesi demo yang sudah aktif membaca `demoExpiresAt` dari JWT, sehingga perpanjangan baru berlaku setelah login ulang. |

### 3.3 Admin Dashboard

| # | Requirement | Implementasi | Bukti uji | Status | Catatan |
|---|---|---|---|---|---|
| R-14 | Empat status: Baru, Dihubungi, Jadwal Demo, Selesai | `Lead.status` Int 1–4 (`STATUS_LABELS`, `lead.model.ts`), terpisah dari `approvalStatus` | dw (lihat R-9) | VERIFIED | Lead baru dibuat langsung berstatus 2 (aturan bisnis), sehingga kartu "Baru" praktis selalu 0 |
| R-15 | Statistik dashboard | `GET /api/admin/overview` (`app/api/admin/overview/route.ts`): `groupBy` status lead, order, spesimen, dan distribusi institusi | adm "GET /api/admin/overview -> 200" (tanpa memeriksa nilai) | **PARTIAL** | Timeline 14 hari dihitung dari `take: 5` data terbaru, jadi grafik keliru. `recentAuditLogs` selalu `[]`. `activeUsers` ikut menghitung admin. |
| R-16 | Leads drawer | `app/admin/(dashboard)/leads/page.tsx` (detail, approval/link/extend, pipeline, riwayat via `GET …/[id]/history`) | Backend lewat dw (approve, reject, complete, extend, "history contains …") | NEEDS TEST (UI) | Endpoint di belakangnya sudah VERIFIED |
| R-17 | Filter tanggal | UI `<input type=date>` → `startDate`/`endDate` → `getLeadsWithPagination` (`lead.model.ts:255-265`) | probe: `startDate=not-a-date` → **500**; `limit=abc` / `page=abc` → **500** | **PARTIAL** | Tidak ada validasi input. `endDate` memakai `setHours` waktu lokal server sementara `startDate` UTC, sehingga rentang bergeser untuk WIB. |
| R-18 | Export CSV | `GET /api/admin/leads/export` → `exportLeadsCsvController` (`lead.controller.ts:442`); BOM dan netralisasi formula | sec "export without session -> 401", "USER … -> 403", "formula cell neutralized"; probe: **100 dari 120 lead** | **PARTIAL** | Terpotong diam-diam di 100 baris karena `limit: 1000` di-clamp ke 100 (`lead.model.ts:237`). Filter UI juga tidak ikut diterapkan. |
| R-19 | Data yang digunakan setiap komponen | Dashboard → `/api/admin/overview` (kartu, grafik 14 hari, pipeline, distribusi institusi, tab lead/order terbaru). Halaman Leads → `/api/admin/leads` (daftar + metrik global), `/history`, `/approve`, `/reject`, `PATCH /[id]`, `/complete`, `/extend`, `/export`. Users → `/api/admin/users*`. Order LIS `/admin/orders` → `/api/lis/*`. Audit → `/api/admin/audit-logs` (100 terakhir). `/admin/analytics-qc` dan `/admin/nova-ai` adalah halaman roadmap statis. | — | VERIFIED (pemetaan) | Metrik dashboard bersifat global (tidak terfilter). Halaman Order LIS hanya memuat 15 order tanpa paginasi, dan kartu metriknya dihitung dari 15 order itu saja. |

### 3.4 CMS

Semua konten CMS disimpan di satu tabel `cms_sections`: satu baris per `section_key`, dengan daftar item di JSON `extra_content`.

| # | Requirement | Implementasi | Bukti uji | Status | Catatan |
|---|---|---|---|---|---|
| R-20 | Halaman & Section | `/admin/page-sections` → `GET/PUT /api/admin/cms/layout` → `savePageLayout`/`savePageHero` (zod, optimistic locking); baris `layout_<page>` | lay "6 public pages listed", "saved order matches", "custom section rendered", "hidden … section not rendered", "layout & hero changes are audited" | VERIFIED | — |
| R-21 | Konten Global | `/admin/site-content` → `GET/PUT /api/admin/cms/site` → `saveSiteContent` (zod, optimistic locking) | site §2, §4–7, "stale save … -> 409" | VERIFIED | — |
| R-22 | Navigation | `PUT /api/admin/cms/homepage` (`type: "navigation"`) → `saveCmsNavigationMenu`; publik `GET /api/menus`; `Navbar.tsx` | cms "create menu", "new menu appears in public /api/menus", "deleted menu no longer public" | VERIFIED | `/api/admin/menus*` adalah API duplikat yang tidak dipakai UI dan tidak diuji. Toggle aktif dan urutan menu belum diuji. |
| R-23 | Footer | `footerSchema`; dirender di `app/(marketing)/layout.tsx` | site "footer description rendered", "inactive footer link hidden", "javascript: link -> 400" | VERIFIED | — |
| R-24 | FAQ | `faqSchema` (maks. 100 item, 12 kategori); homepage | site "new FAQ shown first", "deactivated FAQ hidden", "unknown category -> 400" | VERIFIED | — |
| R-25 | Announcement Bar | `announcementSchema` (aktif, periode, tombol) | site "announcement text & button rendered", "disabled … not rendered", "outside its period not rendered" | VERIFIED | — |
| R-26 | CTA | CTA hero (`savePageHero`); CTA di section kustom; banner CTA bersama (`cta`, lewat `updateCmsSection`) | site "new primary CTA text rendered", "unsafe CTA URL -> 400"; lay "custom section CTA rendered with safe href" | **NEEDS TEST** (banner bersama) | CTA hero dan section kustom VERIFIED. Banner CTA bersama belum diuji dan endpoint-nya tanpa validasi zod. |
| R-27 | Hero Stats | `heroSchema.metrics` (maks. 6, `isActive`), difilter di server (`getCmsPageHero`) | site "layout API exposes hero defaults (2 CTAs, 4 metrics)", "hidden metric not rendered" | VERIFIED | Klaim angka statistik produk masih perlu verifikasi pemilik |
| R-28 | Konten halaman dalam | Hero, header section, urutan/visibilitas, dan section kustom: CMS. **Isi kartu bento hardcoded** (`PlatformPageClient.tsx`, `ModulesPageClient.tsx`, dll.). | cms "`<path>` shows the CMS badge"; lay "override title rendered" | **PARTIAL** | Edit `solution_item` di hub CMS tidak pernah dirender: getter halaman tidak dipakai, dan halaman `[slug]` dialihkan. Ini akan diinventarisasi di Phase 15. |
| R-29 | Upload gambar | `POST /api/admin/cms/upload`: maks. 10 MB, deteksi magic bytes (JPG/PNG/WEBP/SVG), SVG berbahaya ditolak, nama acak; disimpan di `public/uploads/cms`, disajikan `app/uploads/cms/[filename]/route.ts` | sec "valid PNG accepted", "HTML disguised as PNG rejected", "SVG with onclick handler rejected", "USER upload -> 403" | **PARTIAL** | Berfungsi di lokal, tetapi filesystem tidak persisten di Vercel. Keputusan storage: BLOCKED. Tidak ada penghapusan file, sehingga file yatim menumpuk. |
| R-30 | Soft delete | Tidak ada di model mana pun. Yang ada hanya flag sembunyikan: `isPublished`, item `isActive`, `TestCatalog.isActive`, `User.status`. Hapus item CMS menghapus elemen dari array JSON. | — | **NOT IMPLEMENTED** | Komentar di `app/api/admin/menus/[id]/route.ts` menyebut "Soft delete", padahal kenyataannya hard delete. Pemulihan saat ini hanya lewat backup DB. |
| R-31 | Urutan konten | Layout `sortOrder` (×10, hero terkunci di atas); item homepage dan menu `sortOrder`; FAQ/footer memakai urutan array | lay "saved order matches", "new order applied"; site "new FAQ shown first" | VERIFIED (layout, FAQ) / NEEDS TEST (item homepage, menu) | `PUT /api/admin/cms/homepage` tanpa zod dan tanpa optimistic locking: dua admin bisa saling menimpa |

### 3.5 LIS (modul demonstrasi)

| # | Requirement | Implementasi | Bukti uji | Status | Catatan |
|---|---|---|---|---|---|
| R-32 | Akses hanya ADMIN | Middleware dan `requireAdmin()` di setiap handler `lib/controllers/lis.controller.ts` | lis "anon … -> 401", "USER … -> 403", "forged-admin … -> 403", "deactivated-admin … -> 403" (117/117) | VERIFIED | Production (Vercel) masih menjalankan kode lama tanpa proteksi ini (deploy BLOCKED) |
| R-33 | Endpoint dan handler | `GET /api/lis/catalog`, `GET /api/lis/physicians`, `GET/POST /api/lis/patients`, `GET/POST /api/lis/orders`, `GET /api/lis/orders/[id]`, `POST /api/lis/specimens/[barcode]/receive`, `POST /api/lis/specimens/[barcode]/reject` | lis "admin GET … -> 200"; probe "create order -> 201" | VERIFIED (akses, baca, buat order) | — |
| R-34 | Data pasien | `searchPatients`, `listPatients` (limit ≤ 100), `createPatient` (`lib/models/patient.model.ts`) | lis "duplicate MRN -> 409", "response has no PII"; site "LIS patients limit capped"; probe: sex/birthDate tidak valid → **500** | **PARTIAL** | Input tidak valid menghasilkan 500, bukan 400 |
| R-35 | Orders | `createLabOrder` (transaksi: order, item, satu spesimen per jenis tabung), `getLabOrders`, `getLabOrderById` (`lib/models/order.model.ts`) | lis "order without tests -> 400"; probe "create routine/cito -> 201" | **PARTIAL** | Request bersamaan gagal (R-40) |
| R-36 | Specimens | `receiveSpecimen` / `rejectSpecimen` (`lib/models/specimen.model.ts`) | lis "unknown barcode -> 400", "reject without reason -> 400" | **NEEDS TEST** | Tidak ada guard status: terima ulang menimpa `receivedAt`, dan spesimen yang sudah diterima masih bisa ditolak. Status order tidak dihitung ulang setelah penolakan. Audit tanpa `userId`. |
| R-37 | Catalog | `getTestCatalog` (hanya yang aktif); `ensureDefaultCatalog` mengisi katalog bila kosong saat GET | lis "admin GET /api/lis/catalog -> 200" | VERIFIED (baca) | Belum ada CRUD katalog. GET dapat menulis data saat tabel kosong. |
| R-38 | Worklist (CITO di atas rutin) | `orderBy: [{ priority: "asc" }, …]` (`order.model.ts:355-359`, juga di `overview/route.ts`); urutan enum `routine, cito, urgent` | probe: worklist `["routine","cito"]` | **PARTIAL (bug terkonfirmasi)** | ROUTINE tampil di atas CITO. Baik `asc` maupun `desc` tidak menghasilkan urutan klinis yang benar. |
| R-39 | Validasi input | Manual, tanpa zod: kehadiran field, `testCatalogCodes` tidak kosong, alasan penolakan; `clampInt` untuk paginasi | probe: `testCatalogCodes` berupa string → **500**; `priority=bogus` → 201, disimpan ROUTINE | **PARTIAL** | Kode tes yang tidak dikenal dibuang diam-diam. Tidak ada batas panjang. Error domain `createLabOrder` → 500. |
| R-40 | Nomor order dan barcode | `ORD-YYYYMMDD-NNNN` dan `SP-YYMMDD-NNNN`: "ambil max + 1" di luar transaksi (`order.model.ts:63-114, 152-160`) | probe: 8 request bersamaan → **2× 201, 6× 500**; unique constraint mencegah duplikat (4/4 nomor unik) | **PARTIAL (bug terkonfirmasi)** | Overflow setelah 9999 per hari (urutan teks). Tanggal memakai waktu lokal server (UTC di Vercel), bukan WIB. |

### 3.6 Ringkasan Status

| Status | Jumlah | Requirement |
|---|---|---|
| VERIFIED | 25 | R-1, 2, 3, 4, 5a, 6, 7, 8, 9, 10, 11, 12, 13, 14, 19, 20, 21, 22, 23, 24, 25, 27, 32, 33, 37 |
| VERIFIED sebagian / NEEDS TEST sebagian | 1 | R-31 |
| PARTIAL | 10 | R-15, 17, 18, 28, 29, 34, 35, 38, 39, 40 |
| NEEDS TEST | 3 | R-16 (UI), R-26 (banner CTA), R-36 |
| NOT IMPLEMENTED | 1 | R-30 (soft delete) |
| BLOCKED | 1 | R-5b (undangan akun manual) |

## 4. Temuan yang Belum Selesai

Diurutkan dari dampak terbesar. Temuan yang **baru dikonfirmasi** di Phase 13 ditandai ★.

| # | Temuan | Bukti | Status |
|---|---|---|---|
| F-1 | Production masih menjalankan kode lama, termasuk LIS tanpa proteksi | Review Phase 8–12 §17 | BLOCKED (deployment belum disetujui) |
| F-2 | Migration history tidak dapat membangun schema; baseline siap | Phase 14: PASS | NEEDS APPROVAL |
| F-3 ★ | LIS: request bersamaan gagal 500 (race nomor order/barcode) | probe R-40 | Rencana Phase 17 |
| F-4 ★ | LIS: urutan prioritas terbalik (ROUTINE di atas CITO) | probe R-38 | Rencana Phase 17 |
| F-5 ★ | LIS: input tidak valid → 500; prioritas tidak valid diterima diam-diam | probe R-34, R-39 | Rencana Phase 17 |
| F-6 | LIS: spesimen tanpa guard status; audit tanpa aktor | Kode `specimen.model.ts` | Rencana Phase 17 |
| F-7 ★ | Export CSV terpotong 100 baris dan mengabaikan filter | probe R-18 | Belum diperbaiki |
| F-8 ★ | Daftar lead: `limit`/`page`/tanggal tidak valid → 500; filter tanggal bergeser zona waktu | probe R-17 | Belum diperbaiki |
| F-9 | Timeline dashboard dihitung dari 5 data terbaru; `recentAuditLogs` kosong | Kode `overview/route.ts` | Belum diperbaiki |
| F-10 | Halaman Order LIS hanya 15 order tanpa paginasi | Kode `orders/page.tsx` | Belum diperbaiki |
| F-11 | Upload tidak persisten di Vercel; tidak ada penghapusan file | Review §8.3 | BLOCKED (keputusan storage) |
| F-12 | Tidak ada soft delete; hapus item CMS permanen | R-30 | Perlu keputusan (Phase 16) |
| F-13 | Kartu bento hardcoded; `solution_item` tidak dirender | R-28 | Phase 15 |
| F-14 | CMS hub lama (`/api/admin/cms/homepage`) tanpa zod dan tanpa optimistic locking | R-31 | Phase 16 |
| F-15 ★ | `npm run db:seed` gagal di environment baru (`seed_other_pages_cms.js`) | Phase 14 T-1 | Belum diperbaiki |
| F-16 ★ | Re-issue dari Leads tetap menerbitkan link untuk demo yang sudah berakhir (link tidak terpakai); approve ulang menimpa `approvedAt`/`approvedBy` | R-12, `lead.model.ts` | Perlu keputusan (aturan bisnis) |
| F-17 | Default durasi demo tidak konsisten (3 vs 7 hari) | R-10 | Perlu keputusan |
| F-18 | Alur undangan akun manual | R-5b | BLOCKED |
| F-19 | Uji UI (drawer, redirect admin) tidak ada di repo | R-3, R-16 | NEEDS TEST (Phase 18) |
| F-20 | Index duplikat, index FK kurang, enum tidak dipakai, `schema.prisma` belum terformat | Phase 14 §6 | Setelah baseline diadopsi |
| F-21 | Skrip legacy di `scripts/` (sebagian crash atau menulis ulang source) | Review §12 | Perlu persetujuan sebelum dihapus |
| F-22 | Legal final, klaim statistik, izin testimoni/logo, rotasi credential | Review §19 | NEEDS APPROVAL |

## 5. Risiko dan Dependency

| Risiko | Dampak | Dependency / mitigasi |
|---|---|---|
| Deploy tanpa adopsi baseline | `migrate deploy` dengan migration lama membangun schema salah, dan "migration maju" bersifat destruktif | Adopsi baseline (Phase 14 §11) sebelum deploy apa pun yang menyentuh schema |
| Drift DB production tidak diketahui | Baseline bisa tidak cocok | `migrate diff` read-only dan backup production; butuh akses dan izin |
| Perbaikan LIS (Phase 17) dan urutan enum prioritas | Perbaikan yang benar mungkin butuh migration (counter/sequence) | Lebih aman dilakukan **setelah** baseline diadopsi. Alternatif tanpa migration: retry pada P2002 dalam transaksi, serta sort eksplisit. |
| Upload di Vercel | Gambar admin hilang atau gagal | Keputusan object storage (Phase 16) |
| Rate limit dan sesi in-memory | Tidak efektif lintas instance serverless | Perlu store bersama bila traffic nyata |
| Uji UI tidak ada di repo | Regresi UI tidak terdeteksi | Phase 18: masukkan skrip browser ke repo |
| QA menulis ke DB | QA pernah menghapus audit log (Phase 12, sudah diperbaiki) | QA hanya di DB sementara/klon, seperti dilakukan di Phase 14 |
| Credential default dev di skrip QA/seed | Bocor bila dipakai di environment bersama | Set `SEED_ADMIN_PASSWORD` dan rotasi credential (NEEDS APPROVAL) |

## 6. Rekomendasi Urutan Pekerjaan Selanjutnya

1. **Keputusan pemilik** (tidak memerlukan kode): adopsi baseline, pilihan object storage, aturan re-issue/durasi demo (F-16, F-17), undangan akun manual, dan persetujuan push/PR.
2. **Phase 15 (inventaris CMS + proposal): aman dimulai sekarang.** Sifatnya audit dan proposal, tidak mengubah data atau schema.
3. **Adopsi baseline** (setelah disetujui), sebelum perubahan schema apa pun di Phase 16–17.
4. **Phase 17 (LIS)**, prioritas tinggi karena bugnya sudah terkonfirmasi (F-3 sampai F-6). Bila baseline belum diadopsi, mulai dari perbaikan tanpa migration: retry dalam transaksi, sort prioritas eksplisit, validasi zod, dan guard status spesimen.
5. **Perbaikan kecil non-LIS** (dapat digabung ke Phase 16/18): F-7, F-8, F-9, F-10, F-15.
6. **Phase 16 (storage abstraction, soft delete, concurrency CMS hub)** setelah keputusan storage.
7. **Phase 18 (E2E)** di DB sementara, termasuk memasukkan uji browser ke repo.
8. **Phase 19**: laporan kesiapan akhir. Deployment tetap menunggu persetujuan.

**Apakah aman melanjutkan ke Phase 15? Ya.** Repository bersih, DB dev tidak berubah, dan Phase 15 sendiri hanya inventarisasi dan proposal. Yang perlu menunggu persetujuan adalah implementasi yang menyentuh schema (soft delete, storage, LIS dengan migration).
