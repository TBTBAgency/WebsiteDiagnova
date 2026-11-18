import React from "react";
import type { Metadata } from "next";
import { LegalDocument, Todo } from "@/components/legal/LegalDocument";

// DRAFT: jangan diindeks mesin pencari sebelum disetujui.
export const metadata: Metadata = {
  title: "Kebijakan Privasi (Draft) — Diagnova",
  robots: { index: false, follow: true },
};

/**
 * Isi draft ini hanya menyebut praktik yang terverifikasi dari kode (lihat
 * docs/FINAL_DEVELOPMENT_REVIEW.md §6). Tidak ada klaim enkripsi saat disimpan, penghapusan
 * otomatis, atau pembagian data ke pihak ketiga, karena belum dapat diverifikasi secara teknis.
 */
export default function PrivacyPage() {
  return (
    <LegalDocument
      title="Kebijakan Privasi"
      version="0.1-draft"
      sections={[
        {
          id: "pengendali",
          title: "Pengendali Data",
          body: (
            <p>
              Data pribadi dalam layanan ini dikelola oleh <Todo>nama badan hukum, alamat, dan kontak pengendali data</Todo>.
              Kebijakan ini disusun dengan mengacu pada UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi.{" "}
              <Todo>tinjauan kepatuhan oleh penasihat hukum / pejabat pelindungan data</Todo>
            </p>
          ),
        },
        {
          id: "data-dikumpulkan",
          title: "Data yang Dikumpulkan",
          body: (
            <>
              <p className="font-semibold">a. Formulir permohonan demo</p>
              <p>
                Nama lengkap, nama institusi, jenis institusi, jabatan, alamat email, nomor telepon/WhatsApp, usulan jadwal
                demo, dan catatan kebutuhan yang Anda tulis.
              </p>
              <p className="font-semibold">b. Akun demo</p>
              <p>
                Bila permohonan disetujui, dibuat akun berisi nama, email, institusi, jabatan, nomor telepon, status akun,
                serta waktu aktivasi dan berakhirnya akses demo. Akun klien tidak memiliki password.
              </p>
              <p className="font-semibold">c. Data teknis keamanan</p>
              <p>
                Alamat IP dan informasi peramban (user agent) dicatat saat tautan masuk digunakan dan pada catatan aktivitas
                (audit log) administrasi. Alamat IP juga dipakai sementara untuk membatasi jumlah permintaan.
              </p>
              <p className="font-semibold">d. Data pasien (modul LIS)</p>
              <p>
                Modul sistem informasi laboratorium dapat menyimpan data pasien (antara lain nomor rekam medis, NIK, nama,
                tanggal lahir, jenis kelamin, kontak, dan alamat) yang dimasukkan oleh petugas berwenang. Data ini hanya dapat
                diakses oleh akun Administrator. <Todo>tetapkan dasar hukum & kebijakan data pasien untuk lingkungan demo</Todo>
              </p>
            </>
          ),
        },
        {
          id: "tujuan",
          title: "Tujuan Penggunaan Data",
          body: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Menindaklanjuti dan menjadwalkan permohonan demo, termasuk menghubungi Anda melalui email atau WhatsApp.</li>
              <li>Membuat dan mengelola akses demo serta menghitung masa aktifnya.</li>
              <li>Menjaga keamanan layanan, mencegah penyalahgunaan, dan menyediakan jejak audit.</li>
            </ul>
          ),
        },
        {
          id: "cookie",
          title: "Cookie & Penyimpanan di Perangkat",
          body: (
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <code>diagnova_session</code> — cookie sesi masuk (httpOnly) yang berlaku hingga 24 jam setelah masuk.
              </li>
              <li>
                <code>diagnova_language</code> — preferensi bahasa yang disimpan di penyimpanan lokal peramban.
              </li>
              <li>Situs ini saat ini tidak memasang layanan analitik atau iklan pihak ketiga.</li>
            </ul>
          ),
        },
        {
          id: "penyimpanan",
          title: "Penyimpanan, Keamanan & Retensi",
          body: (
            <>
              <ul className="list-disc pl-5 space-y-1">
                <li>Data disimpan di basis data aplikasi. <Todo>lokasi & penyedia infrastruktur penyimpanan</Todo></li>
                <li>Akses ke data permohonan, akun, dan data pasien dibatasi untuk akun Administrator.</li>
                <li>Password Administrator disimpan dalam bentuk hash; tautan masuk disimpan dalam bentuk hash, bukan teks asli.</li>
              </ul>
              <p>
                Jangka waktu penyimpanan: <Todo>kebijakan retensi belum ditetapkan — saat ini data tidak dihapus otomatis</Todo>
              </p>
            </>
          ),
        },
        {
          id: "pembagian",
          title: "Pengungkapan kepada Pihak Lain",
          body: (
            <p>
              <Todo>daftar penyedia layanan / pemroses data (mis. hosting, basis data, email, WhatsApp) — wajib diverifikasi</Todo>.
              Pengelola tidak menjual data pribadi. <Todo>konfirmasi manajemen</Todo>
            </p>
          ),
        },
        {
          id: "hak",
          title: "Hak Subjek Data",
          body: (
            <p>
              Sesuai peraturan yang berlaku, Anda dapat meminta akses, perbaikan, penghapusan, atau penarikan persetujuan atas
              data pribadi Anda. Mekanisme dan jangka waktu penanganan: <Todo>prosedur permintaan subjek data</Todo>.
            </p>
          ),
        },
        {
          id: "perubahan",
          title: "Perubahan Kebijakan",
          body: <p>Kebijakan ini dapat diperbarui. Versi dan tanggal berlaku dicantumkan di bagian atas dokumen.</p>,
        },
        {
          id: "kontak",
          title: "Kontak",
          body: (
            <p>
              Pertanyaan atau permintaan terkait data pribadi: <Todo>alamat email / kontak pejabat pelindungan data</Todo>.
            </p>
          ),
        },
      ]}
    />
  );
}
