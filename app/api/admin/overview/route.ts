import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth-session";
import { db } from "@/lib/db";
import { getLeadMetrics, prismaToInstitutionType, prismaToLeadStatus } from "@/lib/models/lead.model";
import { prismaPriorityToOrderPriority, prismaStatusToOrderStatus } from "@/lib/models/order.model";
import { ApiResponse } from "@/types";
import { OrderPriority, OrderStatus, SpecimenStatus } from "@prisma/client";

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Akses ditolak. Sesi tidak valid." },
        { status: 401 }
      );
    }

    // Eksekusi query database paralel untuk performa maksimal
    const [
      leadMetrics,
      orderStats,
      orderPriorityStats,
      specimenStats,
      activeUsersCount,
      recentLeads,
      recentOrders,
      institutionGroups,
      recentAuditLogs,
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
      db.user.count({ where: { status: "ACTIVE" } }),
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
      db.auditLog.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true } } },
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

    // Data timeline harian permohonan demo & lab orders (14 hari terakhir)
    const now = new Date();
    const days = 14;
    const timelineData: { date: string; label: string; leads: number; orders: number }[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const label = d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });

      // Hitung data riil yang jatuh pada tanggal tersebut
      const leadsCount = recentLeads.filter(
        (l) => l.createdAt.toISOString().split("T")[0] === dateStr
      ).length;
      const ordersCount = recentOrders.filter(
        (o) => o.orderedAt.toISOString().split("T")[0] === dateStr
      ).length;

      timelineData.push({
        date: dateStr,
        label,
        leads: leadsCount,
        orders: ordersCount,
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
      status: prismaToLeadStatus[l.status] || "new",
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

    // Format Recent Audit Logs
    const formattedRecentAuditLogs = recentAuditLogs.map((a) => ({
      id: a.id,
      action: a.action,
      entity: a.entity,
      userName: a.user?.name || "Sistem Diagnova",
      createdAt: a.createdAt.toISOString(),
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
        recentAuditLogs: formattedRecentAuditLogs,
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
