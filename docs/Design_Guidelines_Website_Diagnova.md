# Design Guidelines
# Website Diagnova

| | |
|---|---|
| **Produk** | Website Corporate & Marketing Diagnova |
| **Sumber Referensi** | DIAGNOVA_BRAND_GUIDELINE.pdf, Homepage Design Preview (1790070830426_Home.jpg) |
| **Terkait Dokumen** | PRD_Website_Diagnova.md |
| **Versi Dokumen** | 1.0 |

---

## 1. Brand Foundation

### 1.1 Brand Essence
**DIAGNOVA = Diagnosis + Nova**
- **Diagnosis** → tujuan fundamental laboratorium medis: mengubah bukti biologis menjadi informasi klinis yang bermakna.
- **Nova** → awal baru, penemuan, kecemerlangan, transformasi.

> Diagnova bukan sekadar Laboratory Information System — ini adalah **ekosistem laboratorium cerdas** yang menghubungkan orang, spesimen, instrumen, alur kerja, dan informasi klinis.

### 1.2 Brand Philosophy
**"From Data to Decision"**

```
DATA → INTELLIGENCE → INSIGHT → DECISION
```

- **Vision:** Menjadi fondasi cerdas bagi kedokteran laboratorium modern.
- **Mission:** Memberdayakan laboratorium dengan teknologi cerdas yang mengubah data diagnostik kompleks menjadi insight yang jelas dan actionable.

### 1.3 Brand Positioning
**"AI-Powered Laboratory Intelligence Platform"** — *Intelligent Laboratory Information System*

Brand Promise — **"From Results to Intelligence"**

| Dari | Menjadi |
|---|---|
| Manual | Intelligent |
| Disconnected | Connected |
| Reactive | Proactive |
| Data | Insight |
| Information | Intelligence |

### 1.4 Brand Personality
**"Intelligent by Nature. Human by Design"**

| Trait | Makna |
|---|---|
| **Intelligent** | Sophisticated tanpa rumit |
| **Precise** | Scientific, akurat, terpercaya |
| **Human** | Teknologi membantu profesional, bukan menggantikan |
| **Progressive** | Selalu mendorong laboratorium medis ke depan |
| **Calm** | Mengurangi cognitive overload |
| **Confident** | Jelas & kredibel tanpa klaim berlebihan |

**Nada gabungan:** Clinical + Human · Advanced + Simple · Modern + Credible · Professional + Friendly

### 1.5 Core Values

| # | Nilai | Prinsip |
|---|---|---|
| 01 | **Precision** | Presisi bukan fitur, tapi tanggung jawab — setiap spesimen, pengukuran, dan hasil penting |
| 02 | **Intelligence** | Data menjadi kuat ketika kecerdasan memberi makna |
| 03 | **Connection** | Diagnova menghubungkan: Patient → Specimen → Instrument → Laboratory → Clinician → Decision |
| 04 | **Trust** | Transparan, aman, dan akuntabel — setiap hasil layak mendapat kepercayaan |
| 05 | **Progress** | Laboratorium hari ini harus siap untuk kedokteran masa depan |

### 1.6 Brand Architecture

| Sub-brand | Fungsi | Cakupan |
|---|---|---|
| **Diagnova Core** | LIS — jantung operasional laboratorium | Sistem operasional inti |
| **Diagnova AI** | AI-Powered Laboratory Intelligence | Result summarization, trend analysis, abnormal detection, delta checks, quality intelligence, workflow assistance, natural-language queries, operational recommendations |
| **Diagnova Flow** | Satu alur kerja, tanpa kompleksitas berlebih | Specimen collection → Accessioning → Processing → Analysis → Validation → Reporting |
| **Diagnova Insight** | Melihat lebih dari sekadar angka | TAT analytics, productivity, workload, quality indicators, specimen trends, department performance |
| **Diagnova Connect** | Satu laboratorium yang terhubung | Laboratory instruments, HIS, EMR, hospital systems, clinicians, external laboratories |

