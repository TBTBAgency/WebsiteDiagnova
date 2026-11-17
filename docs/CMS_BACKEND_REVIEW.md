# Diagnova — CMS, Database, Password Pengguna & Magic Link: Review dan Implementasi

Branch: `artha` · Tanggal: 17 November 2026 · Status: diverifikasi di lingkungan lokal (dev + build production).
Tidak ada push, merge, deployment, migrasi database, atau penghapusan data.

## Ringkasan

| Area | Status | Inti |
|---|---|---|
| Audit CMS seluruh halaman | VERIFIED | Sebelumnya hanya homepage (8 section), navigasi, dan teks hero 5 halaman dalam yang benar-benar terhubung ke CMS. Banyak field admin tidak berpengaruh ke website. |
| Pemeriksaan `CmsSection` (Prisma Studio) | VERIFIED | 14 baris. Tidak ada tabel `Menu`: navigasi disimpan sebagai JSON di `cms_sections.navigation`. |
| Pengembangan CMS | COMPLETED (dengan batasan, lihat §9) | Admin kini dapat mengatur urutan, menampilkan/menyembunyikan, mengubah teks header, menambah section kustom (gambar + CTA), dan mengedit hero di 6 halaman publik. Tanpa tabel baru dan tanpa migrasi. |
| Password Tambah Pengguna | COMPLETED | Password USER tidak pernah dipakai (login password khusus ADMIN). Field dihapus; akun USER selalu tanpa password dan masuk lewat Magic Link. |
| Magic Link URL | COMPLETED (lokal) · BLOCKED (uji di Vercel) | `APP_URL` server-side. Production tidak pernah menghasilkan localhost. Uji ujung-ke-ujung di Vercel memerlukan deployment, yang tidak diizinkan pada tugas ini. |

---

## 1. Hasil Audit Seluruh Halaman CMS

### Temuan utama (sebelum perubahan)

1. **Sebagian besar isi CMS tidak sampai ke website publik.**
   - Yang benar-benar dibaca halaman publik hanya:
     - 8 section homepage;
     - navigasi (`navigation`);
     - badge/judul/subjudul hero `page_platform`, `page_solutions`, `page_modules`, `page_nova_ai`, `page_integrations`.
   - Fungsi `getSolutionsPageData`, `getModulesPageData`, `getIntegrationsPageData`, `getNovaAiPageData`, dan `getPlatformPageData` tidak pernah dipanggil.
   - Akibatnya, field berikut tidak tampil di website walaupun disimpan admin:
     - `bannerUrl` dan `submodules` di Platform;
     - `bannerUrl` di Nova AI;
     - item Solusi/Modul/Integrasi.
2. **Section tidak dapat ditambah, diurutkan, diaktifkan, atau dinonaktifkan.** Urutan section adalah JSX statis di setiap halaman.
3. **`isPublished` diabaikan di homepage**, dan admin tidak memiliki toggle untuk itu.
4. **`sortOrder` item tidak diurutkan saat render**, hanya saat disimpan.
5. **Tidak ada editor hero untuk Solusi, Modul, dan Integrasi**, padahal halaman publik membaca hero tersebut.
6. **Halaman detail lama sudah tidak dapat diakses.** Route berikut selalu dialihkan (307) oleh `next.config.mjs` ke anchor di halaman induk, sehingga tidak pernah dirender:
   - `/solutions/[slug]`, `/modules/[slug]`, `/integration/[slug]`;
   - `/platform/{workflow,automation,reporting,analytics}`;
   - `/nova-ai/{how-it-works,ai-doctor}`.
7. **Footer, AnnouncementBar, FAQ, dan halaman `/request-demo` 100% hardcoded.**
8. **Konten placeholder yang perlu keputusan bisnis** (tidak diubah, karena tidak boleh mengarang konten):
   - Testimoni menyebut institusi nyata dengan kutipan contoh.
   - Logo "Trusted by" berupa placeholder.
   - Footer berisi `/terms` (404), dan "Kebijakan Privasi" mengarah ke `/platform#reporting`.
   - Kapabilitas "Q2 2026" di Nova AI sudah lewat.

### Gambar & aset

