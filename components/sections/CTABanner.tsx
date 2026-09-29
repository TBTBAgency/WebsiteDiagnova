"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export function CTABanner() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      router.push(`/request-demo?email=${encodeURIComponent(email.trim())}`);
    } else {
      router.push("/request-demo");
    }
  };

  return (
    <section className="bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Large Rounded Container matching Figma */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-gradient-to-r from-[#F4F8FC] via-[#F8FAFC] to-[#EAF2FA] p-8 sm:p-12 lg:p-14 shadow-sm">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            {/* Left Column: Copy & Input Form */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#112E65] tracking-tight leading-[1.18]">
                Transform Your Laboratory
                <br />
                with Diagnova
              </h2>

              <p className="text-sm sm:text-base text-slate-600 max-w-lg leading-relaxed font-normal">
                Bring high reliability, speed, and precision to your healthcare institution today.
              </p>

              {/* Integrated Email + Request Demo Button Pill Form */}
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row items-stretch sm:items-center rounded-2xl sm:rounded-full bg-white p-1.5 sm:p-2 border border-slate-300 shadow-sm max-w-md gap-2"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full bg-transparent px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                  required
                />

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2B5DA8] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white transition-all hover:bg-[#20498B] shrink-0 active:scale-[0.98]"
                >
                  <span>Request Demo</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>

            {/* Right Column: Diagnova Laptop Device Visual */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[420px] aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
                <Image
                  src="/images/laptop-diagnova.jpg"
                  alt="Diagnova LIS on Laptop Device"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 420px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