### 1.7 Meet Nova (AI Persona)
Nova adalah **"intelligent laboratory copilot"** yang membantu profesional memahami informasi lebih cepat dan bekerja dengan lebih percaya diri.

**Alur kerja Nova:** `Observe → Understand → Explain → Assist`

**Kepribadian Nova:** Professional · Concise · Evidence-Oriented · Transparent · Supportive · Cautious

> ⚠️ **Wajib ditegaskan di seluruh konten terkait Nova AI:** Nova membantu merangkum & menjelaskan, namun **keputusan medis tetap 100% di tangan dokter**.

---

## 2. Logo

### 2.1 Makna Logo
Logo Diagnova merepresentasikan hubungan antara **sains, data, dan layanan kesehatan cerdas**. Simbol menggabungkan bentuk terinspirasi DNA dengan ekspresi digital modern, merepresentasikan: **Life · Data · Science · Innovation**.

| Elemen | Makna |
|---|---|
| DNA | Life, Data, Science |
| Letter D | Diagnova |
| Letter Λ (A) | Forward, Progress |
| Diagnova Mark | Identity |

**Karakter logo:** Modern · Minimal · Scientific · Digital · Dynamic

### 2.2 Varian Logo & Penggunaan

| Varian | Kegunaan |
|---|---|
| **Brand Mark** (simbol DNA saja) | App icon, favicon, ukuran kecil, avatar sosial media |
| **Word Mark** (teks "DIAGNOVA" saja) | App icon, favicon, ukuran kecil, avatar sosial media |
| **Horizontal Lock-up** (simbol + teks) | **Logo utama** — digunakan di sebagian besar aplikasi brand (navbar website, header dokumen, dsb.) |

**Aturan konsistensi:** Logo harus tampil bersih & konsisten di seluruh Digital Platforms, Software, Presentations, Marketing, Social Media, dan Product Interfaces.

**Implementasi di website:**
- Navbar: gunakan Horizontal Lock-up (seperti terlihat di preview: "§DIAGNOVA" pojok kiri atas)
- Favicon: gunakan Brand Mark (simbol DNA)
- Footer: Horizontal Lock-up versi putih/light di atas background biru gelap

---

## 3. Color System

### 3.1 Primary Colors

| Warna | Hex | Nama | Asosiasi |
|---|---|---|---|
| 🔵 | `#345DAB` | **Diagnova Blue** | Trust · Science · Intelligence · Stability |
| 🔷 | `#56ADE2` | **Nova Blue** | Technology · Connectivity · Progress · Innovation |

### 3.2 Secondary Colors

| Warna | Hex | Kegunaan |
|---|---|---|
| ⬜ | `#CAE2F1` | Background tint, section pembeda, badge/pill background |
| ⬜ | `#FFFFFF` | Background utama, teks di atas background gelap |
| ⬛ | `#000000` | Teks/aksen (gunakan terbatas — brand lebih condong ke biru navy daripada hitam pekat) |

### 3.3 Color Gradient
**Diagnova Blue → Nova Blue**

Gradient ini merepresentasikan transisi filosofi brand: **Data → Intelligence → Insight**

Gunakan gradient ini untuk:
- Background hero section
- Background section "How It Works" / DNA visual
- CTA button (opsional, hover state)
- Ilustrasi/ikon utama (DNA helix, dsb.)

```css
:root {
  --diagnova-blue: #345DAB;
  --nova-blue: #56ADE2;
  --diagnova-light: #CAE2F1;
  --diagnova-white: #FFFFFF;
  --diagnova-black: #000000;
  --diagnova-gradient: linear-gradient(135deg, #345DAB 0%, #56ADE2 100%);
}
```

