-- =====================================================================================
-- Restrukturisasi Users, Leads, Demo Access & Magic Link
-- Phase 4 (16 Nov 2026), diperkeras Phase 8.1 (temuan H-02, H-03, M-01, M-02, L-04, L-09 di
-- audit/execution/PHASE_8_DEEP_DATABASE_MIGRATION_AUDIT.md).
-- Referensi desain: PHASE_2_REVISION_WORKFLOW_AND_DESIGN.md §6–7, PHASE_0_DOCUMENTATION_REVIEW.md
--
-- Prinsip:
--  * Tidak ada DROP COLUMN / DROP TABLE. Kolom lama yang digantikan hanya DEPRECATE (tidak ditulis lagi).
--  * Konversi tipe memakai ALTER ... TYPE ... USING (data dipetakan, bukan dibuang).
--  * FAIL-CLOSED: seluruh precheck (bagian 0) berjalan SEBELUM perubahan schema/data. Data yang tidak dapat
--    dipetakan dengan aman -> RAISE EXCEPTION -> file ini dibatalkan utuh (transaksi per file migration).
--    Catatan: atomisitas berlaku PER FILE. Migration sebelumnya yang sudah sukses tidak ikut dibatalkan.
--  * Transformasi yang mengubah makna data dilaporkan dengan RAISE NOTICE (jumlah + id contoh).
--    Prisma tidak selalu menampilkan NOTICE; jalankan prisma/sql/precheck-restructure.sql (read-only)
--    sebelum migrasi untuk melihat laporan yang sama.
--  * Pemetaan role (H-02) — eksplisit, berdasarkan nama role pada schema lama:
--      'Super Admin'                          -> admin
--      'Demo User'                            -> user
--      'Sales Admin', 'Lab Staff', 'Pathologist' -> NULL (tanpa akses; sama dengan perilaku sejak hotfix
--                                                otorisasi; keputusan akhir OD-01 masih PENDING)
--      nama lain yang dipakai user            -> MIGRASI DIBATALKAN (butuh keputusan pemetaan)
-- =====================================================================================

-- ---------------------------------------------------------------------------
-- 0. Precheck (tanpa perubahan apa pun)
-- ---------------------------------------------------------------------------
DO $$
DECLARE
  n bigint;
  ids text;
