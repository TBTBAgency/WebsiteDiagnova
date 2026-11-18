import type { ContentFieldDef, PageContentSpec } from "@/lib/cms-page-content";

/**
 * Konten section bawaan halaman Platform yang dikelola CMS (Halaman & Section › Edit Konten).
 * defaults = teks persis seperti sebelum dipindah ke CMS (tampilan tidak berubah sampai admin menyimpan).
 *
 * Catatan desain: teks kecil di dalam ilustrasi/mockup (mis. "Sysmex XN", "WBC 7.42", tabel hasil
 * pada monitor, label simpul diagram) adalah bagian desain dan tetap di kode halaman.
 */

/** Ikon (lucide) yang tersedia untuk item; nama dipetakan ke komponen di PlatformPageClient. */
const ICON_OPTIONS: { value: string; label: string }[] = [
  { value: "Zap", label: "Petir (Zap)" },
  { value: "Network", label: "Jaringan (Network)" },
  { value: "Sparkles", label: "Kilau (Sparkles)" },
  { value: "ShieldCheck", label: "Perisai centang (ShieldCheck)" },
  { value: "CheckCircle2", label: "Lingkaran centang (CheckCircle2)" },
  { value: "Check", label: "Centang (Check)" },
  { value: "Clock", label: "Jam (Clock)" },
  { value: "Server", label: "Server" },
  { value: "FileText", label: "Dokumen (FileText)" },
  { value: "FileCheck2", label: "Dokumen centang (FileCheck2)" },
  { value: "Lock", label: "Gembok (Lock)" },
  { value: "QrCode", label: "Kode QR (QrCode)" },
  { value: "BarChart3", label: "Grafik batang (BarChart3)" },
  { value: "TrendingUp", label: "Tren naik (TrendingUp)" },
  { value: "TrendingDown", label: "Tren turun (TrendingDown)" },
  { value: "Activity", label: "Aktivitas (Activity)" },
  { value: "Cpu", label: "Prosesor / instrumen (Cpu)" },
  { value: "Layers", label: "Lapisan (Layers)" },
  { value: "AlertCircle", label: "Peringatan (AlertCircle)" },
  { value: "FlaskConical", label: "Tabung lab (FlaskConical)" },
  { value: "Headphones", label: "Headset dukungan (Headphones)" },
  { value: "Building2", label: "Gedung (Building2)" },
];

const iconField = (help?: string): ContentFieldDef => ({
  key: "icon",
  label: "Ikon",
  type: "select",
  options: ICON_OPTIONS,
  help,
});