### 3.4 Catatan Penggunaan Warna (berdasarkan preview homepage)
- **Hero section:** background gradient biru gelap dengan overlay foto (dokter/analis lab), teks putih
- **Section "About" / komparasi:** background putih dengan aksen biru untuk heading & badge label
- **Section "How It Works":** background gradient biru penuh (dark blue → medium blue) dengan visual DNA helix 3D berwarna biru muda sebagai centerpiece
- **Card/box komparasi ("Disconnected→Connected", dsb.):** background biru solid dengan teks putih, kontras dengan card di sebelahnya yang berwarna abu-abu terang
- **Footer:** background biru navy gelap (hampir mendekati primary blue tergelap) dengan teks putih/abu muda

---

## 4. Typography

### 4.1 Font Pairing

| Peran | Font | Karakter |
|---|---|---|
| **Display / Heading** | **Mokoto** | Bold, geometris, sedikit futuristik — dipakai untuk headline besar (H1/H2) |
| **Body Text** | **Inter** | Clean, humanis, sangat mudah dibaca di berbagai ukuran layar — dipakai untuk paragraf, label, UI text |

> ⚠️ **Catatan implementasi web:** Font "Mokoto" kemungkinan bukan font Google Fonts standar/webfont gratis. Perlu dikonfirmasi lisensi & ketersediaan file font (WOFF/WOFF2) dari tim brand. Jika tidak tersedia untuk web, siapkan fallback font display yang serupa (bold, geometric sans-serif) seperti **"Space Grotesk"**, **"Sora"**, atau **"Manrope Bold"**. Inter tersedia gratis di Google Fonts dan aman digunakan langsung.

```css
:root {
  --font-display: 'Mokoto', 'Sora', 'Space Grotesk', sans-serif; /* fallback jika Mokoto tidak tersedia untuk web */
  --font-body: 'Inter', -apple-system, sans-serif;
}
```

### 4.2 Type Scale (rekomendasi untuk web, berdasar preview)

| Elemen | Font | Ukuran (desktop) | Weight |
|---|---|---|---|
| H1 (Hero headline) | Display | 48–56px | Bold/ExtraBold |
| H2 (Section title) | Display | 32–36px | Bold |
| H3 (Card/sub title) | Display | 20–24px | Bold/SemiBold |
| Body Large (intro paragraf) | Body | 16–18px | Regular |
| Body (paragraf umum) | Body | 14–16px | Regular |
| Label/Badge/Eyebrow | Body | 12–13px | Medium, uppercase/letter-spacing |
| Button text | Body | 14–15px | SemiBold |

### 4.3 Visual Principles Terkait Tipografi
- **Scientific Precision** — layout terstruktur, tipografi bersih, grid yang rapi
- **Digital Intelligence** — visualisasi data & gradient halus mendukung teks
- **Human Healthcare** — bentuk lembut, spacing tenang (generous whitespace)
- **Discovery** — elemen visual gradient, cahaya, dan progresif

---

## 5. Iconography & Photography

### 5.1 Iconography
**Gaya:** Minimal · Rounded · Geometric

- Gunakan icon set dengan stroke tipis-medium, sudut membulat (rounded corners), tanpa detail berlebihan.
- Rekomendasi library: **Lucide Icons** (rounded, konsisten, open-source) sebagai basis, dikustom warna sesuai palet Diagnova Blue/Nova Blue.
- Icon dipakai konsisten untuk: proses/workflow (barcode, gear/chip, lightbulb — seperti terlihat di preview section "Comparison"), infrastruktur (link/chain, automation, integration).

### 5.2 Photography
**Gaya:** Clinical + Human + Technological

**Fokus subjek:**
- Profesional laboratorium (analis, dokter) sedang bekerja dengan instrumen modern
- Alur kerja digital & kolaborasi tim
- Overlay warna biru (duotone/gradient blue overlay) di atas foto untuk menjaga konsistensi brand — **terlihat jelas di hero section preview** (foto dokter dengan mikroskop diberi overlay gradient biru gelap-terang)

**Treatment foto untuk web:**
```css
.hero-image-overlay {
  background: linear-gradient(135deg, rgba(52,93,171,0.85) 0%, rgba(86,173,226,0.55) 100%);
  mix-blend-mode: multiply; /* atau overlay, sesuaikan hasil visual */
}
```

