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
  Sparkles,
  ShieldCheck,
  Clock,
  Calendar,
  Lock,
  Check,
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
      <div className="text-center py-6 sm:py-10 space-y-5">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div className="space-y-1.5 max-w-md mx-auto">
          <h3 className="font-display text-2xl font-bold text-slate-900">
            {language === "ID" ? "Permohonan Demo Diterima!" : "Demo Request Received!"}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
            {submitMessage}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#F8FBFE] border border-blue-100 max-w-md mx-auto text-left space-y-2">
          <p className="text-xs font-bold text-[#2764B8] uppercase tracking-wider">
            {language === "ID" ? "Tahap Selanjutnya:" : "Next Steps:"}
          </p>
          <ul className="text-xs text-slate-600 space-y-1.5 font-light">
            <li className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 text-[#2764B8] shrink-0" />
              <span>{language === "ID" ? "Spesialis lab kami menghubungi via WhatsApp/Email" : "Our specialist will reach out via WhatsApp/Email"}</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 text-[#2764B8] shrink-0" />
              <span>{language === "ID" ? "Konfirmasi jadwal demo online / onsite" : "Confirmation of online / onsite demo session"}</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 text-[#2764B8] shrink-0" />
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
                demoDate: "",
                notes: "",
              });
            }}
            className="rounded-full bg-white border border-slate-200 px-5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            {language === "ID" ? "Kirim Formulir Lain" : "Submit Another Request"}
          </button>
          <Link
            href="/platform"
            className="rounded-full bg-[#2764B8] px-5 py-2 text-xs font-semibold text-white hover:bg-[#1E5299] transition-colors"
          >
            {language === "ID" ? "Jelajahi Platform Diagnova" : "Explore Diagnova Platform"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header Inside Card - Compact & Balanced */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200/70 text-[#2568BA] text-[11px] font-semibold mb-1">
            <Sparkles className="w-3 h-3" />
            <span>{language === "ID" ? "Live Demo Diagnova" : "Diagnova Live Demo"}</span>
          </div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {language === "ID" ? "Jadwalkan Demo Platform" : "Schedule a Platform Demo"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-light mt-0.5">
            {language === "ID"
              ? "Konsultasi gratis & demonstrasi alur kerja laboratorium bersama spesialis klinis kami."
              : "Free consultation & tailored live demonstration with our clinical specialists."}
          </p>
        </div>

        {/* Trust Chips compact */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/70 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            {language === "ID" ? "Gratis & Privat" : "Free & Private"}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/70 font-medium">
            <Clock className="w-3.5 h-3.5 text-[#2764B8] shrink-0" />
            {language === "ID" ? "30–45 Menit" : "30–45 Min"}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/70 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2764B8] shrink-0" />
            {language === "ID" ? "SATUSEHAT Ready" : "SATUSEHAT Ready"}
          </span>
        </div>
      </div>

      {submitMessage && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-700 flex items-center gap-2.5">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{submitMessage}</span>
        </div>
      )}

      {/* 2-Column Side-by-Side Form Layout for Compact Vertical Height */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
        {/* Kolom 1: Narahubung Penanggung Jawab */}
        <div className="space-y-3.5">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2764B8]">
              {language === "ID" ? "1. Narahubung Penanggung Jawab" : "1. Lead Contact Information"}
            </span>
          </div>

          <div className="space-y-1">
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
                "w-full rounded-xl border px-3 py-2 text-xs sm:text-sm transition-all focus:outline-none focus:ring-2",
                errors.name
                  ? "border-rose-300 ring-rose-200 bg-rose-50/20"
                  : "border-slate-200/90 focus:border-[#2764B8] focus:ring-blue-100 bg-[#FAFBFD]"
              )}
            />
            {errors.name && <p className="text-[11px] text-rose-600 font-medium">{errors.name}</p>}
          </div>

          <div className="space-y-1">
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
                "w-full rounded-xl border px-3 py-2 text-xs sm:text-sm transition-all focus:outline-none focus:ring-2",
                errors.jobTitle
                  ? "border-rose-300 ring-rose-200 bg-rose-50/20"
                  : "border-slate-200/90 focus:border-[#2764B8] focus:ring-blue-100 bg-[#FAFBFD]"
              )}
            />
            {errors.jobTitle && <p className="text-[11px] text-rose-600 font-medium">{errors.jobTitle}</p>}
          </div>

          <div className="space-y-1">
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
                "w-full rounded-xl border px-3 py-2 text-xs sm:text-sm transition-all focus:outline-none focus:ring-2",
                errors.email
                  ? "border-rose-300 ring-rose-200 bg-rose-50/20"
                  : "border-slate-200/90 focus:border-[#2764B8] focus:ring-blue-100 bg-[#FAFBFD]"
              )}
            />
            {errors.email && <p className="text-[11px] text-rose-600 font-medium">{errors.email}</p>}
          </div>

          <div className="space-y-1">
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
                "w-full rounded-xl border px-3 py-2 text-xs sm:text-sm transition-all focus:outline-none focus:ring-2",
                errors.phone
                  ? "border-rose-300 ring-rose-200 bg-rose-50/20"
                  : "border-slate-200/90 focus:border-[#2764B8] focus:ring-blue-100 bg-[#FAFBFD]"
              )}
            />
            {errors.phone && <p className="text-[11px] text-rose-600 font-medium">{errors.phone}</p>}
          </div>
        </div>

        {/* Kolom 2: Profil Fasilitas Kesehatan */}
        <div className="space-y-3.5">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2764B8]">
              {language === "ID" ? "2. Profil Fasilitas Kesehatan" : "2. Facility Profile"}
            </span>
          </div>

          <div className="space-y-1">
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
                "w-full rounded-xl border px-3 py-2 text-xs sm:text-sm transition-all focus:outline-none focus:ring-2",
                errors.institution
                  ? "border-rose-300 ring-rose-200 bg-rose-50/20"
                  : "border-slate-200/90 focus:border-[#2764B8] focus:ring-blue-100 bg-[#FAFBFD]"
              )}
            />
            {errors.institution && <p className="text-[11px] text-rose-600 font-medium">{errors.institution}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              {language === "ID" ? "Jenis Fasilitas *" : "Facility Type *"}
            </label>
            <select
              name="institutionType"
              value={formData.institutionType}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200/90 bg-[#FAFBFD] px-3 py-2 text-xs sm:text-sm transition-all focus:border-[#2764B8] focus:outline-none focus:ring-2 focus:ring-blue-100 text-slate-800"
            >
              <option value="hospital">{language === "ID" ? "Rumah Sakit (Tipe A / B / C / D)" : "Hospital (General / Specialized)"}</option>
              <option value="clinical-lab">{language === "ID" ? "Laboratorium Klinik Mandiri" : "Independent Clinical Laboratory"}</option>
              <option value="pathology-center">{language === "ID" ? "Pusat Patologi Anatomi" : "Anatomical Pathology Center"}</option>
              <option value="microbiology-center">{language === "ID" ? "Laboratorium Mikrobiologi" : "Microbiology Center"}</option>
              <option value="blood-bank">{language === "ID" ? "Bank Darah / UTD PMI" : "Blood Bank / Transfusion Center"}</option>
              <option value="other">{language === "ID" ? "Fasilitas Lainnya" : "Other Healthcare Facility"}</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[#2764B8]" />
                {language === "ID" ? "Pilihan Tanggal Demo" : "Preferred Demo Date"}
              </span>
              <span className="text-[10px] text-slate-400 font-normal">({language === "ID" ? "Opsional" : "Optional"})</span>
            </label>
            <input
              type="datetime-local"
              name="demoDate"
              value={formData.demoDate}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200/90 bg-[#FAFBFD] px-3 py-2 text-xs sm:text-sm transition-all focus:border-[#2764B8] focus:outline-none focus:ring-2 focus:ring-blue-100 text-slate-800"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>{language === "ID" ? "Model Mesin / Kebutuhan Khusus" : "Active Analyzer Models / Notes"}</span>
              <span className="text-[10px] text-slate-400 font-normal">({language === "ID" ? "Opsional" : "Optional"})</span>
            </label>
            <textarea
              name="notes"
              rows={2}
              value={formData.notes}
              onChange={handleChange}
              placeholder={
                language === "ID"
                  ? "Contoh: Sysmex XN-1000 & Cobas c501, butuh bridging SIMRS & SATUSEHAT..."
                  : "e.g., Sysmex XN-1000 & Cobas c501, need HIS & SATUSEHAT bridging..."
              }
              className="w-full rounded-xl border border-slate-200/90 bg-[#FAFBFD] px-3 py-2 text-xs sm:text-sm transition-all focus:border-[#2764B8] focus:outline-none focus:ring-2 focus:ring-blue-100 text-slate-800"
            />
            {errors.notes && <p className="text-[11px] text-rose-600 font-medium">{errors.notes}</p>}
          </div>
        </div>
      </div>

      {/* Bottom Area: Action Button + Lock Note + Quick Contact */}
      <div className="pt-2 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto sm:min-w-[280px] inline-flex items-center justify-center gap-2 rounded-full bg-[#2764B8] hover:bg-[#1E5299] px-7 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
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

          <p className="text-[11px] text-slate-500 flex items-center gap-1.5 text-center sm:text-left font-light">
            <Lock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span>
              {language === "ID"
                ? "Data faskes Anda dijamin kerahasiaannya dan hanya digunakan untuk penjadwalan demo."
                : "Your data is protected under strict medical privacy standards."}
            </span>
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span className="font-light text-[11px]">
            {language === "ID" ? "Butuh konsultasi cepat? Hubungi tim kami:" : "Need direct consultation? Reach out directly:"}
          </span>
          <div className="flex items-center gap-4 font-medium text-[#2764B8] text-xs">
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
    <main className="bg-[#F8FAFC] min-h-[calc(100vh-80px)] py-8 sm:py-12 flex items-center justify-center">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/40 p-6 sm:p-8 lg:p-9">
          <Suspense fallback={<div className="h-80 animate-pulse rounded-2xl bg-slate-100" />}>
            <RequestDemoForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