export const PLATFORM_CONTENT: PageContentSpec = {
  defs: {
    automation: {
      help: "Kartu fitur otomatisasi di bawah judul section. Setiap kartu dapat memakai salah satu ilustrasi bawaan.",
      lists: [
        {
          key: "cards",
          label: "Kartu Otomatisasi",
          itemLabel: "Kartu",
          maxItems: 6,
          minItems: 1,
          summaryField: "title",
          fields: [
            { key: "title", label: "Judul", type: "text", required: true },
            { key: "description", label: "Deskripsi", type: "textarea", max: 500 },
            {
              key: "visual",
              label: "Ilustrasi",
              type: "select",
              options: [
                { value: "telemetry", label: "Pipeline telemetri analyzer → LIS" },
                { value: "autoverify", label: "Pohon keputusan auto-verifikasi" },
                { value: "edgebuffer", label: "Monitor edge buffer" },
                { value: "none", label: "Tanpa ilustrasi (ikon)" },
              ],
            },
            iconField("Dipakai bila ilustrasi = Tanpa ilustrasi (ikon)."),
          ],
        },
      ],
    },
    reporting: {
      help: "Kartu poin kepatuhan di kolom kiri dan kartu aksen biru di atas mockup monitor. Isi mockup monitor adalah bagian desain.",
      fields: [
        { key: "accentTitle", label: "Kartu aksen — judul", type: "text", required: true },
        { key: "accentTag", label: "Kartu aksen — label kecil", type: "text" },
        { key: "accentText", label: "Kartu aksen — deskripsi", type: "textarea", max: 500 },
      ],
      lists: [
        {
          key: "features",
          label: "Poin Kepatuhan",
          itemLabel: "Poin",
          maxItems: 4,
          minItems: 1,
          summaryField: "title",
          fields: [
            iconField(),
            { key: "title", label: "Judul", type: "text", required: true },
            { key: "description", label: "Deskripsi", type: "textarea", max: 500 },
          ],
        },
      ],
    },
    analytics: {
      help: "Kartu kemampuan analitik. Judul boleh memakai baris baru untuk jeda baris; poin ditulis satu per baris.",
      lists: [
        {
          key: "cards",
          label: "Kartu Analitik",
          itemLabel: "Kartu",
          maxItems: 6,
          minItems: 1,
          summaryField: "title",
          fields: [
            iconField(),
            { key: "title", label: "Judul", type: "textarea", max: 300, required: true, help: "Tekan Enter untuk jeda baris." },
            { key: "points", label: "Poin-poin", type: "textarea", max: 2000, help: "Satu poin per baris." },
          ],
        },
      ],
    },
    enterprise: {
      help: "Kartu dukungan 24/7 (dengan pemilih jadwal SLA) dan kartu-kartu di bawahnya.",
      fields: [
        { key: "supportBadge", label: "Kartu dukungan — label", type: "text" },
        { key: "supportTitle", label: "Kartu dukungan — judul", type: "text", required: true },
        { key: "responseLabel", label: "Label respons target", type: "text" },
        { key: "uptimeLabel", label: "Label uptime", type: "text" },
        { key: "uptimeValue", label: "Nilai uptime", type: "text", bilingual: false, max: 40 },
        { key: "activeLabel", label: "Label slot terpilih", type: "text", max: 40, help: "Ditampilkan pada slot SLA yang sedang dipilih." },
      ],
      lists: [
        {
          key: "slaSlots",
          label: "Slot SLA",
          itemLabel: "Slot",
          maxItems: 6,
          minItems: 1,
          summaryField: "shift",
          help: "Slot kedua (bila ada) terpilih secara bawaan.",
          fields: [
            { key: "window", label: "Rentang waktu", type: "text", required: true, max: 60 },
            { key: "shift", label: "Nama shift / layanan", type: "text", required: true },
            { key: "sla", label: "Target respons", type: "text", max: 40 },
            { key: "detail", label: "Deskripsi", type: "textarea", max: 500 },
          ],
        },
        {
          key: "cards",
          label: "Kartu Bawah",
          itemLabel: "Kartu",
          maxItems: 4,
          minItems: 1,
          summaryField: "title",
          fields: [
            { key: "title", label: "Judul", type: "text", required: true },
            { key: "description", label: "Deskripsi", type: "textarea", max: 500 },
            {
              key: "visual",
              label: "Ilustrasi",
              type: "select",
              options: [
                { value: "roadmap", label: "Grafik peta jalan (milestone)" },
                { value: "network", label: "Jaringan multi-lokasi (orbit)" },
                { value: "none", label: "Tanpa ilustrasi (ikon)" },
              ],
            },
            iconField("Dipakai bila ilustrasi = Tanpa ilustrasi (ikon)."),
          ],
        },
      ],
    },
  },
  defaults: {
    automation: {
      fields: {},
      lists: {
        cards: [
          {
            id: "tat",
            isActive: true,
            titleId: "Pangkas TAT Hingga 70%",
            titleEn: "Cut Turnaround Time by 70%",
            descriptionId:
              "Hasil uji hematologi, kimia, dan urin mengalir langsung ke layar dokter tanpa antrean ketik manual oleh analis.",
            descriptionEn: "Analyzer telemetry streams directly to clinical screens with zero manual transcription.",
            visual: "telemetry",
            icon: "Zap",
          },
          {
            id: "auto-verification",
            isActive: true,
            titleId: "Auto-Verification Engine",
            titleEn: "Auto-Verification Engine",
            descriptionId:
              "Rule engine otomatis memverifikasi sampel normal, membebaskan dokter untuk fokus pada kasus anomali kritis.",
            descriptionEn: "Automated rules instantly release normal specimens, keeping physicians focused on critical anomalies.",
            visual: "autoverify",
            icon: "ShieldCheck",
          },
          {
            id: "edge-buffer",
            isActive: true,
            titleId: "Resilient Edge Buffer",
            titleEn: "Resilient Edge Buffer",
            descriptionId:
              "Jaringan RS drop? Buffer lokal mengamankan data analyzer dan menyinkronkan otomatis saat koneksi pulih.",
            descriptionEn: "Hospital network down? Edge buffers store transmissions and auto-resync upon reconnection.",
            visual: "edgebuffer",
            icon: "Server",
          },
        ],
      },
    },
    reporting: {
      fields: {
        accentTitleId: "Kepatuhan KARS & ISO",
        accentTitleEn: "KARS & ISO Ready",
        accentTagId: "100% Tamper-Proof",
        accentTagEn: "100% Tamper-Proof",
        accentTextId: "Setiap analit terkunci permanen dengan e-sign dokter berkeabsahan hukum penuh via BSrE BSSN.",
        accentTextEn:
          "Every analyte is cryptographically locked with legally accredited pathologist signatures via BSrE.",
      },
      lists: {
        features: [
          {
            id: "tamper-proof-logs",
            isActive: true,
            icon: "Lock",
            titleId: "Log Anti-Manipulasi",
            titleEn: "Tamper-Proof Logs",
            descriptionId:
              "Catatan historis tidak dapat diedit atau dihapus, memenuhi persyaratan akreditasi KARS & JCI.",
            descriptionEn: "Historical entries cannot be altered or purged, satisfying KARS & JCI accreditation criteria.",
          },
          {
            id: "e-signature",
            isActive: true,
            icon: "FileCheck2",
            titleId: "E-Sign Dokter Bersertifikat",
            titleEn: "Certified E-Signatures",
            descriptionId:
              "Tanda tangan digital dokter Sp.PK dengan QR verifikasi keaslian langsung pada lembar hasil.",
            descriptionEn: "Certified pathologist e-signatures with instant QR-code verification on patient reports.",
          },
        ],
      },
    },
    analytics: {
      fields: {},
      lists: {
        cards: [
          {
            id: "tat-bottleneck",
            isActive: true,
            icon: "Clock",
            titleId: "TAT Real-Time & \nDeteksi Bottleneck",
            titleEn: "Real-Time TAT & \nBottleneck Detection",
            pointsId: [
              "Prediksi waktu tunggu (predictive TAT) otomatis sebelum sampel memasuki antrean analis",
              "Heatmap operasional live per departemen untuk mendeteksi penumpukan tabung seketika",
              "Pemicu alarm dini sebelum spesimen melewati batas SLA rumah sakit yang disepakati",
              "Pelacakan kecepatan alur spesimen per shift guna mengoptimalkan alokasi staf laboratorium",
            ].join("\n"),
            pointsEn: [
              "Predictive turnaround time scoring before specimens enter analyzer queues",
              "Operational real-time heatmaps to instantly pinpoint departmental specimen bottlenecks",
              "Early alert triggers before specimens breach hospital SLA turnaround thresholds",
              "Specimen velocity tracking across shifts to optimize laboratory staffing allocation",
            ].join("\n"),
          },
          {
            id: "analyzer-reagent",
            isActive: true,
            icon: "Cpu",
            titleId: "Beban Instrumen & \nUtilisasi Reagen",
            titleEn: "Analyzer Load & \nReagent Tracking",
            pointsId: [
              "Distribusi otomatis beban kerja sampel antar instrumen medis (dynamic workload balancing)",
              "Pemantauan sisa volume dan laju pemakaian reagen secara real-time untuk mencegah kehabisan",
              "Peringatan dini tanggal kedaluwarsa dan nomor lot reagen guna menihilkan pemborosan (zero wastage)",
              "Penjadwalan otomatis rotasi instrumen dan QC terencana tanpa mengganggu alur tes aktif",
            ].join("\n"),
            pointsEn: [
              "Dynamic workload balancing to distribute specimen tubes across available analyzers",
              "Real-time monitoring of reagent volume and consumption rates to prevent stockouts",
              "Expiration date and lot number alerts to eliminate discarded inventory and operational waste",
              "Scheduled auto-calibration and QC runs without interrupting live diagnostic workflows",
            ].join("\n"),
          },
          {
            id: "nova-ai",
            isActive: true,
            icon: "BarChart3",
            titleId: "Nova AI & \nClinical Intelligence",
            titleEn: "Nova AI & \nClinical Intelligence",
            pointsId: [
              "Komparasi deviasi longitudinal (delta-check) otomatis terhadap riwayat pemeriksaan pasien",
              "Deteksi anomali klinis seketika saat terjadi lonjakan biomarker kritis sebelum rilis hasil",
              "Validasi aturan klinis lintas-parameter untuk mencegah eror dan hasil yang kontradiktif",
              "Rekomendasi kontekstual untuk DPJP dengan otoritas dan kendali diagnosis mutlak pada dokter",
              "Beroperasi dari satu sumber data terpadu (single source of truth) untuk mutu & operasional",
            ].join("\n"),
            pointsEn: [
              "Automated longitudinal delta-checks comparing results against patient historical baselines",
              "Real-time clinical anomaly detection for critical biomarker shifts prior to result release",
              "Cross-parameter clinical rule validation to prevent contradictory or implausible findings",
              "Context-aware clinical recommendations while keeping attending physicians in total command",
              "Operate from a single source of truth across operations, diagnostic quality, and outcomes",
            ].join("\n"),
          },
        ],
      },
    },
    enterprise: {
      fields: {
        supportBadgeId: "Pusat Dukungan Klinis",
        supportBadgeEn: "Clinical Support Command",
        supportTitleId: "Akses dukungan teknis berstandar rumah sakit 24/7/365",
        supportTitleEn: "Access hospital-grade technical support 24/7/365",
        responseLabelId: "Respons Target:",
        responseLabelEn: "Target Response:",
        uptimeLabelId: "Uptime:",
        uptimeLabelEn: "Uptime:",
        uptimeValue: "99.95%",
        activeLabelId: "Aktif",
        activeLabelEn: "Active",
      },
      lists: {
        slaSlots: [
          {
            id: "er-night",
            isActive: true,
            windowId: "00:00 – 08:00",
            windowEn: "00:00 – 08:00",
            shiftId: "Shift Malam IGD",
            shiftEn: "ER Night Shift",
            slaId: "< 10 mnt",
            slaEn: "< 10 mnt",
            detailId: "Monitoring proaktif analyzer CITO & antrean HL7 IGD tanpa jeda.",
            detailEn: "Proactive CITO analyzer & ER HL7 queue monitoring.",
          },
          {
            id: "priority-sla",
            isActive: true,
            windowId: "24 / 7 / 365",
            windowEn: "24 / 7 / 365",
            shiftId: "Prioritas SLA 99.9%",
            shiftEn: "99.9% Priority SLA",
            slaId: "< 15 mnt",
            slaEn: "< 15 mnt",
            detailId: "Akses langsung ke Clinical Integration Engineer untuk insiden kritis.",
            detailEn: "Direct hotline to Clinical Integration Engineers for critical issues.",
          },
          {
            id: "peak-outpatient",
            isActive: true,
            windowId: "08:00 – 20:00",
            windowEn: "08:00 – 20:00",
            shiftId: "Jam Puncak Poliklinik",
            shiftEn: "Peak Outpatient",
            slaId: "Real-Time",
            slaEn: "Real-Time",
            detailId: "Pendampingan on-site & tuning throughput ribuan sampel per jam.",
            detailEn: "Live throughput tuning for thousands of outpatient samples/hour.",
          },
        ],
        cards: [
          {
            id: "ai-roadmap",
            isActive: true,
            titleId: "Peta Jalan AI & Otomatisasi LIS",
            titleEn: "LIS Automation & AI Roadmapping",
            descriptionId:
              "Pembaruan berkala tanpa mengganggu operasional: mulai dari aturan delta-check adaptif hingga analitik utilisasi reagen.",
            descriptionEn:
              "Non-disruptive platform evolution from adaptive delta-check rules to automated reagent consumption forecasting.",
            visual: "roadmap",
            icon: "TrendingUp",
          },
          {
            id: "multi-site",
            isActive: true,
            titleId: "Jaringan Multi-Rumah Sakit & Lab Rujukan",
            titleEn: "Multi-Hospital & Reference Lab Network",
            descriptionId:
              "Hubungkan lab satelit, klinik satelit, dan rumah sakit rujukan dalam satu konsol pemantauan sampel lintas lokasi.",
            descriptionEn:
              "Unify satellite clinics, inpatient wards, and reference labs inside one cross-site sample tracking console.",
            visual: "network",
            icon: "Building2",
          },
        ],
      },
    },
  },
};
