"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
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
const tubeStyles: Record<TubeColor, { name: string; bg: string; text: string; border: string; cap: string }> = {
  lavender_edta: {
    name: "EDTA Ungu",
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    cap: "bg-purple-600",
  },
  red_plain: {
    name: "Merah Plain",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    cap: "bg-red-600",
  },
  yellow_sst: {
    name: "Kuning / SST",
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
    cap: "bg-amber-500",
  },
  light_blue_citrate: {
    name: "Biru Sitrat",
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
    cap: "bg-sky-500",
  },
  green_heparin: {
    name: "Hijau Heparin",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    cap: "bg-emerald-600",
  },
  gray_fluoride: {
    name: "Abu-abu Fluoride",
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-300",
    cap: "bg-slate-500",
  },
  urine_container: {
    name: "Wadah Urin",
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-200",
    cap: "bg-yellow-500",
  },
  other: {
    name: "Wadah Lainnya",
    bg: "bg-stone-100",
    text: "text-stone-700",
    border: "border-stone-300",
    cap: "bg-stone-600",
  },
};

const statusConfig: Record<
  OrderStatus,
  { label: string; bg: string; text: string; border: string; icon: React.ElementType }
> = {
  ordered: {
    label: "Menunggu Sampel",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    icon: Clock,
  },
  specimen_received: {
    label: "Diterima di Lab",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    icon: Sparkles,
  },
  processing: {
    label: "Sedang Diuji",
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200",
    icon: Sparkles,
  },
  partially_validated: {
    label: "Validasi Parsial",
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    icon: Sparkles,
  },
  completed: {
    label: "Selesai",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Dibatalkan",
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    icon: XCircle,
  },
};

