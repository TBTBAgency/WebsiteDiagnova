import { ComparisonItem } from "@/types";

export const comparisonData: ComparisonItem[] = [
  {
    id: 1,
    conventional: {
      title: "Integrasi Terbatas",
      description:
        "Terisolasi dari SIMRS/RME, memicu duplikasi ketik data pasien dan risiko salah spesimen.",
    },
    diagnova: {
      title: "Seamless Native Integration",
      description:
        "Bridging otomatis dua arah dengan SIMRS, RME, dan siap terhubung ke ekosistem SATUSEHAT Kemenkes RI.",
    },
    impactMetric: "Zero Data Duplication",
  },
  {
    id: 2,
    conventional: {
      title: "Ketergantungan Input Manual",
      description:
        "Proses registrasi dan ketik angka lab secara manual memperlambat Turnaround Time (TAT) dan rawan salah input.",
    },
    diagnova: {
      title: "100% Otomatisasi & Barcode",
      description:
        "Direct analyzer interfacing bidireksional dan auto-verification memangkas Turnaround Time hingga 70%.",
    },
    impactMetric: "TAT -70%",
  },
  {
    id: 3,
    conventional: {
      title: "Infrastruktur & Koneksi Rentan",
      description:
        "Koneksi analyzer ke server sering terputus, menyebabkan downtime operasional dan hilangnya hasil tes.",
    },
    diagnova: {
      title: "Smart Gateway Resilient",
      description:
        "Mendukung protokol HL7/ASTM dengan Offline-Buffer Edge Mode, menjamin kelangsungan data dengan uptime 99.9%.",
    },
    impactMetric: "99.9% Uptime",
  },
  {
    id: 4,
    conventional: {
      title: "Dukungan IT & SDM Lemah",
      description:
        "Support teknis lambat saat terjadi kendala instrumen, serta antarmuka lama yang membingungkan staf baru.",
    },
    diagnova: {
      title: "SLA Dedicated 24/7 & UX Intuitif",
      description:
        "Pendampingan teknis responsif 24 jam dengan UI Command Center modern yang mudah dipelajari staf lab dalam hitungan jam.",
    },
    impactMetric: "24/7 Dedicated Support",
  },
  {
    id: 5,
    conventional: {
      title: "Audit Trail & Pelaporan Minim",
      description:
        "Riwayat perubahan hasil medis tidak tercatat jelas, menyulitkan akreditasi dan verifikasi kepatuhan.",
    },
    diagnova: {
      title: "Full Digital Audit Trail",
      description:
        "Rekam jejak digital transparan untuk setiap perubahan sampel, approval dokter, dan status kalibrasi alat.",
    },
    impactMetric: "100% Traceable",
  },
  {
    id: 6,
    conventional: {
      title: "Biaya High-CapEx & Lock-in",
      description:
        "Instalasi server awal yang sangat mahal dengan kontrak kaku dan biaya lisensi per modul yang memberatkan.",
    },
    diagnova: {
      title: "Skema Fleksibel & Universal",
      description:
        "Model SaaS terjangkau tanpa investasi server berat, langsung kompatibel dengan 500+ instrumen medis.",
    },
    impactMetric: "500+ Instruments Ready",
  },
];
