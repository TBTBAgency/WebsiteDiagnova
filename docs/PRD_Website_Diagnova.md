# Product Requirements Document (PRD)
# Website Diagnova

| | |
|---|---|
| **Produk** | Website Corporate & Marketing Diagnova |
| **Tech Stack** | Next.js (Frontend) + Node.js (Backend/API) |
| **Versi Dokumen** | 1.0 |
| **Sumber Referensi** | Diagnova_Website_Content_Structure.pdf, Diagnova.pdf (Company Overview) |

---

## 1. Latar Belakang & Ringkasan Produk

Diagnova adalah **Laboratory Information System (LIS)** end-to-end yang menghubungkan mesin laboratorium (analyzer), petugas medis, dokter, dan sistem rumah sakit (SIMRS/HIS, RME, SATUSEHAT) dalam satu platform digital. Diagnova menjamin akurasi data, efisiensi operasional, dan kecepatan penyampaian hasil analisis klinis bagi Rumah Sakit & Klinis Modern.

Website ini dibutuhkan sebagai **kanal utama marketing & lead generation** untuk memperkenalkan Diagnova kepada calon customer (rumah sakit, klinik, laboratorium), menjelaskan cara kerja platform, keunggulannya dibanding LIS konvensional, dan mengarahkan mereka untuk melakukan **Request Demo**.

### 1.1 Tujuan Produk (Goals)
1. Menjelaskan Diagnova sebagai solusi LIS end-to-end secara cepat dan meyakinkan.
2. Mengedukasi calon pengguna tentang cara kerja platform (workflow, automation, reporting, analytics).
3. Menonjolkan diferensiator utama: **Nova AI** ("AI assists. Doctors decide.").
4. Menampilkan solusi berdasarkan jenis institusi (Hospital, Klinik, Patologi, Mikrobiologi, Bank Darah).
5. Menjelaskan integrasi dengan sistem eksisting (SIMRS/HIS, RME, Analyzer, SATUSEHAT).
6. Mengonversi pengunjung menjadi leads melalui halaman **Request Demo**.

### 1.2 Target Pengguna (Audience)
- Manajemen Rumah Sakit / Klinik (decision maker, non-teknis)
- Kepala/Staf Laboratorium (pengguna teknis, evaluator fitur)
- Tim IT Rumah Sakit (evaluasi integrasi & keamanan sistem)
- Tim procurement/pengadaan

---

## 2. Struktur Situs (Sitemap)

Berdasarkan dokumen struktur konten, website terdiri dari **8 menu utama**:

```
DIAGNOVA
├── HOME
├── PLATFORM
│   ├── Overview
│   ├── Workflow
│   ├── Automation
│   ├── Reporting
│   └── Analytics
├── SOLUTIONS
│   ├── Hospital Laboratory
│   ├── Clinical Laboratory
│   ├── Pathology
│   ├── Microbiology
│   ├── Blood Bank
│   └── Nova AI
├── MODULES
│   ├── Routine & Hematology
│   ├── Blood Bank
│   ├── Inventory & Reagent
│   ├── Pathology
│   └── Microbiology
├── NOVA AI
│   ├── Overview
│   ├── How It Works
│   └── AI + Doctor
├── INTEGRATION
│   ├── SIMRS / HIS
│   ├── RME
│   ├── Analyzer
│   ├── SATUSEHAT
│   └── Connectivity
└── REQUEST DEMO
```

---

## 3. Spesifikasi Halaman (Page-by-Page)

### 3.1 HOME
**Tujuan:** Landing page utama — menjelaskan Diagnova secara cepat dan mengarahkan user ke solusi/demo.

**Konten yang harus ada:**
- Hero section dengan headline: *"Apa Itu Diagnova"* / tagline utama: *"Solusi manajemen laboratorium medis end-to-end yang menjamin akurasi data, efisiensi operasional, dan kecepatan penyampaian hasil analisis klinis bagi Rumah Sakit & Klinis Modern"*
- CTA utama: **Request Demo**
- Ringkasan alur kerja "Perjalanan Setetes Darah di Laboratorium" (4 tahap): Penerimaan & Label → Pemisahan Darah → Cek Otomatis → Catat & Cek Ulang → Hasil siap dikirim ke Dokter
- Highlight 4 cara kerja Diagnova: Sistem Identifikasi Barcode, Mencatat Otomatis, Memberi Tanda Peringatan, Membantu Menerjemahkan (Nova AI)
- Preview singkat 5 Modul Utama
- Preview perbandingan **LIS Konvensional vs Diagnova** (6 poin masing-masing)
- Section navigasi ke Platform, Solutions, Modules, Nova AI, Integration

