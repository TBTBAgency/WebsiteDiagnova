"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

export function CTABanner() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      router.push(`/request-demo?email=${encodeURIComponent(email)}`);
    } else {
      router.push("/request-demo");
    }
  };

  return (
    <section className="w-full bg-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Main Rounded CTA Container */}
        <div className="relative overflow-hidden rounded-[28px] sm:rounded-[36px] lg:rounded-[44px] bg-gradient-to-r from-[#EBF3FB] via-[#E4EFF9] to-[#D5E6F7] border border-blue-100/80 shadow-[0_10px_40px_-15px_rgba(40,90,165,0.07)]">
          {/* Subtle Vertical DNA Background Motif Patterns */}
          <div className="absolute right-0 top-0 bottom-0 w-full lg:w-1/2 pointer-events-none opacity-20 overflow-hidden flex justify-end gap-12 pr-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="w-16 h-full flex flex-col justify-around py-4"
              >
                {Array.from({ length: 6 }).map((_, idx) => (
                  <svg
                    key={idx}
                    viewBox="0 0 40 40"
                    fill="none"
                    className="w-10 h-10 text-[#345DAB]"
                  >
                    <path
                      d="M8 8 C16 16, 24 16, 32 8 M8 32 C16 24, 24 24, 32 32 M12 12 L28 28 M28 12 L12 28"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                ))}
              </div>
            ))}
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center min-h-[440px] lg:min-h-[480px]">
            {/* Left Column: Heading, Subtitle & Email Input Form */}
            <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 xl:p-20 flex flex-col justify-center">
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-bold text-[#275EA8] tracking-tight leading-[1.15] mb-4 sm:mb-5">
                Transform Your Laboratory <br className="hidden sm:inline" />
                with Diagnova
              </h2>

              <p className="text-slate-500 text-sm sm:text-base lg:text-lg leading-relaxed max-w-lg mb-8 sm:mb-10">
                Bring high reliability, speed, and precision to your healthcare institution today.
              </p>

              {/* White Pill Input Container */}
              <form
                onSubmit={handleSubmit}
                className="relative flex items-center bg-white rounded-full p-1.5 sm:p-2 pl-5 sm:pl-7 shadow-[0_8px_30px_rgba(40,90,165,0.08)] border border-blue-100/90 max-w-lg w-full transition-all focus-within:ring-2 focus-within:ring-[#2E68B4]/20 focus-within:border-[#2E68B4]"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email addres"
                  className="w-full bg-transparent text-sm sm:text-base text-slate-800 placeholder-slate-400 outline-none pr-3"
                  required
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#2E68B4] hover:bg-[#235899] text-white font-medium px-5 sm:px-7 py-2.5 sm:py-3.5 text-xs sm:text-sm shrink-0 transition-colors shadow-sm cursor-pointer active:scale-[0.98]"
                >
                  <span>Request Demo</span>
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </form>
            </div>

            {/* Right Column: Laptop Mockup Area on Blue Chair (Asset Container) */}
            <div
              id="cta-laptop-container"
              className="lg:col-span-5 relative h-full min-h-[340px] sm:min-h-[400px] lg:min-h-[480px] flex items-center justify-center lg:justify-end overflow-hidden p-6 sm:p-10 lg:pr-12"
            >
              {/* Laptop on Blue Chair Mockup Presentation Container */}
              <div className="relative w-full max-w-md lg:max-w-none transform lg:scale-105 xl:scale-110 lg:translate-x-4 transition-transform duration-500">
                {/* Modern Laptop Mockup Frame */}
                <div className="relative mx-auto rounded-xl border border-slate-400/40 bg-slate-900 p-2 sm:p-2.5 shadow-2xl">
                  {/* Laptop Notch */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 h-1.5 w-12 rounded-b-md bg-slate-900 z-20" />
                  
                  {/* Laptop Screen Content: Diagnova Login & Dashboard Preview */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-white shadow-inner flex">
                    {/* Left: Login Form UI */}
                    <div className="w-1/2 p-3 sm:p-4 bg-white flex flex-col justify-center">
                      <div className="flex items-center gap-1 mb-2">
                        <div className="h-3.5 w-3.5 rounded bg-[#345DAB] flex items-center justify-center text-[7px] font-bold text-white">
                          §D
                        </div>
                        <span className="text-[10px] font-bold tracking-wider text-[#0E234B] font-display">
                          DIAGNOVA
                        </span>
                      </div>
                      <h4 className="text-[11px] font-bold text-slate-800 leading-tight">Welcome back!</h4>
                      <p className="text-[7px] text-slate-400 mb-2">Log in to manage your laboratory data.</p>
                      <div className="space-y-1">
                        <div className="h-4 rounded border border-slate-200 bg-slate-50 flex items-center px-2 text-[7px] text-slate-400">
                          email@hospital.org
                        </div>
                        <div className="h-4 rounded border border-slate-200 bg-slate-50 flex items-center px-2 text-[7px] text-slate-400">
                          ••••••••••••
                        </div>
                      </div>
                      <div className="mt-2 h-4 rounded bg-[#345DAB] flex items-center justify-center text-[8px] font-semibold text-white">
                        Log In →
                      </div>
                    </div>

                    {/* Right: Blue Feature Highlight */}
                    <div className="w-1/2 p-3 sm:p-4 bg-gradient-to-br from-[#2E68B4] to-[#1E4B88] text-white flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="h-4 w-4 rounded-md bg-white/20 flex items-center justify-center text-[8px]">
                          ⚡
                        </div>
                        <h5 className="text-[10px] font-bold leading-tight">
                          Smarter Laboratory for Better Decisions
                        </h5>
                        <p className="text-[7px] text-white/80 leading-tight">
                          Connect people, specimens, instruments, and clinicians in one ecosystem.
                        </p>
                      </div>
                      <div className="flex gap-1 justify-center">
                        <div className="h-1 w-3 rounded-full bg-white" />
                        <div className="h-1 w-1 rounded-full bg-white/40" />
                        <div className="h-1 w-1 rounded-full bg-white/40" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Laptop Base Stand */}
                <div className="relative mx-auto -mt-0.5 h-2 w-full max-w-[96%] rounded-b-xl bg-gradient-to-b from-slate-400 to-slate-500 shadow-lg">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-16 rounded-b bg-slate-600/40" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
