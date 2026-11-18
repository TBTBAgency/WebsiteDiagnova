"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  ClipboardList,
  Search,
  Plus,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Stethoscope,
  Barcode,
  X,
  Copy,
  Check,
  Building2,
  Calendar,
  Sparkles,
  AlertCircle,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { OrderPriority, OrderStatus, SpecimenStatus, TubeColor, SpecimenType } from "@/types";
import { MetricCard } from "@/components/admin/MetricCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useAdminLang } from "@/components/admin/AdminLanguage";

interface PatientOption {
  id: string;
  mrn: string;
  nationalId?: string | null;
  name: string;
  birthDate: string;
  sex: string;
  phone?: string | null;
}

interface PhysicianOption {
  id: string;
  externalCode: string;
  name: string;
  specialization: string;
  department: string;
}

interface TestCatalogOption {
  id: string;
  code: string;
  name: string;
  category: string;
  specimenType: SpecimenType;
  tubeColor: TubeColor;
  tatMinutes: number;
}

interface SpecimenData {
  id: string;
  barcode: string;
  specimenType: SpecimenType;
  tubeColor: TubeColor;
  status: SpecimenStatus;
  volumeMl?: number | null;
  storageLocation?: string | null;
  rejectionReason?: string | null;
  collectedAt?: string | null;
  receivedAt?: string | null;
}

interface OrderItemData {
  id: string;
  testCatalog: {
    code: string;
    name: string;
    category: string;
    unit?: string | null;
  };
}

interface OrderData {
  id: string;
  orderNumber: string;
  sourceLocation: string;
  priority: OrderPriority;
  status: OrderStatus;
  clinicalNotes?: string | null;
  orderedAt: string;
  patient: {
    id: string;
    mrn: string;
    name: string;
    birthDate: string;
    sex: string;
    phone?: string | null;
  };
  physician?: {
    id: string;
    name: string;
    specialization: string;
    department: string;
  } | null;
  specimens: SpecimenData[];
  items: OrderItemData[];
}

// Tube visual styling map
// Tube visual styling map
const tubeStyles: Record<TubeColor, { name: string; nameEn: string; bg: string; text: string; border: string; cap: string }> = {
  lavender_edta: {
    name: "EDTA Ungu",
    nameEn: "Lavender EDTA",
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    cap: "bg-purple-600",
  },
  red_plain: {
    name: "Merah Plain",
    nameEn: "Red Plain",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    cap: "bg-red-600",
  },
  yellow_sst: {
    name: "Kuning / SST",
    nameEn: "Yellow / SST",
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
    cap: "bg-amber-500",
  },
  light_blue_citrate: {
    name: "Biru Sitrat",
    nameEn: "Light Blue Citrate",
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
    cap: "bg-sky-500",
  },
  green_heparin: {
    name: "Hijau Heparin",
    nameEn: "Green Heparin",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    cap: "bg-emerald-600",
  },
  gray_fluoride: {
    name: "Abu-abu Fluoride",
    nameEn: "Gray Fluoride",
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-300",
    cap: "bg-slate-500",
  },
  urine_container: {
    name: "Wadah Urin",
    nameEn: "Urine Container",
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-200",
    cap: "bg-yellow-500",
  },
  other: {
    name: "Wadah Lainnya",
    nameEn: "Other Container",
    bg: "bg-stone-100",
    text: "text-stone-700",
    border: "border-stone-300",
    cap: "bg-stone-600",
  },
};

const statusConfig: Record<
  OrderStatus,
  { label: string; labelEn: string; bg: string; text: string; border: string; icon: React.ElementType }
> = {
  ordered: {
    label: "Menunggu Sampel",
    labelEn: "Awaiting Specimen",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    icon: Clock,
  },
  specimen_received: {
    label: "Diterima di Lab",
    labelEn: "Received in Lab",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    icon: Sparkles,
  },
  processing: {
    label: "Sedang Diuji",
    labelEn: "In Testing",
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200",
    icon: Sparkles,
  },
  partially_validated: {
    label: "Validasi Parsial",
    labelEn: "Partially Validated",
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    icon: Sparkles,
  },
  completed: {
    label: "Selesai",
    labelEn: "Completed",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Dibatalkan",
    labelEn: "Cancelled",
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    icon: XCircle,
  },
};

