# Diagnova — Laporan Audit, Perbaikan & QA

Tanggal: 17 November 2026 · Branch: `artha` · Basis: `main` @ `b181637`

Dokumen ini merangkum audit menyeluruh kondisi aktual repository, perubahan yang sudah
dikerjakan per phase, hasil pengujian, serta keputusan yang masih menunggu persetujuan.

---

## 1. Ringkasan Status

| Area | Kondisi Awal | Masalah Utama | Tindakan | Status |
|---|---|---|---|---|
| Database | Schema dibangun via `db push`; migration history hanya 3 file | Migration history tidak menghasilkan schema saat ini; diff mengandung DROP kolom/tabel; backup SQL berisi data sensitif ter-commit | Rancangan baseline migration & strategi backup (bagian 5) | BLOCKED (butuh persetujuan) |
| Authentication | JWT cookie HS256 24 jam, secret fallback hardcoded | Secret default di kode; password default tertebak; tanpa rate limit; USER bisa login password | Secret wajib di production, login password khusus admin, rate limit, tanpa password default | COMPLETED |
| Authorization | Middleware hanya halaman `/admin/*` | API leads/overview/roles/audit hanya cek "ada sesi" → klien demo (USER) dapat membaca & meng-approve leads; JWT tidak dicek ulang ke DB | `requireAdmin()` cek ulang DB tiap request + middleware `/api/admin/*` | COMPLETED |
| Demo Workflow | Status bebas diubah admin; approve langsung = Jadwal Demo; GET magic link mengonsumsi token | Tidak sesuai aturan bisnis; crawler menghanguskan token; magic link bisa dibuat untuk email admin (privilege escalation) | Alur status terkontrol, konsumsi via POST, atomik, riwayat & perpanjangan | COMPLETED |
| Admin Dashboard | Dashboard, leads, users, CMS | Aksi manajemen user tanpa audit trail; halaman Audit Log tersembunyi | Audit event user, menu Audit Log | COMPLETED |
| CMS | Hanya homepage yang terhubung | Edit `page_*` tidak pernah tampil; seed CMS rusak (model sudah dihapus); upload tidak tersaji di production | Hero 5 halaman dari CMS (ISR), seed diperbaiki & non-destruktif, route upload | PARTIAL |
| Navigation | Navbar hardcoded + fallback DB | Section `navigation` tidak pernah dibuat → simpan menu gagal; anchor mati | Seed navigasi dari menu bawaan, auto-create section, anchor diperbaiki | COMPLETED |
| LIS | API pasien/order/spesimen aktif | **API `/api/lis/*` tanpa autentikasi** — NIK, nama, tgl lahir, telepon, alamat pasien dapat dibaca publik | Hotfix: `requireAdmin()` di 9 handler + middleware, error disanitasi (bagian 10) | COMPLETED |
| Frontend | Halaman publik & admin berjalan | Anchor navigasi mati, link footer 404, nomor WA placeholder, sitemap berisi URL redirect | Diperbaiki; responsif diuji 375/768/1440 px | COMPLETED |
| Backend | Route → controller → model | Validasi tanggal (500), CSV formula injection, upload hanya cek MIME dari browser | Validasi, netralisasi CSV, deteksi magic bytes | COMPLETED |

---

## 2. Repository & Environment

- **Stack:** Next.js 14.2.35 (App Router), React 18.3, TypeScript 5.7, Prisma 5.22, PostgreSQL 15, Tailwind 3.4, jose (JWT), zod.
- **Branch:** `artha` tertinggal 249 commit dari `main` dan tidak memiliki commit unik → di-*fast-forward* ke `main` (tanpa rewrite history), lalu seluruh pekerjaan di atasnya.
- **Environment:** `.env` tidak di-commit (benar). `AUTH_SECRET` kini wajib ≥ 32 karakter di production. Variabel baru opsional: `SEED_ADMIN_PASSWORD`, `SEED_SALES_PASSWORD`, `SEED_CMS_OVERWRITE`.
- **Temuan:** `backups/*/diagnova_full_backup.sql` (2 file identik) ter-commit dan berisi data users (hash password), leads (PII) dan pasien (termasuk NIK). Lihat bagian 7.

