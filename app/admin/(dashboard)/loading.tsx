export default function AdminDashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse" aria-busy="true" aria-label="Memuat halaman admin">
      {/* Header skeleton */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div className="h-8 w-56 rounded-xl bg-white/90 border border-[#DCE6F5]/70" />
          <div className="h-4 w-36 rounded-lg bg-white/70" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-32 rounded-full bg-white/90 border border-[#DCE6F5]/70" />
          <div className="h-10 w-28 rounded-full bg-white/90 border border-[#DCE6F5]/70" />
        </div>
      </div>

      {/* Content cards skeleton */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12">
        <div className="h-44 rounded-[24px] border border-[#DCE6F5]/80 bg-white p-6 md:col-span-2 xl:col-span-5" />
        <div className="grid gap-4 sm:grid-cols-2 md:col-span-2 xl:col-span-7">
          <div className="h-44 rounded-[24px] bg-[#0E234B]/15 sm:col-span-2" />
          <div className="h-44 rounded-[24px] border border-[#DCE6F5]/80 bg-white" />
          <div className="h-44 rounded-[24px] bg-[#0E234B]/10" />
        </div>
      </div>

      <div className="h-64 rounded-[24px] border border-[#DCE6F5]/80 bg-white" />
    </div>
  );
}
