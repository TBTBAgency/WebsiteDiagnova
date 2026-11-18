# Diagnova — Final Development Review (Phase 8–12)

Branch: `artha` · Tanggal: 17 November 2026 · Lingkungan uji: lokal (Next.js 14 build production + PostgreSQL 15 Docker).

**Tidak ada push, merge, deployment, perubahan environment production, migrasi, maupun reset database.**
Semua hasil di dokumen ini berasal dari pengujian lokal. Hasil ini **tidak** membuktikan bahwa production sudah aman.

Lampiran:
- [`docs/audit/SCHEMA_BACKEND_AUDIT.md`](audit/SCHEMA_BACKEND_AUDIT.md) — audit statis schema & backend per model/domain.
- [`docs/proposals/baseline_schema_20261117.sql`](proposals/baseline_schema_20261117.sql) — usulan baseline migration (belum diterapkan).
- Dokumen sebelumnya: `docs/AUDIT_REPORT.md` (Phase 1–7 + hotfix LIS) dan `docs/CMS_BACKEND_REVIEW.md` (CMS awal, password USER, `APP_URL`).

---

## 1. Ringkasan Phase 8–12

| Phase | Hasil utama |
|---|---|
| 0 Pre-flight | Branch `artha`. Working tree bersih. 13 commit lokal sebelumnya belum di-push. Dokumentasi dan kode dibaca ulang. Ketidaksesuaian dokumentasi dicatat di §17. |
| 8 CMS | Footer, FAQ, Announcement Bar, serta CTA dan statistik hero 5 halaman dalam kini dikelola CMS. Item nonaktif tidak lagi terkirim ke browser. Ditambah optimistic locking untuk mencegah dua admin saling menimpa. |
| 9 Konten & legal | Draft `/terms` dan `/privacy` (bertanda DRAFT, noindex). Testimoni dan logo mitra yang tidak terverifikasi disembunyikan dari publik; datanya tetap tersimpan. |
| 10 User & Magic Link | Tombol Magic Link di Manajemen Pengguna, divalidasi backend. Jalur USER manual dan USER dari permohonan demo dipisahkan dengan tegas. |
| 11 Production readiness | Dokumentasi environment, analisis upload/storage, regresi keamanan, kebersihan log dan bundle, serta checklist Vercel (tidak dijalankan). |
| 12 Database & backend | Seluruh model dipetakan. Integritas DB aktual diaudit (35 pemeriksaan). Migration history diuji di DB sementara. Usulan baseline terverifikasi. Bug di cleanup QA yang menghapus audit log admin ditemukan dan diperbaiki. |

## 2. Status Setiap Pekerjaan

| Pekerjaan | Status | Catatan |
|---|---|---|
| Audit ulang konten publik (8.2) | COMPLETED | §3 |
| Footer ke CMS (8.3) | COMPLETED | Deskripsi, logo (upload), kelompok tautan, kontak, media sosial, urutan, visibilitas |
| FAQ ke CMS (8.4) | COMPLETED | Tambah/edit/hapus/nonaktif/urut, kategori |
| AnnouncementBar ke CMS (8.5) | COMPLETED | Teks, tombol/link, aktif/nonaktif, periode tampil. Satu bar saja; banyak announcement tidak dibuat karena tidak diperlukan. |
| Konten kartu & statistik (8.6) | PARTIAL | CTA dan metrik hero kini CMS. Isi kartu bento/visual tetap elemen desain (alasan di §3). |
| Placeholder cleanup (9.1) | COMPLETED | Konten disembunyikan, bukan dihapus. Klaim statistik produk: NEEDS APPROVAL (verifikasi pemilik). |
| Terms & Privacy (9.2, 9.3) | COMPLETED (draft) | Konten final: NEEDS APPROVAL (manajemen dan penasihat hukum) |
| User Management & Magic Link (10) | COMPLETED | Alur undangan untuk USER manual: NEEDS APPROVAL (fitur terpisah) |
| Environment & build (11.1, 11.2) | COMPLETED | §8 |
| Strategi upload (11.2) | NEEDS APPROVAL | Penyimpanan lokal tidak persisten di Vercel (§8.3) |
| Regresi keamanan (11.3) | COMPLETED | §13 |
| Checklist Vercel (11.4) | COMPLETED (dokumen) | Eksekusi: BLOCKED (deployment ditunda pemilik) |
| Audit schema (12.1) | COMPLETED | §9 + lampiran |
| Audit database aktual (12.2) | COMPLETED | §11 |
| Audit migration (12.3) | COMPLETED | Penerapan baseline: NEEDS APPROVAL (§10) |
| Arsitektur backend (12.4) | COMPLETED | §12 |
| Integritas & race condition (12.5) | PARTIAL | Perbaikan aman sudah diterapkan. Race nomor order/barcode LIS: NEEDS APPROVAL. |
| Final integrity test (12.6) | COMPLETED | §14 |

---

## 3. Audit Halaman & Section CMS

Kategori:
- **CMS** = sudah dikelola CMS.
- **Desain** = elemen desain statis yang memang tidak perlu dikelola.
- **Belum** = hardcoded, kandidat CMS berikutnya.

