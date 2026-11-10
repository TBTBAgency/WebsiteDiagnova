"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Stethoscope,
  Microscope,
  Server,
  Building2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3,
  Clock,
  Sparkles,
  Lock,
  FileCheck2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { SectionBadge } from "@/components/ui/SectionBadge";

interface PersonaData {
  id: string;
  roleId: string;
  roleEn: string;
  shortTitleId: string;
  shortTitleEn: string;
  icon: React.ElementType;
  headlineId: string;
  headlineEn: string;
  descriptionId: string;
  descriptionEn: string;
  benefitsId: { title: string; desc: string }[];
  benefitsEn: { title: string; desc: string }[];
  kpiNumber: string;
  kpiLabelId: string;
  kpiLabelEn: string;
  widgetBadgeId: string;
  widgetBadgeEn: string;
  widgetTitleId: string;
  widgetTitleEn: string;
  widgetRowsId: { label: string; value: string; status: "success" | "info" | "warning" }[];
  widgetRowsEn: { label: string; value: string; status: "success" | "info" | "warning" }[];
}

const personas: PersonaData[] = [
  {
    id: "pathologist",
    roleId: "Dokter Spesialis Patologi (Sp.PK)",
    roleEn: "Clinical Pathologists (Sp.PK)",
    shortTitleId: "Spesialis Patologi",
    shortTitleEn: "Pathologists",
    icon: Stethoscope,
    headlineId: "Verifikasi Cepat Berbasis Delta-Check & E-Sign dari Mana Saja",
    headlineEn: "Rapid Delta-Check Verification & Mobile E-Signatures",
    descriptionId:
      "Fokus pada kasus kritis tanpa terbebani tumpukan hasil normal. Nova AI membandingkan nilai tes dengan riwayat masa lalu pasien, menandai deviasi drastis, dan memungkinkan validasi digital aman langsung dari tablet dokter.",
    descriptionEn:
      "Focus on critical outliers without sorting through mountains of normal results. Nova AI benchmarks values against historical baselines, flagging abnormal shifts for rapid e-signature from any clinician workstation.",
    benefitsId: [
      {
        title: "Penyaringan Kasus Normal Otomatis",
        desc: "Hasil dalam batas wajar dan lolos verifikasi delta langsung diproses sehingga dokter menghemat 65% waktu review harian.",
      },
      {
        title: "Peringatan Panic Value Real-Time",
        desc: "Notifikasi otomatis nilai kritis langsung ke ponsel/layar dokter DPJP dan IGD dalam hitungan detik.",
      },
      {
        title: "E-Signature Sah dengan Kode QR",
        desc: "Tanda tangan digital terenkripsi dengan hash kriptografis yang terverifikasi standar Permenkes 24/2022.",
      },
    ],
    benefitsEn: [
      {
        title: "Automated Normal Result Clearance",
        desc: "Specimens meeting clinical rules verify instantly, saving pathologists 65% of daily administrative review time.",
      },
      {
        title: "Real-Time Panic Value Alerts",
        desc: "Immediate broadcast of critical life-threatening values directly to attending physicians and ER terminals.",
      },
      {
        title: "Certified Digital E-Signatures",
        desc: "Cryptographically verified digital signatures with instant QR-code verification on patient lab reports.",
      },
    ],
    kpiNumber: "65%",
    kpiLabelId: "Penghematan Waktu Review Rutin",
    kpiLabelEn: "Routine Review Time Saved",
    widgetBadgeId: "Clinical Verification Queue",
    widgetBadgeEn: "Clinical Verification Queue",
    widgetTitleId: "Tinjauan Spesimen #DX-78190",
    widgetTitleEn: "Specimen Review #DX-78190",
    widgetRowsId: [
      { label: "Delta-Check Leukosit", value: "Lonjakan +45% dari baseline", status: "warning" },
      { label: "Hemoglobin (Hb)", value: "13.8 g/dL (Dalam Batas Normal)", status: "success" },
      { label: "Status Verifikasi", value: "Siap Validasi E-Sign Dokter", status: "info" },
    ],
    widgetRowsEn: [
      { label: "WBC Delta Shift", value: "+45% jump vs 3-month baseline", status: "warning" },
      { label: "Hemoglobin (Hb)", value: "13.8 g/dL (Normal Reference)", status: "success" },
      { label: "Verification Status", value: "Ready for Certified E-Sign", status: "info" },
    ],
  },
  {
    id: "lab-manager",
    roleId: "Kepala Laboratorium & Analis",
    roleEn: "Laboratory Directors & Analysts",
    shortTitleId: "Manajer & Analis",
    shortTitleEn: "Lab Managers",
    icon: Microscope,
    headlineId: "Monitor Turnaround Time per Shift & Kontrol Mutu QC Westgard",
    headlineEn: "Live Shift Turnaround Tracking & Westgard QC Automation",
    descriptionId:
      "Hilangkan antrean spesimen dan pencatatan kertas. Diagnova menghubungkan analyzer ke antrean sentrifugasi digital, mencatat waktu tunggu per tahap, dan memantau stok reagen secara otomatis.",
    descriptionEn:
      "Eliminate specimen backlogs and manual logbooks. Diagnova bridges analyzers into digital processing worklists, tracking stage-by-stage turnaround compliance with automated QC telemetry.",
    benefitsId: [
      {
        title: "Pangkas TAT Sampel Hingga 70%",
        desc: "Data analyzer langsung terkirim otomatis tanpa jeda ketik manual oleh petugas laboratorium.",
      },
      {
        title: "Pemantauan Multirule QC Westgard",
        desc: "Grafik Levey-Jennings terisi otomatis setiap shift; peringatan muncul jika terjadi violation rule 1-3s atau 2-2s.",
      },
      {
        title: "Manajemen Reagen Berbasis FEFO",
        desc: "Peringatan otomatis saat lot reagen mendekati batas minimum atau kadaluarsa untuk mencegah pemborosan biaya.",
      },
    ],
    benefitsEn: [
      {
        title: "Cut Specimen TAT by up to 70%",
        desc: "Direct analyzer interfacing removes transcription delays and eliminates operator typing backlogs.",
      },
      {
        title: "Automated Westgard Multirule QC",
        desc: "Levey-Jennings control charts update automatically each shift with instant warning on rule violations.",
      },
      {
        title: "FEFO Reagent Lifecycle Tracking",
        desc: "Early notifications when cartridge levels run low or approach expiry dates to prevent costly waste.",
      },
    ],
    kpiNumber: "-70%",
    kpiLabelId: "Penyusutan Waktu Tunggu Hasil (TAT)",
    kpiLabelEn: "Turnaround Time (TAT) Reduction",
    widgetBadgeId: "Operational Floor Telemetry",
    widgetBadgeEn: "Operational Floor Telemetry",
    widgetTitleId: "Metrik Shift Aktif Laboratorium",
    widgetTitleEn: "Active Shift Operations",
    widgetRowsId: [
      { label: "Kepatuhan TAT Cito IGD", value: "98.4% Selesai < 25 Menit", status: "success" },
      { label: "Kontrol Mutu Kimia Darah", value: "Westgard Multi-Rule: PASS", status: "success" },
      { label: "Throughput Harian", value: "1.420 Tabung Diproses", status: "info" },
    ],
    widgetRowsEn: [
      { label: "STAT ER Turnaround", value: "98.4% Completed < 25 Mins", status: "success" },
      { label: "Biochemistry QC Status", value: "Westgard Rules: ALL PASS", status: "success" },
      { label: "Daily Throughput", value: "1,420 Tubes Accessioned", status: "info" },
    ],
  },
  {
    id: "it-director",
    roleId: "Direktur IT & Tim SIMRS",
    roleEn: "IT Directors & Hospital CIOs",
    shortTitleId: "IT & SIMRS",
    shortTitleEn: "IT & CIOs",
    icon: Server,
    headlineId: "Interoperabilitas Standar HL7/FHIR & Buffer Edge Anti-Down",
    headlineEn: "Standardized HL7/FHIR Bridging & Zero-Loss Edge Buffering",
    descriptionId:
      "Arsitektur terintegrasi yang mudah dipelihara. Bridging dua arah ke SIMRS/RME tanpa kode khusus berulang, kepatuhan SATUSEHAT terjamin, dan toleransi offline hingga 72 jam menjaga operasional tetap berjalan meski jaringan rumah sakit terganggu.",
    descriptionEn:
      "Enterprise interoperability engineered for zero maintenance overhead. Native bidirectional HIS bridging, instant SATUSEHAT FHIR pipeline, and a 72-hour offline edge buffer ensuring zero data loss during network outages.",
    benefitsId: [
      {
        title: "Konektor Universal 500+ Instrumen",
        desc: "Dukungan penuh protokol ASTM E1381/E1394 dan HL7 v2.5 untuk Sysmex, Roche, Mindray, Abbott, dan Beckman.",
      },
      {
        title: "100% Siap SATUSEHAT Kemenkes RI",
        desc: "Format data otomatis dikonversi ke FHIR DiagnosticReport dan Observation sesuai standar regulasi nasional.",
      },
      {
        title: "Toleransi Jaringan Putus 72 Jam",
        desc: "Gateway edge menyimpan data lokal saat koneksi server terputus dan menyinkronkan kembali tanpa ada data hilang.",
      },
    ],
    benefitsEn: [
      {
        title: "Universal 500+ Instrument Connectors",
        desc: "Native drivers for ASTM E1381/E1394 and HL7 v2.5 covering Sysmex, Roche, Mindray, Abbott, and Beckman.",
      },
      {
        title: "Native MoH SATUSEHAT Pipeline",
        desc: "Automated real-time translation into FHIR DiagnosticReport and Observation resources.",
      },
      {
        title: "72-Hour Offline Edge Resilience",
        desc: "Local hardware buffer stores transmissions during hospital downtime, resyncing 100% of data packets.",
      },
    ],
    kpiNumber: "99.9%",
    kpiLabelId: "Uptime Sistem dengan Edge Buffer",
    kpiLabelEn: "System Uptime with Edge Buffer",
    widgetBadgeId: "Integration Health Monitor",
    widgetBadgeEn: "Integration Health Monitor",
    widgetTitleId: "Status Koneksi Bridging SIMRS",
    widgetTitleEn: "HIS Bridging Gateway Status",
    widgetRowsId: [
      { label: "Kanal SATUSEHAT FHIR", value: "Terhubung (Latency 42ms)", status: "success" },
      { label: "Driver Analyzer Bidirectional", value: "14 Unit Aktif Sinkron", status: "success" },
      { label: "Buffer Antrean Edge", value: "0 Paket Tertunda (Sinkron)", status: "info" },
    ],
    widgetRowsEn: [
      { label: "SATUSEHAT FHIR Pipe", value: "Connected (Latency 42ms)", status: "success" },
      { label: "Bidirectional Drivers", value: "14 Analyzers Live Syncing", status: "success" },
      { label: "Edge Buffer Cache", value: "0 Packets Queued (Synced)", status: "info" },
    ],
  },
  {
    id: "hospital-ceo",
    roleId: "Direktur Utama & Manajemen RS",
    roleEn: "Hospital C-Suite & Leadership",
    shortTitleId: "Direksi Rumah Sakit",
    shortTitleEn: "Hospital C-Suite",
    icon: Building2,
    headlineId: "Kesiapan Akreditasi KARS/JCI, Efisiensi Biaya & Kepuasan Pasien",
    headlineEn: "KARS/JCI Accreditation Readiness, Cost Efficiency & Patient Trust",
    descriptionId:
      "Transformasi laboratorium dari pusat biaya menjadi pendorong kepuasan klinis dan pendapatan. Mempercepat kepulangan pasien rawat inap melalui hasil lab yang lebih cepat, menjamin audit mutu tanpa cacat, dan meniadakan salah sampel.",
    descriptionEn:
      "Transform your clinical laboratory from a cost center into a core driver of patient satisfaction and revenue. Accelerate discharge times through faster diagnostics while ensuring flawless regulatory accreditation.",
    benefitsId: [
      {
        title: "Audit Trail Permanen Standar KARS & ISO",
        desc: "Seluruh riwayat aksi terekam dengan timestamp digital tidak dapat diubah, siap kapan saja diinspeksi asesor akreditasi.",
      },
      {
        title: "Zero Salah Sampel & Klaim Tertolak",
        desc: "Sistem verifikasi barcode ganda mencegah malpraktik sampel tertukar dan menghindari risiko gugatan hukum.",
      },
      {
        title: "Hasil Cepat Pasien & Kepuasan Tinggi",
        desc: "Hasil lab siap dikirim langsung via WhatsApp atau portal pasien dengan keamanan enkripsi data medis.",
      },
    ],
    benefitsEn: [
      {
        title: "Permanent Audit Trail for KARS/JCI",
        desc: "Every calibration and sign-off is logged with tamper-proof timestamps ready for accreditation audits.",
      },
      {
        title: "Zero Mix-Ups & Reduced Liability",
        desc: "Dual barcode verification eliminates specimen misidentification risks and prevents claim rejections.",
      },
      {
        title: "Digital Patient Results via WhatsApp",
        desc: "Secure, encrypted PDF delivery directly to patient smartphones, driving high hospital satisfaction.",
      },
    ],
    kpiNumber: "0 Error",
    kpiLabelId: "Risiko Spesimen Tertukar (Barcode 2D)",
    kpiLabelEn: "Sample Mix-Up Risk (2D Barcode)",
    widgetBadgeId: "Executive Governance",
    widgetBadgeEn: "Executive Governance",
    widgetTitleId: "Kepatuhan & Efisiensi Faskes",
    widgetTitleEn: "Clinical Governance & Efficiency",
    widgetRowsId: [
      { label: "Kepatuhan KARS & ISO 15189", value: "100% Audit-Ready", status: "success" },
      { label: "Rata-Rata Waktu Rilis Hasil", value: "28 Menit (Pangkas 70%)", status: "success" },
      { label: "Pengiriman Digital Pasien", value: "Otomatis via WhatsApp", status: "info" },
    ],
    widgetRowsEn: [
      { label: "KARS & ISO 15189 Readiness", value: "100% Audit-Ready", status: "success" },
      { label: "Average Diagnostic Release", value: "28 Mins (Cut by 70%)", status: "success" },
      { label: "Patient Digital Delivery", value: "Automated via WhatsApp", status: "info" },
    ],
  },
];

