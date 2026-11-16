import type { CmsPageDefinition } from "@/lib/cms/types";

/**
 * Definisi CMS halaman /platform (page_key "platform").
 * Nilai default = copy yang sebelumnya tertulis langsung di app/(marketing)/platform/page.tsx
 * (serta default bawaan WorkflowSection & CTABanner untuk section `workflow` dan `cta`).
 */
export const platformPage = {
  pageKey: "platform",
  sections: {
    hero: {
      label: "Hero",
      content: {
        badge: { id: "Platform Diagnova", en: "Diagnova Platform" },
        title: {
          id: "Platform Terpadu Pengelolaan \nAlur Kerja Laboratorium Modern",
          en: "One Connected Platform to Manage \nModern Laboratory Workflows",
        },
        subtitle: {
          id: "Menghubungkan instrumen analyzer, analis medis, dokter patologi, dan SIMRS/RME ke dalam satu alur kerja digital yang presisi, bebas salah sampel, dan terpantau secara real-time.",
          en: "Connecting medical analyzers, laboratory analysts, pathologists, and hospital HIS/EMR into a unified digital pipeline that is precise, error-free, and monitored in real-time.",
        },
        primaryCta: {
          text: { id: "Jadwalkan Demo Platform", en: "Schedule Platform Demo" },
          href: "/request-demo",
        },
        secondaryCta: {
          text: { id: "Pelajari Alur Kerja", en: "Explore Workflow" },
          href: "#workflow",
        },
        metrics: [
          {
            id: "tat",
            value: "-70%",
            label: { id: "Pangkas TAT", en: "Cut Turnaround Time" },
            sub: { id: "Dari order ke klinisi", en: "Order to clinician" },
          },
          {
            id: "interfacing",
            value: "100%",
            label: { id: "Otomasi Interfacing", en: "Direct Interfacing" },
            sub: { id: "Eliminasi entri manual", en: "Zero manual entry" },
          },
          {
            id: "sample-error",
            value: "0 Error",
            label: { id: "Salah Sampel", en: "Sample Mix-ups" },
            sub: { id: "Verifikasi barcode 2D", en: "2D barcode check" },
          },
          {
            id: "iso",
            value: "ISO 15189",
            label: { id: "Kepatuhan Audit", en: "Audit Compliance" },
            sub: { id: "KARS & JCI compliant", en: "KARS & JCI compliant" },
          },
        ],
      },
    },

    workflow: {
      label: "Alur Kerja (#workflow)",
      content: {
        badge: { id: "Alur Kerja", en: "How It Works" },
        title: {
          id: "Bagaimana Diagnova Memandu Setiap Tetes Sampel",
          en: "How Diagnova Guides a Drop of Blood",
        },
        subtitle: {
          id: "Pantau perjalanan spesimen laboratorium dengan transparansi penuh, dari registrasi hingga rilis hasil.",
          en: "Monitor the specimen's journey with full visibility, from sample collection to physician release.",
        },
        // Posisi, ikon, dan visual setiap langkah tetap di komponen WorkflowSection (dipetakan per urutan, maks. 4 langkah).
        steps: [
          {
            id: "step-1",
            title: { id: "Penerimaan & Pelabelan Cerdas", en: "Smart Reception & Labeling" },
            shortTitle: { id: "Penerimaan Barcode", en: "Smart Reception" },
            description: {
              id: "Setiap tabung spesimen menerima barcode unik, memastikan tidak ada sampel tertukar di laboratorium.",
              en: "Each sample tube receives a unique barcode, ensuring no specimens are mixed up in the laboratory.",
            },
          },
          {
            id: "step-2",
            title: { id: "Verifikasi Otomatis", en: "Auto-Verification" },
            shortTitle: { id: "Otomasi Analyzer", en: "Auto-Verification" },
            description: {
              id: "Setelah diproses analyzer, Diagnova menyimpan seluruh angka hasil uji secara langsung tanpa ketik ulang manual.",
              en: "After instrument processing, Diagnova saves all test results in real-time without the need for manual retyping.",
            },
          },
          {
            id: "step-3",
            title: { id: "Deteksi Dini & Pengecekan Delta", en: "Early Detection & Delta Checks" },
            shortTitle: { id: "Delta Check", en: "Delta Checks" },
            description: {
              id: "Jika terdeteksi nilai kritis atau deviasi drastis, sistem otomatis memicu peringatan seketika bagi dokter dan analis.",
              en: "If abnormal numbers are detected, the system automatically triggers an alert so analysts and doctors can act quickly.",
            },
          },
          {
            id: "step-4",
            title: { id: "Hasil Akurat Siap Rilis", en: "Accurate Results Ready" },
            shortTitle: { id: "Validasi & Rilis", en: "Results Release" },
            description: {
              id: "Hasil laboratorium yang telah tervalidasi langsung terkirim ke dokter dan tersinkronisasi mulus ke RME rumah sakit.",
              en: "Validated laboratory results are instantly delivered to the doctor and seamlessly integrated with the hospital's EMR.",
            },
          },
        ],
      },
    },

    automation: {
      label: "Otomatisasi & Interfacing (#automation)",
      content: {
        badge: { id: "Otomatisasi 100%", en: "100% Automation" },
        title: {
          id: "Interfacing Dua Arah dengan 500+ Instrumen Medis",
          en: "Direct Bidirectional Interfacing with 500+ Medical Analyzers",
        },
        subtitle: {
          id: "Mengeliminasi entri data manual sepenuhnya. Diagnova berkomunikasi langsung dua arah dengan instrumen laboratorium melalui protokol HL7 dan ASTM standar internasional.",
          en: "Completely eliminate manual data entry. Diagnova establishes native two-way communication with any laboratory instrument brand via industry-standard HL7 and ASTM protocols.",
        },
        // `visual`: "telemetry" | "autoVerification" | "edgeBuffer" (ilustrasi kartu; nilai lain -> "telemetry").
        cards: [
          {
            id: "tat",
            visual: "telemetry",
            title: { id: "Pangkas TAT Hingga 70%", en: "Cut Turnaround Time by 70%" },
            desc: {
              id: "Hasil uji hematologi, kimia, dan urin mengalir langsung ke layar dokter tanpa antrean ketik manual oleh analis.",
              en: "Analyzer telemetry streams directly to clinical screens with zero manual transcription.",
            },
          },
          {
            id: "auto-verification",
            visual: "autoVerification",
            title: { id: "Auto-Verification Engine", en: "Auto-Verification Engine" },
            desc: {
              id: "Rule engine otomatis memverifikasi sampel normal, membebaskan dokter untuk fokus pada kasus anomali kritis.",
              en: "Automated rules instantly release normal specimens, keeping physicians focused on critical anomalies.",
            },
          },
          {
            id: "edge-buffer",
            visual: "edgeBuffer",
            title: { id: "Resilient Edge Buffer", en: "Resilient Edge Buffer" },
            desc: {
              id: "Jaringan RS drop? Buffer lokal mengamankan data analyzer dan menyinkronkan otomatis saat koneksi pulih.",
              en: "Hospital network down? Edge buffers store transmissions and auto-resync upon reconnection.",
            },
          },
        ],
        telemetryVisual: {
          instrument: "Sysmex XN",
          host: "LIS Host",
          manualLabel: { id: "8 mnt manual", en: "8 min manual" },
          ingestedLabel: { id: "0.04d Masuk", en: "0.04s Ingested" },
          params: [
            { id: "wbc", text: "WBC 7.42" },
            { id: "hgb", text: "HGB 14.1" },
            { id: "plt", text: "PLT 245" },
          ],
        },
        autoVerificationVisual: {
          specimenLabel: { id: "Spesimen #DX-889", en: "Specimen #DX-889" },
          specimenStatus: "Delta OK",
          releaseLabel: { id: "Rilis Otomatis", en: "Auto-Release" },
          releaseStat: { id: "85% SOP Normal", en: "85% Normal SOP" },
          triageLabel: { id: "Triase Dokter", en: "Doctor Triage" },
          triageStat: { id: "15% Risiko Kritis", en: "15% Critical Risk" },
        },
        edgeBufferVisual: {
          gatewayLabel: "Edge Gateway",
          retentionLabel: { id: "Retensi 72J Aman", en: "72H Retention Safe" },
          queueLabel: { id: "Antrean: 0 Paket", en: "Pending: 0 Packets" },
          zeroLossLabel: { id: "Nol Data Hilang", en: "Zero Data Loss" },
        },
      },
    },

    reporting: {
      label: "Audit Trail & Pelaporan (#reporting)",
      content: {
        badge: { id: "Kepatuhan & Akreditasi", en: "Compliance & Accreditation" },
        title: {
          id: "Jejak Audit Digital Permanen,\nStandar KARS & ISO 15189",
          en: "Permanent Digital Audit Trail,\nKARS & ISO 15189 Ready",
        },
        subtitle: {
          id: "Transparansi penuh untuk setiap tindakan laboratorium. Setiap perubahan hasil, kalibrasi alat, dan approval dokter tercatat permanen dengan cap waktu (timestamp) hingga milidetik.",
          en: "Absolute transparency for every clinical action. Every result change, instrument calibration, and physician sign-off is permanently recorded with millisecond-level timestamps.",
        },
        features: [
          {
            id: "tamper-proof",
            iconName: "Lock",
            title: { id: "Log Anti-Manipulasi", en: "Tamper-Proof Logs" },
            desc: {
              id: "Catatan historis tidak dapat diedit atau dihapus, memenuhi persyaratan akreditasi KARS & JCI.",
              en: "Historical entries cannot be altered or purged, satisfying KARS & JCI accreditation criteria.",
            },
          },
          {
            id: "e-signature",
            iconName: "FileCheck2",
            title: { id: "E-Sign Dokter Bersertifikat", en: "Certified E-Signatures" },
            desc: {
              id: "Tanda tangan digital dokter Sp.PK dengan QR verifikasi keaslian langsung pada lembar hasil.",
              en: "Certified pathologist e-signatures with instant QR-code verification on patient reports.",
            },
          },
        ],
        // Teks ilustrasi layar LIS (mockup monitor).
        mockup: {
          orderLabel: "#DX-98214 — Darah Lengkap",
          ingestStatus: "SYS-XN: INGESTED",
          patientInitials: "DL",
          patientName: "Bpk. Suryadi (54 Th / L)",
          priorityBadge: "CITO / IGD",
          patientMeta: "No. RM: #44912 • DPJP: Dr. dr. Handoko, Sp.PK",
          tatLabel: "TAT: 19m (Goal < 60m)",
          headerParameter: { id: "Parameter Analit", en: "Analyte Parameter" },
          headerResult: { id: "Hasil Uji", en: "Result" },
          headerReference: { id: "Nilai Rujukan", en: "Ref" },
          headerStatus: "Status",
          rows: [
            {
              id: "hb",
              name: "Hemoglobin (Hb)",
              source: "Sysmex XN-1000 • ASTM",
              value: "14.2",
              unit: "g/dL",
              range: "13.5 - 17.5",
              status: "NORMAL",
            },
            {
              id: "wbc",
              name: "Leukosit (WBC)",
              source: "Sysmex XN-1000 • ASTM",
              value: "7.400",
              unit: "/µL",
              range: "4.000 - 10k",
              status: "NORMAL",
            },
            {
              id: "plt",
              name: "Trombosit (PLT)",
              source: "Sysmex XN-1000 • ASTM",
              value: "245.000",
              unit: "/µL",
              range: "150k - 450k",
              status: "NORMAL",
            },
          ],
          signerName: "Dr. dr. Handoko, Sp.PK",
          signTime: "08:14 WIB",
          signCertification: "BSrE BSSN Certified (Sah Regulasi)",
          fhirBadge: "SATUSEHAT FHIR",
          hashLabel: "SHA-256: e3b0c44298fc1c... (Anti-Manipulasi)",
          complianceLabel: "KARS SKP 2.2 Ready",
        },
        floatingCard: {
          title: { id: "Kepatuhan KARS & ISO", en: "KARS & ISO Ready" },
          subtitle: "100% Tamper-Proof",
          desc: {
            id: "Setiap analit terkunci permanen dengan e-sign dokter berkeabsahan hukum penuh via BSrE BSSN.",
            en: "Every analyte is cryptographically locked with legally accredited pathologist signatures via BSrE.",
          },
        },
      },
    },

    analytics: {
      label: "Nova AI & Analitik (#analytics)",
      content: {
        badge: { id: "Nova AI & Analitik", en: "Nova AI & Analytics" },
        title: {
          id: "Wawasan Operasional & Asisten Klinis Nova AI",
          en: "Operational Insights & Nova AI Clinical Intelligence",
        },
        subtitle: {
          id: "Mengubah jutaan titik data pemeriksaan laboratorium menjadi wawasan strategis. Memantau utilisasi instrumen, efisiensi reagen, dan membantu dokter mendeteksi lonjakan biomarker kritis.",
          en: "Transforming millions of laboratory data points into actionable intelligence. Monitor analyzer utilization, reagent efficiency, and empower clinicians with rapid anomaly detection.",
        },
        cards: [
          {
            id: "tat-bottleneck",
            iconName: "Clock",
            title: {
              id: "TAT Real-Time & \nDeteksi Bottleneck",
              en: "Real-Time TAT & \nBottleneck Detection",
            },
            bullets: [
              {
                id: "b-1",
                text: {
                  id: "Prediksi waktu tunggu (predictive TAT) otomatis sebelum sampel memasuki antrean analis",
                  en: "Predictive turnaround time scoring before specimens enter analyzer queues",
                },
              },
              {
                id: "b-2",
                text: {
                  id: "Heatmap operasional live per departemen untuk mendeteksi penumpukan tabung seketika",
                  en: "Operational real-time heatmaps to instantly pinpoint departmental specimen bottlenecks",
                },
              },
              {
                id: "b-3",
                text: {
                  id: "Pemicu alarm dini sebelum spesimen melewati batas SLA rumah sakit yang disepakati",
                  en: "Early alert triggers before specimens breach hospital SLA turnaround thresholds",
                },
              },
              {
                id: "b-4",
                text: {
                  id: "Pelacakan kecepatan alur spesimen per shift guna mengoptimalkan alokasi staf laboratorium",
                  en: "Specimen velocity tracking across shifts to optimize laboratory staffing allocation",
                },
              },
            ],
          },
          {
            id: "analyzer-reagent",
            iconName: "Cpu",
            title: {
              id: "Beban Instrumen & \nUtilisasi Reagen",
              en: "Analyzer Load & \nReagent Tracking",
            },
            bullets: [
              {
                id: "b-1",
                text: {
                  id: "Distribusi otomatis beban kerja sampel antar instrumen medis (dynamic workload balancing)",
                  en: "Dynamic workload balancing to distribute specimen tubes across available analyzers",
                },
              },
              {
                id: "b-2",
                text: {
                  id: "Pemantauan sisa volume dan laju pemakaian reagen secara real-time untuk mencegah kehabisan",
                  en: "Real-time monitoring of reagent volume and consumption rates to prevent stockouts",
                },
              },
              {
                id: "b-3",
                text: {
                  id: "Peringatan dini tanggal kedaluwarsa dan nomor lot reagen guna menihilkan pemborosan (zero wastage)",
                  en: "Expiration date and lot number alerts to eliminate discarded inventory and operational waste",
                },
              },
              {
                id: "b-4",
                text: {
                  id: "Penjadwalan otomatis rotasi instrumen dan QC terencana tanpa mengganggu alur tes aktif",
                  en: "Scheduled auto-calibration and QC runs without interrupting live diagnostic workflows",
                },
              },
            ],
          },
          {
            id: "nova-ai",
            iconName: "BarChart3",
            title: {
              id: "Nova AI & \nClinical Intelligence",
              en: "Nova AI & \nClinical Intelligence",
            },
            bullets: [
              {
                id: "b-1",
                text: {
                  id: "Komparasi deviasi longitudinal (delta-check) otomatis terhadap riwayat pemeriksaan pasien",
                  en: "Automated longitudinal delta-checks comparing results against patient historical baselines",
                },
              },
              {
                id: "b-2",
                text: {
                  id: "Deteksi anomali klinis seketika saat terjadi lonjakan biomarker kritis sebelum rilis hasil",
                  en: "Real-time clinical anomaly detection for critical biomarker shifts prior to result release",
                },
              },
              {
                id: "b-3",
                text: {
                  id: "Validasi aturan klinis lintas-parameter untuk mencegah eror dan hasil yang kontradiktif",
                  en: "Cross-parameter clinical rule validation to prevent contradictory or implausible findings",
                },
              },
              {
                id: "b-4",
                text: {
                  id: "Rekomendasi kontekstual untuk DPJP dengan otoritas dan kendali diagnosis mutlak pada dokter",
                  en: "Context-aware clinical recommendations while keeping attending physicians in total command",
                },
              },
              {
                id: "b-5",
                text: {
                  id: "Beroperasi dari satu sumber data terpadu (single source of truth) untuk mutu & operasional",
                  en: "Operate from a single source of truth across operations, diagnostic quality, and outcomes",
                },
              },
            ],
          },
        ],
      },
    },

    reliability: {
      label: "Dukungan 24/7, Roadmap & Jaringan Multi-Unit",
      content: {
        badge: { id: "Keandalan Enterprise", en: "Enterprise Reliability" },
        title: {
          id: "Dukungan 24/7, Peta Jalan AI & Jaringan Multi-Unit",
          en: "24/7 Support SLA, AI Roadmap & Multi-Site Network",
        },
        subtitle: {
          id: "Dirancang untuk operasional laboratorium rumah sakit yang tidak pernah berhenti—lengkap dengan eskalasi teknis instan dan sinkronisasi lintas cabang.",
          en: "Engineered for non-stop hospital diagnostics with instant engineering escalation and unified multi-branch synchronization.",
        },
        support: {
          badge: { id: "Pusat Dukungan Klinis", en: "Clinical Support Command" },
          title: {
            id: "Akses dukungan teknis berstandar rumah sakit 24/7/365",
            en: "Access hospital-grade technical support 24/7/365",
          },
          targetResponseLabel: { id: "Respons Target:", en: "Target Response:" },
          uptimeLabel: { id: "Uptime:", en: "Uptime:" },
          uptimeValue: "99.95%",
          activeLabel: { id: "Aktif", en: "Active" },
          // Slot ke-2 (indeks 1) terpilih saat halaman dibuka.
          slots: [
            {
              id: "night-shift",
              window: "00:00 – 08:00",
              shift: { id: "Shift Malam IGD", en: "ER Night Shift" },
              sla: "< 10 mnt",
              detail: {
                id: "Monitoring proaktif analyzer CITO & antrean HL7 IGD tanpa jeda.",
                en: "Proactive CITO analyzer & ER HL7 queue monitoring.",
              },
            },
            {
              id: "priority-sla",
              window: "24 / 7 / 365",
              shift: { id: "Prioritas SLA 99.9%", en: "99.9% Priority SLA" },
              sla: "< 15 mnt",
              detail: {
                id: "Akses langsung ke Clinical Integration Engineer untuk insiden kritis.",
                en: "Direct hotline to Clinical Integration Engineers for critical issues.",
              },
            },
            {
              id: "peak-outpatient",
              window: "08:00 – 20:00",
              shift: { id: "Jam Puncak Poliklinik", en: "Peak Outpatient" },
              sla: "Real-Time",
              detail: {
                id: "Pendampingan on-site & tuning throughput ribuan sampel per jam.",
                en: "Live throughput tuning for thousands of outpatient samples/hour.",
              },
            },
          ],
        },
        roadmap: {
          topPill: { id: "Auto-Bridging HL7", en: "HL7 Auto-Bridging" },
          bottomPill: { id: "Otomatisasi Nova AI", en: "Nova AI Automations" },
          title: { id: "Peta Jalan AI & Otomatisasi LIS", en: "LIS Automation & AI Roadmapping" },
          desc: {
            id: "Pembaruan berkala tanpa mengganggu operasional: mulai dari aturan delta-check adaptif hingga analitik utilisasi reagen.",
            en: "Non-disruptive platform evolution from adaptive delta-check rules to automated reagent consumption forecasting.",
          },
        },
        network: {
          hubBrand: "Diagnova",
          hubLabel: { id: "Hub Pusat", en: "Core Hub" },
          // Posisi node mengikuti urutan (atas, kanan, bawah, kiri); maksimal 4 node agar tidak bertumpuk.
          nodes: [
            { id: "igd", label: "IGD" },
            { id: "pa", label: "PA" },
            { id: "bdrs", label: "BDRS" },
            { id: "satu", label: "SATU" },
          ],
          title: {
            id: "Jaringan Multi-Rumah Sakit & Lab Rujukan",
            en: "Multi-Hospital & Reference Lab Network",
          },
          desc: {
            id: "Hubungkan lab satelit, klinik satelit, dan rumah sakit rujukan dalam satu konsol pemantauan sampel lintas lokasi.",
            en: "Unify satellite clinics, inpatient wards, and reference labs inside one cross-site sample tracking console.",
          },
        },
      },
    },

    cta: {
      label: "CTA Banner",
      content: {
        title: {
          id: "Transformasi Laboratorium Anda Bersama Diagnova",
          en: "Transform Your Laboratory with Diagnova",
        },
        subtitle: {
          id: "Hadirkan keandalan tinggi, kecepatan analisis, dan presisi klinis bagi institusi kesehatan Anda hari ini.",
          en: "Bring high reliability, speed, and precision to your healthcare institution today.",
        },
        buttonText: { id: "Minta Demo", en: "Request Demo" },
        placeholder: { id: "Masukkan alamat email Anda", en: "Enter your email address" },
      },
    },
  },
} satisfies CmsPageDefinition;
