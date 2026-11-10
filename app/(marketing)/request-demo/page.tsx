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
  Activity,
  Layers,
  Sparkles,
  Lock,
} from "lucide-react";
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
      <div className="py-6 sm:py-10 max-w-lg mx-auto text-center space-y-5">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div className="space-y-1.5">
          <h2 className="font-display text-2xl font-bold text-slate-900 tracking-tight">
            {language === "ID" ? "Permohonan Demo Terkirim!" : "Demo Request Submitted!"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
            {submitMessage}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2">
          <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            {language === "ID" ? "Tahap Berikutnya" : "Next Steps"}
          </p>
          <ul className="text-xs text-slate-600 space-y-1.5 font-light">
            <li className="flex items-start gap-2">
              <Check className="h-3.5 w-3.5 text-[#2568BA] shrink-0 mt-0.5" />
              <span>
                {language === "ID"
                  ? "Spesialis aplikasi klinis kami akan menghubungi via WhatsApp/Email dalam 1 hari kerja."
                  : "Our clinical specialist will reach out via WhatsApp/Email within 1 business day."}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-3.5 w-3.5 text-[#2568BA] shrink-0 mt-0.5" />
              <span>
                {language === "ID"
                  ? "Sesi demo privat disesuaikan dengan analyzer dan alur SIMRS laboratorium Anda."
                  : "Private demo walkthrough tailored to your analyzers and HIS workflow."}
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
            className="rounded-full bg-white border border-slate-300 px-5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            {language === "ID" ? "Kirim Formulir Lain" : "Submit Another Request"}
          </button>
          <Link
            href="/platform"
            className="rounded-full bg-[#2568BA] px-5 py-2 text-xs font-semibold text-white hover:bg-[#1D5496] transition-colors"
          >
            {language === "ID" ? "Jelajahi Platform" : "Explore Platform"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
      {/* Header Form */}
      <div>
        <h1 className="font-display text-2xl lg:text-[28px] xl:text-3xl font-bold text-slate-900 tracking-tight">
          {language === "ID" ? "Jadwalkan Demo Langsung" : "Get Started Now"}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-light mt-0.5">
          {language === "ID"
            ? "Lengkapi formulir di bawah untuk memulai sesi demonstrasi privat & konsultasi alur lab Anda."
            : "Please fill in your details to schedule a tailored walkthrough for your facility."}
        </p>
      </div>

      {submitMessage && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{submitMessage}</span>
        </div>
      )}

      {/* Inputs Grid: 2 Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 xl:gap-4 pt-0.5">
        {/* Name */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            {language === "ID" ? "Nama Lengkap *" : "Full Name *"}
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={language === "ID" ? "dr. Ahmad Fauzi, Sp.PK" : "Dr. John Doe, Pathologist"}
            className={cn(
              "w-full h-10 rounded-xl border bg-white px-3.5 text-xs sm:text-sm transition-all focus:outline-none focus:ring-2",
              errors.name
                ? "border-rose-300 ring-rose-100 bg-rose-50/20"
                : "border-slate-200 hover:border-slate-300 focus:border-[#2568BA] focus:ring-blue-100"
            )}
          />
          {errors.name && <p className="text-[11px] text-rose-600">{errors.name}</p>}
        </div>

        {/* Job Title */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            {language === "ID" ? "Jabatan / Peran *" : "Role / Title *"}
          </label>
          <input
            type="text"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            placeholder={language === "ID" ? "Kepala Lab / Ka. IT / Direktur" : "Lab Director / CIO / Chief Doctor"}
            className={cn(
              "w-full h-10 rounded-xl border bg-white px-3.5 text-xs sm:text-sm transition-all focus:outline-none focus:ring-2",
              errors.jobTitle
                ? "border-rose-300 ring-rose-100 bg-rose-50/20"
                : "border-slate-200 hover:border-slate-300 focus:border-[#2568BA] focus:ring-blue-100"
            )}
          />
          {errors.jobTitle && <p className="text-[11px] text-rose-600">{errors.jobTitle}</p>}
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            {language === "ID" ? "Email Resmi Instansi *" : "Official Work Email *"}
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="nama@rumahsakit.id"
            className={cn(
              "w-full h-10 rounded-xl border bg-white px-3.5 text-xs sm:text-sm transition-all focus:outline-none focus:ring-2",
              errors.email
                ? "border-rose-300 ring-rose-100 bg-rose-50/20"
                : "border-slate-200 hover:border-slate-300 focus:border-[#2568BA] focus:ring-blue-100"
            )}
          />
          {errors.email && <p className="text-[11px] text-rose-600">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            {language === "ID" ? "No. WhatsApp / Telepon *" : "WhatsApp / Phone *"}
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="0812 3456 7890"
            className={cn(
              "w-full h-10 rounded-xl border bg-white px-3.5 text-xs sm:text-sm transition-all focus:outline-none focus:ring-2",
              errors.phone
                ? "border-rose-300 ring-rose-100 bg-rose-50/20"
                : "border-slate-200 hover:border-slate-300 focus:border-[#2568BA] focus:ring-blue-100"
            )}
          />
          {errors.phone && <p className="text-[11px] text-rose-600">{errors.phone}</p>}
        </div>

        {/* Institution Name */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            {language === "ID" ? "Nama Rumah Sakit / Faskes *" : "Facility / Hospital Name *"}
          </label>
          <input
            type="text"
            name="institution"
            value={formData.institution}
            onChange={handleChange}
            placeholder={language === "ID" ? "RSUP / RSUD / Lab Utama" : "Memorial Hospital / City Lab"}
            className={cn(
              "w-full h-10 rounded-xl border bg-white px-3.5 text-xs sm:text-sm transition-all focus:outline-none focus:ring-2",
              errors.institution
                ? "border-rose-300 ring-rose-100 bg-rose-50/20"
                : "border-slate-200 hover:border-slate-300 focus:border-[#2568BA] focus:ring-blue-100"
            )}
          />
          {errors.institution && <p className="text-[11px] text-rose-600">{errors.institution}</p>}
        </div>

        {/* Facility Type */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            {language === "ID" ? "Jenis Fasilitas *" : "Facility Type *"}
          </label>
          <select
            name="institutionType"
            value={formData.institutionType}
            onChange={handleChange}
            className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs sm:text-sm text-slate-800 transition-all hover:border-slate-300 focus:border-[#2568BA] focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option value="hospital">{language === "ID" ? "Rumah Sakit (Tipe A / B / C / D)" : "Hospital (General / Specialized)"}</option>
            <option value="clinical-lab">{language === "ID" ? "Laboratorium Klinik Mandiri" : "Independent Clinical Laboratory"}</option>
            <option value="pathology-center">{language === "ID" ? "Pusat Patologi Anatomi" : "Anatomical Pathology Center"}</option>
            <option value="microbiology-center">{language === "ID" ? "Laboratorium Mikrobiologi" : "Microbiology Center"}</option>
            <option value="blood-bank">{language === "ID" ? "Bank Darah / UTD PMI" : "Blood Bank / Transfusion Center"}</option>
            <option value="other">{language === "ID" ? "Fasilitas Lainnya" : "Other Healthcare Facility"}</option>
          </select>
        </div>

        {/* Preferred Date */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              {language === "ID" ? "Pilihan Tanggal Demo" : "Preferred Demo Date"}
            </span>
            <span className="text-[10px] text-slate-400 font-normal">({language === "ID" ? "Opsional" : "Optional"})</span>
          </label>
          <input
            type="datetime-local"
            name="demoDate"
            value={formData.demoDate}
            onChange={handleChange}
            className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs sm:text-sm text-slate-800 transition-all hover:border-slate-300 focus:border-[#2568BA] focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Analyzer / Notes */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
            <span>{language === "ID" ? "Model Mesin / Kebutuhan" : "Active Analyzers / Notes"}</span>
            <span className="text-[10px] text-slate-400 font-normal">({language === "ID" ? "Opsional" : "Optional"})</span>
          </label>
          <input
            type="text"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder={
              language === "ID"
                ? "Sysmex XN-1000, Cobas c501..."
                : "Sysmex XN-1000, Cobas c501..."
            }
            className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs sm:text-sm text-slate-800 transition-all hover:border-slate-300 focus:border-[#2568BA] focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          {errors.notes && <p className="text-[11px] text-rose-600">{errors.notes}</p>}
        </div>
      </div>

      {/* Submit Button & Security Note */}
      <div className="pt-1.5 space-y-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2568BA] hover:bg-[#1D5496] px-6 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all duration-200 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>{language === "ID" ? "Memproses Permohonan..." : "Processing Request..."}</span>
            </>
          ) : (
            <>
              <span>{language === "ID" ? "Kirim Permohonan Live Demo" : "Request Live Demo"}</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5 text-center font-light">
          <Lock className="h-3 w-3 text-slate-400 shrink-0" />
          <span>
            {language === "ID"
              ? "Kerahasiaan data instrumen dan faskes Anda dijamin sesuai standar privasi medis."
              : "Your facility and analyzer information is strictly protected under healthcare privacy standards."}
          </span>
        </p>
      </div>

      {/* Direct Contact Links */}
      <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
        <span className="font-light text-[11px]">
          {language === "ID" ? "Pertanyaan langsung? Hubungi kami:" : "Questions? Contact us directly:"}
        </span>
        <div className="flex items-center gap-4 font-medium text-[#2568BA] text-xs">
          <a href="mailto:hello@diagnova.id" className="flex items-center gap-1 hover:underline">
            <Mail className="h-3 w-3" />
            <span>hello@diagnova.id</span>
          </a>
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:underline"
          >
            <Phone className="h-3 w-3" />
            <span>+62 812-3456-7890</span>
          </a>
        </div>
      </div>
    </form>
  );
}

export default function RequestDemoPage() {
  const { language } = useLanguage();

  return (
    <main
      style={{
        paddingTop: "calc(88px + var(--announcement-bar-height, 0px) + 20px)",
        paddingBottom: "20px",
      }}
      className="relative w-full lg:h-[100dvh] min-h-[660px] bg-[#F4F6F9] flex flex-col justify-center transition-[padding-top] duration-300 ease-in-out"
    >
      {/* Outer Card with Exact Standard Width max-w-[1560px] px-4 sm:px-6 lg:px-10 Matching Navbar & Site Content */}
      <div className="mx-auto w-full max-w-[1560px] px-4 sm:px-6 lg:px-10 h-full flex flex-col justify-center">
        <div className="w-full h-full bg-white rounded-[24px] sm:rounded-[32px] p-3 sm:p-4 lg:p-5 xl:p-6 shadow-[0_12px_40px_-15px_rgba(15,23,42,0.07)] border border-slate-200/80 flex flex-col justify-center overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 xl:gap-8 h-full items-stretch">

            {/* LEFT: Vibrant Blue Feature Banner (Matching Screenshot) */}
            <div className="lg:col-span-5 relative rounded-[20px] sm:rounded-[24px] overflow-hidden bg-gradient-to-br from-[#2467BA] via-[#1D5496] to-[#123168] text-white p-6 sm:p-8 lg:p-9 xl:p-10 flex flex-col justify-between h-full shadow-inner">
              {/* Ambient glowing orbs */}
              <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-[#56ADE2]/30 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-[#1D3F82]/60 blur-3xl pointer-events-none" />

              {/* Top Content */}
              <div className="relative z-10 space-y-3">
                <p className="text-xs sm:text-sm text-blue-200/90 font-medium tracking-wide">
                  {language === "ID" ? "Platform Diagnostik Modern" : "Modern Diagnostic Platform"}
                </p>
                <h2 className="font-display text-2xl sm:text-3xl lg:text-[32px] xl:text-[36px] font-bold leading-tight text-white tracking-tight">
                  {language === "ID"
                    ? "Percepat & Otomasi Alur Kerja Laboratorium Anda"
                    : "Speed up your lab workflow with Diagnova LIS"}
                </h2>
                <p className="text-xs sm:text-sm text-blue-100/80 font-light leading-relaxed pt-0.5">
                  {language === "ID"
                    ? "Satu platform terintegrasi untuk interfacing analyzer instan, verifikasi hasil berbasis AI, dan pelaporan nasional."
                    : "An all-in-one platform for analyzer interfacing, AI auto-verification, and seamless healthcare integration."}
                </p>

                {/* Value Highlight Pills */}
                <div className="pt-3 sm:pt-4 space-y-2.5">
                  <div className="flex items-center gap-2.5 text-xs text-white/90">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-white shrink-0">
                      <Check className="h-3 w-3" />
                    </span>
                    <span>{language === "ID" ? "100% Bridging SATUSEHAT & SIMRS" : "Full SATUSEHAT & HIS Bridging"}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-white/90">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-white shrink-0">
                      <Check className="h-3 w-3" />
                    </span>
                    <span>{language === "ID" ? "Dukungan 500+ Model Analyzer Klinis" : "Supports 500+ Clinical Analyzers"}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-white/90">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-white shrink-0">
                      <Check className="h-3 w-3" />
                    </span>
                    <span>{language === "ID" ? "Didampingi Spesialis Aplikasi Klinis" : "Dedicated Clinical Specialist Support"}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Content: Our Partners / Compliance Badges */}
              <div className="relative z-10 pt-6 mt-auto border-t border-white/15">
                <p className="text-[11px] uppercase tracking-wider text-blue-200/80 font-semibold mb-2.5">
                  {language === "ID" ? "Standar & Kepatuhan Medis" : "Standards & Compliance"}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-white/90 font-medium">
                  <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15">
                    SATUSEHAT
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15">
                    Kemenkes RI
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15">
                    ISO 27001
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15">
                    HL7 / FHIR
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT: Clean Form Area (Matching Screenshot) */}
            <div className="lg:col-span-7 flex flex-col justify-center p-2 sm:p-4 lg:p-6 xl:p-8 h-full">
              <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-slate-100" />}>
                <RequestDemoForm />
              </Suspense>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
