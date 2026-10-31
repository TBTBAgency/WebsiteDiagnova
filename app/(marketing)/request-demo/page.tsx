"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Clock,
  Calendar,
  Layers,
  Cpu,
  Activity,
  FileCheck2,
  Lock,
  ChevronDown,
  Building2,
  Check,
  MessageSquare,
} from "lucide-react";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { PageHero } from "@/components/sections/PageHero";
import { Button } from "@/components/ui/Button";
import { demoRequestSchema } from "@/lib/validations";
import { InstitutionType } from "@/types";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";

function RequestDemoForm() {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";

  const [formData, setFormData] = useState({
    name: "",
    institution: "",
    jobTitle: "",
    email: initialEmail,
    phone: "",
    institutionType: "hospital" as InstitutionType,
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitMessage("");

    // Client-side Zod validation
    const result = demoRequestSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/request-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitSuccess(true);
        setSubmitMessage(data.message);
      } else {
        setSubmitMessage(
          data.message ||
            (language === "ID"
              ? "Gagal mengirim formulir. Silakan coba kembali."
              : "Failed to submit form. Please try again.")
        );
        if (data.errors) {
          const apiErrors: Record<string, string> = {};
          Object.keys(data.errors).forEach((key) => {
            apiErrors[key] = data.errors[key][0];
          });
          setErrors(apiErrors);
        }
      }
    } catch {
      setSubmitMessage(
        language === "ID"
          ? "Terjadi kendala jaringan. Mohon periksa koneksi internet Anda."
          : "Network error occurred. Please check your internet connection."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="text-center py-12 sm:py-16 space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <div className="space-y-2 max-w-md mx-auto">
          <h3 className="font-display text-2xl font-bold text-slate-900">
            {language === "ID" ? "Permohonan Demo Diterima!" : "Demo Request Received!"}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
            {submitMessage}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#F8FBFE] border border-blue-100 max-w-md mx-auto text-left space-y-2">
          <p className="text-xs font-bold text-[#2764B8] uppercase tracking-wider">
            {language === "ID" ? "Tahap Selanjutnya:" : "Next Steps:"}
          </p>
          <ul className="text-xs text-slate-600 space-y-1.5 font-light">
            <li className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 text-[#2764B8]" />
              <span>{language === "ID" ? "Spesialis lab kami menghubungi via WhatsApp/Email" : "Our specialist will reach out via WhatsApp/Email"}</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 text-[#2764B8]" />
              <span>{language === "ID" ? "Konfirmasi jadwal demo online / onsite" : "Confirmation of online / onsite demo session"}</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 text-[#2764B8]" />
              <span>{language === "ID" ? "Simulasi interaktif dengan skenario analyzer RS Anda" : "Live interactive walkthrough tailored to your hospital"}</span>
            </li>
          </ul>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => {
              setSubmitSuccess(false);
              setFormData({
                name: "",
                institution: "",
                jobTitle: "",
                email: "",
                phone: "",
                institutionType: "hospital",
                notes: "",
              });
            }}
            className="rounded-full bg-white border border-slate-200 px-6 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            {language === "ID" ? "Kirim Formulir Lain" : "Submit Another Request"}
          </button>
          <Link
            href="/platform"
            className="rounded-full bg-[#2764B8] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#1E5299] transition-colors"
          >
            {language === "ID" ? "Jelajahi Platform Diagnova" : "Explore Diagnova Platform"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-7">
      <div>
        <h2 className="font-display text-2xl font-bold text-slate-900 tracking-tight">
          {language === "ID" ? "Formulir Permohonan Demo Langsung" : "Live Demo Request Form"}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 font-light">
          {language === "ID"
            ? "Lengkapi informasi di bawah agar Clinical Application Specialist kami dapat menyiapkan skenario pengujian yang relevan."
            : "Complete the details below so our Clinical Application Specialists can prepare a tailored demonstration scenario."}
        </p>
      </div>

      {submitMessage && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700 flex items-center gap-2.5">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{submitMessage}</span>
        </div>
      )}

      {/* Group 1: Contact Details */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2764B8]">
            {language === "ID" ? "1. Narahubung Penanggung Jawab" : "1. Lead Contact Information"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              {language === "ID" ? "Nama Lengkap *" : "Full Name *"}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={language === "ID" ? "dr. Ahmad Fauzi, Sp.PK" : "Dr. John Doe, Pathologist"}
              className={cn(
                "w-full rounded-xl border px-3.5 py-2.5 text-xs sm:text-sm transition-all focus:outline-none focus:ring-2",
                errors.name
                  ? "border-rose-300 ring-rose-200 bg-rose-50/20"
                  : "border-slate-200/90 focus:border-[#2764B8] focus:ring-blue-100 bg-[#FAFBFD]"
              )}
            />
            {errors.name && <p className="text-[11px] text-rose-600 font-medium">{errors.name}</p>}
          </div>

          {/* Job Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              {language === "ID" ? "Jabatan / Peran *" : "Role / Title *"}
            </label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              placeholder={language === "ID" ? "Kepala Lab / Ka. IT / Direktur" : "Lab Director / CIO / Chief Doctor"}
              className={cn(
                "w-full rounded-xl border px-3.5 py-2.5 text-xs sm:text-sm transition-all focus:outline-none focus:ring-2",
                errors.jobTitle
                  ? "border-rose-300 ring-rose-200 bg-rose-50/20"
                  : "border-slate-200/90 focus:border-[#2764B8] focus:ring-blue-100 bg-[#FAFBFD]"
              )}
            />
            {errors.jobTitle && <p className="text-[11px] text-rose-600 font-medium">{errors.jobTitle}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              {language === "ID" ? "Alamat Email Resmi *" : "Official Work Email *"}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="nama@rumahsakit.id"
              className={cn(
                "w-full rounded-xl border px-3.5 py-2.5 text-xs sm:text-sm transition-all focus:outline-none focus:ring-2",
                errors.email
                  ? "border-rose-300 ring-rose-200 bg-rose-50/20"
                  : "border-slate-200/90 focus:border-[#2764B8] focus:ring-blue-100 bg-[#FAFBFD]"
              )}
            />
            {errors.email && <p className="text-[11px] text-rose-600 font-medium">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              {language === "ID" ? "No. WhatsApp / Telepon *" : "WhatsApp / Phone Number *"}
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="0812 3456 7890"
              className={cn(
                "w-full rounded-xl border px-3.5 py-2.5 text-xs sm:text-sm transition-all focus:outline-none focus:ring-2",
                errors.phone
                  ? "border-rose-300 ring-rose-200 bg-rose-50/20"
                  : "border-slate-200/90 focus:border-[#2764B8] focus:ring-blue-100 bg-[#FAFBFD]"
              )}
            />
            {errors.phone && <p className="text-[11px] text-rose-600 font-medium">{errors.phone}</p>}
          </div>
        </div>
      </div>

      {/* Group 2: Institution Profile */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2764B8]">
            {language === "ID" ? "2. Profil Fasilitas Kesehatan" : "2. Facility Profile"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Institution Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              {language === "ID" ? "Nama Rumah Sakit / Faskes *" : "Hospital / Facility Name *"}
            </label>
            <input
              type="text"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              placeholder={language === "ID" ? "RSUP / RSUD / Lab Sehat" : "Memorial Hospital / City Lab"}
              className={cn(
                "w-full rounded-xl border px-3.5 py-2.5 text-xs sm:text-sm transition-all focus:outline-none focus:ring-2",
                errors.institution
                  ? "border-rose-300 ring-rose-200 bg-rose-50/20"
                  : "border-slate-200/90 focus:border-[#2764B8] focus:ring-blue-100 bg-[#FAFBFD]"
              )}
            />
            {errors.institution && <p className="text-[11px] text-rose-600 font-medium">{errors.institution}</p>}
          </div>

          {/* Institution Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              {language === "ID" ? "Jenis Fasilitas *" : "Facility Type *"}
            </label>
            <select
              name="institutionType"
              value={formData.institutionType}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200/90 bg-[#FAFBFD] px-3.5 py-2.5 text-xs sm:text-sm transition-all focus:border-[#2764B8] focus:outline-none focus:ring-2 focus:ring-blue-100 text-slate-800"
            >
              <option value="hospital">{language === "ID" ? "Rumah Sakit (Tipe A / B / C / D)" : "Hospital (General / Specialized)"}</option>
              <option value="clinical-lab">{language === "ID" ? "Laboratorium Klinik Mandiri" : "Independent Clinical Laboratory"}</option>
              <option value="pathology-center">{language === "ID" ? "Pusat Patologi Anatomi" : "Anatomical Pathology Center"}</option>
              <option value="microbiology-center">{language === "ID" ? "Laboratorium Mikrobiologi" : "Microbiology Center"}</option>
              <option value="blood-bank">{language === "ID" ? "Bank Darah / UTD PMI" : "Blood Bank / Transfusion Center"}</option>
              <option value="other">{language === "ID" ? "Fasilitas Lainnya" : "Other Healthcare Facility"}</option>
            </select>
          </div>
        </div>

        {/* Notes & Analyzers */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">
            {language === "ID"
              ? "Model Mesin Analyzer / Kebutuhan Khusus (Opsional)"
              : "Active Analyzer Models / Custom Inquiries (Optional)"}
          </label>
          <textarea
            name="notes"
            rows={3}
            value={formData.notes}
            onChange={handleChange}
            placeholder={
              language === "ID"
                ? "Contoh: Kami menggunakan Sysmex XN-1000 & Cobas c501, membutuhkan bridging ke SIMRS internal & pelaporan SATUSEHAT..."
                : "e.g., Running Sysmex XN-1000 & Cobas c501, need bidirectional HIS bridging and SATUSEHAT reporting..."
            }
            className="w-full rounded-xl border border-slate-200/90 bg-[#FAFBFD] px-3.5 py-2.5 text-xs sm:text-sm transition-all focus:border-[#2764B8] focus:outline-none focus:ring-2 focus:ring-blue-100 text-slate-800"
          />
          {errors.notes && <p className="text-[11px] text-rose-600 font-medium">{errors.notes}</p>}
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#2764B8] hover:bg-[#1E5299] px-7 py-3.5 text-sm sm:text-base font-semibold text-white shadow-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>{language === "ID" ? "Memproses Permohonan..." : "Processing Request..."}</span>
            </>
          ) : (
            <>
              <span>{language === "ID" ? "Kirim Permohonan Live Demo" : "Submit Live Demo Request"}</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        <p className="mt-3 text-center text-[11px] text-slate-600 flex items-center justify-center gap-1.5">
          <Lock className="h-3 w-3 text-slate-600 shrink-0" />
          <span>
            {language === "ID"
              ? "Data faskes Anda dijamin kerahasiaannya dan hanya digunakan untuk penjadwalan demo."
              : "Your data is protected under strict medical privacy standards and never shared."}
          </span>
        </p>
      </div>
    </form>
  );
}

export default function RequestDemoPage() {
  const { language } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q:
        language === "ID"
          ? "Berapa lama durasi sesi live demo berlangsung?"
          : "How long does the live demo session take?",
      a:
        language === "ID"
          ? "Sesi live demo rata-rata berdurasi 30 hingga 45 menit. Dirancang fokus dan efisien, mencakup pengenalan antarmuka, simulasi penarikan data dari analyzer, uji coba Nova AI, dan sesi tanya jawab teknis."
          : "The walkthrough typically lasts 30 to 45 minutes, designed to be concise and focused on your workflow, analyzer interfacing, Nova AI validation, and IT technical Q&A.",
    },
    {
      q:
        language === "ID"
          ? "Apakah sesi demonstrasi ini dikenakan biaya atau ada ikatan kontrak?"
          : "Is the demonstration chargeable or does it require a contract?",
      a:
        language === "ID"
          ? "Sama sekali tidak ada biaya (100% Free). Sesi ini bersifat konsultatif dan eksploratif tanpa komitmen apa pun, sehingga tim faskes Anda dapat menilai kecocokan sistem secara objektif."
          : "It is 100% complimentary with zero commitment required. The session is strictly consultative to help your hospital leadership evaluate clinical and operational fit.",
    },
    {
      q:
        language === "ID"
          ? "Apakah tim Diagnova melayani demo onsite langsung ke rumah sakit kami?"
          : "Can Diagnova conduct an onsite demo at our hospital premises?",
      a:
        language === "ID"
          ? "Ya. Kami melayani demonstrasi onsite langsung ke rumah sakit untuk wilayah tertentu, atau sesi virtual interaktif melalui Google Meet/Zoom dengan akses simulator sistem secara live."
          : "Yes. We offer onsite walkthroughs for qualifying medical institutions, as well as high-definition virtual interactive sessions via Google Meet or Zoom.",
    },
    {
      q:
        language === "ID"
          ? "Bisakah kami meminta demo dengan model analyzer yang kami miliki saat ini?"
          : "Can we request a demo simulating our specific analyzer instruments?",
      a:
        language === "ID"
          ? "Tentu. Diagnova telah memiliki driver untuk 500+ model analyzer global (Sysmex, Roche, Abbott, Mindray, bioMérieux, Siemens, dll). Mohon cantumkan model mesin Anda di formulir agar kami siapkan protokolnya."
          : "Absolutely. Diagnova supports over 500 analyzer models. Simply mention your active instruments in the notes field, and we will configure the corresponding simulation profile.",
    },
  ];

  return (
    <div className="w-full bg-white text-slate-800">
      {/* ══════════════════════════════════════════════════════════════
          HERO SECTION: Standardized PageHero (Clean Medical SaaS)
          ══════════════════════════════════════════════════════════════ */}
      <PageHero
        badge={language === "ID" ? "Konsultasi & Live Demo" : "Consultation & Live Demo"}
        title={
          language === "ID" ? (
            <>
              Lihat Langsung Bagaimana Diagnova{" "}
              <br className="hidden sm:inline" />
              Mengotomasi Laboratorium Anda
            </>
          ) : (
            <>
              Experience How Diagnova{" "}
              <br className="hidden sm:inline" />
              Automates Your Laboratory Workflows
            </>
          )
        }
        subtitle={
          language === "ID"
            ? "Jadwalkan sesi demonstrasi 1-on-1 bersama Clinical Application Specialist kami. Eksplorasi alur kerja end-to-end, uji kecerdasan Nova AI, dan dapatkan simulasi integrasi analyzer sesuai fasilitas kesehatan Anda."
            : "Schedule a dedicated 1-on-1 walkthrough with our Clinical Application Specialists. Explore end-to-end specimen workflows, test Nova AI intelligence, and receive customized analyzer integration feasibility for your facility."
        }
        primaryCta={{
          text: language === "ID" ? "Mulai Isi Formulir Demo" : "Fill Demo Request Form",
          href: "#demo-form",
        }}
        secondaryCta={{
          text: language === "ID" ? "Pelajari Alur Sesi" : "Explore Session Steps",
          href: "#demo-journey",
        }}
        metrics={[
          {
            value: language === "ID" ? "< 24 Jam" : "< 24 Hours",
            label: language === "ID" ? "Respon Cepat" : "Fast SLA Response",
            sub: language === "ID" ? "Jadwal dikonfirmasi dalam 1 hari" : "Confirmed within 1 business day",
          },
          {
            value: "1-on-1",
            label: language === "ID" ? "Sesi Personal" : "Dedicated Walkthrough",
            sub: language === "ID" ? "Bersama spesialis klinis lab" : "With clinical application specialists",
          },
          {
            value: "100% Free",
            label: language === "ID" ? "Tanpa Komitmen" : "Zero Obligation",
            sub: language === "ID" ? "Konsultasi & simulasi gratis" : "Complimentary consultation",
          },
          {
            value: language === "ID" ? "Kustom" : "Custom",
            label: language === "ID" ? "Skenario Faskes" : "Tailored Scenarios",
            sub: language === "ID" ? "Sesuai SIMRS & mesin analyzer" : "Matched to your HIS & analyzers",
          },
        ]}
      />

      {/* ══════════════════════════════════════════════════════════════
          MAIN CONTENT: FORM & SIDEBAR TRUST SIGNALS
          ══════════════════════════════════════════════════════════════ */}
      <section id="demo-form" className="w-full py-16 sm:py-24 bg-white border-b border-slate-100 scroll-mt-28">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Interactive Form */}
            <div className="lg:col-span-7 bg-white rounded-[28px] border border-slate-200/90 p-6 sm:p-10 shadow-xs">
              <Suspense
                fallback={
                  <div className="py-16 text-center text-xs text-slate-500 font-mono">
                    {language === "ID" ? "Memuat formulir pendaftaran..." : "Loading demo request form..."}
                  </div>
                }
              >
                <RequestDemoForm />
              </Suspense>
            </div>

            {/* Right Column: Expectations, Direct Contact, & Privacy */}
            <div className="lg:col-span-5 space-y-6">
              {/* Card 1: What to Expect */}
              <div className="rounded-[28px] border border-slate-200/90 bg-[#FAFBFD] p-6 sm:p-8 shadow-xs space-y-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EBF3FB] text-[#2764B8]">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-base sm:text-lg font-bold text-slate-900">
                      {language === "ID" ? "Yang Anda Dapatkan di Sesi Demo" : "What You Get in Demo Session"}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {language === "ID" ? "Eksplorasi interaktif selama 45 menit" : "45-minute interactive walkthrough"}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  {[
                    {
                      title: language === "ID" ? "Simulasi Alur Spesimen Live" : "Live Specimen Workflow",
                      desc: language === "ID" ? "Registrasi pasien, cetak barcode otomatis, dan tracking tabung." : "Patient intake, auto barcode generation, and specimen custody.",
                      icon: Activity,
                    },
                    {
                      title: language === "ID" ? "Uji Coba Asisten Nova AI" : "Nova AI Assistant Test Run",
                      desc: language === "ID" ? "Deteksi delta-check longitudinal & penandaan panic value seketika." : "Longitudinal delta checks and real-time panic value alerts.",
                      icon: Sparkles,
                    },
                    {
                      title: language === "ID" ? "Kajian Kompatibilitas SIMRS & RME" : "HIS & EMR Integration Review",
                      desc: language === "ID" ? "Konsultasi bridging HL7 v2 dan standar Permenkes No. 24/2022." : "Bidirectional HL7 bridging and national EMR data compliance.",
                      icon: Layers,
                    },
                    {
                      title: language === "ID" ? "Proyeksi Efisiensi TAT & Reagen" : "TAT & Reagent ROI Analytics",
                      desc: language === "ID" ? "Perhitungan potensi pemangkasan waktu tunggu dan penghematan stok." : "Granular estimate of TAT reduction and reagent procurement savings.",
                      icon: Cpu,
                    },
                  ].map((item, idx) => {
                    const ItemIcon = item.icon;
                    return (
                      <div key={idx} className="flex items-start gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80">
                        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#EBF3FB] text-[#2764B8]">
                          <ItemIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-semibold text-slate-900">{item.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed font-light">{item.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Card 2: Direct Contact Channels */}
              <div className="rounded-[28px] border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-4">
                <h4 className="font-display text-base font-bold text-slate-900">
                  {language === "ID" ? "Kontak Langsung Tim Konsultan" : "Direct Advisory Channels"}
                </h4>

                <div className="space-y-3">
                  <a
                    href="mailto:hello@tibatibagency.com"
                    className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#F8FBFE] hover:bg-[#EBF3FB] border border-slate-200/80 transition-colors group"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-200 text-[#2764B8] shrink-0 group-hover:border-blue-300">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="block text-[11px] font-medium text-slate-600">
                        {language === "ID" ? "Email Resmi" : "Official Email"}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-[#2764B8] transition-colors">
                        hello@tibatibagency.com
                      </span>
                    </div>
                  </a>

                  <a
                    href="https://wa.me/6281991070928"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#F8FBFE] hover:bg-[#EBF3FB] border border-slate-200/80 transition-colors group"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-200 text-[#2764B8] shrink-0 group-hover:border-blue-300">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="block text-[11px] font-medium text-slate-600">
                        {language === "ID" ? "WhatsApp & Telepon Konsultan" : "WhatsApp & Direct Advisory"}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-[#2764B8] transition-colors">
                        0819 9107 0928
                      </span>
                    </div>
                  </a>

                  <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#F8FBFE] border border-slate-200/80">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-200 text-[#2764B8] shrink-0 mt-0.5">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="block text-[11px] font-medium text-slate-600">
                        {language === "ID" ? "Wilayah Operasional" : "Operational Coverage"}
                      </span>
                      <span className="text-xs text-slate-700 leading-relaxed font-light">
                        {language === "ID"
                          ? "Implementasi On-Premise & Cloud untuk Rumah Sakit di seluruh Indonesia."
                          : "On-Premise & Cloud deployment across hospitals throughout Indonesia."}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Non-Disclosure Guarantee */}
              <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 sm:p-5 flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-[#2764B8] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    {language === "ID" ? "Jaminan Kerahasiaan Informasi (NDA)" : "Data Privacy & NDA Guarantee"}
                  </p>
                  <p className="text-[11px] sm:text-xs text-slate-600 mt-1 leading-relaxed font-light">
                    {language === "ID"
                      ? "Diagnova mematuhi UU Perlindungan Data Pribadi (UU PDP No. 27/2022). Seluruh data teknis dan estimasi volume pemeriksaan laboratorium Anda terlindungi kerahasiaannya."
                      : "Diagnova adheres strictly to Indonesia's PDP Act and enterprise security standards. Your operational and patient volume figures remain strictly confidential."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 2: 3-STEP DEMO JOURNEY
          ══════════════════════════════════════════════════════════════ */}
      <section id="demo-journey" className="w-full py-16 sm:py-24 bg-[#F8FBFE] border-b border-slate-100 scroll-mt-28">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2764B8]">
              {language === "ID" ? "Alur Sesi Demonstrasi" : "Walkthrough Journey"}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#345DAB] mt-2">
              {language === "ID"
                ? "3 Langkah Menuju Laboratorium Cerdas & Otomatis"
                : "3 Simple Steps to Your Tailored Demo Session"}
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-2 font-light">
              {language === "ID"
                ? "Proses penjadwalan transparan dan cepat tanpa birokrasi berbelit."
                : "A seamless, transparent consultation process without bureaucratic friction."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                step: "01",
                title: language === "ID" ? "Kirimkan Data Kebutuhan" : "Submit Facility Details",
                desc:
                  language === "ID"
                    ? "Isi formulir dengan model analyzer aktif dan kebutuhan bridging SIMRS yang diinginkan faskes Anda."
                    : "Fill out the brief form specifying your active analyzer brands and HIS bridging requirements.",
                icon: FileCheck2,
              },
              {
                step: "02",
                title: language === "ID" ? "Penyelarasan Jadwal Sesi" : "Confirm Session Schedule",
                desc:
                  language === "ID"
                    ? "Spesialis kami mengonfirmasi jadwal (virtual Google Meet/Zoom atau kunjungan onsite) dalam 1x24 jam."
                    : "Our specialists confirm convenient scheduling (virtual Google Meet/Zoom or onsite) within 24 hours.",
                icon: Calendar,
              },
              {
                step: "03",
                title: language === "ID" ? "Live Walkthrough & Simulasi" : "Live Walkthrough & Q&A",
                desc:
                  language === "ID"
                    ? "Simulasi interaktif alur tes, demonstrasi Nova AI, dan diskusi teknis bersama tim IT serta DPJP lab."
                    : "Interactive workflow simulation, Nova AI trial run, and technical Q&A with your clinical and IT team.",
                icon: Sparkles,
              },
            ].map((st, idx) => {
              const StepIcon = st.icon;
              return (
                <div
                  key={idx}
                  className="rounded-[24px] bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs hover:border-blue-200 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EBF3FB] text-[#2764B8]">
                        <StepIcon className="h-6 w-6" />
                      </div>
                      <span className="font-mono text-2xl font-bold text-slate-300">
                        {st.step}
                      </span>
                    </div>

                    <h3 className="font-display text-lg font-bold text-slate-900">
                      {st.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed font-light">
                      {st.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3: FAQ SECTION
          ══════════════════════════════════════════════════════════════ */}
      <section className="w-full py-16 sm:py-24 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2764B8]">
              {language === "ID" ? "Pertanyaan Umum" : "FAQ"}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#345DAB] mt-2">
              {language === "ID"
                ? "Pertanyaan yang Sering Diajukan Seputar Demo"
                : "Frequently Asked Questions About the Demo"}
            </h2>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200/90 bg-[#FAFBFD] overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-display font-semibold text-sm sm:text-base text-slate-900 hover:text-[#2764B8] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-[#2764B8] shrink-0 transition-transform duration-200",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed font-light border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
