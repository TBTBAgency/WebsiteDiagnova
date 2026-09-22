"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, Phone, MapPin, CheckCircle2, AlertCircle, ArrowRight, Sparkles } from "lucide-react";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { Button } from "@/components/ui/Button";
import { demoRequestSchema } from "@/lib/validations";
import { InstitutionType } from "@/types";

function RequestDemoForm() {
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
        setSubmitMessage(data.message || "Gagal mengirim formulir. Silakan coba kembali.");
        if (data.errors) {
          const apiErrors: Record<string, string> = {};
          Object.keys(data.errors).forEach((key) => {
            apiErrors[key] = data.errors[key][0];
          });
          setErrors(apiErrors);
        }
      }
    } catch (err) {
      setSubmitMessage("Terjadi kendala jaringan. Mohon periksa koneksi internet Anda.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="text-center py-12 space-y-6 animate-in fade-in">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h3 className="font-display text-2xl font-bold text-diagnova-navy">
          Permohonan Demo Berhasil Dikirim!
        </h3>
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          {submitMessage}
        </p>
        <div className="pt-4">
          <Button
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
            variant="primary"
            size="md"
          >
            Kirim Permohonan Lain
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-diagnova-navy mb-1">
          Formulir Permohonan Demo
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Lengkapi data di bawah ini agar kami dapat menyiapkan skenario demo yang sesuai dengan laboratorium Anda.
        </p>
      </div>

      {submitMessage && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{submitMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Nama Lengkap *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="dr. Ahmad Fauzi, Sp.PK"
            className={`w-full rounded-xl border px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 ${
              errors.name
                ? "border-rose-300 ring-rose-200 bg-rose-50/20"
                : "border-slate-200 focus:border-diagnova-blue focus:ring-nova-blue/20"
            }`}
          />
          {errors.name && <p className="text-[11px] text-rose-600">{errors.name}</p>}
        </div>

        {/* Institution */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Nama Institusi / RS *</label>
          <input
            type="text"
            name="institution"
            value={formData.institution}
            onChange={handleChange}
            placeholder="RSUP / RSUD / Lab Sehat"
            className={`w-full rounded-xl border px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 ${
              errors.institution
                ? "border-rose-300 ring-rose-200 bg-rose-50/20"
                : "border-slate-200 focus:border-diagnova-blue focus:ring-nova-blue/20"
            }`}
          />
          {errors.institution && <p className="text-[11px] text-rose-600">{errors.institution}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Job Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Jabatan *</label>
          <input
            type="text"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            placeholder="Kepala Lab / IT / Direktur"
            className={`w-full rounded-xl border px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 ${
              errors.jobTitle
                ? "border-rose-300 ring-rose-200 bg-rose-50/20"
                : "border-slate-200 focus:border-diagnova-blue focus:ring-nova-blue/20"
            }`}
          />
          {errors.jobTitle && <p className="text-[11px] text-rose-600">{errors.jobTitle}</p>}
        </div>

        {/* Institution Type */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Jenis Institusi *</label>
          <select
            name="institutionType"
            value={formData.institutionType}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm transition-all focus:border-diagnova-blue focus:outline-none focus:ring-2 focus:ring-nova-blue/20"
          >
            <option value="hospital">Rumah Sakit (Umum / Khusus)</option>
            <option value="clinical-lab">Laboratorium Klinik Mandiri</option>
            <option value="pathology-center">Pusat Patologi Anatomi</option>
            <option value="microbiology-center">Laboratorium Mikrobiologi</option>
            <option value="blood-bank">Bank Darah / UTD</option>
            <option value="other">Institusi Lainnya</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Alamat Email Resmi *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="nama@rumahsakit.id"
            className={`w-full rounded-xl border px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 ${
              errors.email
                ? "border-rose-300 ring-rose-200 bg-rose-50/20"
                : "border-slate-200 focus:border-diagnova-blue focus:ring-nova-blue/20"
            }`}
          />
          {errors.email && <p className="text-[11px] text-rose-600">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">No. Telepon / WhatsApp *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="0812 3456 7890"
            className={`w-full rounded-xl border px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 ${
              errors.phone
                ? "border-rose-300 ring-rose-200 bg-rose-50/20"
                : "border-slate-200 focus:border-diagnova-blue focus:ring-nova-blue/20"
            }`}
          />
          {errors.phone && <p className="text-[11px] text-rose-600">{errors.phone}</p>}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700">
          Kebutuhan Khusus / Model Mesin Analyzer yang Digunakan (Opsional)
        </label>
        <textarea
          name="notes"
          rows={3}
          value={formData.notes}
          onChange={handleChange}
          placeholder="Contoh: Kami menggunakan Sysmex XN-550 dan Cobas c311, butuh integrasi ke SIMRS Khanza/Kustom..."
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm transition-all focus:border-diagnova-blue focus:outline-none focus:ring-2 focus:ring-nova-blue/20"
        />
        {errors.notes && <p className="text-[11px] text-rose-600">{errors.notes}</p>}
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={isSubmitting}
        className="w-full font-bold shadow-lg"
        icon={
          isSubmitting ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )
        }
      >
        {isSubmitting ? "Memproses..." : "Kirim Permohonan Live Demo"}
      </Button>
    </form>
  );
}

export default function RequestDemoPage() {
  return (
    <div className="pt-28 pb-20 bg-slate-50/60">
      {/* Subpage Header */}
      <section className="bg-gradient-to-br from-diagnova-deep via-diagnova-navy to-diagnova-blue py-16 text-white text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 max-w-3xl space-y-4">
          <SectionBadge variant="dark">Request Live Demo</SectionBadge>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white">
            See How Diagnova Can Work for Your Laboratory
          </h1>
          <p className="text-base sm:text-lg text-slate-200">
            Jadwalkan sesi demonstrasi langsung dan konsultasi integrasi LIS bersama tim spesialis kami.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Form with Suspense Boundary */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xl">
            <Suspense fallback={<div className="py-12 text-center text-sm text-slate-500">Memuat formulir demo...</div>}>
              <RequestDemoForm />
            </Suspense>
          </div>

          {/* Right Column: Contact info & Trust Signals */}
          <div className="lg:col-span-5 space-y-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm space-y-6">
              <h3 className="font-display text-xl font-bold text-diagnova-navy">
                Hubungi Langsung Tim Konsultan Kami
              </h3>

              <div className="space-y-4 text-sm">
                <a
                  href="mailto:hello@tibatibagency.com"
                  className="flex items-center gap-3 text-slate-700 hover:text-diagnova-blue transition-colors p-3 rounded-xl bg-slate-50"
                >
                  <Mail className="h-5 w-5 text-diagnova-blue shrink-0" />
                  <div>
                    <span className="block text-xs text-slate-400">Email Resmi</span>
                    <span className="font-semibold">hello@tibatibagency.com</span>
                  </div>
                </a>

                <a
                  href="tel:081991070928"
                  className="flex items-center gap-3 text-slate-700 hover:text-diagnova-blue transition-colors p-3 rounded-xl bg-slate-50"
                >
                  <Phone className="h-5 w-5 text-nova-blue shrink-0" />
                  <div>
                    <span className="block text-xs text-slate-400">Telepon &amp; WhatsApp Sales</span>
                    <span className="font-semibold">0819 9107 0928</span>
                  </div>
                </a>

                <div className="flex items-start gap-3 text-slate-700 p-3 rounded-xl bg-slate-50">
                  <MapPin className="h-5 w-5 text-diagnova-blue shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs text-slate-400">Cakupan Wilayah</span>
                    <span className="text-xs leading-relaxed">
                      Implementasi On-Premise &amp; Cloud di Seluruh Rumah Sakit Indonesia.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Why Request Demo Callout */}
            <div className="rounded-3xl border border-diagnova-light bg-gradient-to-br from-diagnova-ice/60 to-white p-8 shadow-sm space-y-4">
              <h4 className="font-display text-base font-bold text-diagnova-navy flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-nova-blue" />
                <span>Yang Anda Dapatkan di Sesi Demo:</span>
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Simulasi alur spesimen &amp; barcode tracking live</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Uji coba Nova AI: interpretasi otomatis &amp; delta check</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Kajian teknis bridging SIMRS &amp; analyzer spesifik RS Anda</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