| Lokasi | Aset | Dapat diganti via CMS? |
|---|---|---|
| Hero homepage | `slides[].imageUrl` (bawaan `/images/hero-bg-{1,2,3}.webp`) | Ya (upload) |
| Trusted By | `partners[].logoUrl` (bawaan `/images/trust-logo.svg`) | Ya |
| About | `extraContent.imageUrl` (`/images/dna-about.webp`) | Ya |
| Testimoni | `items[].avatarUrl` | Ya |
| CTA | `extraContent.imageUrl` (`/images/CTA-image.webp`) | Ya. Kini juga berlaku di 5 halaman dalam. |
| Workflow | `/images/dna-workflow.webp` | Tidak |
| Section kustom (baru) | `content.imageUrl` | Ya (upload dari perangkat lokal) |
| Visual/mockup di halaman dalam (tabel pasien contoh, diagram, SVG) | inline | Tidak (bagian desain) |

## 2. Pemetaan Halaman dan Section

Keterangan kolom:
- **Konten** = sumber isi section.
- **Urut/Aktif** = dapat diurutkan & ditampilkan/disembunyikan dari menu **Halaman & Section** (baru).
- **Teks header** = badge/judul/deskripsi dapat diubah tanpa mengubah kode.

### Homepage (`/`)

| Section | Konten | Urut/Aktif | Teks & item |
|---|---|---|---|
| `hero` | CMS `hero.extraContent.slides[]` | Terkunci di posisi 1 | Tab Homepage › Hero (slide: tambah/edit/hapus/urut/aktif) |
| `trusted_by` | CMS `partners[]` | Ya | Logo mitra: tambah/edit/hapus/urut/aktif |
| `about` | CMS `about` | Ya | Badge, pernyataan, paragraf, gambar |
| `comparison` | CMS `items[]` | Ya | Item: tambah/edit/hapus/urut |
| `workflow` | CMS `steps[]` (4 langkah tetap) | Ya | Badge/judul + teks langkah |
| `infrastructure` | CMS `cards[]` (3 kartu tetap) | Ya | Badge/judul + teks kartu |
| `testimonials` | CMS `items[]` | Ya | Tambah/edit/hapus/aktif. Input kutipan EN ditambahkan. |
| `faq` | `content/faq.ts` | Ya | **Belum CMS** |
| `cta` | CMS `cta` | Ya | Judul, subjudul, gambar, teks tombol |

### Platform (`/platform`)

| Section | Konten | Urut/Aktif | Teks header |
|---|---|---|---|
| `hero` | CMS `page_platform` | Terkunci | Editor hero (Halaman & Section / CMS Hub) |
| `workflow` | Komponen alur kerja (teks bawaan) | Ya | — |
| `automation` | Inline JSX | Ya | Ya |
| `reporting` | Inline JSX + mockup | Ya | Ya |
| `analytics` | Inline JSX | Ya | Ya |
| `enterprise` | Inline JSX | Ya | Ya |
| `cta` | CMS `cta` (bersama) | Ya | Lewat tab Homepage › CTA |
| + section kustom | CMS `layout_platform` | Ya | Ya (badge, judul, deskripsi, gambar, CTA) |

### Solusi (`/solutions`)

| Section | Urut/Aktif | Teks header |
|---|---|---|
| `hero` (CMS `page_solutions`) | Terkunci | Ya (editor hero baru) |
| `facility-solutions` | Ya | Ya |
| `tiers` | Ya | Judul & deskripsi (section ini tidak memiliki badge) |
| `efficiency` | Ya | Ya |
| `rollout` | Ya | Ya |
| `cta` | Ya | Bersama |
| + section kustom | Ya | Ya |

### Modul (`/modules`)

| Section | Urut/Aktif | Teks header |
|---|---|---|
| `hero` (CMS `page_modules`) | Terkunci | Ya (editor hero baru) |
| `modules-explorer` | Ya | Ya |
| `catalog` | Ya | Ya |
| `architecture` | Ya | Ya |
| `scalability` | Ya | Ya |
| `cta` | Ya | Bersama |
| + section kustom | Ya | Ya |

### Nova AI (`/nova-ai`)

| Section | Urut/Aktif | Teks header |
|---|---|---|
| `hero` (CMS `page_nova_ai`) | Terkunci | Ya |
| `system-of-action` | Ya | Ya |
| `workstation-demo` | Ya | Ya |
| `how-it-works` | Ya | Ya |
| `ai-doctor` | Ya | Ya |
| `cta` | Ya | Bersama |
| + section kustom | Ya | Ya |

### Integrasi (`/integration`)