| Halaman / komponen | Konten | Status |
|---|---|---|
| Navbar | Menu & submenu (label, URL, deskripsi, ikon, urutan, aktif) | CMS (sebelumnya) |
| Announcement Bar | Teks, tombol, aktif, periode | **CMS (baru)** |
| Footer | Logo, deskripsi, kontak, sosial, kelompok tautan, copyright, link legal | **CMS (baru)** |
| Homepage › hero, mitra, about, comparison, workflow, infrastructure, testimonials, CTA | Teks, item, gambar | CMS (sebelumnya). Urutan dan visibilitas lewat Halaman & Section. |
| Homepage › FAQ | Header, kategori, pertanyaan/jawaban, ajakan, tombol | **CMS (baru)** |
| 5 halaman dalam › hero | Badge, judul, subjudul | CMS (sebelumnya) |
| 5 halaman dalam › CTA & statistik hero | 2 tombol, 4 metrik per halaman | **CMS (baru)** |
| 5 halaman dalam › header 20 section | Badge, judul, deskripsi, urutan, visibilitas, section kustom | CMS (sebelumnya) |
| 5 halaman dalam › isi kartu bento, mockup tabel pasien, diagram, gantt, direktori analyzer | Teks kartu + visual khusus | **Desain / Belum** (lihat di bawah) |
| CTA penutup (semua halaman) | Judul, subjudul, gambar, tombol | CMS (sebelumnya) |
| `/request-demo`, `/demo-expired`, `/auth/verify-magic-link` | Form & halaman fungsional | Desain (alur aplikasi) |
| `/terms`, `/privacy` | Dokumen legal | **Baru**, kode (draft). Sengaja tidak di CMS sampai isinya disetujui. |
| Ikon, gradien, animasi, ornamen SVG | — | Desain |

**Mengapa isi kartu bento belum dipindah ke CMS (8.6):**
- Setiap kartu menyatu dengan visual khusus, misalnya mockup UI, SVG yang dianimasikan, atau posisi node diagram yang terikat pada tepat 5 item.
- Memindahkannya berarti mendesain ulang komponen, padahal larangan tugas ini adalah mengganti desain.
- Kandidat yang paling siap karena sudah berbentuk array data: `ganttPhases` (Solusi › rollout), kartu tier, kapabilitas Nova AI, dan `analyzerCatalog`. Lihat §18.

## 4. Footer, FAQ, AnnouncementBar

**Penyimpanan.** Baris `cms_sections` yang sudah ada (`footer`, `faq`, `announcement`) dengan JSON `extraContent`.
- Tidak ada tabel baru dan tidak ada migrasi.
- Baris dibuat saat admin pertama kali menyimpan. Sebelum itu website memakai konten lama yang identik, sehingga tidak ada konten yang hilang.

**Admin.** Menu baru **Konten Global** (`/admin/site-content`) dengan tab Footer, FAQ, dan Announcement.
- Setiap daftar dapat ditambah, diubah, dihapus, diurutkan, dan ditampilkan/disembunyikan.
- Logo diunggah lewat uploader yang sudah ada.

**API.** `GET/PUT /api/admin/cms/site` (ADMIN, dicek di handler dan middleware). Validasi zod:
- URL hanya `/…`, `#…`, atau `http(s)://…`; `javascript:` dan `//host` ditolak.
- Media sosial wajib `https://`.
- Logo wajib path lokal (karena dirender `next/image`).
- ID harus unik, setiap FAQ harus merujuk kategori yang ada, dan tanggal akhir announcement harus setelah tanggal mulai.

**Publik.**
- `app/(marketing)/layout.tsx` (ISR 60 detik) memuat Footer dan Announcement; homepage memuat FAQ.
- Penyimpanan memicu `revalidatePath("/", "layout")`.
- Item nonaktif dibuang di server, sehingga tidak ada di page source.
- Data kosong tetap aman: FAQ tanpa item tidak dirender, metrik kosong menghilangkan strip metrik, dan footer tanpa deskripsi/kontak tidak menampilkan blok kosong.

**Concurrency.** Admin mengirim `baseUpdatedAt`. Bila admin lain menyimpan lebih dulu, respons 409 meminta admin memuat ulang. Berlaku juga untuk tata letak halaman dan hero.

**Link footer.**
- Legal kini mengarah ke `/terms` dan `/privacy`. Sebelumnya `/terms` menghasilkan 404, dan "Kebijakan Privasi" mengarah ke `/platform/reporting`.
- Tautan bawaan memakai anchor kanonik, misalnya `/platform#workflow`, tanpa redirect 307.

## 5. Content Cleanup

| Konten | Temuan | Tindakan |
|---|---|---|
| Testimoni homepage | Nama dokter dan grup RS nyata (Hermina, Siloam, Mayapada) dengan kutipan yang tidak dapat diverifikasi | **Disembunyikan** lewat layout CMS (tercatat di audit log). Data utuh dan bisa diaktifkan kembali di Halaman & Section. |
| "Dipercaya oleh" homepage | 6 institusi nyata, semuanya memakai logo placeholder | **Disembunyikan** (sama) |
| Marquee "Dipercaya oleh Mitra" di `/request-demo` | Logo placeholder generik | **Disembunyikan** (flag `SHOW_TRUST_MARQUEE`; kode dipertahankan) |
| Statistik hero (mis. "-70% TAT", "0 Error", "500+ analyzer", "72 Jam") | Klaim kinerja produk; tidak dapat diverifikasi dari kode | **NEEDS APPROVAL.** Admin kini dapat menyembunyikan per metrik; editor menampilkan peringatan verifikasi. |
| Nova AI › status kapabilitas "Q2 2026" | Tanggal sudah lewat | NEEDS APPROVAL (perbarui copy) |
| Footer › "Portal Admin LIS" (`/admin/login`) | Menampilkan pintu admin di situs publik | NEEDS APPROVAL (tautan kini bisa dihapus lewat Konten Global) |

Konten tersembunyi terverifikasi **tidak muncul di HTML publik**, termasuk payload React.

## 6. Terms & Conditions dan Privacy Policy

