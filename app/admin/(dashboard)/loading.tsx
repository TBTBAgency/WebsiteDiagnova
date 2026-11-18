export default function AdminDashboardLoading() {
  return (
    <div className="space-y-6 motion-safe:animate-[fadeSlideUp_0.35s_ease-out_both]" aria-busy="true" aria-label="Memuat halaman admin">
      {/* Header + Apple-style Frosted Pill Loader */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2.5">
          <div className="apple-shimmer h-8 w-56 rounded-2xl bg-[#E8EFF7]/90 ring-1 ring-black/[0.03]" />
          <div className="apple-shimmer h-4 w-36 rounded-lg bg-[#E8EFF7]/70" />
        </div>
        <div className="flex items-center gap-2.5">
          <div className="inline-flex h-10 items-center gap-2 rounded-full bg-white/90 px-4 text-[12px] font-medium text-[#0E234B] shadow-[0_2px_10px_rgba(14,35,75,0.05)] ring-1 ring-black/[0.05] backdrop-blur-md">
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#1B6FF2] border-t-transparent" />
            <span>Memuat…</span>
          </div>
          <div className="apple-shimmer h-10 w-28 rounded-full bg-white/90 ring-1 ring-black/[0.04]" />
        </div>
      </div>

      {/* Bento Skeleton Cards with Apple Shimmer */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12">
        <div className="apple-shimmer h-[380px] rounded-[26px] bg-white/95 p-6 shadow-[0_2px_12px_rgba(14,35,75,0.03)] ring-1 ring-black/[0.04] md:col-span-2 xl:col-span-5">
          <div className="h-4 w-32 rounded-lg bg-[#EBF1F8]" />
          <div className="mt-4 h-10 w-24 rounded-xl bg-[#EBF1F8]" />
          <div className="mt-8 grid grid-cols-7 gap-2.5">
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-full bg-[#EEF3F9]" />
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:col-span-2 xl:col-span-7">
          <div className="apple-shimmer h-[176px] rounded-[26px] bg-gradient-to-br from-[#0E234B]/12 to-[#1B6FF2]/15 ring-1 ring-black/[0.04] sm:col-span-2" />
          <div className="apple-shimmer h-[188px] rounded-[26px] bg-white/95 ring-1 ring-black/[0.04]" />
          <div className="apple-shimmer h-[188px] rounded-[26px] bg-[#0E234B]/10 ring-1 ring-black/[0.04]" />
        </div>
      </div>

      <div className="apple-shimmer h-64 rounded-[26px] bg-white/95 ring-1 ring-black/[0.04]" />
    </div>
  );
}