| Section | Urut/Aktif | Teks header |
|---|---|---|
| `hero` (CMS `page_integrations`) | Terkunci | Ya (editor hero baru) |
| `integration-explorer` | Ya | Ya |
| `architecture` | Ya | Ya |
| `analyzer-directory` | Ya | Ya |
| `compliance` | Ya | Ya |
| `cta` | Ya | Bersama |
| + section kustom | Ya | Ya |

### Bagian layout & halaman lain

| Bagian | Status CMS |
|---|---|
| Navbar (menu & submenu) | CMS `navigation`: tambah/edit/hapus/urut/aktif (sudah ada, tidak diubah) |
| Footer | Hardcoded (belum CMS) |
| AnnouncementBar | Hardcoded |
| `/request-demo`, `/demo-expired`, `/auth/verify-magic-link` | Hardcoded (halaman fungsional) |
| Route detail lama (`/[slug]`, `/platform/*`, `/nova-ai/*`) | Tidak terjangkau (dialihkan) |

## 3. Hasil Pemeriksaan Prisma Studio

- Perintah: `npx prisma studio --port 5555 --browser none`
- **URL lokal: http://localhost:5555** (masih berjalan, hanya dapat diakses dari mesin ini)
- Database yang diperiksa: database development lokal `diagnova_v2` (container Docker `diagnova_db`). **Ini bukan database production/Vercel.**
- Data diperiksa secara read-only. Tidak ada data yang diubah demi kerapian.

### Jumlah record

| Tabel | Jumlah | Catatan |
|---|---|---|
| `cms_sections` (CmsSection) | 14 | Semua `isPublished = true`, `updatedBy` kosong |
| Menu | — | **Tidak ada tabel Menu.** 5 menu dan 25 submenu disimpan di `cms_sections` dengan key `navigation` |
| `roles` (Role) | 2 | ADMIN (2 user), USER (1 user) |
| `users` (User) | 3 | 2 ADMIN dengan password hash; 1 USER tanpa password; tidak ada user tanpa role |
| `demo_magic_links` (DemoMagicLink) | 1 | 1 aktif dan belum dipakai; tidak ada link tanpa user |
| `leads` | 1 | Tidak ada lead APPROVED tanpa user |
| `audit_logs` | 25 saat diperiksa (8 terkait CMS) | — |

### Daftar `sectionKey` dan isi `extraContent`

| sectionKey | Field teks | Isi `extraContent` |
|---|---|---|
| `hero` | badge/title/subtitle | `slides[3]` |
| `trusted_by` | ya | `partners[6]` |
| `about` | ya | `imageUrl`, `imageAlt` |
| `comparison` | ya | `items[6]`, `conventionalBadgeId/En`, `diagnovaBadgeId/En` |
| `workflow` | ya | `steps[4]` |
| `infrastructure` | ya | `cards[3]` |
| `testimonials` | ya | `items[4]`, `readMoreLabelId/En` (tidak dirender) |
| `cta` | ya | `buttonTextId/En`, `placeholderId/En` |
| `navigation` | — | `menus[5]` |
| `page_platform` | ya | `bannerUrl`, `submodules[4]` (tidak dirender) |
| `page_solutions` / `page_modules` / `page_integrations` | ya | `items[6]` / `items[5]` / `items[5]` (tidak dirender) |
| `page_nova_ai` | ya | `bannerUrl`, `disclaimer`, `workflowSteps[4]`, `sampleTranslations[4]` (tidak dirender) |

### Contoh struktur record (`about`)

```json
{
  "id": "cmwjzn…",
  "sectionKey": "about",
  "badgeId": "Tentang Diagnova", "badgeEn": "About Diagnova",
  "titleId": "Di Diagnova, Kami Mengubah Data Diagnostik …", "titleEn": "At Diagnova, We Transform …",
  "subtitleId": "Lebih dari sekadar LIS konvensional …", "subtitleEn": "More than a traditional LIS …",
  "extraContent": { "imageUrl": "string", "imageAlt": "string" },
  "isPublished": true, "updatedBy": null,
  "createdAt": "2026-11-17T01:03:05Z", "updatedAt": "2026-11-17T01:55:22Z"
}
```

### Contoh isi `extraContent` (`hero.slides[0]`)

