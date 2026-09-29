import React from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/ui/BrandLogo";

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-[#2B60AC] to-[#1E4989] text-white pt-14 pb-10 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Section: Logo & 4 Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-white/20">
          {/* Brand Col */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <BrandLogo variant="light" />
            <p className="text-xs text-slate-200/80 leading-relaxed max-w-xs">
              AI-Powered Laboratory Intelligence Platform.
            </p>
          </div>

          {/* Nav Col 1: Platform */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-slate-200">
              <li>
                <Link href="/platform" className="hover:text-white transition-colors">
                  Overview
                </Link>
              </li>
              <li>
                <Link href="/platform/workflow" className="hover:text-white transition-colors">
                  Workflow
                </Link>
              </li>
              <li>
                <Link href="/platform/automation" className="hover:text-white transition-colors">
                  100% Automation
                </Link>
              </li>
              <li>
                <Link href="/nova-ai" className="hover:text-white transition-colors">
                  Nova AI
                </Link>
              </li>
              <li>
                <Link href="/integration" className="hover:text-white transition-colors">
                  Integrations
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav Col 2: Solutions */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white">
              Solutions
            </h4>
            <ul className="space-y-2 text-xs text-slate-200">
              <li>
                <Link href="/solutions/hospital-laboratory" className="hover:text-white transition-colors">
                  Hospital Lab
                </Link>
              </li>
              <li>
                <Link href="/solutions/clinical-laboratory" className="hover:text-white transition-colors">
                  Clinical Lab
                </Link>
              </li>
              <li>
                <Link href="/solutions/pathology" className="hover:text-white transition-colors">
                  Pathology
                </Link>
              </li>
              <li>
                <Link href="/solutions/microbiology" className="hover:text-white transition-colors">
                  Microbiology
                </Link>
              </li>
              <li>
                <Link href="/solutions/blood-bank" className="hover:text-white transition-colors">
                  Blood Bank
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav Col 3: Modules */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white">
              Modules
            </h4>
            <ul className="space-y-2 text-xs text-slate-200">
              <li>
                <Link href="/modules/routine-hematology" className="hover:text-white transition-colors">
                  Routine &amp; Hematology
                </Link>
              </li>
              <li>
                <Link href="/modules/blood-bank" className="hover:text-white transition-colors">
                  Blood Bank
                </Link>
              </li>
              <li>
                <Link href="/modules/inventory-reagent" className="hover:text-white transition-colors">
                  Inventory &amp; Reagent
                </Link>
              </li>
              <li>
                <Link href="/modules/pathology" className="hover:text-white transition-colors">
                  Anatomical Pathology
                </Link>
              </li>
              <li>
                <Link href="/modules/microbiology" className="hover:text-white transition-colors">
                  Microbiology
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav Col 4: Company */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white">
              Company
            </h4>
            <ul className="space-y-2 text-xs text-slate-200">
              <li>
                <Link href="/platform" className="hover:text-white transition-colors">
                  About Diagnova
                </Link>
              </li>
              <li>
                <Link href="/integration" className="hover:text-white transition-colors">
                  Connectivity
                </Link>
              </li>
              <li>
                <Link href="/request-demo" className="hover:text-white transition-colors">
                  Request Demo
                </Link>
              </li>
              <li>
                <Link href="/platform/reporting" className="hover:text-white transition-colors">
                  Compliance &amp; Audit
                </Link>
              </li>
              <li>
                <Link href="/nova-ai/ai-doctor" className="hover:text-white transition-colors">
                  AI + Doctor Ethics
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-slate-200/80">
          <p>&copy; {new Date().getFullYear()} Diagnova. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link href="/platform/reporting" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/platform/reporting" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