---

## 3. Perubahan per Phase

### Phase 1 — Critical Security (`65cc9fc`)
- `lib/auth-guard.ts` → `requireAdmin()`: memuat ulang user dari DB (aktif + role admin) setiap request API admin. Akun yang dinonaktifkan/diturunkan kehilangan akses seketika, tidak menunggu JWT 24 jam kedaluwarsa.
- `middleware.ts` kini juga melindungi `/api/admin/*` (401/403 JSON) sebagai lapisan pertama.
- `lib/auth-secret.ts`: tidak ada lagi secret hardcoded di production.
- Login password hanya untuk admin; rate limit 5 percobaan / 15 menit per IP+email (`lib/rate-limit.ts`).
- User tanpa password → `passwordHash = null` (sebelumnya password default yang sama untuk semua). Helper mati berisi password hardcoded dihapus.
- Upload CMS: deteksi tipe dari isi file (magic bytes), ekstensi diturunkan dari tipe hasil deteksi, aturan SVG lebih ketat, CSP sandbox untuk `/uploads/*`.
- Header keamanan global; CSV export dinetralkan dari formula injection; hash token magic link tidak lagi diekspos ke klien.

### Phase 3 — Demo Workflow (`c33c0b6`, `cdede4b`)
| Kejadian | Transisi | Pemicu |
|---|---|---|
| Formulir demo tersimpan | → 2 Dihubungi | Sistem |
| Admin approve | (tidak berubah) — magic link diterbitkan | Admin |
| Login pertama via magic link berhasil | 2 → 3 Jadwal Demo (atomik, sekali) | Klien |
| Admin konfirmasi demo selesai | 3 → 4 Selesai | Admin (`POST /api/admin/leads/:id/complete`) |
| Data lama status 1 | 1 → 2 | Admin (manual) |

- Transisi lain ditolak (409). Login gagal, login berulang, tautan baru, dan kedaluwarsa akses **tidak** mengubah status.
- GET `/auth/verify-magic-link` hanya memeriksa token + tombol konfirmasi; konsumsi lewat `POST /api/auth/magic-link` (cek same-origin, rate limit). Crawler/pemindai tautan tidak menghanguskan token.
- Single-use dijamin `updateMany` atomik (diuji 3 request paralel → tepat 1 berhasil). Tautan baru menonaktifkan tautan lama yang belum terpakai; penolakan menonaktifkan tautan aktif.
- Magic link ditolak untuk akun non-USER/nonaktif; approve ditolak bila email milik akun admin.
- Riwayat: audit event (dibuat, disetujui, diterbitkan ulang, ditolak, login, gagal, aktivasi, perpanjangan, status, selesai) + `GET /api/admin/leads/:id/history`, tampil di modal admin.
- Perpanjangan: `POST /api/admin/leads/:id/extend` (1–90 hari) dari tanggal kedaluwarsa saat ini.

### Phase 4 — Admin Dashboard (`09b5b3a`)
- Audit event `USER_CREATED/UPDATED/STATUS_CHANGED/DELETED` (aktor, sebelum/sesudah, IP).
- Proteksi akun "Super Admin" lama setara ADMIN di manajemen user.
- Menu **Audit Log** ditambahkan ke sidebar.

