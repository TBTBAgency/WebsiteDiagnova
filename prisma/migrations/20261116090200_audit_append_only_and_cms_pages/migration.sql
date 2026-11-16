-- =====================================================================================
-- Audit log append-only & CMS pusat seluruh halaman
-- Phase 4 (16 Nov 2026), diperkeras Phase 8.1 (temuan H-03, H-06, L-07).
-- Tidak ada DROP TABLE / DROP COLUMN. Tabel anak CMS lama hanya DEPRECATE (isi disalin ke JSON).
-- Yang di-DROP: UNIQUE index lama cms_sections_section_key_key (diganti UNIQUE (page_key, section_key))
-- dan DEFAULT sementara page_key (hanya untuk backfill baris lama).
-- Atomisitas berlaku PER FILE: bila file ini gagal, migration sebelumnya tetap terpasang.
-- =====================================================================================

-- 0. Precheck zona waktu (H-03): konversi timestamp di bawah mengasumsikan data lama tersimpan dalam UTC.
DO $$
BEGIN
  IF current_setting('TimeZone') NOT IN ('UTC', 'Etc/UTC') THEN
    RAISE EXCEPTION 'Dibatalkan (H-03): TimeZone sesi/server = %, bukan UTC.', current_setting('TimeZone');
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- 1. audit_logs
-- ---------------------------------------------------------------------------
ALTER TABLE "audit_logs"
  ADD COLUMN "actor_type"  VARCHAR(20),
  ADD COLUMN "actor_email" VARCHAR(255),
  ADD COLUMN "actor_role"  VARCHAR(50);

ALTER TABLE "audit_logs"
  ALTER COLUMN "created_at" TYPE TIMESTAMPTZ(3) USING "created_at" AT TIME ZONE 'UTC';

CREATE INDEX "audit_logs_action_created_at_idx" ON "audit_logs"("action", "created_at");

-- Append-only di level database (H-06):
--  * UPDATE dan TRUNCATE SELALU ditolak.
--  * DELETE hanya diizinkan bagi sesi yang login sebagai anggota role database khusus
--    "diagnova_audit_maintainer" (retensi OD-12). Bila role itu tidak ada, tidak ada pengecualian sama sekali.
--  * Tidak ada bypass lewat GUC/SET yang dapat dipakai akun aplikasi.
--  * Batasan: superuser dan PEMILIK tabel tetap dapat menonaktifkan/menghapus trigger. Karena itu role
--    aplikasi WAJIB bukan superuser dan bukan pemilik tabel (lihat prisma/sql/db-roles.sql & DEPLOYMENT.md).
CREATE FUNCTION "audit_logs_block_mutation"() RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog, pg_temp
AS $$
BEGIN
  IF TG_OP = 'DELETE'
     AND to_regrole('diagnova_audit_maintainer') IS NOT NULL
     AND pg_has_role(session_user, 'diagnova_audit_maintainer', 'MEMBER') THEN
    RETURN OLD;
  END IF;
  RAISE EXCEPTION 'audit_logs bersifat append-only: % ditolak', TG_OP;
END;
$$;

COMMENT ON FUNCTION "audit_logs_block_mutation"() IS
  'Append-only audit_logs: UPDATE/TRUNCATE ditolak; DELETE hanya untuk anggota role diagnova_audit_maintainer.';

CREATE TRIGGER "audit_logs_append_only_row"
  BEFORE UPDATE OR DELETE ON "audit_logs"
  FOR EACH ROW EXECUTE FUNCTION "audit_logs_block_mutation"();

CREATE TRIGGER "audit_logs_append_only_truncate"
  BEFORE TRUNCATE ON "audit_logs"
  FOR EACH STATEMENT EXECUTE FUNCTION "audit_logs_block_mutation"();

-- ---------------------------------------------------------------------------
-- 2. cms_sections: pusat CMS seluruh halaman (page_key, section_key)
-- ---------------------------------------------------------------------------
ALTER TABLE "cms_sections"
  ALTER COLUMN "created_at" TYPE TIMESTAMPTZ(3) USING "created_at" AT TIME ZONE 'UTC',
  ALTER COLUMN "updated_at" TYPE TIMESTAMPTZ(3) USING "updated_at" AT TIME ZONE 'UTC';

ALTER TABLE "cms_sections"
  ADD COLUMN "page_key"      VARCHAR(50) NOT NULL DEFAULT 'home',
  ADD COLUMN "label"         VARCHAR(120),
  ADD COLUMN "sort_order"    INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "version"       INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN "deleted_at"    TIMESTAMPTZ(3),
  ADD COLUMN "deleted_by_id" TEXT,
  ADD COLUMN "updated_by_id" TEXT;

