-- =====================================================================================
-- ROLE & HAK AKSES DATABASE DIAGNOVA (Phase 8.1 / temuan H-06) — TEMPLATE DEPLOYMENT
--
-- JANGAN dijalankan otomatis. Dijalankan oleh DBA (superuser/role dengan CREATEROLE) sebagai langkah
-- deployment terpisah, SETELAH backup, pada database target:
--
--   psql "<url-superuser>/<db>" -v ON_ERROR_STOP=1 \
--        -v owner_password='<rahasia>' -v app_password='<rahasia>' \
--        -f prisma/sql/db-roles.sql
--
-- Password dikirim lewat variabel psql; file ini tidak berisi credential. Aman dijalankan ulang.
--
-- Model:
--   diagnova_owner            LOGIN  — pemilik seluruh objek schema public; HANYA dipakai `prisma migrate deploy`.
--   diagnova_app              LOGIN  — dipakai aplikasi (DATABASE_URL runtime). Bukan superuser, bukan pemilik.
--                                      DML biasa; audit_logs hanya SELECT + INSERT.
--   diagnova_audit_maintainer NOLOGIN — grup untuk retensi audit (OD-12): SELECT + DELETE audit_logs.
--                                      Trigger hanya mengizinkan DELETE bagi anggota grup ini.
--                                      Berikan ke login DBA tertentu: GRANT diagnova_audit_maintainer TO <dba>;
--
-- Batasan yang tetap ada (dinyatakan jujur): superuser dan diagnova_owner (pemilik tabel) tetap dapat
-- menonaktifkan/menghapus trigger. Kredensial kedua role itu harus disimpan terpisah dari aplikasi.
-- =====================================================================================

-- 1. Role
SELECT format('CREATE ROLE diagnova_owner LOGIN PASSWORD %L NOSUPERUSER NOCREATEDB NOCREATEROLE NOBYPASSRLS', :'owner_password')
WHERE NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'diagnova_owner') \gexec

SELECT format('CREATE ROLE diagnova_app LOGIN PASSWORD %L NOSUPERUSER NOCREATEDB NOCREATEROLE NOBYPASSRLS NOINHERIT', :'app_password')
WHERE NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'diagnova_app') \gexec

SELECT 'CREATE ROLE diagnova_audit_maintainer NOLOGIN'
WHERE NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'diagnova_audit_maintainer') \gexec

-- 2. Database & schema
SELECT format('GRANT CONNECT ON DATABASE %I TO diagnova_owner, diagnova_app', current_database()) \gexec
GRANT USAGE, CREATE ON SCHEMA public TO diagnova_owner;
GRANT USAGE ON SCHEMA public TO diagnova_app;
REVOKE CREATE ON SCHEMA public FROM PUBLIC;

-- 3. Pindahkan kepemilikan seluruh objek schema public ke diagnova_owner (aplikasi tidak boleh menjadi pemilik)
DO $$
DECLARE r record;
BEGIN
  FOR r IN SELECT c.relname, c.relkind FROM pg_class c
           WHERE c.relnamespace = 'public'::regnamespace AND c.relkind IN ('r', 'p', 'v', 'm', 'S', 'f') LOOP
    EXECUTE format('ALTER %s public.%I OWNER TO diagnova_owner',
                   CASE r.relkind WHEN 'S' THEN 'SEQUENCE' WHEN 'v' THEN 'VIEW' WHEN 'm' THEN 'MATERIALIZED VIEW'
                                  WHEN 'f' THEN 'FOREIGN TABLE' ELSE 'TABLE' END, r.relname);
  END LOOP;
  FOR r IN SELECT t.typname FROM pg_type t
           WHERE t.typnamespace = 'public'::regnamespace AND t.typtype = 'e' LOOP
    EXECUTE format('ALTER TYPE public.%I OWNER TO diagnova_owner', r.typname);
  END LOOP;
  FOR r IN SELECT p.oid::regprocedure AS sig FROM pg_proc p WHERE p.pronamespace = 'public'::regnamespace LOOP
    EXECUTE format('ALTER FUNCTION %s OWNER TO diagnova_owner', r.sig);
  END LOOP;
END $$;

-- 4. Hak aplikasi: DML biasa, kecuali audit_logs (append-only) dan metadata migration
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO diagnova_app;
REVOKE UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.audit_logs FROM diagnova_app;
REVOKE ALL ON public._prisma_migrations FROM diagnova_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO diagnova_app;

-- Tabel baru dari migration berikutnya otomatis mendapat DML untuk aplikasi.
-- PERHATIAN: bila kelak ada tabel append-only baru, REVOKE UPDATE/DELETE harus ditambahkan secara eksplisit.
ALTER DEFAULT PRIVILEGES FOR ROLE diagnova_owner IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO diagnova_app;
ALTER DEFAULT PRIVILEGES FOR ROLE diagnova_owner IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO diagnova_app;

-- 5. Maintainer audit (retensi): hanya baca & hapus; UPDATE/TRUNCATE tetap ditolak trigger
GRANT USAGE ON SCHEMA public TO diagnova_audit_maintainer;
GRANT SELECT, DELETE ON public.audit_logs TO diagnova_audit_maintainer;

-- 6. Ringkasan untuk diperiksa DBA
SELECT r.rolname, r.rolsuper, r.rolcanlogin, r.rolbypassrls,
       has_table_privilege(r.rolname, 'public.audit_logs', 'UPDATE') AS audit_update,
       has_table_privilege(r.rolname, 'public.audit_logs', 'DELETE') AS audit_delete,
       has_table_privilege(r.rolname, 'public.audit_logs', 'TRUNCATE') AS audit_truncate,
       (SELECT tableowner FROM pg_tables WHERE schemaname = 'public' AND tablename = 'audit_logs') = r.rolname AS owns_audit
FROM pg_roles r
WHERE r.rolname IN ('diagnova_owner', 'diagnova_app', 'diagnova_audit_maintainer')
ORDER BY r.rolname;
