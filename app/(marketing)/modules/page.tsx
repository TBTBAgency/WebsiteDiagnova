"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Activity,
  HeartPulse,
  PackageCheck,
  Microscope,
  FlaskConical,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Cpu,
  Layers,
  Database,
  Check,
  Clock,
  Sparkles,
  ChevronRight,
  FileCheck2,
  Network,
  QrCode,
  Thermometer,
  AlertTriangle,
  Zap,
  SlidersHorizontal,
  BadgeCheck,
  FileText,
  BarChart2,
  FolderGit2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { PageHero } from "@/components/sections/PageHero";
import { CTABanner } from "@/components/sections/CTABanner";

// ─── HIGH-FIDELITY MEDICAL WORKSTATION PREVIEW (ZERO AI SLOP, REAL CLINICAL LIS UI) ───
function ModuleWorkstationPreview({
  moduleId,
  language,
}: {
  moduleId: string;
  language: "ID" | "EN";
}) {
  return (
    <div className="rounded-[24px] bg-white border border-slate-200/90 shadow-sm overflow-hidden flex flex-col">
      {/* 1. Header Bar: Real Medical Station Diagnostic Header */}
      <div className="bg-[#0B1A30] text-white px-5 py-3.5 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse ring-4 ring-emerald-400/20 shrink-0" />
          <span className="font-mono text-[11px] font-semibold text-slate-200 tracking-wider uppercase truncate">
            {moduleId === "routine-hematology" && "Sysmex XN-1000 • Direct ASTM"}
            {moduleId === "blood-bank" && "BDRS Core • ISBT-128 Gateway"}
            {moduleId === "inventory-reagent" && "Smart Reagent Telemetry • Rack-02"}
            {moduleId === "pathology" && "PA Synoptic Suite • Micro-Scan"}
            {moduleId === "microbiology" && "CLSI M100 • Automated AST Incubator"}
          </span>
        </div>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/12 text-blue-200 border border-white/20 shrink-0">
          {moduleId === "routine-hematology" && "ASTM E1381"}
          {moduleId === "blood-bank" && "ISBT 128"}
          {moduleId === "inventory-reagent" && "FEFO Control"}
          {moduleId === "pathology" && "ICD-O-3"}
          {moduleId === "microbiology" && "CLSI 2024"}
        </span>
      </div>

      {/* 2. Realistic Clinical Station Content */}
      <div className="p-5 sm:p-6 space-y-4 bg-gradient-to-b from-slate-50/60 to-white flex-1">
        {/* MODULE 1: ROUTINE & HEMATOLOGY */}
        {moduleId === "routine-hematology" && (
          <div className="space-y-3.5">
            {/* Specimen Banner */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-blue-50/70 border border-blue-200/60 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#1E5299] bg-white px-2 py-0.5 rounded border border-blue-200">
                  #LAB-2026-8841
                </span>
                <span className="text-slate-800 font-semibold">
                  {language === "ID" ? "Ny. Siti Rahma (46 th)" : "Mrs. Siti Rahma (46 y/o)"}
                </span>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                CITO IGD • Bedside Barcode ✓
              </span>
            </div>

            {/* Test Results Table with Real Clinical Parameters */}
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden text-xs">
              <div className="grid grid-cols-12 bg-slate-100/80 px-3 py-2 text-[11px] font-bold text-slate-600 border-b border-slate-200">
                <span className="col-span-4">{language === "ID" ? "Parameter" : "Analyte"}</span>
                <span className="col-span-3 text-right">{language === "ID" ? "Hasil" : "Result"}</span>
                <span className="col-span-3 text-right">{language === "ID" ? "Rujukan" : "Reference"}</span>
                <span className="col-span-2 text-right">{language === "ID" ? "Status" : "Flag"}</span>
              </div>
              <div className="divide-y divide-slate-100">
                <div className="grid grid-cols-12 px-3 py-2 items-center">
                  <span className="col-span-4 font-semibold text-slate-800">WBC (Leukosit)</span>
                  <span className="col-span-3 text-right font-mono font-bold text-slate-900">7.82 10³/µL</span>
                  <span className="col-span-3 text-right font-mono text-slate-500">4.50 - 11.00</span>
                  <span className="col-span-2 text-right">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Normal</span>
                  </span>
                </div>
                <div className="grid grid-cols-12 px-3 py-2 items-center">
                  <span className="col-span-4 font-semibold text-slate-800">Hemoglobin (HGB)</span>
                  <span className="col-span-3 text-right font-mono font-bold text-slate-900">14.1 g/dL</span>
                  <span className="col-span-3 text-right font-mono text-slate-500">13.0 - 17.5</span>
                  <span className="col-span-2 text-right">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Normal</span>
                  </span>
                </div>
                <div className="grid grid-cols-12 px-3 py-2 items-center">
                  <span className="col-span-4 font-semibold text-slate-800">Trombosit (PLT)</span>
                  <span className="col-span-3 text-right font-mono font-bold text-slate-900">248 10³/µL</span>
                  <span className="col-span-3 text-right font-mono text-slate-500">150 - 450</span>
                  <span className="col-span-2 text-right">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Normal</span>
                  </span>
                </div>
                <div className="grid grid-cols-12 px-3 py-2 items-center bg-amber-50/50">
                  <span className="col-span-4 font-bold text-amber-900">CRP Kuantitatif</span>
                  <span className="col-span-3 text-right font-mono font-bold text-rose-600">18.4 mg/L</span>
                  <span className="col-span-3 text-right font-mono text-slate-500">&lt; 5.0</span>
                  <span className="col-span-2 text-right">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">HIGH</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Validation & Delta-Check Telemetry */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between text-slate-700">
              <div className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="font-medium">
                  {language === "ID" ? "QC Levey-Jennings: In-Control (Westgard 1-2s)" : "Levey-Jennings QC: In-Control (Westgard 1-2s)"}
                </span>
              </div>
              <span className="font-mono text-[11px] font-bold text-[#1E5299] bg-white px-2 py-0.5 rounded border border-slate-200">
                Delta Check: -1.8%
              </span>
            </div>
          </div>
        )}

        {/* MODULE 2: BLOOD BANK (BDRS) */}
        {moduleId === "blood-bank" && (
          <div className="space-y-3.5">
            {/* Bag Info & Cold Storage Status */}
            <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200/60 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-rose-900 bg-white px-2 py-0.5 rounded border border-rose-200">
                  =W0123 26 123456 00
                </span>
                <span className="font-bold text-[11px] text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-300">
                  {language === "ID" ? "Suhu 4.1°C (Aman 2°-6°C)" : "Temp 4.1°C (Safe 2°-6°C)"}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="font-semibold text-slate-900">Packed Red Cells (PRC) Leucodepleted</span>
                <span className="font-mono font-extrabold text-rose-700 text-sm">Golongan O+</span>
              </div>
            </div>

            {/* Electronic Crossmatching Protocol */}
            <div className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-2.5 text-xs">
              <p className="font-bold text-slate-900 text-[11px] uppercase tracking-wider">
                {language === "ID" ? "Protokol Uji Silang Serasi Elektronik:" : "Electronic Crossmatching Protocol:"}
              </p>
              <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
                  <span className="text-slate-700">{language === "ID" ? "Mayor (Donor RBC):" : "Major (Donor RBC):"}</span>
                  <span className="font-bold text-emerald-700">Kompatibel (-)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
                  <span className="text-slate-700">{language === "ID" ? "Minor (Pasien RBC):" : "Minor (Pt RBC):"}</span>
                  <span className="font-bold text-emerald-700">Kompatibel (-)</span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                <span>{language === "ID" ? "Verifikasi Dokter Sp.PK:" : "Clinical Pathologist Sign-off:"}</span>
                <span className="font-semibold text-slate-900">dr. Rahadian, Sp.PK (PIN Digital ✓)</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
              <span className="text-slate-600">{language === "ID" ? "Masa Simpan FEFO:" : "FEFO Expiry:"}</span>
              <span className="font-semibold text-slate-800">18 Des 2026 (14 hari tersisa) • Bag Reserved</span>
            </div>
          </div>
        )}

        {/* MODULE 3: INVENTORY & REAGENT INTELLIGENCE */}
        {moduleId === "inventory-reagent" && (
          <div className="space-y-3.5">
            {/* Live Reagent Level Gauge */}
            <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-200/60 text-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">Sysmex Cellpack DCL (20L Box)</span>
                <span className="font-mono font-bold text-sky-800 bg-white px-2 py-0.5 rounded border border-sky-200">
                  LOT-202609A
                </span>
              </div>
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1">
                  <span>{language === "ID" ? "Sisa Volume:" : "Volume Remaining:"}</span>
                  <span className="font-bold font-mono text-slate-900">82% (410 / 500 tes)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full bg-[#2764B8] rounded-full transition-all" style={{ width: "82%" }} />
                </div>
              </div>
            </div>

            {/* Automated Depletion & Low Stock Warning */}
            <div className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-800">Cobas ISE Internal Standard</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  {language === "ID" ? "Sisa 14% • Kritis" : "14% Left • Low Stock"}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-900">
                {language === "ID"
                  ? "✓ Purchase Order (PO-26-084) otomatis diterbitkan ke distributor rekanan."
                  : "✓ Purchase Order (PO-26-084) automatically drafted to authorized vendor."}
              </div>
            </div>

            {/* Granular Cost-Per-Test Metric */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
              <span className="text-slate-600">{language === "ID" ? "Estimasi Biaya per Tes:" : "Real Cost-per-Test:"}</span>
              <span className="font-bold font-mono text-[#1E5299] text-sm">
                Rp 8.450 <span className="text-[11px] font-normal text-emerald-600">(-24% vs manual)</span>
              </span>
            </div>
          </div>
        )}

        {/* MODULE 4: ANATOMICAL PATHOLOGY */}
        {moduleId === "pathology" && (
          <div className="space-y-3.5">
            {/* Cassette 2D Barcode Chain */}
            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/60 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-[#1E5299] bg-white px-2 py-0.5 rounded border border-blue-200">
                  BIO-PA-26-0914-1A
                </span>
                <span className="font-bold text-[11px] text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300">
                  Grossing ✓ • HE Stained ✓
                </span>
              </div>
              <p className="font-semibold text-slate-900">
                {language === "ID" ? "Biopsi Eksisi Jaringan Mammae Sinistra" : "Left Breast Excisional Biopsy Tissue"}
              </p>
            </div>

            {/* Synoptic Structured Diagnostic (ICD-O-3 & Bethesda) */}
            <div className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-2 text-xs">
              <p className="font-bold text-slate-900 text-[11px] uppercase tracking-wider">
                {language === "ID" ? "Pelaporan Terstruktur Standar ICD-O-3:" : "Standardized ICD-O-3 Synoptic Report:"}
              </p>
              <div className="space-y-1.5 font-mono text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">Topography:</span>
                  <span className="font-bold text-slate-800">C50.9 (Breast, NOS)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Morphology:</span>
                  <span className="font-bold text-[#1E5299]">8500/3 (Infiltrating duct carcinoma)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Surgical Margin:</span>
                  <span className="font-bold text-emerald-700">Tumor-free (&gt; 5mm)</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between text-slate-700">
              <span>{language === "ID" ? "Foto Mikroskop Tersemat:" : "Microscopic Photos:"}</span>
              <span className="font-semibold text-slate-900">4 Slide Kaca Digital (HE 400x) ✓</span>
            </div>
          </div>
        )}

        {/* MODULE 5: MICROBIOLOGY & ANTIBIOTIC STEWARDSHIP */}
        {moduleId === "microbiology" && (
          <div className="space-y-3.5">
            {/* Culture Identification Banner */}
            <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200/60 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-teal-900 bg-white px-2 py-0.5 rounded border border-teal-200">
                  MIC-2026-4402
                </span>
                <span className="font-bold text-[11px] text-teal-800 bg-teal-100/80 px-2.5 py-0.5 rounded-full border border-teal-300">
                  Inkubasi 18 Jam • VITEK-2 Link
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="font-semibold text-slate-900">Sputum ICU Bed 04</span>
                <span className="font-mono font-bold text-teal-950 italic">Klebsiella pneumoniae</span>
              </div>
            </div>

            {/* AST Sensitivity Panel (CLSI M100 Rules) */}
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden text-xs">
              <div className="grid grid-cols-12 bg-slate-100/80 px-3 py-1.5 text-[11px] font-bold text-slate-600 border-b border-slate-200">
                <span className="col-span-5">Antibiotik</span>
                <span className="col-span-4 text-right">MIC (µg/mL)</span>
                <span className="col-span-3 text-right">CLSI Interp</span>
              </div>
              <div className="divide-y divide-slate-100 font-mono text-[11px]">
                <div className="grid grid-cols-12 px-3 py-1.5 items-center">
                  <span className="col-span-5 font-semibold text-slate-800">Meropenem</span>
                  <span className="col-span-4 text-right text-slate-600">&le; 0.25</span>
                  <span className="col-span-3 text-right font-bold text-emerald-700">Sensitif (S)</span>
                </div>
                <div className="grid grid-cols-12 px-3 py-1.5 items-center">
                  <span className="col-span-5 font-semibold text-slate-800">Amikacin</span>
                  <span className="col-span-4 text-right text-slate-600">&le; 2.0</span>
                  <span className="col-span-3 text-right font-bold text-emerald-700">Sensitif (S)</span>
                </div>
                <div className="grid grid-cols-12 px-3 py-1.5 items-center bg-rose-50/60">
                  <span className="col-span-5 font-bold text-rose-900">Ceftriaxone</span>
                  <span className="col-span-4 text-right text-rose-700">&ge; 64.0</span>
                  <span className="col-span-3 text-right font-bold text-rose-700">Resisten (R)</span>
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] flex items-center justify-between text-slate-700">
              <span>{language === "ID" ? "Peta Antibiogram:" : "Antibiogram Sync:"}</span>
              <span className="font-semibold text-teal-800">Tersinkronisasi Komite PPRA RS ✓</span>
            </div>
          </div>
        )}
      </div>

      {/* 3. Footer Impact Metrics Strip */}
      <div className="border-t border-slate-200/80 bg-white p-4 sm:p-5 grid grid-cols-2 gap-3">
        {moduleId === "routine-hematology" && (
          <>
            <div className="p-3 rounded-xl bg-[#F8FBFE] border border-blue-100/70">
              <span className="font-display text-2xl font-bold text-[#1E5299] block tracking-tight">-70%</span>
              <span className="text-xs font-semibold text-slate-700 block mt-0.5 leading-snug">
                {language === "ID" ? "Turnaround Time (TAT)" : "Turnaround Time"}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#F8FBFE] border border-blue-100/70">
              <span className="font-display text-2xl font-bold text-[#1E5299] block tracking-tight">0 Error</span>
              <span className="text-xs font-semibold text-slate-700 block mt-0.5 leading-snug">
                {language === "ID" ? "Salah Ketik Manual" : "Zero Typing Errors"}
              </span>
            </div>
          </>
        )}
        {moduleId === "blood-bank" && (
          <>
            <div className="p-3 rounded-xl bg-[#F8FBFE] border border-blue-100/70">
              <span className="font-display text-2xl font-bold text-rose-700 block tracking-tight">0 Error</span>
              <span className="text-xs font-semibold text-slate-700 block mt-0.5 leading-snug">
                {language === "ID" ? "Salah Kantong Darah" : "Zero Transfusion Mix-ups"}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#F8FBFE] border border-blue-100/70">
              <span className="font-display text-2xl font-bold text-rose-700 block tracking-tight">-45%</span>
              <span className="text-xs font-semibold text-slate-700 block mt-0.5 leading-snug">
                {language === "ID" ? "Darah Kedaluwarsa" : "Blood Bag Wastage"}
              </span>
            </div>
          </>
        )}
        {moduleId === "inventory-reagent" && (
          <>
            <div className="p-3 rounded-xl bg-[#F8FBFE] border border-blue-100/70">
              <span className="font-display text-2xl font-bold text-sky-700 block tracking-tight">0 Kali</span>
              <span className="text-xs font-semibold text-slate-700 block mt-0.5 leading-snug">
                {language === "ID" ? "Habis di Tengah Shift" : "Zero Mid-shift Stockouts"}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#F8FBFE] border border-blue-100/70">
              <span className="font-display text-2xl font-bold text-sky-700 block tracking-tight">20%</span>
              <span className="text-xs font-semibold text-slate-700 block mt-0.5 leading-snug">
                {language === "ID" ? "Efisiensi Belanja Reagen" : "Procurement Savings"}
              </span>
            </div>
          </>
        )}
        {moduleId === "pathology" && (
          <>
            <div className="p-3 rounded-xl bg-[#F8FBFE] border border-blue-100/70">
              <span className="font-display text-2xl font-bold text-[#1E5299] block tracking-tight">Zero Error</span>
              <span className="text-xs font-semibold text-slate-700 block mt-0.5 leading-snug">
                {language === "ID" ? "Spesimen Tertukar" : "Specimen Mix-ups"}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#F8FBFE] border border-blue-100/70">
              <span className="font-display text-2xl font-bold text-[#1E5299] block tracking-tight">&lt; 1 Mnt</span>
              <span className="text-xs font-semibold text-slate-700 block mt-0.5 leading-snug">
                {language === "ID" ? "Temu Arsip Slide/Blok" : "Slide Archive Search"}
              </span>
            </div>
          </>
        )}
        {moduleId === "microbiology" && (
          <>
            <div className="p-3 rounded-xl bg-[#F8FBFE] border border-blue-100/70">
              <span className="font-display text-2xl font-bold text-teal-700 block tracking-tight">2x Cepat</span>
              <span className="text-xs font-semibold text-slate-700 block mt-0.5 leading-snug">
                {language === "ID" ? "Rekomendasi Terapi" : "Empirical to Targeted"}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#F8FBFE] border border-blue-100/70">
              <span className="font-display text-2xl font-bold text-teal-700 block tracking-tight">100%</span>
              <span className="text-xs font-semibold text-slate-700 block mt-0.5 leading-snug">
                {language === "ID" ? "Kepatuhan PPRA RS" : "PPRA Audit Ready"}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ModulesPage() {
  const { language } = useLanguage();
  const [selectedModule, setSelectedModule] = useState<number>(0);

  // Sync tab with URL hash if present
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        const foundIndex = modules.findIndex((m) => m.id === hash);
        if (foundIndex !== -1) {
          setSelectedModule(foundIndex);
        }
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const modules = [
    {
      id: "routine-hematology",
      icon: Activity,
      color: "#2764B8",
      accentBg: "bg-blue-50 text-[#2764B8] border-blue-200/60",
      tabLabel: language === "ID" ? "Rutin & Hematologi" : "Routine & Hematology",
      targetDept:
        language === "ID"
          ? "Patologi Klinik & Hematologi"
          : "Clinical Pathology & Hematology",
      name: language === "ID" ? "Hematologi & Kimia Klinik" : "Routine & Hematology",
      tagline:
        language === "ID"
          ? "Otomasi Pemeriksaan Darah & Kimia Klinik Bervolume Tinggi"
          : "High-Throughput Blood & Clinical Chemistry Automation",
      description:
        language === "ID"
          ? "Menghubungkan instrumen analyzer hematologi dan kimia klinik secara langsung. Order dokter otomatis berubah menjadi worklist mesin, dan hasil diverifikasi tanpa entri data manual."
          : "Directly connects hematology and clinical chemistry analyzers. Physician orders instantly populate machine worklists, and results are verified with zero manual entry.",
      highlights: [
        {
          title: language === "ID" ? "Interfacing Analyzer ASTM/HL7" : "Bidirectional ASTM/HL7",
          desc: language === "ID" ? "Tarik hasil otomatis dari 200+ jenis analyzer tanpa middleware pihak ketiga." : "Direct result capture from 200+ analyzer models with no extra middleware.",
        },
        {
          title: language === "ID" ? "Pengecekan Delta & Panic Value" : "Delta Check & Panic Alert",
          desc: language === "ID" ? "Mendeteksi lonjakan nilai abnormal antar-kunjungan dan memberi peringatan seketika." : "Flags longitudinal biomarker shifts and alerts physicians in real time.",
        },
        {
          title: language === "ID" ? "Quality Control Levey-Jennings" : "Levey-Jennings QC Rules",
          desc: language === "ID" ? "Pemantauan kontrol kualitas internal dengan Westgard rules otomatis." : "Automated internal quality control charts following Westgard rules.",
        },
      ],
      metrics: [
        { val: "-70%", label: language === "ID" ? "Turnaround Time (TAT)" : "Turnaround Time (TAT)" },
        { val: "0 Error", label: language === "ID" ? "Salah Ketik Nilai" : "Manual Typing Error" },
      ],
    },
    {
      id: "blood-bank",
      icon: HeartPulse,
      color: "#E11D48",
      accentBg: "bg-rose-50 text-rose-600 border-rose-200/60",
      tabLabel: language === "ID" ? "Bank Darah (BDRS)" : "Blood Bank (BDRS)",
      targetDept:
        language === "ID"
          ? "Bank Darah Rumah Sakit (BDRS) & UTD"
          : "Hospital Blood Bank & Transfusion Unit",
      name: language === "ID" ? "Manajemen Bank Darah (BDRS)" : "Blood Bank Management",
      tagline:
        language === "ID"
          ? "Transfusi Aman dengan Kontrol Rantai Dingin & Uji Silang Serasi"
          : "Safe Transfusion with Cold-Chain Telemetry & Crossmatching",
      description:
        language === "ID"
          ? "Melacak siklus kantong darah dari penerimaan donor hingga transfusi ke pasien. Menghilangkan risiko inkompatibilitas ABO/Rh dengan verifikasi ganda dan memantau masa simpan FEFO."
          : "Tracks blood bags from donation receipt to patient bedside transfusion. Prevents ABO/Rh incompatibility via dual verification and minimizes wastage with FEFO inventory.",
      highlights: [
        {
          title: language === "ID" ? "Verifikasi Uji Silang Serasi" : "Electronic Crossmatching",
          desc: language === "ID" ? "Validasi ganda hasil uji cocok serasi sebelum darah dikeluarkan ke bangsal." : "Dual-verification crossmatching protocol before blood release to wards.",
        },
        {
          title: language === "ID" ? "Pemantauan Rantai Dingin 24/7" : "24/7 Cold-Chain Telemetry",
          desc: language === "ID" ? "Log suhu penyimpanan 2°C - 6°C terpantau otomatis untuk menjaga kualitas darah." : "Automated 2°C - 6°C temperature logging ensuring blood component integrity.",
        },
        {
          title: language === "ID" ? "Pelabelan Standar ISBT 128" : "ISBT 128 Bag Tracking",
          desc: language === "ID" ? "Barcode kantong terstandar internasional, mencegah darah tertukar." : "International barcoding standard for seamless traceability and zero mix-ups.",
        },
      ],
      metrics: [
        { val: "Zero Error", label: language === "ID" ? "Inkompatibilitas Darah" : "Transfusion Mismatch" },
        { val: "-45%", label: language === "ID" ? "Darah Kedaluwarsa Terbuang" : "Expired Blood Wastage" },
      ],
    },
    {
      id: "inventory-reagent",
      icon: PackageCheck,
      color: "#0284C7",
      accentBg: "bg-sky-50 text-sky-600 border-sky-200/60",
      tabLabel: language === "ID" ? "Inventaris & Reagen" : "Inventory & Reagent",
      targetDept:
        language === "ID"
          ? "Logistik & Pengadaan Reagen Medis"
          : "Laboratory Logistics & Reagent Supply",
      name: language === "ID" ? "Inventaris & Reagen Pintar" : "Inventory & Reagent Intelligence",
      tagline:
        language === "ID"
          ? "Stok Reagen Selalu Terpantau, Tanpa Kehabisan di Tengah Shift"
          : "Real-Time Reagent Telemetry, Zero Mid-Shift Stockouts",
      description:
        language === "ID"
          ? "Mengurangi stok reagen secara otomatis setiap kali instrumen selesai menjalankan tes. Memberikan alarm stok menipis sebelum habis dan melacak tanggal kedaluwarsa secara presisi."
          : "Depletes reagent volumes automatically as tests complete on analyzers. Issues early warnings before shortages occur and tracks lot numbers and open-vial stability.",
      highlights: [
        {
          title: language === "ID" ? "Pengurangan Stok Otomatis" : "Test-Driven Depletion",
          desc: language === "ID" ? "Sisa reagen terpotong proporsional dengan jumlah tes yang dilaporkan mesin." : "Reagent volume auto-deducted directly from reported analyzer test counts.",
        },
        {
          title: language === "ID" ? "Alarm Stok Menipis (Threshold)" : "Low-Stock Early Warning",
          desc: language === "ID" ? "Notifikasi proaktif sebelum stok kritis agar shift malam berjalan lancar." : "Proactive alerts ahead of critical thresholds to protect overnight shifts.",
        },
        {
          title: language === "ID" ? "Kalkulasi Biaya per Tes" : "Cost-per-Test Analytics",
          desc: language === "ID" ? "Analitik biaya bahan habis pakai yang transparan untuk efisiensi anggaran lab." : "Granular operational cost analytics to optimize lab procurement budget.",
        },
      ],
      metrics: [
        { val: language === "ID" ? "0 Kali" : "0 Stockouts", label: language === "ID" ? "Kehabisan Reagen di Shift" : "Mid-Shift Stockout" },
        { val: "20%", label: language === "ID" ? "Penghematan Belanja Reagen" : "Procurement Savings" },
      ],
    },
    {
      id: "pathology",
      icon: Microscope,
      color: "#345DAB",
      accentBg: "bg-blue-50 text-[#345DAB] border-blue-200/60",
      tabLabel: language === "ID" ? "Patologi Anatomi" : "Anatomical Pathology",
      targetDept:
        language === "ID"
          ? "Instalasi Patologi Anatomi & Sitologi"
          : "Anatomical Pathology & Cytology",
      name: language === "ID" ? "Patologi Anatomi & Sitologi" : "Anatomical Pathology",
      tagline:
        language === "ID"
          ? "Pelacakan Barcode 2D pada Kaset Jaringan & Laporan Terstruktur"
          : "2D Barcode Tissue Tracking & Standardized Synoptic Reporting",
      description:
        language === "ID"
          ? "Mencegah tertukarnya spesimen biopsi jaringan dengan barcode mikro 2D pada setiap kaset dan slide kaca. Mendukung dokter spesialis patologi menyusun diagnosa terstandar ICD-O dan Bethesda."
          : "Eliminates tissue mix-ups using 2D micro-barcodes across cassettes and glass slides. Supports pathologists with standardized ICD-O and Bethesda synoptic reporting.",
      highlights: [
        {
          title: language === "ID" ? "Pelacakan Kaset & Slide Kaca" : "Cassette & Slide Barcoding",
          desc: language === "ID" ? "Jejak spesimen mulai dari makroskopi, pemotongan, hingga pengecatan HE." : "Strict specimen chain-of-custody from grossing, microtomy, to HE staining.",
        },
        {
          title: language === "ID" ? "Template ICD-O & Bethesda" : "Structured Synoptic Templates",
          desc: language === "ID" ? "Format pelaporan baku internasional untuk histopatologi dan sitologi." : "Standardized reporting formats for histopathology and fine needle cytology.",
        },
        {
          title: language === "ID" ? "Pencarian Arsip Blok Cepat" : "Instant Archival Retrieval",
          desc: language === "ID" ? "Akses riwayat biopsi pasien sebelumnya dalam hitungan detik untuk perbandingan." : "Instant access to prior biopsy history for comparative diagnostic review.",
        },
      ],
      metrics: [
        { val: "Zero Error", label: language === "ID" ? "Spesimen Tertukar" : "Specimen Mix-up" },
        { val: language === "ID" ? "< 1 Menit" : "< 1 Min", label: language === "ID" ? "Pencarian Arsip Blok/Slide" : "Archive Retrieval" },
      ],
    },
    {
      id: "microbiology",
      icon: FlaskConical,
      color: "#0D9488",
      accentBg: "bg-teal-50 text-teal-700 border-teal-200/60",
      tabLabel: language === "ID" ? "Mikrobiologi & PPRA" : "Microbiology & PPRA",
      targetDept:
        language === "ID"
          ? "Mikrobiologi Klinik & Komite PPRA"
          : "Clinical Microbiology & Stewardship",
      name: language === "ID" ? "Mikrobiologi & PPRA Kemenkes" : "Microbiology & Antibiotic Stewardship",
      tagline:
        language === "ID"
          ? "Kultur Bakteri, Uji Sensitivitas & Peta Antibiogram Rumah Sakit"
          : "Culture Incubation, Susceptibility Testing & Antibiogram Matrix",
      description:
        language === "ID"
          ? "Mengelola inkubasi kultur bakteri, membaca zona hambat antibiotik dengan pedoman CLSI/EUCAST, dan menghasilkan grafik Antibiogram kumulatif berkala untuk mendukung Program PPRA rumah sakit."
          : "Manages bacterial culture incubation, interprets AST panels under CLSI/EUCAST rules, and compiles automated cumulative hospital Antibiograms for antibiotic stewardship.",
      highlights: [
        {
          title: language === "ID" ? "Pembangkit Antibiogram Otomatis" : "Cumulative Antibiogram Engine",
          desc: language === "ID" ? "Peta pola resistensi kuman rumah sakit yang diperbarui secara otomatis." : "Automated pathogen resistance pattern mapping across inpatient wards.",
        },
        {
          title: language === "ID" ? "Peringatan Dini Kuman Resisten" : "MDRO / ESBL Early Alert",
          desc: language === "ID" ? "Peringatan seketika saat terdeteksi kuman multiresisten (MRSA, ESBL, CRE)." : "Instant notification upon detection of multi-drug resistant pathogens.",
        },
        {
          title: language === "ID" ? "Integrasi Mesin Kultur Otomatis" : "Automated Culture Integration",
          desc: language === "ID" ? "Terhubung ke instrumen identifikasi kuman terkemuka (VITEK, BACTEC, Phoenix)." : "Direct interfacing to leading automated ID/AST instruments (VITEK, Phoenix).",
        },
      ],
      metrics: [
        { val: language === "ID" ? "2x Cepat" : "2x Faster", label: language === "ID" ? "Rekomendasi Terapi Tepat" : "Definitive Therapy Speed" },
        { val: "100%", label: language === "ID" ? "Kepatuhan PPRA Kemenkes" : "Stewardship Compliance" },
      ],
    },
  ];

  // Directory Catalog Items: 5 Core Modules + 1 Custom Specialty Gateway = Perfectly Balanced 3x2 Grid (6 Cards)
  const directoryItems = [
    ...modules,
    {
      id: "custom-gateway",
      icon: Cpu,
      color: "#1E5299",
      accentBg: "bg-blue-50 text-[#1E5299] border-blue-200/60",
      tabLabel: language === "ID" ? "Kustomisasi & Gateway" : "Custom Gateway",
      targetDept:
        language === "ID"
          ? "Lab Khusus, Genomik & Rujukan"
          : "Specialized, Molecular & Reference Labs",
      name: language === "ID" ? "Gateway & Alur Kerja Khusus" : "Custom Gateway & Specialty LIS",
      tagline:
        language === "ID"
          ? "Integrasi Khusus untuk Instrumen Molekuler, PCR & Alur Mandiri"
          : "Proprietary Bridging for Molecular Instruments & Custom Diagnostics",
      description:
        language === "ID"
          ? "Memiliki instrumen khusus (PCR, sequencing, flow cytometry) atau alur kerja proprietary? Tim engineer Diagnova menyediakan parser HL7/ASTM kustom dan integrasi tanpa batasan vendor."
          : "Operating proprietary equipment (PCR, NGS sequencing, flow cytometry)? Diagnova engineers craft custom ASTM/HL7/JSON parsers tailored directly to your institution's protocol.",
      highlights: [
        {
          title: language === "ID" ? "Parser HL7 / ASTM / JSON Khusus" : "Custom HL7/ASTM/JSON Parsers",
          desc: language === "ID" ? "Dukungan parser instrumen unik tanpa batasan tipe analyzer." : "Universal parsing engine supporting non-standard analyzer data formats.",
        },
        {
          title: language === "ID" ? "SLA Penerapan 14 Hari Kerja" : "14-Day Deployment SLA",
          desc: language === "ID" ? "Implementasi cepat didampingi spesialis interfacing medis berpengalaman." : "Expedited integration driven by experienced clinical interfacing engineers.",
        },
        {
          title: language === "ID" ? "Satu Rekam Medis Pasien Terpadu" : "Unified Single EMR Record",
          desc: language === "ID" ? "Seluruh hasil instrumen khusus otomatis masuk ke satu timeline pasien." : "All specialized diagnostic outputs converge into one patient medical history.",
        },
      ],
      metrics: [
        { val: "500+", label: language === "ID" ? "Model Alat Didukung" : "Analyzers Supported" },
        { val: "100%", label: language === "ID" ? "Kepemilikan Data RS" : "Hospital Data Ownership" },
      ],
    },
  ];

  const current = modules[selectedModule];
  const CurrentIcon = current.icon;

  return (
    <div className="w-full bg-white text-slate-800">
      {/* ══════════════════════════════════════════════════════════════
          HERO SECTION: Standardized PageHero (Clean Medical SaaS)
          ══════════════════════════════════════════════════════════════ */}
      <PageHero
        badge={language === "ID" ? "Modul Terintegrasi Diagnova" : "Diagnova Modular Suite"}
        title={
          language === "ID" ? (
            <>
              Modul Spesialisasi yang{" "}
              <br className="hidden sm:inline" />
              Saling Terhubung Tanpa Hambatan
            </>
          ) : (
            <>
              Connected Modules for{" "}
              <br className="hidden sm:inline" />
              Specialized Laboratory Care
            </>
          )
        }
        subtitle={
          language === "ID"
            ? "Aktifkan modul sesuai kebutuhan faskes Anda atau jalankan sebagai satu kesatuan. Seluruh data pasien, sampel, dan hasil mengalir dalam satu sistem yang aman dan siap akreditasi."
            : "Deploy individual modules or run the complete unified suite. All patient data, specimens, and analyzer results converge in a secure, accreditation-ready environment."
        }
        primaryCta={{
          text: language === "ID" ? "Jadwalkan Demo Modul" : "Schedule Module Demo",
          href: "/request-demo",
        }}
        secondaryCta={{
          text: language === "ID" ? "Eksplorasi 5 Modul" : "Explore 5 Modules",
          href: "#modules-explorer",
        }}
        metrics={[
          {
            value: language === "ID" ? "5 Modul" : "5 Modules",
            label: language === "ID" ? "Spesialisasi Lengkap" : "Dedicated Modules",
            sub: language === "ID" ? "Rutin, BDRS, Stok, PA, Mikro" : "Hematology, Blood, Reagents, PA",
          },
          {
            value: "100%",
            label: language === "ID" ? "Interfacing Analyzer" : "Analyzer Interfacing",
            sub: language === "ID" ? "ASTM & HL7 bidireksional" : "Direct bidirectional protocol",
          },
          {
            value: "0 Error",
            label: language === "ID" ? "Salah Identifikasi" : "Zero Sample Mix-ups",
            sub: language === "ID" ? "Barcode 2D & delta-check" : "2D micro-barcode tracking",
          },
          {
            value: "Plug & Play",
            label: language === "ID" ? "Aktivasi Modular" : "Modular Activation",
            sub: language === "ID" ? "Bebas tambah modul bertahap" : "Deploy on-demand per dept",
          },
        ]}
      />

      {/* ══════════════════════════════════════════════════════════════
          INTERACTIVE MODULE EXPLORER (FOCUS ON UX & SCANNABILITY)
          ══════════════════════════════════════════════════════════════ */}
      <section id="modules-explorer" className="w-full bg-[#FAFBFD] py-14 sm:py-18 lg:py-22 border-t border-slate-200/60">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          {/* Section Header */}
          <div className="max-w-2xl mb-8 sm:mb-10">
            <div className="mb-3.5">
              <SectionBadge variant="blue">
                {language === "ID" ? "Workstation Interaktif" : "Interactive Station"}
              </SectionBadge>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-[38px] font-bold text-slate-900 tracking-tight leading-[1.2]">
              {language === "ID" ? "Eksplorasi Kapabilitas Setiap Modul" : "Explore Each Dedicated Module"}
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
              {language === "ID"
                ? "Pilih modul di bawah untuk melihat ringkasan fungsi, protokol klinis, dan visual simulasi antarmuka stasiun kerja Diagnova secara langsung."
                : "Select any module below to inspect core clinical protocols, operational automations, and direct workstation interface telemetry."}
            </p>
          </div>

          {/* 5 Sleek Capsule Tab Selector Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar pb-3 mb-8 sm:mb-10">
            {modules.map((m, idx) => {
              const Icon = m.icon;
              const isActive = selectedModule === idx;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedModule(idx)}
                  className={cn(
                    "inline-flex items-center gap-2.5 px-4.5 sm:px-5.5 py-3 rounded-full text-xs sm:text-[13.5px] font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 border",
                    isActive
                      ? "bg-[#2466CB] text-white border-[#2466CB] shadow-[0_4px_16px_rgba(36,102,203,0.24)]"
                      : "bg-white text-slate-700 border-slate-200/90 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300"
                  )}
                >
                  <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-white" : "text-[#2466CB]")} />
                  <span>{m.tabLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Master Detail Focus Showcase Card */}
          <div className="rounded-[28px] sm:rounded-[36px] bg-white border border-slate-200/90 p-6 sm:p-9 lg:p-12 shadow-[0_12px_40px_-15px_rgba(15,23,42,0.06)] transition-all">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-14 items-center">
              {/* Left Column: Clear Scannable Facts */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  {/* Department Badge & Icon */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-11 w-11 rounded-2xl bg-[#EBF3FB] text-[#2466CB] flex items-center justify-center shadow-2xs border border-blue-100">
                      <CurrentIcon className="h-5.5 w-5.5" />
                    </div>
                    <span className="text-xs font-semibold text-[#1E5299] bg-blue-50 border border-blue-200/70 px-3 py-1 rounded-full">
                      {current.targetDept}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl lg:text-[34px] font-bold text-slate-900 tracking-tight leading-[1.2]">
                    {current.name}
                  </h3>
                  <p className="mt-2 text-sm sm:text-base font-semibold text-[#2466CB] leading-relaxed">
                    {current.tagline}
                  </p>
                  <p className="mt-2.5 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                    {current.description}
                  </p>
                </div>

                {/* 3 Core Highlights (Easily Scannable) */}
                <div className="space-y-3 pt-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {language === "ID" ? "Kapabilitas Utama & Regulasi:" : "Core Capabilities & Compliance:"}
                  </h4>
                  <div className="space-y-2.5">
                    {current.highlights.map((h, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F8FBFE] border border-blue-100/80 shadow-2xs"
                      >
                        <CheckCircle2 className="h-4 w-4 text-[#2466CB] shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs sm:text-[13.5px] font-semibold text-slate-900">
                            {h.title}
                          </p>
                          <p className="text-xs text-slate-600 font-normal mt-0.5 leading-relaxed">
                            {h.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Action with continuous shine */}
                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Link
                    href="/request-demo"
                    className="group relative inline-flex items-center gap-2 rounded-full bg-[#2466CB] hover:bg-[#1E5299] text-white px-7 py-3.5 text-sm font-semibold shadow-xs hover:shadow-md transition-all active:scale-[0.98] overflow-hidden"
                  >
                    <span className="animate-shine-continuous" />
                    <span className="relative z-10">{language === "ID" ? "Minta Demo Modul Ini" : "Request Module Demo"}</span>
                    <ArrowRight className="h-4 w-4 relative z-10 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <a
                    href={`#${current.id}`}
                    className="text-xs font-semibold text-slate-600 hover:text-[#2466CB] transition-colors"
                  >
                    {language === "ID" ? "Lihat Posisi di Katalog ↓" : "View in Catalog ↓"}
                  </a>
                </div>
              </div>

              {/* Right Column: Clean High-Fidelity Software Workstation Preview */}
              <div className="lg:col-span-5">
                <ModuleWorkstationPreview moduleId={current.id} language={language} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          COMPLETE MODULE DIRECTORY (BALANCED 6-CARD 3x2 GRID)
          5 Core Modules + 1 Custom Specialty Gateway = ZERO EMPTY SLOTS
          ══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-white py-16 sm:py-20 lg:py-24 border-t border-slate-200/60">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          {/* Header */}
          <div className="max-w-3xl mb-12 sm:mb-14">
            <div className="mb-4">
              <SectionBadge variant="blue">
                {language === "ID" ? "Katalog Modul Lengkap" : "Complete Module Catalog"}
              </SectionBadge>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] font-bold leading-[1.18] tracking-tight text-slate-900">
              {language === "ID" ? (
                <>Arsitektur 5 Modul Inti &amp; Gateway Khusus</>
              ) : (
                <>5 Core Clinical Modules &amp; Specialty Gateway</>
              )}
            </h2>
            <p className="mt-3 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-600 font-normal">
              {language === "ID"
                ? "Daftar spesifikasi ringkas dan cakupan alur kerja untuk memudahkan evaluasi tim medis, kepala laboratorium, dan manajemen rumah sakit."
                : "A structured overview designed for effortless evaluation by laboratory directors, medical specialists, and hospital IT leadership."}
            </p>
          </div>

          {/* Symmetrical 3x2 Grid (6 Cards Total) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7 items-stretch">
            {directoryItems.map((m, idx) => {
              const Icon = m.icon;
              const isCustom = m.id === "custom-gateway";

              return (
                <div
                  key={m.id}
                  id={m.id}
                  className={cn(
                    "scroll-mt-32 rounded-[28px] p-7 transition-all duration-200 flex flex-col justify-between border",
                    isCustom
                      ? "bg-gradient-to-br from-[#F5F9FF] to-[#EBF3FB] border-[#2466CB]/40 shadow-xs hover:border-[#2466CB]"
                      : "bg-white border-slate-200/90 shadow-xs hover:border-[#2466CB]/60 hover:shadow-sm"
                  )}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={cn(
                        "h-12 w-12 rounded-2xl flex items-center justify-center shadow-2xs border",
                        isCustom
                          ? "bg-[#2466CB] text-white border-[#2466CB]"
                          : "bg-[#EBF3FB] text-[#2466CB] border-blue-100"
                      )}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className={cn(
                        "text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border",
                        isCustom
                          ? "bg-[#2466CB] text-white border-[#2466CB]"
                          : "bg-slate-100 text-slate-500 border-slate-200"
                      )}>
                        MOD-0{idx + 1}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-[#1E5299] bg-blue-50 border border-blue-200/60 px-2.5 py-0.5 rounded-full inline-block mb-2">
                        {m.targetDept}
                      </span>
                      <h3 className="font-display text-xl font-bold text-slate-900 leading-snug">
                        {m.name}
                      </h3>
                      <p className="text-xs text-slate-600 font-normal leading-relaxed mt-2 line-clamp-3">
                        {m.description}
                      </p>
                    </div>

                    {/* Quick Highlights */}
                    <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-700">
                      {m.highlights.slice(0, 3).map((h, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-[#2466CB] shrink-0" />
                          <span className="font-medium line-clamp-1">{h.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                    {!isCustom ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedModule(idx);
                          const lenis = typeof window !== "undefined" ? (window as unknown as { lenis?: { scrollTo: (y: number, opts: unknown) => void } }).lenis : null;
                          if (lenis) {
                            lenis.scrollTo(350, { duration: 1 });
                          } else {
                            window.scrollTo({ top: 350, behavior: "smooth" });
                          }
                        }}
                        className="text-xs font-semibold text-[#2466CB] hover:text-[#1E5299] transition-colors cursor-pointer"
                      >
                        {language === "ID" ? "Buka di Explorer ↑" : "Open in Explorer ↑"}
                      </button>
                    ) : (
                      <span className="text-xs font-semibold text-[#2466CB]">
                        {language === "ID" ? "Kustomisasi Bebas" : "Tailored Architecture"}
                      </span>
                    )}

                    <Link
                      href={isCustom ? "/request-demo?module=custom" : "/request-demo"}
                      className={cn(
                        "inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full transition-all",
                        isCustom
                          ? "bg-[#2466CB] text-white hover:bg-[#1E5299]"
                          : "text-slate-700 hover:text-[#2466CB] hover:bg-slate-50"
                      )}
                    >
                      <span>{isCustom ? (language === "ID" ? "Konsultasi" : "Consult") : "Demo"}</span>
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3: ARCHITECTURE (UNIFIED DATA, NO SILOS)
          ══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-[#FAFBFD] py-16 sm:py-20 lg:py-24 border-t border-slate-200/60">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            <div className="lg:col-span-5 space-y-4">
              <SectionBadge variant="blue">
                {language === "ID" ? "Arsitektur Tanpa Silo" : "Zero Data Silos"}
              </SectionBadge>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[38px] font-bold text-slate-900 tracking-tight leading-[1.2]">
                {language === "ID" ? (
                  <>Satu Pasien, Satu Basis Data Laboratorium Terpadu</>
                ) : (
                  <>Single Patient ID, One Unified Laboratory Database</>
                )}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                {language === "ID"
                  ? "Walaupun setiap modul menangani alur kerja spesifik, seluruh data bermuara pada satu pusat data Diagnova. Dokter dapat melihat hasil darah rutin, riwayat transfusi, dan laporan patologi dalam satu rekam medis terpadu tanpa fragmentasi sistem."
                  : "Even with department-specific workflows, all clinical data converges into Diagnova's unified clinical registry. Physicians review routine hematology, blood bank logs, and pathology reports in one seamless patient timeline."}
              </p>
              <div className="pt-2">
                <Link
                  href="/platform"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#2466CB] hover:text-[#1E5299] transition-colors"
                >
                  <span>{language === "ID" ? "Pelajari Arsitektur Platform Diagnova" : "Explore Diagnova Platform Architecture"}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="p-6 rounded-[24px] bg-white border border-slate-200/90 shadow-2xs space-y-3">
                <div className="h-11 w-11 rounded-2xl bg-[#EBF3FB] text-[#2466CB] flex items-center justify-center border border-blue-100">
                  <Database className="h-5.5 w-5.5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  {language === "ID" ? "Single Medical Record" : "Single Patient Record"}
                </h4>
                <p className="text-xs text-slate-600 font-normal leading-relaxed">
                  {language === "ID"
                    ? "Eliminasi duplikasi data pasien antar instalasi lab sentral, IGD, poliklinik, dan BDRS."
                    : "Zero duplicate records across central lab, ER, outpatient wards, and transfusion units."}
                </p>
              </div>

              <div className="p-6 rounded-[24px] bg-white border border-slate-200/90 shadow-2xs space-y-3">
                <div className="h-11 w-11 rounded-2xl bg-[#EBF3FB] text-[#2466CB] flex items-center justify-center border border-blue-100">
                  <Cpu className="h-5.5 w-5.5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  {language === "ID" ? "Smart Gateway Buffer" : "Smart Gateway Buffer"}
                </h4>
                <p className="text-xs text-slate-600 font-normal leading-relaxed">
                  {language === "ID"
                    ? "Satu pintu komunikasi untuk seluruh instrumen analyzer dengan buffer offline aman saat jaringan down."
                    : "Universal gateway for all analyzers equipped with resilient offline buffering during network blips."}
                </p>
              </div>

              <div className="p-6 rounded-[24px] bg-white border border-slate-200/90 shadow-2xs space-y-3">
                <div className="h-11 w-11 rounded-2xl bg-[#EBF3FB] text-[#2466CB] flex items-center justify-center border border-blue-100">
                  <FileCheck2 className="h-5.5 w-5.5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  {language === "ID" ? "Kepatuhan KARS & ISO" : "Regulatory Compliance"}
                </h4>
                <p className="text-xs text-slate-600 font-normal leading-relaxed">
                  {language === "ID"
                    ? "Jejak audit digital otomatis siap diuji oleh asesor akreditasi KARS, JCI, dan ISO 15189 setiap saat."
                    : "Immutable digital audit trail ready for KARS, JCI, and ISO 15189 surveys anytime."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          BOTTOM CTA SECTION: Seamlessly connects to Footer
          ══════════════════════════════════════════════════════════════ */}
      <CTABanner bgClassName="bg-[#FAFBFD]" topColor="#FAFBFD" />
    </div>
  );
}