### 3.2 PLATFORM
**Tujuan:** Menjelaskan Diagnova sebagai end-to-end LIS, bagaimana platform bekerja dan bagaimana seluruh proses terhubung.
**Core message:** *"One platform to manage the entire laboratory workflow"*

| Sub-halaman | Konten |
|---|---|
| Overview | Gambaran umum platform sebagai "buku catatan super pintar" yang menghubungkan mesin lab dengan dokter |
| Workflow | Alur kerja end-to-end: penerimaan sampel → pemisahan → pemeriksaan otomatis → verifikasi → pengiriman hasil |
| Automation | 100% Otomatisasi & Barcode — direct analyzer interfacing & auto-verification (memangkas TAT hingga 70%) |
| Reporting | Full Digital Audit Trail — rekam jejak digital transparan untuk setiap perubahan hasil sampel |
| Analytics | Pemanfaatan data untuk insight operasional lab (mendukung fitur Nova AI) |

### 3.3 SOLUTIONS
**Tujuan:** Menjelaskan solusi berdasarkan jenis institusi/kebutuhan laboratorium.
**Core message:** *"Different laboratory needs, one connected Diagnova platform."*

Sub-halaman: Hospital Laboratory, Clinical Laboratory, Pathology, Microbiology, Blood Bank, Nova AI — masing-masing berupa halaman use-case yang memetakan modul relevan ke kebutuhan spesifik institusi tersebut.

### 3.4 MODULES
**Tujuan:** Menjelaskan produk/modul di dalam Diagnova secara lebih detail.
**Core message:** *"Modular system that can adapt to different laboratory operations."*

| Modul | Deskripsi |
|---|---|
| 1. Routine & Hematology | Pemeriksaan darah harian, urin, dan kimia klinik bervolume tinggi dengan workflow berkecepatan tinggi |
| 2. Blood Bank | Pengelolaan ketersediaan, masa kadaluarsa, crossmatching, dan distribusi kantong darah secara aman |
| 3. Inventory & Reagent | Pemantauan stok reagen medis laboratorium secara real-time guna mencegah kehabisan bahan habis pakai |
| 4. Pathology | Pencatatan pemeriksaan jaringan tubuh dan sitologi berbasis mikroskopis dengan tracking spesimen ketat |
| 5. Microbiology | Identifikasi kuman, kultur bakteri, dan uji sensitivitas antibiotik untuk terapi medis yang tepat sasaran |

### 3.5 NOVA AI
**Tujuan:** Menjelaskan Nova AI sebagai intelligent assistant dan salah satu diferensiator utama Diagnova.
**Core message:** *"AI assists. Doctors decide."*

| Sub-halaman | Konten |
|---|---|
| Overview | Nova AI mengubah angka medis rumit menjadi kalimat sederhana yang mudah dipahami (mis. hasil lab Hb, Gula Darah, Sel Darah Putih diterjemahkan ke bahasa awam beserta status Rendah/Tinggi/Normal) |
| How It Works | 4 tahapan cara kerja: **Membaca Pola** (belajar dari ribuan hasil sebelumnya) → **Menerjemahkan Angka** (jadi kalimat mudah dimengerti) → **Memberitahu Lebih Cepat** (alert dini ke dokter) → **Selalu Dicek Dokter** (validasi final oleh dokter) |
| AI + Doctor | Penegasan bahwa Nova AI hanya membantu merangkum; keputusan pengobatan **100% ditentukan oleh dokter** (disclaimer penting yang harus ditampilkan jelas) |

> **Catatan penting untuk konten & compliance:** Setiap halaman Nova AI wajib menampilkan disclaimer medis yang jelas: *"Nova AI hanya bertugas membantu merangkum. Keputusan pengobatan tetap 100% ditentukan oleh Dokter."*

### 3.6 INTEGRATION
**Tujuan:** Menjelaskan bagaimana Diagnova terhubung dengan sistem rumah sakit, rekam medis, dan instrumen laboratorium.
**Core message:** *"Connect Diagnova with the systems and instruments your laboratory already uses."*

| Sub-halaman | Konten |
|---|---|
| SIMRS / HIS | Seamless Native Integration — bridging otomatis dengan SIMRS |
| RME | Integrasi dengan Rekam Medis Elektronik |
| Analyzer | Direct analyzer interfacing, kompatibel dengan 500+ instrumen medis |
| SATUSEHAT | Kesiapan integrasi dengan platform SATUSEHAT (Kemenkes) |
| Connectivity | Smart Gateway Resilient — protokol HL7/ASTM dengan Offline-Buffer Mode, uptime 99.9% |

### 3.7 REQUEST DEMO
**Tujuan:** Conversion page untuk calon customer yang ingin mengetahui/mencoba Diagnova.
**Core message:** *"See how Diagnova can work for your laboratory."*