export default function LabOrdersPage() {
  const { t, locale } = useAdminLang();
  // Ref agar fetchOrders tidak dibuat ulang (dan memicu fetch ulang) saat bahasa diganti
  const tRef = useRef(t);
  useEffect(() => {
    tRef.current = t;
  }, [t]);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  // Selection & Details
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectBarcode, setRejectBarcode] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [storageLocationInput, setStorageLocationInput] = useState("Rak A-01");
  const [isReceiveOpen, setIsReceiveOpen] = useState(false);
  const [receiveBarcode, setReceiveBarcode] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [copiedBarcode, setCopiedBarcode] = useState<string | null>(null);

  // Form creation options
  const [patients, setPatients] = useState<PatientOption[]>([]);
  const [physicians, setPhysicians] = useState<PhysicianOption[]>([]);
  const [testCatalogs, setTestCatalogs] = useState<TestCatalogOption[]>([]);

  // Create Form State
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [selectedPhysicianId, setSelectedPhysicianId] = useState("");
  const [sourceLocation, setSourceLocation] = useState("Poliklinik");
  const [priority, setPriority] = useState<OrderPriority>("routine");
  const [clinicalNotes, setClinicalNotes] = useState("");
  const [selectedTestCodes, setSelectedTestCodes] = useState<string[]>([]);
  const [isNewPatient, setIsNewPatient] = useState(false);

  // New Patient Form
  const [newPatient, setNewPatient] = useState({
    mrn: "",
    nationalId: "",
    name: "",
    birthDate: "",
    sex: "male",
    phone: "",
    address: "",
  });

  // Fetch Orders
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (priorityFilter !== "all") params.append("priority", priorityFilter);
      if (searchQuery.trim()) params.append("search", searchQuery.trim());

      const res = await fetch(`/api/lis/orders?${params.toString()}`);
      const data = await res.json();
      if (data.success && data.data) {
        setOrders(data.data.orders || []);
      } else {
        setError(data.message || tRef.current("Gagal memuat order lab.", "Failed to load lab orders."));
      }
    } catch (err: any) {
      setError(err.message || tRef.current("Terjadi kesalahan jaringan.", "A network error occurred."));
    } finally {
      setLoading(false);
    }
  }, [statusFilter, priorityFilter, searchQuery]);

  // Initial Data Fetch
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Load Catalogs, Physicians, Patients on open create modal
  const openCreateModal = async () => {
    setIsCreateOpen(true);
    try {
      const [catRes, docRes, patRes] = await Promise.all([
        fetch("/api/lis/catalog").then((r) => r.json()),
        fetch("/api/lis/physicians").then((r) => r.json()),
        fetch("/api/lis/patients?limit=100").then((r) => r.json()),
      ]);

      if (catRes.success) setTestCatalogs(catRes.data || []);
      if (docRes.success) {
        setPhysicians(docRes.data || []);
        if (docRes.data?.length > 0 && !selectedPhysicianId) {
          setSelectedPhysicianId(docRes.data[0].id);
        }
      }
      if (patRes.success) {
        const pList = patRes.data.patients || patRes.data || [];
        setPatients(pList);
        if (pList.length > 0 && !selectedPatientId) {
          setSelectedPatientId(pList[0].id);
        }
      }
    } catch (err) {
      console.error("Gagal memuat opsi form:", err);
    }
  };

  // Live Specimen Preview Calculation
  const liveSpecimenRequirements = useMemo(() => {
    if (selectedTestCodes.length === 0) return [];
    const selected = testCatalogs.filter((t) => selectedTestCodes.includes(t.code));
    const grouped = new Map<string, { tubeColor: TubeColor; specimenType: SpecimenType; tests: string[] }>();

    for (const test of selected) {
      const key = `${test.tubeColor}_${test.specimenType}`;
      if (!grouped.has(key)) {
        grouped.set(key, {
          tubeColor: test.tubeColor,
          specimenType: test.specimenType,
          tests: [test.name],
        });
      } else {
        grouped.get(key)!.tests.push(test.name);
      }
    }

    return Array.from(grouped.values());
  }, [selectedTestCodes, testCatalogs]);

  // Handle Create Lab Order Submit
  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      let finalPatientId = selectedPatientId;

      // Jika mendaftarkan pasien baru terlebih dahulu
      if (isNewPatient) {
        if (!newPatient.name || !newPatient.mrn || !newPatient.birthDate) {
          alert(t("Nama, No. RM, dan Tanggal Lahir pasien wajib diisi.", "Patient name, MRN, and date of birth are required."));
          setActionLoading(false);
          return;
        }

        const createPatRes = await fetch("/api/lis/patients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newPatient),
        });
        const patData = await createPatRes.json();
        if (!patData.success) {
          alert(patData.message || t("Gagal mendaftarkan pasien baru.", "Failed to register the new patient."));
          setActionLoading(false);
          return;
        }
        finalPatientId = patData.data.id;
      }

      if (!finalPatientId) {
        alert(t("Pilih pasien terlebih dahulu.", "Please select a patient first."));
        setActionLoading(false);
        return;
      }

      if (selectedTestCodes.length === 0) {
        alert(t("Pilih minimal satu pemeriksaan laboratorium.", "Select at least one lab test."));
        setActionLoading(false);
        return;
      }

      const orderPayload = {
        patientId: finalPatientId,
        physicianId: selectedPhysicianId || null,
        sourceLocation,
        priority,
        clinicalNotes: clinicalNotes.trim() || null,
        testCatalogCodes: selectedTestCodes,
      };

      const res = await fetch("/api/lis/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const resData = await res.json();
      if (resData.success) {
        setIsCreateOpen(false);
        // Reset Form
        setSelectedTestCodes([]);
        setClinicalNotes("");
        setIsNewPatient(false);
        await fetchOrders();
        // Buka detail order yang baru dibuat
        setSelectedOrder(resData.data);
        setIsDetailOpen(true);
      } else {
        alert(resData.message || t("Gagal membuat order lab.", "Failed to create the lab order."));
      }
    } catch (err: any) {
      alert(err.message || t("Terjadi kesalahan saat memproses order.", "An error occurred while processing the order."));
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Receive Specimen
  const handleReceiveSpecimen = async () => {
    if (!receiveBarcode) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/lis/specimens/${receiveBarcode}/receive`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storageLocation: storageLocationInput,
          notes: "Diterima dalam kondisi baik di meja analis.",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsReceiveOpen(false);
        setReceiveBarcode(null);
        await fetchOrders();
        // Update selected order in state if opened
        if (selectedOrder) {
          const detailRes = await fetch(`/api/lis/orders/${selectedOrder.id}`).then((r) => r.json());
          if (detailRes.success) setSelectedOrder(detailRes.data);
        }
      } else {
        alert(data.message || t("Gagal menerima spesimen.", "Failed to receive the specimen."));
      }
    } catch (err: any) {
      alert(err.message || t("Gagal menerima spesimen.", "Failed to receive the specimen."));
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Reject Specimen
  const handleRejectSpecimen = async () => {
    if (!rejectBarcode) return;
    if (!rejectReason.trim()) {
      alert(t("Alasan penolakan spesimen wajib diisi (ISO 15189).", "A specimen rejection reason is required (ISO 15189)."));
      return;
    }
    setActionLoading(true);
    try {
      const res = await fetch(`/api/lis/specimens/${rejectBarcode}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: rejectReason.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsRejectOpen(false);
        setRejectBarcode(null);
        setRejectReason("");
        await fetchOrders();
        if (selectedOrder) {
          const detailRes = await fetch(`/api/lis/orders/${selectedOrder.id}`).then((r) => r.json());
          if (detailRes.success) setSelectedOrder(detailRes.data);
        }
      } else {
        alert(data.message || t("Gagal menolak spesimen.", "Failed to reject the specimen."));
      }
    } catch (err: any) {
      alert(err.message || t("Gagal menolak spesimen.", "Failed to reject the specimen."));
    } finally {
      setActionLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBarcode(text);
    setTimeout(() => setCopiedBarcode(null), 2000);
  };

  // Metrics counter
  const metrics = useMemo(() => {
    const total = orders.length;
    let waiting = 0;
    let received = 0;
    let rejected = 0;
    let cito = 0;

    for (const o of orders) {
      if (o.priority === "cito") cito++;
      if (o.status === "ordered") waiting++;
      else if (o.status === "specimen_received" || o.status === "processing" || o.status === "completed") received++;

      for (const sp of o.specimens) {
        if (sp.status === "rejected") rejected++;
      }
    }

    return { total, waiting, received, rejected, cito };
  }, [orders]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 font-display tracking-tight">
              {t("Lab Orders (Pre-Analitik)", "Lab Orders (Pre-Analytical)")}
            </h1>
            <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200">
              {t("LIS Fase 2", "LIS Phase 2")}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {t(
              "Manajemen pendaftaran pemeriksaan, barcode tracking tabung spesimen, dan penerimaan sampel meja laboratorium.",
              "Test registration management, specimen tube barcode tracking, and specimen reception at the lab bench."
            )}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-colors shadow-xs"
            title={t("Muat ulang data", "Reload data")}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-blue-600" : ""}`} />
          </button>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-500/20 transition-all hover:shadow-md"
          >
            <Plus className="h-4 w-4" />
            <span>{t("Registrasi Order Lab", "Register Lab Order")}</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <MetricCard
          title={t("Total Order", "Total Orders")}
          value={metrics.total}
          subtitle={t("Tercatat di sistem", "Recorded in system")}
          icon={ClipboardList}
          iconBg="bg-blue-50"
          iconColor="text-[#087BEE]"
        />
        <MetricCard
          title={t("Menunggu Sampel", "Awaiting Specimen")}
          value={metrics.waiting}
          subtitle={t("Tahap Phlebotomy", "Phlebotomy stage")}
          icon={Clock}
          iconBg="bg-amber-50"
          iconColor="text-[#E5A23B]"
          badge={{ text: "Pending", variant: "warning" }}
        />
        <MetricCard
          title={t("Diterima di Lab", "Received in Lab")}
          value={metrics.received}
          subtitle={t("Siap analitik / mesin", "Ready for analysis / analyzer")}
          icon={CheckCircle2}
          iconBg="bg-emerald-50"
          iconColor="text-[#16A374]"
          badge={{ text: t("Di Lab", "In Lab"), variant: "success" }}
        />
        <MetricCard
          title={t("Sampel Ditolak", "Rejected Specimens")}
          value={metrics.rejected}
          subtitle={t("Perlu re-sampling", "Re-collection needed")}
          icon={XCircle}
          iconBg="bg-rose-50"
          iconColor="text-[#DC5A5A]"
          badge={{ text: t("Ditolak", "Rejected"), variant: "danger" }}
        />
        <MetricCard
          title={t("Prioritas CITO", "STAT Priority")}
          value={metrics.cito}
          subtitle={t("Pasien Gawat Darurat", "Emergency patients")}
          icon={AlertTriangle}
          iconBg="bg-rose-50"
          iconColor="text-[#DC5A5A]"
          badge={{ text: t("CITO", "STAT"), variant: "danger" }}
          className="col-span-2 lg:col-span-1"
        />
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("Cari Nomor Order, Nama Pasien, No. RM, atau Barcode...", "Search order number, patient name, MRN, or barcode...")}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1 rounded-lg transition-all ${
                statusFilter === "all" ? "bg-white text-slate-900 shadow-xs font-semibold" : "hover:text-slate-900"
              }`}
            >
              {t("Semua", "All")}
            </button>
            <button
              onClick={() => setStatusFilter("ordered")}
              className={`px-3 py-1 rounded-lg transition-all ${
                statusFilter === "ordered" ? "bg-white text-amber-700 shadow-xs font-semibold" : "hover:text-slate-900"
              }`}
            >
              {t("Menunggu", "Awaiting")}
            </button>
            <button
              onClick={() => setStatusFilter("in_progress")}
              className={`px-3 py-1 rounded-lg transition-all ${
                statusFilter === "in_progress" ? "bg-white text-blue-700 shadow-xs font-semibold" : "hover:text-slate-900"
              }`}
            >
              {t("Diterima Lab", "Received in Lab")}
            </button>
            <button
              onClick={() => setStatusFilter("completed")}
              className={`px-3 py-1 rounded-lg transition-all ${
                statusFilter === "completed" ? "bg-white text-emerald-700 shadow-xs font-semibold" : "hover:text-slate-900"
              }`}
            >
              {t("Selesai", "Completed")}
            </button>
          </div>

          <button
            onClick={() => setPriorityFilter(priorityFilter === "cito" ? "all" : "cito")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 shrink-0 ${
              priorityFilter === "cito"
                ? "bg-rose-50 text-rose-700 border-rose-300"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
            <span>{t("CITO Saja", "STAT Only")}</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
            <p className="text-xs text-slate-500">{t("Memuat daftar order laboratorium...", "Loading lab orders...")}</p>
          </div>
        ) : error ? (
          <div className="py-16 text-center text-rose-600">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm font-semibold">{error}</p>
            <button
              onClick={fetchOrders}
              className="mt-3 px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-lg text-xs font-medium hover:bg-rose-100"
            >
              {t("Coba Lagi", "Try Again")}
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center text-slate-500">
            <ClipboardList className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-800">{t("Belum Ada Order Laboratorium", "No Lab Orders Yet")}</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {t(
                "Tidak ditemukan data order lab sesuai filter. Silakan klik tombol \"Registrasi Order Lab\" untuk membuat order baru.",
                "No lab orders match the current filters. Click \"Register Lab Order\" to create a new order."
              )}
            </p>
            <button
              onClick={openCreateModal}
              className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
            >
              {t("+ Buat Order Baru", "+ Create New Order")}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">{t("No. Order & Prioritas", "Order No. & Priority")}</th>
                  <th className="py-3 px-4">{t("Pasien & No. RM", "Patient & MRN")}</th>
                  <th className="py-3 px-4">{t("Dokter & Unit", "Physician & Unit")}</th>
                  <th className="py-3 px-4">{t("Tabung & Barcode", "Tubes & Barcodes")}</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">{t("Aksi", "Actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => {
                  const statusInfo = statusConfig[order.status] || statusConfig.ordered;
                  const StatusIcon = statusInfo.icon;
                  const isCito = order.priority === "cito";

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-blue-50/30 transition-colors group cursor-pointer"
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsDetailOpen(true);
                      }}
                    >
                      {/* No Order & Priority */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {order.orderNumber}
                          </span>
                          {isCito && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-bold border border-rose-200 animate-pulse">
                              <AlertTriangle className="h-3 w-3" />
                              <span>{t("CITO", "STAT")}</span>
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(order.orderedAt).toLocaleString(locale)}</span>
                        </div>
                      </td>

                      {/* Pasien & MRN */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{order.patient.name}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span className="font-mono bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200 text-slate-700">
                            {order.patient.mrn}
                          </span>
                          <span>•</span>
                          <span className="capitalize">{order.patient.sex}</span>
                        </div>
                      </td>

                      {/* Dokter & Unit */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">
                          {order.physician?.name || t("Dokter Umum", "General Practitioner")}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                          <Building2 className="h-3 w-3 text-slate-400" />
                          <span>{order.sourceLocation}</span>
                        </div>
                      </td>

                      {/* Tabung Spesimen Mini Badges */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1.5 items-center">
                          {order.specimens.map((sp) => {
                            const tStyle = tubeStyles[sp.tubeColor] || tubeStyles.lavender_edta;
                            const isReceived = sp.status === "received_in_lab";
                            const isRejected = sp.status === "rejected";

                            return (
                              <span
                                key={sp.id}
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                                  isRejected
                                    ? "bg-rose-50 text-rose-700 border-rose-300"
                                    : isReceived
                                    ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                    : `${tStyle.bg} ${tStyle.text} ${tStyle.border}`
                                }`}
                                title={`Barcode: ${sp.barcode || (sp as any).barcodeNumber || "-"} | Status: ${sp.status}`}
                              >
                                <span className={`h-2 w-2 rounded-full ${tStyle.cap}`} />
                                <span>{(sp.barcode || (sp as any).barcodeNumber || "").split("-").slice(-1)[0] || "-"}</span>
                                {isReceived && <Check className="h-3 w-3 text-emerald-600" />}
                                {isRejected && <X className="h-3 w-3 text-rose-600" />}
                              </span>
                            );
                          })}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">
                          {order.items.length}{" "}
                          {t("item tes diminta", order.items.length === 1 ? "test requested" : "tests requested")}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          <span>{t(statusInfo.label, statusInfo.labelEn)}</span>
                        </span>
                      </td>

                      {/* Aksi */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(order);
                            setIsDetailOpen(true);
                          }}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-[11px] inline-flex items-center gap-1 shadow-2xs group-hover:border-blue-300 group-hover:text-blue-600 transition-colors"
                        >
                          <span>{t("Kelola Tabung", "Manage Tubes")}</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL 1: Detail Order & Barcode Scanner/Tracker */}
      {isDetailOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
                  <Barcode className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 font-display text-base">
                      {selectedOrder.orderNumber}
                    </h3>
                    {selectedOrder.priority === "cito" && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold border border-rose-300">
                        {t("CITO EMERGENCY", "STAT EMERGENCY")}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    {t("Registrasi:", "Registered:")} {new Date(selectedOrder.orderedAt).toLocaleString(locale)} •{" "}
                    {t("Asal:", "Source:")} {selectedOrder.sourceLocation}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-200/80 text-slate-500 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Patient & Physician Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-2">
                    <User className="h-4 w-4 text-blue-600" />
                    <span>{t("Identitas Pasien", "Patient Identity")}</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900">{selectedOrder.patient.name}</div>
                  <div className="text-xs text-slate-500 mt-1 space-y-0.5">
                    <div>{t("No. RM:", "MRN:")} <span className="font-mono font-semibold text-slate-800">{selectedOrder.patient.mrn}</span></div>
                    <div>{t("Jenis Kelamin:", "Sex:")} <span className="capitalize">{selectedOrder.patient.sex}</span></div>
                    {selectedOrder.patient.phone && <div>{t("No. Kontak:", "Contact No.:")} {selectedOrder.patient.phone}</div>}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-2">
                    <Stethoscope className="h-4 w-4 text-blue-600" />
                    <span>{t("Dokter & Catatan Medis", "Physician & Medical Notes")}</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    {selectedOrder.physician?.name || t("Dokter Umum", "General Practitioner")}
                  </div>
                  <div className="text-xs text-slate-500 mt-1 space-y-0.5">
                    <div>{t("Spesialisasi:", "Specialization:")} {selectedOrder.physician?.specialization || "-"}</div>
                    <div>{t("Catatan Klinis:", "Clinical Notes:")} <span className="italic text-slate-700">{selectedOrder.clinicalNotes || t("Tidak ada catatan klinis.", "No clinical notes.")}</span></div>
                  </div>
                </div>
              </div>

              {/* Items Pemeriksaan */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                  {t("Daftar Pemeriksaan yang Diminta", "Requested Tests")} ({selectedOrder.items.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-slate-800">{item.testCatalog.name}</span>
                      <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        {item.testCatalog.code}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tabung Spesimen & Barcode Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {t("Spesimen Tabung Darah & Barcode", "Blood Tube Specimens & Barcodes")} ({selectedOrder.specimens.length})
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    {t("Standar ISO 15189 Pre-Analitik", "ISO 15189 Pre-Analytical Standard")}
                  </span>
                </div>

                <div className="space-y-3">
                  {selectedOrder.specimens.map((sp) => {
                    const tStyle = tubeStyles[sp.tubeColor] || tubeStyles.lavender_edta;
                    const isReceived = sp.status === "received_in_lab";
                    const isRejected = sp.status === "rejected";

                    return (
                      <div
                        key={sp.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          isRejected
                            ? "bg-rose-50/40 border-rose-300"
                            : isReceived
                            ? "bg-emerald-50/40 border-emerald-300"
                            : "bg-white border-slate-200"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          {/* Tube Visual & Barcode Info */}
                          <div className="flex items-start gap-3">
                            <div className="relative pt-1">
                              {/* Simulated Test Tube Visual */}
                              <div className="w-6 h-12 rounded-b-full border-2 border-slate-400/80 bg-white/80 p-0.5 flex flex-col justify-end overflow-hidden shadow-xs">
                                <div className={`w-full h-3 rounded-xs ${tStyle.cap}`} />
                                <div className="w-full h-6 bg-red-800/40 rounded-b-full mt-auto" />
                              </div>
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${tStyle.bg} ${tStyle.text} ${tStyle.border}`}>
                                  {t(tStyle.name, tStyle.nameEn)}
                                </span>
                                <span className="text-xs text-slate-500 capitalize">
                                  {sp.specimenType.replace("_", " ")}
                                </span>
                              </div>

                              {/* Barcode Display */}
                              <div className="mt-1.5 flex items-center gap-2">
                                <span className="font-mono text-sm font-bold text-slate-900 tracking-wider">
                                  {sp.barcode}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(sp.barcode)}
                                  className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                                  title={t("Salin Barcode", "Copy Barcode")}
                                >
                                  {copiedBarcode === sp.barcode ? (
                                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                                  ) : (
                                    <Copy className="h-3.5 w-3.5" />
                                  )}
                                </button>
                              </div>

                              {sp.storageLocation && (
                                <div className="text-[11px] text-slate-500 mt-0.5">
                                  {t("Lokasi Rak:", "Rack Location:")} <span className="font-semibold text-slate-700">{sp.storageLocation}</span>
                                </div>
                              )}

                              {isRejected && (
                                <div className="text-[11px] text-rose-700 font-semibold mt-1 flex items-center gap-1">
                                  <ShieldAlert className="h-3.5 w-3.5" />
                                  <span>{t("Ditolak:", "Rejected:")} {sp.rejectionReason}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons for this specimen */}
                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                            {sp.status === "collected" && (
                              <>
                                <button
                                  onClick={() => {
                                    setReceiveBarcode(sp.barcode);
                                    setIsReceiveOpen(true);
                                  }}
                                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1"
                                >
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  <span>{t("Terima di Lab", "Receive in Lab")}</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setRejectBarcode(sp.barcode);
                                    setIsRejectOpen(true);
                                  }}
                                  className="px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs transition-colors flex items-center gap-1"
                                >
                                  <XCircle className="h-3.5 w-3.5" />
                                  <span>{t("Tolak Sampel", "Reject Specimen")}</span>
                                </button>
                              </>
                            )}

                            {isReceived && (
                              <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 border border-emerald-200">
                                <Check className="h-3.5 w-3.5" />
                                <span>{t("Diterima di Meja Lab", "Received at Lab Bench")}</span>
                              </span>
                            )}

                            {isRejected && (
                              <span className="px-3 py-1 rounded-xl bg-rose-100 text-rose-800 text-xs font-semibold flex items-center gap-1.5 border border-rose-200">
                                <X className="h-3.5 w-3.5" />
                                <span>{t("Sampel Ditolak", "Specimen Rejected")}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Diagnova Laboratory Intelligence Engine • ISO 15189
              </span>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-900 transition-colors"
              >
                {t("Tutup", "Close")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Registrasi Order Baru */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <Plus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 font-display text-base">
                    {t("Registrasi Lab Order Baru", "Register New Lab Order")}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {t("Otomatis kalkulasi tabung spesimen & pembuatan barcode", "Automatic specimen tube calculation & barcode generation")}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateOrder} className="p-6 overflow-y-auto space-y-5">
              {/* Prioritas Toggle */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {t("Tingkat Prioritas", "Priority Level")}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPriority("routine")}
                    className={`py-2.5 px-4 rounded-xl text-xs font-semibold border text-center transition-all ${
                      priority === "routine"
                        ? "bg-blue-50 border-blue-600 text-blue-700 shadow-xs"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {t("Rutin (Standard TAT)", "Routine (Standard TAT)")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPriority("cito")}
                    className={`py-2.5 px-4 rounded-xl text-xs font-semibold border text-center transition-all flex items-center justify-center gap-1.5 ${
                      priority === "cito"
                        ? "bg-rose-50 border-rose-600 text-rose-700 shadow-xs font-bold"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <AlertTriangle className="h-4 w-4 text-rose-600" />
                    <span>{t("CITO (Gawat Darurat / Segera)", "STAT (Emergency / Immediate)")}</span>
                  </button>
                </div>
              </div>

              {/* Pasien Selection */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {t("Data Pasien", "Patient Data")}
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsNewPatient(!isNewPatient)}
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    {isNewPatient
                      ? t("← Pilih dari Pasien Terdaftar", "← Select from Registered Patients")
                      : t("+ Daftarkan Pasien Baru", "+ Register New Patient")}
                  </button>
                </div>

                {!isNewPatient ? (
                  <select
                    value={selectedPatientId}
                    onChange={(e) => setSelectedPatientId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 font-medium focus:outline-hidden focus:border-blue-500"
                    required
                  >
                    <option value="">{t("-- Pilih Pasien --", "-- Select Patient --")}</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.mrn}) - {p.sex === "male" ? t("Laki-laki", "Male") : t("Perempuan", "Female")}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase">{t("Nama Lengkap *", "Full Name *")}</label>
                        <input
                          type="text"
                          required
                          value={newPatient.name}
                          onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                          placeholder={t("misal: Bpk. Ahmad Dahlan", "e.g. Mr. Ahmad Dahlan")}
                          className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase">{t("No. RM (Rekam Medis) *", "MRN (Medical Record No.) *")}</label>
                        <input
                          type="text"
                          required
                          value={newPatient.mrn}
                          onChange={(e) => setNewPatient({ ...newPatient, mrn: e.target.value })}
                          placeholder={t("misal: RM-2026-00999", "e.g. RM-2026-00999")}
                          className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-white font-mono"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase">{t("Tgl Lahir *", "Date of Birth *")}</label>
                        <input
                          type="date"
                          required
                          value={newPatient.birthDate}
                          onChange={(e) => setNewPatient({ ...newPatient, birthDate: e.target.value })}
                          className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase">{t("Jenis Kelamin", "Sex")}</label>
                        <select
                          value={newPatient.sex}
                          onChange={(e) => setNewPatient({ ...newPatient, sex: e.target.value })}
                          className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-white"
                        >
                          <option value="male">{t("Laki-laki", "Male")}</option>
                          <option value="female">{t("Perempuan", "Female")}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase">{t("No. Telepon", "Phone No.")}</label>
                        <input
                          type="text"
                          value={newPatient.phone}
                          onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                          placeholder="0812..."
                          className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Dokter Pengirim & Lokasi */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {t("Dokter Pengirim", "Referring Physician")}
                  </label>
                  <select
                    value={selectedPhysicianId}
                    onChange={(e) => setSelectedPhysicianId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 font-medium focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="">{t("-- Tanpa Dokter Spesifik --", "-- No Specific Physician --")}</option>
                    {physicians.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.specialization})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {t("Unit / Ruang Asal", "Source Unit / Ward")}
                  </label>
                  <select
                    value={sourceLocation}
                    onChange={(e) => setSourceLocation(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 font-medium focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="Poliklinik Rawat Jalan">{t("Poliklinik Rawat Jalan", "Outpatient Clinic")}</option>
                    <option value="Instalasi Gawat Darurat (IGD)">{t("Instalasi Gawat Darurat (IGD)", "Emergency Department (ER)")}</option>
                    <option value="Rawat Inap Lt. 3">{t("Rawat Inap Lt. 3", "Inpatient Ward, 3rd Floor")}</option>
                    <option value="Intensive Care Unit (ICU)">Intensive Care Unit (ICU)</option>
                    <option value="Medical Check Up (MCU)">Medical Check Up (MCU)</option>
                  </select>
                </div>
              </div>

              {/* Catatan Klinis */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {t("Catatan Klinis / Diagnosis Awal", "Clinical Notes / Initial Diagnosis")}
                </label>
                <input
                  type="text"
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  placeholder={t("misal: Demam berdarah hari ke-3, curiga trombositopenia", "e.g. Dengue fever day 3, suspected thrombocytopenia")}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              {/* Test Catalog Multi-Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {t("Pilih Pemeriksaan Laboratorium", "Select Lab Tests")} ({selectedTestCodes.length} {t("dipilih", "selected")})
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 rounded-2xl border border-slate-200 bg-slate-50/50">
                  {testCatalogs.map((test) => {
                    const isChecked = selectedTestCodes.includes(test.code);
                    const tStyle = tubeStyles[test.tubeColor] || tubeStyles.lavender_edta;

                    return (
                      <label
                        key={test.id}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isChecked
                            ? "bg-blue-50/80 border-blue-400 text-blue-900 shadow-2xs"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100/50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedTestCodes([...selectedTestCodes, test.code]);
                              } else {
                                setSelectedTestCodes(selectedTestCodes.filter((c) => c !== test.code));
                              }
                            }}
                            className="rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div>
                            <div className="text-xs font-semibold">{test.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{test.code}</div>
                          </div>
                        </div>

                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${tStyle.bg} ${tStyle.text} ${tStyle.border}`}>
                          {t(tStyle.name, tStyle.nameEn)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Live Specimen Preview Banner */}
              {liveSpecimenRequirements.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-cyan-50 border border-cyan-200">
                  <div className="text-xs font-bold text-cyan-900 flex items-center gap-1.5 mb-1.5">
                    <Sparkles className="h-4 w-4 text-cyan-700" />
                    <span>{t("Kalkulasi Otomatis Wadah Spesimen (Diagnova Engine)", "Automatic Specimen Container Calculation (Diagnova Engine)")}</span>
                  </div>
                  <div className="text-xs text-cyan-800">
                    {t("Sistem akan men-generate", "The system will generate")}{" "}
                    <strong>
                      {liveSpecimenRequirements.length}{" "}
                      {t(
                        "barcode tabung spesimen",
                        liveSpecimenRequirements.length === 1 ? "specimen tube barcode" : "specimen tube barcodes"
                      )}
                    </strong>
                    :
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {liveSpecimenRequirements.map((req, idx) => {
                      const tStyle = tubeStyles[req.tubeColor] || tubeStyles.lavender_edta;
                      return (
                        <div
                          key={idx}
                          className="px-2.5 py-1 rounded-xl bg-white border border-cyan-200 text-xs font-medium text-slate-700 shadow-2xs flex items-center gap-1.5"
                        >
                          <span className={`h-2.5 w-2.5 rounded-full ${tStyle.cap}`} />
                          <span>
                            <strong>1x {t(tStyle.name, tStyle.nameEn)}</strong> ({req.tests.join(", ")})
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  {t("Batal", "Cancel")}
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || selectedTestCodes.length === 0}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-500/20 disabled:opacity-50 transition-all flex items-center gap-1.5"
                >
                  {actionLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>{t("Memproses...", "Processing...")}</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      <span>{t("Buat Order & Generate Barcode", "Create Order & Generate Barcodes")}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Receive Specimen Confirmation */}
      {isReceiveOpen && receiveBarcode && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 animate-in fade-in duration-150">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">{t("Terima Tabung di Meja Lab", "Receive Tube at Lab Bench")}</h3>
                <p className="text-xs text-slate-500 font-mono">{receiveBarcode}</p>
              </div>
            </div>

            <div className="space-y-3 mb-5">
              <p className="text-xs text-slate-600 leading-relaxed">
                {t(
                  "Konfirmasi penerimaan fisik spesimen di meja laboratorium. Status spesimen akan berubah menjadi",
                  "Confirm physical receipt of the specimen at the lab bench. The specimen status will change to"
                )}{" "}
                <strong>RECEIVED_IN_LAB</strong>{" "}
                {t("dan siap dialirkan ke mesin analiser.", "and it will be ready to be routed to the analyzer.")}
              </p>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  {t("Nomor Rak / Lokasi Penyimpanan", "Rack Number / Storage Location")}
                </label>
                <input
                  type="text"
                  value={storageLocationInput}
                  onChange={(e) => setStorageLocationInput(e.target.value)}
                  placeholder={t("misal: Rak Hematologi A-01", "e.g. Hematology Rack A-01")}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsReceiveOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                {t("Batal", "Cancel")}
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleReceiveSpecimen}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-xs"
              >
                {actionLoading ? t("Menyimpan...", "Saving...") : t("Konfirmasi Penerimaan", "Confirm Receipt")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Reject Specimen Reason Dialog */}
      {isRejectOpen && rejectBarcode && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 animate-in fade-in duration-150">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
                <XCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">{t("Tolak Sampel Spesimen", "Reject Specimen")}</h3>
                <p className="text-xs text-slate-500 font-mono">{rejectBarcode}</p>
              </div>
            </div>

            <div className="space-y-3 mb-5">
              <p className="text-xs text-slate-600 leading-relaxed">
                {t(
                  "Berdasarkan standar ISO 15189, penolakan spesimen wajib menyertakan alasan klinis untuk memicu pengambilan ulang (*re-draw*).",
                  "Under ISO 15189, a specimen rejection must include a clinical reason to trigger a re-collection (*re-draw*)."
                )}
              </p>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  {t("Pilih Alasan Penolakan Standar", "Select a Standard Rejection Reason")}
                </label>
                <div className="space-y-1.5 mb-2">
                  {[
                    { r: "Sampel Hemolisis / Lysis", en: "Hemolyzed Specimen" },
                    { r: "Sampel Beku / Clotted (Darah EDTA membeku)", en: "Clotted Specimen (EDTA blood clotted)" },
                    { r: "Volume Darah Kurang / Insufficient Quantity", en: "Insufficient Quantity (QNS)" },
                    { r: "Salah Wadah / Tabung Antikoagulan Tertukar", en: "Wrong Container / Incorrect Anticoagulant Tube" },
                    { r: "Label Barcode Rusak / Tidak Terbaca", en: "Damaged / Unreadable Barcode Label" },
                  ].map(({ r, en }) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRejectReason(r)}
                      className={`w-full text-left p-2 rounded-lg text-xs border transition-colors ${
                        rejectReason === r
                          ? "bg-rose-50 border-rose-300 text-rose-800 font-semibold"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {t(r, en)}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder={t("Atau ketik alasan lain secara spesifik...", "Or type another specific reason...")}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:border-rose-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsRejectOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                {t("Batal", "Cancel")}
              </button>
              <button
                type="button"
                disabled={actionLoading || !rejectReason.trim()}
                onClick={handleRejectSpecimen}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 shadow-xs disabled:opacity-50"
              >
                {actionLoading ? t("Menyimpan...", "Saving...") : t("Tolak Spesimen Ini", "Reject This Specimen")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