- **Route:** `/terms` dan `/privacy` (HTTP 200). Komponen bersama `components/legal/LegalDocument.tsx`.
- **Penanda draft:**
  - Banner **"DRAFT — belum berlaku / belum disetujui"** selalu tampil.
  - Status DRAFT, versi `0.1-draft`, dan tanggal berlaku `[ditetapkan setelah persetujuan]`.
  - `robots: noindex`; halaman ini tidak dimasukkan ke sitemap.
  - Setiap isian yang wajib dilengkapi diberi sorotan kuning: 9 di Terms, 11 di Privacy.
- **Isi Terms:** ruang lingkup, penggunaan layanan, ketentuan akun demo (Magic Link 24 jam sekali pakai, masa akses sejak login pertama), hak dan tanggung jawab pengguna, batasan penggunaan, HKI, perubahan, hukum yang berlaku, dan kontak.
  - Klausul jaminan, SLA, dan batasan tanggung jawab **sengaja dikosongkan** untuk penasihat hukum.
- **Isi Privacy, hanya praktik yang terverifikasi di kode:**

  | Topik | Isi | Sumber verifikasi |
  |---|---|---|
  | Data form demo | Field yang dikumpulkan | `lib/validations.ts` |
  | Akun demo | Klien tanpa password | — |
  | IP & user agent | Dicatat pada pemakaian Magic Link dan audit log; IP dipakai sementara untuk rate limit | — |
  | Data pasien modul LIS | Hanya ADMIN yang dapat mengakses | — |
  | Cookie | `diagnova_session` (httpOnly, 24 jam) | — |
  | Penyimpanan lokal | `diagnova_language` | — |
  | Analytics | Tidak ada analytics/iklan | grep kode |
  | Keamanan | Password admin dan token Magic Link disimpan sebagai hash | — |

  - **Tidak** mengklaim enkripsi saat disimpan, penghapusan otomatis, retensi, atau pembagian ke pihak ketiga. Semuanya ditandai `[PERLU DIISI]`.

## 7. User Management & Magic Link

**Dua jalur akun dibedakan tegas** (`lib/magic-link-eligibility.ts`, fungsi murni + 14 unit test):

| Jalur | Magic Link dari Manajemen Pengguna |
|---|---|
| A. Akun dari permohonan demo, lead **APPROVED** | Tersedia: menerbitkan **ulang** tautan untuk lead tersebut. Durasi dan jadwal tidak diubah, status pipeline tidak berubah, tautan lama nonaktif, tercatat sebagai `MAGIC_LINK_REISSUED`. |
| B. Akun manual tanpa permohonan | **Ditolak 409** dengan penjelasan. Tidak ada lead atau tautan yang dibuat, dan akun tidak dianggap permohonan yang disetujui. |
| Permohonan pending / ditolak | Ditolak 409, diarahkan ke menu Permohonan Demo |
| Akun nonaktif / masa demo berakhir | Ditolak 409. Tautan untuk demo berakhir memang tidak akan bisa dipakai. |

- **UI:** tombol "Magic Link" per baris. Tombol dinonaktifkan dengan alasan yang ditampilkan bila tidak memenuhi syarat. Modal menampilkan tautan sekali; tombol WhatsApp memakai tautan backend yang sama persis.
- **Validasi di backend** (`POST /api/admin/users/[id]/magic-link`), bukan hanya disembunyikan di UI.
- **Workflow demo tetap:** Dihubungi → approval membuat Magic Link → login pertama → Jadwal Demo → admin konfirmasi → Selesai. Login ulang, link kedaluwarsa, gagal login, approval, dan penolakan tidak mengubah status secara tidak sah (diuji ulang, demo-workflow 57/57).
- **Integritas akun:**
  - Menghapus USER yang punya riwayat permohonan demo kini **ditolak 409**. Alasannya, relasi lead dan tautan akan putus (`ON DELETE SET NULL`) dan approval berikutnya membuat akun baru dengan masa demo penuh. Gunakan "Nonaktifkan".
  - Form publik tidak lagi menautkan lead ke akun ADMIN dengan email yang sama.
  - Duplikasi email ditolak (unique, case-insensitive karena dinormalisasi lowercase).
- **Password:** USER tetap tanpa password (keputusan sebelumnya dipertahankan). API tidak pernah mengembalikan password atau hash (diuji). Hash ADMIN tetap bcrypt.
- **`APP_URL`:** dipertahankan. Production menolak localhost, non-https, atau nilai kosong (503 sebelum ada perubahan data, diuji 7/7). Domain Vercel dipakai pada link (diuji di API dan browser).
- **Token tidak bocor:**
  - Mock email sebelumnya **mencetak URL Magic Link lengkap dengan token** serta PII pemohon ke log server. Sekarang log hanya berisi ID lead, email tersamar, dan host tautan.
  - Log server dari seluruh run QA final diperiksa: 0 token 64-hex, 0 `token=`, 0 hash bcrypt, 0 email QA tanpa samaran.
- **Catatan "Alokasi Voucher Demo":** masa akses ditentukan durasi saat approval, sehingga field ini praktis tidak berpengaruh. Teks bantuannya diperbaiki agar jujur. Menyelaraskan field ini: NEEDS APPROVAL (§19).

## 8. Environment & Production Readiness

### 8.1 Environment variable (nilai di bawah hanya contoh format)

