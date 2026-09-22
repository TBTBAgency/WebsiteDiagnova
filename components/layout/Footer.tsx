import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, ArrowUpRight, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-diagnova-deep text-slate-300 pt-16 pb-12 border-t border-white/10">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-diagnova-blue/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 h-80 w-80 rounded-full bg-nova-blue/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5 pb-12 border-b border-white/10">
          {/* Col 1: Brand Info & Contacts */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 text-white">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-diagnova-blue via-nova-blue to-white p-0.5">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-diagnova-navy font-display text-base font-black text-white">
                  <span className="text-nova-blue">§</span>
                  <span className="font-extrabold text-white">D</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-xl font-bold tracking-wider text-white">
                  DIAGNOVA
                </span>
                <span className="text-[10px] font-medium uppercase tracking-widest text-nova-light/90 -mt-1">
                  Laboratory Intelligence Platform
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Solusi manajemen laboratorium medis end-to-end yang menjamin akurasi data,
              efisiensi operasional, dan kecepatan penyampaian hasil analisis klinis bagi
              Rumah Sakit &amp; Laboratorium Modern.
            </p>

            <div className="space-y-2.5 pt-2 text-sm">
              <a
                href="mailto:hello@tibatibagency.com"
                className="flex items-center gap-2.5 text-slate-300 hover:text-nova-blue transition-colors"
              >
                <Mail className="h-4 w-4 text-nova-blue shrink-0" />
                <span>hello@tibatibagency.com</span>
              </a>
              <a
                href="tel:081991070928"
                className="flex items-center gap-2.5 text-slate-300 hover:text-nova-blue transition-colors"
              >
                <Phone className="h-4 w-4 text-nova-blue shrink-0" />
                <span>0819 9107 0928</span>
              </a>
              <div className="flex items-start gap-2.5 text-slate-400 text-xs">
                <MapPin className="h-4 w-4 text-nova-blue shrink-0 mt-0.5" />
                <span>Jakarta, Indonesia — Melayani Implementasi LIS Seluruh Indonesia</span>
              </div>
            </div>
          </div>

          {/* Col 2: Platform Links */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/platform" className="hover:text-nova-blue transition-colors">
                  Overview
                </Link>
              </li>
              <li>
                <Link href="/platform/workflow" className="hover:text-nova-blue transition-colors">
                  End-to-End Workflow
                </Link>
              </li>
              <li>
                <Link href="/platform/automation" className="hover:text-nova-blue transition-colors">
                  100% Automation &amp; Barcode
                </Link>
              </li>
              <li>
                <Link href="/platform/reporting" className="hover:text-nova-blue transition-colors">
                  Digital Audit Trail
                </Link>
              </li>
              <li>
                <Link href="/platform/analytics" className="hover:text-nova-blue transition-colors">
                  Lab Intelligence Analytics
                </Link>
              </li>
              <li>
                <Link href="/nova-ai" className="inline-flex items-center gap-1 text-nova-light hover:text-white font-medium">
                  <span>Nova AI Copilot</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Solutions & Modules */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white mb-4">
              Solusi &amp; Modul
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/solutions/hospital-laboratory" className="hover:text-nova-blue transition-colors">
                  Hospital Laboratory
                </Link>
              </li>
              <li>
                <Link href="/solutions/clinical-laboratory" className="hover:text-nova-blue transition-colors">
                  Clinical Laboratory
                </Link>
              </li>
              <li>
                <Link href="/modules/routine-hematology" className="hover:text-nova-blue transition-colors">
                  Routine &amp; Hematology
                </Link>
              </li>
              <li>
                <Link href="/modules/blood-bank" className="hover:text-nova-blue transition-colors">
                  Blood Bank Management
                </Link>
              </li>
              <li>
                <Link href="/modules/inventory-reagent" className="hover:text-nova-blue transition-colors">
                  Inventory &amp; Reagent
                </Link>
              </li>
              <li>
                <Link href="/modules/pathology" className="hover:text-nova-blue transition-colors">
                  Anatomical Pathology
                </Link>
              </li>
              <li>
                <Link href="/modules/microbiology" className="hover:text-nova-blue transition-colors">
                  Microbiology &amp; PPRA
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Integrations & Demo */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white mb-4">
              Integrasi &amp; Kontak
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/integration/simrs-his" className="hover:text-nova-blue transition-colors">
                  SIMRS / HIS Native Bridging
                </Link>
              </li>
              <li>
                <Link href="/integration/rme" className="hover:text-nova-blue transition-colors">
                  Rekam Medis Elektronik (RME)
                </Link>
              </li>
              <li>
                <Link href="/integration/analyzer" className="hover:text-nova-blue transition-colors">
                  500+ Medical Analyzers
                </Link>
              </li>
              <li>
                <Link href="/integration/satusehat" className="hover:text-nova-blue transition-colors">
                  SATUSEHAT Kemenkes RI
                </Link>
              </li>
              <li>
                <Link href="/integration/connectivity" className="hover:text-nova-blue transition-colors">
                  Smart Resilient Gateway
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  href="/request-demo"
                  className="inline-flex items-center gap-1.5 rounded-full bg-nova-blue px-3.5 py-1.5 text-xs font-bold text-diagnova-navy hover:bg-white transition-colors"
                >
                  <span>Request Live Demo</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>
              &copy; {new Date().getFullYear()} Diagnova. All rights reserved. Intelligent Laboratory Information System.
            </span>
          </div>

          <div className="flex items-center gap-6">
            <span>Privasi Data Medis Terproteksi</span>
            <span>HL7 FHIR &amp; ASTM Compliant</span>
          </div>
        </div>

        {/* Watermark Logo Raksasa di Bagian Bawah Footer (Sesuai Design Guidelines 6.1 Section 9) */}
        <div className="relative mt-8 select-none overflow-hidden text-center">
          <span className="block font-display text-[80px] sm:text-[130px] md:text-[180px] font-black tracking-widest text-white/[0.03] leading-none">
            DIAGNOVA
          </span>
        </div>
      </div>
    </footer>
  );
}
