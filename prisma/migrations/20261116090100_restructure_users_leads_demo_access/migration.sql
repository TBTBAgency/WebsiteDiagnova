-- =====================================================================================
-- Restrukturisasi Users, Leads, Demo Access & Magic Link (Phase 4, 16 Nov 2026)
-- Referensi: PHASE_2_REVISION_WORKFLOW_AND_DESIGN.md §6–7, PHASE_0_DOCUMENTATION_REVIEW.md (K-01..K-09)
--
-- Prinsip:
--  * Tidak ada DROP COLUMN / DROP TABLE. Kolom lama yang digantikan hanya DEPRECATE (tidak ditulis lagi).
--  * Konversi tipe memakai ALTER ... TYPE ... USING (data dipetakan, bukan dibuang).
--  * Precheck menghentikan migration (tanpa perubahan apa pun) bila ada data yang tidak dapat
--    dipetakan dengan aman, mis. lead berstatus 4 (OD-21: wajib review manual).
--  * Seluruh file berjalan dalam satu transaksi (Prisma Migrate); gagal = rollback total.
-- =====================================================================================

-- ---------------------------------------------------------------------------
-- 0. Precheck
-- ---------------------------------------------------------------------------
DO $$
DECLARE n bigint;
BEGIN
  SELECT count(*) INTO n FROM leads WHERE status NOT IN (1, 2, 3);
  IF n > 0 THEN
    RAISE EXCEPTION 'Dibatalkan: % lead berstatus di luar 1..3. Status 4 (Selesai versi lama) tidak dapat dipastikan sebagai konfirmasi demo dan wajib direview manual (OD-21).', n;
  END IF;

  SELECT count(*) INTO n FROM users WHERE status NOT IN (0, 1);
  IF n > 0 THEN
    RAISE EXCEPTION 'Dibatalkan: % user dengan status di luar 0/1.', n;
  END IF;

  SELECT count(*) INTO n FROM users WHERE email <> lower(email);
  IF n > 0 THEN
    RAISE EXCEPTION 'Dibatalkan: % user dengan email bukan huruf kecil (CHECK baru akan gagal).', n;
  END IF;

  SELECT count(*) INTO n
  FROM leads l
  WHERE l.user_id IS NOT NULL
    AND (l.approval_status = 'approved' OR EXISTS (SELECT 1 FROM demo_magic_links m WHERE m.lead_id = l.id))
    AND l.demo_duration_days NOT IN (3, 7, 14, 30);
  IF n > 0 THEN
    RAISE EXCEPTION 'Dibatalkan: % lead dengan akses demo berdurasi di luar 3/7/14/30 hari (perlu keputusan manual).', n;
  END IF;

  SELECT count(*) INTO n
  FROM demo_magic_links m JOIN leads l ON l.id = m.lead_id
  WHERE l.user_id IS NULL;
  IF n > 0 THEN
    RAISE EXCEPTION 'Dibatalkan: % magic link milik lead tanpa akun USER (tidak dapat dipetakan ke demo_accesses).', n;
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- 1. Enum baru
-- ---------------------------------------------------------------------------
CREATE TYPE "account_role" AS ENUM ('admin', 'user');
CREATE TYPE "account_status" AS ENUM ('active', 'inactive');
CREATE TYPE "lead_stage" AS ENUM ('contacted', 'scheduled', 'completed');

-- ---------------------------------------------------------------------------
-- 2. roles: kode role ADMIN/USER. Role lama tetap ada dengan code NULL (tanpa akses, OD-01).
-- ---------------------------------------------------------------------------
ALTER TABLE "roles" ADD COLUMN "code" "account_role";
ALTER TABLE "roles" ALTER COLUMN "created_at" TYPE TIMESTAMPTZ(3) USING "created_at" AT TIME ZONE 'UTC';

INSERT INTO "roles" ("id", "name", "description", "code")
VALUES ('role_admin', 'Super Admin', 'ADMIN — mengelola sistem dan permohonan demo', 'admin'),
       ('role_user', 'Demo User', 'USER — akun demo calon klien (login via magic link)', 'user')
ON CONFLICT ("name") DO UPDATE SET "code" = EXCLUDED."code";

