import type { CmsPageDefinition } from "@/lib/cms/types";

// Definisi + konten default halaman Integration (/integration) dan halaman detail (/integration/[slug]).
// Section `integrations` memuat daftar integrasi: dipakai explorer di halaman utama (data `explorer` per item)
// dan halaman detail /integration/<slug> (data `detail` per item).
export const integrationPage = {
  pageKey: "integration",
  sections: {
    hero: {
      label: "Hero",
      content: {
        badge: { id: "Interoperabilitas Laboratorium", en: "Laboratory Interoperability Suite" },
        title: {
          id: "Terhubung Mulus dengan \nEkosistem RS & 500+ Mesin Lab",
          en: "Seamless Connectivity with \nHospital IT & 500+ Medical Analyzers",
        },
        subtitle: {
          id: "Konektivitas siap pakai yang aman dan patuh regulasi: bridging dua arah SIMRS/HIS, RME Permenkes 24/2022, SATUSEHAT Kemenkes, 500+ analyzer otomatis, dan gateway buffer offline.",
          en: "Turnkey, regulatory-compliant interoperability: bidirectional HIS bridging, EMR Permenkes 24/2022, MoH SATUSEHAT HL7 FHIR, direct 500+ analyzer interfacing, and offline edge buffer.",
        },
        primaryCta: {
          text: { id: "Jadwalkan Konsultasi Integrasi", en: "Schedule Integration Consultation" },
          href: "/request-demo",
        },
        secondaryCta: {
          text: { id: "Eksplorasi Alur Integrasi", en: "Explore Integration Flow" },
          href: "#integration-explorer",
        },
        metrics: [
          {
            id: "m-1",
            value: { id: "500+ Mesin", en: "500+ Analyzers" },
            label: { id: "Analyzer Teruji", en: "Supported Analyzers" },
            sub: { id: "Roche, Sysmex, Abbott, Mindray", en: "Roche, Sysmex, Abbott, Mindray" },
          },
          {
            id: "m-2",
            value: { id: "HL7 & FHIR", en: "HL7 & FHIR" },
            label: { id: "Standar Kemenkes RI", en: "National Health Standard" },
            sub: { id: "SATUSEHAT & Permenkes 24/2022", en: "SATUSEHAT & Permenkes 24/2022" },
          },
          {
            id: "m-3",
            value: { id: "0 Double Entry", en: "0 Double Entry" },
            label: { id: "Bridging SIMRS Dua Arah", en: "Bidirectional HIS Bridging" },
            sub: { id: "Order & billing otomatis realtime", en: "Real-time automatic order & billing" },
          },
          {
            id: "m-4",
            value: { id: "72 Jam", en: "72 Hours" },
            label: { id: "Buffer Offline Edge", en: "Offline Resilient Edge" },
            sub: { id: "Zero data loss saat jaringan putus", en: "Zero data loss during downtime" },
          },
        ],
      },
    },
    explorer: {
      label: "Explorer Arsitektur Interoperabilitas",
      content: {
        badge: { id: "Arsitektur Interoperabilitas", en: "Interoperability Architecture" },
        title: {
          id: "Satu Hub Terpadu untuk Seluruh Ekosistem Data Medis",
          en: "One Unified Hub for Your Entire Clinical Data Ecosystem",
        },
        description: {
          id: "Klik simpul mana saja pada diagram untuk memeriksa alur otomatisasi dan protokolnya.",
          en: "Select any node on the diagram to inspect its live automation flow and protocols.",
        },
        autoTourLabel: { id: "Putar Tur Otomatis", en: "Auto-Tour" },
        pauseTourLabel: { id: "Jeda Tur", en: "Pause Tour" },
        activeLabel: { id: "Active", en: "Active" },
        inspectLabel: { id: "Inspect", en: "Inspect" },
        hub: {
          name: { id: "Diagnova Hub", en: "Diagnova Hub" },
          liveLabel: { id: "Live", en: "Live" },
          stat1Label: { id: "Analyzers", en: "Analyzers" },
          stat1Value: "500+",
          stat2Label: { id: "Uptime SLA", en: "Uptime SLA" },
          stat2Value: "99.9%",
        },
        consultLabel: { id: "Konsultasi", en: "Consult" },
        consultHref: "/request-demo",
        breadcrumbPrefix: { id: "Automations /", en: "Automations /" },
        pipelineLabel: { id: "Live Pipeline", en: "Live Pipeline" },
        statusCompletedLabel: { id: "✓ Completed", en: "✓ Completed" },
        statusRunningLabel: { id: "● Running", en: "● Running" },
      },
    },
    integrations: {
      label: "Daftar Integrasi (Explorer & Halaman Detail)",
      content: {
        // Urutan = urutan siklus explorer. `side` = kolom simpul di diagram ("left" | "right").
        // `slug` = URL halaman detail /integration/<slug>; `id` = anchor #id di halaman utama.
        items: [
          {
            id: "simrs-his",
            slug: "simrs-his",
            iconName: "Network",
            side: "right",
            tabLabel: { id: "SIMRS / HIS", en: "SIMRS / HIS" },
            shortDesc: { id: "Order & Billing 2 Arah", en: "Bidirectional Order & Billing" },
            name: { id: "SIMRS / HIS Bridging", en: "SIMRS / HIS Bridging" },
            tagline: {
              id: "Order dokter langsung jadi barcode worklist, hasil & billing sinkron otomatis.",
              en: "Physician orders instantly become barcode worklists with automated billing sync.",
            },
            protocols: [
              { id: "p-1", label: "HL7 v2.x" },
              { id: "p-2", label: "REST JSON" },
              { id: "p-3", label: "SOAP / XML" },
            ],
            metrics: [
              { id: "m-1", val: "0", label: { id: "Entri Ulang", en: "Re-Entry" } },
              { id: "m-2", val: "< 250ms", label: { id: "Latensi", en: "Latency" } },
            ],
            workflowSteps: [
              {
                id: "s-1",
                tag: { id: "Pemicu", en: "Trigger" },
                status: "Completed",
                title: { id: "Order Poli / IGD Masuk (ORM^O01)", en: "ER / Clinic Order Received (ORM^O01)" },
                desc: {
                  id: "Demografi pasien & parameter tes ditarik otomatis",
                  en: "Patient demographics & test orders ingested automatically",
                },
                chip: "SIMRS",
              },
              {
                id: "s-2",
                tag: { id: "Proses", en: "Process" },
                status: "Completed",
                title: { id: "Cetak Barcode & Kunci Billing", en: "Generate Barcode & Lock Billing" },
                desc: {
                  id: "Status klaim BPJS/asuransi tervalidasi real-time",
                  en: "Insurance & BPJS charge capture validated in real time",
                },
                chip: "DFT^P03",
              },
              {
                id: "s-3",
                tag: { id: "Rilis", en: "Dispatch" },
                status: "Running",
                title: { id: "Kirim Hasil Terverifikasi ke EMR", en: "Post Verified Result to EMR" },
                desc: {
                  id: "Laporan masuk ke layar DPJP tanpa ketik ulang",
                  en: "Structured report lands directly on physician screen",
                },
                chip: "ORU^R01",
              },
            ],
            // Halaman detail /integration/simrs-his
            detail: {
              name: { id: "SIMRS / HIS Integration", en: "SIMRS / HIS Integration" },
              tagline: { id: "Bridging Mulus Dua Arah dengan Sistem Informasi Rumah Sakit", en: "Bridging Mulus Dua Arah dengan Sistem Informasi Rumah Sakit" },
              shortDesc: { id: "Pertukaran data otomatis untuk pendaftaran pasien, order lab dari dokter, billing terintegrasi, dan pengiriman hasil ke SIMRS tanpa entri ganda.", en: "Pertukaran data otomatis untuk pendaftaran pasien, order lab dari dokter, billing terintegrasi, dan pengiriman hasil ke SIMRS tanpa entri ganda." },
              description: { id: "Diagnova menyediakan konektor native yang kompatibel dengan berbagai vendor SIMRS lokal maupun internasional di Indonesia. Begitu dokter memasukkan order lab di SIMRS, Diagnova langsung menerima data pasien dan tes yang diminta, mencetak label barcode, dan mengembalikan hasil yang telah diverifikasi ke rekam medis pasien di SIMRS secara instan.", en: "Diagnova menyediakan konektor native yang kompatibel dengan berbagai vendor SIMRS lokal maupun internasional di Indonesia. Begitu dokter memasukkan order lab di SIMRS, Diagnova langsung menerima data pasien dan tes yang diminta, mencetak label barcode, dan mengembalikan hasil yang telah diverifikasi ke rekam medis pasien di SIMRS secara instan." },
              protocols: [
                { id: "dp-1", label: "RESTful API / JSON" },
                { id: "dp-2", label: "HL7 v2.x / v3" },
                { id: "dp-3", label: "Webservices / SOAP" },
                { id: "dp-4", label: "Direct DB Linking" },
              ],
              highlights: [
                { id: "h-1", text: { id: "Zero double entry untuk pendaftaran pasien dan permintaan tes lab", en: "Zero double entry untuk pendaftaran pasien dan permintaan tes lab" } },
                { id: "h-2", text: { id: "Sinkronisasi status billing otomatis untuk mencegah pemeriksaan belum terbayar", en: "Sinkronisasi status billing otomatis untuk mencegah pemeriksaan belum terbayar" } },
                { id: "h-3", text: { id: "Dukungan multi-ruangan (Rawat Inap, Rawat Jalan, IGD, ICU, Kamar Operasi)", en: "Dukungan multi-ruangan (Rawat Inap, Rawat Jalan, IGD, ICU, Kamar Operasi)" } },
                { id: "h-4", text: { id: "SLA bridging tinggi dengan mekanisme antrean transaksi berbasis buffer", en: "SLA bridging tinggi dengan mekanisme antrean transaksi berbasis buffer" } },
              ],
              capabilities: [
                { id: "c-1", text: { id: "Patient Demographic Ingestion (ADT messages)", en: "Patient Demographic Ingestion (ADT messages)" } },
                { id: "c-2", text: { id: "Lab Order Receipt (ORM messages)", en: "Lab Order Receipt (ORM messages)" } },
                { id: "c-3", text: { id: "Real-time Result Return (ORU messages)", en: "Real-time Result Return (ORU messages)" } },
                { id: "c-4", text: { id: "Billing & Charge Posting Synchronization", en: "Billing & Charge Posting Synchronization" } },
              ],
            },
          },
          {
            id: "rme",
            slug: "rme",
            iconName: "FileText",
            side: "right",
            tabLabel: { id: "Rekam Medis (RME)", en: "EMR Integration" },
            shortDesc: { id: "Permenkes 24/2022", en: "EMR & Biomarker Trends" },
            name: { id: "Rekam Medis Elektronik (RME)", en: "Rekam Medis Elektronik (RME)" },
            tagline: {
              id: "Data laboratorium terstruktur LOINC lengkap dengan tren biomarker & segel BSrE.",
              en: "LOINC-structured lab observations with longitudinal biomarker trends & BSrE seal.",
            },
            protocols: [
              { id: "p-1", label: "FHIR R4" },
              { id: "p-2", label: "LOINC" },
              { id: "p-3", label: "HL7 CDA" },
            ],
            metrics: [
              { id: "m-1", val: "100%", label: { id: "PMK 24/2022", en: "PMK 24/2022" } },
              { id: "m-2", val: "< 15m", label: { id: "Panic SLA", en: "Panic SLA" } },
            ],
            workflowSteps: [
              {
                id: "s-1",
                tag: { id: "Pemicu", en: "Trigger" },
                status: "Completed",
                title: { id: "Validasi Sp.PK & Segel BSrE", en: "Pathologist Sign-Off & BSrE Seal" },
                desc: {
                  id: "Hasil disahkan dengan tanda tangan elektronik SHA-256",
                  en: "Results sealed with accredited cryptographic e-signature",
                },
                chip: "BSrE",
              },
              {
                id: "s-2",
                tag: { id: "Proses", en: "Process" },
                status: "Completed",
                title: { id: "Kalkulasi Tren Longitudinal", en: "Compute Longitudinal Trends" },
                desc: {
                  id: "Bandingkan Kreatinin & HbA1c lintas kunjungan",
                  en: "Compare Creatinine & HbA1c across encounters",
                },
                chip: "LOINC",
              },
              {
                id: "s-3",
                tag: { id: "Rilis", en: "Dispatch" },
                status: "Running",
                title: { id: "Render DiagnosticReport di RME", en: "Render DiagnosticReport in EMR" },
                desc: {
                  id: "Dokter melihat grafik tren & peringatan nilai kritis",
                  en: "Physician views trend charts & critical alerts",
                },
                chip: "FHIR R4",
              },
            ],
            // Halaman detail /integration/rme
            detail: {
              name: { id: "Rekam Medis Elektronik (RME)", en: "Rekam Medis Elektronik (RME)" },
              tagline: { id: "Kepatuhan Mandatori RME dengan Integrasi Data Klinis Lengkap", en: "Kepatuhan Mandatori RME dengan Integrasi Data Klinis Lengkap" },
              shortDesc: { id: "Mengintegrasikan data hasil laboratorium terstruktur dan laporan patologi langsung ke modul RME dokter dan perawat.", en: "Mengintegrasikan data hasil laboratorium terstruktur dan laporan patologi langsung ke modul RME dokter dan perawat." },
              description: { id: "Mendukung amanat Permenkes No. 24 Tahun 2022 mengenai kewajiban Rekam Medis Elektronik. Diagnova menyajikan data hasil tes dalam format terstruktur yang memudahkan dokter melihat riwayat grafik perkembangan laboratorium pasien secara longitudinal di layar RME mereka.", en: "Mendukung amanat Permenkes No. 24 Tahun 2022 mengenai kewajiban Rekam Medis Elektronik. Diagnova menyajikan data hasil tes dalam format terstruktur yang memudahkan dokter melihat riwayat grafik perkembangan laboratorium pasien secara longitudinal di layar RME mereka." },
              protocols: [
                { id: "dp-1", label: "FHIR R4 DiagnosticReport" },
                { id: "dp-2", label: "JSON REST API" },
                { id: "dp-3", label: "HL7 CDA" },
                { id: "dp-4", label: "PDF Embed" },
              ],
              highlights: [
                { id: "h-1", text: { id: "Format data terstandarisasi LOINC untuk setiap parameter pemeriksaan", en: "Format data terstandarisasi LOINC untuk setiap parameter pemeriksaan" } },
                { id: "h-2", text: { id: "Grafik tren biomarker historis pasien langsung dapat diakses di RME", en: "Grafik tren biomarker historis pasien langsung dapat diakses di RME" } },
                { id: "h-3", text: { id: "Penanda visual nilai kritis (panic value) langsung menyala di dashboard RME DPJP", en: "Penanda visual nilai kritis (panic value) langsung menyala di dashboard RME DPJP" } },
                { id: "h-4", text: { id: "Tanda tangan elektronik tersertifikasi (Digital Signature) pada lembar hasil", en: "Tanda tangan elektronik tersertifikasi (Digital Signature) pada lembar hasil" } },
              ],
              capabilities: [
                { id: "c-1", text: { id: "Diagnostic Report Resource Integration", en: "Diagnostic Report Resource Integration" } },
                { id: "c-2", text: { id: "Observation Resource Mapping", en: "Observation Resource Mapping" } },
                { id: "c-3", text: { id: "Historical Laboratory Trends Visualization", en: "Historical Laboratory Trends Visualization" } },
                { id: "c-4", text: { id: "Doctor E-Sign & Stamp Validation", en: "Doctor E-Sign & Stamp Validation" } },
              ],
            },
          },
          {
            id: "analyzer",
            slug: "analyzer",
            iconName: "Cpu",
            side: "left",
            tabLabel: { id: "Direct Analyzer", en: "Direct Analyzer" },
            shortDesc: { id: "500+ Mesin Lab", en: "500+ Lab Instruments" },
            name: { id: "Direct Analyzer Interfacing", en: "Direct Analyzer Interfacing" },
            tagline: {
              id: "Host Query dua arah untuk 500+ model analyzer dengan gerbang QC Westgard.",
              en: "Bidirectional Host Query for 500+ analyzers gated by automated Westgard QC.",
            },
            protocols: [
              { id: "p-1", label: "ASTM E1394" },
              { id: "p-2", label: "HL7 v2.5" },
              { id: "p-3", label: "RS-232 / LAN" },
            ],
            metrics: [
              { id: "m-1", val: "500+", label: { id: "Model Alat", en: "Analyzers" } },
              { id: "m-2", val: "0s", label: { id: "Ketik Hasil", en: "Manual Entry" } },
            ],
            workflowSteps: [
              {
                id: "s-1",
                tag: { id: "Pemicu", en: "Trigger" },
                status: "Completed",
                title: { id: "Tabung Barcode Masuk Rak Alat", en: "Barcoded Tube Hits Analyzer Rack" },
                desc: {
                  id: "Sysmex XN-1000 / Cobas c501 melakukan Host Query",
                  en: "Sysmex XN-1000 / Cobas c501 initiates Host Query",
                },
                chip: "ASTM",
              },
              {
                id: "s-2",
                tag: { id: "Proses", en: "Process" },
                status: "Completed",
                title: { id: "Gerbang Kontrol Kualitas Westgard", en: "Westgard Quality Control Gate" },
                desc: {
                  id: "Memastikan QC harian lolos sebelum baca sampel",
                  en: "Ensures daily QC passes before processing specimen",
                },
                chip: "QC PASS",
              },
              {
                id: "s-3",
                tag: { id: "Rilis", en: "Dispatch" },
                status: "Running",
                title: { id: "Ingesti Hasil & Flag Otomatis", en: "Auto-Ingest Results & Flags" },
                desc: {
                  id: "Flag clot/hemolisis langsung ditandai di worklist",
                  en: "Clot/hemolysis flags surfaced directly in worklist",
                },
                chip: "LIS Core",
              },
            ],
            // Halaman detail /integration/analyzer
            detail: {
              name: { id: "Direct Analyzer Interfacing", en: "Direct Analyzer Interfacing" },
              tagline: { id: "Kompatibel dengan 500+ Mesin Laboratorium Medis Terkemuka", en: "Kompatibel dengan 500+ Mesin Laboratorium Medis Terkemuka" },
              shortDesc: { id: "Interfacing bidireksional langsung ke instrumen hematologi, kimia klinik, imunologi, urinalisis, koagulasi, dan mikrobiologi.", en: "Interfacing bidireksional langsung ke instrumen hematologi, kimia klinik, imunologi, urinalisis, koagulasi, dan mikrobiologi." },
              description: { id: "Diagnova terhubung langsung dengan lebih dari 500 model mesin lab dari pabrikan global ternama (seperti Roche, Abbott, Sysmex, Siemens, Beckman Coulter, Mindray, bioMérieux, Horiba, dan Dirui). Spesimen dengan barcode ditarik otomatis oleh mesin (Query Mode), dianalisis, dan hasilnya dikirim balik ke Diagnova tanpa intervensi tangan manusia.", en: "Diagnova terhubung langsung dengan lebih dari 500 model mesin lab dari pabrikan global ternama (seperti Roche, Abbott, Sysmex, Siemens, Beckman Coulter, Mindray, bioMérieux, Horiba, dan Dirui). Spesimen dengan barcode ditarik otomatis oleh mesin (Query Mode), dianalisis, dan hasilnya dikirim balik ke Diagnova tanpa intervensi tangan manusia." },
              protocols: [
                { id: "dp-1", label: "ASTM E1381 / E1394" },
                { id: "dp-2", label: "HL7 v2.3.1 / v2.5" },
                { id: "dp-3", label: "Serial RS-232" },
                { id: "dp-4", label: "TCP/IP LAN" },
                { id: "dp-5", label: "USB" },
              ],
              highlights: [
                { id: "h-1", text: { id: "Mendukung Mode Query Bidireksional (Host Query) & Unidireksional", en: "Mendukung Mode Query Bidireksional (Host Query) & Unidireksional" } },
                { id: "h-2", text: { id: "Pengenalan kode tes otomatis dan konversi satuan terstandardisasi", en: "Pengenalan kode tes otomatis dan konversi satuan terstandardisasi" } },
                { id: "h-3", text: { id: "Validasi Quality Control (QC) otomatis sebelum hasil pasien diproses", en: "Validasi Quality Control (QC) otomatis sebelum hasil pasien diproses" } },
                { id: "h-4", text: { id: "Deteksi status instrumen (Online, Idle, Running, Error Flagging)", en: "Deteksi status instrumen (Online, Idle, Running, Error Flagging)" } },
              ],
              capabilities: [
                { id: "c-1", text: { id: "500+ Driver Instrumen Laboratorium Teruji", en: "500+ Driver Instrumen Laboratorium Teruji" } },
                { id: "c-2", text: { id: "Automatic Specimen Worklist Dispatch", en: "Automatic Specimen Worklist Dispatch" } },
                { id: "c-3", text: { id: "Real-time Raw Data Parsing & Error Flag Capture", en: "Real-time Raw Data Parsing & Error Flag Capture" } },
                { id: "c-4", text: { id: "Instrument Maintenance & Calibration Logging", en: "Instrument Maintenance & Calibration Logging" } },
              ],
            },
          },
          {
            id: "satusehat",
            slug: "satusehat",
            iconName: "ShieldCheck",
            side: "right",
            tabLabel: { id: "SATUSEHAT Kemenkes", en: "SATUSEHAT Kemenkes" },
            shortDesc: { id: "HL7 FHIR R4", en: "National HL7 FHIR R4" },
            name: { id: "SATUSEHAT Interoperabilitas", en: "SATUSEHAT Interoperabilitas" },
            tagline: {
              id: "Konversi otomatis resource HL7 FHIR R4 dengan validasi IHS & ontologi LOINC.",
              en: "Turnkey HL7 FHIR R4 transformation with IHS validation & LOINC mapping.",
            },
            protocols: [
              { id: "p-1", label: "HL7 FHIR R4" },
              { id: "p-2", label: "OAuth 2.0" },
              { id: "p-3", label: "TLS 1.3" },
            ],
            metrics: [
              { id: "m-1", val: "99.8%", label: { id: "Sukses Kirim", en: "Delivery Rate" } },
              { id: "m-2", val: "FHIR R4", label: { id: "Standar", en: "Standard" } },
            ],
            workflowSteps: [
              {
                id: "s-1",
                tag: { id: "Pemicu", en: "Trigger" },
                status: "Completed",
                title: { id: "Validasi NIK ke IHS Number", en: "Verify NIK to IHS Patient ID" },
                desc: {
                  id: "Pencocokan identitas pasien dengan indeks Kemenkes",
                  en: "Patient identity matched against MoH registry",
                },
                chip: "OAuth 2.0",
              },
              {
                id: "s-2",
                tag: { id: "Proses", en: "Process" },
                status: "Completed",
                title: { id: "Mapping LOINC & SNOMED CT", en: "Map LOINC & SNOMED CT" },
                desc: {
                  id: "Normalisasi parameter lab ke kamus nasional",
                  en: "Normalize lab parameters to national dictionary",
                },
                chip: "Ontology",
              },
              {
                id: "s-3",
                tag: { id: "Rilis", en: "Dispatch" },
                status: "Running",
                title: { id: "Kirim Bundle FHIR DiagnosticReport", en: "Dispatch FHIR DiagnosticReport" },
                desc: {
                  id: "Konfirmasi HTTP 201 Created tercatat di audit log",
                  en: "HTTP 201 Created logged in immutable audit trail",
                },
                chip: "201 OK",
              },
            ],
            // Halaman detail /integration/satusehat
            detail: {
              name: { id: "SATUSEHAT (Kemenkes RI)", en: "SATUSEHAT (Kemenkes RI)" },
              tagline: { id: "Integrasi Siap Pakai dengan Platform Data Kesehatan Nasional", en: "Integrasi Siap Pakai dengan Platform Data Kesehatan Nasional" },
              shortDesc: { id: "Konektivitas standar HL7 FHIR untuk pengiriman data pemeriksaan laboratorium ke ekosistem SATUSEHAT Kementerian Kesehatan RI.", en: "Konektivitas standar HL7 FHIR untuk pengiriman data pemeriksaan laboratorium ke ekosistem SATUSEHAT Kementerian Kesehatan RI." },
              description: { id: "Diagnova telah dirancang dengan arsitektur data berbasis terminologi standar kesehatan nasional. Memungkinkan fasilitas kesehatan Anda memenuhi kewajiban interoperabilitas SATUSEHAT Kemenkes secara cepat, aman, dan tanpa perlu merombak infrastruktur laboratorium yang ada.", en: "Diagnova telah dirancang dengan arsitektur data berbasis terminologi standar kesehatan nasional. Memungkinkan fasilitas kesehatan Anda memenuhi kewajiban interoperabilitas SATUSEHAT Kemenkes secara cepat, aman, dan tanpa perlu merombak infrastruktur laboratorium yang ada." },
              protocols: [
                { id: "dp-1", label: "HL7 FHIR R4" },
                { id: "dp-2", label: "OAuth 2.0 Kemenkes" },
                { id: "dp-3", label: "HTTPS TLS 1.3" },
              ],
              highlights: [
                { id: "h-1", text: { id: "Pemetaan otomatis kode pemeriksaan laboratorium ke kode LOINC & SNOMED CT", en: "Pemetaan otomatis kode pemeriksaan laboratorium ke kode LOINC & SNOMED CT" } },
                { id: "h-2", text: { id: "Integrasi autentikasi resmi via API Gateway SATUSEHAT Kemenkes", en: "Integrasi autentikasi resmi via API Gateway SATUSEHAT Kemenkes" } },
                { id: "h-3", text: { id: "Dashboard pemantauan status pengiriman data (Payload Sent, Verified, Failed)", en: "Dashboard pemantauan status pengiriman data (Payload Sent, Verified, Failed)" } },
                { id: "h-4", text: { id: "Audit log kepatuhan privasi data pasien sesuai regulasi PDP", en: "Audit log kepatuhan privasi data pasien sesuai regulasi PDP" } },
              ],
              capabilities: [
                { id: "c-1", text: { id: "FHIR ServiceRequest & Specimen Mapping", en: "FHIR ServiceRequest & Specimen Mapping" } },
                { id: "c-2", text: { id: "FHIR DiagnosticReport & Observation Generator", en: "FHIR DiagnosticReport & Observation Generator" } },
                { id: "c-3", text: { id: "National Health ID (IHS Number) Validation", en: "National Health ID (IHS Number) Validation" } },
                { id: "c-4", text: { id: "Automated SATUSEHAT Submission & Retry Mechanism", en: "Automated SATUSEHAT Submission & Retry Mechanism" } },
              ],
            },
          },
          {
            id: "connectivity",
            slug: "connectivity",
            iconName: "Wifi",
            side: "left",
            tabLabel: { id: "Smart Gateway", en: "Smart Gateway" },
            shortDesc: { id: "Buffer Offline 72 Jam", en: "72h Offline Buffer" },
            name: { id: "Smart Resilient Gateway", en: "Smart Resilient Gateway" },
            tagline: {
              id: "Buffer lokal terenkripsi 72 jam menjaga layanan Cito tetap jalan saat jaringan putus.",
              en: "72-hour encrypted local buffer keeps Cito lab operations running during outages.",
            },
            protocols: [
              { id: "p-1", label: "Edge Cache" },
              { id: "p-2", label: "AES-256" },
              { id: "p-3", label: "Cito Sync" },
            ],
            metrics: [
              { id: "m-1", val: "99.9%", label: { id: "Uptime SLA", en: "Uptime SLA" } },
              { id: "m-2", val: "0 Byte", label: { id: "Data Hilang", en: "Data Loss" } },
            ],
            workflowSteps: [
              {
                id: "s-1",
                tag: { id: "Pemicu", en: "Trigger" },
                status: "Completed",
                title: { id: "Deteksi Gangguan WAN / Cloud", en: "Detect WAN / Cloud Disruption" },
                desc: {
                  id: "Gateway otomatis beralih ke mode penyimpanan edge",
                  en: "Gateway seamlessly switches to local edge buffering",
                },
                chip: "Failover",
              },
              {
                id: "s-2",
                tag: { id: "Proses", en: "Process" },
                status: "Completed",
                title: { id: "Enkripsi Lokal Hingga 72 Jam", en: "Encrypt Locally up to 72 Hours" },
                desc: {
                  id: "Pembacaan analyzer tetap terekam tanpa hambatan",
                  en: "Analyzer readings continue capturing uninterrupted",
                },
                chip: "AES-256",
              },
              {
                id: "s-3",
                tag: { id: "Rilis", en: "Dispatch" },
                status: "Running",
                title: { id: "Rekonsiliasi Prioritas Sampel Cito", en: "Reconcile Cito Specimens First" },
                desc: {
                  id: "Sampel IGD & ICU disinkronkan lebih dulu saat online",
                  en: "ER & ICU queues sync first upon reconnection",
                },
                chip: "0% Loss",
              },
            ],
            // Halaman detail /integration/connectivity
            detail: {
              name: { id: "Smart Resilient Gateway", en: "Smart Resilient Gateway" },
              tagline: { id: "Konektivitas Tangguh dengan Offline Buffer Mode & Uptime 99.9%", en: "Konektivitas Tangguh dengan Offline Buffer Mode & Uptime 99.9%" },
              shortDesc: { id: "Arsitektur gateway cerdas yang memastikan operasional lab tetap berjalan normal tanpa kehilangan data bahkan saat jaringan lokal/internet terputus.", en: "Arsitektur gateway cerdas yang memastikan operasional lab tetap berjalan normal tanpa kehilangan data bahkan saat jaringan lokal/internet terputus." },
              description: { id: "Gangguan jaringan internet atau fluktuasi LAN tidak boleh menghentikan proses diagnosis kritis. Smart Resilient Gateway Diagnova beroperasi dengan teknologi edge buffer lokal. Seluruh pembacaan analyzer tetap tersimpan aman di gateway lokal dan akan otomatis tersinkronisasi ke server pusat saat koneksi pulih kembali.", en: "Gangguan jaringan internet atau fluktuasi LAN tidak boleh menghentikan proses diagnosis kritis. Smart Resilient Gateway Diagnova beroperasi dengan teknologi edge buffer lokal. Seluruh pembacaan analyzer tetap tersimpan aman di gateway lokal dan akan otomatis tersinkronisasi ke server pusat saat koneksi pulih kembali." },
              protocols: [
                { id: "dp-1", label: "Edge Local Caching" },
                { id: "dp-2", label: "Auto-Reconnection Protocol" },
                { id: "dp-3", label: "Encrypted Tunnel (TLS/AES-256)" },
              ],
              highlights: [
                { id: "h-1", text: { id: "Zero Data Loss: Data hasil tes tersimpan aman di buffer lokal saat offline", en: "Zero Data Loss: Data hasil tes tersimpan aman di buffer lokal saat offline" } },
                { id: "h-2", text: { id: "Sinkronisasi cerdas otomatis dengan prioritas sampel cito begitu online", en: "Sinkronisasi cerdas otomatis dengan prioritas sampel cito begitu online" } },
                { id: "h-3", text: { id: "Pemantauan status heartbeat seluruh perangkat laboratorium 24/7", en: "Pemantauan status heartbeat seluruh perangkat laboratorium 24/7" } },
                { id: "h-4", text: { id: "Uptime operasional teruji 99.9% di lingkungan rumah sakit dengan beban tinggi", en: "Uptime operasional teruji 99.9% di lingkungan rumah sakit dengan beban tinggi" } },
              ],
              capabilities: [
                { id: "c-1", text: { id: "Fault-Tolerant Local Storage Architecture", en: "Fault-Tolerant Local Storage Architecture" } },
                { id: "c-2", text: { id: "Conflict Resolution & Queue Reconciliation", en: "Conflict Resolution & Queue Reconciliation" } },
                { id: "c-3", text: { id: "Automated Network Health Monitoring & Alerting", en: "Automated Network Health Monitoring & Alerting" } },
                { id: "c-4", text: { id: "Remote Firmware & Driver Update Deployment", en: "Remote Firmware & Driver Update Deployment" } },
              ],
            },
          },
        ],
      },
    },
    architecture: {
      label: "Kapabilitas Teknis (Grid Arsitektur)",
      content: {
        badge: { id: "Kapabilitas Teknis", en: "Engineering Capabilities" },
        title: {
          id: "Semua yang Dibutuhkan untuk Integrasi Tanpa Friksi",
          en: "Everything You Need for Frictionless Lab Integration",
        },
        description: {
          id: "Dari Host Query barcode, validasi Westgard QC, pemetaan LOINC, hingga ketahanan jaringan offline—seluruhnya dirancang presisi.",
          en: "From barcode Host Query and Westgard QC gating to LOINC normalization and offline edge resilience.",
        },
        // Enam sel memiliki ilustrasi berbeda (tetap di kode); yang dikelola CMS adalah teksnya.
        hostQuery: {
          title: { id: "Host Query Satu Sentuhan", en: "One-Click Host Query" },
          desc: {
            id: "Mesin menarik profil tes otomatis begitu barcode tabung terbaca di rak.",
            en: "Instruments pull test profiles automatically the moment barcoded tubes enter the rack.",
          },
          chipLabel: "Host Query",
          tags: [
            { id: "t-1", label: "ASTM" },
            { id: "t-2", label: "HL7" },
            { id: "t-3", label: "RS232" },
          ],
        },
        citoPriority: {
          title: { id: "Prioritas Antrean Cito", en: "Cito Priority Scheduling" },
          desc: {
            id: "Sampel IGD & ICU selalu diprioritaskan saat sinkronisasi ke SIMRS dan EMR.",
            en: "ER and ICU specimens always take priority when syncing to HIS and EMR.",
          },
          queueTitle: { id: "Queue Priority", en: "Queue Priority" },
          syncBadge: { id: "Auto Sync", en: "Auto Sync" },
          rows: [
            { id: "q-1", label: { id: "IGD Cito Worklist", en: "IGD Cito Worklist" }, time: "09:45" },
            { id: "q-2", label: { id: "SATUSEHAT Batch", en: "SATUSEHAT Batch" }, time: "11:00" },
          ],
        },
        validation: {
          title: { id: "Aturan Validasi Fleksibel", en: "Configurable Validation Rules" },
          desc: {
            id: "Atur auto-verifikasi hasil normal atau tahan otomatis jika Westgard QC gagal.",
            en: "Configure auto-verification for normal runs or strict Westgard QC holds.",
          },
          prompt: { id: "Pilih Mode Validasi QC", en: "Select QC Validation Mode" },
          // Item pertama = mode yang terpilih saat halaman dimuat.
          modes: [
            { id: "auto", label: { id: "Auto-Verify", en: "Auto-Verify" } },
            { id: "strict", label: { id: "Westgard", en: "Westgard" } },
            { id: "custom", label: { id: "+ Rule", en: "+ Rule" } },
          ],
        },
        criticalValue: {
          title: { id: "Deteksi Nilai Kritis Instan", en: "Instant Critical Value Flag" },
          desc: {
            id: "Menyorot hasil kritis secara otomatis dan memicu eskalasi KARS SKP 2.2.",
            en: "Highlights critical thresholds automatically and triggers KARS SKP 2.2 alerts.",
          },
          chipLabel: { id: "↻ Escalate < 15m", en: "↻ Escalate < 15m" },
          // **teks** = nilai yang disorot.
          sample: {
            id: "Serum Potassium **6.4 mmol/L** exceeds critical threshold",
            en: "Serum Potassium **6.4 mmol/L** exceeds critical threshold",
          },
        },
        payloadAudit: {
          title: { id: "Audit Payload Real-Time", en: "Real-Time Payload Audit" },
          desc: {
            id: "Lacak status setiap pengiriman HL7 dan FHIR R4 dalam hitungan detik.",
            en: "Track every HL7 and FHIR R4 dispatch status with full auditability.",
          },
          question: {
            id: "Status kirim SATUSEHAT #SP-08819?",
            en: "Status kirim SATUSEHAT #SP-08819?",
          },
          // **teks** = bagian yang disorot.
          reply: {
            id: "**HTTP 201 Created.** DiagnosticReport & IHS tervalidasi.",
            en: "**HTTP 201 Created.** DiagnosticReport & IHS tervalidasi.",
          },
          inputPlaceholder: { id: "Cek status payload...", en: "Cek status payload..." },
        },
        loincMapper: {
          title: { id: "Pemetaan LOINC & SNOMED", en: "LOINC & SNOMED Builder" },
          desc: {
            id: "Normalisasi otomatis kode mentah alat menjadi kamus standar nasional.",
            en: "Automatically normalizes proprietary instrument codes into national ontologies.",
          },
          chipLabel: { id: "Mapping FHIR R4", en: "Mapping FHIR R4" },
          rawColumnLabel: { id: "Raw Code", en: "Raw Code" },
          codeColumnLabel: { id: "LOINC", en: "LOINC" },
          rows: [
            { id: "r-1", raw: "HGB (Sysmex)", code: "718-7" },
            { id: "r-2", raw: "CREA (Cobas)", code: "2160-0" },
          ],
        },
      },
    },
    analyzers: {
      label: "Direktori Kompatibilitas Analyzer",
      content: {
        badge: { id: "Direktori 500+ Analyzer", en: "500+ Analyzer Directory" },
        title: {
          id: "Matriks Kompatibilitas Instrumen Laboratorium",
          en: "Laboratory Instrument Compatibility Matrix",
        },
        description: {
          id: "Cari merek atau seri mesin laboratorium Anda untuk melihat antarmuka fisik dan protokol yang didukung native.",
          en: "Search your analyzer brand or series to inspect natively supported physical interfaces and protocols.",
        },
        allFilterLabel: { id: "Semua Divisi", en: "All Disciplines" },
        // `label` = teks tombol filter; `tableLabel` = teks kolom Divisi di tabel.
        disciplines: [
          {
            id: "hematology",
            label: { id: "Hematologi", en: "Hematology" },
            tableLabel: { id: "Hematologi & Koagulasi", en: "Hematology & Coag" },
          },
          {
            id: "chemistry",
            label: { id: "Kimia & Imuno", en: "Chemistry" },
            tableLabel: { id: "Kimia Klinik & Imuno", en: "Chemistry & Immuno" },
          },
          {
            id: "microbiology",
            label: { id: "Mikrobiologi", en: "Microbiology" },
            tableLabel: { id: "Mikrobiologi & Urin", en: "Microbiology & Urine" },
          },
          {
            id: "molecular",
            label: { id: "Molekuler", en: "Molecular" },
            tableLabel: { id: "Molekuler & Patologi", en: "Molecular & Pathology" },
          },
        ],
        searchPlaceholder: {
          id: "Cari merek / seri (mis. Cobas, XN)...",
          en: "Search brand / series (e.g. Cobas, XN)...",
        },
        columns: {
          manufacturer: { id: "Pabrikan", en: "Manufacturer" },
          discipline: { id: "Divisi", en: "Discipline" },
          models: { id: "Seri & Model Teruji", en: "Supported Series" },
          iface: { id: "Antarmuka", en: "Interface" },
          protocol: { id: "Protokol", en: "Protocol" },
        },
        // `discipline` merujuk ke `id` pada daftar `disciplines`.
        rows: [
          { id: "a-1", discipline: "hematology", maker: "Sysmex", models: "XN-1000, XN-550, CS-2500, UF-4000", iface: "TCP/IP LAN", protocol: "ASTM E1394" },
          { id: "a-2", discipline: "hematology", maker: "Mindray", models: "BC-6000, BC-5380, CX-6000", iface: "TCP/IP / RS-232", protocol: "HL7 v2.5" },
          { id: "a-3", discipline: "hematology", maker: "Horiba Medical", models: "Yumizen H550, Pentra XLR", iface: "TCP/IP LAN", protocol: "ASTM E1381" },
          { id: "a-4", discipline: "chemistry", maker: "Roche Diagnostics", models: "Cobas c501, e411, Pure, Pro", iface: "TCP/IP LAN", protocol: "ASTM / HL7" },
          { id: "a-5", discipline: "chemistry", maker: "Abbott Core", models: "Alinity ci, Architect i1000SR", iface: "TCP/IP / Serial", protocol: "ASTM E1381" },
          { id: "a-6", discipline: "chemistry", maker: "Siemens Healthineers", models: "Atellica CH/IM, Dimension EXL", iface: "TCP/IP LAN", protocol: "HL7 v2.5" },
          { id: "a-7", discipline: "microbiology", maker: "bioMérieux", models: "VITEK 2, VIDAS, BACT/ALERT", iface: "TCP/IP / BCI", protocol: "ASTM / BCI" },
          { id: "a-8", discipline: "microbiology", maker: "Beckman Coulter", models: "DxU Iris, MicroScan WalkAway", iface: "TCP/IP LAN", protocol: "HL7 v2.x" },
          { id: "a-9", discipline: "molecular", maker: "Roche / Cepheid", models: "Cobas 6800, GeneXpert", iface: "HTTPS / LAN", protocol: "HL7 FHIR / ASTM" },
          { id: "a-10", discipline: "molecular", maker: "Thermo / Qiagen", models: "QuantStudio, QIAcube HT", iface: "REST / CSV", protocol: "JSON / HL7" },
        ],
        // {query} diganti dengan kata kunci pencarian.
        emptyMessage: {
          id: 'Model "{query}" belum tampil di ringkasan.',
          en: 'Model "{query}" is not listed in the summary.',
        },
        resetLabel: { id: "Reset Filter", en: "Reset Filter" },
        slaTitle: { id: "Driver Kustom 3–5 Hari Kerja:", en: "3–5 Day Custom Driver SLA:" },
        slaText: {
          id: "Tim engineering kami membangun konektor ASTM/HL7 baru tanpa biaya tambahan.",
          en: "Our engineering team builds new ASTM/HL7 instrument drivers at no extra fee.",
        },
        slaCta: {
          text: { id: "Ajukan Cek Mesin", en: "Request Compatibility Check" },
          href: "/request-demo",
        },
      },
    },
    compliance: {
      label: "Kepatuhan Regulasi & Keamanan",
      content: {
        badge: { id: "Kepatuhan Regulasi & Privasi", en: "Regulatory & Privacy Compliance" },
        title: {
          id: "Arsitektur Interoperabilitas Sesuai Regulasi Kesehatan Nasional",
          en: "Interoperability Architecture Built for National Health Compliance",
        },
        description: {
          id: "Setiap pertukaran data dilindungi enkripsi TLS 1.3 / AES-256 serta memenuhi amanat Permenkes 24/2022, standar SATUSEHAT Kemenkes RI, dan UU Perlindungan Data Pribadi.",
          en: "Every data exchange is guarded by TLS 1.3 / AES-256 encryption, fully aligning with Permenkes 24/2022, MoH SATUSEHAT FHIR, and Indonesia's PDP Act.",
        },
        badges: [
          { id: "b-1", code: "PMK 24/2022", label: { id: "RME Terstruktur", en: "Structured EMR" }, iconName: "FileCheck2" },
          { id: "b-2", code: "SATUSEHAT", label: { id: "HL7 FHIR R4", en: "HL7 FHIR R4" }, iconName: "ShieldCheck" },
          { id: "b-3", code: "UU PDP 27/2022", label: { id: "Privasi Pasien", en: "Patient Privacy" }, iconName: "Lock" },
          { id: "b-4", code: "KARS SKP 2.2", label: { id: "Nilai Kritis < 15m", en: "Panic SLA < 15m" }, iconName: "Activity" },
          { id: "b-5", code: "ISO 15189", label: { id: "Mutu Lab Medik", en: "Lab Quality" }, iconName: "BadgeCheck" },
          { id: "b-6", code: "TLS 1.3", label: { id: "AES-256 Encrypted", en: "AES-256 Encrypted" }, iconName: "Server" },
        ],
      },
    },
    cta: {
      label: "CTA Banner (Halaman Utama & Detail)",
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
        emailPlaceholder: { id: "Masukkan alamat email Anda", en: "Enter your email address" },
      },
    },
    detailPage: {
      label: "Halaman Detail Integrasi (Label Umum)",
      content: {
        backLabel: { id: "Kembali ke Halaman Integrasi", en: "Kembali ke Halaman Integrasi" },
        badge: { id: "Spesifikasi Arsitektur & Protokol", en: "Spesifikasi Arsitektur & Protokol" },
        descriptionTitle: { id: "Deskripsi & Alur Operasional", en: "Deskripsi & Alur Operasional" },
        protocolsTitle: { id: "Protokol & Standar Komunikasi", en: "Protokol & Standar Komunikasi" },
        highlightsTitle: { id: "Keunggulan & Kapabilitas Utama", en: "Keunggulan & Kapabilitas Utama" },
        capabilitiesTitle: { id: "Spesifikasi Pesan & Format Data", en: "Spesifikasi Pesan & Format Data" },
        // Judul kartu samping = sidebarTitlePrefix + " " + nama integrasi.
        sidebarTitlePrefix: { id: "Konsultasikan Bridging", en: "Konsultasikan Bridging" },
        sidebarDesc: {
          id: "Tim teknis Diagnova siap mendampingi pengujian interfacing, penyiapan mapping LOINC, dan konfigurasi gateway instrumen RS Anda.",
          en: "Tim teknis Diagnova siap mendampingi pengujian interfacing, penyiapan mapping LOINC, dan konfigurasi gateway instrumen RS Anda.",
        },
        sidebarCta: {
          text: { id: "Jadwalkan Konsultasi Teknis", en: "Jadwalkan Konsultasi Teknis" },
          href: "/request-demo",
        },
      },
    },
  },
} satisfies CmsPageDefinition;
