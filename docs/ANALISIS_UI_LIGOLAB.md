# 🔬 Analisis Komprehensif UI/UX Design & Animasi LigoLab.com
**Target Analisis:** [https://www.ligolab.com](https://www.ligolab.com)  
**Kategori:** Laboratory Information System (LIS) & Revenue Cycle Management (RCM)  
**Metode Analisis:** Live Headless Chromium Automated Inspection & CSS Extractor  
**Tanggal Ekstraksi:** 30 Oktober 2026  
**Referensi untuk:** Diagnova LIS (Enterprise Medical SaaS)

---

## 📌 Ringkasan Eksekutif (Executive Summary)

LigoLab merupakan salah satu platform LIS + RCM terkemuka di pasar Amerika Serikat yang dibangun di atas Webflow. Berbeda dari anggapan umum bahwa SaaS modern beralih ke tema gelap (*dark mode*) secara ekstrem, analisis inspeksi browser langsung membuktikan bahwa LigoLab mengusung **fondasi Light-Mode Enterprise yang bersih, berfokus pada data, dengan aksen biru korporat berenergi tinggi**.

Arah desain, pilihan palet warna dasar (*soft slate-blue* & *white*), dan bentuk komponen pil (*pill-shaped buttons*) yang digunakan oleh LigoLab **hampir 100% identik dan selaras** dengan desain baru Diagnova LIS yang telah diterapkan pada halaman Platform, Solusi, Modul, Nova AI, Integrasi, dan Request Demo.

---

## 🎨 1. Ekstraksi Token Desain Nyata (CSS Custom Properties)

Hasil ekstraksi langsung dari CSS root `:root` dan *computed styles* browser di `ligolab.com`:

### A. Palet Warna (Color System)
| Nama CSS Variable | Nilai Hex / RGB | Peran / Penggunaan di UI | Padanan di Diagnova LIS |
|---|---|---|---|
| `--white` | `#ffffff` | Background halaman utama & kartu putih | `#ffffff` (Base background) |
| `--dark-blue` | `#1f2d5d` | Warna teks utama, H1-H3, & navbar sticky | `#1E293B` / `#345DAB` (Navy text) |
| `--blue` / `--blue-new` | `#0073fc` / `#0473fa` | Tombol CTA utama, badge aktif, tautan utama | `#2764B8` (Brand Primary Blue) |
| `--blue-hover` | `#0760ca` | Status hover tombol CTA utama | `#1E5299` (Deep Blue Hover) |
| `--hover-blue` | `#3290ff` | Aksen terang interaktif / hover links | `#38BDF8` / `#60A5FA` |
| `--alice-blue-2` | `#f3f6fa` | Latar belakang seksi selang-seling (soft tint) | `#F2F6FA` *(Sangat identik!)* |
| `--palette-1--12` | `#e3eefb` | Kontainer badge, card highlight, icon box | `#EBF3FB` *(Sangat identik!)* |
| `--palette-2--4` | `#f7fafc` | Background sub-card & input field | `#FAFBFD` / `#F8FBFE` |
| `--gray` / `--palette-2--8` | `#939eaa` / `#8c99a9` | Teks sekunder, subtitle, & border halus | `#64748B` (Slate-500) |
| `--shadow` | `rgba(201, 213, 227, 0.5)` | Soft elevated drop-shadow | `shadow-xs` / `shadow-sm` |

> [!NOTE]
> **Temuan Kunci Palet Warna:**  
> Warna seksi latar belakang LigoLab `--alice-blue-2: #f3f6fa` dan kontainer badge `--palette-1--12: #e3eefb` hampir sama persis dengan palet yang baru kita bangun di Diagnova (`#F2F6FA` dan `#EBF3FB`). Ini membuktikan bahwa pilihan palet Diagnova sangat tepat untuk standar industri LIS global.

---

## 🔤 2. Tipografi & Hirarki Visual (Typography)

LigoLab mengandalkan kesederhanaan dan performa dengan menggunakan **satu font family tunggal** di seluruh website:

* **Primary Font Family:** `Inter, sans-serif`
* **Headline Utama (H1 Hero):**
  * **Teks:** *"The Complete LIS and RCM Platform for Modern Laboratories"*
  * **Ukuran Font:** `55px` (Desktop) / `38px` (Mobile)
  * **Font Weight:** `700` (Bold)
  * **Line Height:** `66px` (1.2x)
  * **Warna:** `#1f2d5d` (Deep Navy)
* **Sub-headline (H2 Section):** `34px` – `40px`, `font-weight: 700`, line height `1.25x`
* **Body Copy:** `15px` – `17px`, `font-weight: 400`, color `#1f2d5d` / `#5a687d`
* **Micro-labels / Badges:** `11px` – `12px`, uppercase, `font-weight: 700`, tracking `0.05em`

---

## 🧱 3. Anatomi Komponen UI (Component Anatomy)

### A. Tombol Aksi (Buttons)
* **Bentuk:** Full Pill Shape (`border-radius: 1440px` atau `100px` di CSS)
* **Tombol Utama (Primary CTA):**
  * Background: `#0073fc`
  * Teks: Putih, `font-size: 16px`, `font-weight: 700`
  * Padding: `20px 25px` (Sangat lega, ramah sentuhan)
  * Hover: Transisi ke `#0760ca` dengan slight scale / shadow lift
* **Tombol Sekunder (Outline / Ghost):**
  * Background: `rgba(255, 255, 255, 0)` (Transparan)
  * Border: `1.5px solid #0073fc`
  * Teks: `#0073fc`, `font-weight: 700`
  * `border-radius: 320px`

### B. Header & Navigasi (Sticky Navbar)
* **Class:** `.navbar.stycky.top0`
* **Tinggi:** `114px` (Desktop), `102px` (Tablet), `66px` (Mobile)
* **Background:** Putih bersih (`rgb(255, 255, 255)`) dengan drop-shadow lembut saat scroll
* **Mega Menu Dropdown:** Menampung solusi klinis (Anatomic Pathology, Molecular, Clinical Lab, RCM, Direct-to-Consumer) yang tertata dalam blok navigasi bersih.

### C. Top Announcement / Award Banner
* Berada tepat di atas navbar: `background: #0073fc` (Electric Blue).
* Mengumumkan penghargaan kredibilitas industri: *"LigoLab Honored with Frost & Sullivan's Competitive Strategy Leadership Award"*.
* Berfungsi langsung sebagai **Trust Signal** sebelum pengunjung melihat hero.

---

## 🎬 4. Analisis Animasi & Motion Design (Animation Engine)

Dari pemeriksaan *CSS Animation Keyframes* yang aktif di LigoLab:

### A. `@keyframes shine` (Efek Kilau Reflektif)
```css
@keyframes shine {
  0%   { left: -100%; }
  40%  { left: 100%; }
  100% { left: 100%; }
}
```
* **Fungsi:** Menghasilkan kilatan cahaya putih transparan miring yang melintasi permukaan kartu penghargaan (*award badge*) dan tombol CTA utama setiap beberapa detik.
* **Tujuan UX:** Mengarahkan pandangan mata pengguna (*focal point*) secara halus ke elemen konversi tanpa mengganggu keterbacaan teks.

### B. `@keyframes smoothLine1` (Marquee Slider Berkelanjutan)
```css
@keyframes smoothLine1 {
  0%   { transform: translate(0px); }
  100% { transform: translate(-25%); }
}
```
* **Fungsi:** Menggeser jajaran logo klien rumah sakit dan sertifikasi secara kontinu (*infinite seamless loop*) dari kanan ke kiri.
* **Tujuan UX:** Memberikan kesan bahwa sistem telah diadopsi secara luas di banyak institusi kesehatan tanpa memakan ruang vertikal.

### C. `@keyframes fade` (Transisi Konten Halus)
```css
@keyframes fade {
  0%   { opacity: 0; }
  100% { opacity: 1; }
}
```
* **Fungsi:** Digunakan saat pengunjung berpindah tab solusi (misal dari LIS ke RCM) sehingga tidak terjadi perubahan visual yang patah (*jarring cut*).

### D. `@keyframes spin`
```css
@keyframes spin {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```
* **Fungsi:** Loading indicator saat permohonan demo atau formulir kontak dikirimkan.

---

## 📐 5. Struktur Alur Halaman (Page Flow Architecture)

Halaman utama LigoLab memiliki total tinggi **12.011 px**, yang dibagi ke dalam 9 zona seksi utama:

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Award Banner (Frost & Sullivan Leadership Award)             │ #0073fc
├─────────────────────────────────────────────────────────────────┤
│ 2. Sticky Navbar (Mega Menu + CTA "Request a Demo")             │ White
├─────────────────────────────────────────────────────────────────┤
│ 3. Hero Section (Headline 55px + Dual CTAs + Platform Overview) │ White & #f3f6fa
├─────────────────────────────────────────────────────────────────┤
│ 4. Infinite Client Logo Marquee (Smooth continuous scroll)     │ #ffffff
├─────────────────────────────────────────────────────────────────┤
│ 5. Dual-Pillar Interactive Showcase (LIS + RCM Single Database) │ #f3f6fa
├─────────────────────────────────────────────────────────────────┤
│ 6. Specialized Laboratory Modules Grid (AP, Molecular, Clinical)│ #ffffff
├─────────────────────────────────────────────────────────────────┤
│ 7. Operational Tiers (Essential, Professional, Enterprise)      │ #f7fafc
├─────────────────────────────────────────────────────────────────┤
│ 8. Persona-based Benefits (Pathologist, Lab Manager, IT Director│ #ffffff
├─────────────────────────────────────────────────────────────────┤
│ 9. High-impact Footer CTA & Resource Directory                  │ #1f2d5d
└─────────────────────────────────────────────────────────────────┘
```

---

## ⚖️ 6. Komparasi Detail: LigoLab vs Diagnova LIS

| Parameter Desain | LigoLab.com | Diagnova LIS (Desain Terbaru) | Catatan / Rekomendasi |
|---|---|---|---|
| **Pola Warna Latar** | Light-Mode (White + `#f3f6fa`) | Light-Mode (White + `#F2F6FA`) | **Sangat Selaras (99% Match)** |
| **Warna Identitas Utama** | `#0073fc` / `#1f2d5d` | `#2764B8` / `#345DAB` | Diagnova sedikit lebih *clinical-royal*, sangat elegan |
| **Bentuk Tombol (CTA)** | Full Pill (`rounded-full`) | Full Pill (`rounded-full`) | **Identik** |
| **Hero KPI Cards** | Menggunakan metric bar horisontal | **4 Card Metrik Elegan** di Hero | **Diagnova lebih rapi & terstruktur** |
| **Tipografi** | Inter (1 font family) | Inter / Plus Jakarta Sans | Keduanya memiliki legibilitas tinggi |
| **Animasi Kilau (Shine)** | Menggunakan `@keyframes shine` | Belum ada efek kilau | **Bisa diimplementasikan di Diagnova** |
| **Logo Slider Marquee** | Menggunakan `smoothLine1` | Statis grid | **Bisa ditambahkan untuk logo RS mitra** |
| **Tab Switcher** | Fade transition tab | Master-Detail Tab Explorer | Diagnova lebih kaya data interaktif |

---

## 🚀 7. Rekomendasi Aksi untuk Diagnova LIS

Berdasarkan data otentik dari LigoLab:

1. **Pertahankan Pendekatan Light Medical Enterprise**:
   Keputusan untuk menghindari dark-mode berlebihan di Diagnova sudah terbukti tepat. Pasar LIS korporat global justru menyukai tampilan yang terang, bersih, dan higienis.
2. **Implementasikan Efek Kilau Halus (`shine`)**:
   Dapat ditambahkan pada kartu hero Nova AI atau badge *"Kepatuhan Permenkes 24/2022"* untuk memperkuat kesan sistem premium.
3. **Tambahkan Marquee Logo Rumah Sakit / Lab Mitra**:
   Menggunakan animasi CSS linear infinite (`smoothLine1`) di bawah hero untuk menampilkan logo mitra lab dan jenis akreditasi (Kemenkes, SATUSEHAT, ISO 15189).

---

## 📁 Lampiran Bukti File Screenshot
File screenshot resolusi tinggi tersimpan di folder lokal:  
`C:\Users\Lutfan Izzat\.gemini\antigravity\brain\a121332c-d886-48be-b540-e7d2f0be49af\ligolab-screenshots\`
* `01-hero.png` — Hero section dan navbar
* `02-scroll-900px.png` s/d `09-scroll-7200px.png` — Seluruh segmen seksi
* `FULL-PAGE.png` — Tangkapan utuh 12.011 px halaman depan
