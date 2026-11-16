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
import { cn } from "@/lib/utils";
import { useCmsText, visibleItems } from "@/lib/cms/text";
import type { PageContentOf } from "@/lib/cms/types";
import type { requestDemoPage } from "@/content/pages/request-demo";

type RequestDemoContent = PageContentOf<typeof requestDemoPage>;
type TrustContent = NonNullable<RequestDemoContent["trust"]>;
type FormContent = NonNullable<RequestDemoContent["form"]>;

// ─── Trust Marquee using Exact Home Page Logos & Slow-Down Hover Animation ───
function TrustMarquee({ content }: { content: TrustContent }) {
  const t = useCmsText();
  const marqueeRef = useRef<HTMLDivElement>(null);
  const logos = visibleItems(content.logos);

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
    <div className="relative z-10 pt-4 mt-auto border-t border-blue-200/70 overflow-hidden">
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

      <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-2.5">
        {t(content.label)}
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
          {[...logos, ...logos].map((logo, idx) => (
            <div
              key={idx}
              className="flex items-center justify-center shrink-0 opacity-60 hover:opacity-100 transition-all duration-300 select-none cursor-default"
            >
              <Image
                src={logo.logoUrl}
                alt={logo.alt}
                width={140}
                height={40}
                loading="eager"
                className="h-6 sm:h-7 md:h-8 w-auto object-contain brightness-0"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RequestDemoForm({ content }: { content: FormContent }) {
  const t = useCmsText();
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
            t(content.errorSubmitFailed)
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
        t(content.errorNetwork)
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
            {t(content.successTitle)}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            {submitMessage}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2">
          <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            {t(content.successNextStepsTitle)}
          </p>
          <ul className="text-xs text-slate-600 space-y-1.5 font-normal">
            {visibleItems(content.successNextSteps).map((step) => (
              <li key={step.id} className="flex items-start gap-2">
                <Check className="h-3.5 w-3.5 text-[#2568BA] shrink-0 mt-0.5" />
                <span>
                  {t(step.text)}
                </span>
              </li>
            ))}
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
            {t(content.successResetLabel)}
          </button>
          <Link
            href={content.successExploreHref}
            className="rounded-full bg-[#2568BA] px-5 py-2 text-xs font-semibold text-white hover:bg-[#1D5496] transition-colors"
          >
            {t(content.successExploreLabel)}
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
          {t(content.title)}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
          {t(content.subtitle)}
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
            <span>{t(content.fields.name.label)}</span>
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
              placeholder={t(content.fields.name.placeholder)}
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
            <span>{t(content.fields.jobTitle.label)}</span>
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
              placeholder={t(content.fields.jobTitle.placeholder)}
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
            <span>{t(content.fields.email.label)}</span>
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
              placeholder={t(content.fields.email.placeholder)}
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
            <span>{t(content.fields.phone.label)}</span>
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
              placeholder={t(content.fields.phone.placeholder)}
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
            <span>{t(content.fields.institution.label)}</span>
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
              placeholder={t(content.fields.institution.placeholder)}
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
            <span>{t(content.fields.institutionType.label)}</span>
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
              {visibleItems(content.institutionTypeOptions).map((option) => (
                <option key={option.id} value={option.value}>{t(option.label)}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Preferred Date */}
        <div className="space-y-1 group/field">
          <label className="text-xs font-semibold text-slate-700 flex items-center justify-between transition-colors duration-150 group-focus-within/field:text-[#2568BA]">
            <span>{t(content.fields.demoDate.label)}</span>
            <span className="text-[10px] text-slate-400 font-normal">({t(content.optionalLabel)})</span>
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
            <span>{t(content.fields.notes.label)}</span>
            <span className="text-[10px] text-slate-400 font-normal">({t(content.optionalLabel)})</span>
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
              placeholder={t(content.fields.notes.placeholder)}
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
              <span>{t(content.submittingLabel)}</span>
            </>
          ) : (
            <>
              <span>{t(content.submitLabel)}</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
            </>
          )}
        </button>

        <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5 text-center font-normal">
          <Lock className="h-3 w-3 text-slate-400 shrink-0" />
          <span>
            {t(content.privacyNote)}
          </span>
        </p>
      </div>

      {/* Direct Contact Links */}
      <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
        <span className="font-normal text-[11px]">
          {t(content.contactPrompt)}
        </span>
        <div className="flex items-center gap-4 font-medium text-[#2568BA] text-xs">
          <a href={content.contactEmailHref} className="flex items-center gap-1 hover:underline">
            <Mail className="h-3 w-3" />
            <span>{content.contactEmail}</span>
          </a>
          <a
            href={content.contactPhoneHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:underline"
          >
            <Phone className="h-3 w-3" />
            <span>{content.contactPhone}</span>
          </a>
        </div>
      </div>
    </form>
  );
}

export function RequestDemoPageView({ content }: { content: RequestDemoContent }) {
  const t = useCmsText();

  return (
    <main
      className="relative w-full lg:h-[100dvh] min-h-[660px] bg-[#F4F6F9] flex flex-col justify-center pt-[calc(76px+var(--announcement-bar-height,0px))] lg:pt-[calc(96px+var(--announcement-bar-height,0px))] pb-4 lg:pb-5 transition-[padding-top] duration-300 ease-in-out"
    >
      {/* Outer Card with Exact Standard Width max-w-[1560px] px-5 sm:px-6 lg:px-10 Matching Navbar & Site Content */}
      <div className="mx-auto w-full max-w-[1560px] px-5 sm:px-6 lg:px-10 h-full flex flex-col justify-center">
        <div className="w-full h-full bg-white rounded-[24px] sm:rounded-[32px] p-3 sm:p-4 lg:p-5 xl:p-6 shadow-[0_12px_40px_-15px_rgba(15,23,42,0.07)] border border-slate-200/80 flex flex-col justify-center overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 xl:gap-8 h-full items-stretch">

            {/* LEFT: Luminous Diagnova Blue Gradient Feature Banner (Matching PageHero) */}
            <div className="lg:col-span-5 relative rounded-[20px] sm:rounded-[24px] overflow-hidden bg-gradient-to-br from-[#DCEBFA] via-[#ECF4FD] to-[#F8FBFF] border border-blue-200/70 shadow-[0_14px_40px_-14px_rgba(37,104,186,0.10)] text-slate-900 p-6 sm:p-8 lg:p-9 xl:p-10 flex flex-col justify-between h-full">
              {/* Multi-layer Ambient Blue Gradient Glows */}
              <div className="absolute -top-24 -right-16 w-80 h-80 rounded-full bg-[#56ADE2]/25 blur-[95px] pointer-events-none z-0" />
              <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-[#2764B8]/12 blur-[95px] pointer-events-none z-0" />
              <div className="absolute -bottom-24 left-1/4 w-72 h-72 rounded-full bg-[#93C5FD]/25 blur-[90px] pointer-events-none z-0" />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/70 via-white/20 to-transparent pointer-events-none z-0" />

              {/* Top Content */}
              {content.intro && (
              <div className="relative z-10 space-y-3.5">
                <div>
                  <span className="inline-flex items-center rounded-full bg-white/80 border border-blue-200/80 backdrop-blur-md px-3.5 py-1 text-xs font-semibold text-[#1E5299] shadow-xs">
                    {t(content.intro.badge)}
                  </span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl lg:text-[32px] xl:text-[36px] font-bold leading-tight text-slate-900 tracking-tight">
                  {t(content.intro.title)}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed pt-0.5">
                  {t(content.intro.description)}
                </p>
              </div>
              )}

              {/* Bottom Content: Infinite Trust Marquee with Logoipsum Logos */}
              {content.trust && <TrustMarquee content={content.trust} />}
            </div>

            {/* RIGHT: Clean Form Area (Matching Screenshot) */}
            {content.form && (
            <div className="lg:col-span-7 flex flex-col justify-center p-2 sm:p-4 lg:p-6 xl:p-8 h-full">
              <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-slate-100" />}>
                <RequestDemoForm content={content.form} />
              </Suspense>
            </div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}
