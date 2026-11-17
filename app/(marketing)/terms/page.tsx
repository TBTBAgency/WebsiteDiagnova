import React from "react";
import type { Metadata } from "next";
import { LegalDocument, Todo } from "@/components/legal/LegalDocument";

// DRAFT: jangan diindeks mesin pencari sebelum disetujui.
export const metadata: Metadata = {
  title: "Syarat & Ketentuan (Draft) — Diagnova",
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <LegalDocument
      title="Syarat & Ketentuan Penggunaan"
      version="0.1-draft"
      sections={[
        {
          id: "ruang-lingkup",
          title: "Ruang Lingkup",
          body: (
            <p>
              Syarat &amp; Ketentuan ini mengatur penggunaan situs web Diagnova, formulir permohonan demo, dan akses akun
              demo yang dikelola oleh <Todo>nama badan hukum pengelola &amp; alamat terdaftar</Todo> (&quot;Pengelola&quot;).
              Dengan menggunakan situs atau layanan demo, pengguna dianggap telah membaca ketentuan ini.
            </p>
          ),
        },
        {
          id: "layanan",
          title: "Penggunaan Layanan",
          body: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Situs menyediakan informasi produk dan formulir untuk mengajukan permohonan demo.</li>
              <li>
                Informasi produk, fitur, dan angka yang ditampilkan bersifat umum dan dapat berubah.{" "}
                <Todo>pernyataan kesesuaian klaim produk — perlu persetujuan manajemen</Todo>
              </li>
              <li>Pengelola dapat menolak permohonan demo tanpa kewajiban memberikan alasan.</li>
            </ul>
          ),
        },
        {
          id: "akun-demo",
          title: "Ketentuan Akun & Akses Demo",
          body: (
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Akses demo diberikan melalui tautan masuk (Magic Link) yang dikirim setelah permohonan disetujui. Tautan
                berlaku 24 jam dan hanya dapat digunakan satu kali.
              </li>
              <li>
                Masa akses demo dihitung sejak tautan pertama kali berhasil digunakan, sesuai durasi yang ditetapkan saat
                persetujuan. Setelah masa akses berakhir, akses demo tidak lagi tersedia.
              </li>
              <li>Tautan masuk bersifat pribadi dan tidak boleh diteruskan kepada pihak lain.</li>
              <li>Pengelola dapat menonaktifkan akun demo sewaktu-waktu, misalnya bila terjadi penyalahgunaan.</li>
            </ul>
          ),
        },
        {
          id: "kewajiban-pengguna",
          title: "Hak dan Tanggung Jawab Pengguna",
          body: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Memberikan data yang benar dan terkini pada formulir permohonan demo.</li>
              <li>
                Tidak memasukkan data pasien sungguhan ke lingkungan demo. <Todo>konfirmasi kebijakan data uji pada demo</Todo>
              </li>
              <li>Menjaga kerahasiaan tautan masuk dan sesi yang sedang aktif.</li>
              <li>Pengguna berhak meminta informasi mengenai data pribadinya sesuai Kebijakan Privasi.</li>
            </ul>
          ),
        },
        {
          id: "batasan",
          title: "Batasan Penggunaan",
          body: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Dilarang mencoba mengakses area administrasi atau data yang bukan haknya.</li>
              <li>Dilarang mengganggu, membebani secara berlebihan, atau menguji keamanan sistem tanpa izin tertulis.</li>
              <li>Dilarang menyalin atau mendistribusikan konten situs untuk tujuan komersial tanpa izin.</li>
            </ul>
          ),
        },
        {
          id: "hki",
          title: "Hak Kekayaan Intelektual",
          body: (
            <p>
              Merek, logo, dan konten situs adalah milik Pengelola atau pemberi lisensinya.{" "}
              <Todo>verifikasi kepemilikan merek &amp; lisensi aset</Todo>
            </p>
          ),
        },
        {
          id: "tanggung-jawab",
          title: "Batasan Tanggung Jawab",
          body: (
            <p>
              <Todo>klausul batasan tanggung jawab — wajib disusun oleh penasihat hukum</Todo>. Dokumen draft ini sengaja
              tidak memuat jaminan, garansi, atau pernyataan tingkat layanan (SLA).
            </p>
          ),
        },
        {
          id: "perubahan",
          title: "Perubahan Ketentuan",
          body: <p>Pengelola dapat memperbarui ketentuan ini. Versi dan tanggal berlaku dicantumkan di bagian atas dokumen.</p>,
        },
        {
          id: "hukum",
          title: "Hukum yang Berlaku",
          body: (
            <p>
              <Todo>hukum yang berlaku &amp; forum penyelesaian sengketa</Todo>
            </p>
          ),
        },
        {
          id: "kontak",
          title: "Kontak Pengelola",
          body: (
            <p>
              Pertanyaan mengenai ketentuan ini dapat dikirim ke <Todo>alamat email resmi pengelola — verifikasi</Todo>.
            </p>
          ),
        },
      ]}
    />
  );
}