| Variable | Fungsi | Diperlukan di | Contoh format |
|---|---|---|---|
| `DATABASE_URL` | Koneksi PostgreSQL (Prisma) | Semua | `postgresql://USER:PASSWORD@HOST:5432/DBNAME?schema=public` |
| `AUTH_SECRET` | Tanda tangan JWT sesi (HS256). Production menolak nilai kosong / < 32 karakter. | Production (wajib), dev (opsional) | string acak ≥ 32 karakter (`node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`) |
| `APP_URL` | Origin publik untuk Magic Link, dibaca saat runtime | Production (wajib) | `https://website-diagnova.vercel.app` |
| `NEXT_PUBLIC_APP_URL` | `metadataBase`, sitemap, robots; fallback `APP_URL`. Ditanam saat **build**. | Semua | `https://website-diagnova.vercel.app` |
| `SALES_NOTIFICATION_EMAIL` | Penerima notifikasi (email masih mock) | Opsional | `sales@domain.tld` |
| `VERCEL`, `VERCEL_ENV`, `VERCEL_URL`, `VERCEL_PROJECT_PRODUCTION_URL` | Diisi otomatis oleh Vercel; fallback `APP_URL` | Vercel | otomatis |
| `ALLOW_LOCALHOST_APP_URL` | Hanya untuk QA build production di mesin lokal; diabaikan di Vercel | **Jangan** di server | `true` |
| `SEED_ADMIN_PASSWORD`, `SEED_SALES_PASSWORD`, `SEED_CMS_OVERWRITE` | Hanya untuk script seed | Lokal | — |
| `DOCKER_DB_PORT`, `POSTGRES_*` | Docker Compose lokal | Lokal | — |
| `SALES_PHONE_NUMBER`, `RESEND_API_KEY`, `EMAIL_FROM`, `SMTP_*`, `NEXT_PUBLIC_GA_MEASUREMENT_ID` | **Tidak dipakai kode** (email mock, tanpa analytics) | — | — |

### 8.2 Build

- `npm run build` (= `prisma generate && next build`) **sukses**. Semua route terbentuk, termasuk `/terms`, `/privacy`, `/admin/site-content`, dan `/api/admin/users/[id]/magic-link`.
- Bundle client (63 file `.next/static`) dipindai: **tidak ada** `AUTH_SECRET`, `DATABASE_URL`, password DB, hash bcrypt, private key, maupun kode Prisma.

### 8.3 Upload & storage — **risiko production**

- `POST /api/admin/cms/upload` menulis ke `public/uploads/cms` di filesystem, dan `GET /uploads/cms/[filename]` membacanya.
- Di Vercel (serverless), filesystem deployment bersifat read-only dan `/tmp` tidak persisten. **Upload dari admin akan gagal atau hilang.** Gambar yang sudah di-commit ke repo tetap tersedia sebagai aset statis.
- **Usulan (NEEDS APPROVAL, storage production tidak diganti):**
  - Pakai object storage: Vercel Blob atau S3-compatible (S3, Cloudflare R2, Supabase Storage).
  - Simpan URL publiknya di CMS, lalu sesuaikan `upload/route.ts` dan route penyaji.
  - Validasi tipe berbasis magic-bytes yang sudah ada tetap dipakai.

### 8.4 Checklist Vercel (TIDAK dijalankan, menunggu persetujuan)

1. **Persetujuan pemilik** untuk deploy branch tertentu. Saat ini Vercel masih menjalankan kode lama: `/api/lis/catalog` → 500, bukan 401 (diperiksa 17 Nov).
2. **Database target:** pastikan `DATABASE_URL` Vercel adalah DB yang sama dengan yang dipakai admin Vercel untuk approval Magic Link. Lakukan backup (`pg_dump`) **sebelum** apa pun.
3. **Env:** `DATABASE_URL`, `AUTH_SECRET` (baru, ≥ 32 karakter; rotasi karena secret lama ada di riwayat publik), `APP_URL`, `NEXT_PUBLIC_APP_URL`. Jangan set `ALLOW_LOCALHOST_APP_URL`.
4. **Build command** default `npm run build` (sudah termasuk `prisma generate`). Node ≥ 18.
5. **Migrasi:** **jangan** `prisma migrate deploy` ke DB yang berisi data. Ikuti rencana §10. Verifikasi dulu `prisma migrate diff --from-url <DB> --to-schema-datamodel prisma/schema.prisma` (harus "No difference"), atau bahas perbedaannya.
6. **Upload:** putuskan storage (§8.3) sebelum admin mengunggah gambar di production.
7. **Credential:** rotasi password admin/sales dan nonaktifkan atau reset akun demo lama (temuan Turn 3, masih tertunda).
8. **Smoke test setelah deploy:**
   - `/`, `/platform`, `/terms`, `/privacy` → 200.
   - `/api/lis/catalog` dan `/api/admin/users` tanpa login → 401.
   - Login admin, simpan CMS, lalu perubahan tampil.
   - Ajukan demo → approve → link berawalan `https://website-diagnova.vercel.app/auth/verify-magic-link` → buka di perangkat lain → status Jadwal Demo.
   - Log Vercel tidak berisi token.
9. **Rollback:** "Instant Rollback / Promote previous deployment" di Vercel. Perubahan data CMS bersifat aditif (baris baru `layout_*`, `footer`, `faq`, `announcement`); kode lama mengabaikannya. Restore DB dari backup langkah 2 hanya bila diperlukan.

Langkah yang memerlukan persetujuan eksplisit: 1, 2 (akses DB production), 3 (perubahan env), 5, 6, 7.

## 9. Audit Prisma Schema

Rincian per model ada di lampiran: field, PK/FK, `onDelete`, unique, index, enum, timestamp, soft-delete, dan pemakai. Ringkasan berikut sudah diverifikasi terhadap DB aktual (`information_schema`):