### 5.3 UI Principles
Interface Diagnova harus terasa seperti **"clinical command center"** — tenang namun canggih (*Clinical Calm*).

| Prinsip | Penerapan di Website |
|---|---|
| **Information Hierarchy** | Prioritaskan informasi kritis (headline besar, CTA menonjol, data pendukung di bawah) |
| **Progressive Disclosure** | Tampilkan kompleksitas hanya saat dibutuhkan (mis. sub-menu dropdown, accordion untuk detail modul) |
| **Intelligent Defaults** | Minim input manual — mis. form Request Demo ringkas dengan field esensial saja |
| **Contextual Intelligence** | Elemen "Nova AI" ditampilkan di tempat yang relevan/kontekstual, bukan dipaksakan di semua halaman |
| **Explainability** | Setiap klaim AI (Nova) disertai penjelasan yang bisa dipahami, bukan black-box |

---

## 6. Analisis Layout — Homepage Preview

Berdasarkan gambar preview desain, berikut breakdown struktur & pola desain yang digunakan (menjadi acuan komponen untuk halaman lain):

### 6.1 Struktur Section Homepage

| # | Section | Deskripsi Visual |
|---|---|---|
| 1 | **Navbar** | Logo kiri, menu horizontal tengah (Platform, Solutions, Modules, Nova AI, Integration), language switcher (ID/EN), tombol CTA "Request Demo" (pill button, biru) di kanan |
| 2 | **Hero** | Background foto lab dengan overlay gradient biru gelap, badge "AI-Powered Laboratory Intelligence Platform", headline besar "From Results To Intelligence", sub-copy 2 baris, 2 tombol CTA (primary "Schedule Demo" solid putih, secondary "Explore Modules" outline) |
| 3 | **Trusted By** | Baris logo klien/partner (placeholder), background putih, teks kecil abu-abu |
| 4 | **About** | Layout 2 kolom: visual DNA helix biru di kiri, teks "About" badge + heading + paragraf di kanan |
| 5 | **Comparison** | Heading + intro, lalu 3 card horizontal (background gradient biru → abu muda) berisi transformasi: Disconnected→Connected, Manual→Intelligent, Data→Decision, masing-masing dengan icon dan deskripsi singkat |
| 6 | **How It Works** | Full-width background gradient biru gelap, judul "How Diagnova Guides a Drop of Blood", 4 poin proses (01–04) diletakkan mengelilingi visual DNA helix 3D besar sebagai centerpiece |
| 7 | **Infrastructure** | Layout 2 kolom: heading + label "Infrastructure" di kiri, 3 accordion/card list di kanan (100% Automation, Seamless Integration, Nova AI Assistant) dengan garis vertikal timeline penghubung |
| 8 | **CTA Banner (bottom)** | Background gradient biru, headline "Transform Your Laboratory with Diagnova", input email + tombol "Request Demo", didukung visual laptop mockup dengan UI produk |
| 9 | **Footer** | Background biru navy gelap, logo kiri, 4 kolom menu (kemungkinan representasi placeholder berulang di preview), copyright & legal links, watermark logo "DIAGNOVA" raksasa transparan di paling bawah |

### 6.2 Pola Desain Kunci yang Perlu Direplikasi

1. **Eyebrow Label / Badge** — teks kecil dalam pill/badge (contoh: "About", "Comparison", "How It Works", "Infrastructure") selalu muncul di atas setiap heading section sebagai penanda kategori konten. *Komponen reusable: `<SectionBadge>`.*
2. **Dual CTA Pattern** — kombinasi tombol primary (solid) + secondary (outline/ghost) muncul konsisten di Hero dan section akhir.
3. **DNA Helix sebagai Visual Signature** — motif DNA 3D digunakan berulang (About section & How It Works section) sebagai elemen visual khas brand, merepresentasikan "Diagnosis + Nova".
4. **Alternating Background Rhythm** — pola bergantian antara section background putih/terang dan section background biru gelap, menciptakan ritme visual saat scroll (putih → putih → biru gelap → putih → biru gelap).
5. **Numbered Process Steps (01–04)** — pola penomoran dipakai di dua tempat berbeda (Comparison-style card & How It Works), konsisten sebagai identitas "step-by-step clarity".
6. **Product Mockup dalam Device Frame** — CTA banner bawah menampilkan preview UI produk dalam frame laptop, membangun kredibilitas produk sekaligus estetika modern.
7. **Watermark Logo Raksasa di Footer** — elemen dekoratif branding yang kuat, memperkuat brand recall di akhir halaman.