CREATE UNIQUE INDEX "roles_code_key" ON "roles"("code");

-- ---------------------------------------------------------------------------
-- 3. users
-- ---------------------------------------------------------------------------
ALTER TABLE "users"
  ALTER COLUMN "demo_activated_at" TYPE TIMESTAMPTZ(3) USING "demo_activated_at" AT TIME ZONE 'UTC',
  ALTER COLUMN "demo_expires_at"   TYPE TIMESTAMPTZ(3) USING "demo_expires_at" AT TIME ZONE 'UTC',
  ALTER COLUMN "created_at"        TYPE TIMESTAMPTZ(3) USING "created_at" AT TIME ZONE 'UTC',
  ALTER COLUMN "updated_at"        TYPE TIMESTAMPTZ(3) USING "updated_at" AT TIME ZONE 'UTC';

ALTER TABLE "users" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "status" TYPE "account_status"
  USING (CASE "status" WHEN 1 THEN 'active' ELSE 'inactive' END)::"account_status";
ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT 'active';

ALTER TABLE "users" ADD COLUMN "deleted_at" TIMESTAMPTZ(3);
CREATE INDEX "users_deleted_at_idx" ON "users"("deleted_at");
ALTER TABLE "users" ADD CONSTRAINT "users_email_lowercase_chk" CHECK ("email" = lower("email"));

-- ---------------------------------------------------------------------------
-- 4. leads
-- ---------------------------------------------------------------------------
ALTER TABLE "leads" RENAME COLUMN "jobTitle" TO "job_title";

ALTER TABLE "leads"
  ALTER COLUMN "approved_at"         TYPE TIMESTAMPTZ(3) USING "approved_at" AT TIME ZONE 'UTC',
  ALTER COLUMN "requested_demo_date" TYPE TIMESTAMPTZ(3) USING "requested_demo_date" AT TIME ZONE 'UTC',
  ALTER COLUMN "confirmed_demo_date" TYPE TIMESTAMPTZ(3) USING "confirmed_demo_date" AT TIME ZONE 'UTC',
  ALTER COLUMN "demo_date"           TYPE TIMESTAMPTZ(3) USING "demo_date" AT TIME ZONE 'UTC',
  ALTER COLUMN "voucher_expiry"      TYPE TIMESTAMPTZ(3) USING "voucher_expiry" AT TIME ZONE 'UTC',
  ALTER COLUMN "created_at"          TYPE TIMESTAMPTZ(3) USING "created_at" AT TIME ZONE 'UTC',
  ALTER COLUMN "updated_at"          TYPE TIMESTAMPTZ(3) USING "updated_at" AT TIME ZONE 'UTC';

ALTER TABLE "leads"
  ADD COLUMN "demo_started_at"      TIMESTAMPTZ(3),
  ADD COLUMN "demo_completed_at"    TIMESTAMPTZ(3),
  ADD COLUMN "demo_completed_by_id" TEXT,
  ADD COLUMN "demo_completion_note" TEXT;

-- Status 3 (Jadwal Demo versi lama) hanya dipetakan ke 'scheduled' bila akun benar-benar pernah login
-- demo (users.demo_activated_at terisi). Di versi main, status 3 diset saat approve (belum login),
-- sehingga tanpa aktivasi -> 'contacted' (OD-03: Jadwal Demo = login demo pertama berhasil).
UPDATE "leads" l
SET "demo_started_at" = u."demo_activated_at"
FROM "users" u
WHERE l."status" = 3 AND u."id" = l."user_id" AND u."demo_activated_at" IS NOT NULL;

ALTER TABLE "leads" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "leads" ALTER COLUMN "status" TYPE "lead_stage"
  USING (CASE WHEN "status" = 3 AND "demo_started_at" IS NOT NULL THEN 'scheduled' ELSE 'contacted' END)::"lead_stage";
ALTER TABLE "leads" ALTER COLUMN "status" SET DEFAULT 'contacted';

