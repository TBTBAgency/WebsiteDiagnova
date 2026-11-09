"use client";

import React, { useState, useEffect } from "react";
import {
  Globe,
  Save,
  RefreshCw,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Layers,
  Image as ImageIcon,
  Quote,
  Check,
  X,
  ArrowRight,
  Sparkles,
  ShieldAlert,
} from "lucide-react";

type ActiveTab =
  | "hero"
  | "trusted_by"
  | "about"
  | "comparison"
  | "workflow"
  | "infrastructure"
  | "testimonials"
  | "cta";

export default function AdminCmsHomepagePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("hero");
  const [editorLang, setEditorLang] = useState<"ID" | "EN">("ID");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Full CMS Data
  const [cmsData, setCmsData] = useState<any>(null);

  // State for active editing section
  const [sectionForms, setSectionForms] = useState<Record<string, any>>({});

  // Slide Modal / State
  const [editingSlide, setEditingSlide] = useState<any | null>(null);
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);

  // Comparison Item Modal / State
  const [editingComparison, setEditingComparison] = useState<any | null>(null);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);

  // Testimonial Modal / State
  const [editingTestimonial, setEditingTestimonial] = useState<any | null>(null);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);

  // Partner Modal / State
  const [editingPartner, setEditingPartner] = useState<any | null>(null);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadCmsData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/cms/homepage");
      const json = await res.json();
      if (res.ok && json.success && json.data) {
        setCmsData(json.data);
        // Initialize section forms
        const forms: Record<string, any> = {};
        for (const [key, value] of Object.entries(json.data)) {
          const val = value as any;
          if (val && val.section) {
            forms[val.section.sectionKey] = {
              badgeId: val.section.badgeId || "",
              badgeEn: val.section.badgeEn || "",
              titleId: val.section.titleId || "",
              titleEn: val.section.titleEn || "",
              subtitleId: val.section.subtitleId || "",
              subtitleEn: val.section.subtitleEn || "",
              extraContent: val.section.extraContent || {},
              isPublished: val.section.isPublished ?? true,
            };
          }
        }
        setSectionForms(forms);
      } else {
        showToast(json.message || "Gagal memuat konten CMS.", "error");
      }
    } catch (err: any) {
      console.error("Load CMS Error:", err);
      showToast("Terjadi kendala koneksi saat memuat CMS.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCmsData();
  }, []);

  const handleSectionFieldChange = (sectionKey: string, field: string, value: any) => {
    setSectionForms((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [field]: value,
      },
    }));
  };

  const handleExtraContentChange = (sectionKey: string, path: string, value: any) => {
    setSectionForms((prev) => {
      const currentSection = prev[sectionKey] || {};
      const currentExtra = { ...(currentSection.extraContent || {}) };
      currentExtra[path] = value;
      return {
        ...prev,
        [sectionKey]: {
          ...currentSection,
          extraContent: currentExtra,
        },
      };
    });
  };

  const saveCurrentSection = async (sectionKey: string) => {
    setIsSaving(true);
    try {
      const formData = sectionForms[sectionKey];
      const res = await fetch("/api/admin/cms/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "section",
          sectionKey,
          data: formData,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast(`Section '${sectionKey}' berhasil disimpan dan dipublikasikan!`);
        await loadCmsData();
      } else {
        showToast(json.message || "Gagal menyimpan section.", "error");
      }
    } catch (err: any) {
      console.error("Save section error:", err);
      showToast("Terjadi kesalahan saat menyimpan data.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Hero Slide Handlers
  const handleSaveSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/cms/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "hero_slide",
          action: "save",
          data: editingSlide,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast("Slide Hero berhasil disimpan.");
        setIsSlideModalOpen(false);
        setEditingSlide(null);
        await loadCmsData();
      } else {
        showToast(json.message || "Gagal menyimpan slide.", "error");
      }
    } catch (err) {
      showToast("Gagal menyimpan slide hero.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSlide = async (slideId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus slide ini?")) return;
    try {
      const res = await fetch("/api/admin/cms/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "hero_slide",
          action: "delete",
          data: { id: slideId },
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast("Slide berhasil dihapus.");
        await loadCmsData();
      } else {
        showToast(json.message || "Gagal menghapus slide.", "error");
      }
    } catch (err) {
      showToast("Terjadi kesalahan saat menghapus slide.", "error");
    }
  };

  // Testimonial Handlers
  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/cms/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "testimonial",
          action: "save",
          data: editingTestimonial,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast("Testimonial berhasil disimpan.");
        setIsTestimonialModalOpen(false);
        setEditingTestimonial(null);
        await loadCmsData();
      } else {
        showToast(json.message || "Gagal menyimpan testimonial.", "error");
      }
    } catch (err) {
      showToast("Gagal menyimpan testimonial.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm("Hapus ulasan testimonial ini?")) return;
    try {
      const res = await fetch("/api/admin/cms/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "testimonial",
          action: "delete",
          data: { id },
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast("Testimonial dihapus.");
        await loadCmsData();
      }
    } catch (err) {
      showToast("Gagal menghapus testimonial.", "error");
    }
  };

  // Comparison Item Handlers
  const handleSaveComparison = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/cms/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "comparison_item",
          action: "save",
          data: editingComparison,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast("Baris komparasi berhasil disimpan.");
        setIsComparisonModalOpen(false);
        setEditingComparison(null);
        await loadCmsData();
      } else {
        showToast(json.message || "Gagal menyimpan komparasi.", "error");
      }
    } catch (err) {
      showToast("Gagal menyimpan komparasi.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteComparison = async (id: string) => {
    if (!confirm("Hapus baris perbandingan ini?")) return;
    try {
      const res = await fetch("/api/admin/cms/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "comparison_item",
          action: "delete",
          data: { id },
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast("Baris komparasi dihapus.");
        await loadCmsData();
      }
    } catch (err) {
      showToast("Gagal menghapus baris komparasi.", "error");
    }
  };

  // Partner Handlers
  const handleSavePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/cms/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "partner",
          action: "save",
          data: editingPartner,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast("Mitra laboratorium berhasil disimpan.");
        setIsPartnerModalOpen(false);
        setEditingPartner(null);
        await loadCmsData();
      } else {
        showToast(json.message || "Gagal menyimpan mitra.", "error");
      }
    } catch (err) {
      showToast("Gagal menyimpan mitra.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePartner = async (id: string) => {
    if (!confirm("Hapus logo mitra ini?")) return;
    try {
      const res = await fetch("/api/admin/cms/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "partner",
          action: "delete",
          data: { id },
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast("Logo mitra berhasil dihapus.");
        await loadCmsData();
      }
    } catch (err) {
      showToast("Gagal menghapus mitra.", "error");
    }
  };

  const tabs: { key: ActiveTab; label: string; icon: any }[] = [
    { key: "hero", label: "1. Hero Banner", icon: Layers },
    { key: "trusted_by", label: "2. Mitra (Trusted By)", icon: Globe },
    { key: "about", label: "3. Tentang (About)", icon: Sparkles },
    { key: "comparison", label: "4. Komparasi Fitur", icon: Layers },
    { key: "workflow", label: "5. Alur Kerja", icon: CheckCircle2 },
    { key: "infrastructure", label: "6. Infrastruktur", icon: ShieldAlert },
    { key: "testimonials", label: "7. Testimonial Klien", icon: Quote },
    { key: "cta", label: "8. Banner CTA", icon: ArrowRight },
  ];

  if (isLoading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-[#087BEE]" />
          <p className="text-sm font-medium text-slate-500">Memuat konfigurasi CMS Homepage...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium shadow-xl transition-all ${
            toastMessage.type === "success"
              ? "bg-emerald-600 text-white"
              : "bg-rose-600 text-white"
          }`}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#087BEE] border border-blue-100">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">CMS Homepage Management</h1>
              <p className="text-xs text-slate-500">
                Kelola seluruh konten, gambar, teks, dan status publikasi halaman depan Diagnova
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Dual Language Switcher */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              type="button"
              onClick={() => setEditorLang("ID")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                editorLang === "ID"
                  ? "bg-white text-[#087BEE] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🇮🇩 Bahasa Indonesia (ID)
            </button>
            <button
              type="button"
              onClick={() => setEditorLang("EN")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                editorLang === "EN"
                  ? "bg-white text-[#087BEE] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🇬🇧 English (EN)
            </button>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-xs"
          >
            <span>Lihat Website</span>
            <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
          </a>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-200 pb-2 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-[#087BEE] text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT 1: HERO */}
      {activeTab === "hero" && (
        <div className="space-y-6">
          {/* Section Metadata Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Konfigurasi Teks Hero</h3>
                <p className="text-xs text-slate-500">Badge dan deskripsi intro section hero</p>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={sectionForms["hero"]?.isPublished ?? true}
                    onChange={(e) =>
                      handleSectionFieldChange("hero", "isPublished", e.target.checked)
                    }
                    className="h-4 w-4 rounded text-[#087BEE] focus:ring-[#087BEE]"
                  />
                  <span>Status Aktif / Dipublikasikan</span>
                </label>
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => saveCurrentSection("hero")}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#087BEE] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-600 disabled:opacity-50 transition-colors shadow-xs"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>{isSaving ? "Menyimpan..." : "Simpan Teks Hero"}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Badge Text ({editorLang === "ID" ? "Indonesia" : "English"})
                </label>
                <input
                  type="text"
                  value={
                    editorLang === "ID"
                      ? sectionForms["hero"]?.badgeId || ""
                      : sectionForms["hero"]?.badgeEn || ""
                  }
                  onChange={(e) =>
                    handleSectionFieldChange(
                      "hero",
                      editorLang === "ID" ? "badgeId" : "badgeEn",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#087BEE]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Judul Internal ({editorLang === "ID" ? "Indonesia" : "English"})
                </label>
                <input
                  type="text"
                  value={
                    editorLang === "ID"
                      ? sectionForms["hero"]?.titleId || ""
                      : sectionForms["hero"]?.titleEn || ""
                  }
                  onChange={(e) =>
                    handleSectionFieldChange(
                      "hero",
                      editorLang === "ID" ? "titleId" : "titleEn",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#087BEE]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Sub-Headline / Paragraf Deskripsi ({editorLang === "ID" ? "Indonesia" : "English"})
                </label>
                <textarea
                  rows={3}
                  value={
                    editorLang === "ID"
                      ? sectionForms["hero"]?.subtitleId || ""
                      : sectionForms["hero"]?.subtitleEn || ""
                  }
                  onChange={(e) =>
                    handleSectionFieldChange(
                      "hero",
                      editorLang === "ID" ? "subtitleId" : "subtitleEn",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#087BEE]"
                />
              </div>
            </div>
          </div>

          {/* Hero Slides List */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Daftar Slide Carousel Hero</h3>
                <p className="text-xs text-slate-500">
                  Slide yang berputar otomatis di carousel utama ({cmsData?.hero?.slides?.length || 0} slide)
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingSlide({
                    titleId: "",
                    titleEn: "",
                    subtitleId: "",
                    subtitleEn: "",
                    badgeId: "Platform Intelijen Laboratorium Berbasis AI",
                    badgeEn: "AI-Powered Laboratory Intelligence Platform",
                    ctaPrimaryTextId: "Jadwalkan Demo",
                    ctaPrimaryTextEn: "Schedule Demo",
                    ctaPrimaryUrl: "/request-demo",
                    ctaSecondaryTextId: "Jelajahi Modul",
                    ctaSecondaryTextEn: "Explore Modules",
                    ctaSecondaryUrl: "/modules",
                    imageUrl: "/images/hero-bg-1.webp",
                    imageAlt: "Diagnova Hero Banner",
                    sortOrder: (cmsData?.hero?.slides?.length || 0) + 1,
                    isActive: true,
                  });
                  setIsSlideModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Tambah Slide Baru</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {cmsData?.hero?.slides?.map((slide: any, index: number) => (
                <div
                  key={slide.id}
                  className="group relative rounded-xl border border-slate-200 bg-slate-50/50 p-4 hover:border-blue-300 hover:bg-blue-50/20 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-2">
                      <span className="rounded-md bg-white px-2 py-0.5 border border-slate-200 text-[#087BEE]">
                        Slide #{slide.sortOrder || index + 1}
                      </span>
                      <span className={slide.isActive ? "text-emerald-600 font-bold" : "text-slate-400"}>
                        {slide.isActive ? "● Aktif" : "○ Non-aktif"}
                      </span>
                    </div>

                    <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-200 mb-3 border border-slate-200">
                      <img
                        src={slide.imageUrl}
                        alt={slide.imageAlt || "Hero preview"}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 line-clamp-2 mb-1">
                      {editorLang === "ID" ? slide.titleId : slide.titleEn}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {editorLang === "ID" ? slide.subtitleId : slide.subtitleEn}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-end gap-2 border-t border-slate-200/60 pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingSlide(slide);
                        setIsSlideModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
                    >
                      <Edit className="h-3 w-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSlide(slide.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-[11px] font-medium text-rose-600 hover:bg-rose-100"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: TRUSTED BY (MITRA) */}
      {activeTab === "trusted_by" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Header Trusted By Bar</h3>
                <p className="text-xs text-slate-500">Label dan subjudul running ticker logo mitra</p>
              </div>
              <button
                type="button"
                disabled={isSaving}
                onClick={() => saveCurrentSection("trusted_by")}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#087BEE] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-600 transition-colors shadow-xs"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Simpan Teks Mitra</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Label Header ({editorLang === "ID" ? "Indonesia" : "English"})
                </label>
                <input
                  type="text"
                  value={
                    editorLang === "ID"
                      ? sectionForms["trusted_by"]?.titleId || ""
                      : sectionForms["trusted_by"]?.titleEn || ""
                  }
                  onChange={(e) =>
                    handleSectionFieldChange(
                      "trusted_by",
                      editorLang === "ID" ? "titleId" : "titleEn",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Sub-Judul Mitra ({editorLang === "ID" ? "Indonesia" : "English"})
                </label>
                <input
                  type="text"
                  value={
                    editorLang === "ID"
                      ? sectionForms["trusted_by"]?.subtitleId || ""
                      : sectionForms["trusted_by"]?.subtitleEn || ""
                  }
                  onChange={(e) =>
                    handleSectionFieldChange(
                      "trusted_by",
                      editorLang === "ID" ? "subtitleId" : "subtitleEn",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </div>

          {/* Partner Logos List */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Logo Institusi & Mitra Terdaftar</h3>
                <p className="text-xs text-slate-500">Logo yang berputar di ticker running partner</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingPartner({
                    name: "",
                    logoUrl: "/images/trust-logo.svg",
                    sortOrder: (cmsData?.trustedBy?.partners?.length || 0) + 1,
                    isActive: true,
                  });
                  setIsPartnerModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Tambah Mitra</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {cmsData?.trustedBy?.partners?.map((p: any) => (
                <div
                  key={p.id}
                  className="rounded-xl border border-slate-200 bg-white p-3 flex flex-col items-center justify-between text-center hover:border-blue-300 transition-all"
                >
                  <div className="h-12 w-full flex items-center justify-center p-1 bg-slate-50 rounded-lg mb-2">
                    <img src={p.logoUrl} alt={p.name} className="h-8 max-w-full object-contain" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-800 truncate w-full mb-2">
                    {p.name}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingPartner(p);
                        setIsPartnerModalOpen(true);
                      }}
                      className="p-1 rounded text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                    >
                      <Edit className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePartner(p.id)}
                      className="p-1 rounded text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: ABOUT */}
      {activeTab === "about" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Konten Section Tentang (About)</h3>
              <p className="text-xs text-slate-500">
                Pill badge, scroll-reveal statement teks, dan deskripsi narasi ekosistem
              </p>
            </div>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => saveCurrentSection("about")}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#087BEE] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-600 transition-colors shadow-xs"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Simpan Section About</span>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Badge Pill ({editorLang === "ID" ? "Indonesia" : "English"})
              </label>
              <input
                type="text"
                value={
                  editorLang === "ID"
                    ? sectionForms["about"]?.badgeId || ""
                    : sectionForms["about"]?.badgeEn || ""
                }
                onChange={(e) =>
                  handleSectionFieldChange(
                    "about",
                    editorLang === "ID" ? "badgeId" : "badgeEn",
                    e.target.value
                  )
                }
                className="w-full max-w-md rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Statement Utama (Animasi Scroll-Reveal Per-Kata) ({editorLang === "ID" ? "Indonesia" : "English"})
              </label>
              <textarea
                rows={3}
                value={
                  editorLang === "ID"
                    ? sectionForms["about"]?.titleId || ""
                    : sectionForms["about"]?.titleEn || ""
                }
                onChange={(e) =>
                  handleSectionFieldChange(
                    "about",
                    editorLang === "ID" ? "titleId" : "titleEn",
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Tip: Teks ini akan dipecah otomatis per-spasi untuk menghasilkan efek pewarnaan bertahap saat pengguna scroll halaman.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Paragraf Penjelas ({editorLang === "ID" ? "Indonesia" : "English"})
              </label>
              <textarea
                rows={4}
                value={
                  editorLang === "ID"
                    ? sectionForms["about"]?.subtitleId || ""
                    : sectionForms["about"]?.subtitleEn || ""
                }
                onChange={(e) =>
                  handleSectionFieldChange(
                    "about",
                    editorLang === "ID" ? "subtitleId" : "subtitleEn",
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: COMPARISON */}
      {activeTab === "comparison" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Header Section Komparasi</h3>
                <p className="text-xs text-slate-500">Judul, subjudul, dan label kolom perbandingan</p>
              </div>
              <button
                type="button"
                disabled={isSaving}
                onClick={() => saveCurrentSection("comparison")}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#087BEE] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-600 transition-colors shadow-xs"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Simpan Header Komparasi</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Badge Pill ({editorLang === "ID" ? "Indonesia" : "English"})
                </label>
                <input
                  type="text"
                  value={
                    editorLang === "ID"
                      ? sectionForms["comparison"]?.badgeId || ""
                      : sectionForms["comparison"]?.badgeEn || ""
                  }
                  onChange={(e) =>
                    handleSectionFieldChange(
                      "comparison",
                      editorLang === "ID" ? "badgeId" : "badgeEn",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Judul Section ({editorLang === "ID" ? "Indonesia" : "English"})
                </label>
                <input
                  type="text"
                  value={
                    editorLang === "ID"
                      ? sectionForms["comparison"]?.titleId || ""
                      : sectionForms["comparison"]?.titleEn || ""
                  }
                  onChange={(e) =>
                    handleSectionFieldChange(
                      "comparison",
                      editorLang === "ID" ? "titleId" : "titleEn",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Subjudul ({editorLang === "ID" ? "Indonesia" : "English"})
                </label>
                <input
                  type="text"
                  value={
                    editorLang === "ID"
                      ? sectionForms["comparison"]?.subtitleId || ""
                      : sectionForms["comparison"]?.subtitleEn || ""
                  }
                  onChange={(e) =>
                    handleSectionFieldChange(
                      "comparison",
                      editorLang === "ID" ? "subtitleId" : "subtitleEn",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </div>

          {/* Comparison Items Table */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Baris Perbandingan Fitur</h3>
                <p className="text-xs text-slate-500">
                  Daftar 6 perbandingan sistem lama vs keunggulan Diagnova
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingComparison({
                    number: `0${(cmsData?.comparison?.items?.length || 0) + 1}`,
                    conventionalTitleId: "",
                    conventionalTitleEn: "",
                    conventionalDescId: "",
                    conventionalDescEn: "",
                    diagnovaTitleId: "",
                    diagnovaTitleEn: "",
                    diagnovaDescId: "",
                    diagnovaDescEn: "",
                    impactMetric: "0% Error",
                    sortOrder: (cmsData?.comparison?.items?.length || 0) + 1,
                    isActive: true,
                  });
                  setIsComparisonModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Tambah Baris Komparasi</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                    <th className="py-2.5 px-3 font-semibold">No</th>
                    <th className="py-2.5 px-3 font-semibold">LIS Konvensional</th>
                    <th className="py-2.5 px-3 font-semibold">Diagnova Intelligence</th>
                    <th className="py-2.5 px-3 font-semibold">Metrik Dampak</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cmsData?.comparison?.items?.map((item: any) => (
                    <tr key={item.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-3 font-bold text-[#087BEE]">{item.number}</td>
                      <td className="py-3 px-3 max-w-xs">
                        <p className="font-semibold text-slate-800">
                          {editorLang === "ID" ? item.conventionalTitleId : item.conventionalTitleEn}
                        </p>
                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          {editorLang === "ID" ? item.conventionalDescId : item.conventionalDescEn}
                        </p>
                      </td>
                      <td className="py-3 px-3 max-w-xs">
                        <p className="font-semibold text-blue-700">
                          {editorLang === "ID" ? item.diagnovaTitleId : item.diagnovaTitleEn}
                        </p>
                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          {editorLang === "ID" ? item.diagnovaDescId : item.diagnovaDescEn}
                        </p>
                      </td>
                      <td className="py-3 px-3">
                        <span className="rounded-md bg-blue-50 px-2 py-0.5 font-bold text-blue-600 border border-blue-200">
                          {item.impactMetric}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingComparison(item);
                              setIsComparisonModalOpen(true);
                            }}
                            className="p-1 rounded text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteComparison(item.id)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: WORKFLOW */}
      {activeTab === "workflow" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Alur Kerja Laboratorium (Workflow)</h3>
              <p className="text-xs text-slate-500">
                4 Tahapan alur sampel: Penerimaan, Verifikasi Otomatis, Delta Check, dan Hasil Akurat
              </p>
            </div>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => saveCurrentSection("workflow")}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#087BEE] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-600 transition-colors shadow-xs"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Simpan Alur Kerja</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Badge Section ({editorLang === "ID" ? "Indonesia" : "English"})
              </label>
              <input
                type="text"
                value={
                  editorLang === "ID"
                    ? sectionForms["workflow"]?.badgeId || ""
                    : sectionForms["workflow"]?.badgeEn || ""
                }
                onChange={(e) =>
                  handleSectionFieldChange(
                    "workflow",
                    editorLang === "ID" ? "badgeId" : "badgeEn",
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Judul Utama ({editorLang === "ID" ? "Indonesia" : "English"})
              </label>
              <input
                type="text"
                value={
                  editorLang === "ID"
                    ? sectionForms["workflow"]?.titleId || ""
                    : sectionForms["workflow"]?.titleEn || ""
                }
                onChange={(e) =>
                  handleSectionFieldChange(
                    "workflow",
                    editorLang === "ID" ? "titleId" : "titleEn",
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Sub-Deskripsi ({editorLang === "ID" ? "Indonesia" : "English"})
              </label>
              <textarea
                rows={2}
                value={
                  editorLang === "ID"
                    ? sectionForms["workflow"]?.subtitleId || ""
                    : sectionForms["workflow"]?.subtitleEn || ""
                }
                onChange={(e) =>
                  handleSectionFieldChange(
                    "workflow",
                    editorLang === "ID" ? "subtitleId" : "subtitleEn",
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* 4 Steps Editor */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 mb-3">Rincian 4 Langkah Workflow</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sectionForms["workflow"]?.extraContent?.steps?.map((step: any, idx: number) => (
                <div
                  key={step.id || idx}
                  className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-[#087BEE]">
                    <span>Langkah {step.number}</span>
                    <span className="text-slate-400 font-normal">ID: {step.id}</span>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Judul Langkah ({editorLang === "ID" ? "Indonesia" : "English"})
                    </label>
                    <input
                      type="text"
                      value={editorLang === "ID" ? step.titleId : step.titleEn}
                      onChange={(e) => {
                        const newSteps = [...sectionForms["workflow"].extraContent.steps];
                        newSteps[idx] = {
                          ...newSteps[idx],
                          [editorLang === "ID" ? "titleId" : "titleEn"]: e.target.value,
                        };
                        handleExtraContentChange("workflow", "steps", newSteps);
                      }}
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs bg-white text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Deskripsi Ringkas ({editorLang === "ID" ? "Indonesia" : "English"})
                    </label>
                    <textarea
                      rows={2}
                      value={editorLang === "ID" ? step.descriptionId : step.descriptionEn}
                      onChange={(e) => {
                        const newSteps = [...sectionForms["workflow"].extraContent.steps];
                        newSteps[idx] = {
                          ...newSteps[idx],
                          [editorLang === "ID" ? "descriptionId" : "descriptionEn"]: e.target.value,
                        };
                        handleExtraContentChange("workflow", "steps", newSteps);
                      }}
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs bg-white text-slate-800"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 6: INFRASTRUCTURE */}
      {activeTab === "infrastructure" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Infrastruktur & Fitur Utama</h3>
              <p className="text-xs text-slate-500">
                3 Fitur: Otomatisasi 100%, Integrasi Tanpa Hambatan, dan Nova AI Copilot
              </p>
            </div>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => saveCurrentSection("infrastructure")}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#087BEE] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-600 transition-colors shadow-xs"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Simpan Infrastruktur</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Badge Section ({editorLang === "ID" ? "Indonesia" : "English"})
              </label>
              <input
                type="text"
                value={
                  editorLang === "ID"
                    ? sectionForms["infrastructure"]?.badgeId || ""
                    : sectionForms["infrastructure"]?.badgeEn || ""
                }
                onChange={(e) =>
                  handleSectionFieldChange(
                    "infrastructure",
                    editorLang === "ID" ? "badgeId" : "badgeEn",
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Judul Utama ({editorLang === "ID" ? "Indonesia" : "English"})
              </label>
              <input
                type="text"
                value={
                  editorLang === "ID"
                    ? sectionForms["infrastructure"]?.titleId || ""
                    : sectionForms["infrastructure"]?.titleEn || ""
                }
                onChange={(e) =>
                  handleSectionFieldChange(
                    "infrastructure",
                    editorLang === "ID" ? "titleId" : "titleEn",
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Sub-Judul ({editorLang === "ID" ? "Indonesia" : "English"})
              </label>
              <textarea
                rows={2}
                value={
                  editorLang === "ID"
                    ? sectionForms["infrastructure"]?.subtitleId || ""
                    : sectionForms["infrastructure"]?.subtitleEn || ""
                }
                onChange={(e) =>
                  handleSectionFieldChange(
                    "infrastructure",
                    editorLang === "ID" ? "subtitleId" : "subtitleEn",
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 mb-3">3 Kartu Fitur</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sectionForms["infrastructure"]?.extraContent?.cards?.map((card: any, idx: number) => (
                <div
                  key={card.id || idx}
                  className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-2"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#087BEE]">
                    Kartu #{idx + 1}: {card.id}
                  </span>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Judul Kartu ({editorLang === "ID" ? "ID" : "EN"})
                    </label>
                    <input
                      type="text"
                      value={editorLang === "ID" ? card.titleId : card.titleEn}
                      onChange={(e) => {
                        const newCards = [...sectionForms["infrastructure"].extraContent.cards];
                        newCards[idx] = {
                          ...newCards[idx],
                          [editorLang === "ID" ? "titleId" : "titleEn"]: e.target.value,
                        };
                        handleExtraContentChange("infrastructure", "cards", newCards);
                      }}
                      className="w-full rounded-lg border border-slate-200 px-2.5 py-1 text-xs bg-white text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Deskripsi ({editorLang === "ID" ? "ID" : "EN"})
                    </label>
                    <textarea
                      rows={3}
                      value={editorLang === "ID" ? card.descriptionId : card.descriptionEn}
                      onChange={(e) => {
                        const newCards = [...sectionForms["infrastructure"].extraContent.cards];
                        newCards[idx] = {
                          ...newCards[idx],
                          [editorLang === "ID" ? "descriptionId" : "descriptionEn"]: e.target.value,
                        };
                        handleExtraContentChange("infrastructure", "cards", newCards);
                      }}
                      className="w-full rounded-lg border border-slate-200 px-2.5 py-1 text-xs bg-white text-slate-800"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 7: TESTIMONIALS */}
      {activeTab === "testimonials" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Header Testimoni Mitra</h3>
                <p className="text-xs text-slate-500">Judul dan pengantar ulasan pelanggan</p>
              </div>
              <button
                type="button"
                disabled={isSaving}
                onClick={() => saveCurrentSection("testimonials")}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#087BEE] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-600 transition-colors shadow-xs"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Simpan Teks Testimoni</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Badge Section ({editorLang === "ID" ? "Indonesia" : "English"})
                </label>
                <input
                  type="text"
                  value={
                    editorLang === "ID"
                      ? sectionForms["testimonials"]?.badgeId || ""
                      : sectionForms["testimonials"]?.badgeEn || ""
                  }
                  onChange={(e) =>
                    handleSectionFieldChange(
                      "testimonials",
                      editorLang === "ID" ? "badgeId" : "badgeEn",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Judul Section ({editorLang === "ID" ? "Indonesia" : "English"})
                </label>
                <input
                  type="text"
                  value={
                    editorLang === "ID"
                      ? sectionForms["testimonials"]?.titleId || ""
                      : sectionForms["testimonials"]?.titleEn || ""
                  }
                  onChange={(e) =>
                    handleSectionFieldChange(
                      "testimonials",
                      editorLang === "ID" ? "titleId" : "titleEn",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Sub-Judul ({editorLang === "ID" ? "Indonesia" : "English"})
                </label>
                <textarea
                  rows={2}
                  value={
                    editorLang === "ID"
                      ? sectionForms["testimonials"]?.subtitleId || ""
                      : sectionForms["testimonials"]?.subtitleEn || ""
                  }
                  onChange={(e) =>
                    handleSectionFieldChange(
                      "testimonials",
                      editorLang === "ID" ? "subtitleId" : "subtitleEn",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Testimonial Cards List */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Daftar Testimonial Mitra</h3>
                <p className="text-xs text-slate-500">
                  Ulasan dokter patologi klinik, kepala lab, dan direktur rumah sakit
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingTestimonial({
                    name: "",
                    roleId: "Kepala Laboratorium Sentral",
                    roleEn: "Head of Central Laboratory",
                    institution: "RS Hermina",
                    quoteId: "",
                    quoteEn: "",
                    avatarUrl: "/images/testimonial-silhouette-female.jpg",
                    rating: 5,
                    sortOrder: (cmsData?.testimonials?.items?.length || 0) + 1,
                    isActive: true,
                  });
                  setIsTestimonialModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Tambah Testimonial</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cmsData?.testimonials?.items?.map((item: any) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 flex flex-col justify-between hover:border-blue-300 transition-all"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={item.avatarUrl || "/images/testimonial-silhouette-female.jpg"}
                        alt={item.name}
                        className="h-10 w-10 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                        <p className="text-[11px] text-slate-500">
                          {editorLang === "ID" ? item.roleId : item.roleEn} • {item.institution}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 italic line-clamp-3 mb-3">
                      &ldquo;{editorLang === "ID" ? item.quoteId : item.quoteEn}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-200/60 pt-3">
                    <span className="text-[11px] font-semibold text-amber-500">
                      {"★".repeat(item.rating || 5)}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingTestimonial(item);
                          setIsTestimonialModalOpen(true);
                        }}
                        className="p-1 rounded text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteTestimonial(item.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 8: CTA BANNER */}
      {activeTab === "cta" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Banner Pendaftaran Demo (CTA)</h3>
              <p className="text-xs text-slate-500">
                Headline, subjudul, dan teks formulir minta demo di bagian bawah halaman
              </p>
            </div>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => saveCurrentSection("cta")}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#087BEE] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-600 transition-colors shadow-xs"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Simpan Banner CTA</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Headline CTA ({editorLang === "ID" ? "Indonesia" : "English"})
              </label>
              <input
                type="text"
                value={
                  editorLang === "ID"
                    ? sectionForms["cta"]?.titleId || ""
                    : sectionForms["cta"]?.titleEn || ""
                }
                onChange={(e) =>
                  handleSectionFieldChange(
                    "cta",
                    editorLang === "ID" ? "titleId" : "titleEn",
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Teks Tombol Aksi ({editorLang === "ID" ? "Indonesia" : "English"})
              </label>
              <input
                type="text"
                value={
                  editorLang === "ID"
                    ? sectionForms["cta"]?.extraContent?.buttonTextId || "Minta Demo"
                    : sectionForms["cta"]?.extraContent?.buttonTextEn || "Request Demo"
                }
                onChange={(e) =>
                  handleExtraContentChange(
                    "cta",
                    editorLang === "ID" ? "buttonTextId" : "buttonTextEn",
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Sub-Headline ({editorLang === "ID" ? "Indonesia" : "English"})
              </label>
              <textarea
                rows={3}
                value={
                  editorLang === "ID"
                    ? sectionForms["cta"]?.subtitleId || ""
                    : sectionForms["cta"]?.subtitleEn || ""
                }
                onChange={(e) =>
                  handleSectionFieldChange(
                    "cta",
                    editorLang === "ID" ? "subtitleId" : "subtitleEn",
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800"
              />
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: EDIT / CREATE HERO SLIDE */}
      {isSlideModalOpen && editingSlide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-900">
                {editingSlide.id ? "Edit Slide Carousel Hero" : "Tambah Slide Hero Baru"}
              </h3>
              <button
                type="button"
                onClick={() => setIsSlideModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSlide} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Judul Slide (Bahasa Indonesia) *
                </label>
                <input
                  type="text"
                  required
                  value={editingSlide.titleId || ""}
                  onChange={(e) =>
                    setEditingSlide({ ...editingSlide, titleId: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Judul Slide (English) *
                </label>
                <input
                  type="text"
                  required
                  value={editingSlide.titleEn || ""}
                  onChange={(e) =>
                    setEditingSlide({ ...editingSlide, titleEn: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    URL Gambar Background
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSlide.imageUrl || ""}
                    onChange={(e) =>
                      setEditingSlide({ ...editingSlide, imageUrl: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Urutan Tampil (Sort Order)
                  </label>
                  <input
                    type="number"
                    value={editingSlide.sortOrder || 1}
                    onChange={(e) =>
                      setEditingSlide({
                        ...editingSlide,
                        sortOrder: parseInt(e.target.value, 10) || 1,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Label Tombol CTA 1 (ID)
                  </label>
                  <input
                    type="text"
                    value={editingSlide.ctaPrimaryTextId || ""}
                    onChange={(e) =>
                      setEditingSlide({ ...editingSlide, ctaPrimaryTextId: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tautan URL CTA 1
                  </label>
                  <input
                    type="text"
                    value={editingSlide.ctaPrimaryUrl || ""}
                    onChange={(e) =>
                      setEditingSlide({ ...editingSlide, ctaPrimaryUrl: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSlideModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-[#087BEE] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-600"
                >
                  {isSaving ? "Menyimpan..." : "Simpan Slide"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT / CREATE TESTIMONIAL */}
      {isTestimonialModalOpen && editingTestimonial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-900">
                {editingTestimonial.id ? "Edit Testimonial Mitra" : "Tambah Testimonial Baru"}
              </h3>
              <button
                type="button"
                onClick={() => setIsTestimonialModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTestimonial} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap Dokter / Pengguna *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingTestimonial.name || ""}
                    onChange={(e) =>
                      setEditingTestimonial({ ...editingTestimonial, name: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Instansi / Rumah Sakit *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingTestimonial.institution || ""}
                    onChange={(e) =>
                      setEditingTestimonial({
                        ...editingTestimonial,
                        institution: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jabatan (ID)
                  </label>
                  <input
                    type="text"
                    required
                    value={editingTestimonial.roleId || ""}
                    onChange={(e) =>
                      setEditingTestimonial({ ...editingTestimonial, roleId: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jabatan (EN)
                  </label>
                  <input
                    type="text"
                    value={editingTestimonial.roleEn || ""}
                    onChange={(e) =>
                      setEditingTestimonial({ ...editingTestimonial, roleEn: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kutipan Testimonial (ID) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingTestimonial.quoteId || ""}
                  onChange={(e) =>
                    setEditingTestimonial({ ...editingTestimonial, quoteId: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kutipan Testimonial (EN)
                </label>
                <textarea
                  rows={3}
                  value={editingTestimonial.quoteEn || ""}
                  onChange={(e) =>
                    setEditingTestimonial({ ...editingTestimonial, quoteEn: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsTestimonialModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-[#087BEE] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-600"
                >
                  {isSaving ? "Menyimpan..." : "Simpan Testimonial"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: EDIT / CREATE COMPARISON ITEM */}
      {isComparisonModalOpen && editingComparison && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-900">
                {editingComparison.id ? "Edit Baris Komparasi" : "Tambah Baris Komparasi"}
              </h3>
              <button
                type="button"
                onClick={() => setIsComparisonModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveComparison} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor (e.g. 01)</label>
                  <input
                    type="text"
                    required
                    value={editingComparison.number || "01"}
                    onChange={(e) =>
                      setEditingComparison({ ...editingComparison, number: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Metrik Dampak</label>
                  <input
                    type="text"
                    required
                    value={editingComparison.impactMetric || ""}
                    onChange={(e) =>
                      setEditingComparison({
                        ...editingComparison,
                        impactMetric: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kelemahan LIS Konvensional (ID) *
                </label>
                <input
                  type="text"
                  required
                  value={editingComparison.conventionalTitleId || ""}
                  onChange={(e) =>
                    setEditingComparison({
                      ...editingComparison,
                      conventionalTitleId: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Keunggulan Diagnova (ID) *
                </label>
                <input
                  type="text"
                  required
                  value={editingComparison.diagnovaTitleId || ""}
                  onChange={(e) =>
                    setEditingComparison({
                      ...editingComparison,
                      diagnovaTitleId: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsComparisonModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-[#087BEE] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-600"
                >
                  {isSaving ? "Menyimpan..." : "Simpan Baris"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: EDIT / CREATE PARTNER */}
      {isPartnerModalOpen && editingPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-900">
                {editingPartner.id ? "Edit Mitra" : "Tambah Mitra"}
              </h3>
              <button
                type="button"
                onClick={() => setIsPartnerModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSavePartner} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Mitra / Lab *</label>
                <input
                  type="text"
                  required
                  value={editingPartner.name || ""}
                  onChange={(e) =>
                    setEditingPartner({ ...editingPartner, name: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">URL File Logo *</label>
                <input
                  type="text"
                  required
                  value={editingPartner.logoUrl || ""}
                  onChange={(e) =>
                    setEditingPartner({ ...editingPartner, logoUrl: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPartnerModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-[#087BEE] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-600"
                >
                  {isSaving ? "Menyimpan..." : "Simpan Mitra"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