### 6.3 Rekomendasi Komponen Reusable (Next.js)

```
/components
  Navbar.tsx              → dengan dropdown menu & language switcher
  Hero.tsx                → props: badge, title, subtitle, primaryCTA, secondaryCTA, bgImage
  SectionBadge.tsx         → eyebrow label pill
  TrustedByBar.tsx         → logo carousel/grid
  DNAHelixVisual.tsx        → SVG/3D visual DNA, reusable di beberapa section
  ComparisonCard.tsx       → card gradient biru dengan icon + judul + deskripsi
  ProcessStepCard.tsx      → card bernomor (01, 02, 03...) untuk workflow
  InfrastructureAccordion.tsx → list item dengan garis vertikal timeline
  CTABanner.tsx            → banner akhir dengan input email + tombol + device mockup
  Footer.tsx               → dengan watermark logo besar
```

---

## 7. Prinsip Voice & Tone (Copywriting)

Selaras dengan Brand Personality (*Intelligent by Nature, Human by Design*):

| Lakukan | Hindari |
|---|---|
| Kalimat jelas, langsung, berbasis fakta | Klaim berlebihan/hype tanpa dasar |
| Istilah teknis dijelaskan sederhana (seperti pendekatan Nova AI menerjemahkan angka medis) | Jargon medis tanpa konteks bagi audiens non-teknis |
| Nada tenang & percaya diri | Nada memaksa/high-pressure sales |
| Selalu tegaskan peran manusia (dokter) sebagai pengambil keputusan akhir | Mengimplikasikan AI menggantikan keputusan dokter |

**Contoh tone headline (dari brand guideline):**
- "From Results to Intelligence"
- "A New Era of Diagnosis"
- "It makes laboratory information intelligent."

---

## 8. Checklist Konsistensi Brand untuk Developer

- [ ] Gunakan hanya 2 warna primary (`#345DAB`, `#56ADE2`) + palet sekunder yang ditentukan — hindari menambah warna baru di luar sistem ini
- [ ] Semua heading besar menggunakan font Display (Mokoto/fallback), body text menggunakan Inter
- [ ] Setiap section (kecuali hero/footer) memiliki eyebrow badge label sebelum heading
- [ ] Foto profesional lab selalu diberi overlay gradient biru sesuai brand
- [ ] Icon menggunakan gaya rounded/minimal/geometric — konsisten satu set icon library di seluruh situs
- [ ] Setiap penyebutan Nova AI disertai penegasan "keputusan tetap di tangan dokter"
- [ ] Logo horizontal lock-up dipakai di navbar & footer; brand mark dipakai di favicon
- [ ] Pertahankan whitespace generous (*calm spacing*) — hindari layout padat/sesak
- [ ] Motif DNA helix digunakan sebagai elemen visual signature, bukan hanya di logo tapi juga di section storytelling

---

## 9. Open Questions

1. Apakah font **Mokoto** tersedia dalam format web (WOFF2) dengan lisensi resmi, atau perlu dicari font pengganti untuk implementasi web?
2. Apakah ada asset 3D DNA helix (model/animasi) yang bisa digunakan langsung, atau perlu dibuat versi web-optimized (SVG animasi/Lottie/Three.js)?
3. Apakah palet warna perlu varian dark mode, mengingat sebagian besar section sudah didesain dengan background gelap secara default?
4. Apakah logo klien di section "Trusted By" pada preview adalah placeholder, dan apakah sudah ada daftar klien real yang boleh ditampilkan?