-- updated_by lama berisi userId tanpa FK -> salin ke kolom FK bila user masih ada
UPDATE "cms_sections" s SET "updated_by_id" = s."updated_by"
WHERE s."updated_by" IS NOT NULL AND EXISTS (SELECT 1 FROM "users" u WHERE u."id" = s."updated_by");

UPDATE "cms_sections" SET "sort_order" = CASE "section_key"
    WHEN 'hero' THEN 10 WHEN 'trusted_by' THEN 20 WHEN 'about' THEN 30 WHEN 'comparison' THEN 40
    WHEN 'workflow' THEN 50 WHEN 'infrastructure' THEN 60 WHEN 'testimonials' THEN 70 WHEN 'cta' THEN 90
    ELSE 100 END,
  "label" = CASE "section_key"
    WHEN 'hero' THEN 'Hero Slider' WHEN 'trusted_by' THEN 'Trusted By (Partner)' WHEN 'about' THEN 'Tentang Diagnova'
    WHEN 'comparison' THEN 'Perbandingan' WHEN 'workflow' THEN 'Alur Kerja' WHEN 'infrastructure' THEN 'Infrastruktur'
    WHEN 'testimonials' THEN 'Testimoni' WHEN 'cta' THEN 'CTA Banner' ELSE "section_key" END;

DROP INDEX "cms_sections_section_key_key";
CREATE UNIQUE INDEX "cms_sections_page_key_section_key_key" ON "cms_sections"("page_key", "section_key");
CREATE INDEX "cms_sections_page_key_sort_order_idx" ON "cms_sections"("page_key", "sort_order");

-- DEFAULT 'home' hanya untuk mengisi baris lama; baris baru WAJIB menyebut page_key (L-07)
ALTER TABLE "cms_sections" ALTER COLUMN "page_key" DROP DEFAULT;

ALTER TABLE "cms_sections" ADD CONSTRAINT "cms_sections_deleted_by_id_fkey"
  FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "cms_sections" ADD CONSTRAINT "cms_sections_updated_by_id_fkey"
  FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "cms_sections" ADD CONSTRAINT "cms_sections_version_positive_chk" CHECK ("version" >= 1);

-- ---------------------------------------------------------------------------
-- 3. MIGRATE isi 4 tabel anak -> extra_content (urutan array = sort_order lama; is_active=false -> hidden)
--    Nama field mengikuti kolom lama (camelCase) agar komponen homepage tidak berubah.
-- ---------------------------------------------------------------------------
UPDATE "cms_sections" s
SET "extra_content" = COALESCE(s."extra_content", '{}'::jsonb) || jsonb_build_object('slides', COALESCE((
  SELECT jsonb_agg(jsonb_build_object(
      'id', h."id", 'hidden', NOT h."is_active",
      'titleId', h."title_id", 'titleEn', h."title_en",
      'subtitleId', h."subtitle_id", 'subtitleEn', h."subtitle_en",
      'badgeId', h."badge_id", 'badgeEn', h."badge_en",
      'ctaPrimaryTextId', h."cta_primary_text_id", 'ctaPrimaryTextEn', h."cta_primary_text_en", 'ctaPrimaryUrl', h."cta_primary_url",
      'ctaSecondaryTextId', h."cta_secondary_text_id", 'ctaSecondaryTextEn', h."cta_secondary_text_en", 'ctaSecondaryUrl', h."cta_secondary_url",
      'imageUrl', h."image_url", 'imageAlt', h."image_alt"
    ) ORDER BY h."sort_order", h."created_at")
  FROM "cms_hero_slides" h WHERE h."section_id" = s."id"), '[]'::jsonb))
WHERE EXISTS (SELECT 1 FROM "cms_hero_slides" h WHERE h."section_id" = s."id");

UPDATE "cms_sections" s
SET "extra_content" = COALESCE(s."extra_content", '{}'::jsonb) || jsonb_build_object('partners', COALESCE((
  SELECT jsonb_agg(jsonb_build_object(
      'id', p."id", 'hidden', NOT p."is_active", 'name', p."name", 'logoUrl', p."logo_url"
    ) ORDER BY p."sort_order", p."created_at")
  FROM "cms_partners" p WHERE p."section_id" = s."id"), '[]'::jsonb))
