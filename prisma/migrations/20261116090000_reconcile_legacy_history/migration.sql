-- =====================================================================================
-- Rekonsiliasi riwayat migration (Phase 4, 16 Nov 2026)
--
-- Database dev/test/produksi yang ada dibangun dengan `prisma db push`, sehingga folder migration
-- berhenti pada 16 Okt 2026 dan tidak lagi mencerminkan struktur aktual (43 statement drift, lihat
-- PHASE_2_SCHEMA_AND_MIGRATION_AUDIT.md). Migration ini membawa database yang dibangun dari
-- migration lama ke struktur aktual sebelum restrukturisasi.
--
-- HANYA untuk database KOSONG (fresh deploy). Beberapa statement di bawah mengganti tipe kolom
-- dengan DROP/ADD dan menghapus tabel `lead_notes`, yang aman hanya bila tidak ada data.
-- Database yang sudah berisi data (hasil db push) TIDAK menjalankan file ini; tandai sebagai
-- applied dengan `prisma migrate resolve --applied 20261116090000_reconcile_legacy_history`
-- (lihat docs/DATABASE_MIGRATION.md).
-- =====================================================================================

DO $$
DECLARE
  t text;
  n bigint;
BEGIN
  FOREACH t IN ARRAY ARRAY['users','leads','lead_notes','audit_logs','patients','physicians',
                           'test_catalogs','lab_orders','lab_order_items','specimens'] LOOP
    IF to_regclass('public.' || t) IS NOT NULL THEN
      EXECUTE format('SELECT count(*) FROM %I', t) INTO n;
      IF n > 0 THEN
        RAISE EXCEPTION 'Migration rekonsiliasi dibatalkan: tabel % berisi % baris. Database berisi data harus di-baseline dengan "prisma migrate resolve --applied", bukan dijalankan.', t, n;
      END IF;
    END IF;
  END LOOP;
END $$;

-- CreateEnum
CREATE TYPE "lead_approval_status" AS ENUM ('pending', 'approved', 'rejected');

-- AlterEnum
ALTER TYPE "user_role" ADD VALUE 'demo_user';

-- DropForeignKey
ALTER TABLE "audit_logs" DROP CONSTRAINT "audit_logs_user_id_fkey";

-- DropForeignKey
ALTER TABLE "lead_notes" DROP CONSTRAINT "lead_notes_author_id_fkey";

-- DropForeignKey
ALTER TABLE "lead_notes" DROP CONSTRAINT "lead_notes_lead_id_fkey";

-- AlterTable
ALTER TABLE "leads" ADD COLUMN     "approval_status" "lead_approval_status" NOT NULL DEFAULT 'pending',
ADD COLUMN     "approved_at" TIMESTAMP(3),
ADD COLUMN     "approved_by" VARCHAR(100),
ADD COLUMN     "confirmed_demo_date" TIMESTAMP(3),
ADD COLUMN     "demo_date" TIMESTAMP(3),
ADD COLUMN     "demo_duration_days" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "rejection_reason" TEXT,
ADD COLUMN     "requested_demo_date" TIMESTAMP(3),
ADD COLUMN     "user_id" TEXT,
ADD COLUMN     "voucher_code" VARCHAR(50),
ADD COLUMN     "voucher_expiry" TIMESTAMP(3),
DROP COLUMN "status",
ADD COLUMN     "status" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role",
ADD COLUMN     "demo_activated_at" TIMESTAMP(3),
ADD COLUMN     "demo_duration_days" INTEGER,
ADD COLUMN     "demo_expires_at" TIMESTAMP(3),
ADD COLUMN     "institution" VARCHAR(150),
ADD COLUMN     "job_title" VARCHAR(100),
ADD COLUMN     "phone" VARCHAR(30),
ADD COLUMN     "role_id" TEXT,
ALTER COLUMN "password_hash" DROP NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" INTEGER NOT NULL DEFAULT 1;

-- DropTable
DROP TABLE "lead_notes";

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
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