| Model (tabel) | Fungsi | Relasi / FK (perilaku hapus, terverifikasi di DB) | Catatan |
|---|---|---|---|
| Role (`roles`) | Peran ADMIN/USER | ← users.role_id `SET NULL` | Legacy "Super Admin" masih diterima di kode |
| User (`users`) | Admin (password) & klien demo (tanpa password) | role_id → roles `SET NULL` | `role_id` tanpa index; field demo bisa tidak sinkron dengan Lead |
| Lead (`leads`) | Permohonan demo + pipeline | user_id → users `SET NULL` | Kolom `jobTitle` tanpa `@map` (camelCase); `demoDate` hanya cermin; `voucherCode` tidak tampil di UI |
| DemoMagicLink (`demo_magic_links`) | Token sekali pakai (hash SHA-256) | lead_id → leads `CASCADE`; user_id → users `SET NULL` | `token_hash` unique **dan** index duplikat; `user_id` tanpa index |
| AuditLog (`audit_logs`) | Jejak audit | **Tanpa FK** (by design) | Nama aktor kosong bila user dihapus |
| Patient / Physician / TestCatalog | Master data LIS | ← lab_orders `RESTRICT` / `SET NULL`; ← lab_order_items `RESTRICT` | `mrn` unique + index duplikat |
| LabOrder / LabOrderItem / Specimen | Order, item, tabung | items & specimens `CASCADE` dari order | `order_number`, `barcode_number` unique + index duplikat; `physician_id` tanpa index |
| CmsSection (`cms_sections`) | Seluruh konten CMS (satu baris per key, JSON) | — | `isPublished` sebagai flag; tidak ada soft-delete di model mana pun |

**Enum yang dideklarasikan tetapi tidak dipakai:** `LeadStatus`, `UserRole`, `UserStatus`. Kolom status memakai `Int`.

**Rekomendasi** (tidak ada yang dihapus; perlu migrasi dan persetujuan):
- Hapus index duplikat.
- Tambah index pada `users.role_id`, `demo_magic_links.user_id`, dan `lab_orders.physician_id`.
- Putuskan nasib enum yang tidak dipakai dan field demo yang ganda.

## 10. Audit Migration History

Diuji di **database sementara terisolasi** di container yang sama (`diagnova_migcheck_a/b`, dihapus setelah uji):

| Pemeriksaan | Hasil |
|---|---|
| `_prisma_migrations` di DB dev | **Tidak ada.** DB dev dibuat dengan `prisma db push`. |
| 3 migration (`init_leads`, `add_users_and_audit`, `add_lis_core_preanalytic`) diterapkan ke DB kosong | Berhasil, tetapi **schema hasilnya berbeda jauh** dari `schema.prisma` |
| Selisih migration → schema (`prisma migrate diff`) | Kurang: tabel `roles`, `demo_magic_links`, `cms_sections`, enum `lead_approval_status`, sekitar 20 kolom, dan 4 FK. Lebih: tabel `lead_notes`, FK `audit_logs→users`. Enum `user_role` berbeda. |
| Menutup selisih dengan migration "maju" | **Destruktif:** `DROP COLUMN users.role`, `users.status`, `leads.status`, `DROP TABLE lead_notes`. Ditolak untuk DB berisi data. |
| DB dev vs `schema.prisma` | **No difference detected** (tidak drift) |
| Usulan baseline (`migrate diff --from-empty`) | 365 baris, **0 DROP**. Diterapkan ke DB kosong tanpa error. Hasilnya **identik** dengan schema dan dengan DB dev. |

**Rencana aman (NEEDS APPROVAL):**
1. Arsipkan 3 migration lama (riwayat tetap di git).
2. Jadikan `docs/proposals/baseline_schema_20261117.sql` sebagai `prisma/migrations/<ts>_baseline/migration.sql`.
3. DB berisi data (dev / production): backup → `migrate diff` harus "No difference" → `prisma migrate resolve --applied <ts>_baseline`, **tanpa menjalankan SQL**.
4. DB baru: `prisma migrate deploy`.
5. Perbarui `DOCKER_SETUP.md`, yang saat ini menyarankan `migrate deploy` dan akan membangun schema yang salah.

Backup sebelum pekerjaan database: `backups/pre_phase12_diagnova_v2_20261117_120854.dump` (folder di-gitignore, tidak dihapus).

## 11. Database Integrity (DB dev lokal `diagnova_v2`, read-only)

**Jumlah record:**

| Tabel | Baris |
|---|---|
| audit_logs | 47 |
| cms_sections | 15 |
| demo_magic_links | 1 |
| lab_order_items | 2 |
| lab_orders | 1 |
| leads | 1 |
| patients | 2 |
| physicians | 2 |
| roles | 2 |
| specimens | 2 |
| test_catalogs | 10 |
| users | 3 |

**35 pemeriksaan integritas → 34 bersih.** Yang diperiksa antara lain:
- user tanpa role;
- email ganda (case-insensitive);
- USER yang punya password;
- lead/link/order/item/spesimen yatim;
- lead Jadwal Demo tanpa link terpakai;
- lead disetujui tanpa user;
- lebih dari satu link aktif per lead;
- link dipakai setelah kedaluwarsa;
- format hash token;
- nomor order / barcode / NIK ganda;
- spesimen diterima tanpa waktu;
- spesimen ditolak tanpa alasan.

Satu-satunya temuan: **2 baris `audit_logs` (`LOGIN_FAILED`) merujuk user QA yang sudah dihapus.** Ini konsekuensi `audit_logs.user_id` tanpa FK; riwayat audit sengaja dipertahankan.

**Temuan penting (proses QA): riwayat audit log admin di DB dev lokal tidak lengkap.**
- Cleanup `scripts/qa/demo-workflow.test.mjs` (dibuat di Phase 3) menghapus audit log berdasarkan `userId` lead.
- Lead uji eskalasi hak akses memakai email admin, dan form publik menautkannya ke akun admin. Akibatnya **setiap run suite menghapus seluruh audit log milik akun admin** di DB yang diuji.
- Ini terjadi di DB dev lokal pada run sebelum 17 Nov sore. Jumlah pastinya tidak dapat direkonstruksi.
- **Diperbaiki di dua sisi:**
  - cleanup kini hanya menyentuh akun `@example.test`;
  - form publik tidak lagi menautkan lead ke akun ADMIN.
