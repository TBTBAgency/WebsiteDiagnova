-- =====================================================================================
-- VERIFIKASI KATALOG PASCA-MIGRASI (read-only) — Phase 8.1 / temuan M-05
-- `prisma migrate diff` TIDAK memeriksa CHECK constraint, trigger, function, maupun validasi constraint.
-- Skrip ini memeriksa objek tersebut langsung dari katalog PostgreSQL.
--   psql "<url>" -v ON_ERROR_STOP=1 -f prisma/sql/verify-post-migration.sql
-- Hasil: satu baris per objek; kolom `hasil` harus OK untuk semua baris (baris terakhir = ringkasan).
-- =====================================================================================
BEGIN TRANSACTION READ ONLY;

WITH expected(kind, tbl, name, detail) AS (
  VALUES
  -- 11 CHECK constraint
  ('check', 'cms_sections',     'cms_sections_version_positive_chk', NULL),
  ('check', 'demo_accesses',    'demo_accesses_activation_pair_chk', NULL),
  ('check', 'demo_accesses',    'demo_accesses_duration_chk', NULL),
  ('check', 'demo_accesses',    'demo_accesses_expiry_chk', 'make_interval(hours'),
  ('check', 'demo_accesses',    'demo_accesses_not_self_extend_chk', NULL),
  ('check', 'demo_accesses',    'demo_accesses_revoke_pair_chk', NULL),
  ('check', 'demo_magic_links', 'demo_magic_links_used_or_revoked_chk', NULL),
  ('check', 'leads',            'leads_completion_after_start_chk', NULL),
  ('check', 'leads',            'leads_stage_completed_chk', NULL),
  ('check', 'leads',            'leads_stage_started_chk', NULL),
  ('check', 'users',            'users_email_lowercase_chk', NULL),
  -- Foreign key baru
  ('fk', 'demo_accesses',    'demo_accesses_lead_id_fkey', 'ON DELETE RESTRICT'),
  ('fk', 'demo_accesses',    'demo_accesses_user_id_fkey', 'ON DELETE RESTRICT'),
  ('fk', 'demo_accesses',    'demo_accesses_granted_by_id_fkey', 'ON DELETE RESTRICT'),
  ('fk', 'demo_accesses',    'demo_accesses_revoked_by_id_fkey', 'ON DELETE RESTRICT'),
  ('fk', 'demo_accesses',    'demo_accesses_extends_access_id_fkey', 'ON DELETE RESTRICT'),
  ('fk', 'demo_magic_links', 'demo_magic_links_demo_access_id_fkey', 'ON DELETE RESTRICT'),
  ('fk', 'leads',            'leads_demo_completed_by_id_fkey', 'ON DELETE RESTRICT'),
  ('fk', 'cms_sections',     'cms_sections_deleted_by_id_fkey', 'ON DELETE SET NULL'),
  ('fk', 'cms_sections',     'cms_sections_updated_by_id_fkey', 'ON DELETE SET NULL'),
  -- Index penting
  ('index', 'roles',            'roles_code_key', 'UNIQUE'),
  ('index', 'users',            'users_deleted_at_idx', NULL),
  ('index', 'leads',            'leads_confirmed_demo_date_idx', NULL),
  ('index', 'demo_accesses',    'demo_accesses_extends_access_id_key', 'UNIQUE'),
  ('index', 'demo_accesses',    'demo_accesses_lead_id_idx', NULL),
  ('index', 'demo_accesses',    'demo_accesses_user_id_revoked_at_idx', NULL),
  ('index', 'demo_accesses',    'demo_accesses_expires_at_idx', NULL),
  ('index', 'demo_magic_links', 'demo_magic_links_demo_access_id_idx', NULL),
  ('index', 'demo_magic_links', 'demo_magic_links_token_hash_key', 'UNIQUE'),
  ('index', 'audit_logs',       'audit_logs_action_created_at_idx', NULL),
  ('index', 'cms_sections',     'cms_sections_page_key_section_key_key', 'UNIQUE'),
  ('index', 'cms_sections',     'cms_sections_page_key_sort_order_idx', NULL),
  -- Objek yang HARUS sudah tidak ada
  ('absent_index', 'demo_magic_links', 'demo_magic_links_token_hash_idx', NULL),
  ('absent_index', 'cms_sections',     'cms_sections_section_key_key', NULL),
  -- Trigger & function audit
  ('trigger',  'audit_logs', 'audit_logs_append_only_row', NULL),
  ('trigger',  'audit_logs', 'audit_logs_append_only_truncate', NULL),
  ('function', NULL,         'audit_logs_block_mutation', NULL),
  -- Enum baru (nilai berurutan)
  ('enum', NULL, 'account_role',   'admin,user'),
  ('enum', NULL, 'account_status', 'active,inactive'),
  ('enum', NULL, 'lead_stage',     'contacted,scheduled,completed'),
  -- Kolom & default
  ('column', 'leads',            'status',         'lead_stage|NO|''contacted''::lead_stage'),
  ('column', 'users',            'status',         'account_status|NO|''active''::account_status'),
  ('column', 'users',            'deleted_at',     'timestamp with time zone|YES|'),
  ('column', 'roles',            'code',           'account_role|YES|'),
  ('column', 'leads',            'job_title',      'character varying|NO|'),
  ('column', 'demo_magic_links', 'demo_access_id', 'text|NO|'),
  ('column', 'demo_magic_links', 'lead_id',        'text|YES|'),
  ('column', 'cms_sections',     'page_key',       'character varying|NO|'),
  ('column', 'audit_logs',       'created_at',     'timestamp with time zone|NO|CURRENT_TIMESTAMP')
),
result AS (
  SELECT e.kind, COALESCE(e.tbl, '-') AS tbl, e.name,
    CASE e.kind
      WHEN 'check' THEN (SELECT CASE WHEN NOT c.convalidated THEN 'INVALID (NOT VALID)'
                                     WHEN e.detail IS NOT NULL AND position(e.detail IN pg_get_constraintdef(c.oid)) = 0 THEN 'BEDA DEFINISI'
                                     ELSE 'OK' END
                         FROM pg_constraint c WHERE c.conname = e.name AND c.contype = 'c' AND c.conrelid = ('public.' || e.tbl)::regclass)
      WHEN 'fk' THEN (SELECT CASE WHEN NOT c.convalidated THEN 'INVALID (NOT VALID)'
                                  WHEN position(e.detail IN pg_get_constraintdef(c.oid)) = 0 THEN 'BEDA ON DELETE'
                                  ELSE 'OK' END
                      FROM pg_constraint c WHERE c.conname = e.name AND c.contype = 'f' AND c.conrelid = ('public.' || e.tbl)::regclass)
      WHEN 'index' THEN (SELECT CASE WHEN NOT i.indisvalid THEN 'INVALID'
                                     WHEN e.detail = 'UNIQUE' AND NOT i.indisunique THEN 'BUKAN UNIQUE'
                                     ELSE 'OK' END
                         FROM pg_class ic JOIN pg_index i ON i.indexrelid = ic.oid
                         WHERE ic.relname = e.name AND ic.relnamespace = 'public'::regnamespace)
      WHEN 'absent_index' THEN CASE WHEN EXISTS (SELECT 1 FROM pg_class WHERE relname = e.name AND relnamespace = 'public'::regnamespace)
                                    THEN 'MASIH ADA' ELSE 'OK' END
      WHEN 'trigger' THEN (SELECT CASE WHEN t.tgenabled = 'D' THEN 'DISABLED' ELSE 'OK' END
                           FROM pg_trigger t WHERE t.tgname = e.name AND t.tgrelid = ('public.' || e.tbl)::regclass AND NOT t.tgisinternal)
      WHEN 'function' THEN (SELECT CASE WHEN position('audit_maintenance' IN p.prosrc) > 0 THEN 'MASIH ADA BYPASS GUC'
                                        WHEN position('diagnova_audit_maintainer' IN p.prosrc) = 0 THEN 'BEDA DEFINISI'
                                        ELSE 'OK' END
                            FROM pg_proc p WHERE p.proname = e.name AND p.pronamespace = 'public'::regnamespace)
      WHEN 'enum' THEN (SELECT CASE WHEN string_agg(en.enumlabel, ',' ORDER BY en.enumsortorder) = e.detail THEN 'OK'
                                    ELSE 'BEDA NILAI: ' || string_agg(en.enumlabel, ',' ORDER BY en.enumsortorder) END
                        FROM pg_type t JOIN pg_enum en ON en.enumtypid = t.oid
                        WHERE t.typname = e.name AND t.typnamespace = 'public'::regnamespace)
      WHEN 'column' THEN (SELECT CASE WHEN (CASE WHEN col.data_type = 'USER-DEFINED' THEN col.udt_name ELSE col.data_type END)
                                               || '|' || col.is_nullable || '|' || COALESCE(col.column_default, '') = e.detail
                                          THEN 'OK'
                                          ELSE 'BEDA: ' || (CASE WHEN col.data_type = 'USER-DEFINED' THEN col.udt_name ELSE col.data_type END)
                                               || '|' || col.is_nullable || '|' || COALESCE(col.column_default, '') END
                          FROM information_schema.columns col
                          WHERE col.table_schema = 'public' AND col.table_name = e.tbl AND col.column_name = e.name)
    END AS hasil
  FROM expected e
)
SELECT kind, tbl, name, COALESCE(hasil, 'TIDAK ADA') AS hasil FROM result
UNION ALL
SELECT 'RINGKASAN', '-', count(*) || ' objek diperiksa',
       CASE WHEN count(*) FILTER (WHERE COALESCE(hasil, 'TIDAK ADA') <> 'OK') = 0 THEN 'OK'
            ELSE count(*) FILTER (WHERE COALESCE(hasil, 'TIDAK ADA') <> 'OK') || ' GAGAL' END
FROM result;

ROLLBACK;