**Elemen wajib:**
- Form request demo (Nama, Institusi, Jabatan, Email, No. Telepon, Jenis Institusi [Rumah Sakit/Klinik/Lab], Kebutuhan/Catatan)
- Informasi kontak: email `hello@tibatibagency.com`, telepon `0819 9107 0928`
- Trust signal/social proof (opsional, jika tersedia data klien)
- CTA sekunder: "Konsultasi Integrasi LIS"

---

## 4. Konten Pendukung — Perbandingan LIS vs Diagnova

Section ini penting sebagai **conversion driver**, direkomendasikan tampil di Home dan/atau Platform Overview.

| # | Kekurangan LIS Konvensional di Indonesia | Keunggulan Diagnova |
|---|---|---|
| 1 | Integrasi Terbatas — terisolasi dari HMIS/RME, memicu duplikasi input data pasien | Seamless Native Integration — bridging otomatis dengan SIMRS, RME & siap terhubung SATUSEHAT |
| 2 | Ketergantungan Input Manual — proses registrasi & entry ketik manual, risiko human error & TAT lambat | 100% Otomatisasi & Barcode — direct analyzer interfacing & auto-verification, memangkas TAT 70% |
| 3 | Infrastruktur & Koneksi Rentan — koneksi analyzer sering terputus, downtime tinggi | Smart Gateway Resilient — protokol HL7/ASTM dengan Offline-Buffer Mode, uptime 99.9% |
| 4 | Dukungan IT & SDM Lemah — support teknis lambat, kompetensi bervariasi | SLA Dedicated 24/7 & UX Intuitif — pendampingan teknis responsif |
| 5 | Audit Trail & Pelaporan Minim — riwayat medis tidak lengkap | Full Digital Audit Trail — rekam jejak digital transparan |
| 6 | Biaya High-CapEx & Lock-in — instalasi awal mahal, kontrak kaku | Skema Fleksibel & Universal — model SaaS terjangkau, kompatibel dengan 500+ instrumen medis |

---

## 5. Persyaratan Fungsional (Functional Requirements)

| ID | Requirement | Prioritas |
|---|---|---|
| FR-01 | Navigasi utama (navbar) menampilkan 7 menu + dropdown untuk Platform, Solutions, Modules, Nova AI, Integration | Must |
| FR-02 | Setiap halaman dengan sub-menu memiliki side navigation atau tab untuk berpindah antar sub-halaman | Must |
| FR-03 | Form Request Demo terkoneksi ke backend (Node.js API) yang menyimpan lead ke database dan/atau mengirim notifikasi email | Must |
| FR-04 | Validasi form (client & server side) — email format, nomor telepon, field wajib | Must |
| FR-05 | Integrasi dengan email service (mis. Resend/SendGrid/Nodemailer) untuk notifikasi lead baru ke tim sales | Must |
| FR-06 | CMS-ready content (opsional) — struktur data konten modular agar mudah diupdate tanpa deploy ulang | Should |
| FR-07 | SEO metadata dinamis per halaman (title, description, OG image) menggunakan Next.js Metadata API | Must |
| FR-08 | Analytics tracking (Google Analytics / Meta Pixel) untuk tracking funnel Home → Solutions/Platform → Request Demo | Should |
| FR-09 | Sitemap.xml & robots.txt otomatis | Must |
| FR-10 | Halaman kontak/footer menampilkan email `hello@tibatibagency.com` dan telepon `0819 9107 0928` | Must |
| FR-11 | Komponen reusable: Hero Section, Feature Card, Comparison Table (LIS vs Diagnova), Process Timeline (4 tahap), CTA Banner | Must |
| FR-12 | Disclaimer medis pada seluruh section terkait Nova AI | Must |

---

## 6. Persyaratan Non-Fungsional

| Kategori | Requirement |
|---|---|
| **Performance** | Lighthouse score ≥ 90 (Performance, Accessibility, SEO); gunakan Next.js Image Optimization, lazy loading, SSG/ISR untuk halaman statis |
| **Responsiveness** | Fully responsive (mobile-first): mobile, tablet, desktop |
| **Browser Support** | Chrome, Safari, Firefox, Edge (2 versi terakhir) |
| **Keamanan** | HTTPS wajib, rate limiting pada API form submission, sanitasi input (anti XSS/SQL Injection), CORS policy jelas |
| **Skalabilitas** | Backend Node.js/API routes dirancang stateless agar mudah di-scale (mis. deploy di Vercel/serverless atau container) |
| **Aksesibilitas** | Kontras warna memadai (brand color biru Diagnova), alt text untuk gambar, navigasi keyboard-friendly |
| **Localization** | Bahasa Indonesia sebagai bahasa utama (opsional dukungan Bahasa Inggris di masa depan) |

---

## 7. Rekomendasi Arsitektur Teknis

