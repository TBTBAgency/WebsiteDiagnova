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
  Upload,
  FolderUp,
  Eye,
  Star,
  CheckSquare,
  Compass,
  Cpu,
  Boxes,
  BrainCircuit,
  Network,
  ChevronDown,
  ChevronRight,
  Link as LinkIcon,
  Tag,
  ShieldCheck,
} from "lucide-react";
import ImageUploader, { UploadedFileItem } from "@/components/admin/ImageUploader";

type CmsMainTab =
  | "navigation"
  | "homepage"
  | "platform"
  | "solutions"
  | "modules"
  | "nova_ai"
  | "integrations";

type HomepageSubTab =
  | "hero"
  | "trusted_by"
  | "about"
  | "comparison"
  | "workflow"
  | "infrastructure"
  | "testimonials"
  | "cta";

export default function AdminCmsUnifiedHubPage() {
  const [mainTab, setMainTab] = useState<CmsMainTab>("homepage");
  const [homepageTab, setHomepageTab] = useState<HomepageSubTab>("hero");

  // Dukung deep-link ?tab=<tab> (mis. /admin/menus -> /admin/cms?tab=navigation)
  useEffect(() => {
    const tab = new URLSearchParams(window.location.search).get("tab");
    const validTabs: CmsMainTab[] = ["navigation", "homepage", "platform", "solutions", "modules", "nova_ai", "integrations"] as CmsMainTab[];
    if (tab && (validTabs as string[]).includes(tab)) setMainTab(tab as CmsMainTab);
  }, []);
  const [editorLang, setEditorLang] = useState<"ID" | "EN">("ID");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Full CMS Data
  const [cmsData, setCmsData] = useState<any>(null);

  // Section forms (badge, title, subtitle, extraContent)
  const [sectionForms, setSectionForms] = useState<Record<string, any>>({});

  // Navigation Menus State
  const [navMenus, setNavMenus] = useState<any[]>([]);
  const [isNavFormOpen, setIsNavFormOpen] = useState(false);
  const [editingNavMenu, setEditingNavMenu] = useState<any | null>(null);
  const [expandedNavId, setExpandedNavId] = useState<string | null>(null);

  // Hero Slide Form / Multi-Draft State
  const [isSlideFormOpen, setIsSlideFormOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<any | null>(null);
  const [slideDraftQueue, setSlideDraftQueue] = useState<any[]>([]);
  const [activeSlideDraftIndex, setActiveSlideDraftIndex] = useState(0);

  // Partner Form / Multi-Draft State
  const [isPartnerFormOpen, setIsPartnerFormOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<any | null>(null);
  const [partnerDraftQueue, setPartnerDraftQueue] = useState<any[]>([]);

  // Testimonial Form / Multi-Draft State
  const [isTestimonialFormOpen, setIsTestimonialFormOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<any | null>(null);
  const [testimonialDraftQueue, setTestimonialDraftQueue] = useState<any[]>([]);

  // Comparison Item Form
  const [isComparisonFormOpen, setIsComparisonFormOpen] = useState(false);
  const [editingComparison, setEditingComparison] = useState<any | null>(null);

  // Solution Item Form
  const [isSolutionFormOpen, setIsSolutionFormOpen] = useState(false);
  const [editingSolution, setEditingSolution] = useState<any | null>(null);

  // Module Item Form
  const [isModuleFormOpen, setIsModuleFormOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<any | null>(null);

  // Integration Item Form
  const [isIntegrationFormOpen, setIsIntegrationFormOpen] = useState(false);
  const [editingIntegration, setEditingIntegration] = useState<any | null>(null);

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
        if (json.data.navigation) {
          setNavMenus(json.data.navigation);
        }

        const forms: Record<string, any> = {};
        // Process homepage sections
        if (json.data.homepage) {
          for (const [key, value] of Object.entries(json.data.homepage)) {
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
        }

        // Process other pages sections
        const otherPageKeys = ["platform", "solutions", "modules", "novaAi", "integrations"];
        for (const pKey of otherPageKeys) {
          const pageObj = json.data[pKey];
          if (pageObj && pageObj.section) {
            forms[pageObj.section.sectionKey] = {
              badgeId: pageObj.section.badgeId || "",
              badgeEn: pageObj.section.badgeEn || "",
              titleId: pageObj.section.titleId || "",
              titleEn: pageObj.section.titleEn || "",
              subtitleId: pageObj.section.subtitleId || "",
              subtitleEn: pageObj.section.subtitleEn || "",
              extraContent: pageObj.section.extraContent || {},
              isPublished: pageObj.section.isPublished ?? true,
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
    } catch (err) {
      showToast("Terjadi kesalahan saat menyimpan section.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const cleanFileNameToTitle = (filename: string): string => {
    return filename
      .replace(/\.[^/.]+$/, "")
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  // ===========================================================================
  // NAVIGATION CRUD
  // ===========================================================================
  const handleOpenNewNavMenu = (parentId: string | null = null) => {
    setEditingNavMenu({
      id: "",
      parentId,
      labelId: "",
      labelEn: "",
      descriptionId: "",
      descriptionEn: "",
      url: "",
      sectionKey: null,
      iconName: "Layers",
      sortOrder: (parentId ? 1 : navMenus.length + 1),
      isActive: true,
    });
    setIsNavFormOpen(true);
  };

  const handleSaveNavMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/cms/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "navigation",
          action: "save",
          data: editingNavMenu,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast("Menu navigasi berhasil disimpan ke CMS.");
        setIsNavFormOpen(false);
        setEditingNavMenu(null);
        await loadCmsData();
      } else {
        showToast(json.message || "Gagal menyimpan menu.", "error");
      }
    } catch (err) {
      showToast("Gagal menyimpan menu navigasi.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNavMenu = async (menuId: string) => {
    if (!confirm("Hapus menu ini beserta seluruh submenunya?")) return;
    try {
      const res = await fetch("/api/admin/cms/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "navigation",
          action: "delete",
          data: { id: menuId },
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast("Menu navigasi berhasil dihapus.");
        await loadCmsData();
      }
    } catch (err) {
      showToast("Gagal menghapus menu navigasi.", "error");
    }
  };

  // ===========================================================================
  // HERO SLIDE CRUD
  // ===========================================================================
  const handleOpenNewSlide = () => {
    setSlideDraftQueue([]);
    setActiveSlideDraftIndex(0);
    setEditingSlide({
      id: "",
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
      imageUrl: "",
      imageAlt: "Diagnova Hero Banner",
      sortOrder: (cmsData?.homepage?.hero?.slides?.length || 0) + 1,
      isActive: true,
    });
    setIsSlideFormOpen(true);
  };

  const handleSlideMultiUpload = (files: UploadedFileItem[]) => {
    if (files.length === 0) return;
    const drafts = files.map((file, idx) => ({
      id: "",
      titleId: cleanFileNameToTitle(file.originalName),
      titleEn: cleanFileNameToTitle(file.originalName),
      subtitleId: "Solusi otomatisasi kecerdasan laboratorium klinis mutakhir.",
      subtitleEn: "Next-generation intelligent clinical laboratory automation.",
      badgeId: "Platform Intelijen Laboratorium Berbasis AI",
      badgeEn: "AI-Powered Laboratory Intelligence Platform",
      ctaPrimaryTextId: "Jadwalkan Demo",
      ctaPrimaryTextEn: "Schedule Demo",
      ctaPrimaryUrl: "/request-demo",
      ctaSecondaryTextId: "Jelajahi Modul",
      ctaSecondaryTextEn: "Explore Modules",
      ctaSecondaryUrl: "/modules",
      imageUrl: file.url,
      imageAlt: cleanFileNameToTitle(file.originalName),
      sortOrder: (cmsData?.homepage?.hero?.slides?.length || 0) + idx + 1,
      isActive: true,
    }));
    setSlideDraftQueue(drafts);
    setActiveSlideDraftIndex(0);
    setEditingSlide(drafts[0]);
    showToast(`Dibuat ${drafts.length} draf slide dari gambar yang diunggah.`);
  };

  const handleSaveSlide = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingSlide?.imageUrl) {
      showToast("Harap unggah gambar background slide terlebih dahulu.", "error");
      return;
    }
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
        showToast("Slide carousel berhasil disimpan!");
        if (slideDraftQueue.length > activeSlideDraftIndex + 1) {
          const nextIdx = activeSlideDraftIndex + 1;
          setActiveSlideDraftIndex(nextIdx);
          setEditingSlide(slideDraftQueue[nextIdx]);
        } else {
          setIsSlideFormOpen(false);
          setEditingSlide(null);
          setSlideDraftQueue([]);
        }
        await loadCmsData();
      } else {
        showToast(json.message || "Gagal menyimpan slide.", "error");
      }
    } catch (err) {
      showToast("Gagal menyimpan slide.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAllSlideDrafts = async () => {
    if (slideDraftQueue.length === 0) return;
    setIsSaving(true);
    try {
      let savedCount = 0;
      for (const draft of slideDraftQueue) {
        const res = await fetch("/api/admin/cms/homepage", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "hero_slide",
            action: "save",
            data: draft,
          }),
        });
        if (res.ok) savedCount++;
      }
      showToast(`Berhasil menyimpan ${savedCount} slide carousel baru!`);
      setIsSlideFormOpen(false);
      setEditingSlide(null);
      setSlideDraftQueue([]);
      await loadCmsData();
    } catch (err) {
      showToast("Gagal menyimpan seluruh draf slide.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSlide = async (id: string) => {
    if (!confirm("Hapus slide carousel ini?")) return;
    try {
      const res = await fetch("/api/admin/cms/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "hero_slide",
          action: "delete",
          data: { id },
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast("Slide carousel berhasil dihapus.");
        await loadCmsData();
      }
    } catch (err) {
      showToast("Gagal menghapus slide.", "error");
    }
  };

  // ===========================================================================
  // PARTNER (TRUSTED BY) CRUD
  // ===========================================================================
  const handleOpenNewPartner = () => {
    setPartnerDraftQueue([]);
    setEditingPartner({
      id: "",
      name: "",
      logoUrl: "",
      sortOrder: (cmsData?.homepage?.trustedBy?.partners?.length || 0) + 1,
      isActive: true,
    });
    setIsPartnerFormOpen(true);
  };

  const handlePartnerMultiUpload = (files: UploadedFileItem[]) => {
    if (files.length === 0) return;
    const drafts = files.map((file, idx) => ({
      id: "",
      name: cleanFileNameToTitle(file.originalName),
      logoUrl: file.url,
      sortOrder: (cmsData?.homepage?.trustedBy?.partners?.length || 0) + idx + 1,
      isActive: true,
    }));
    setPartnerDraftQueue(drafts);
    setEditingPartner(drafts[0]);
    showToast(`Dibuat ${drafts.length} draf mitra dari logo yang diunggah.`);
  };

  const handleSavePartner = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingPartner?.logoUrl) {
      showToast("Harap unggah logo mitra terlebih dahulu.", "error");
      return;
    }
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
        setIsPartnerFormOpen(false);
        setEditingPartner(null);
        setPartnerDraftQueue([]);
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

  const handleSaveAllPartnerDrafts = async () => {
    if (partnerDraftQueue.length === 0) return;
    setIsSaving(true);
    try {
      let saved = 0;
      for (const draft of partnerDraftQueue) {
        const res = await fetch("/api/admin/cms/homepage", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "partner",
            action: "save",
            data: draft,
          }),
        });
        if (res.ok) saved++;
      }
      showToast(`Berhasil menyimpan ${saved} mitra baru!`);
      setIsPartnerFormOpen(false);
      setEditingPartner(null);
      setPartnerDraftQueue([]);
      await loadCmsData();
    } catch (err) {
      showToast("Gagal menyimpan batch mitra.", "error");
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

  // ===========================================================================
  // TESTIMONIALS CRUD
  // ===========================================================================
  const handleOpenNewTestimonial = () => {
    setTestimonialDraftQueue([]);
    setEditingTestimonial({
      id: "",
      name: "",
      roleId: "Kepala Laboratorium Sentral",
      roleEn: "Head of Central Laboratory",
      institution: "RSUP Dr. Sardjito",
      quoteId: "",
      quoteEn: "",
      avatarUrl: "",
      rating: 5,
      sortOrder: (cmsData?.homepage?.testimonials?.items?.length || 0) + 1,
      isActive: true,
    });
    setIsTestimonialFormOpen(true);
  };

  const handleTestimonialMultiUpload = (files: UploadedFileItem[]) => {
    if (files.length === 0) return;
    const drafts = files.map((file, idx) => ({
      id: "",
      name: `dr. ${cleanFileNameToTitle(file.originalName)}`,
      roleId: "Spesialis Patologi Klinik",
      roleEn: "Clinical Pathology Specialist",
      institution: "Rumah Sakit Rujukan",
      quoteId: "Platform Diagnova mempermudah validasi hasil klinis dan monitoring laboratorium kami secara signifikan.",
      quoteEn: "Diagnova significantly simplifies clinical result validation and laboratory monitoring for our team.",
      avatarUrl: file.url,
      rating: 5,
      sortOrder: (cmsData?.homepage?.testimonials?.items?.length || 0) + idx + 1,
      isActive: true,
    }));
    setTestimonialDraftQueue(drafts);
    setEditingTestimonial(drafts[0]);
    showToast(`Dibuat ${drafts.length} draf testimoni dari foto dokter yang diunggah.`);
  };

  const handleSaveTestimonial = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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
        setIsTestimonialFormOpen(false);
        setEditingTestimonial(null);
        setTestimonialDraftQueue([]);
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
        showToast("Testimonial berhasil dihapus.");
        await loadCmsData();
      }
    } catch (err) {
      showToast("Gagal menghapus testimonial.", "error");
    }
  };

  // ===========================================================================
  // COMPARISON CRUD
  // ===========================================================================
  const handleOpenNewComparison = () => {
    setEditingComparison({
      id: "",
      number: String((cmsData?.homepage?.comparison?.items?.length || 0) + 1).padStart(2, "0"),
      conventionalTitleId: "",
      conventionalTitleEn: "",
      conventionalDescId: "",
      conventionalDescEn: "",
      diagnovaTitleId: "",
      diagnovaTitleEn: "",
      diagnovaDescId: "",
      diagnovaDescEn: "",
      impactMetric: "70% Lebih Efisien",
      sortOrder: (cmsData?.homepage?.comparison?.items?.length || 0) + 1,
      isActive: true,
    });
    setIsComparisonFormOpen(true);
  };

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
        showToast("Poin komparasi berhasil disimpan.");
        setIsComparisonFormOpen(false);
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
    if (!confirm("Hapus poin perbandingan ini?")) return;
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
        showToast("Item komparasi berhasil dihapus.");
        await loadCmsData();
      }
    } catch (err) {
      showToast("Gagal menghapus item komparasi.", "error");
    }
  };

  // ===========================================================================
  // SOLUTIONS CRUD
  // ===========================================================================
  const handleOpenNewSolution = () => {
    setEditingSolution({
      slug: "",
      name: "",
      category: "Klinik / RS",
      tagline: "",
      description: "",
      icon: "Building2",
      keyBenefits: ["Otomatisasi alur kerja", "Integrasi SIMRS", "Validasi AI"],
      metrics: "70% TAT",
    });
    setIsSolutionFormOpen(true);
  };

  const handleSaveSolution = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/cms/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "solution_item",
          action: "save",
          data: editingSolution,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast("Item solusi berhasil disimpan.");
        setIsSolutionFormOpen(false);
        setEditingSolution(null);
        await loadCmsData();
      } else {
        showToast(json.message || "Gagal menyimpan solusi.", "error");
      }
    } catch (err) {
      showToast("Gagal menyimpan solusi.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSolution = async (slug: string) => {
    if (!confirm("Hapus modul solusi ini?")) return;
    try {
      const res = await fetch("/api/admin/cms/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "solution_item",
          action: "delete",
          data: { slug },
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast("Solusi berhasil dihapus.");
        await loadCmsData();
      }
    } catch (err) {
      showToast("Gagal menghapus solusi.", "error");
    }
  };

  // Main Tabs Navigation Definitions
  const mainTabsList: { key: CmsMainTab; label: string; icon: any }[] = [
    { key: "navigation", label: "Navigasi Website", icon: Compass },
    { key: "homepage", label: "Homepage", icon: Globe },
    { key: "platform", label: "Platform", icon: Cpu },
    { key: "solutions", label: "Solusi", icon: Boxes },
    { key: "modules", label: "Modul", icon: Layers },
    { key: "nova_ai", label: "Nova AI", icon: BrainCircuit },
    { key: "integrations", label: "Integrasi", icon: Network },
  ];

  const homepageSubTabsList: { key: HomepageSubTab; label: string; icon: any }[] = [
    { key: "hero", label: "Hero Carousel", icon: Layers },
    { key: "trusted_by", label: "Mitra / RS", icon: Globe },
    { key: "about", label: "Tentang Diagnova", icon: Sparkles },
    { key: "comparison", label: "Komparasi", icon: CheckSquare },
    { key: "workflow", label: "Alur Kerja", icon: ArrowRight },
    { key: "infrastructure", label: "Infrastruktur", icon: ShieldAlert },
    { key: "testimonials", label: "Testimonial", icon: Quote },
    { key: "cta", label: "Banner CTA", icon: ExternalLink },
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-3">
        <RefreshCw className="h-7 w-7 animate-spin text-[#087BEE]" />
        <p className="text-xs font-semibold text-slate-500">Memuat Pusat CMS Diagnova...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold shadow-xl transition-all animate-in fade-in slide-in-from-bottom-3 ${
            toastMessage.type === "success"
              ? "bg-emerald-600 text-white"
              : "bg-rose-600 text-white"
          }`}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header Hub Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-[#087BEE] border border-blue-200/60">
              Pusat CMS Diagnova
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">Satu Pengelolaan Seluruh Halaman & Navigasi</span>
          </div>
          <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
            Pusat Pengelolaan Konten (CMS)
          </h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Kelola menu navigasi, beranda, modul, solusi, platform, Nova AI, dan integrasi dari satu tempat.
          </p>
        </div>

        {/* Global Toolbar: Language Switcher & Preview */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200/70 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setEditorLang("ID")}
              className={`rounded-lg px-2.5 py-1 transition-all ${
                editorLang === "ID"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              🇮🇩 Bahasa ID
            </button>
            <button
              type="button"
              onClick={() => setEditorLang("EN")}
              className={`rounded-lg px-2.5 py-1 transition-all ${
                editorLang === "EN"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              🇬🇧 English (EN)
            </button>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Eye className="h-3.5 w-3.5 text-slate-500" />
            <span>Lihat Website</span>
          </a>
        </div>
      </div>

      {/* INTERNAL CMS NAVIGATION BAR */}
      <div className="flex overflow-x-auto gap-1 border-b border-slate-200/80 pb-px scrollbar-none">
        {mainTabsList.map((tab) => {
          const Icon = tab.icon;
          const isActive = mainTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                setMainTab(tab.key);
                setIsNavFormOpen(false);
                setIsSlideFormOpen(false);
                setIsPartnerFormOpen(false);
                setIsTestimonialFormOpen(false);
                setIsComparisonFormOpen(false);
                setIsSolutionFormOpen(false);
              }}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all whitespace-nowrap border-b-2 ${
                isActive
                  ? "border-[#087BEE] text-[#087BEE] bg-blue-50/50 shadow-xs"
                  : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-[#087BEE]" : "text-slate-400"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ==================================================================== */}
      {/* 1. TAB: NAVIGASI WEBSITE */}
      {/* ==================================================================== */}
      {mainTab === "navigation" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Struktur Menu Navigasi Website</h3>
                <p className="text-xs text-slate-500">
                  Kelola menu bar navbar publik, submenu dropdown, dan link target ke halaman atau section beranda.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenNewNavMenu(null)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs shrink-0"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Tambah Menu Utama</span>
              </button>
            </div>

            {/* INLINE FORM: TAMBAH / EDIT MENU */}
            {isNavFormOpen && editingNavMenu && (
              <div className="mb-6 rounded-2xl border-2 border-blue-200 bg-blue-50/20 p-5 shadow-sm space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-blue-100 pb-3">
                  <h4 className="text-xs font-bold text-slate-900">
                    {editingNavMenu.id
                      ? "Edit Menu Navigasi"
                      : editingNavMenu.parentId
                      ? "Tambah Submenu Baru"
                      : "Tambah Menu Utama Baru"}
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setIsNavFormOpen(false);
                      setEditingNavMenu(null);
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <form onSubmit={handleSaveNavMenu} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Pilihan Induk Menu
                      </label>
                      <select
                        value={editingNavMenu.parentId || ""}
                        onChange={(e) =>
                          setEditingNavMenu({
                            ...editingNavMenu,
                            parentId: e.target.value || null,
                          })
                        }
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 bg-white"
                      >
                        <option value="">(Menu Utama / Root Navigasi)</option>
                        {navMenus.map((root) => (
                          <option key={root.id} value={root.id}>
                            Submenu dari: {root.labelId}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Icon Nama (Lucide)
                      </label>
                      <input
                        type="text"
                        value={editingNavMenu.iconName || "Layers"}
                        onChange={(e) => setEditingNavMenu({ ...editingNavMenu, iconName: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 bg-white"
                        placeholder="Contoh: Layers, Activity, Cpu, Sparkles, Compass"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Label Menu (Bahasa Indonesia) *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingNavMenu.labelId || ""}
                        onChange={(e) => setEditingNavMenu({ ...editingNavMenu, labelId: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Label Menu (English) *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingNavMenu.labelEn || ""}
                        onChange={(e) => setEditingNavMenu({ ...editingNavMenu, labelEn: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        URL Tujuan Halaman (Path)
                      </label>
                      <input
                        type="text"
                        value={editingNavMenu.url || ""}
                        onChange={(e) => setEditingNavMenu({ ...editingNavMenu, url: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 bg-white font-mono"
                        placeholder="Contoh: /platform/workflow atau /solutions"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Atau Target Anchor Section Beranda
                      </label>
                      <select
                        value={editingNavMenu.sectionKey || ""}
                        onChange={(e) =>
                          setEditingNavMenu({
                            ...editingNavMenu,
                            sectionKey: e.target.value || null,
                          })
                        }
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 bg-white"
                      >
                        <option value="">(Tidak ditautkan ke section)</option>
                        <option value="hero">Hero Carousel (#hero)</option>
                        <option value="workflow">Alur Kerja (#workflow)</option>
                        <option value="infrastructure">Infrastruktur (#infrastructure)</option>
                        <option value="about">Tentang Diagnova (#about)</option>
                        <option value="comparison">Komparasi (#comparison)</option>
                        <option value="testimonials">Testimonial (#testimonials)</option>
                        <option value="cta">Banner CTA (#cta)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Deskripsi Singkat Submenu (ID)
                      </label>
                      <input
                        type="text"
                        value={editingNavMenu.descriptionId || ""}
                        onChange={(e) =>
                          setEditingNavMenu({ ...editingNavMenu, descriptionId: e.target.value })
                        }
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Deskripsi Singkat Submenu (EN)
                      </label>
                      <input
                        type="text"
                        value={editingNavMenu.descriptionEn || ""}
                        onChange={(e) =>
                          setEditingNavMenu({ ...editingNavMenu, descriptionEn: e.target.value })
                        }
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-200/80 pt-3">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold text-slate-700">Urutan:</label>
                        <input
                          type="number"
                          value={editingNavMenu.sortOrder || 1}
                          onChange={(e) =>
                            setEditingNavMenu({
                              ...editingNavMenu,
                              sortOrder: parseInt(e.target.value, 10) || 1,
                            })
                          }
                          className="w-16 rounded-lg border border-slate-200 px-2 py-1 text-xs bg-white text-slate-800"
                        />
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                        <input
                          type="checkbox"
                          checked={editingNavMenu.isActive ?? true}
                          onChange={(e) =>
                            setEditingNavMenu({ ...editingNavMenu, isActive: e.target.checked })
                          }
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span>Aktif di Navbar</span>
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsNavFormOpen(false);
                          setEditingNavMenu(null);
                        }}
                        className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#087BEE] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-600 shadow-xs"
                      >
                        <Save className="h-3.5 w-3.5" />
                        <span>Simpan Menu</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* HIERARCHICAL MENUS LIST */}
            <div className="space-y-3">
              {navMenus.map((rootMenu) => {
                const isExpanded = expandedNavId === rootMenu.id;
                const hasSubs = rootMenu.submenus && rootMenu.submenus.length > 0;
                return (
                  <div
                    key={rootMenu.id}
                    className="rounded-xl border border-slate-200 bg-white overflow-hidden hover:border-blue-300 transition-all shadow-xs"
                  >
                    <div className="p-4 flex items-center justify-between gap-3 bg-slate-50/40">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setExpandedNavId(isExpanded ? null : rootMenu.id)}
                          className="p-1 rounded text-slate-400 hover:text-slate-600"
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                        <div className="h-8 w-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#087BEE] font-bold text-xs">
                          {rootMenu.sortOrder}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-900">{rootMenu.labelId}</h4>
                            <span className="text-[11px] text-slate-400 font-normal">({rootMenu.labelEn})</span>
                            <span className={rootMenu.isActive ? "text-[10px] text-emerald-600 font-bold" : "text-[10px] text-slate-400"}>
                              {rootMenu.isActive ? "● Aktif" : "○ Non-aktif"}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                            {rootMenu.sectionKey ? `#${rootMenu.sectionKey}` : rootMenu.url || "(Menu Grup)"} •{" "}
                            {rootMenu.submenus?.length || 0} Submenu
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenNewNavMenu(rootMenu.id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          <Plus className="h-3 w-3 text-emerald-600" />
                          <span>Submenu</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingNavMenu({ ...rootMenu, parentId: null });
                            setIsNavFormOpen(true);
                          }}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                          title="Edit Menu"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteNavMenu(rootMenu.id)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Hapus Menu"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Submenus Drawer */}
                    {isExpanded && hasSubs && (
                      <div className="border-t border-slate-100 bg-slate-50/20 p-3 space-y-2">
                        {rootMenu.submenus.map((sub: any) => (
                          <div
                            key={sub.id}
                            className="flex items-center justify-between rounded-lg border border-slate-200/80 bg-white p-2.5 hover:border-blue-200"
                          >
                            <div className="flex items-center gap-2.5 pl-6">
                              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-semibold text-slate-900">{sub.labelId}</span>
                                  <span className="text-[10px] text-slate-400">({sub.labelEn})</span>
                                  <span className={sub.isActive ? "text-[10px] text-emerald-600" : "text-[10px] text-slate-400"}>
                                    {sub.isActive ? "●" : "○"}
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                                  {sub.descriptionId || sub.url || (sub.sectionKey ? `#${sub.sectionKey}` : "-")}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingNavMenu({ ...sub, parentId: rootMenu.id });
                                  setIsNavFormOpen(true);
                                }}
                                className="p-1 rounded text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                                title="Edit Submenu"
                              >
                                <Edit className="h-3 w-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteNavMenu(sub.id)}
                                className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                title="Hapus Submenu"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 2. TAB: HOMEPAGE */}
      {/* ==================================================================== */}
      {mainTab === "homepage" && (
        <div className="space-y-6">
          {/* Sub-tabs for 8 homepage sections */}
          <div className="flex overflow-x-auto gap-1 rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-semibold scrollbar-none">
            {homepageSubTabsList.map((st) => {
              const Icon = st.icon;
              const isSubActive = homepageTab === st.key;
              return (
                <button
                  key={st.key}
                  type="button"
                  onClick={() => {
                    setHomepageTab(st.key);
                    setIsSlideFormOpen(false);
                    setIsPartnerFormOpen(false);
                    setIsTestimonialFormOpen(false);
                    setIsComparisonFormOpen(false);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                    isSubActive
                      ? "bg-white text-slate-900 shadow-xs font-bold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isSubActive ? "text-[#087BEE]" : "text-slate-400"}`} />
                  <span>{st.label}</span>
                </button>
              );
            })}
          </div>

          {/* HOMEPAGE SECTION CONTENT: HERO CAROUSEL */}
          {homepageTab === "hero" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Daftar Slide Carousel Hero</h3>
                  <p className="text-xs text-slate-500">
                    Kelola gambar banner 16:9, teks judul, tombol aksi (CTA), dan urutan slide utama beranda.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenNewSlide}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs shrink-0"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Tambah Slide Baru</span>
                </button>
              </div>

              {/* INLINE FORM: HERO SLIDE */}
              {isSlideFormOpen && editingSlide && (
                <div className="rounded-2xl border-2 border-blue-200 bg-blue-50/20 p-5 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-blue-100 pb-3">
                    <h4 className="text-xs font-bold text-slate-900">
                      {editingSlide.id ? "Edit Slide Carousel" : "Tambah Slide Baru"}
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSlideFormOpen(false);
                        setEditingSlide(null);
                        setSlideDraftQueue([]);
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {slideDraftQueue.length > 1 && (
                    <div className="rounded-xl bg-blue-100/60 p-3 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="text-xs font-semibold text-blue-900">
                        {slideDraftQueue.length} Draf Slide Dibuat:
                        <div className="flex gap-1.5 mt-1.5">
                          {slideDraftQueue.map((draft, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setActiveSlideDraftIndex(idx);
                                setEditingSlide(draft);
                              }}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                                activeSlideDraftIndex === idx
                                  ? "bg-[#087BEE] text-white"
                                  : "bg-white text-slate-700 border border-slate-200"
                              }`}
                            >
                              Slide #{idx + 1}
                            </button>
                          ))}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleSaveAllSlideDrafts}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold"
                      >
                        <Save className="h-3.5 w-3.5" />
                        <span>Simpan Semua ({slideDraftQueue.length})</span>
                      </button>
                    </div>
                  )}

                  <form onSubmit={handleSaveSlide} className="space-y-4">
                    <ImageUploader
                      value={editingSlide.imageUrl || ""}
                      onChange={(url: string) => setEditingSlide({ ...editingSlide, imageUrl: url })}
                      label="Gambar Background Slide Banner *"
                      hint="Seret 1 banner atau pilih banyak file untuk membuat draf slide otomatis"
                      aspectRatio="video"
                      allowMultiple={true}
                      onMultiUpload={handleSlideMultiUpload}
                      required={true}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Judul (ID) *</label>
                        <input
                          type="text"
                          required
                          value={editingSlide.titleId || ""}
                          onChange={(e) => setEditingSlide({ ...editingSlide, titleId: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Judul (EN) *</label>
                        <input
                          type="text"
                          required
                          value={editingSlide.titleEn || ""}
                          onChange={(e) => setEditingSlide({ ...editingSlide, titleEn: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi (ID)</label>
                        <textarea
                          rows={2}
                          value={editingSlide.subtitleId || ""}
                          onChange={(e) => setEditingSlide({ ...editingSlide, subtitleId: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi (EN)</label>
                        <textarea
                          rows={2}
                          value={editingSlide.subtitleEn || ""}
                          onChange={(e) => setEditingSlide({ ...editingSlide, subtitleEn: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Teks CTA (ID)</label>
                        <input
                          type="text"
                          value={editingSlide.ctaPrimaryTextId || ""}
                          onChange={(e) => setEditingSlide({ ...editingSlide, ctaPrimaryTextId: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Teks CTA (EN)</label>
                        <input
                          type="text"
                          value={editingSlide.ctaPrimaryTextEn || ""}
                          onChange={(e) => setEditingSlide({ ...editingSlide, ctaPrimaryTextEn: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">URL CTA</label>
                        <input
                          type="text"
                          value={editingSlide.ctaPrimaryUrl || "/request-demo"}
                          onChange={(e) => setEditingSlide({ ...editingSlide, ctaPrimaryUrl: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-200/80 pt-3">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <label className="text-xs font-semibold text-slate-700">Urutan:</label>
                          <input
                            type="number"
                            value={editingSlide.sortOrder || 1}
                            onChange={(e) =>
                              setEditingSlide({ ...editingSlide, sortOrder: parseInt(e.target.value, 10) || 1 })
                            }
                            className="w-16 rounded-lg border border-slate-200 px-2.5 py-1 text-xs bg-white text-slate-800"
                          />
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                          <input
                            type="checkbox"
                            checked={editingSlide.isActive ?? true}
                            onChange={(e) => setEditingSlide({ ...editingSlide, isActive: e.target.checked })}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          <span>Aktif</span>
                        </label>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsSlideFormOpen(false);
                            setEditingSlide(null);
                            setSlideDraftQueue([]);
                          }}
                          className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-[#087BEE] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-600 shadow-xs"
                        >
                          <Save className="h-3.5 w-3.5" />
                          <span>Simpan Slide</span>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {/* SLIDES GRID */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {cmsData?.homepage?.hero?.slides?.map((slide: any, index: number) => (
                  <div
                    key={slide.id}
                    className="group relative rounded-xl border border-slate-200 bg-white p-4 hover:border-blue-300 hover:shadow-xs transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-2">
                        <span className="rounded-md bg-blue-50 px-2 py-0.5 border border-blue-200 text-[#087BEE] font-bold">
                          Slide #{slide.sortOrder || index + 1}
                        </span>
                        <span className={slide.isActive ? "text-emerald-600 font-bold" : "text-slate-400"}>
                          {slide.isActive ? "● Aktif" : "○ Non-aktif"}
                        </span>
                      </div>

                      <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-100 mb-3 border border-slate-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={slide.imageUrl}
                          alt="Hero banner"
                          className="h-full w-full object-cover transition-transform group-hover:scale-105 duration-300"
                        />
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 line-clamp-2 mb-1">
                        {editorLang === "ID" ? slide.titleId : slide.titleEn}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2">
                        {editorLang === "ID" ? slide.subtitleId : slide.subtitleEn}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-end gap-1.5 border-t border-slate-100 pt-3">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingSlide(slide);
                          setIsSlideFormOpen(true);
                        }}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        <Edit className="h-3 w-3 text-blue-600" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSlide(slide.id)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Hapus"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* HOMEPAGE SECTION CONTENT: TRUSTED BY */}
          {homepageTab === "trusted_by" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Daftar Mitra & Institusi Laboratorium</h3>
                  <p className="text-xs text-slate-500">Logo rumah sakit dan laboratorium yang berputar pada running ticker.</p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenNewPartner}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs shrink-0"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Tambah Mitra Baru</span>
                </button>
              </div>

              {isPartnerFormOpen && editingPartner && (
                <div className="rounded-2xl border-2 border-blue-200 bg-blue-50/20 p-5 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-blue-100 pb-3">
                    <h4 className="text-xs font-bold text-slate-900">
                      {editingPartner.id ? "Edit Mitra" : "Tambah Mitra Baru"}
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        setIsPartnerFormOpen(false);
                        setEditingPartner(null);
                        setPartnerDraftQueue([]);
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {partnerDraftQueue.length > 1 && (
                    <div className="rounded-xl bg-blue-100/60 p-3 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-blue-900">
                        Terpilih {partnerDraftQueue.length} logo mitra sekaligus. Simpan otomatis atau sesuaikan nama di bawah.
                      </span>
                      <button
                        type="button"
                        onClick={handleSaveAllPartnerDrafts}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold"
                      >
                        <Save className="h-3.5 w-3.5" />
                        <span>Simpan Semua ({partnerDraftQueue.length})</span>
                      </button>
                    </div>
                  )}

                  <form onSubmit={handleSavePartner} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                      <ImageUploader
                        value={editingPartner.logoUrl || ""}
                        onChange={(url: string) => setEditingPartner({ ...editingPartner, logoUrl: url })}
                        label="Upload Logo Mitra (SVG / PNG Transparan) *"
                        hint="Seret berkas logo atau pilih folder untuk impor massal"
                        aspectRatio="square"
                        allowMultiple={true}
                        allowFolder={true}
                        onMultiUpload={handlePartnerMultiUpload}
                        required={true}
                      />

                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Mitra / RS *</label>
                          <input
                            type="text"
                            required
                            value={editingPartner.name || ""}
                            onChange={(e) => setEditingPartner({ ...editingPartner, name: e.target.value })}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white text-slate-800"
                          />
                        </div>

                        <div className="flex items-center gap-4 pt-1">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Urutan</label>
                            <input
                              type="number"
                              value={editingPartner.sortOrder || 1}
                              onChange={(e) =>
                                setEditingPartner({
                                  ...editingPartner,
                                  sortOrder: parseInt(e.target.value, 10) || 1,
                                })
                              }
                              className="w-20 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs bg-white text-slate-800"
                            />
                          </div>

                          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 mt-5">
                            <input
                              type="checkbox"
                              checked={editingPartner.isActive ?? true}
                              onChange={(e) => setEditingPartner({ ...editingPartner, isActive: e.target.checked })}
                              className="rounded text-blue-600"
                            />
                            <span>Aktif</span>
                          </label>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => {
                              setIsPartnerFormOpen(false);
                              setEditingPartner(null);
                            }}
                            className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-600"
                          >
                            Batal
                          </button>
                          <button
                            type="submit"
                            disabled={isSaving}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#087BEE] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-600"
                          >
                            <Save className="h-3.5 w-3.5" />
                            <span>Simpan Mitra</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {cmsData?.homepage?.trustedBy?.partners?.map((p: any) => (
                  <div
                    key={p.id}
                    className="rounded-xl border border-slate-200 bg-white p-3 flex flex-col items-center justify-between text-center hover:border-blue-300 hover:shadow-xs transition-all"
                  >
                    <div className="h-12 w-full flex items-center justify-center p-1 bg-slate-50 rounded-lg mb-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.logoUrl} alt={p.name} className="h-8 max-w-full object-contain" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-800 truncate w-full mb-2" title={p.name}>
                      {p.name}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPartner(p);
                          setIsPartnerFormOpen(true);
                        }}
                        className="p-1 rounded text-slate-500 hover:text-blue-600"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePartner(p.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* HOMEPAGE SECTION CONTENT: ABOUT */}
          {homepageTab === "about" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Konten Narasi Tentang Diagnova</h3>
                  <p className="text-xs text-slate-500">Badge pill, statement scroll-reveal, narasi, dan visual gambar DNA/Lab.</p>
                </div>
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => saveCurrentSection("about")}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#087BEE] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-600 shadow-xs"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Simpan Konten About</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-5">
                  <ImageUploader
                    value={sectionForms["about"]?.extraContent?.imageUrl || ""}
                    onChange={(url: string) => handleExtraContentChange("about", "imageUrl", url)}
                    label="Gambar Ilustrasi Struktur Lab / DNA"
                    hint="Format Webp atau PNG transparan untuk visual samping narasi"
                    aspectRatio="square"
                  />
                </div>
                <div className="lg:col-span-7 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Badge Pill ({editorLang})</label>
                    <input
                      type="text"
                      value={
                        editorLang === "ID"
                          ? sectionForms["about"]?.badgeId || ""
                          : sectionForms["about"]?.badgeEn || ""
                      }
                      onChange={(e) =>
                        handleSectionFieldChange("about", editorLang === "ID" ? "badgeId" : "badgeEn", e.target.value)
                      }
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs bg-white text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Statement Utama (Scroll-Reveal) ({editorLang})
                    </label>
                    <textarea
                      rows={3}
                      value={
                        editorLang === "ID"
                          ? sectionForms["about"]?.titleId || ""
                          : sectionForms["about"]?.titleEn || ""
                      }
                      onChange={(e) =>
                        handleSectionFieldChange("about", editorLang === "ID" ? "titleId" : "titleEn", e.target.value)
                      }
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs bg-white text-slate-800 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Paragraf Penjelas ({editorLang})</label>
                    <textarea
                      rows={4}
                      value={
                        editorLang === "ID"
                          ? sectionForms["about"]?.subtitleId || ""
                          : sectionForms["about"]?.subtitleEn || ""
                      }
                      onChange={(e) =>
                        handleSectionFieldChange("about", editorLang === "ID" ? "subtitleId" : "subtitleEn", e.target.value)
                      }
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs bg-white text-slate-800"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* HOMEPAGE SECTION CONTENT: COMPARISON */}
          {homepageTab === "comparison" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Daftar Poin Komparasi</h3>
                  <p className="text-xs text-slate-500">Perbandingan sistem konvensional vs keunggulan Diagnova AI.</p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenNewComparison}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs shrink-0"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Tambah Poin Komparasi</span>
                </button>
              </div>

              {isComparisonFormOpen && editingComparison && (
                <div className="rounded-2xl border-2 border-blue-200 bg-blue-50/20 p-5 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-blue-100 pb-3">
                    <h4 className="text-xs font-bold text-slate-900">
                      {editingComparison.id ? "Edit Poin Komparasi" : "Tambah Poin Baru"}
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        setIsComparisonFormOpen(false);
                        setEditingComparison(null);
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveComparison} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor / Poin *</label>
                        <input
                          type="text"
                          required
                          value={editingComparison.number || "01"}
                          onChange={(e) => setEditingComparison({ ...editingComparison, number: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Metrik Dampak / Tag</label>
                        <input
                          type="text"
                          value={editingComparison.impactMetric || "70% Lebih Efisien"}
                          onChange={(e) =>
                            setEditingComparison({ ...editingComparison, impactMetric: e.target.value })
                          }
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Urutan</label>
                        <input
                          type="number"
                          value={editingComparison.sortOrder || 1}
                          onChange={(e) =>
                            setEditingComparison({
                              ...editingComparison,
                              sortOrder: parseInt(e.target.value, 10) || 1,
                            })
                          }
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="rounded-xl border border-rose-200 bg-rose-50/30 p-3.5 space-y-3">
                        <span className="text-[11px] font-bold text-rose-700 uppercase">Sistem Konvensional</span>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Judul ({editorLang})</label>
                          <input
                            type="text"
                            required
                            value={
                              editorLang === "ID"
                                ? editingComparison.conventionalTitleId || ""
                                : editingComparison.conventionalTitleEn || ""
                            }
                            onChange={(e) =>
                              setEditingComparison({
                                ...editingComparison,
                                [editorLang === "ID" ? "conventionalTitleId" : "conventionalTitleEn"]: e.target.value,
                              })
                            }
                            className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs bg-white text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi ({editorLang})</label>
                          <textarea
                            rows={2}
                            value={
                              editorLang === "ID"
                                ? editingComparison.conventionalDescId || ""
                                : editingComparison.conventionalDescEn || ""
                            }
                            onChange={(e) =>
                              setEditingComparison({
                                ...editingComparison,
                                [editorLang === "ID" ? "conventionalDescId" : "conventionalDescEn"]: e.target.value,
                              })
                            }
                            className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs bg-white text-slate-800"
                          />
                        </div>
                      </div>

                      <div className="rounded-xl border border-blue-200 bg-blue-50/30 p-3.5 space-y-3">
                        <span className="text-[11px] font-bold text-[#087BEE] uppercase">Keunggulan Diagnova</span>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Judul ({editorLang})</label>
                          <input
                            type="text"
                            required
                            value={
                              editorLang === "ID"
                                ? editingComparison.diagnovaTitleId || ""
                                : editingComparison.diagnovaTitleEn || ""
                            }
                            onChange={(e) =>
                              setEditingComparison({
                                ...editingComparison,
                                [editorLang === "ID" ? "diagnovaTitleId" : "diagnovaTitleEn"]: e.target.value,
                              })
                            }
                            className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs bg-white text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi ({editorLang})</label>
                          <textarea
                            rows={2}
                            value={
                              editorLang === "ID"
                                ? editingComparison.diagnovaDescId || ""
                                : editingComparison.diagnovaDescEn || ""
                            }
                            onChange={(e) =>
                              setEditingComparison({
                                ...editingComparison,
                                [editorLang === "ID" ? "diagnovaDescId" : "diagnovaDescEn"]: e.target.value,
                              })
                            }
                            className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs bg-white text-slate-800"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200/80">
                      <button
                        type="button"
                        onClick={() => {
                          setIsComparisonFormOpen(false);
                          setEditingComparison(null);
                        }}
                        className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-600"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#087BEE] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-600"
                      >
                        <Save className="h-3.5 w-3.5" />
                        <span>Simpan Komparasi</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {cmsData?.homepage?.comparison?.items?.map((item: any) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col justify-between hover:border-blue-300 hover:shadow-xs transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
                        <span className="text-[#087BEE] font-mono">Poin #{item.number}</span>
                        <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] text-blue-700 border border-blue-200/60 font-semibold">
                          {item.impactMetric}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                        {editorLang === "ID" ? item.diagnovaTitleId : item.diagnovaTitleEn}
                      </h4>
                      <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">
                        {editorLang === "ID" ? item.diagnovaDescId : item.diagnovaDescEn}
                      </p>
                    </div>

                    <div className="flex items-center justify-end gap-1.5 border-t border-slate-100 pt-3 mt-3">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingComparison(item);
                          setIsComparisonFormOpen(true);
                        }}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-blue-600"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteComparison(item.id)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* HOMEPAGE SECTION CONTENT: WORKFLOW */}
          {homepageTab === "workflow" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Alur Kerja Laboratorium (4 Tahapan)</h3>
                  <p className="text-xs text-slate-500">Penerimaan sampel, verifikasi otomatis, delta check, hingga rilis hasil.</p>
                </div>
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => saveCurrentSection("workflow")}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#087BEE] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-600"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Simpan Alur Kerja</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Badge Section ({editorLang})</label>
                  <input
                    type="text"
                    value={
                      editorLang === "ID"
                        ? sectionForms["workflow"]?.badgeId || ""
                        : sectionForms["workflow"]?.badgeEn || ""
                    }
                    onChange={(e) =>
                      handleSectionFieldChange("workflow", editorLang === "ID" ? "badgeId" : "badgeEn", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Utama ({editorLang})</label>
                  <input
                    type="text"
                    value={
                      editorLang === "ID"
                        ? sectionForms["workflow"]?.titleId || ""
                        : sectionForms["workflow"]?.titleEn || ""
                    }
                    onChange={(e) =>
                      handleSectionFieldChange("workflow", editorLang === "ID" ? "titleId" : "titleEn", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 mb-3">Detail 4 Langkah Alur Kerja</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sectionForms["workflow"]?.extraContent?.steps?.map((step: any, idx: number) => (
                    <div key={step.id || idx} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-[#087BEE]">
                        <span>Langkah {step.number || idx + 1}</span>
                        <span className="text-slate-400 font-mono text-[10px]">{step.id}</span>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Judul ({editorLang})</label>
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
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Deskripsi ({editorLang})</label>
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

          {/* HOMEPAGE SECTION CONTENT: INFRASTRUCTURE */}
          {homepageTab === "infrastructure" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Infrastruktur & Fitur Utama</h3>
                  <p className="text-xs text-slate-500">Pilar otomatisasi 100%, integrasi tanpa sekat, dan Nova AI Copilot.</p>
                </div>
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => saveCurrentSection("infrastructure")}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#087BEE] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-600"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Simpan Infrastruktur</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Badge Section ({editorLang})</label>
                  <input
                    type="text"
                    value={
                      editorLang === "ID"
                        ? sectionForms["infrastructure"]?.badgeId || ""
                        : sectionForms["infrastructure"]?.badgeEn || ""
                    }
                    onChange={(e) =>
                      handleSectionFieldChange("infrastructure", editorLang === "ID" ? "badgeId" : "badgeEn", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Utama ({editorLang})</label>
                  <input
                    type="text"
                    value={
                      editorLang === "ID"
                        ? sectionForms["infrastructure"]?.titleId || ""
                        : sectionForms["infrastructure"]?.titleEn || ""
                    }
                    onChange={(e) =>
                      handleSectionFieldChange("infrastructure", editorLang === "ID" ? "titleId" : "titleEn", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 mb-3">3 Kartu Fitur</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {sectionForms["infrastructure"]?.extraContent?.cards?.map((card: any, idx: number) => (
                    <div key={card.id || idx} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#087BEE]">
                        Kartu #{idx + 1}: {card.id}
                      </span>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Judul ({editorLang})</label>
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
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Deskripsi ({editorLang})</label>
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

          {/* HOMEPAGE SECTION CONTENT: TESTIMONIALS */}
          {homepageTab === "testimonials" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Daftar Testimonial Pengguna & Dokter</h3>
                  <p className="text-xs text-slate-500">Ulasan dokter spesialis patologi klinik, kepala lab, dan direktur RS.</p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenNewTestimonial}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs shrink-0"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Tambah Testimonial Baru</span>
                </button>
              </div>

              {isTestimonialFormOpen && editingTestimonial && (
                <div className="rounded-2xl border-2 border-blue-200 bg-blue-50/20 p-5 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-blue-100 pb-3">
                    <h4 className="text-xs font-bold text-slate-900">
                      {editingTestimonial.id ? "Edit Testimonial" : "Tambah Testimonial Baru"}
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        setIsTestimonialFormOpen(false);
                        setEditingTestimonial(null);
                        setTestimonialDraftQueue([]);
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveTestimonial} className="space-y-4">
                    <ImageUploader
                      value={editingTestimonial.avatarUrl || ""}
                      onChange={(url: string) => setEditingTestimonial({ ...editingTestimonial, avatarUrl: url })}
                      label="Unggah Foto Profil Dokter / Avatar Mitra"
                      hint="Seret foto dokter (rasio 1:1) atau pilih beberapa foto sekaligus"
                      aspectRatio="square"
                      allowMultiple={true}
                      allowFolder={true}
                      onMultiUpload={handleTestimonialMultiUpload}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap Dokter *</label>
                        <input
                          type="text"
                          required
                          value={editingTestimonial.name || ""}
                          onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Instansi / Rumah Sakit *</label>
                        <input
                          type="text"
                          required
                          value={editingTestimonial.institution || ""}
                          onChange={(e) =>
                            setEditingTestimonial({ ...editingTestimonial, institution: e.target.value })
                          }
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Jabatan (ID)</label>
                        <input
                          type="text"
                          value={editingTestimonial.roleId || ""}
                          onChange={(e) => setEditingTestimonial({ ...editingTestimonial, roleId: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Jabatan (EN)</label>
                        <input
                          type="text"
                          value={editingTestimonial.roleEn || ""}
                          onChange={(e) => setEditingTestimonial({ ...editingTestimonial, roleEn: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white text-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Kutipan Testimoni (ID) *</label>
                      <textarea
                        rows={2}
                        required
                        value={editingTestimonial.quoteId || ""}
                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial, quoteId: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Kutipan Testimoni (EN)</label>
                      <textarea
                        rows={2}
                        value={editingTestimonial.quoteEn || ""}
                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial, quoteEn: e.target.value })}
                        placeholder="Kosong = tampilan bahasa Inggris memakai kutipan ID"
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white text-slate-800"
                      />
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-200/80 pt-3">
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                          <input
                            type="checkbox"
                            checked={editingTestimonial.isActive ?? true}
                            onChange={(e) =>
                              setEditingTestimonial({ ...editingTestimonial, isActive: e.target.checked })
                            }
                            className="rounded text-blue-600"
                          />
                          <span>Aktif</span>
                        </label>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsTestimonialFormOpen(false);
                            setEditingTestimonial(null);
                          }}
                          className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-600"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-[#087BEE] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-600"
                        >
                          <Save className="h-3.5 w-3.5" />
                          <span>Simpan Testimonial</span>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cmsData?.homepage?.testimonials?.items?.map((item: any) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col justify-between hover:border-blue-300 hover:shadow-xs transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.avatarUrl || "/images/testimonial-silhouette-female.jpg"}
                          alt={item.name}
                          className="h-11 w-11 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                          <p className="text-[11px] text-slate-500">
                            {editorLang === "ID" ? item.roleId : item.roleEn} • {item.institution}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 italic line-clamp-3 mb-3 bg-slate-50/60 p-2.5 rounded-xl border border-slate-100">
                        &ldquo;{editorLang === "ID" ? item.quoteId : item.quoteEn}&rdquo;
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                      <span className="text-[11px] font-semibold text-amber-500">
                        {"★".repeat(item.rating || 5)}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingTestimonial(item);
                            setIsTestimonialFormOpen(true);
                          }}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-blue-600"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTestimonial(item.id)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* HOMEPAGE SECTION CONTENT: CTA */}
          {homepageTab === "cta" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Banner Pendaftaran Demo (CTA)</h3>
                  <p className="text-xs text-slate-500">Headline ajakan, subjudul, teks tombol, dan gambar mockup platform.</p>
                </div>
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => saveCurrentSection("cta")}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#087BEE] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-600"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Simpan Banner CTA</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-5">
                  <ImageUploader
                    value={sectionForms["cta"]?.extraContent?.imageUrl || ""}
                    onChange={(url: string) => handleExtraContentChange("cta", "imageUrl", url)}
                    label="Unggah Mockup Gambar Banner CTA"
                    hint="Default: /images/CTA-image.webp"
                    aspectRatio="video"
                  />
                </div>
                <div className="lg:col-span-7 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Headline ({editorLang})</label>
                    <input
                      type="text"
                      value={
                        editorLang === "ID"
                          ? sectionForms["cta"]?.titleId || ""
                          : sectionForms["cta"]?.titleEn || ""
                      }
                      onChange={(e) =>
                        handleSectionFieldChange("cta", editorLang === "ID" ? "titleId" : "titleEn", e.target.value)
                      }
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs bg-white text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Sub-Headline ({editorLang})</label>
                    <textarea
                      rows={3}
                      value={
                        editorLang === "ID"
                          ? sectionForms["cta"]?.subtitleId || ""
                          : sectionForms["cta"]?.subtitleEn || ""
                      }
                      onChange={(e) =>
                        handleSectionFieldChange("cta", editorLang === "ID" ? "subtitleId" : "subtitleEn", e.target.value)
                      }
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs bg-white text-slate-800"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Teks Tombol ({editorLang})</label>
                      <input
                        type="text"
                        value={
                          editorLang === "ID"
                            ? sectionForms["cta"]?.extraContent?.buttonTextId || "Minta Demo"
                            : sectionForms["cta"]?.extraContent?.buttonTextEn || "Request Demo"
                        }
                        onChange={(e) =>
                          handleExtraContentChange("cta", editorLang === "ID" ? "buttonTextId" : "buttonTextEn", e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs bg-white text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">URL Tombol</label>
                      <input
                        type="text"
                        value={sectionForms["cta"]?.extraContent?.buttonUrl || "/request-demo"}
                        onChange={(e) => handleExtraContentChange("cta", "buttonUrl", e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs bg-white text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* 3. TAB: PLATFORM */}
      {/* ==================================================================== */}
      {mainTab === "platform" && (
        <div className="space-y-6">
          <div data-cms-public-notice="platform" className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <span className="font-bold shrink-0">Catatan:</span>
            <span>
              Badge, judul, dan deskripsi tampil di hero /platform. Gambar banner dan daftar submodul belum ditampilkan di website publik. Untuk urutan section, teks header section, dan section kustom gunakan menu Halaman & Section.{" "}
              <a href="/admin/page-sections" className="font-semibold underline">Buka Halaman &amp; Section</a>
            </span>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Konten Halaman Platform</h3>
                <p className="text-xs text-slate-500">Banner overview platform dan rincian modul kapabilitas teknis.</p>
              </div>
              <button
                type="button"
                disabled={isSaving}
                onClick={() => saveCurrentSection("page_platform")}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#087BEE] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-600"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Simpan Halaman Platform</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-5">
                <ImageUploader
                  value={sectionForms["page_platform"]?.extraContent?.bannerUrl || ""}
                  onChange={(url: string) => handleExtraContentChange("page_platform", "bannerUrl", url)}
                  label="Gambar Banner Overview Platform"
                  aspectRatio="video"
                />
              </div>
              <div className="lg:col-span-7 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Badge Section ({editorLang})</label>
                  <input
                    type="text"
                    value={
                      editorLang === "ID"
                        ? sectionForms["page_platform"]?.badgeId || ""
                        : sectionForms["page_platform"]?.badgeEn || ""
                    }
                    onChange={(e) =>
                      handleSectionFieldChange("page_platform", editorLang === "ID" ? "badgeId" : "badgeEn", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs bg-white text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Utama ({editorLang})</label>
                  <input
                    type="text"
                    value={
                      editorLang === "ID"
                        ? sectionForms["page_platform"]?.titleId || ""
                        : sectionForms["page_platform"]?.titleEn || ""
                    }
                    onChange={(e) =>
                      handleSectionFieldChange("page_platform", editorLang === "ID" ? "titleId" : "titleEn", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs bg-white text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi ({editorLang})</label>
                  <textarea
                    rows={3}
                    value={
                      editorLang === "ID"
                        ? sectionForms["page_platform"]?.subtitleId || ""
                        : sectionForms["page_platform"]?.subtitleEn || ""
                    }
                    onChange={(e) =>
                      handleSectionFieldChange("page_platform", editorLang === "ID" ? "subtitleId" : "subtitleEn", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs bg-white text-slate-800"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 mb-3">4 Submodul Platform Utama</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sectionForms["page_platform"]?.extraContent?.submodules?.map((sub: any, idx: number) => (
                  <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-2">
                    <span className="text-[11px] font-bold text-[#087BEE]">{sub.url}</span>
                    <input
                      type="text"
                      value={editorLang === "ID" ? sub.titleId : sub.titleEn}
                      onChange={(e) => {
                        const newSubs = [...sectionForms["page_platform"].extraContent.submodules];
                        newSubs[idx] = {
                          ...newSubs[idx],
                          [editorLang === "ID" ? "titleId" : "titleEn"]: e.target.value,
                        };
                        handleExtraContentChange("page_platform", "submodules", newSubs);
                      }}
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs bg-white text-slate-800 font-bold"
                    />
                    <textarea
                      rows={2}
                      value={editorLang === "ID" ? sub.descId : sub.descEn}
                      onChange={(e) => {
                        const newSubs = [...sectionForms["page_platform"].extraContent.submodules];
                        newSubs[idx] = {
                          ...newSubs[idx],
                          [editorLang === "ID" ? "descId" : "descEn"]: e.target.value,
                        };
                        handleExtraContentChange("page_platform", "submodules", newSubs);
                      }}
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs bg-white text-slate-800"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 4. TAB: SOLUSI (SOLUTIONS) */}
      {/* ==================================================================== */}
      {mainTab === "solutions" && (
        <div className="space-y-6">
          <div data-cms-public-notice="solutions" className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <span className="font-bold shrink-0">Catatan:</span>
            <span>
              Daftar item di tab ini belum ditampilkan di website publik (halaman detail /[slug] dialihkan ke anchor halaman induk). Untuk hero, urutan section, teks header section, dan section kustom gunakan menu Halaman & Section.{" "}
              <a href="/admin/page-sections" className="font-semibold underline">Buka Halaman &amp; Section</a>
            </span>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Daftar Solusi Fasilitas Kesehatan</h3>
                <p className="text-xs text-slate-500">
                  Solusi terdedikasi untuk laboratorium RS, lab komersial, patologi, mikrobiologi, dan bank darah.
                </p>
              </div>
              <button
                type="button"
                onClick={handleOpenNewSolution}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs shrink-0"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Tambah Solusi Baru</span>
              </button>
            </div>

            {isSolutionFormOpen && editingSolution && (
              <div className="rounded-2xl border-2 border-blue-200 bg-blue-50/20 p-5 space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-blue-100 pb-3">
                  <h4 className="text-xs font-bold text-slate-900">
                    {editingSolution.slug ? `Edit Solusi: ${editingSolution.name}` : "Tambah Solusi Baru"}
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSolutionFormOpen(false);
                      setEditingSolution(null);
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <form onSubmit={handleSaveSolution} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Slug URL *</label>
                      <input
                        type="text"
                        required
                        value={editingSolution.slug || ""}
                        onChange={(e) => setEditingSolution({ ...editingSolution, slug: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white text-slate-800 font-mono"
                        placeholder="contoh: hospital-laboratory"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Solusi *</label>
                      <input
                        type="text"
                        required
                        value={editingSolution.name || ""}
                        onChange={(e) => setEditingSolution({ ...editingSolution, name: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white text-slate-800"
                        placeholder="Laboratorium Rumah Sakit"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori / Tag</label>
                      <input
                        type="text"
                        value={editingSolution.category || ""}
                        onChange={(e) => setEditingSolution({ ...editingSolution, category: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Tagline</label>
                    <input
                      type="text"
                      value={editingSolution.tagline || ""}
                      onChange={(e) => setEditingSolution({ ...editingSolution, tagline: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Lengkap</label>
                    <textarea
                      rows={3}
                      value={editingSolution.description || ""}
                      onChange={(e) => setEditingSolution({ ...editingSolution, description: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white text-slate-800"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200/80">
                    <button
                      type="button"
                      onClick={() => {
                        setIsSolutionFormOpen(false);
                        setEditingSolution(null);
                      }}
                      className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-600"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#087BEE] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-600"
                    >
                      <Save className="h-3.5 w-3.5" />
                      <span>Simpan Solusi</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {cmsData?.solutions?.items?.map((item: any) => (
                <div
                  key={item.slug}
                  className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col justify-between hover:border-blue-300 hover:shadow-xs transition-all"
                >
                  <div>
                    <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-[#087BEE] border border-blue-200/60">
                      {item.category || "Solusi"}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 mt-2">{item.name}</h4>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">/solutions/{item.slug}</p>
                    <p className="text-xs text-slate-600 line-clamp-3 mt-2">{item.description}</p>
                  </div>

                  <div className="flex items-center justify-end gap-1.5 border-t border-slate-100 pt-3 mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingSolution(item);
                        setIsSolutionFormOpen(true);
                      }}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-blue-600"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSolution(item.slug)}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 5. TAB: MODUL (MODULES) */}
      {/* ==================================================================== */}
      {mainTab === "modules" && (
        <div className="space-y-6">
          <div data-cms-public-notice="modules" className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <span className="font-bold shrink-0">Catatan:</span>
            <span>
              Daftar item di tab ini belum ditampilkan di website publik (halaman detail /[slug] dialihkan ke anchor halaman induk). Untuk hero, urutan section, teks header section, dan section kustom gunakan menu Halaman & Section.{" "}
              <a href="/admin/page-sections" className="font-semibold underline">Buka Halaman &amp; Section</a>
            </span>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Daftar Modul Diagnova</h3>
                <p className="text-xs text-slate-500">Hematologi, Bank Darah, Inventaris Reagen, Patologi, dan Mikrobiologi.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {cmsData?.modules?.items?.map((item: any) => (
                <div
                  key={item.slug}
                  className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col justify-between hover:border-blue-300 hover:shadow-xs transition-all"
                >
                  <div>
                    <span className="rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700 border border-purple-200/60">
                      Modul Klinis
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 mt-2">{item.name}</h4>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">/modules/{item.slug}</p>
                    <p className="text-xs text-slate-600 line-clamp-3 mt-2">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 6. TAB: NOVA AI */}
      {/* ==================================================================== */}
      {mainTab === "nova_ai" && (
        <div className="space-y-6">
          <div data-cms-public-notice="nova_ai" className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <span className="font-bold shrink-0">Catatan:</span>
            <span>
              Badge, judul, dan deskripsi tampil di hero /nova-ai. Gambar banner belum ditampilkan di website publik. Untuk urutan section, teks header section, dan section kustom gunakan menu Halaman & Section.{" "}
              <a href="/admin/page-sections" className="font-semibold underline">Buka Halaman &amp; Section</a>
            </span>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Konten Nova AI Copilot</h3>
                <p className="text-xs text-slate-500">AI assists. Doctors decide. Narasi klinis dan etika kolaborasi medis.</p>
              </div>
              <button
                type="button"
                disabled={isSaving}
                onClick={() => saveCurrentSection("page_nova_ai")}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#087BEE] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-600"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Simpan Konten Nova AI</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-5">
                <ImageUploader
                  value={sectionForms["page_nova_ai"]?.extraContent?.bannerUrl || ""}
                  onChange={(url: string) => handleExtraContentChange("page_nova_ai", "bannerUrl", url)}
                  label="Gambar Banner Nova AI"
                  aspectRatio="video"
                />
              </div>
              <div className="lg:col-span-7 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Badge Section ({editorLang})</label>
                  <input
                    type="text"
                    value={
                      editorLang === "ID"
                        ? sectionForms["page_nova_ai"]?.badgeId || ""
                        : sectionForms["page_nova_ai"]?.badgeEn || ""
                    }
                    onChange={(e) =>
                      handleSectionFieldChange("page_nova_ai", editorLang === "ID" ? "badgeId" : "badgeEn", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs bg-white text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Utama ({editorLang})</label>
                  <input
                    type="text"
                    value={
                      editorLang === "ID"
                        ? sectionForms["page_nova_ai"]?.titleId || ""
                        : sectionForms["page_nova_ai"]?.titleEn || ""
                    }
                    onChange={(e) =>
                      handleSectionFieldChange("page_nova_ai", editorLang === "ID" ? "titleId" : "titleEn", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs bg-white text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Sub-Headline ({editorLang})</label>
                  <textarea
                    rows={3}
                    value={
                      editorLang === "ID"
                        ? sectionForms["page_nova_ai"]?.subtitleId || ""
                        : sectionForms["page_nova_ai"]?.subtitleEn || ""
                    }
                    onChange={(e) =>
                      handleSectionFieldChange("page_nova_ai", editorLang === "ID" ? "subtitleId" : "subtitleEn", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs bg-white text-slate-800"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 7. TAB: INTEGRASI */}
      {/* ==================================================================== */}
      {mainTab === "integrations" && (
        <div className="space-y-6">
          <div data-cms-public-notice="integrations" className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <span className="font-bold shrink-0">Catatan:</span>
            <span>
              Daftar item di tab ini belum ditampilkan di website publik (halaman detail /[slug] dialihkan ke anchor halaman induk). Untuk hero, urutan section, teks header section, dan section kustom gunakan menu Halaman & Section.{" "}
              <a href="/admin/page-sections" className="font-semibold underline">Buka Halaman &amp; Section</a>
            </span>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Daftar Sistem & Protokol Integrasi</h3>
                <p className="text-xs text-slate-500">SIMRS, Analyzer LIS, SATUSEHAT Kemenkes RI, PACS/RIS, dan EMR Bridge.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {cmsData?.integrations?.items?.map((item: any) => (
                <div
                  key={item.slug}
                  className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col justify-between hover:border-blue-300 hover:shadow-xs transition-all"
                >
                  <div>
                    <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200/60">
                      {item.protocol || "Protokol"}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 mt-2">{item.name}</h4>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">/integration/{item.slug}</p>
                    <p className="text-xs text-slate-600 line-clamp-3 mt-2">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

