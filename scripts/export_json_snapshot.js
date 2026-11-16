const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function exportSnapshot() {
  const backupDir = path.join(__dirname, "..", "backups", "pre_restructure_20261113");
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const snapshot = {
    metadata: {
      timestamp: new Date().toISOString(),
      database: "diagnova",
      port: 5433,
      purpose: "Pre-restructuring snapshot"
    },
    tables: {}
  };

  const tables = [
    "_prisma_migrations",
    "roles",
    "users",
    "leads",
    "demo_magic_links",
    "audit_logs",
    "cms_sections",
    "cms_hero_slides",
    "cms_comparison_items",
    "cms_testimonials",
    "cms_partners",
    "patients",
    "physicians",
    "test_catalogs",
    "lab_orders",
    "lab_order_items",
    "specimens"
  ];

  for (const t of tables) {
    try {
      const rows = await prisma.$queryRawUnsafe(`SELECT * FROM "${t}"`);
      snapshot.tables[t] = {
        count: rows.length,
        records: rows
      };
      console.log(`Exported ${t}: ${rows.length} rows`);
    } catch (err) {
      console.error(`Error exporting ${t}:`, err.message);
      snapshot.tables[t] = { error: err.message };
    }
  }

  const snapshotPath = path.join(backupDir, "snapshot_pre_restructure_20261113.json");
  fs.writeFileSync(snapshotPath, JSON.stringify(snapshot, null, 2), "utf8");
  console.log(`Full JSON snapshot saved successfully to ${snapshotPath}`);
  await prisma.$disconnect();
}

exportSnapshot();