### 7.1 Frontend — Next.js
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS (mendukung desain modular & konsisten dengan brand biru Diagnova)
- **Rendering strategy:**
  - Halaman statis (Home, Platform, Solutions, Modules, Nova AI, Integration) → **SSG (Static Site Generation)** untuk performa & SEO optimal
  - Halaman Request Demo → **Client-side form + API Route** untuk submission
- **Struktur folder (contoh):**
  ```
  /app
    /page.tsx                 → Home
    /platform/page.tsx        → Platform Overview
    /platform/workflow/page.tsx
    /platform/automation/page.tsx
    /platform/reporting/page.tsx
    /platform/analytics/page.tsx
    /solutions/[slug]/page.tsx
    /modules/[slug]/page.tsx
    /nova-ai/page.tsx
    /nova-ai/how-it-works/page.tsx
    /nova-ai/ai-doctor/page.tsx
    /integration/[slug]/page.tsx
    /request-demo/page.tsx
    /api/request-demo/route.ts  → Node.js API handler
  /components
    Hero.tsx, FeatureCard.tsx, ComparisonTable.tsx, ProcessTimeline.tsx, CTASection.tsx, Navbar.tsx, Footer.tsx
  /content
    (data JSON/MD untuk tiap modul, solusi, integrasi agar mudah dikelola)
  ```

### 7.2 Backend — Node.js
- API Routes (built-in Next.js) atau backend Node.js terpisah (Express/Fastify) jika dibutuhkan skala lebih besar
- Endpoint utama: `POST /api/request-demo` → validasi → simpan ke database → trigger email notifikasi
- **Database rekomendasi:** PostgreSQL (mis. via Supabase/Neon) atau MongoDB untuk penyimpanan leads
- **Email service:** Nodemailer / Resend / SendGrid

### 7.3 Deployment
- **Hosting rekomendasi:** Vercel (native support Next.js, otomatis CI/CD)
- **Domain & SSL:** custom domain dengan HTTPS otomatis

---

## 8. Panduan Desain (Design Guidelines)

Berdasarkan materi brand yang ada:
- **Warna utama:** Biru navy (#0A2472-ish) & biru terang sebagai aksen, putih sebagai background
- **Tipografi:** Bold, tegas untuk headline (mengikuti gaya "Apa Itu Diagnova", "Di Sinilah Diagnova Bekerja!")
- **Gaya visual:** Kombinasi foto laboratorium nyata (overlay biru gradient) dengan ikon flat/outline untuk fitur & proses
- **Komponen visual kunci:**
  - Timeline horizontal 4 tahap (icon + label + deskripsi) — dipakai di Home & Platform/Workflow
  - Card 2 kolom untuk perbandingan LIS vs Diagnova (list bernomor 01–06)
  - Tabel untuk contoh output Nova AI (Hasil Lab, Status, Penjelasan)

---

## 9. Metrik Keberhasilan (Success Metrics)

| Metrik | Target |
|---|---|
| Conversion rate ke Request Demo | ditentukan bersama tim marketing (baseline awal) |
| Bounce rate halaman Home | < 50% |
| Page load time (LCP) | < 2.5 detik |
| Jumlah leads per bulan | ditentukan bersama tim marketing |
| Lighthouse SEO score | ≥ 90 |

---

## 10. Roadmap Pengembangan (Usulan Fase)

| Fase | Cakupan |
|---|---|
| **Fase 1 — Foundation** | Setup project Next.js + Node.js, desain sistem komponen (Navbar, Footer, Hero, Card), halaman Home |
| **Fase 2 — Core Pages** | Platform, Solutions, Modules (statis, konten dari dokumen ini) |
| **Fase 3 — Nova AI & Integration** | Halaman Nova AI (dengan disclaimer), halaman Integration |
| **Fase 4 — Conversion** | Request Demo form + backend API + email notification + validasi |
| **Fase 5 — Optimasi** | SEO, analytics, performance tuning, testing lintas device |
| **Fase 6 — Launch** | QA final, deployment produksi, monitoring |

---

## 11. Open Questions / Perlu Klarifikasi dari Tim Diagnova

1. Apakah dibutuhkan CMS (mis. Sanity/Contentful) agar tim non-teknis bisa update konten, atau konten cukup di-hardcode/JSON?
2. Apakah ada aset visual final (logo resmi, foto produk, screenshot dashboard) di luar yang ada di dokumen pitch deck?
3. Apakah dibutuhkan multi-bahasa (ID/EN)?
4. Kemana data lead dari form Request Demo harus terintegrasi (CRM tertentu, Google Sheet, email saja)?
5. Apakah dibutuhkan halaman tambahan seperti Blog/Resources, Karir, atau Tentang Kami yang belum tercakup di struktur saat ini?