```json
{
  "id": "hero-slide-1", "sortOrder": 1, "isActive": true,
  "badgeId": "Platform Intelijen Laboratorium Berbasis AI",
  "titleId": "Dari Hasil Uji Mentah Menjadi Keputusan Klinis",
  "subtitleId": "Sistem Informasi Laboratorium generasi baru …",
  "imageUrl": "/images/hero-bg-1.webp", "imageAlt": "Diagnova Laboratory Intelligence Specialist",
  "ctaPrimaryTextId": "Jadwalkan Demo", "ctaPrimaryUrl": "/request-demo",
  "ctaSecondaryTextId": "Jelajahi Modul", "ctaSecondaryUrl": "/modules"
}
```

(Setiap field `*Id` memiliki pasangan `*En`.)

### Relasi Menu dengan CmsSection

- **Tidak ada relasi database (foreign key).** Item menu memiliki field opsional `sectionKey` (bila diisi, URL menjadi `/#<sectionKey>`).
- Pada data aktual, **semua 30 item menu memiliki `sectionKey = null`** dan memakai URL atau anchor langsung, misalnya `/platform#automation`.
- Akibatnya, **14 dari 14 CmsSection tidak dirujuk oleh menu mana pun**. Ini wajar karena keterkaitannya lewat URL/anchor, bukan key.

### Data tanpa pasangan, duplikasi, dan data tidak terpakai

- **Tanpa pasangan:** tidak ada.
  - Tidak ada user tanpa role.
  - Tidak ada magic link tanpa user/lead.
  - Tidak ada lead APPROVED tanpa user.
  - Tidak ada `sectionKey` menu yang menunjuk ke section yang tidak ada.
- **Duplikasi:**
  - Tidak ada ID menu ganda.
  - URL ganda yang disengaja (menu induk dan submenu "Gambaran …"): `/platform`, `/nova-ai`, `/integration`.
  - Tidak ada ID item ganda di dalam array `extraContent`.
- **Data tidak terpakai** (dibiarkan, tidak dihapus):
  - `page_platform.bannerUrl` dan `.submodules`;
  - `page_nova_ai.bannerUrl`, `.disclaimer`, `.workflowSteps`, `.sampleTranslations`;
  - `page_solutions.items`, `page_modules.items`, `page_integrations.items`;
  - `testimonials.readMoreLabel*`;
  - `comparison.items[].impactMetric`;
  - `testimonials.items[].rating`.
  - CMS Hub kini menampilkan catatan jujur bahwa field-field ini belum tampil di website.

## 4. Struktur Aktual CmsSection dan Menu

```prisma
model CmsSection {
  id           String   @id @default(cuid())
  sectionKey   String   @unique @map("section_key") @db.VarChar(50)   // identifier/slug section
  badgeId      String?  @map("badge_id")      // teks bilingual (ID/EN)
  badgeEn      String?  @map("badge_en")
  titleId      String?  @map("title_id")
  titleEn      String?  @map("title_en")
  subtitleId   String?  @map("subtitle_id")
  subtitleEn   String?  @map("subtitle_en")
  extraContent Json?    @map("extra_content") // konten fleksibel per section (array item, gambar, menu, layout)
  isPublished  Boolean  @default(true) @map("is_published")
  updatedBy    String?  @map("updated_by") @db.VarChar(100)
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")
  @@map("cms_sections")
}
```

- **Soft delete / `isDelete`:** tidak ada.
  - Penghapusan item (slide, mitra, menu, dan lainnya) menghapus elemen dari array JSON.
  - Jejaknya tercatat di `audit_logs`.
- **Ordering:**
  - Item di dalam array memakai field `sortOrder`, dan aktif/nonaktif memakai `isActive`.
  - Tidak ada kolom urutan di tingkat baris. Urutan section halaman kini disimpan di baris `layout_<halaman>` (lihat §5).
- **Status:** `isPublished` per baris.
- **Metadata:** `updatedBy`, `createdAt`, `updatedAt`.
- **Menu:** JSON `navigation.extraContent.menus[]` dengan struktur:
  `{ id, labelId, labelEn, descriptionId, descriptionEn, url, sectionKey, iconName, iconColor?, sortOrder, isActive, submenus[] }`

## 5. Pengembangan CMS

### Desain (tanpa tabel baru, tanpa migrasi)