export function PersonaBenefitsSection() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<number>(0);

  const current = personas[activeTab];
  const CurrentIcon = current.icon;

  const benefits = language === "ID" ? current.benefitsId : current.benefitsEn;
  const widgetRows = language === "ID" ? current.widgetRowsId : current.widgetRowsEn;

  return (
    <section
      id="stakeholders"
      className="relative w-full bg-[#F5F8FC] py-16 sm:py-20 lg:py-24 border-t border-slate-200/70 overflow-hidden select-none content-auto"
    >
      {/* Ambient background soft light */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-blue-100/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-blue-50/60 blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
        {/* Section Header */}
        <div className="max-w-3xl mb-10 sm:mb-12">
          <div className="mb-3.5">
            <SectionBadge variant="blue" showDot>
              {language === "ID" ? "Nilai Strategis Multi-Peran" : "Role-Based Value"}
            </SectionBadge>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold leading-[1.18] sm:leading-[1.22] tracking-tight text-[#345DAB]">
            {language === "ID"
              ? "Solusi Terdedikasi untuk Setiap Peran di Laboratorium"
              : "Tailored for Every Stakeholder Across the Clinical Pipeline"}
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-500 font-light">
            {language === "ID"
              ? "Diagnova memahami bahwa laboratorium rumah sakit melibatkan berbagai pihak dengan tanggung jawab berbeda. Klik peran Anda di bawah untuk melihat dampak nyata pada alur kerja Anda."
              : "Modern clinical laboratories involve diverse stakeholders with specialized priorities. Select your role below to explore tangible impacts engineered for your daily responsibilities."}
          </p>
        </div>

        {/* 4 Interactive Persona Tab Switcher (Pill Shaped matching LigoLab) */}
        <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar pb-3 mb-8 sm:mb-10">
          {personas.map((p, idx) => {
            const Icon = p.icon;
            const isActive = activeTab === idx;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={cn(
                  "group relative inline-flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 border select-none overflow-hidden",
                  isActive
                    ? "bg-[#2764B8] text-white border-[#2764B8] shadow-md shadow-blue-500/20 active:scale-[0.98]"
                    : "bg-white text-slate-700 border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/80 hover:text-slate-900 shadow-2xs"
                )}
              >
                {isActive && <span className="animate-shine-continuous" />}
                <Icon
                  className={cn(
                    "h-4 w-4 transition-transform duration-200 group-hover:scale-110",
                    isActive ? "text-white" : "text-[#2764B8]"
                  )}
                />
                <span className="relative z-10">
                  {language === "ID" ? p.shortTitleId : p.shortTitleEn}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Showcase Card */}
        <div className="rounded-[28px] sm:rounded-[36px] bg-white border border-slate-200/90 p-6 sm:p-10 lg:p-12 shadow-[0_12px_40px_-15px_rgba(40,90,165,0.08)] transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Left Column: Narrative & Specific Benefits */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-xs font-semibold text-[#2764B8] mb-3">
                  <CurrentIcon className="h-3.5 w-3.5" />
                  <span>{language === "ID" ? current.roleId : current.roleEn}</span>
                </div>

                <h3 className="font-display text-2xl sm:text-3xl lg:text-[32px] font-bold text-slate-900 tracking-tight leading-tight">
                  {language === "ID" ? current.headlineId : current.headlineEn}
                </h3>

                <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed font-light">
                  {language === "ID" ? current.descriptionId : current.descriptionEn}
                </p>
              </div>

              {/* 3 Authentic Clinical Value Bullet Cards */}
              <div className="space-y-3 pt-1">
                {benefits.map((b, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-50/70 border border-slate-100 hover:bg-white hover:border-blue-200/70 hover:shadow-xs transition-all duration-200"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#EBF3FB] text-[#2764B8] shrink-0 mt-0.5">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                        {b.title}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed font-light">
                        {b.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Link */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/request-demo"
                  className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-[#2764B8] hover:bg-[#1E5299] px-6 py-2.5 sm:px-7 sm:py-3 text-xs sm:text-sm font-semibold text-white shadow-sm hover:shadow-md hover:shadow-blue-500/20 transition-all duration-200 active:scale-[0.98] overflow-hidden"
                >
                  <span className="animate-shine-continuous" />
                  <span className="relative z-10">
                    {language === "ID" ? "Jadwalkan Konsultasi Klinis" : "Schedule Role Walkthrough"}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1 relative z-10" />
                </Link>

                <div className="flex items-center gap-2 text-xs text-slate-500 font-light">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>{language === "ID" ? "Disesuaikan dengan SOP RS Anda" : "Tailored to your hospital SOP"}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Simulated Live Software UI Widget */}
            <div className="lg:col-span-5">
              <div className="rounded-[24px] bg-gradient-to-br from-[#1E3A8A] via-[#1D5496] to-[#0E234B] text-white p-6 sm:p-7 shadow-xl shadow-blue-900/15 border border-blue-400/20 relative overflow-hidden">
                {/* Background ambient lighting */}
                <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#56ADE2]/20 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-[#2764B8]/30 blur-3xl pointer-events-none" />

                {/* Widget Header */}
                <div className="relative z-10 flex items-center justify-between border-b border-white/15 pb-4 mb-5">
                  <div>
                    <span className="text-[10.5px] uppercase tracking-wider text-blue-200/90 font-semibold">
                      {language === "ID" ? current.widgetBadgeId : current.widgetBadgeEn}
                    </span>
                    <h4 className="font-display text-base font-bold text-white mt-0.5">
                      {language === "ID" ? current.widgetTitleId : current.widgetTitleEn}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                      {current.kpiNumber}
                    </span>
                    <p className="text-[10px] text-blue-200/80 leading-tight">
                      {language === "ID" ? current.kpiLabelId : current.kpiLabelEn}
                    </p>
                  </div>
                </div>

                {/* Simulated Telemetry Rows */}
                <div className="relative z-10 space-y-2.5">
                  {widgetRows.map((row, rIdx) => (
                    <div
                      key={rIdx}
                      className="p-3 rounded-xl bg-white/[0.08] border border-white/10 backdrop-blur-md flex items-center justify-between text-xs"
                    >
                      <span className="text-blue-100/90 font-light">{row.label}</span>
                      <span
                        className={cn(
                          "font-mono font-semibold px-2 py-0.5 rounded-md text-[11px]",
                          row.status === "success" && "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30",
                          row.status === "warning" && "bg-amber-500/20 text-amber-300 border border-amber-400/30",
                          row.status === "info" && "bg-blue-400/20 text-blue-200 border border-blue-400/30"
                        )}
                      >
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Widget Footer */}
                <div className="relative z-10 mt-5 pt-3 border-t border-white/15 flex items-center justify-between text-[11px] text-blue-200/80 font-light">
                  <span className="flex items-center gap-1.5">
                    <Lock className="h-3 w-3 text-blue-300" />
                    <span>HL7 & FHIR Native Security</span>
                  </span>
                  <span className="font-medium text-white">Live LIS Pipeline</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
