-- =============================================================================
-- USULAN BASELINE MIGRATION — BELUM DITERAPKAN (NEEDS APPROVAL)
-- =============================================================================
-- Dihasilkan: prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script
-- Tanggal   : 2026-11-17 (branch artha)
--
-- Diverifikasi di database sementara terisolasi (diagnova_migcheck_b, dihapus setelah uji):
--   * diterapkan ke DB kosong tanpa error (0 pernyataan DROP)
--   * prisma migrate diff  DB-baseline  vs  schema.prisma   -> "No difference detected"
--   * prisma migrate diff  DB-baseline  vs  DB dev (diagnova_v2) -> "No difference detected"
--
-- File ini SENGAJA tidak diletakkan di prisma/migrations. Rencana penerapan (lihat
-- docs/FINAL_DEVELOPMENT_REVIEW.md §10) memerlukan persetujuan pemilik project:
--   1. Arsipkan 3 migration lama (tidak cocok dengan schema; lihat laporan).
--   2. Tambahkan folder prisma/migrations/<timestamp>_baseline/migration.sql berisi SQL ini.
--   3. DB yang SUDAH berisi data (dev / production): JANGAN jalankan SQL ini; tandai saja
--      "npx prisma migrate resolve --applied <timestamp>_baseline" setelah backup &
--      verifikasi "prisma migrate diff --from-url <DB> --to-schema-datamodel" = tidak ada beda.
--   4. DB baru/kosong: "npx prisma migrate deploy".
-- =============================================================================

-- CreateEnum
CREATE TYPE "lead_approval_status" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "lead_status" AS ENUM ('new', 'contacted', 'scheduled', 'completed');

-- CreateEnum
CREATE TYPE "institution_type" AS ENUM ('hospital', 'clinical-lab', 'pathology-center', 'microbiology-center', 'blood-bank', 'other');

-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('admin', 'user');

-- CreateEnum
CREATE TYPE "user_status" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "order_priority" AS ENUM ('routine', 'cito', 'urgent');

