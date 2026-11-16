// Konten halaman Request Demo yang dikelola CMS (default/seed).
// Catatan: `value` pada institutionTypeOptions harus salah satu InstitutionType yang divalidasi
// (hospital, clinical-lab, pathology-center, microbiology-center, blood-bank, other).
import type { CmsPageDefinition } from "@/lib/cms/types";

export const requestDemoPage = {
  pageKey: "request-demo",
  sections: {
    intro: {
      label: "Panel Kiri (Intro)",
      content: {
        badge: { id: "Platform Diagnostik Modern", en: "Modern Diagnostic Platform" },
        title: {
          id: "Percepat & Otomasi Alur Kerja Laboratorium Anda",
          en: "Speed up your lab workflow with Diagnova LIS",
        },
        description: {
          id: "Satu platform terintegrasi untuk interfacing analyzer instan, verifikasi hasil berbasis AI, dan pelaporan nasional.",
          en: "An all-in-one platform for analyzer interfacing, AI auto-verification, and seamless healthcare integration.",
        },
      },
    },
    trust: {
      label: "Logo Mitra (Marquee)",
      content: {
        label: { id: "Dipercaya oleh Mitra & Jaringan Faskes", en: "Trusted by Healthcare Partners" },
        logos: [
          { id: "logo-1", logoUrl: "/images/trust-logo.svg", alt: "Partner Trust Logo" },
          { id: "logo-2", logoUrl: "/images/trust-logo.svg", alt: "Partner Trust Logo" },
          { id: "logo-3", logoUrl: "/images/trust-logo.svg", alt: "Partner Trust Logo" },
          { id: "logo-4", logoUrl: "/images/trust-logo.svg", alt: "Partner Trust Logo" },
          { id: "logo-5", logoUrl: "/images/trust-logo.svg", alt: "Partner Trust Logo" },
          { id: "logo-6", logoUrl: "/images/trust-logo.svg", alt: "Partner Trust Logo" },
          { id: "logo-7", logoUrl: "/images/trust-logo.svg", alt: "Partner Trust Logo" },
          { id: "logo-8", logoUrl: "/images/trust-logo.svg", alt: "Partner Trust Logo" },
        ],
      },
    },
    form: {
      label: "Formulir Demo",
      content: {
        title: { id: "Jadwalkan Demo Langsung", en: "Get Started Now" },
        subtitle: {
          id: "Lengkapi formulir di bawah untuk memulai sesi demonstrasi privat & konsultasi alur lab Anda.",
          en: "Please fill in your details to schedule a tailored walkthrough for your facility.",
        },
        fields: {
          name: {
            label: { id: "Nama Lengkap *", en: "Full Name *" },
            placeholder: { id: "dr. Ahmad Fauzi, Sp.PK", en: "Dr. John Doe, Pathologist" },
          },
          jobTitle: {
            label: { id: "Jabatan / Peran *", en: "Role / Title *" },
            placeholder: { id: "Kepala Lab / Ka. IT / Direktur", en: "Lab Director / CIO / Chief Doctor" },
          },
          email: {
            label: { id: "Email Resmi Instansi *", en: "Official Work Email *" },
            placeholder: "nama@rumahsakit.id",
          },
          phone: {
            label: { id: "No. WhatsApp / Telepon *", en: "WhatsApp / Phone *" },
            placeholder: "0812 3456 7890",
          },
          institution: {
            label: { id: "Nama Rumah Sakit / Faskes *", en: "Facility / Hospital Name *" },
            placeholder: { id: "RSUP / RSUD / Lab Utama", en: "Memorial Hospital / City Lab" },
          },
          institutionType: {
            label: { id: "Jenis Fasilitas *", en: "Facility Type *" },
          },
          demoDate: {
            label: { id: "Pilihan Tanggal Demo", en: "Preferred Demo Date" },
          },
          notes: {
            label: { id: "Model Mesin / Kebutuhan", en: "Active Analyzers / Notes" },
            placeholder: { id: "Sysmex XN-1000, Cobas c501...", en: "Sysmex XN-1000, Cobas c501..." },
          },
        },
        institutionTypeOptions: [
          { id: "hospital", value: "hospital", label: { id: "Rumah Sakit (Tipe A / B / C / D)", en: "Hospital (General / Specialized)" } },
          { id: "clinical-lab", value: "clinical-lab", label: { id: "Laboratorium Klinik Mandiri", en: "Independent Clinical Laboratory" } },
          { id: "pathology-center", value: "pathology-center", label: { id: "Pusat Patologi Anatomi", en: "Anatomical Pathology Center" } },
          { id: "microbiology-center", value: "microbiology-center", label: { id: "Laboratorium Mikrobiologi", en: "Microbiology Center" } },
          { id: "blood-bank", value: "blood-bank", label: { id: "Bank Darah / UTD PMI", en: "Blood Bank / Transfusion Center" } },
          { id: "other", value: "other", label: { id: "Fasilitas Lainnya", en: "Other Healthcare Facility" } },
        ],
        optionalLabel: { id: "Opsional", en: "Optional" },
        submitLabel: { id: "Kirim Permohonan Live Demo", en: "Request Live Demo" },
        submittingLabel: { id: "Memproses Permohonan...", en: "Processing Request..." },
        privacyNote: {
          id: "Kerahasiaan data instrumen dan faskes Anda dijamin sesuai standar privasi medis.",
          en: "Your facility and analyzer information is strictly protected under healthcare privacy standards.",
        },
        contactPrompt: { id: "Pertanyaan langsung? Hubungi kami:", en: "Questions? Contact us directly:" },
        contactEmail: "hello@diagnova.id",
        contactEmailHref: "mailto:hello@diagnova.id",
        contactPhone: "+62 812-3456-7890",
        contactPhoneHref: "https://wa.me/6281234567890",
        errorSubmitFailed: {
          id: "Gagal mengirim formulir. Silakan coba kembali.",
          en: "Failed to submit form. Please try again.",
        },
        errorNetwork: {
          id: "Terjadi kendala jaringan. Mohon periksa koneksi internet Anda.",
          en: "Network error occurred. Please check your internet connection.",
        },
        successTitle: { id: "Permohonan Demo Terkirim!", en: "Demo Request Submitted!" },
        successNextStepsTitle: { id: "Tahap Berikutnya", en: "Next Steps" },
        successNextSteps: [
          {
            id: "step-contact",
            text: {
              id: "Spesialis aplikasi klinis kami akan menghubungi via WhatsApp/Email dalam 1 hari kerja.",
              en: "Our clinical specialist will reach out via WhatsApp/Email within 1 business day.",
            },
          },
          {
            id: "step-demo",
            text: {
              id: "Sesi demo privat disesuaikan dengan analyzer dan alur SIMRS laboratorium Anda.",
              en: "Private demo walkthrough tailored to your analyzers and HIS workflow.",
            },
          },
        ],
        successResetLabel: { id: "Kirim Formulir Lain", en: "Submit Another Request" },
        successExploreLabel: { id: "Jelajahi Platform", en: "Explore Platform" },
        successExploreHref: "/platform",
      },
    },
  },
} satisfies CmsPageDefinition;
