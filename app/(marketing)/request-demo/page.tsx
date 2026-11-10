"use client";

import React, { useState, useRef, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
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
  Building2,
  Users,
  User,
  Briefcase,
} from "lucide-react";
import { demoRequestSchema } from "@/lib/validations";
import { InstitutionType } from "@/types";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";

// ─── Trust Marquee using Exact Home Page Logos & Slow-Down Hover Animation ───
function TrustMarquee({ language }: { language: "ID" | "EN" }) {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const logos = Array.from({ length: 8 });

  const handleMouseEnter = () => {
    if (marqueeRef.current && typeof marqueeRef.current.getAnimations === "function") {
      const anims = marqueeRef.current.getAnimations();
      anims.forEach((anim) => {
        anim.playbackRate = 0.25; // Bergerak pelan (25% kecepatan) saat kena kursor persis seperti di home
      });
    }
  };

  const handleMouseLeave = () => {
    if (marqueeRef.current && typeof marqueeRef.current.getAnimations === "function") {
      const anims = marqueeRef.current.getAnimations();
      anims.forEach((anim) => {
        anim.playbackRate = 1; // Kembali ke kecepatan normal saat kursor keluar
      });
    }
  };

  return (
    <div className="relative z-10 pt-4 mt-auto border-t border-white/15 overflow-hidden">
      <style>{`
        @keyframes marqueeTrustPanel {
          0% {
            transform: translate3d(0%, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .animate-marquee-trust-panel {
          display: flex;
          width: max-content;
          animation: marqueeTrustPanel 28s linear infinite;
          will-change: transform;
        }
      `}</style>

      <p className="text-[11px] uppercase tracking-wider text-blue-200/80 font-semibold mb-2.5">
        {language === "ID" ? "Dipercaya oleh Mitra & Jaringan Faskes" : "Trusted by Healthcare Partners"}
      </p>

      {/* Marquee Track with Left & Right Soft Fade Masks and Hover Slow-Down */}
      <div
        className="relative w-full overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)",
        }}
      >
        <div
          ref={marqueeRef}
          className="animate-marquee-trust-panel flex items-center gap-10 sm:gap-12 py-1"
        >
          {[...logos, ...logos].map((_, idx) => (
            <div
              key={idx}
              className="flex items-center justify-center shrink-0 opacity-50 hover:opacity-100 transition-all duration-300 select-none cursor-default"
            >
              <Image
                src="/images/trust-logo.svg"
                alt="Partner Trust Logo"
                width={140}
                height={40}
                className="h-6 sm:h-7 md:h-8 w-auto object-contain brightness-0 invert"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

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
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            {submitMessage}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2">
          <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            {language === "ID" ? "Tahap Berikutnya" : "Next Steps"}
          </p>
          <ul className="text-xs text-slate-600 space-y-1.5 font-normal">
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
        <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
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
        <div className="space-y-1 group/field">
          <label className="text-xs font-semibold text-slate-700 flex items-center justify-between transition-colors duration-150 group-focus-within/field:text-[#2568BA]">
            <span>{language === "ID" ? "Nama Lengkap *" : "Full Name *"}</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 group-focus-within/field:text-[#2568BA] transition-colors duration-150">
              <User className="h-4 w-4" />
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={language === "ID" ? "dr. Ahmad Fauzi, Sp.PK" : "Dr. John Doe, Pathologist"}
              className={cn(
                "w-full h-10 rounded-xl border bg-white pl-9 pr-8 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 transition-all duration-150",
                errors.name
                  ? "border-rose-300 ring-4 ring-rose-100/60 bg-rose-50/20"
                  : "border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/30 focus:border-[#2568BA] focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
              )}
            />
            {formData.name.trim().length >= 3 && !errors.name && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-emerald-500 transition-opacity">
                <Check className="h-3.5 w-3.5" />
              </div>
            )}
          </div>
          {errors.name && <p className="text-[11px] text-rose-600">{errors.name}</p>}
        </div>

        {/* Job Title */}
        <div className="space-y-1 group/field">
          <label className="text-xs font-semibold text-slate-700 flex items-center justify-between transition-colors duration-150 group-focus-within/field:text-[#2568BA]">
            <span>{language === "ID" ? "Jabatan / Peran *" : "Role / Title *"}</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 group-focus-within/field:text-[#2568BA] transition-colors duration-150">
              <Briefcase className="h-4 w-4" />
            </div>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              placeholder={language === "ID" ? "Kepala Lab / Ka. IT / Direktur" : "Lab Director / CIO / Chief Doctor"}
              className={cn(
                "w-full h-10 rounded-xl border bg-white pl-9 pr-8 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 transition-all duration-150",
                errors.jobTitle
                  ? "border-rose-300 ring-rose-100 bg-rose-50/20"
                  : "border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/30 focus:border-[#2568BA] focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
              )}
            />
            {formData.jobTitle.trim().length >= 2 && !errors.jobTitle && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-emerald-500 transition-opacity">
                <Check className="h-3.5 w-3.5" />
              </div>
            )}
          </div>
          {errors.jobTitle && <p className="text-[11px] text-rose-600">{errors.jobTitle}</p>}
        </div>

        {/* Email */}
        <div className="space-y-1 group/field">
          <label className="text-xs font-semibold text-slate-700 flex items-center justify-between transition-colors duration-150 group-focus-within/field:text-[#2568BA]">
            <span>{language === "ID" ? "Email Resmi Instansi *" : "Official Work Email *"}</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 group-focus-within/field:text-[#2568BA] transition-colors duration-150">
              <Mail className="h-4 w-4" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="nama@rumahsakit.id"
              className={cn(
                "w-full h-10 rounded-xl border bg-white pl-9 pr-8 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 transition-all duration-150",
                errors.email
                  ? "border-rose-300 ring-4 ring-rose-100/60 bg-rose-50/20"
                  : "border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/30 focus:border-[#2568BA] focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
              )}
            />
            {formData.email.includes("@") && formData.email.includes(".") && !errors.email && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-emerald-500 transition-opacity">
                <Check className="h-3.5 w-3.5" />
              </div>
            )}
          </div>
          {errors.email && <p className="text-[11px] text-rose-600">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div className="space-y-1 group/field">
          <label className="text-xs font-semibold text-slate-700 flex items-center justify-between transition-colors duration-150 group-focus-within/field:text-[#2568BA]">
            <span>{language === "ID" ? "No. WhatsApp / Telepon *" : "WhatsApp / Phone *"}</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 group-focus-within/field:text-[#2568BA] transition-colors duration-150">
              <Phone className="h-4 w-4" />
            </div>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="0812 3456 7890"
              className={cn(
                "w-full h-10 rounded-xl border bg-white pl-9 pr-8 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 transition-all duration-150",
                errors.phone
                  ? "border-rose-300 ring-4 ring-rose-100/60 bg-rose-50/20"
                  : "border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/30 focus:border-[#2568BA] focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
              )}
            />
            {formData.phone.trim().length >= 9 && !errors.phone && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-emerald-500 transition-opacity">
                <Check className="h-3.5 w-3.5" />
              </div>
            )}
          </div>
          {errors.phone && <p className="text-[11px] text-rose-600">{errors.phone}</p>}
        </div>

        {/* Institution Name */}
        <div className="space-y-1 group/field">
          <label className="text-xs font-semibold text-slate-700 flex items-center justify-between transition-colors duration-150 group-focus-within/field:text-[#2568BA]">
            <span>{language === "ID" ? "Nama Rumah Sakit / Faskes *" : "Facility / Hospital Name *"}</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 group-focus-within/field:text-[#2568BA] transition-colors duration-150">
              <Building2 className="h-4 w-4" />
            </div>
            <input
              type="text"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              placeholder={language === "ID" ? "RSUP / RSUD / Lab Utama" : "Memorial Hospital / City Lab"}
              className={cn(
                "w-full h-10 rounded-xl border bg-white pl-9 pr-8 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 transition-all duration-150",
                errors.institution
                  ? "border-rose-300 ring-4 ring-rose-100/60 bg-rose-50/20"
                  : "border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/30 focus:border-[#2568BA] focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
              )}
            />
            {formData.institution.trim().length >= 3 && !errors.institution && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-emerald-500 transition-opacity">
                <Check className="h-3.5 w-3.5" />
              </div>
            )}
          </div>
          {errors.institution && <p className="text-[11px] text-rose-600">{errors.institution}</p>}
        </div>

        {/* Facility Type */}
        <div className="space-y-1 group/field">
          <label className="text-xs font-semibold text-slate-700 flex items-center justify-between transition-colors duration-150 group-focus-within/field:text-[#2568BA]">
            <span>{language === "ID" ? "Jenis Fasilitas *" : "Facility Type *"}</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 group-focus-within/field:text-[#2568BA] transition-colors duration-150">
              <Layers className="h-4 w-4" />
            </div>
            <select
              name="institutionType"
              value={formData.institutionType}
              onChange={handleChange}
              className="w-full h-10 rounded-xl border border-slate-200/90 bg-white pl-9 pr-8 text-xs sm:text-sm text-slate-800 transition-all duration-150 hover:border-slate-300 hover:bg-slate-50/30 focus:border-[#2568BA] focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 cursor-pointer"
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

        {/* Preferred Date */}
        <div className="space-y-1 group/field">
          <label className="text-xs font-semibold text-slate-700 flex items-center justify-between transition-colors duration-150 group-focus-within/field:text-[#2568BA]">
            <span>{language === "ID" ? "Pilihan Tanggal Demo" : "Preferred Demo Date"}</span>
            <span className="text-[10px] text-slate-400 font-normal">({language === "ID" ? "Opsional" : "Optional"})</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 group-focus-within/field:text-[#2568BA] transition-colors duration-150">
              <Calendar className="h-4 w-4" />
            </div>
            <input
              type="datetime-local"
              name="demoDate"
              value={formData.demoDate}
              onChange={handleChange}
              className="w-full h-10 rounded-xl border border-slate-200/90 bg-white pl-9 pr-3 text-xs sm:text-sm text-slate-800 transition-all duration-150 hover:border-slate-300 hover:bg-slate-50/30 focus:border-[#2568BA] focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
            />
          </div>
        </div>

        {/* Analyzer / Notes */}
        <div className="space-y-1 group/field">
          <label className="text-xs font-semibold text-slate-700 flex items-center justify-between transition-colors duration-150 group-focus-within/field:text-[#2568BA]">
            <span>{language === "ID" ? "Model Mesin / Kebutuhan" : "Active Analyzers / Notes"}</span>
            <span className="text-[10px] text-slate-400 font-normal">({language === "ID" ? "Opsional" : "Optional"})</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 group-focus-within/field:text-[#2568BA] transition-colors duration-150">
              <Activity className="h-4 w-4" />
            </div>
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
              className="w-full h-10 rounded-xl border border-slate-200/90 bg-white pl-9 pr-3 text-xs sm:text-sm text-slate-800 transition-all duration-150 hover:border-slate-300 hover:bg-slate-50/30 focus:border-[#2568BA] focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
            />
          </div>
          {errors.notes && <p className="text-[11px] text-rose-600">{errors.notes}</p>}
        </div>
      </div>

      {/* Submit Button & Security Note */}
      <div className="pt-1.5 space-y-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="group/btn relative w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2568BA] hover:bg-[#1D5496] px-6 text-sm font-semibold text-white shadow-sm hover:shadow-md hover:shadow-blue-500/20 transition-all duration-200 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>{language === "ID" ? "Memproses Permohonan..." : "Processing Request..."}</span>
            </>
          ) : (
            <>
              <span>{language === "ID" ? "Kirim Permohonan Live Demo" : "Request Live Demo"}</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
            </>
          )}
        </button>

        <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5 text-center font-normal">
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
        <span className="font-normal text-[11px]">
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

            {/* LEFT: Vibrant Bright Blue Feature Banner (Modern, Segar & Tidak Gelap) */}
            <div className="lg:col-span-5 relative rounded-[20px] sm:rounded-[24px] overflow-hidden bg-gradient-to-br from-[#2F77E3] via-[#2466CB] to-[#1A54B0] text-white p-6 sm:p-8 lg:p-9 xl:p-10 flex flex-col justify-between h-full shadow-inner">
              {/* Ambient glowing orbs (Bright & luminous) */}
              <div className="absolute -top-16 -left-16 w-80 h-80 rounded-full bg-[#60A5FA]/40 blur-3xl pointer-events-none" />
              <div className="absolute top-1/2 -right-16 w-80 h-80 rounded-full bg-[#38BDF8]/30 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 left-1/4 w-72 h-72 rounded-full bg-[#56ADE2]/35 blur-3xl pointer-events-none" />

              {/* Top Content */}
              <div className="relative z-10 space-y-3.5">
                <div>
                  <span className="inline-flex items-center rounded-full bg-white/15 border border-white/25 backdrop-blur-md px-3.5 py-1 text-xs font-medium text-white shadow-xs">
                    {language === "ID" ? "Platform Diagnostik Modern" : "Modern Diagnostic Platform"}
                  </span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl lg:text-[32px] xl:text-[36px] font-bold leading-tight text-white tracking-tight">
                  {language === "ID"
                    ? "Percepat & Otomasi Alur Kerja Laboratorium Anda"
                    : "Speed up your lab workflow with Diagnova LIS"}
                </h2>
                <p className="text-xs sm:text-sm text-blue-100/80 font-normal leading-relaxed pt-0.5">
                  {language === "ID"
                    ? "Satu platform terintegrasi untuk interfacing analyzer instan, verifikasi hasil berbasis AI, dan pelaporan nasional."
                    : "An all-in-one platform for analyzer interfacing, AI auto-verification, and seamless healthcare integration."}
                </p>

                {/* Value Metric Highlights: Compact 3-Column Bento Cards */}
                <div className="grid grid-cols-3 gap-2 sm:gap-2.5 pt-2">
                  {/* Metric 1: SATUSEHAT */}
                  <div className="rounded-xl bg-white/[0.10] hover:bg-white/[0.15] border border-white/20 backdrop-blur-md px-2.5 py-2 sm:px-3 sm:py-2.5 transition-all duration-200 group shadow-xs">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/15 text-blue-100 mb-1.5 group-hover:scale-105 transition-transform">
                      <ShieldCheck className="h-3.5 w-3.5" />
                    </span>
                    <div className="font-display text-sm sm:text-[15px] font-bold text-white tracking-tight leading-snug">100%</div>
                    <div className="text-[10px] sm:text-[10.5px] font-medium text-blue-100/85 leading-tight mt-0.5">
                      {language === "ID" ? "SATUSEHAT & SIMRS" : "SATUSEHAT & HIS"}
                    </div>
                  </div>

                  {/* Metric 2: 500+ Analyzers */}
                  <div className="rounded-xl bg-white/[0.10] hover:bg-white/[0.15] border border-white/20 backdrop-blur-md px-2.5 py-2 sm:px-3 sm:py-2.5 transition-all duration-200 group shadow-xs">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/15 text-blue-100 mb-1.5 group-hover:scale-105 transition-transform">
                      <Layers className="h-3.5 w-3.5" />
                    </span>
                    <div className="font-display text-sm sm:text-[15px] font-bold text-white tracking-tight leading-snug">500+</div>
                    <div className="text-[10px] sm:text-[10.5px] font-medium text-blue-100/85 leading-tight mt-0.5">
                      {language === "ID" ? "Model Analyzer" : "Clinical Analyzers"}
                    </div>
                  </div>

                  {/* Metric 3: Specialist Support */}
                  <div className="rounded-xl bg-white/[0.10] hover:bg-white/[0.15] border border-white/20 backdrop-blur-md px-2.5 py-2 sm:px-3 sm:py-2.5 transition-all duration-200 group shadow-xs">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/15 text-blue-100 mb-1.5 group-hover:scale-105 transition-transform">
                      <Users className="h-3.5 w-3.5" />
                    </span>
                    <div className="font-display text-sm sm:text-[15px] font-bold text-white tracking-tight leading-snug">1-on-1</div>
                    <div className="text-[10px] sm:text-[10.5px] font-medium text-blue-100/85 leading-tight mt-0.5">
                      {language === "ID" ? "Spesialis Aplikasi" : "Specialist Support"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Content: Infinite Trust Marquee with Logoipsum Logos */}
              <TrustMarquee language={language} />
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
