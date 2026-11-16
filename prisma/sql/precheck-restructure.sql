-- =====================================================================================
-- PRECHECK READ-ONLY sebelum migration 20261116090100 & 20261116090200 (Phase 8.1)
-- Jalankan pada database LAMA (schema main @ c944f9a) SEBELUM baseline/deploy:
--   psql "<url>" -v ON_ERROR_STOP=1 -f prisma/sql/precheck-restructure.sql
-- Tidak mengubah apa pun (seluruh query dalam transaksi READ ONLY).
-- Hasil: satu baris per pemeriksaan. severity BLOCKER > 0 => migration PASTI dibatalkan oleh precheck-nya.
-- Logika identik dengan blok precheck di dalam migration (fail-closed).
-- =====================================================================================
BEGIN TRANSACTION READ ONLY;

WITH candidates AS (
  SELECT l.id AS lead_id, l.user_id, l.demo_duration_days AS duration_days,
         row_number() OVER (
           PARTITION BY l.user_id
           ORDER BY EXISTS (SELECT 1 FROM demo_magic_links m WHERE m.lead_id = l.id AND m.used_at IS NOT NULL) DESC,
                    COALESCE(l.approved_at, l.updated_at) DESC
         ) AS rn
  FROM leads l
  WHERE l.user_id IS NOT NULL
    AND (l.approval_status = 'approved' OR EXISTS (SELECT 1 FROM demo_magic_links m WHERE m.lead_id = l.id))
),
checks(check_id, severity, description, cnt, sample) AS (
  SELECT 'H-03 timezone', 'BLOCKER',
         'TimeZone sesi = ' || current_setting('TimeZone') || ' (wajib UTC)',
         CASE WHEN current_setting('TimeZone') IN ('UTC', 'Etc/UTC') THEN 0 ELSE 1 END::bigint, NULL::text
  UNION ALL
  SELECT 'H-01 objek di luar Prisma', 'BLOCKER',
         'CHECK constraint / trigger non-internal / function di schema public (DB hasil db push main harus 0; Prisma diff tidak melihatnya)',
         (SELECT count(*) FROM pg_constraint c WHERE c.connamespace = 'public'::regnamespace AND c.contype = 'c')
         + (SELECT count(*) FROM pg_trigger t JOIN pg_class r ON r.oid = t.tgrelid WHERE r.relnamespace = 'public'::regnamespace AND NOT t.tgisinternal)
         + (SELECT count(*) FROM pg_proc p WHERE p.pronamespace = 'public'::regnamespace),
         NULL
  UNION ALL
  SELECT 'OD-21 lead status', 'BLOCKER', 'Lead status di luar 1..3',
         (SELECT count(*) FROM leads WHERE status NOT IN (1, 2, 3)),
         (SELECT string_agg(id || ':' || status, ', ') FROM (SELECT id, status FROM leads WHERE status NOT IN (1, 2, 3) ORDER BY id LIMIT 20) x)
  UNION ALL
  SELECT 'users.status', 'BLOCKER', 'User status di luar 0/1',
         (SELECT count(*) FROM users WHERE status NOT IN (0, 1)), NULL
  UNION ALL
  SELECT 'users.email', 'BLOCKER', 'Email user bukan huruf kecil',
         (SELECT count(*) FROM users WHERE email <> lower(email)),
         (SELECT string_agg(id, ', ') FROM (SELECT id FROM users WHERE email <> lower(email) ORDER BY id LIMIT 20) x)
  UNION ALL
  SELECT 'H-02 role tak dikenal', 'BLOCKER', 'User memakai role di luar daftar pemetaan',
         (SELECT count(*) FROM users u JOIN roles r ON r.id = u.role_id
           WHERE r.name NOT IN ('Super Admin', 'Demo User', 'Sales Admin', 'Lab Staff', 'Pathologist')),
         (SELECT string_agg(DISTINCT r.name, ', ') FROM users u JOIN roles r ON r.id = u.role_id
           WHERE r.name NOT IN ('Super Admin', 'Demo User', 'Sales Admin', 'Lab Staff', 'Pathologist'))
  UNION ALL
  SELECT 'H-02 ADMIN tersedia', 'BLOCKER',
         'Tidak ada user aktif "Super Admin" ber-password (0 = aman; 1 = tidak ada ADMIN setelah migrasi)',
         CASE WHEN NOT EXISTS (SELECT 1 FROM users) THEN 0
              WHEN (SELECT count(*) FROM users u JOIN roles r ON r.id = u.role_id
                    WHERE r.name = 'Super Admin' AND u.status = 1 AND COALESCE(u.password_hash, '') <> '') > 0 THEN 0
              ELSE 1 END::bigint,
         'calon ADMIN: ' || (SELECT count(*) FROM users u JOIN roles r ON r.id = u.role_id
           WHERE r.name = 'Super Admin' AND u.status = 1 AND COALESCE(u.password_hash, '') <> '')
  UNION ALL
  SELECT 'durasi akses', 'BLOCKER', 'Lead dengan akses berdurasi di luar 3/7/14/30',
         (SELECT count(*) FROM candidates WHERE duration_days NOT IN (3, 7, 14, 30)),
         (SELECT string_agg(lead_id, ', ') FROM (SELECT lead_id FROM candidates WHERE duration_days NOT IN (3, 7, 14, 30) ORDER BY lead_id LIMIT 20) x)
  UNION ALL
  SELECT 'link tanpa user', 'BLOCKER', 'Magic link milik lead tanpa akun USER',
         (SELECT count(*) FROM demo_magic_links m JOIN leads l ON l.id = m.lead_id WHERE l.user_id IS NULL), NULL
  UNION ALL
  SELECT 'L-04 link user mismatch', 'BLOCKER', 'Magic link.user_id berbeda dari lead.user_id',
         (SELECT count(*) FROM demo_magic_links m JOIN leads l ON l.id = m.lead_id
           WHERE m.user_id IS NOT NULL AND m.user_id IS DISTINCT FROM l.user_id),
         (SELECT string_agg('link ' || id || ' / lead ' || lead_id, '; ') FROM (
            SELECT m.id, m.lead_id FROM demo_magic_links m JOIN leads l ON l.id = m.lead_id
            WHERE m.user_id IS NOT NULL AND m.user_id IS DISTINCT FROM l.user_id ORDER BY m.id LIMIT 20) x)
  UNION ALL
  SELECT 'M-02 aktivasi tanpa lead', 'BLOCKER', 'User dengan aktivasi demo lama tanpa lead kandidat',
         (SELECT count(*) FROM users u WHERE u.demo_activated_at IS NOT NULL
           AND NOT EXISTS (SELECT 1 FROM candidates c WHERE c.user_id = u.id)),
         (SELECT string_agg(id, ', ') FROM (SELECT u.id FROM users u WHERE u.demo_activated_at IS NOT NULL
           AND NOT EXISTS (SELECT 1 FROM candidates c WHERE c.user_id = u.id) ORDER BY u.id LIMIT 20) x)
  UNION ALL
  SELECT 'M-02 selisih masa berlaku', 'BLOCKER', 'demo_expires_at lama <> aktivasi + durasi*24 jam',
         (SELECT count(*) FROM candidates c JOIN users u ON u.id = c.user_id
           WHERE c.rn = 1 AND u.demo_activated_at IS NOT NULL
             AND u.demo_expires_at IS DISTINCT FROM u.demo_activated_at + make_interval(hours => c.duration_days * 24)),
         (SELECT string_agg('user ' || c.user_id || ' selisih ' || COALESCE((u.demo_expires_at - (u.demo_activated_at + make_interval(hours => c.duration_days * 24)))::text, 'expires NULL'), '; ')
            FROM candidates c JOIN users u ON u.id = c.user_id
           WHERE c.rn = 1 AND u.demo_activated_at IS NOT NULL
             AND u.demo_expires_at IS DISTINCT FROM u.demo_activated_at + make_interval(hours => c.duration_days * 24))
  UNION ALL
  SELECT 'M-01 status 3 tanpa login', 'INFO', 'Lead status 3 tanpa aktivasi -> menjadi Dihubungi',
         (SELECT count(*) FROM leads l LEFT JOIN users u ON u.id = l.user_id WHERE l.status = 3 AND (u.id IS NULL OR u.demo_activated_at IS NULL)),
         (SELECT string_agg(id, ', ') FROM (SELECT l.id FROM leads l LEFT JOIN users u ON u.id = l.user_id
           WHERE l.status = 3 AND (u.id IS NULL OR u.demo_activated_at IS NULL) ORDER BY l.id LIMIT 20) x)
  UNION ALL
  SELECT 'L-09 approved tanpa user', 'INFO', 'Lead approved tanpa akun USER (tidak dibuatkan akses/user)',
         (SELECT count(*) FROM leads WHERE approval_status = 'approved' AND user_id IS NULL),
         (SELECT string_agg(id, ', ') FROM (SELECT id FROM leads WHERE approval_status = 'approved' AND user_id IS NULL ORDER BY id LIMIT 20) x)
  UNION ALL
  SELECT 'OD-01 role lama', 'INFO', 'User ber-role Sales Admin/Lab Staff/Pathologist (tetap tanpa akses)',
         (SELECT count(*) FROM users u JOIN roles r ON r.id = u.role_id WHERE r.name IN ('Sales Admin', 'Lab Staff', 'Pathologist')), NULL
  UNION ALL
  SELECT 'L-03 link dicabut versi lama', 'INFO', 'Link belum dipakai yang expires_at-nya sudah lewat (termasuk yang dicabut hotfix) -> tercatat Berakhir, bukan Dicabut',
         (SELECT count(*) FROM demo_magic_links WHERE used_at IS NULL AND expires_at <= now()), NULL
  UNION ALL
  SELECT 'periode akses dibuat', 'INFO', 'Jumlah demo_accesses yang akan dibuat dari data lama',
         (SELECT count(*) FROM candidates), NULL
)
SELECT check_id, severity,
       CASE WHEN severity = 'BLOCKER' AND cnt > 0 THEN 'GAGAL' WHEN severity = 'BLOCKER' THEN 'LULUS' ELSE severity END AS hasil,
       cnt AS jumlah, description, sample AS contoh
FROM checks;

ROLLBACK;
