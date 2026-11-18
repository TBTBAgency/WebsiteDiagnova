import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { getLeadMetrics, prismaToInstitutionType } from "@/lib/models/lead.model";
import { prismaPriorityToOrderPriority, prismaStatusToOrderStatus } from "@/lib/models/order.model";
import { ApiResponse } from "@/types";
import { OrderPriority, OrderStatus, SpecimenStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;
    // Eksekusi query database paralel
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
      db.user.count({ where: { status: 1 } }),
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

    // Data timeline harian permohonan demo & lab orders (14 hari terakhir, tanggal WIB).
    // Dihitung dari SELURUH data dalam rentang (bukan hanya 5 data terbaru).
    const days = 14;
    const tz = "Asia/Jakarta";
    const dayKey = (d: Date) => new Intl.DateTimeFormat("en-CA", { timeZone: tz }).format(d); // YYYY-MM-DD
    const now = new Date();
    const from = new Date(now.getTime() - (days + 1) * 24 * 60 * 60 * 1000);
    const [leadDates, orderDates] = await Promise.all([
      db.lead.findMany({ where: { createdAt: { gte: from } }, select: { createdAt: true } }),
      db.labOrder.findMany({ where: { orderedAt: { gte: from } }, select: { orderedAt: true } }),
    ]);
    const leadsPerDay = new Map<string, number>();
    for (const l of leadDates) leadsPerDay.set(dayKey(l.createdAt), (leadsPerDay.get(dayKey(l.createdAt)) || 0) + 1);
    const ordersPerDay = new Map<string, number>();
    for (const o of orderDates) ordersPerDay.set(dayKey(o.orderedAt), (ordersPerDay.get(dayKey(o.orderedAt)) || 0) + 1);

    const timelineData: { date: string; label: string; leads: number; orders: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = dayKey(d);
      timelineData.push({
        date: dateStr,
        label: d.toLocaleDateString("id-ID", { day: "numeric", month: "short", timeZone: tz }),
        leads: leadsPerDay.get(dateStr) || 0,
        orders: ordersPerDay.get(dateStr) || 0,
      });
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
      voucherCode: l.voucherCode,
      voucherExpiry: l.voucherExpiry ? l.voucherExpiry.toISOString() : null,
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
            new: leadMetrics.new,
            contacted: leadMetrics.contacted,
            scheduled: leadMetrics.scheduled,
            completed: leadMetrics.completed,
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
        recentAuditLogs: [],
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
