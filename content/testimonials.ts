export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  organization: string;
  quote: string;
  imageSrc: string;
  readMoreLink?: string;
  accentGradient: string;
}

export interface TestimonialsContent {
  sectionBadge: string;
  sectionTitle: string;
  sectionSubtitle: string;
  readMoreLabel: string;
  partnerLogos: string[];
  items: TestimonialItem[];
}

export const testimonialsContentID: TestimonialsContent = {
  sectionBadge: "Testimoni Mitra",
  sectionTitle: "Kisah Nyata dari Mitra Laboratorium Kami",
  sectionSubtitle:
    "Dengarkan langsung dari kepala laboratorium, dokter patologi klinik, dan direktur rumah sakit yang mengandalkan Diagnova setiap hari untuk mempercepat TAT dan memastikan akurasi diagnostik.",
  readMoreLabel: "Baca selengkapnya",
  partnerLogos: [
    "RS Hermina",
    "Siloam Hospitals",
    "Mayapada Hospital",
    "Prodia Diagnostika",
    "Kimia Farma Lab",
    "RSUD Tarakan",
  ],
  items: [
    {
      id: "testimonial-1",
      name: "dr. Rina Puspitasari, Sp.PK",
      role: "Kepala Laboratorium Sentral",
      organization: "RS Hermina Group",
      quote:
        "Integrasi dua arah Diagnova dengan analyzer otomatis memangkas waktu entri manual hingga 75%. Risiko tertukar sampel kini nol dengan verifikasi barcode cerdas dan alert delta check instan.",
      imageSrc: "/images/testimonial-silhouette-female.jpg",
      readMoreLink: "#",
      accentGradient: "from-[#2A68B8] via-[#4F9DE6] to-[#7EC5F8]",
    },
    {
      id: "testimonial-2",
      name: "dr. Arif Kurniawan, MARS",
      role: "Direktur Pelayanan Medis",
      organization: "Siloam Hospitals Network",
      quote:
        "Platform Diagnova sangat mudah diimplementasikan dan langsung memberikan dampak operasional. Dalam hitungan minggu, koordinasi antara dokter spesialis dan analis lab menjadi jauh lebih sinkron dan presisi.",
      imageSrc: "/images/testimonial-silhouette-male.jpg",
      readMoreLink: "#",
      accentGradient: "from-[#1D4E89] via-[#3B82C8] to-[#60A5FA]",
    },
    {
      id: "testimonial-3",
      name: "Maya Indrawati, S.Tr.AK",
      role: "Koordinator Analis Medis Shift",
      organization: "Laboratorium Diagnostika Utama",
      quote:
        "Bagi tim teknisi analis, antarmukanya luar biasa intuitif. Fitur auto-verification dan bridging SATUSEHAT bekerja di latar belakang tanpa lag, menghemat berjam-jam kerja setiap shift malam.",
      imageSrc: "/images/testimonial-silhouette-female.jpg",
      readMoreLink: "#",
      accentGradient: "from-[#0F3B7A] via-[#2A66B8] to-[#67B5F7]",
    },
    {
      id: "testimonial-4",
      name: "dr. Budi Santoso, Sp.A",
      role: "Dokter Spesialis Anak & Konsultan PICU",
      organization: "Mayapada Hospital",
      quote:
        "Hasil laboratorium CITO dan peringatan nilai kritis kini terkirim otomatis ke perangkat tablet saat visit pasien. Kecepatan ini sangat berharga dalam menyelamatkan pasien kegawatdaruratan anak.",
      imageSrc: "/images/testimonial-silhouette-male.jpg",
      readMoreLink: "#",
      accentGradient: "from-[#1A457E] via-[#3572BD] to-[#79BDF8]",
    },
  ],
};

export const testimonialsContentEN: TestimonialsContent = {
  sectionBadge: "Partner Testimonials",
  sectionTitle: "Real Stories Shared by Our Customers",
  sectionSubtitle:
    "Hear directly from laboratory directors, clinical pathologists, and hospital executives who rely on Diagnova daily to streamline turnaround times and ensure diagnostic precision.",
  readMoreLabel: "Read more",
  partnerLogos: [
    "Hermina Hospitals",
    "Siloam Hospitals",
    "Mayapada Hospital",
    "Prodia Diagnostics",
    "Kimia Farma Lab",
    "Tarakan General Hospital",
  ],
  items: [
    {
      id: "testimonial-1",
      name: "dr. Rina Puspitasari, Sp.PK",
      role: "Head of Central Laboratory",
      organization: "Hermina Hospital Group",
      quote:
        "Diagnova's bidirectional analyzer interfacing cut our manual entry time by up to 75%. Specimen mix-up risk dropped to absolute zero with their smart barcode tracking and instant delta check alerts.",
      imageSrc: "/images/testimonial-silhouette-female.jpg",
      readMoreLink: "#",
      accentGradient: "from-[#2A68B8] via-[#4F9DE6] to-[#7EC5F8]",
    },
    {
      id: "testimonial-2",
      name: "dr. Arif Kurniawan, MARS",
      role: "Medical Services Director",
      organization: "Siloam Hospitals Network",
      quote:
        "The platform was incredibly easy to deploy and delivered value almost instantly. Within the first few weeks, communication between our clinical specialists and lab analysts reached unprecedented efficiency.",
      imageSrc: "/images/testimonial-silhouette-male.jpg",
      readMoreLink: "#",
      accentGradient: "from-[#1D4E89] via-[#3B82C8] to-[#60A5FA]",
    },
    {
      id: "testimonial-3",
      name: "Maya Indrawati, S.Tr.AK",
      role: "Lead Medical Laboratory Technologist",
      organization: "Prime Diagnostics Laboratory",
      quote:
        "For our lab technicians, the interface is remarkably intuitive. Auto-verification and national health record bridging operate seamlessly in the background, saving hours every single night shift.",
      imageSrc: "/images/testimonial-silhouette-female.jpg",
      readMoreLink: "#",
      accentGradient: "from-[#0F3B7A] via-[#2A66B8] to-[#67B5F7]",
    },
    {
      id: "testimonial-4",
      name: "dr. Budi Santoso, Sp.A",
      role: "Pediatric Specialist & PICU Consultant",
      organization: "Mayapada Hospital",
      quote:
        "Emergency CITO results and critical value alerts arrive instantaneously on our doctor tablets during ward visits. That speed is invaluable when managing critical pediatric emergencies.",
      imageSrc: "/images/testimonial-silhouette-male.jpg",
      readMoreLink: "#",
      accentGradient: "from-[#1A457E] via-[#3572BD] to-[#79BDF8]",
    },
  ],
};