- **Penyimpanan:**
  - Satu baris `cms_sections` per halaman: `sectionKey = layout_home | layout_platform | layout_solutions | layout_modules | layout_nova_ai | layout_integration`.
  - Struktur `extraContent = { sections: [{ key, type: "builtin" | "custom", isActive, sortOrder, content? }] }`.
  - Baris ini **hanya dibuat ketika admin pertama kali menyimpan** tata letak. Sebelum itu halaman memakai urutan dan teks bawaan, sehingga tampilan tidak berubah.
- **Registry section** (`lib/cms-layout.ts`) memetakan setiap halaman: section bawaan, anchor menu, hero terkunci, dan teks header bawaan. Teks bawaan ditampilkan sebagai placeholder di editor.
- **Render publik** (`components/cms/CmsSectionList.tsx`):
  - Setiap section bawaan dibungkus `<CmsSlot id>`, lalu diurutkan dan difilter sesuai layout.
  - Section kustom dirender oleh `CmsCustomSection`.
  - Override teks hanya mengganti badge/judul/deskripsi. Visual dan desain tidak berubah.
  - Bila DB gagal, halaman tetap tampil dengan layout bawaan.
- **API admin:** `GET/PUT /api/admin/cms/layout`, khusus ADMIN (`requireAdmin` + middleware).
  - Validasi zod: key dikenal, batas panjang teks, maksimal 40 section.
  - URL hanya `/…`, `#…`, atau `http(s)://…`. `javascript:` dan `//host` ditolak.
  - Hero selalu aktif dan pertama.
  - Setiap perubahan dicatat di audit log (`CREATE/UPDATE_PAGE_LAYOUT`, `UPDATE_PAGE_HERO`) dan memicu `revalidatePath`.
- **Keamanan konten:** semua teks CMS dirender sebagai teks (tanpa `dangerouslySetInnerHTML`). Payload `<script>` terbukti ter-escape.

### Kemampuan admin (menu baru "Halaman & Section", `/admin/page-sections`)

- Memilih salah satu dari 6 halaman publik.
- Menaikkan atau menurunkan section, termasuk section kustom.
- Menampilkan atau menyembunyikan section. Muncul peringatan bila anchor section dipakai menu navigasi.
- Mengubah badge, judul, dan deskripsi (ID/EN) pada 20 section halaman dalam. Kolom kosong berarti teks bawaan.
- Menambah section kustom: badge, judul, deskripsi, gambar (upload dari perangkat lokal lewat endpoint upload yang sudah ada), teks alt, dan tombol CTA dengan URL.
- Mengedit hero Platform, Solusi, Modul, Nova AI, dan Integrasi. Editor hero Solusi, Modul, dan Integrasi sebelumnya tidak ada.

### Perbaikan pendukung

- Homepage menghormati `isPublished = false` per section.
- Item slide, mitra, perbandingan, dan testimoni diurutkan berdasarkan `sortOrder` saat dibaca.
- CTA penutup di 5 halaman dalam memakai section `cta` dari CMS. Isinya sama dengan teks bawaan saat ini, jadi tampilan tidak berubah.
- Editor testimoni mendapat input kutipan EN. Bila EN kosong, kutipan ID yang dipakai, sehingga tidak ada kutipan kosong.
- CMS Hub menampilkan catatan pada tab Platform, Solusi, Modul, Nova AI, dan Integrasi tentang field yang belum tampil di website.

### Kekurangan struktur saat ini & usulan schema (TIDAK diterapkan, perlu persetujuan)

Struktur CmsSection + JSON **memadai** untuk tata letak, teks header, dan section kustom. Kekurangannya:

1. Tidak ada riwayat versi/draft: perubahan langsung live. Audit log menyimpan nilai lama, tetapi belum ada UI untuk mengembalikannya.
2. Tidak ada penguncian konkuren: dua admin yang menyimpan JSON yang sama dapat saling menimpa.
3. `updatedBy` berisi ID user, bukan nama.

Usulan terpisah (memerlukan migrasi dan persetujuan):
- Kolom `version Int` untuk optimistic locking.
- Tabel `cms_section_revisions` untuk draft/rollback.

**Belum ada kebutuhan tabel baru per section.**

## 6. Fungsi Password pada Tambah Pengguna

Hasil penelusuran kode:

| Pertanyaan | Jawaban | Bukti |
|---|---|---|
| USER dapat login dengan email + password? | **Tidak.** Setelah password diverifikasi, non-admin ditolak (403 `LOGIN_DENIED_NON_ADMIN`). | `lib/controllers/auth.controller.ts` |
| USER hanya memakai Magic Link? | **Ya.** Magic Link dibuat saat lead disetujui (`approveLead` → `createDemoMagicLink`). Akun dengan email sama dipakai atau dibuat. | `lib/models/lead.model.ts`, `lib/magic-link.ts` |
| Password disimpan dengan hash aman? | Dulu bcrypt (cost 10). Password USER kini **tidak disimpan sama sekali** (`passwordHash = null`). | `lib/models/user.model.ts` |
| Password dipakai endpoint login? | Hanya untuk ADMIN. | `auth.controller.ts` |
| Mekanisme reset password? | **Tidak ada** (untuk role apa pun). | pencarian kode |

Keputusan berdasarkan alur yang benar-benar dipakai:

- Field "Password Akun" **dihapus** dari modal Tambah Pengguna. Penggantinya adalah penjelasan bahwa klien masuk lewat Magic Link dari menu Permohonan Demo.
- API `POST /api/admin/users`:
  - tidak lagi menerima atau menyimpan password (field `password` dari klien lama diabaikan);
  - pesan error 500 tidak lagi meneruskan pesan internal.
- Respons API tidak pernah berisi password atau hash. Ini sudah benar sebelumnya dan kini diuji.
- **Autentikasi ADMIN tidak diubah.**
- Data `passwordHash` yang sudah ada tidak diubah. Pada DB lokal, akun USER memang tidak memiliki hash.

Catatan mekanisme pembuatan akun: akun USER yang dibuat manual baru bisa login setelah ada **permohonan demo dengan email yang sama** yang disetujui admin. Approval memakai akun tersebut dan membuat Magic Link.

Selain itu, "Alokasi Voucher Demo" pada modal adalah durasi awal. Durasi yang dipilih saat approval akan menimpanya; ini sudah dijelaskan di modal.

**Rekomendasi (butuh keputusan bisnis):** tambahkan tombol "Kirim Magic Link" langsung dari Manajemen Pengguna untuk akun tanpa permohonan demo. Ini memerlukan aturan status lead yang belum ditentukan, sehingga tidak diimplementasikan.

## 7. Perubahan Konfigurasi Magic Link

### Masalah

- `lib/magic-link.ts` memakai `NEXT_PUBLIC_APP_URL || "http://localhost:3000"`.
- Variabel `NEXT_PUBLIC_*` ditanam saat build, dan fallback-nya localhost.
- Akibatnya, link WhatsApp dari production dapat mengarah ke localhost.

### Perbaikan

- `lib/app-url.ts` → `getAppBaseUrl()` / `buildMagicLinkUrl()`, dibaca saat runtime (server-side). Urutan sumber:
  1. `APP_URL`, misalnya `https://website-diagnova.vercel.app`;
  2. `NEXT_PUBLIC_APP_URL` (kompatibilitas);
  3. di Vercel bila keduanya kosong: `VERCEL_PROJECT_PRODUCTION_URL` (production) / `VERCEL_URL` (preview). Domain otomatis, tidak di-hardcode;
  4. `http://localhost:3000` **hanya** bila `NODE_ENV !== "production"`.
- **Production tidak pernah menghasilkan localhost.**
  - Bila hasilnya localhost/loopback, bukan https, atau kosong, `approveLead` menolak dengan **HTTP 503 sebelum ada perubahan data**: tidak ada token, akun, atau perubahan status.
  - `ALLOW_LOCALHOST_APP_URL=true` hanya untuk QA build production di mesin lokal, dan selalu diabaikan di Vercel.
- Link selalu `<origin>/auth/verify-magic-link?token=…`. Tombol WhatsApp memakai `magicLinkUrl` yang sama persis dari respons backend.
- Domain Vercel **tidak di-hardcode** di kode aplikasi. Domain hanya muncul di dokumentasi, contoh env, dan tes.
- Dokumentasi env: `.env.example` dan `.env.docker.example`.

### Konfigurasi yang dibutuhkan di Vercel (oleh pemilik proyek)

| Variabel | Nilai |
|---|---|
| `APP_URL` | `https://website-diagnova.vercel.app` |
| `DATABASE_URL` | Database yang **sama** dengan yang dipakai admin Vercel untuk approve. Token hanya valid di DB tempat ia dibuat. |
| `AUTH_SECRET` | String acak ≥ 32 karakter (wajib di production) |

### Status uji di Vercel: BLOCKED