export default function LabOrdersPage() {
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
        setError(data.message || "Gagal memuat order lab.");
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan jaringan.");
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
          alert("Nama, No. RM, dan Tanggal Lahir pasien wajib diisi.");
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
          alert(patData.message || "Gagal mendaftarkan pasien baru.");
          setActionLoading(false);
          return;
        }
        finalPatientId = patData.data.id;
      }

      if (!finalPatientId) {
        alert("Pilih pasien terlebih dahulu.");
        setActionLoading(false);
        return;
      }

      if (selectedTestCodes.length === 0) {
        alert("Pilih minimal satu pemeriksaan laboratorium.");
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
        alert(resData.message || "Gagal membuat order lab.");
      }
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan saat memproses order.");
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
        alert(data.message || "Gagal menerima spesimen.");
      }
    } catch (err: any) {
      alert(err.message || "Gagal menerima spesimen.");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Reject Specimen
  const handleRejectSpecimen = async () => {
    if (!rejectBarcode) return;
    if (!rejectReason.trim()) {
      alert("Alasan penolakan spesimen wajib diisi (ISO 15189).");
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
        alert(data.message || "Gagal menolak spesimen.");
      }
    } catch (err: any) {
      alert(err.message || "Gagal menolak spesimen.");
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
              Lab Orders (Pre-Analitik)
            </h1>
            <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200">
              LIS Fase 2
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manajemen pendaftaran pemeriksaan, barcode tracking tabung spesimen, dan penerimaan sampel meja laboratorium.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-colors shadow-xs"
            title="Muat ulang data"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-blue-600" : ""}`} />
          </button>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-500/20 transition-all hover:shadow-md"
          >
            <Plus className="h-4 w-4" />
            <span>Registrasi Order Lab</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Total Order</span>
            <ClipboardList className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-display">{metrics.total}</div>
          <span className="text-[10px] text-slate-400">Tercatat di sistem</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-amber-700 mb-1">
            <span className="text-xs font-medium">Menunggu Sampel</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-display">{metrics.waiting}</div>
          <span className="text-[10px] text-amber-600/80">Tahap Phlebotomy</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-blue-700 mb-1">
            <span className="text-xs font-medium">Diterima di Lab</span>
            <CheckCircle2 className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-display">{metrics.received}</div>
          <span className="text-[10px] text-blue-600/80">Siap analitik / mesin</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-rose-700 mb-1">
            <span className="text-xs font-medium">Sampel Ditolak</span>
            <XCircle className="h-4 w-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-600 font-display">{metrics.rejected}</div>
          <span className="text-[10px] text-rose-500">Perlu re-sampling</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-rose-700 mb-1">
            <span className="text-xs font-medium">Prioritas CITO</span>
            <AlertTriangle className="h-4 w-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-600 font-display">{metrics.cito}</div>
          <span className="text-[10px] text-rose-500">Pasien Gawat Darurat</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari Nomor Order, Nama Pasien, No. RM, atau Barcode..."
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
              Semua
            </button>
            <button
              onClick={() => setStatusFilter("ordered")}
              className={`px-3 py-1 rounded-lg transition-all ${
                statusFilter === "ordered" ? "bg-white text-amber-700 shadow-xs font-semibold" : "hover:text-slate-900"
              }`}
            >
              Menunggu
            </button>
            <button
              onClick={() => setStatusFilter("in_progress")}
              className={`px-3 py-1 rounded-lg transition-all ${
                statusFilter === "in_progress" ? "bg-white text-blue-700 shadow-xs font-semibold" : "hover:text-slate-900"
              }`}
            >
              Diterima Lab
            </button>
            <button
              onClick={() => setStatusFilter("completed")}
              className={`px-3 py-1 rounded-lg transition-all ${
                statusFilter === "completed" ? "bg-white text-emerald-700 shadow-xs font-semibold" : "hover:text-slate-900"
              }`}
            >
              Selesai
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
            <span>CITO Saja</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
            <p className="text-xs text-slate-500">Memuat daftar order laboratorium...</p>
          </div>
        ) : error ? (
          <div className="py-16 text-center text-rose-600">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm font-semibold">{error}</p>
            <button
              onClick={fetchOrders}
              className="mt-3 px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-lg text-xs font-medium hover:bg-rose-100"
            >
              Coba Lagi
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center text-slate-500">
            <ClipboardList className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-800">Belum Ada Order Laboratorium</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Tidak ditemukan data order lab sesuai filter. Silakan klik tombol &quot;Registrasi Order Lab&quot; untuk membuat order baru.
            </p>
            <button
              onClick={openCreateModal}
              className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
            >
              + Buat Order Baru
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">No. Order & Prioritas</th>
                  <th className="py-3 px-4">Pasien & No. RM</th>
                  <th className="py-3 px-4">Dokter & Unit</th>
                  <th className="py-3 px-4">Tabung & Barcode</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
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
                              <span>CITO</span>
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(order.orderedAt).toLocaleString("id-ID")}</span>
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
                          {order.physician?.name || "Dokter Umum"}
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
                                title={`Barcode: ${sp.barcode} | Status: ${sp.status}`}
                              >
                                <span className={`h-2 w-2 rounded-full ${tStyle.cap}`} />
                                <span>{sp.barcode.split("-").slice(-1)[0]}</span>
                                {isReceived && <Check className="h-3 w-3 text-emerald-600" />}
                                {isRejected && <X className="h-3 w-3 text-rose-600" />}
                              </span>
                            );
                          })}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">
                          {order.items.length} item tes diminta
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          <span>{statusInfo.label}</span>
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
                          <span>Kelola Tabung</span>
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
                        CITO EMERGENCY
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    Registrasi: {new Date(selectedOrder.orderedAt).toLocaleString("id-ID")} • Asal: {selectedOrder.sourceLocation}
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
                    <span>Identitas Pasien</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900">{selectedOrder.patient.name}</div>
                  <div className="text-xs text-slate-500 mt-1 space-y-0.5">
                    <div>No. RM: <span className="font-mono font-semibold text-slate-800">{selectedOrder.patient.mrn}</span></div>
                    <div>Jenis Kelamin: <span className="capitalize">{selectedOrder.patient.sex}</span></div>
                    {selectedOrder.patient.phone && <div>No. Kontak: {selectedOrder.patient.phone}</div>}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-2">
                    <Stethoscope className="h-4 w-4 text-blue-600" />
                    <span>Dokter & Catatan Medis</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    {selectedOrder.physician?.name || "Dokter Umum"}
                  </div>
                  <div className="text-xs text-slate-500 mt-1 space-y-0.5">
                    <div>Spesialisasi: {selectedOrder.physician?.specialization || "-"}</div>
                    <div>Catatan Klinis: <span className="italic text-slate-700">{selectedOrder.clinicalNotes || "Tidak ada catatan klinis."}</span></div>
                  </div>
                </div>
              </div>

              {/* Items Pemeriksaan */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                  Daftar Pemeriksaan yang Diminta ({selectedOrder.items.length})
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
                    Spesimen Tabung Darah & Barcode ({selectedOrder.specimens.length})
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    Standar ISO 15189 Pre-Analitik
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
                                  {tStyle.name}
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
                                  title="Salin Barcode"
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
                                  Lokasi Rak: <span className="font-semibold text-slate-700">{sp.storageLocation}</span>
                                </div>
                              )}

                              {isRejected && (
                                <div className="text-[11px] text-rose-700 font-semibold mt-1 flex items-center gap-1">
                                  <ShieldAlert className="h-3.5 w-3.5" />
                                  <span>Ditolak: {sp.rejectionReason}</span>
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
                                  <span>Terima di Lab</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setRejectBarcode(sp.barcode);
                                    setIsRejectOpen(true);
                                  }}
                                  className="px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs transition-colors flex items-center gap-1"
                                >
                                  <XCircle className="h-3.5 w-3.5" />
                                  <span>Tolak Sampel</span>
                                </button>
                              </>
                            )}

                            {isReceived && (
                              <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 border border-emerald-200">
                                <Check className="h-3.5 w-3.5" />
                                <span>Diterima di Meja Lab</span>
                              </span>
                            )}

                            {isRejected && (
                              <span className="px-3 py-1 rounded-xl bg-rose-100 text-rose-800 text-xs font-semibold flex items-center gap-1.5 border border-rose-200">
                                <X className="h-3.5 w-3.5" />
                                <span>Sampel Ditolak</span>
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
                Tutup
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
                    Registrasi Lab Order Baru
                  </h3>
                  <p className="text-xs text-slate-500">
                    Otomatis kalkulasi tabung spesimen & pembuatan barcode
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
                  Tingkat Prioritas
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
                    Rutin (Standard TAT)
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
                    <span>CITO (Gawat Darurat / Segera)</span>
                  </button>
                </div>
              </div>

              {/* Pasien Selection */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Data Pasien
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsNewPatient(!isNewPatient)}
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    {isNewPatient ? "← Pilih dari Pasien Terdaftar" : "+ Daftarkan Pasien Baru"}
                  </button>
                </div>

                {!isNewPatient ? (
                  <select
                    value={selectedPatientId}
                    onChange={(e) => setSelectedPatientId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 font-medium focus:outline-hidden focus:border-blue-500"
                    required
                  >
                    <option value="">-- Pilih Pasien --</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.mrn}) - {p.sex === "male" ? "Laki-laki" : "Perempuan"}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase">Nama Lengkap *</label>
                        <input
                          type="text"
                          required
                          value={newPatient.name}
                          onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                          placeholder="misal: Bpk. Ahmad Dahlan"
                          className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase">No. RM (Rekam Medis) *</label>
                        <input
                          type="text"
                          required
                          value={newPatient.mrn}
                          onChange={(e) => setNewPatient({ ...newPatient, mrn: e.target.value })}
                          placeholder="misal: RM-2026-00999"
                          className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-white font-mono"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase">Tgl Lahir *</label>
                        <input
                          type="date"
                          required
                          value={newPatient.birthDate}
                          onChange={(e) => setNewPatient({ ...newPatient, birthDate: e.target.value })}
                          className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase">Jenis Kelamin</label>
                        <select
                          value={newPatient.sex}
                          onChange={(e) => setNewPatient({ ...newPatient, sex: e.target.value })}
                          className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-white"
                        >
                          <option value="male">Laki-laki</option>
                          <option value="female">Perempuan</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase">No. Telepon</label>
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
                    Dokter Pengirim
                  </label>
                  <select
                    value={selectedPhysicianId}
                    onChange={(e) => setSelectedPhysicianId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 font-medium focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="">-- Tanpa Dokter Spesifik --</option>
                    {physicians.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.specialization})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Unit / Ruang Asal
                  </label>
                  <select
                    value={sourceLocation}
                    onChange={(e) => setSourceLocation(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 font-medium focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="Poliklinik Rawat Jalan">Poliklinik Rawat Jalan</option>
                    <option value="Instalasi Gawat Darurat (IGD)">Instalasi Gawat Darurat (IGD)</option>
                    <option value="Rawat Inap Lt. 3">Rawat Inap Lt. 3</option>
                    <option value="Intensive Care Unit (ICU)">Intensive Care Unit (ICU)</option>
                    <option value="Medical Check Up (MCU)">Medical Check Up (MCU)</option>
                  </select>
                </div>
              </div>

              {/* Catatan Klinis */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Catatan Klinis / Diagnosis Awal
                </label>
                <input
                  type="text"
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  placeholder="misal: Demam berdarah hari ke-3, curiga trombositopenia"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              {/* Test Catalog Multi-Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Pilih Pemeriksaan Laboratorium ({selectedTestCodes.length} dipilih)
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
                          {tStyle.name}
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
                    <span>Kalkulasi Otomatis Wadah Spesimen (Diagnova Engine)</span>
                  </div>
                  <div className="text-xs text-cyan-800">
                    Sistem akan men-generate{" "}
                    <strong>{liveSpecimenRequirements.length} barcode tabung spesimen</strong>:
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
                            <strong>1x {tStyle.name}</strong> ({req.tests.join(", ")})
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
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || selectedTestCodes.length === 0}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-500/20 disabled:opacity-50 transition-all flex items-center gap-1.5"
                >
                  {actionLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Buat Order & Generate Barcode</span>
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
                <h3 className="font-bold text-slate-900 text-base">Terima Tabung di Meja Lab</h3>
                <p className="text-xs text-slate-500 font-mono">{receiveBarcode}</p>
              </div>
            </div>

            <div className="space-y-3 mb-5">
              <p className="text-xs text-slate-600 leading-relaxed">
                Konfirmasi penerimaan fisik spesimen di meja laboratorium. Status spesimen akan berubah menjadi <strong>RECEIVED_IN_LAB</strong> dan siap dialirkan ke mesin analiser.
              </p>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Nomor Rak / Lokasi Penyimpanan
                </label>
                <input
                  type="text"
                  value={storageLocationInput}
                  onChange={(e) => setStorageLocationInput(e.target.value)}
                  placeholder="misal: Rak Hematologi A-01"
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
                Batal
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleReceiveSpecimen}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-xs"
              >
                {actionLoading ? "Menyimpan..." : "Konfirmasi Penerimaan"}
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
                <h3 className="font-bold text-slate-900 text-base">Tolak Sampel Spesimen</h3>
                <p className="text-xs text-slate-500 font-mono">{rejectBarcode}</p>
              </div>
            </div>

            <div className="space-y-3 mb-5">
              <p className="text-xs text-slate-600 leading-relaxed">
                Berdasarkan standar ISO 15189, penolakan spesimen wajib menyertakan alasan klinis untuk memicu pengambilan ulang (*re-draw*).
              </p>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Pilih Alasan Penolakan Standar
                </label>
                <div className="space-y-1.5 mb-2">
                  {[
                    "Sampel Hemolisis / Lysis",
                    "Sampel Beku / Clotted (Darah EDTA membeku)",
                    "Volume Darah Kurang / Insufficient Quantity",
                    "Salah Wadah / Tabung Antikoagulan Tertukar",
                    "Label Barcode Rusak / Tidak Terbaca",
                  ].map((r) => (
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
                      {r}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Atau ketik alasan lain secara spesifik..."
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
                Batal
              </button>
              <button
                type="button"
                disabled={actionLoading || !rejectReason.trim()}
                onClick={handleRejectSpecimen}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 shadow-xs disabled:opacity-50"
              >
                {actionLoading ? "Menyimpan..." : "Tolak Spesimen Ini"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