### Phase 5 — CMS & Navigation (`a7bf0db`)
- Hero (badge/judul/subjudul) halaman Platform, Solusi, Modul, Nova AI, Integrasi kini dari CMS `page_*` (ISR 60 detik + revalidasi saat admin menyimpan). Teks bawaan tetap sebagai fallback; `\n` pada judul = jeda baris seperti desain asli.
- `prisma/seed-cms.ts` diperbaiki (sebelumnya memakai 4 model yang sudah dihapus dan membuat `tsc` gagal) dan dibuat **non-destruktif**. `seed-cms.js` (duplikat yang sama rusaknya) dihapus.
- Navigasi CMS di-seed dari menu Navbar bawaan (5 menu, 25 submenu, termasuk warna ikon) sehingga tampilan tidak berubah saat sumber beralih ke DB.
- Gambar unggahan setelah build disajikan oleh `/uploads/cms/[filename]` (diuji di `next start`).
- `scripts/sync_page_hero_defaults.js` menyelaraskan teks hero `page_*` ke copy situs saat ini **hanya** untuk baris yang belum pernah disunting admin (`--dry-run` tersedia).

### Phase 6 — Frontend (`bdb0c82`)
- 6 anchor `/solutions#...` yang mati diberi target; `#blood-bank` membuka tab Bank Darah.
- Link footer 404 diarahkan ke bagian yang relevan; nomor WhatsApp placeholder diganti; sitemap hanya URL kanonik.

---

## 4. Hasil Pengujian

Seluruh pengujian dijalankan terhadap **production build** (`next build` + `next start`) dan database pengembangan lokal.

| Pengujian | Hasil |
|---|---|
| `tsc --noEmit` | 0 error (sebelumnya 9 error) |
| `next lint` | 0 error, 121 warning (mayoritas import tak terpakai yang sudah ada sebelumnya) |
| `next build` | Berhasil; halaman publik ISR 60 detik |
| `scripts/qa/security.test.mjs` | 28/28 lulus |
| `scripts/qa/demo-workflow.test.mjs` | 54/54 lulus |
| `scripts/qa/admin.test.mjs` | 16/16 lulus |
| `scripts/qa/cms.test.mjs` | 19/19 lulus |
| Browser headless (Edge): overflow horizontal 7 halaman × 375/768/1440 px, deep-link, alur klik magic link, modal admin 1440 & 375 px | 29/29 lulus |

Pengujian browser menemukan satu bug nyata yang tidak tertangkap uji API (`Origin: null` → 500 pada tombol magic link); sudah diperbaiki dan diberi uji regresi.

Menjalankan ulang: `npm run dev` lalu `npm run test:qa` (hanya mau berjalan terhadap DB `localhost`).

---

## 5. Phase 2 — Rancangan Database (belum dieksekusi)

### Temuan
1. **Migration history tidak lengkap.** `prisma/migrations` berisi 3 migration; tabel `roles`, `demo_magic_links`, `cms_sections` dan banyak kolom hanya ada lewat `db push`. Diff migration → schema saat ini berisi langkah destruktif: `DROP COLUMN leads.status` (enum → int), `DROP COLUMN users.role/status`, `DROP TABLE lead_notes`, penggantian enum `user_role`. **Jangan** menjalankan `prisma migrate dev`/`deploy` begitu saja pada database yang ada.
2. **Kolom/enum tidak terpakai atau redundan:** enum `LeadStatus`, `UserRole`, `UserStatus` tidak dipakai kolom mana pun; `leads.demo_date` duplikat dari `requested_demo_date`/`confirmed_demo_date`; `leads.voucher_code/voucher_expiry` tumpang tindih dengan `users.demo_expires_at`.
3. **Index redundan:** `@@index` pada kolom yang sudah `@unique` (`demo_magic_links.token_hash`, `patients.mrn`, `lab_orders.order_number`, `specimens.barcode_number`).
4. **Integritas:** `audit_logs.user_id` tanpa foreign key (disengaja agar log tetap ada saat user dihapus — perlu dikonfirmasi); `lab_order_items` tanpa unique `(order_id, test_catalog_id)`.
5. **Database pengembangan lama** di volume Docker `diagnova_db_data` (DB `diagnova`) masih berstruktur pra-restrukturisasi (tabel `cms_hero_slides`, `cms_partners`, dst.). Tidak disentuh.

