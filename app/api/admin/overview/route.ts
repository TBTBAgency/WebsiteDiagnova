import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/authz";
import { db } from "@/lib/db";
import { getLeadMetrics, prismaToInstitutionType, STATUS_LABELS } from "@/lib/models/lead.model";
import { getAuditLogs } from "@/lib/models/audit.model";
import { jakartaDateKey, jakartaDayStart } from "@/lib/time";
import { prismaPriorityToOrderPriority, prismaStatusToOrderStatus } from "@/lib/models/order.model";
import { ApiResponse } from "@/types";
import { OrderPriority, OrderStatus, SpecimenStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;

    const now = new Date();
    const days = 14;
    const timelineStart = jakartaDayStart(jakartaDateKey(new Date(now.getTime() - (days - 1) * 86400000)))!;

    const [
      leadMetrics,
      orderStats,
      orderPriorityStats,
      specimenStats,
      activeUsersCount,
      recentLeads,
      recentOrders,
      institutionGroups,
    ] = await Promise.all([
      getLeadMetrics(),
      db.labOrder.groupBy({
        by: ["status"],
        _count: { status: true },
      }),
      db.labOrder.groupBy({
        by: ["priority"],
        _count: { priority: true },
      }),
      db.specimen.groupBy({
        by: ["status"],
        _count: { status: true },
      }),
      // Hanya akun USER (akun demo klien) yang aktif & tidak dihapus — ADMIN tidak dihitung
      db.user.count({ where: { status: "ACTIVE", deletedAt: null, role: { code: "USER" } } }),
      db.lead.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
      db.labOrder.findMany({
        take: 5,
        orderBy: [{ priority: "asc" }, { orderedAt: "desc" }],
        include: {
          patient: { select: { name: true, mrn: true } },
          physician: { select: { name: true, department: true } },
          specimens: { select: { id: true, barcodeNumber: true, status: true } },
          items: { select: { id: true } },
        },
      }),
      db.lead.groupBy({
        by: ["institutionType"],
        _count: { institutionType: true },
      }),
    ]);

    // Agregasi penuh 14 hari (bukan dari 5 data terbaru)
    const [leadDates, orderDates, recentAudit] = await Promise.all([
      db.lead.findMany({ where: { createdAt: { gte: timelineStart } }, select: { createdAt: true } }),
      db.labOrder.findMany({ where: { orderedAt: { gte: timelineStart } }, select: { orderedAt: true } }),
      getAuditLogs({ limit: 5 }),
    ]);

    // Format Metrik Order LIS
    let totalOrders = 0;
    let citoOrders = 0;
    let urgentOrders = 0;
    let routineOrders = 0;
    let receivedOrders = 0;
    let completedOrders = 0;

    for (const item of orderPriorityStats) {
      const c = item._count.priority;
      totalOrders += c;
      if (item.priority === OrderPriority.CITO) citoOrders += c;
      else if (item.priority === OrderPriority.URGENT) urgentOrders += c;
      else if (item.priority === OrderPriority.ROUTINE) routineOrders += c;
    }

    for (const item of orderStats) {
      if (item.status === OrderStatus.SPECIMEN_RECEIVED) receivedOrders += item._count.status;
      else if (item.status === OrderStatus.COMPLETED) completedOrders += item._count.status;
    }

    // Format Metrik Spesimen
    let totalSpecimens = 0;
    let collectedSpecimens = 0;
    let receivedSpecimens = 0;
    let rejectedSpecimens = 0;

    for (const item of specimenStats) {
      const c = item._count.status;
      totalSpecimens += c;
      if (item.status === SpecimenStatus.COLLECTED) collectedSpecimens += c;
      else if (item.status === SpecimenStatus.RECEIVED_IN_LAB) receivedSpecimens += c;
      else if (item.status === SpecimenStatus.REJECTED) rejectedSpecimens += c;
    }

    // Hitung distribusi institusi
    const institutionDistribution = institutionGroups.map((g) => ({
      type: prismaToInstitutionType[g.institutionType] || "other",
      count: g._count.institutionType,
    }));

    // Timeline harian per tanggal WIB
    const leadCounts = new Map<string, number>();
    for (const l of leadDates) leadCounts.set(jakartaDateKey(l.createdAt), (leadCounts.get(jakartaDateKey(l.createdAt)) ?? 0) + 1);
    const orderCounts = new Map<string, number>();
    for (const o of orderDates) orderCounts.set(jakartaDateKey(o.orderedAt), (orderCounts.get(jakartaDateKey(o.orderedAt)) ?? 0) + 1);

    const timelineData: { date: string; label: string; leads: number; orders: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const key = jakartaDateKey(new Date(now.getTime() - i * 86400000));
      const label = new Date(`${key}T00:00:00+07:00`).toLocaleDateString("id-ID", { day: "numeric", month: "short", timeZone: "Asia/Jakarta" });
      timelineData.push({ date: key, label, leads: leadCounts.get(key) ?? 0, orders: orderCounts.get(key) ?? 0 });
    }

    // Format Recent Leads
    const formattedRecentLeads = recentLeads.map((l) => ({
      id: l.id,
      name: l.name,
      institution: l.institution,
      jobTitle: l.jobTitle,
      email: l.email,
      phone: l.phone,
      institutionType: prismaToInstitutionType[l.institutionType] || "other",
      status: l.status,
      statusLabel: STATUS_LABELS[l.status],
      createdAt: l.createdAt.toISOString(),
    }));

    // Format Recent Orders
    const formattedRecentOrders = recentOrders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      patientName: o.patient.name,
      patientMrn: o.patient.mrn,
      physicianName: o.physician?.name || "Dokter Umum",
      priority: prismaPriorityToOrderPriority[o.priority] || "routine",
      status: prismaStatusToOrderStatus[o.status] || "ordered",
      orderedAt: o.orderedAt.toISOString(),
      itemsCount: o.items.length,
      specimensCount: o.specimens.length,
      receivedSpecimensCount: o.specimens.filter((s) => s.status === SpecimenStatus.RECEIVED_IN_LAB).length,
    }));

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Data overview dashboard berhasil dimuat.",
      data: {
        summary: {
          leads: {
            total: leadMetrics.total,
            contacted: leadMetrics.contacted,
            scheduled: leadMetrics.scheduled,
            completed: leadMetrics.completed,
            upcomingThisMonth: leadMetrics.upcomingThisMonth,
            awaitingCompletion: leadMetrics.awaitingCompletion,
          },
          orders: {
            total: totalOrders,
            cito: citoOrders,
            urgent: urgentOrders,
            routine: routineOrders,
            received: receivedOrders,
            completed: completedOrders,
          },
          specimens: {
            total: totalSpecimens,
            collected: collectedSpecimens,
            received: receivedSpecimens,
            rejected: rejectedSpecimens,
          },
          activeUsers: activeUsersCount,
        },
        timeline: timelineData,
        institutionDistribution,
        recentLeads: formattedRecentLeads,
        recentOrders: formattedRecentOrders,
        recentAuditLogs: recentAudit,
      },
    });
  } catch (error) {
    console.error("Overview API Error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Gagal memuat ringkasan dashboard eksekutif." },
      { status: 500 }
    );
  }
}
