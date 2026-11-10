"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Check,
} from "lucide-react";
import { SectionBadge } from "@/components/ui/SectionBadge";
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
    demoDate: "",
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
      <div className="py-8 sm:py-12 max-w-xl mx-auto text-center space-y-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-bold text-slate-900 tracking-tight">
            {language === "ID" ? "Permohonan Demo Terkirim" : "Demo Request Submitted"}
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {submitMessage}
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2.5">
          <p className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
            {language === "ID" ? "Langkah Berikutnya" : "Next Steps"}
          </p>
          <ul className="text-xs text-slate-600 space-y-2">
            <li className="flex items-start gap-2.5">
              <Check className="h-4 w-4 text-[#2764B8] shrink-0 mt-0.5" />
              <span>
                {language === "ID"
                  ? "Clinical Application Specialist kami akan menghubungi Anda via WhatsApp/Email dalam 1 hari kerja."
                  : "Our Clinical Application Specialist will contact you via WhatsApp/Email within 1 business day."}
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="h-4 w-4 text-[#2764B8] shrink-0 mt-0.5" />
              <span>
                {language === "ID"
                  ? "Penyusunan simulasi demo sesuai jenis instrumen analyzer dan sistem RS/SIMRS Anda."
                  : "Live demonstration tailored to your analyzer instruments and current HIS/LIS setup."}
              </span>
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
                demoDate: "",
                notes: "",
              });
            }}
            className="rounded-full bg-white border border-slate-300 px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            {language === "ID" ? "Kirim Permohonan Lain" : "Submit Another Request"}
          </button>
          <Link
            href="/platform"
            className="rounded-full bg-[#2764B8] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#1E5299] transition-colors"
          >
            {language === "ID" ? "Pelajari Platform" : "Explore Platform"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header Inside Card */}
      <div className="space-y-3 pb-6 border-b border-slate-100">
        <SectionBadge variant="blue">
          {language === "ID" ? "Demo Platform" : "Platform Demo"}
        </SectionBadge>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {language === "ID" ? "Jadwalkan Demo Diagnova LIS" : "Schedule a Diagnova LIS Demo"}
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
          {language === "ID"
            ? "Konsultasikan alur kerja laboratorium, integrasi analyzer, dan bridging SATUSEHAT/SIMRS bersama tim spesialis klinis kami."
            : "Explore laboratory workflows, analyzer interfacing, and SATUSEHAT/HIS interoperability directly with our clinical specialists."}
        </p>
      </div>

      {submitMessage && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700 flex items-center gap-2.5">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{submitMessage}</span>
        </div>
      )}

      {/* Main Form Fields: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Contact Person */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {language === "ID" ? "Informasi Kontak" : "Contact Information"}
          </h2>

          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-slate-700">
              {language === "ID" ? "Nama Lengkap" : "Full Name"} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={language === "ID" ? "dr. Hendra Pratama, Sp.PK" : "Dr. John Doe, Pathologist"}
              className={cn(
                "w-full h-11 rounded-lg border bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-4",
                errors.name
                  ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                  : "border-slate-200 hover:border-slate-300 focus:border-[#2764B8] focus:ring-[#2764B8]/10"
              )}
            />
            {errors.name && <p className="text-xs text-rose-600">{errors.name}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-slate-700">
              {language === "ID" ? "Jabatan / Peran" : "Role / Title"} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              placeholder={language === "ID" ? "Kepala Laboratorium / Ka. IT RS / Direktur" : "Lab Director / CIO / Chief Doctor"}
              className={cn(
                "w-full h-11 rounded-lg border bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-4",
                errors.jobTitle
                  ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                  : "border-slate-200 hover:border-slate-300 focus:border-[#2764B8] focus:ring-[#2764B8]/10"
              )}
            />
            {errors.jobTitle && <p className="text-xs text-rose-600">{errors.jobTitle}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-slate-700">
              {language === "ID" ? "Email Resmi Instansi" : "Work Email"} <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="nama@rumahsakit.id"
              className={cn(
                "w-full h-11 rounded-lg border bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-4",
                errors.email
                  ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                  : "border-slate-200 hover:border-slate-300 focus:border-[#2764B8] focus:ring-[#2764B8]/10"
              )}
            />
            {errors.email && <p className="text-xs text-rose-600">{errors.email}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-slate-700">
              {language === "ID" ? "Nomor WhatsApp / Telepon" : "WhatsApp / Phone"} <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="0812 3456 7890"
              className={cn(
                "w-full h-11 rounded-lg border bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-4",
                errors.phone
                  ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                  : "border-slate-200 hover:border-slate-300 focus:border-[#2764B8] focus:ring-[#2764B8]/10"
              )}
            />
            {errors.phone && <p className="text-xs text-rose-600">{errors.phone}</p>}
          </div>
        </div>

        {/* Right Column: Facility Details */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {language === "ID" ? "Fasilitas & Kebutuhan Lab" : "Facility & Specifications"}
          </h2>

          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-slate-700">
              {language === "ID" ? "Nama Rumah Sakit / Laboratorium" : "Hospital / Laboratory Name"} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              placeholder={language === "ID" ? "RSUP / RSUD / Klinik Utama" : "Memorial Hospital / Diagnostic Lab"}
              className={cn(
                "w-full h-11 rounded-lg border bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-4",
                errors.institution
                  ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                  : "border-slate-200 hover:border-slate-300 focus:border-[#2764B8] focus:ring-[#2764B8]/10"
              )}
            />
            {errors.institution && <p className="text-xs text-rose-600">{errors.institution}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-slate-700">
              {language === "ID" ? "Jenis Fasilitas" : "Facility Type"} <span className="text-rose-500">*</span>
            </label>
            <select
              name="institutionType"
              value={formData.institutionType}
              onChange={handleChange}
              className="w-full h-11 rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-900 transition-colors hover:border-slate-300 focus:border-[#2764B8] focus:outline-none focus:ring-4 focus:ring-[#2764B8]/10"
            >
              <option value="hospital">{language === "ID" ? "Rumah Sakit (Tipe A / B / C / D)" : "Hospital (General / Specialized)"}</option>
              <option value="clinical-lab">{language === "ID" ? "Laboratorium Klinik Mandiri" : "Independent Clinical Laboratory"}</option>
              <option value="pathology-center">{language === "ID" ? "Pusat Patologi Anatomi" : "Anatomical Pathology Center"}</option>
              <option value="microbiology-center">{language === "ID" ? "Laboratorium Mikrobiologi" : "Microbiology Center"}</option>
              <option value="blood-bank">{language === "ID" ? "Bank Darah / UTD PMI" : "Blood Bank / Transfusion Center"}</option>
              <option value="other">{language === "ID" ? "Fasilitas Lainnya" : "Other Healthcare Facility"}</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-slate-500" />
                {language === "ID" ? "Rencana Waktu Demo" : "Preferred Demo Time"}
              </span>
              <span className="text-xs text-slate-400 font-normal">({language === "ID" ? "Opsional" : "Optional"})</span>
            </label>
            <input
              type="datetime-local"
              name="demoDate"
              value={formData.demoDate}
              onChange={handleChange}
              className="w-full h-11 rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-900 transition-colors hover:border-slate-300 focus:border-[#2764B8] focus:outline-none focus:ring-4 focus:ring-[#2764B8]/10"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-slate-700 flex items-center justify-between">
              <span>{language === "ID" ? "Model Mesin Analyzer / Kebutuhan Integrasi" : "Active Analyzer Models / Inquiries"}</span>
              <span className="text-xs text-slate-400 font-normal">({language === "ID" ? "Opsional" : "Optional"})</span>
            </label>
            <textarea
              name="notes"
              rows={2}
              value={formData.notes}
              onChange={handleChange}
              placeholder={
                language === "ID"
                  ? "Contoh: Sysmex XN-1000, Cobas c501, kebutuhan bridging SIMRS internal..."
                  : "e.g., Sysmex XN-1000, Cobas c501, internal HIS bridging..."
              }
              className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-900 transition-colors hover:border-slate-300 focus:border-[#2764B8] focus:outline-none focus:ring-4 focus:ring-[#2764B8]/10 resize-none"
            />
            {errors.notes && <p className="text-xs text-rose-600">{errors.notes}</p>}
          </div>
        </div>
      </div>

      {/* Action Area & Enterprise Assurance */}
      <div className="pt-2 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto sm:min-w-[260px] h-12 inline-flex items-center justify-center gap-2 rounded-full bg-[#2764B8] hover:bg-[#1E5299] px-8 text-[15px] font-semibold text-white shadow-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>{language === "ID" ? "Mengirim Permohonan..." : "Submitting..."}</span>
              </>
            ) : (
              <>
                <span>{language === "ID" ? "Kirim Permohonan Demo" : "Request Platform Demo"}</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          <p className="text-xs text-slate-500 flex items-center gap-1.5 text-center sm:text-left">
            <ShieldCheck className="h-4 w-4 text-slate-400 shrink-0" />
            <span>
              {language === "ID"
                ? "Data dan spesifikasi laboratorium Anda terlindungi sesuai standar kepatuhan privasi data medis."
                : "Your facility information is protected under healthcare data confidentiality standards."}
            </span>
          </p>
        </div>

        {/* Quiet Footnote for Direct Contact */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>
            {language === "ID"
              ? "Memerlukan koordinasi teknis mendesak? Hubungi kami langsung:"
              : "Need immediate technical consultation? Contact our team directly:"}
          </span>
          <div className="flex items-center gap-4 font-medium text-[#2764B8]">
            <a href="mailto:hello@diagnova.id" className="flex items-center gap-1.5 hover:underline">
              <Mail className="h-3.5 w-3.5" />
              <span>hello@diagnova.id</span>
            </a>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:underline"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>+62 812-3456-7890</span>
            </a>
          </div>
        </div>
      </div>
    </form>
  );
}

export default function RequestDemoPage() {
  return (
    <main
      style={{
        paddingTop: "calc(96px + var(--announcement-bar-height, 40px) + 32px)",
      }}
      className="bg-[#F8FAFC] min-h-screen pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 transition-[padding-top] duration-300"
    >
      <div className="mx-auto w-full max-w-4xl">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] p-6 sm:p-10 lg:p-12">
          <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-slate-100" />}>
            <RequestDemoForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