### Rencana (butuh persetujuan)
1. Backup penuh (`pg_dump -Fc`) setiap database target, disimpan di luar repository.
2. Buat migration baseline dari schema saat ini; untuk database yang sudah sinkron via `db push`, tandai sebagai applied (`prisma migrate resolve --applied <baseline>`) — tanpa mengubah data.
3. Database yang masih berstruktur lama: migrasi data tabel CMS anak → `cms_sections.extra_content` dengan SQL (script lama memakai model Prisma yang sudah dihapus sehingga tidak bisa dipakai lagi), verifikasi, baru drop tabel lama.
4. Pembersihan kolom/enum/index redundan sebagai migration terpisah setelah baseline stabil.
5. Ke depan: hanya `prisma migrate` (bukan `db push`) untuk environment bersama.

---

## 6. LIS — Audit Read-only

| Temuan | Risiko | Usulan |
|---|---|---|
| Semua `/api/lis/*` (patients, orders, specimens, catalog, physicians) **tanpa autentikasi**. Diverifikasi: data pasien lengkap (NIK, nama, tgl lahir, telepon, alamat) terbaca tanpa login; pasien/order dapat dibuat & spesimen diterima/ditolak oleh siapa pun | **Kritis** — kebocoran data kesehatan & manipulasi data | Terapkan `requireAdmin()` + matcher middleware `/api/lis/*` (perubahan kode saja, tanpa ubah tabel/data) |
| Nomor order & barcode dibuat dengan "baca terakhir + 1" di luar transaksi | Request bersamaan → bentrok unique → 500 | Sequence DB atau transaksi serializable |
| Controller LIS tanpa validasi zod | Input tidak valid → 500 / data kotor | Skema validasi per endpoint |
| `receivedBy`/`rejectedBy` fallback "Petugas Lab" bila tanpa sesi | Jejak audit tidak dapat dipertanggungjawabkan | Wajib sesi + ID user |

Tidak ada perubahan pada modul LIS.

---

## 7. Risiko yang Masih Tersisa

1. ~~[Kritis] API LIS publik~~ — diperbaiki pada hotfix pasca Phase 7 (bagian 10).
2. **[Kritis] Backup SQL berisi PII sudah publik di GitHub** — sudah dikeluarkan dari tracking (bagian 11), tetapi tetap ada di history publik `origin/main` & `origin/artha`. Butuh keputusan pemilik repository.
3. **[Sedang] File unggahan ter-commit** `public/uploads/cms/webcam-toy-photo2-*.jpg` — perlu dicek pemiliknya apakah layak publik.
4. **[Sedang] Email masih mock** (`lib/email.ts` hanya `console.log`) — magic link ikut tercetak di log server. Perlu provider email sungguhan sebelum production.
5. **[Sedang] Rate limit in-memory** — per proses; butuh store bersama (Redis) bila lebih dari satu instance. IP diambil dari `X-Forwarded-For`, aman hanya di belakang proxy tepercaya.
6. **[Sedang] Klien demo setelah login diarahkan ke beranda** — belum ada area/aplikasi demo khusus untuk role USER (lihat keputusan bisnis).
7. **[Rendah] Halaman Syarat & Ketentuan dan Kebijakan Privasi tidak ada** (`/terms` 404; link privasi menuju `/platform/reporting`).
8. **[Rendah] CMS:** konten selain hero pada 5 halaman dalam, FAQ, footer, dan announcement bar masih hardcoded; penyimpanan CMS bersamaan oleh 2 admin dapat saling menimpa array item; `isPublished` belum punya toggle di UI.
9. **[Rendah] Endpoint `POST /api/admin/leads/:id/notes`** hanya mengembalikan sukses palsu (fitur catatan sudah dieliminasi) — perlu diputuskan dihapus atau diimplementasikan.