WHERE EXISTS (SELECT 1 FROM "cms_partners" p WHERE p."section_id" = s."id");

UPDATE "cms_sections" s
SET "extra_content" = COALESCE(s."extra_content", '{}'::jsonb) || jsonb_build_object('items', COALESCE((
  SELECT jsonb_agg(jsonb_build_object(
      'id', c."id", 'hidden', NOT c."is_active", 'number', c."number",
      'conventionalTitleId', c."conventional_title_id", 'conventionalTitleEn', c."conventional_title_en",
      'conventionalDescId', c."conventional_desc_id", 'conventionalDescEn', c."conventional_desc_en",
      'diagnovaTitleId', c."diagnova_title_id", 'diagnovaTitleEn', c."diagnova_title_en",
      'diagnovaDescId', c."diagnova_desc_id", 'diagnovaDescEn', c."diagnova_desc_en",
      'impactMetric', c."impact_metric"
    ) ORDER BY c."sort_order", c."created_at")
  FROM "cms_comparison_items" c WHERE c."section_id" = s."id"), '[]'::jsonb))
WHERE EXISTS (SELECT 1 FROM "cms_comparison_items" c WHERE c."section_id" = s."id");

UPDATE "cms_sections" s
SET "extra_content" = COALESCE(s."extra_content", '{}'::jsonb) || jsonb_build_object('items', COALESCE((
  SELECT jsonb_agg(jsonb_build_object(
      'id', t."id", 'hidden', NOT t."is_active", 'name', t."name",
      'roleId', t."role_id_text", 'roleEn', t."role_en_text", 'institution', t."institution",
      'quoteId', t."quote_id", 'quoteEn', t."quote_en", 'avatarUrl', t."avatar_url", 'rating', t."rating"
    ) ORDER BY t."sort_order", t."created_at")
  FROM "cms_testimonials" t WHERE t."section_id" = s."id"), '[]'::jsonb))
WHERE EXISTS (SELECT 1 FROM "cms_testimonials" t WHERE t."section_id" = s."id");

-- Validasi: jumlah item JSON = jumlah baris tabel anak yang terhubung ke section
DO $$
DECLARE a bigint; b bigint;
BEGIN
  SELECT count(*) INTO a FROM "cms_hero_slides" WHERE "section_id" IS NOT NULL;
  SELECT COALESCE(sum(jsonb_array_length("extra_content"->'slides')), 0) INTO b FROM "cms_sections" WHERE "extra_content" ? 'slides';
  IF a <> b THEN RAISE EXCEPTION 'Validasi CMS gagal: hero slides % baris vs % item JSON', a, b; END IF;

  SELECT count(*) INTO a FROM "cms_partners" WHERE "section_id" IS NOT NULL;
  SELECT COALESCE(sum(jsonb_array_length("extra_content"->'partners')), 0) INTO b FROM "cms_sections" WHERE "extra_content" ? 'partners';
  IF a <> b THEN RAISE EXCEPTION 'Validasi CMS gagal: partners % baris vs % item JSON', a, b; END IF;

  SELECT count(*) INTO a FROM "cms_comparison_items" WHERE "section_id" IS NOT NULL;
  SELECT COALESCE(sum(jsonb_array_length("extra_content"->'items')), 0) INTO b FROM "cms_sections" WHERE "section_key" = 'comparison';
  IF a <> b THEN RAISE EXCEPTION 'Validasi CMS gagal: comparison % baris vs % item JSON', a, b; END IF;

  SELECT count(*) INTO a FROM "cms_testimonials" WHERE "section_id" IS NOT NULL;
  SELECT COALESCE(sum(jsonb_array_length("extra_content"->'items')), 0) INTO b FROM "cms_sections" WHERE "section_key" = 'testimonials';
  IF a <> b THEN RAISE EXCEPTION 'Validasi CMS gagal: testimonials % baris vs % item JSON', a, b; END IF;

  SELECT (SELECT count(*) FROM "cms_hero_slides" WHERE "section_id" IS NULL)
       + (SELECT count(*) FROM "cms_partners" WHERE "section_id" IS NULL)
       + (SELECT count(*) FROM "cms_comparison_items" WHERE "section_id" IS NULL)
       + (SELECT count(*) FROM "cms_testimonials" WHERE "section_id" IS NULL) INTO a;
  IF a > 0 THEN
    RAISE NOTICE 'Info: % baris tabel anak CMS tanpa section (yatim, tidak pernah tampil) tidak dimigrasikan dan tetap di tabel lama.', a;
  END IF;
END $$;
