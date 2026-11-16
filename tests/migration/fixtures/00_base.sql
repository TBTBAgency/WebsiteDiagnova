-- Fixture dasar (schema LAMA = main @ c944f9a): role standar + satu ADMIN aktif ber-password.
-- Data SINTETIS. Tidak berisi data nyata. Nilai password_hash bukan hash yang dapat dipakai login.
INSERT INTO roles (id, name, description, created_at) VALUES
  ('r_super', 'Super Admin', 'fixture', '2026-10-01 00:00:00'),
  ('r_sales', 'Sales Admin', 'fixture', '2026-10-01 00:00:00'),
  ('r_lab',   'Lab Staff',   'fixture', '2026-10-01 00:00:00'),
  ('r_path',  'Pathologist', 'fixture', '2026-10-01 00:00:00'),
  ('r_demo',  'Demo User',   'fixture', '2026-10-01 00:00:00');

INSERT INTO users (id, name, email, password_hash, role_id, status, created_at, updated_at) VALUES
  ('u_admin', 'Admin Fixture', 'admin@fixture.example', 'fixture-not-a-real-hash', 'r_super', 1, '2026-10-01 01:00:00', '2026-10-01 01:00:00');