---

## 8. Keputusan yang Dibutuhkan (BLOCKED)

1. Izin menambahkan autentikasi admin pada `/api/lis/*` (tanpa mengubah tabel/data).
2. Penanganan `backups/*.sql` (untrack + `.gitignore`, dan rotasi kredensial).
3. Eksekusi rencana database bagian 5 (baseline migration) dan pada database mana.
4. Apa yang dapat diakses klien demo setelah login (saat ini hanya situs publik).
5. Konten resmi Syarat & Ketentuan serta Kebijakan Privasi.
6. Persetujuan push branch `artha` ke remote.

---

## 9. Commit di Branch `artha`

| Commit | Phase |
|---|---|
| `65cc9fc` | Phase 1 — Critical Security |
| `c33c0b6` | Phase 3 — Demo Workflow |
| `09b5b3a` | Phase 4 — Admin Dashboard |
| `a7bf0db` | Phase 5 — CMS & Navigation |
| `bdb0c82` | Phase 6 — Frontend |
| `cdede4b` | Phase 7 — Perbaikan temuan QA browser |

Belum di-push ke remote.

---

## 10. Hotfix Pasca Phase 7 — Keamanan API LIS

| Endpoint | Method | Sebelum | Sesudah |
|---|---|---|---|
| `/api/lis/catalog` | GET | Publik | ADMIN saja |
| `/api/lis/physicians` | GET | Publik | ADMIN saja |
| `/api/lis/patients` | GET (list & `?search=`), POST | Publik (NIK, nama, tgl lahir, telepon, alamat) | ADMIN saja |
| `/api/lis/orders` | GET, POST | Publik | ADMIN saja |
| `/api/lis/orders/[id]` | GET | Publik | ADMIN saja |
| `/api/lis/specimens/[barcode]/receive` | POST | Publik ("Petugas Lab" bila tanpa sesi) | ADMIN saja, nama dari sesi |
| `/api/lis/specimens/[barcode]/reject` | POST | Publik | ADMIN saja, nama dari sesi |

- **Dua lapis:** setiap controller di `lib/controllers/lis.controller.ts` memanggil `requireAdmin()` (cek ulang user aktif & role ADMIN di database); middleware juga menolak `/api/lis/*` tanpa JWT admin. Uji "JWT palsu ber-role ADMIN milik akun USER" lolos middleware namun ditolak handler → perlindungan tidak bergantung pada middleware.
- Method lain (PUT/PATCH/DELETE) → 401 tanpa sesi, 405 untuk admin. Path `/api/lis/*` yang tidak ada → 401 tanpa sesi.
- **Error tanpa kebocoran:** teks error Prisma (dapat memuat input seperti NIK) tidak lagi diteruskan ke klien; JSON rusak → 400.
- Tidak ada perubahan tabel, kolom, relasi, model, atau data LIS. `scripts/qa/lis.test.mjs` memverifikasi jumlah pasien/order/item/spesimen dan status spesimen identik sebelum & sesudah pengujian.

**Hasil uji akses (`scripts/qa/lis.test.mjs`, 117/117 lulus di production build):**

| Skenario | Hasil |
|---|---|
| Tanpa login — 10 operasi | 401, tanpa data/PII di respons |
| USER (klien demo) — 10 operasi | 403, tanpa data/PII |
| JWT palsu "ADMIN" untuk akun USER — 10 operasi | 403 (ditolak handler) |
| Admin yang dinonaktifkan, JWT masih berlaku | 403 |
| PUT/PATCH/DELETE pada 7 path | 401 (anonim) / 405 (admin) |
| ADMIN — operasi baca | 200 |
| ADMIN — error (MRN duplikat, enum tidak valid, JSON rusak, barcode tidak dikenal) | 4xx, tanpa PII / detail Prisma |
| Data LIS | Tidak berubah |