-- CreateEnum
CREATE TYPE "order_status" AS ENUM ('ordered', 'specimen_received', 'processing', 'partially_validated', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "specimen_status" AS ENUM ('collected', 'received_in_lab', 'processing', 'archived', 'rejected');

-- CreateEnum
CREATE TYPE "specimen_type" AS ENUM ('whole_blood', 'serum', 'plasma', 'urine', 'csf', 'stool', 'swab', 'other');

-- CreateEnum
CREATE TYPE "tube_color" AS ENUM ('lavender_edta', 'red_plain', 'yellow_sst', 'light_blue_citrate', 'gray_fluoride', 'green_heparin', 'urine_container', 'other');

-- CreateEnum
CREATE TYPE "gender" AS ENUM ('male', 'female');

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255),
    "institution" VARCHAR(150),
    "job_title" VARCHAR(100),
    "phone" VARCHAR(30),
    "role_id" TEXT,
    "status" INTEGER NOT NULL DEFAULT 1,
    "demo_duration_days" INTEGER,
    "demo_activated_at" TIMESTAMP(3),
    "demo_expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "name" VARCHAR(100) NOT NULL,
    "institution" VARCHAR(150) NOT NULL,
    "jobTitle" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(30) NOT NULL,
    "institution_type" "institution_type" NOT NULL DEFAULT 'hospital',
    "notes" TEXT,
    "status" INTEGER NOT NULL DEFAULT 1,
    "approval_status" "lead_approval_status" NOT NULL DEFAULT 'pending',
    "approved_at" TIMESTAMP(3),
    "approved_by" VARCHAR(100),
    "rejection_reason" TEXT,
    "requested_demo_date" TIMESTAMP(3),
    "confirmed_demo_date" TIMESTAMP(3),
    "demo_date" TIMESTAMP(3),
    "demo_duration_days" INTEGER NOT NULL DEFAULT 3,
    "voucher_code" VARCHAR(50),
    "voucher_expiry" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "demo_magic_links" (
    "id" TEXT NOT NULL,
    "token_hash" VARCHAR(128) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "lead_id" TEXT NOT NULL,
    "user_id" TEXT,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "ip_address" VARCHAR(50),
    "user_agent" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "demo_magic_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "action" VARCHAR(100) NOT NULL,
    "entity" VARCHAR(100) NOT NULL,
    "record_id" VARCHAR(100),
    "old_value" JSONB,
    "new_value" JSONB,
    "ip_address" VARCHAR(50),
    "user_agent" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patients" (
    "id" TEXT NOT NULL,
    "mrn" VARCHAR(50) NOT NULL,
    "national_id" VARCHAR(30),
    "name" VARCHAR(120) NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "sex" "gender" NOT NULL,
    "phone" VARCHAR(30),
    "address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "physicians" (
    "id" TEXT NOT NULL,
    "external_code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "specialization" VARCHAR(100) NOT NULL,
    "department" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "physicians_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_catalogs" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "specimen_type" "specimen_type" NOT NULL DEFAULT 'whole_blood',
    "tube_color" "tube_color" NOT NULL DEFAULT 'lavender_edta',
    "unit" VARCHAR(30),
    "tat_minutes" INTEGER NOT NULL DEFAULT 60,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "test_catalogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lab_orders" (
    "id" TEXT NOT NULL,
    "order_number" VARCHAR(50) NOT NULL,
    "patient_id" TEXT NOT NULL,
    "physician_id" TEXT,
    "source_location" VARCHAR(100) NOT NULL,
    "priority" "order_priority" NOT NULL DEFAULT 'routine',
    "clinical_notes" TEXT,
    "status" "order_status" NOT NULL DEFAULT 'ordered',
    "ordered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lab_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lab_order_items" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "test_catalog_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lab_order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "specimens" (
    "id" TEXT NOT NULL,
    "barcode_number" VARCHAR(50) NOT NULL,
    "order_id" TEXT NOT NULL,
    "specimen_type" "specimen_type" NOT NULL,
    "tube_color" "tube_color" NOT NULL,
    "volume" VARCHAR(30) DEFAULT '3.0 mL',
    "collected_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "received_at" TIMESTAMP(3),
    "status" "specimen_status" NOT NULL DEFAULT 'collected',
    "rejection_reason" TEXT,
    "rejected_by" VARCHAR(100),
    "rejected_at" TIMESTAMP(3),
    "received_by" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "specimens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cms_sections" (
    "id" TEXT NOT NULL,
    "section_key" VARCHAR(50) NOT NULL,
    "badge_id" TEXT,
    "badge_en" TEXT,
    "title_id" TEXT,
    "title_en" TEXT,
    "subtitle_id" TEXT,
    "subtitle_en" TEXT,
    "extra_content" JSONB,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "updated_by" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cms_sections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "leads_user_id_idx" ON "leads"("user_id");

-- CreateIndex
CREATE INDEX "leads_email_idx" ON "leads"("email");

-- CreateIndex
CREATE INDEX "leads_status_idx" ON "leads"("status");

-- CreateIndex
CREATE INDEX "leads_approval_status_idx" ON "leads"("approval_status");

-- CreateIndex
CREATE INDEX "leads_created_at_idx" ON "leads"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "demo_magic_links_token_hash_key" ON "demo_magic_links"("token_hash");

-- CreateIndex
CREATE INDEX "demo_magic_links_token_hash_idx" ON "demo_magic_links"("token_hash");

-- CreateIndex
CREATE INDEX "demo_magic_links_email_idx" ON "demo_magic_links"("email");

-- CreateIndex
CREATE INDEX "demo_magic_links_lead_id_idx" ON "demo_magic_links"("lead_id");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "audit_logs_entity_record_id_idx" ON "audit_logs"("entity", "record_id");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "patients_mrn_key" ON "patients"("mrn");

-- CreateIndex
CREATE UNIQUE INDEX "patients_national_id_key" ON "patients"("national_id");

-- CreateIndex
CREATE INDEX "patients_mrn_idx" ON "patients"("mrn");

-- CreateIndex
CREATE INDEX "patients_name_idx" ON "patients"("name");

-- CreateIndex
CREATE UNIQUE INDEX "physicians_external_code_key" ON "physicians"("external_code");

-- CreateIndex
CREATE UNIQUE INDEX "test_catalogs_code_key" ON "test_catalogs"("code");

-- CreateIndex
CREATE INDEX "test_catalogs_category_idx" ON "test_catalogs"("category");

-- CreateIndex
CREATE UNIQUE INDEX "lab_orders_order_number_key" ON "lab_orders"("order_number");

-- CreateIndex
CREATE INDEX "lab_orders_order_number_idx" ON "lab_orders"("order_number");

-- CreateIndex
CREATE INDEX "lab_orders_patient_id_idx" ON "lab_orders"("patient_id");

-- CreateIndex
CREATE INDEX "lab_orders_status_idx" ON "lab_orders"("status");

-- CreateIndex
CREATE INDEX "lab_orders_priority_idx" ON "lab_orders"("priority");

-- CreateIndex
CREATE INDEX "lab_orders_ordered_at_idx" ON "lab_orders"("ordered_at");

-- CreateIndex
CREATE INDEX "lab_order_items_order_id_idx" ON "lab_order_items"("order_id");

-- CreateIndex
CREATE INDEX "lab_order_items_test_catalog_id_idx" ON "lab_order_items"("test_catalog_id");

-- CreateIndex
CREATE UNIQUE INDEX "specimens_barcode_number_key" ON "specimens"("barcode_number");

-- CreateIndex
CREATE INDEX "specimens_barcode_number_idx" ON "specimens"("barcode_number");

-- CreateIndex
CREATE INDEX "specimens_order_id_idx" ON "specimens"("order_id");

-- CreateIndex
CREATE INDEX "specimens_status_idx" ON "specimens"("status");

-- CreateIndex
CREATE UNIQUE INDEX "cms_sections_section_key_key" ON "cms_sections"("section_key");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demo_magic_links" ADD CONSTRAINT "demo_magic_links_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demo_magic_links" ADD CONSTRAINT "demo_magic_links_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lab_orders" ADD CONSTRAINT "lab_orders_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lab_orders" ADD CONSTRAINT "lab_orders_physician_id_fkey" FOREIGN KEY ("physician_id") REFERENCES "physicians"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lab_order_items" ADD CONSTRAINT "lab_order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "lab_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lab_order_items" ADD CONSTRAINT "lab_order_items_test_catalog_id_fkey" FOREIGN KEY ("test_catalog_id") REFERENCES "test_catalogs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "specimens" ADD CONSTRAINT "specimens_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "lab_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

