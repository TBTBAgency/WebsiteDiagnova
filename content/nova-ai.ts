export interface NovaAISampleOutput {
  parameter: string;
  value: string;
  referenceRange: string;
  status: "Normal" | "Tinggi" | "Rendah" | "Kritis";
  rawStatusBadge: string;
  explanation: string;
  clinicalNote: string;
}

export const novaAIWorkflowSteps = [
  {
    step: "01",
    phase: "Observe",
    title: "Membaca Pola & Riwayat",
    subtitle: "Menganalisis Tren Data",
    description:
      "Nova AI membaca data biomarker saat ini dan membandingkannya dengan ribuan riwayat pemeriksaan pasien sebelumnya serta pola delta check laboratorium.",
    iconName: "Eye",
  },
  {
    step: "02",
    phase: "Understand",
    title: "Menerjemahkan Angka Kompleks",
    subtitle: "Bahasa Klinis Jelas & Bahasa Awam",
    description:
      "Mengubah deretan angka desimal dan singkatan parameter rumit menjadi narasi ringkas yang mudah dipahami oleh dokter dan pasien.",
    iconName: "BrainCircuit",
  },
  {
    step: "03",
    phase: "Assist",
    title: "Memberitahu Lebih Cepat",
    subtitle: "Early Warning & Anomaly Alert",
    description:
      "Memberikan peringatan dini atas nilai kritis (Panic Values) dan pergeseran tren yang signifikan agar dokter dapat segera merespon.",
    iconName: "Zap",
  },
  {
    step: "04",
    phase: "Decide",
    title: "Selalu Divalidasi Dokter",
    subtitle: "Human-in-the-Loop 100%",
    description:
      "Seluruh rangkuman dan rekomendasi Nova AI diserahkan kepada Dokter Penanggung Jawab untuk evaluasi, persetujuan, dan keputusan klinis final.",
    iconName: "UserCheck",
  },
];

export const novaAISampleTranslations: NovaAISampleOutput[] = [
  {
    parameter: "Hemoglobin (Hb)",
    value: "8.4 g/dL",
    referenceRange: "12.0 - 16.0 g/dL",
    status: "Rendah",
    rawStatusBadge: "text-amber-700 bg-amber-50 border-amber-200",
    explanation:
      "Kadar sel darah merah pembawa oksigen berada di bawah rentang normal (Anemia).",
    clinicalNote:
      "Penurunan signifikan sebesar 2.1 g/dL dari tes 3 hari lalu (Delta check alert). Direkomendasikan evaluasi perdarahan aktif atau defisiensi besi.",
  },
  {
    parameter: "Glukosa Darah Puasa (GDP)",
    value: "186 mg/dL",
    referenceRange: "70 - 100 mg/dL",
    status: "Tinggi",
    rawStatusBadge: "text-red-700 bg-red-50 border-red-200",
    explanation:
      "Kadar gula dalam darah setelah puasa berada di atas batas normal (indikasi hiperglikemia).",
    clinicalNote:
      "Konsisten tinggi dalam 2 kunjungan terakhir. Disarankan konfirmasi pemeriksaan HbA1c untuk evaluasi kontrol glikemik jangka panjang.",
  },
  {
    parameter: "Leukosit (Sel Darah Putih)",
    value: "14.800 /µL",
    referenceRange: "4.000 - 10.000 /µL",
    status: "Tinggi",
    rawStatusBadge: "text-red-700 bg-red-50 border-red-200",
    explanation:
      "Jumlah sel darah putih meningkat, menandakan respons tubuh terhadap kemungkinan infeksi atau inflamasi aktif.",
    clinicalNote:
      "Disertai peningkatan neutrofil segmen (Shift to the Left). Pertimbangkan evaluasi fokus infeksi bakteri akut.",
  },
  {
    parameter: "Trombosit (Platelet)",
    value: "245.000 /µL",
    referenceRange: "150.000 - 450.000 /µL",
    status: "Normal",
    rawStatusBadge: "text-emerald-700 bg-emerald-50 border-emerald-200",
    explanation:
      "Jumlah keping darah yang membantu proses pembekuan berada dalam rentang yang sangat sehat dan aman.",
    clinicalNote:
      "Fungsi hemostasis primer dalam batas normal, tidak ditemukan kecurigaan trombositopenia.",
  },
];

export const novaAIDisclaimer = {
  text: "Nova AI hanya bertugas membantu merangkum data dan mendeteksi anomali pola. Keputusan diagnosis dan penanganan medis tetap 100% ditentukan oleh Dokter yang merawat.",
  badge: "Medical Ethics & Compliance Notice",
};