---

## 11. Pembersihan Backup SQL dari Repository

**File yang ditemukan (tracked):** seluruh folder `backups/` — `pre_restructure_20261113/diagnova_full_backup.sql`, `pre_restructure_20261113/snapshot_pre_restructure_20261113.json` (isi seluruh tabel), `pre_restructuring_20261113/diagnova_full_backup.sql`, serta `migrations_bak/*` dan `schema.prisma.bak` (tidak sensitif). Isi sensitif: 4 akun beserta hash password, 8 leads (email & telepon pribadi), 5 pasien (termasuk NIK), 12 hash token magic link, 38 audit log.

**Status di Git history:**
- Ditambahkan oleh commit `a67511a` ("update table, cms, ui admin n each other"), yang **sudah ada di `origin/main` dan `origin/artha`**. Repository GitHub bersifat **publik** → data tersebut sudah terekspos publik.
- Commit lokal `artha` yang belum di-push **tidak menambahkan** objek backup baru: `git rev-list --objects artha --not --remotes` → 0 objek di `backups/`.
- Folder dikeluarkan dari tracking (`git rm --cached`, file lokal **tidak dihapus**) dan pola backup ditambahkan ke `.gitignore` (tanpa mengabaikan `prisma/migrations/*.sql`).
- **History tidak ditulis ulang.** Menghapus `a67511a` dari riwayat publik mengharuskan rewrite `main` dan `artha` lalu force push (dilarang), dan tidak menghapus salinan yang mungkin sudah di-clone/fork/cache. Keputusan ini ada pada pemilik repository (opsi: `git filter-repo` + force push terkoordinasi + permintaan purge cache ke GitHub Support).

**Secret scanning** (`npm run scan:secrets`, `scripts/qa/secret-scan.mjs`) atas 247 file yang akan dipublikasikan dan 186 objek baru yang akan di-upload: **0 temuan HIGH**. Sanity check: scanner yang sama terhadap tree `HEAD` sebelum pembersihan mendeteksi hash bcrypt & dump `users/patients/leads` di `backups/`. Temuan MEDIUM yang tersisa: password `postgres123` untuk container DB development (default `compose.yaml`), NIK dummy di `prisma/seed.ts`, dan false positive (string hex PNG di test). `AUTH_SECRET` contoh dan password DB `12345` di `.env.docker.example` diganti placeholder.

### Laporan Credential Rotation (belum dilakukan — butuh akses environment & persetujuan)

| Akun / Kredensial | Alasan | Tindakan |
|---|---|---|
| `admin@diagnova.id` (Super Admin) | Hash ada di backup publik; password default seed tercantum di history publik `prisma/seed.ts` | Ganti password di semua environment |
| `sales@diagnova.id` (Sales Admin) | Sama seperti di atas | Ganti password di semua environment |
| `er***@smk.belajar.id` (Demo User) | Hash password ada di backup publik | Reset password / nonaktifkan; beri tahu pemilik akun |
| `ar***@gmail.com` (Demo User) | Hash password ada di backup publik | Reset password / nonaktifkan; beri tahu pemilik akun |
| `AUTH_SECRET` | Fallback secret lama tercantum di history publik; nilai contoh juga publik | Set secret acak baru ≥ 32 karakter di setiap environment (semua sesi akan logout) |
| Password PostgreSQL lokal (port 5433) | Nilai contoh tercantum di history publik `.env.docker.example` | Ganti bila nilai itu dipakai sungguhan |
| Magic link yang belum terpakai | Hash token ada di backup publik (tidak dapat dibalik) | Opsional: kedaluwarsakan semua tautan aktif (perubahan data — butuh persetujuan) |

Selain rotasi kredensial, data pribadi leads dan pasien di backup publik perlu dinilai pemilik data terkait kewajiban pelindungan data pribadi (UU No. 27/2022 tentang PDP).