- **Diverifikasi:** run penuh pada klon DB menghapus **0 dari 47** audit log yang sudah ada.
- Production tidak terdampak, karena skrip QA menolak berjalan terhadap DB non-localhost.

**Race condition & konsistensi** (statis; detail di lampiran D):

| Temuan | Status |
|---|---|
| Nomor order & barcode LIS: "ambil max lalu +1" di luar transaksi → bentrok saat dibuat bersamaan (unique constraint mencegah duplikat diam-diam, tetapi request kedua gagal 500); urutan teks rusak setelah 9999 per hari | NEEDS APPROVAL (perubahan LIS). Usulan: retry on P2002 dalam transaksi (tanpa migrasi), atau tabel counter / sequence (dengan migrasi). |
| Worklist LIS `priority asc` mengikuti urutan enum (ROUTINE lebih dulu dari CITO) | NEEDS APPROVAL (LIS) |
| Validasi input LIS (sex, tanggal lahir, panjang field, kode tes tak dikenal dibuang diam-diam) | NEEDS APPROVAL (LIS). Batas `limit` daftar sudah diterapkan. |
| Spesimen receive/reject tanpa guard status | NEEDS APPROVAL (LIS) |
| CMS JSON read-modify-write (lost update) | **Diperbaiki** untuk endpoint baru (optimistic locking). Endpoint CMS lama (hub homepage, menu): rekomendasi. |
| `approveLead` & konsumsi Magic Link multi-step tanpa transaksi | Rekomendasi (alur kritis; perlu pengujian khusus) |
| Lead status transitions | Aman (update atomik dengan guard status) |

## 12. Backend Architecture

Alur: **Halaman admin/publik → `app/api/**/route.ts` → `lib/controllers/*` (leads, auth, LIS) atau langsung `lib/models/*` → Prisma → PostgreSQL.**

| Domain | Route → logika | Validasi | Otorisasi | Catatan |
|---|---|---|---|---|
| Auth | `/api/auth/login`, `logout`, `me` → `auth.controller` | zod | Password hanya ADMIN, rate limit | — |
| Middleware | `middleware.ts` | — | Lapis 1 untuk `/admin/*`, `/api/admin/*`, `/api/lis/*` | Handler tetap memanggil `requireAdmin()` (cek ulang ke DB) |
| Users | `/api/admin/users*` → `user.model`, `user-magic-link.model` | zod (kini dengan batas panjang) | `requireAdmin` | Error domain lewat `UserManagementError` |
| Leads & demo workflow | `/api/admin/leads*`, `/api/request-demo` → `lead.controller` → `lead.model` | zod | `requireAdmin` / publik + rate limit | Transisi status atomik |
| Magic Link | `/auth/verify-magic-link`, `POST /api/auth/magic-link` → `lib/magic-link.ts` | Format token | Same-origin + rate limit | Hanya hash token yang disimpan |
| CMS hub (homepage) | `/api/admin/cms/homepage` → `cms.model` | Minimal | `requireAdmin` | Pesan error kini aman |
| CMS layout / hero | `/api/admin/cms/layout` → `cms-layout.model` | zod | `requireAdmin` | Optimistic locking |
| Konten global | `/api/admin/cms/site` → `site-content.model` | zod | `requireAdmin` | Optimistic locking |
| Navigasi | `/api/menus` (publik), `/api/admin/menus*` → `menu.model` → `cms.model` | Minimal | `requireAdmin` | Endpoint admin menu tidak dipakai UI |
| Upload | `/api/admin/cms/upload`, `/uploads/cms/[filename]` | Magic-bytes | `requireAdmin` | Filesystem (§8.3) |
| LIS | `/api/lis/*` → `lis.controller` → model LIS | Manual (belum zod) | `requireAdmin` di setiap handler | Pagination dibatasi |
| Audit | `/api/admin/audit-logs` → `audit.model` | — | `requireAdmin` | — |

**Format respons** konsisten `{ success, message, data?, errors? }`.

**Error hygiene:**
- 8 handler yang sebelumnya meneruskan `error.message` (termasuk pesan Prisma) kini mengembalikan pesan generik.
- Hanya pesan domain "tidak ditemukan" yang aman yang tetap ditampilkan.

**Kode tidak terpakai / legacy** (dibiarkan, perlu persetujuan sebelum dihapus):
- `/api/admin/menus*`, `/api/admin/roles`, stub `leads/[id]/notes`;
- `lib/leads.ts` (re-export);
- 5 getter halaman di `cms.model.ts`;
- route detail `/[slug]` yang selalu dialihkan;
- sekitar 9 script di `scripts/` yang merujuk model yang sudah tidak ada (akan crash);
- script yang menulis ulang source atau mengekspor seluruh tabel (lihat lampiran E).

## 13. Security Testing

| Area | Hasil |
|---|---|
| Tanpa login → endpoint privat (admin, LIS, CMS, users, magic-link) | 401 |
| Sesi USER → endpoint ADMIN | 403 |
| JWT palsu "ADMIN" untuk akun USER / admin yang dinonaktifkan | 403 (cek ulang ke DB) |
| LIS tetap ADMIN-only, tanpa PII di error | 117/117 |
| CMS: URL `javascript:` / `//host` / logo eksternal / XSS | Ditolak 400 / ter-escape |
| Password / hash / token di respons API | Tidak ada (diuji di daftar user, create, magic-link) |
| Konten tersembunyi di page source | Tidak ada (diuji: link footer, FAQ, metrik hero, testimoni, mitra). Section kustom yang disembunyikan juga difilter di server, tetapi belum diuji khusus. |
| Rahasia di bundle client | Tidak ada (63 file) |
| Token / PII di log server (seluruh run QA final) | Tidak ada |
| Secret scan repo (`npm run scan:secrets`) | 0 HIGH |
| Production `APP_URL=localhost` | Approval ditolak 503 tanpa perubahan data |