ALTER TABLE "leads" ADD CONSTRAINT "leads_demo_completed_by_id_fkey"
  FOREIGN KEY ("demo_completed_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "leads" ADD CONSTRAINT "leads_stage_started_chk"
  CHECK (("status" = 'contacted') = ("demo_started_at" IS NULL));
ALTER TABLE "leads" ADD CONSTRAINT "leads_stage_completed_chk"
  CHECK (("status" = 'completed') = ("demo_completed_at" IS NOT NULL AND "demo_completed_by_id" IS NOT NULL));
ALTER TABLE "leads" ADD CONSTRAINT "leads_completion_after_start_chk"
  CHECK ("demo_completed_at" IS NULL OR "demo_completed_at" >= "demo_started_at");

CREATE INDEX "leads_confirmed_demo_date_idx" ON "leads"("confirmed_demo_date");

-- ---------------------------------------------------------------------------
-- 5. demo_accesses (periode akses demo; status diturunkan dari timestamp)
-- ---------------------------------------------------------------------------
CREATE TABLE "demo_accesses" (
    "id"                TEXT NOT NULL,
    "lead_id"           TEXT NOT NULL,
    "user_id"           TEXT NOT NULL,
    "duration_days"     INTEGER NOT NULL,
    "granted_at"        TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "granted_by_id"     TEXT,
    "activated_at"      TIMESTAMPTZ(3),
    "expires_at"        TIMESTAMPTZ(3),
    "revoked_at"        TIMESTAMPTZ(3),
    "revoked_by_id"     TEXT,
    "extends_access_id" TEXT,
    "created_at"        TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"        TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "demo_accesses_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "demo_accesses_duration_chk" CHECK ("duration_days" IN (3, 7, 14, 30)),
    CONSTRAINT "demo_accesses_activation_pair_chk" CHECK (("activated_at" IS NULL) = ("expires_at" IS NULL)),
    CONSTRAINT "demo_accesses_expiry_chk"
      CHECK ("expires_at" IS NULL OR "expires_at" = "activated_at" + make_interval(days => "duration_days")),
    CONSTRAINT "demo_accesses_revoke_pair_chk" CHECK ("revoked_by_id" IS NULL OR "revoked_at" IS NOT NULL),
    CONSTRAINT "demo_accesses_not_self_extend_chk" CHECK ("extends_access_id" IS NULL OR "extends_access_id" <> "id")
);

CREATE UNIQUE INDEX "demo_accesses_extends_access_id_key" ON "demo_accesses"("extends_access_id");
CREATE INDEX "demo_accesses_lead_id_idx" ON "demo_accesses"("lead_id");
CREATE INDEX "demo_accesses_user_id_revoked_at_idx" ON "demo_accesses"("user_id", "revoked_at");
CREATE INDEX "demo_accesses_expires_at_idx" ON "demo_accesses"("expires_at");

ALTER TABLE "demo_accesses" ADD CONSTRAINT "demo_accesses_lead_id_fkey"
  FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "demo_accesses" ADD CONSTRAINT "demo_accesses_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "demo_accesses" ADD CONSTRAINT "demo_accesses_granted_by_id_fkey"
  FOREIGN KEY ("granted_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "demo_accesses" ADD CONSTRAINT "demo_accesses_revoked_by_id_fkey"
  FOREIGN KEY ("revoked_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "demo_accesses" ADD CONSTRAINT "demo_accesses_extends_access_id_fkey"
  FOREIGN KEY ("extends_access_id") REFERENCES "demo_accesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Backfill: satu periode per lead yang pernah diberi akses (approved atau memiliki magic link).
-- Aktivasi (users.demo_activated_at) hanya dilekatkan ke SATU lead per user: lead yang tautannya
-- pernah dipakai, atau bila tidak ada, lead yang paling akhir disetujui.
WITH candidates AS (
  SELECT
    l."id" AS lead_id,
    l."user_id",
    l."demo_duration_days" AS duration_days,
    COALESCE(l."approved_at", l."updated_at") AS granted_at,
    CASE WHEN l."approval_status" = 'rejected' THEN l."updated_at" END AS revoked_at,
    row_number() OVER (
      PARTITION BY l."user_id"
      ORDER BY EXISTS (SELECT 1 FROM "demo_magic_links" m WHERE m."lead_id" = l."id" AND m."used_at" IS NOT NULL) DESC,
               COALESCE(l."approved_at", l."updated_at") DESC
    ) AS rn
  FROM "leads" l
  WHERE l."user_id" IS NOT NULL
    AND (l."approval_status" = 'approved' OR EXISTS (SELECT 1 FROM "demo_magic_links" m WHERE m."lead_id" = l."id"))
)
INSERT INTO "demo_accesses"
  ("id", "lead_id", "user_id", "duration_days", "granted_at", "granted_by_id",
   "activated_at", "expires_at", "revoked_at", "created_at", "updated_at")
SELECT
  'da_' || md5(c.lead_id),
  c.lead_id,
  c.user_id,
  c.duration_days,
  c.granted_at,
  NULL,
  CASE WHEN c.rn = 1 THEN u."demo_activated_at" END,
  CASE WHEN c.rn = 1 AND u."demo_activated_at" IS NOT NULL
       THEN u."demo_activated_at" + make_interval(days => c.duration_days) END,
  c.revoked_at,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM candidates c
JOIN "users" u ON u."id" = c.user_id;

-- ---------------------------------------------------------------------------
-- 6. demo_magic_links: terikat ke periode akses; pencabutan pakai revoked_at
-- ---------------------------------------------------------------------------
ALTER TABLE "demo_magic_links"
  ALTER COLUMN "expires_at" TYPE TIMESTAMPTZ(3) USING "expires_at" AT TIME ZONE 'UTC',
  ALTER COLUMN "used_at"    TYPE TIMESTAMPTZ(3) USING "used_at" AT TIME ZONE 'UTC',
  ALTER COLUMN "created_at" TYPE TIMESTAMPTZ(3) USING "created_at" AT TIME ZONE 'UTC';

ALTER TABLE "demo_magic_links"
  ADD COLUMN "demo_access_id" TEXT,
  ADD COLUMN "revoked_at" TIMESTAMPTZ(3);

UPDATE "demo_magic_links" m
SET "demo_access_id" = a."id"
FROM "demo_accesses" a
WHERE a."id" = 'da_' || md5(m."lead_id");

DO $$
DECLARE n bigint;
BEGIN
  SELECT count(*) INTO n FROM "demo_magic_links" WHERE "demo_access_id" IS NULL;
  IF n > 0 THEN
    RAISE EXCEPTION 'Dibatalkan: % magic link tidak terpetakan ke demo_accesses.', n;
  END IF;
END $$;

ALTER TABLE "demo_magic_links" ALTER COLUMN "demo_access_id" SET NOT NULL;
ALTER TABLE "demo_magic_links" ALTER COLUMN "lead_id" DROP NOT NULL;
ALTER TABLE "demo_magic_links" ADD CONSTRAINT "demo_magic_links_demo_access_id_fkey"
  FOREIGN KEY ("demo_access_id") REFERENCES "demo_accesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "demo_magic_links" ADD CONSTRAINT "demo_magic_links_used_or_revoked_chk"
  CHECK ("used_at" IS NULL OR "revoked_at" IS NULL);
CREATE INDEX "demo_magic_links_demo_access_id_idx" ON "demo_magic_links"("demo_access_id");

-- Index biasa yang redundan terhadap UNIQUE "demo_magic_links_token_hash_key" (bukan data)
DROP INDEX "demo_magic_links_token_hash_idx";

-- ---------------------------------------------------------------------------
-- 7. Validasi akhir
-- ---------------------------------------------------------------------------
DO $$
DECLARE n bigint;
BEGIN
  SELECT count(*) INTO n
  FROM "leads" l
  WHERE l."user_id" IS NOT NULL AND l."approval_status" = 'approved'
    AND NOT EXISTS (SELECT 1 FROM "demo_accesses" a WHERE a."lead_id" = l."id");
  IF n > 0 THEN
    RAISE EXCEPTION 'Validasi gagal: % lead approved tanpa demo_accesses.', n;
  END IF;

  SELECT count(*) INTO n FROM "leads" WHERE "status" = 'scheduled' AND "demo_started_at" IS NULL;
  IF n > 0 THEN
    RAISE EXCEPTION 'Validasi gagal: % lead scheduled tanpa demo_started_at.', n;
  END IF;
END $$;