Tugas ini melarang deployment. Pemeriksaan status HTTP publik menunjukkan **Vercel masih menjalankan kode lama**: `GET /api/lis/catalog` menghasilkan 500, bukan 401. Artinya hotfix LIS dan perbaikan ini belum ter-deploy.

Langkah uji setelah deployment disetujui:
1. Deploy branch yang sudah disetujui.
2. Set env di atas.
3. Ajukan demo di `https://website-diagnova.vercel.app/request-demo`.
4. Approve di `/admin/leads` pada domain yang sama.
5. Kirim lewat tombol WhatsApp.
6. Buka link dari perangkat lain, lalu klik "Masuk ke Demo".
7. Pastikan status menjadi Jadwal Demo dan masa aktif = durasi approval sejak login pertama.

Skenario yang sama sudah lulus secara lokal di build production dengan `APP_URL` = domain Vercel (§9).

## 8. File yang Diubah

**Baru**
- `lib/app-url.ts`: resolusi URL publik dan Magic Link.
- `lib/cms-layout.ts`: registry halaman/section, resolver layout, validasi URL.
- `lib/models/cms-layout.model.ts`: baca/simpan layout & hero, validasi zod, audit.
- `app/api/admin/cms/layout/route.ts`: API admin.
- `app/admin/(dashboard)/page-sections/page.tsx`: editor "Halaman & Section".
- `components/cms/CmsSectionList.tsx`, `components/cms/CmsCustomSection.tsx`
- `scripts/qa/cms-layout.test.mjs`, `scripts/qa/app-url.test.ts`, `scripts/qa/magic-link-misconfig.test.mjs`
- `docs/CMS_BACKEND_REVIEW.md` (laporan ini)

**Diubah**
- Magic Link:
  - `lib/magic-link.ts`
  - `lib/models/lead.model.ts` (cek URL sebelum approval, status 503)
  - `.env.example`, `.env.docker.example`
- Password USER:
  - `lib/models/user.model.ts`
  - `lib/validations.ts`
  - `app/api/admin/users/route.ts`
  - `app/admin/(dashboard)/users/page.tsx`
- CMS publik:
  - `app/(marketing)/page.tsx`
  - `app/(marketing)/{platform,solutions,modules,nova-ai,integration}/page.tsx`
  - kelima `*PageClient.tsx` (pembungkus slot + teks header; desain tidak berubah)
  - `lib/models/cms.model.ts` (urut `sortOrder`)
  - `components/sections/TestimonialsSection.tsx`
- Admin:
  - `components/admin/AdminSidebar.tsx`
  - `app/admin/(dashboard)/cms/page.tsx` (catatan publik + input kutipan EN)
- Tes:
  - `scripts/qa/admin.test.mjs`
  - `scripts/qa/demo-workflow.test.mjs` (assert domain link; tes tidak pernah memanggil domain eksternal)
  - `package.json` (`test:qa`, `test:app-url`)

Tidak ada perubahan pada `prisma/schema.prisma`, migration, modul LIS, atau data pasien.

## 9. Hasil Testing

| Pemeriksaan | Hasil |
|---|---|
| Prisma Studio | Berjalan di http://localhost:5555 (HTTP 200) |
| TypeScript (`tsc --noEmit`) | 0 error |
| ESLint (`next lint`) | 0 error, 125 warning (sebelumnya 121; +4 false positive `no-unused-vars` pada parameter tipe) |
| Production build (`next build`) | Sukses |
| QA API pada **build production** (`APP_URL=https://website-diagnova.vercel.app`) | **312/312 lulus** (rincian di bawah) |
| QA production salah konfigurasi (`APP_URL=http://localhost:3000`) | **7/7**: approval 503; tidak ada token, akun, atau perubahan status |
| Browser (Edge headless) pada build production | **34/34** (rincian di bawah) |
| Secret scan | 0 temuan HIGH |
| Data | Setelah seluruh tes: CmsSection 14, Role 2, User 3, Lead 1, DemoMagicLink 1 (sama dengan sebelum tes). Baris CMS lama identik. |

Rincian QA API 312/312:
- security 28
- demo-workflow 57, termasuk:
  - link memakai origin `APP_URL`;
  - path `/auth/verify-magic-link`;
  - bukan localhost.
- admin/users 25, termasuk:
  - password dari klien tidak disimpan;
  - tidak ada password atau hash di respons;
  - USER tidak bisa login password.