## 14. Hasil Seluruh QA

Lingkungan:
- Build production.
- Server memakai **klon terisolasi** `diagnova_qa` dari DB dev, dibuat dengan `pg_dump | pg_restore` lalu dihapus setelah uji.
- `APP_URL=https://website-diagnova.vercel.app`.

| Pemeriksaan | Hasil |
|---|---|
| TypeScript (`tsc --noEmit`) | 0 error |
| ESLint (`next lint`) | 0 error, 131 warning (sebelumnya 125; tambahan berupa false positive `no-unused-vars` pada parameter tipe) |
| Production build | Sukses |
| QA API, satu run penuh (`npm run test:qa`) | **404/404**: security 28 · demo-workflow 57 · admin 25 · cms 19 · LIS 117 · cms-layout 43 · site-content 78 · unit app-url 23 · unit eligibility 14 |
| QA production salah konfigurasi (`APP_URL=localhost`) | 7/7 |
| Browser (Edge headless) Phase 8–10 | 30/30: Konten Global, hero CTA/metrik, Magic Link dari Manajemen Pengguna (dibuka dari konteks browser lain → Jadwal Demo, masa akses sesuai approval), legal, cleanup, mobile tanpa overflow |
| Browser regresi (suite sebelumnya) | 34/34 |
| Integritas data | DB dev: **identik byte-per-baris** (md5, 12 tabel) sebelum dan sesudah seluruh QA. Klon QA: 0 audit log lama terhapus; isi `cms_sections` dan `users` identik (hanya `updated_at` dari proses restore). |

**Audit log yang bertambah di klon QA (29 baris):**

| Jumlah | Aksi | Asal |
|---|---|---|
| 12 | `LOGIN_SUCCESS` | Login admin oleh setiap skrip |
| 6 | `LOGIN_FAILED` | Uji login salah / akun nonaktif |
| 3 | `USER_DELETED` | Penghapusan akun QA |
| 6 | `UPDATE_CMS_SECTION` | cms.test |
| 1 | `SAVE_CMS_NAVIGATION_MENU` | cms.test |
| 1 | `DELETE_CMS_NAVIGATION_MENU` | cms.test |

Semuanya catatan nyata aktivitas pengujian dan sengaja tidak dihapus.

**Catatan jujur.**
- Pada run penuh pertama ada 1 check yang gagal karena urutan tes. `cms-layout` memulihkan data langsung di DB tanpa revalidasi, sehingga halaman ISR masih menyajikan cache hingga 60 detik.
- Check itu kini menunggu satu siklus ISR, lalu satu run penuh berikutnya lulus 404/404.
- Pada run pertama di klon itu juga, bug cleanup (§11) menghapus 34 audit log lama. Klon dibuat ulang setelah perbaikan, lalu diverifikasi.

## 15. File yang Berubah (Phase 8–12)

48 file, +3.089 / −500 baris (di luar dokumen ini dan lampirannya).

- **CMS (Phase 8):**
  - `lib/site-content.ts`, `lib/site-content-faq.ts`, `lib/models/site-content.model.ts`, `app/api/admin/cms/site/route.ts`, `app/admin/(dashboard)/site-content/page.tsx`
  - `components/layout/{Footer,Navbar,AnnouncementBar}.tsx`, `components/sections/{FAQSection,PageHero}.tsx`
  - `lib/cms-hero.ts`, `lib/cms-hero-defaults.ts`, `lib/cms-layout.ts`, `lib/models/cms-layout.model.ts`, `lib/models/cms.model.ts`
  - `app/(marketing)/layout.tsx`, `app/(marketing)/page.tsx`, 5 `*PageClient.tsx`
  - `app/admin/(dashboard)/page-sections/page.tsx`, `components/admin/AdminSidebar.tsx`
- **Konten & legal (Phase 9):** `app/(marketing)/terms/page.tsx`, `app/(marketing)/privacy/page.tsx`, `components/legal/LegalDocument.tsx`, `app/(marketing)/request-demo/page.tsx`
- **User & hardening (Phase 10–11):**
  - `lib/magic-link-eligibility.ts`, `lib/models/user-magic-link.model.ts`, `app/api/admin/users/[id]/magic-link/route.ts`
  - `app/api/admin/users/[id]/route.ts`, `app/api/admin/users/[id]/status/route.ts`, `app/admin/(dashboard)/users/page.tsx`
  - `lib/models/user.model.ts`, `lib/models/lead.model.ts`, `lib/validations.ts`, `lib/email.ts`, `lib/controllers/lis.controller.ts`
  - `app/api/admin/menus/**`, `app/api/admin/cms/homepage/route.ts`, `app/api/admin/leads/[id]/notes/route.ts`
- **Tes:** `scripts/qa/site-content.test.mjs`, `scripts/qa/magic-link-eligibility.test.ts`, `scripts/qa/demo-workflow.test.mjs`, `package.json`
- **Dokumen:** `docs/FINAL_DEVELOPMENT_REVIEW.md`, `docs/audit/SCHEMA_BACKEND_AUDIT.md`, `docs/proposals/baseline_schema_20261117.sql`
- **Data (DB dev lokal):** satu baris CMS baru, `layout_home`. Isinya menyembunyikan testimoni dan "Dipercaya oleh", dibuat lewat API admin dan tercatat di audit log `CREATE_PAGE_LAYOUT`. Tidak ada data yang dihapus.