BEGIN
  -- 0.1 Zona waktu (H-03). Kolom `timestamp` lama diasumsikan berisi waktu UTC (Prisma menulis UTC;
  --     DEFAULT CURRENT_TIMESTAMP mengikuti TimeZone server). Tanpa jaminan itu, konversi ke timestamptz
  --     dapat menggeser waktu secara diam-diam.
  IF current_setting('TimeZone') NOT IN ('UTC', 'Etc/UTC') THEN
    RAISE EXCEPTION 'Dibatalkan (H-03): TimeZone sesi/server = %, bukan UTC. Konversi timestamp mengasumsikan data tersimpan dalam UTC. Verifikasi zona waktu data lama dan siapkan migration khusus sebelum melanjutkan.', current_setting('TimeZone');
  END IF;

  -- 0.2 Status lead (OD-21)
  SELECT count(*), string_agg(id, ', ') INTO n, ids FROM (SELECT id FROM leads WHERE status NOT IN (1, 2, 3) ORDER BY id LIMIT 20) x;
  IF n > 0 THEN
    SELECT count(*) INTO n FROM leads WHERE status NOT IN (1, 2, 3);
    RAISE EXCEPTION 'Dibatalkan (OD-21): % lead berstatus di luar 1..3 (contoh id: %). Status 4 versi lama tidak dapat dipastikan sebagai konfirmasi demo dan wajib direview manual.', n, ids;
  END IF;

  -- 0.3 Status & email user
  SELECT count(*) INTO n FROM users WHERE status NOT IN (0, 1);
  IF n > 0 THEN
    RAISE EXCEPTION 'Dibatalkan: % user dengan status di luar 0/1.', n;
  END IF;

  SELECT count(*) INTO n FROM users WHERE email <> lower(email);
  IF n > 0 THEN
    RAISE EXCEPTION 'Dibatalkan: % user dengan email bukan huruf kecil (CHECK baru akan gagal). Normalisasi perlu keputusan (risiko duplikat).', n;
  END IF;

  -- 0.4 Pemetaan role (H-02) — role tak dikenal yang DIPAKAI user -> batal
  SELECT count(*), string_agg(DISTINCT r.name, ', ') INTO n, ids
  FROM users u JOIN roles r ON r.id = u.role_id
  WHERE r.name NOT IN ('Super Admin', 'Demo User', 'Sales Admin', 'Lab Staff', 'Pathologist');
  IF n > 0 THEN
    RAISE EXCEPTION 'Dibatalkan (H-02): % user memakai role yang tidak dikenali (%). Role tidak boleh dipetakan diam-diam; tetapkan pemetaan ke ADMIN/USER/tanpa akses (keputusan bisnis) lalu perbarui migration.', n, ids;
  END IF;

  SELECT string_agg(name, ', ') INTO ids FROM roles
  WHERE name NOT IN ('Super Admin', 'Demo User', 'Sales Admin', 'Lab Staff', 'Pathologist')
    AND NOT EXISTS (SELECT 1 FROM users u WHERE u.role_id = roles.id);
  IF ids IS NOT NULL THEN
    RAISE NOTICE 'Info (H-02): role tak dikenal tanpa user dibiarkan tanpa kode (tanpa akses): %', ids;
  END IF;

  -- Minimal satu ADMIN yang benar-benar dapat login setelah migrasi (hanya bila tabel users berisi data)
  IF EXISTS (SELECT 1 FROM users) THEN
    SELECT count(*) INTO n
    FROM users u JOIN roles r ON r.id = u.role_id
    WHERE r.name = 'Super Admin' AND u.status = 1 AND u.password_hash IS NOT NULL AND u.password_hash <> '';
    IF n = 0 THEN
      RAISE EXCEPTION 'Dibatalkan (H-02): tidak ada user aktif ber-role "Super Admin" dengan password. Setelah migrasi tidak akan ada ADMIN yang dapat login.';
    END IF;
    RAISE NOTICE 'Info (H-02): % user aktif akan menjadi ADMIN.', n;
  END IF;

  SELECT count(*) INTO n FROM users u JOIN roles r ON r.id = u.role_id WHERE r.name IN ('Sales Admin', 'Lab Staff', 'Pathologist');
  IF n > 0 THEN
    RAISE NOTICE 'Info (OD-01): % user ber-role lama (Sales Admin/Lab Staff/Pathologist) tetap ada tanpa akses (code NULL).', n;
  END IF;
  SELECT count(*) INTO n FROM users WHERE role_id IS NULL;
  IF n > 0 THEN
    RAISE NOTICE 'Info: % user tanpa role (tidak memiliki akses sebelum maupun sesudah migrasi).', n;
  END IF;

  -- 0.5 Durasi akses lama
  SELECT count(*), string_agg(id, ', ') INTO n, ids FROM (
    SELECT l.id FROM leads l
    WHERE l.user_id IS NOT NULL
      AND (l.approval_status = 'approved' OR EXISTS (SELECT 1 FROM demo_magic_links m WHERE m.lead_id = l.id))
      AND l.demo_duration_days NOT IN (3, 7, 14, 30)
    ORDER BY l.id LIMIT 20) x;
  IF n > 0 THEN
    RAISE EXCEPTION 'Dibatalkan: lead dengan akses demo berdurasi di luar 3/7/14/30 hari (contoh id: %). Perlu keputusan manual.', ids;
  END IF;

  -- 0.6 Magic link (L-04)
  SELECT count(*) INTO n FROM demo_magic_links m JOIN leads l ON l.id = m.lead_id WHERE l.user_id IS NULL;
  IF n > 0 THEN
    RAISE EXCEPTION 'Dibatalkan: % magic link milik lead tanpa akun USER (tidak dapat dipetakan ke demo_accesses).', n;
  END IF;

  SELECT count(*), string_agg('link ' || id || ' / lead ' || lead_id, '; ') INTO n, ids FROM (
    SELECT m.id, m.lead_id FROM demo_magic_links m JOIN leads l ON l.id = m.lead_id
    WHERE m.user_id IS NOT NULL AND m.user_id IS DISTINCT FROM l.user_id
    ORDER BY m.id LIMIT 20) x;
  IF n > 0 THEN
    RAISE EXCEPTION 'Dibatalkan (L-04): magic link terikat ke user yang berbeda dari user lead (%). Setelah migrasi tautan akan login ke akun lead; telusuri sebelum melanjutkan.', ids;
  END IF;

  SELECT count(*) INTO n FROM demo_magic_links WHERE user_id IS NULL;
  IF n > 0 THEN
    RAISE NOTICE 'Info (L-04): % magic link tanpa user_id (akun terhapus); dipetakan ke akun pada lead terkait.', n;
  END IF;

  -- 0.7 Aktivasi demo lama tanpa lead kandidat (M-02) -> riwayat akses akan hilang -> batal
  SELECT count(*), string_agg(id, ', ') INTO n, ids FROM (
    SELECT u.id FROM users u
    WHERE u.demo_activated_at IS NOT NULL
      AND NOT EXISTS (
        SELECT 1 FROM leads l
        WHERE l.user_id = u.id
          AND (l.approval_status = 'approved' OR EXISTS (SELECT 1 FROM demo_magic_links m WHERE m.lead_id = l.id)))
    ORDER BY u.id LIMIT 20) x;
  IF n > 0 THEN
    RAISE EXCEPTION 'Dibatalkan (M-02): user dengan aktivasi demo lama tanpa lead yang dapat dipetakan (contoh user id: %). Riwayat akses tidak boleh hilang; tentukan lead terkait secara manual.', ids;
  END IF;

  -- 0.8 Masa berlaku lama vs hasil perhitungan ulang (M-02). Periode baru WAJIB activated_at + durasi*24 jam
  --     (CHECK); bila masa berlaku lama berbeda, masa akses pengguna akan berubah -> batal.
  SELECT count(*), string_agg('user ' || user_id || ' / lead ' || lead_id || ' selisih ' || delta, '; ') INTO n, ids FROM (
    SELECT c.user_id, c.lead_id,
           COALESCE((u.demo_expires_at - (u.demo_activated_at + make_interval(hours => c.duration_days * 24)))::text, 'expires NULL') AS delta
    FROM (
      SELECT l.id AS lead_id, l.user_id, l.demo_duration_days AS duration_days,
             row_number() OVER (
               PARTITION BY l.user_id
               ORDER BY EXISTS (SELECT 1 FROM demo_magic_links m WHERE m.lead_id = l.id AND m.used_at IS NOT NULL) DESC,
                        COALESCE(l.approved_at, l.updated_at) DESC
             ) AS rn
      FROM leads l
      WHERE l.user_id IS NOT NULL
        AND (l.approval_status = 'approved' OR EXISTS (SELECT 1 FROM demo_magic_links m WHERE m.lead_id = l.id))
    ) c
    JOIN users u ON u.id = c.user_id
    WHERE c.rn = 1 AND u.demo_activated_at IS NOT NULL
      AND u.demo_expires_at IS DISTINCT FROM u.demo_activated_at + make_interval(hours => c.duration_days * 24)
    ORDER BY c.user_id LIMIT 20) x;
  IF n > 0 THEN
    RAISE EXCEPTION 'Dibatalkan (M-02): masa berlaku demo lama berbeda dari aktivasi + durasi (%). Tentukan masa berlaku yang benar secara manual.', ids;
  END IF;

  SELECT count(*) INTO n FROM users WHERE demo_activated_at IS NOT NULL;
  IF n > 0 THEN
    RAISE NOTICE 'Info (M-02): % aktivasi demo lama dipindahkan ke demo_accesses dengan masa berlaku identik.', n;
  END IF;

  -- 0.9 Laporan transformasi yang mengubah makna (M-01, L-09) — tidak membatalkan
  SELECT count(*), string_agg(id, ', ') INTO n, ids FROM (
    SELECT l.id FROM leads l LEFT JOIN users u ON u.id = l.user_id
    WHERE l.status = 3 AND (u.id IS NULL OR u.demo_activated_at IS NULL)
    ORDER BY l.id LIMIT 20) x;
  IF n > 0 THEN
    SELECT count(*) INTO n FROM leads l LEFT JOIN users u ON u.id = l.user_id
    WHERE l.status = 3 AND (u.id IS NULL OR u.demo_activated_at IS NULL);
    RAISE NOTICE 'Info (M-01): % lead berstatus 3 (Jadwal Demo versi lama) tanpa login demo -> menjadi Dihubungi (contoh id: %).', n, ids;
  END IF;

  SELECT count(*), string_agg(id, ', ') INTO n, ids FROM (
    SELECT id FROM leads WHERE approval_status = 'approved' AND user_id IS NULL ORDER BY id LIMIT 20) x;
  IF n > 0 THEN
    SELECT count(*) INTO n FROM leads WHERE approval_status = 'approved' AND user_id IS NULL;
    RAISE NOTICE 'Info (L-09): % lead berstatus approved tanpa akun USER; tidak dibuatkan periode akses dan tidak dibuatkan user otomatis (contoh id: %).', n, ids;
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
      CHECK ("expires_at" IS NULL OR "expires_at" = "activated_at" + make_interval(hours => "duration_days" * 24)),
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
       THEN u."demo_activated_at" + make_interval(hours => c.duration_days * 24) END,
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