- cms 19
- lis 117
- cms-layout 43:
  - akses anon/USER/JWT palsu ditolak;
  - validasi URL berbahaya, XSS, dan key tidak dikenal;
  - urut, sembunyi, override teks, dan section kustom tampil di `/platform`;
  - hero `/solutions`;
  - FAQ homepage disembunyikan;
  - audit;
  - pemulihan data dan baris lama tidak berubah.
- app-url 23

Rincian browser 34/34:
- 6 halaman publik dirender tanpa error konsol.
- Baris layout tanpa `extraContent` tetap dirender normal.
- Editor admin:
  - 6 tab, hero terkunci;
  - urut, sembunyi, dan tambah section kustom berhasil, lalu tampil di `/platform`;
  - tampilan mobile tanpa overflow horizontal.
- Modal Tambah Pengguna: tanpa field password, berisi penjelasan Magic Link, akun tersimpan tanpa hash.
- Magic Link dibuka di konteks browser terpisah ("perangkat lain"):
  - login berhasil, status Jadwal Demo;
  - masa aktif 5 hari sesuai approval, dihitung sejak login pertama;
  - link tidak bisa dipakai dua kali;
  - sesi USER ditolak di API admin (403).

Menjalankan ulang: `npm run dev`, lalu `npm run test:qa` (hanya terhadap DB lokal).

## 10. Bagian yang Belum Selesai

| Item | Status | Alasan |
|---|---|---|
| Uji Magic Link di Vercel (WhatsApp, perangkat lain) | BLOCKED | Memerlukan deployment dan konfigurasi env Vercel, yang tidak diizinkan pada tugas ini |
| Vercel masih menjalankan kode lama (termasuk LIS tanpa proteksi) | BLOCKED | Perlu deployment yang disetujui |
| Isi kartu/visual di dalam section halaman dalam (bento, tabel, gantt, direktori analyzer) | PARTIAL | Teks header, urutan, dan visibilitas sudah CMS. Isi kartu masih JSX bawaan (lihat rekomendasi). |
| Footer, AnnouncementBar, FAQ | NOT STARTED | Belum CMS. Footer juga berisi link `/terms` (404) yang butuh keputusan konten. |
| Konten placeholder (testimoni institusi nyata, logo mitra, "Q2 2026") | BLOCKED | Keputusan bisnis/konten; tidak boleh dikarang |
| Data CMS tak terpakai (`bannerUrl`, `submodules`, item Solusi/Modul/Integrasi) | Dibiarkan | Tidak dihapus (larangan menghapus data). Sudah diberi catatan di admin. |
| Kirim Magic Link untuk akun USER tanpa permohonan demo | BLOCKED | Perlu aturan bisnis status lead |

## 11. Rekomendasi Pengembangan Berikutnya

1. **Deploy (setelah disetujui)** dengan env `APP_URL`, `DATABASE_URL`, dan `AUTH_SECRET`. Lalu jalankan checklist uji §7. Prioritas tertinggi, karena Vercel saat ini masih memakai kode lama yang tidak memproteksi LIS.
2. **Footer & FAQ ke CMS**, memakai pola JSON yang sama: `footer.extraContent.columns[]`, `faq.extraContent.items[]`, dengan teks saat ini sebagai bawaan. Sekalian perbaiki link `/terms` dan "Kebijakan Privasi" setelah halaman legalnya tersedia.
3. **Item kartu per section ke CMS**, bertahap, dimulai dari yang sudah berbentuk array data:
   - `ganttPhases` (Solusi › rollout);
   - kartu tier (Solusi › tiers);
   - kapabilitas Nova AI (workstation);
   - `analyzerCatalog` (Integrasi).
   Simpan di `layout_<page>.sections[].content.items`.
4. **Putuskan nasib data CMS lama yang tidak terpakai:** tampilkan di halaman, atau hapus setelah persetujuan.
5. **Draft/preview & riwayat versi CMS** (usulan schema §5), plus optimistic locking untuk mencegah dua admin saling menimpa.
6. **Metadata SEO per halaman** (title/description) untuk `/platform`, `/solutions`, `/modules`, `/nova-ai`, `/integration`. Saat ini semuanya memakai judul root. Bisa ditambahkan ke registry layout.
7. **Hapus kode mati** setelah disetujui:
   - route detail yang selalu dialihkan;
   - array `profiles`/`workflowPipeline` di Nova AI;
   - `modules`/`directoryItems` di Modul.