## 16. Commit Lokal (belum di-push)

Phase 8–12:

| Commit | Isi |
|---|---|
| `65cc77d` | feat(cms): footer, FAQ, announcement, hero CTA/metrik (Phase 8) |
| `5f330ac` | feat(content): draft Terms & Privacy, sembunyikan placeholder (Phase 9) |
| `6ed9b6f` | feat(users): Magic Link dari Manajemen Pengguna; hardening API (Phase 10–11) |
| `21e09a7` | test(qa): cakupan Phase 8–10; cleanup QA tidak lagi menghapus audit log nyata |
| commit dokumen | docs: laporan akhir + lampiran audit + usulan baseline (hash dilaporkan di ringkasan sesi) |

Commit lokal sebelumnya (juga belum di-push):

| Commit | Isi |
|---|---|
| `66b7580`, `ec77eda`, `f1ab9f6`, `915ba90` | CMS awal / password USER / `APP_URL` |
| `ab2462e`, `c6c1764` | Backup & LIS hotfix |
| `ad0cb45`, `cdede4b`, `bdb0c82`, `a7bf0db`, `09b5b3a`, `c33c0b6`, `65cc9fc` | Phase 1–7 |

## 17. Masalah yang Belum Selesai

| # | Masalah | Status |
|---|---|---|
| 1 | Production (Vercel) masih menjalankan kode lama, termasuk LIS tanpa proteksi | BLOCKED (deployment ditunda) |
| 2 | Upload tidak persisten di Vercel | NEEDS APPROVAL (§8.3) |
| 3 | Migration history tidak dapat membangun schema | NEEDS APPROVAL (§10) |
| 4 | Race nomor order/barcode LIS, overflow 9999, urutan prioritas worklist, validasi input LIS, guard status spesimen | NEEDS APPROVAL (perubahan LIS) |
| 5 | `approveLead` & konsumsi Magic Link tanpa transaksi | PARTIAL (rekomendasi) |
| 6 | Export CSV lead terpotong 100 baris; timeline dashboard 14 hari dihitung dari 5 data terbaru | Belum diperbaiki (bug non-kritis, di luar cakupan fase) |
| 7 | Isi kartu bento halaman dalam belum CMS | PARTIAL (§3) |
| 8 | Konten legal final, klaim statistik produk, testimoni/logo mitra dengan izin | NEEDS APPROVAL |
| 9 | Rotasi credential & backup lama di riwayat publik (temuan Turn 3) | NEEDS APPROVAL |
| 10 | Script legacy yang crash / destruktif | Belum dibersihkan (perlu persetujuan) |
| 11 | Riwayat audit admin di DB dev lokal tidak lengkap (§11) | Tidak dapat dipulihkan; penyebab sudah diperbaiki |

**Ketidaksesuaian dokumentasi vs kode:**
- `DOCKER_SETUP.md` menyarankan `migrate deploy` (lihat §10).
- `docs/CMS_BACKEND_REVIEW.md` §10 menyebut Footer/FAQ/Announcement belum CMS; kini sudah.
- `.env.example` memuat variabel yang tidak dipakai (§8.1).

## 18. Rekomendasi Pekerjaan Selanjutnya

1. Setujui dan jalankan deployment mengikuti §8.4, dimulai dengan backup dan verifikasi DB target.
2. Pindahkan upload ke object storage sebelum admin memakai upload di production.
3. Adopsi baseline migration (§10) dan perbarui `DOCKER_SETUP.md`.
4. Perbaikan LIS (setelah disetujui): penomoran order/barcode dengan retry/sequence, urutan prioritas, zod untuk input LIS, guard status spesimen.
5. Bungkus `approveLead` dan konsumsi Magic Link dalam transaksi, dengan pengujian konkurensi.
6. Pindahkan kartu yang sudah berbentuk data ke CMS: rollout, tier, kapabilitas Nova AI, direktori analyzer.
7. Tambahkan optimistic locking ke CMS hub lama (homepage & menu).
8. Bersihkan kode/script legacy dan index duplikat setelah disetujui.
9. Selaraskan field demo (`User.demoDurationDays`, `Lead.voucherExpiry`, `Lead.demoDate`).
10. Metadata SEO per halaman dalam, dan versi Inggris dokumen legal setelah versi Indonesia disetujui.

## 19. Hal yang Memerlukan Persetujuan Pemilik Project

- [ ] Deployment ke Vercel (branch, waktu, dan siapa yang menyetujui).
- [ ] Akses dan backup DB production; konfirmasi DB yang dipakai Vercel.
- [ ] Nilai env production baru (`AUTH_SECRET` baru, `APP_URL`, `NEXT_PUBLIC_APP_URL`).
- [ ] Rotasi password admin/sales dan penanganan akun demo lama; penilaian UU PDP atas data yang pernah terpublikasi.
- [ ] Penerapan baseline migration (`migrate resolve`) dan pengarsipan migration lama.
- [ ] Pilihan object storage untuk upload.
- [ ] Isi final Syarat & Ketentuan dan Kebijakan Privasi (manajemen dan penasihat hukum).
- [ ] Verifikasi atau perubahan klaim statistik produk; izin publikasi testimoni dan logo mitra.
- [ ] Perubahan modul LIS (§11).
- [ ] Alur undangan Magic Link untuk akun USER manual (fitur terpisah, termasuk aturan status lead).
- [ ] Penyelarasan field durasi demo dan "Alokasi Voucher Demo".
- [ ] Penghapusan kode/script legacy dan tautan "Portal Admin LIS" di footer publik.
- [ ] Push branch `artha` dan pembuatan PR ke `main`.