-- CreateTable
CREATE TABLE "cms_hero_slides" (
    "id" TEXT NOT NULL,
    "section_id" TEXT,
    "title_id" TEXT NOT NULL,
    "title_en" TEXT NOT NULL,
    "subtitle_id" TEXT,
    "subtitle_en" TEXT,
    "badge_id" TEXT,
    "badge_en" TEXT,
    "cta_primary_text_id" TEXT,
    "cta_primary_text_en" TEXT,
    "cta_primary_url" TEXT,
    "cta_secondary_text_id" TEXT,
    "cta_secondary_text_en" TEXT,
    "cta_secondary_url" TEXT,
    "image_url" TEXT NOT NULL,
    "image_alt" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cms_hero_slides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cms_comparison_items" (
    "id" TEXT NOT NULL,
    "section_id" TEXT,
    "number" VARCHAR(10) NOT NULL,
    "conventional_title_id" TEXT NOT NULL,
    "conventional_title_en" TEXT NOT NULL,
    "conventional_desc_id" TEXT NOT NULL,
    "conventional_desc_en" TEXT NOT NULL,
    "diagnova_title_id" TEXT NOT NULL,
    "diagnova_title_en" TEXT NOT NULL,
    "diagnova_desc_id" TEXT NOT NULL,
    "diagnova_desc_en" TEXT NOT NULL,
    "impact_metric" VARCHAR(100) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cms_comparison_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cms_testimonials" (
    "id" TEXT NOT NULL,
    "section_id" TEXT,
    "name" VARCHAR(120) NOT NULL,
    "role_id_text" VARCHAR(120) NOT NULL,
    "role_en_text" VARCHAR(120),
    "institution" VARCHAR(150) NOT NULL,
    "quote_id" TEXT NOT NULL,
    "quote_en" TEXT NOT NULL,
    "avatar_url" TEXT NOT NULL DEFAULT '/images/testimonial-silhouette-female.jpg',
    "rating" INTEGER NOT NULL DEFAULT 5,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cms_testimonials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cms_partners" (
    "id" TEXT NOT NULL,
    "section_id" TEXT,
    "name" VARCHAR(120) NOT NULL,
    "logo_url" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cms_partners_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "demo_magic_links_token_hash_key" ON "demo_magic_links"("token_hash");

-- CreateIndex
CREATE INDEX "demo_magic_links_token_hash_idx" ON "demo_magic_links"("token_hash");

-- CreateIndex
CREATE INDEX "demo_magic_links_email_idx" ON "demo_magic_links"("email");

-- CreateIndex
CREATE INDEX "demo_magic_links_lead_id_idx" ON "demo_magic_links"("lead_id");

-- CreateIndex
CREATE UNIQUE INDEX "cms_sections_section_key_key" ON "cms_sections"("section_key");

-- CreateIndex
CREATE INDEX "cms_hero_slides_section_id_idx" ON "cms_hero_slides"("section_id");

-- CreateIndex
CREATE INDEX "cms_hero_slides_sort_order_idx" ON "cms_hero_slides"("sort_order");

-- CreateIndex
CREATE INDEX "cms_comparison_items_section_id_idx" ON "cms_comparison_items"("section_id");

-- CreateIndex
CREATE INDEX "cms_comparison_items_sort_order_idx" ON "cms_comparison_items"("sort_order");

-- CreateIndex
CREATE INDEX "cms_testimonials_section_id_idx" ON "cms_testimonials"("section_id");

-- CreateIndex
CREATE INDEX "cms_testimonials_sort_order_idx" ON "cms_testimonials"("sort_order");

-- CreateIndex
CREATE INDEX "cms_partners_section_id_idx" ON "cms_partners"("section_id");

-- CreateIndex
CREATE INDEX "cms_partners_sort_order_idx" ON "cms_partners"("sort_order");

-- CreateIndex
CREATE INDEX "leads_user_id_idx" ON "leads"("user_id");

-- CreateIndex
CREATE INDEX "leads_status_idx" ON "leads"("status");

-- CreateIndex
CREATE INDEX "leads_approval_status_idx" ON "leads"("approval_status");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demo_magic_links" ADD CONSTRAINT "demo_magic_links_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demo_magic_links" ADD CONSTRAINT "demo_magic_links_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms_hero_slides" ADD CONSTRAINT "cms_hero_slides_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "cms_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms_comparison_items" ADD CONSTRAINT "cms_comparison_items_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "cms_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms_testimonials" ADD CONSTRAINT "cms_testimonials_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "cms_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms_partners" ADD CONSTRAINT "cms_partners_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "cms_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

