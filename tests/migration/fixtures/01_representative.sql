-- Fixture representatif (dijalankan setelah 00_base.sql) — mencakup setiap cabang backfill yang VALID.
-- Seluruh timestamp ditulis eksplisit dalam UTC (kolom `timestamp without time zone`, sama seperti Prisma).

-- Role tak dikenal yang TIDAK dipakai user -> NOTICE, dibiarkan tanpa kode
INSERT INTO roles (id, name, description, created_at) VALUES ('r_unknown_unused', 'Auditor Lama', 'fixture', '2026-10-01 00:00:00');

INSERT INTO users (id, name, email, password_hash, role_id, status, demo_duration_days, demo_activated_at, demo_expires_at, created_at, updated_at) VALUES
  -- role lama dikenali (OD-01): tetap ada, tanpa akses
  ('u_sales', 'Sales Lama', 'sales@fixture.example', 'fixture-not-a-real-hash', 'r_sales', 1, NULL, NULL, NULL, '2026-10-01 02:00:00', '2026-10-01 02:00:00'),
  ('u_lab',   'Lab Lama',   'lab@fixture.example',   'fixture-not-a-real-hash', 'r_lab',   0, NULL, NULL, NULL, '2026-10-01 02:00:00', '2026-10-01 02:00:00'),
  -- USER sudah aktivasi (status 3 + aktivasi) — 7 hari
  ('u3', 'Klien Tiga', 'klien3@fixture.example', NULL, 'r_demo', 1, 7, '2026-11-10 08:00:00', '2026-11-17 08:00:00', '2026-11-01 00:00:00', '2026-11-10 08:00:00'),
  -- USER belum aktivasi (status 3 tanpa aktivasi -> M-01)
  ('u4', 'Klien Empat', 'klien4@fixture.example', NULL, 'r_demo', 1, NULL, NULL, NULL, '2026-11-01 00:00:00', '2026-11-01 00:00:00'),
  -- USER dengan dua lead; aktivasi milik lead yang tautannya dipakai — 14 hari
  ('u5', 'Klien Lima', 'klien5@fixture.example', NULL, 'r_demo', 1, 14, '2026-11-12 09:30:00', '2026-11-26 09:30:00', '2026-11-01 00:00:00', '2026-11-12 09:30:00'),
  -- USER tanpa lead & tanpa aktivasi
  ('u6', 'Klien Enam', 'klien6@fixture.example', NULL, 'r_demo', 1, NULL, NULL, NULL, '2026-11-01 00:00:00', '2026-11-01 00:00:00'),
  -- USER nonaktif, 30 hari, tautan pernah dicabut gaya hotfix (expires_at dimajukan)
  ('u8', 'Klien Delapan', 'klien8@fixture.example', NULL, 'r_demo', 0, NULL, NULL, NULL, '2026-11-01 00:00:00', '2026-11-01 00:00:00'),
  -- user tanpa role
  ('u9', 'Tanpa Role', 'norole@fixture.example', NULL, NULL, 1, NULL, NULL, NULL, '2026-11-01 00:00:00', '2026-11-01 00:00:00'),
  -- USER pada lead yang ditolak setelah diberi tautan
  ('u10', 'Klien Sepuluh', 'klien10@fixture.example', NULL, 'r_demo', 1, NULL, NULL, NULL, '2026-11-01 00:00:00', '2026-11-01 00:00:00');

INSERT INTO leads (id, user_id, name, institution, "jobTitle", email, phone, institution_type, status, approval_status, approved_at, approved_by,
                   requested_demo_date, demo_duration_days, created_at, updated_at) VALUES
  ('L1',  NULL,  'Lead Satu',   'RS A', 'Lab', 'lead1@fixture.example',   '0811', 'hospital',     1, 'pending',  NULL, NULL, '2026-12-01 00:00:00', 3, '2026-10-01 10:00:00', '2026-10-01 10:00:00'),
  ('L2',  NULL,  'Lead Dua',    'RS B', 'Lab', 'lead2@fixture.example',   '0812', 'clinical-lab', 2, 'pending',  NULL, NULL, NULL,                  3, '2026-10-02 10:00:00', '2026-10-02 10:00:00'),
  ('L3',  'u3',  'Lead Tiga',   'RS C', 'Lab', 'klien3@fixture.example',  '0813', 'hospital',     3, 'approved', '2026-11-09 00:00:00', 'Admin', NULL, 7,  '2026-11-01 00:00:00', '2026-11-10 08:00:00'),
  ('L4',  'u4',  'Lead Empat',  'RS D', 'Lab', 'klien4@fixture.example',  '0814', 'hospital',     3, 'approved', '2026-11-09 00:00:00', 'Admin', NULL, 7,  '2026-11-01 00:00:00', '2026-11-09 00:00:00'),
  ('L5a', 'u5',  'Lead Lima A', 'RS E', 'Lab', 'klien5@fixture.example',  '0815', 'hospital',     2, 'approved', '2026-11-01 12:00:00', 'Admin', NULL, 3,  '2026-10-20 00:00:00', '2026-11-01 12:00:00'),
  ('L5b', 'u5',  'Lead Lima B', 'RS E', 'Lab', 'klien5@fixture.example',  '0815', 'hospital',     3, 'approved', '2026-11-11 12:00:00', 'Admin', NULL, 14, '2026-11-05 00:00:00', '2026-11-12 09:30:00'),
  ('L7',  NULL,  'Lead Tujuh',  'RS F', 'Lab', 'lead7@fixture.example',   '0817', 'other',        2, 'approved', '2026-11-03 00:00:00', 'Admin', NULL, 7,  '2026-11-01 00:00:00', '2026-11-03 00:00:00'),
  ('L8',  'u8',  'Lead Delapan','RS G', 'Lab', 'klien8@fixture.example',  '0818', 'blood-bank',   2, 'approved', '2026-11-04 00:00:00', 'Admin', NULL, 30, '2026-11-01 00:00:00', '2026-11-04 00:00:00'),
  ('L10', 'u10', 'Lead Sepuluh','RS H', 'Lab', 'klien10@fixture.example', '0820', 'hospital',     2, 'rejected', '2026-11-06 00:00:00', 'Admin', NULL, 7,  '2026-11-01 00:00:00', '2026-11-06 00:00:00');

INSERT INTO demo_magic_links (id, token_hash, email, lead_id, user_id, expires_at, used_at, created_at) VALUES
  ('k3',  repeat('3', 64), 'klien3@fixture.example',  'L3',  'u3',  '2026-11-10 09:00:00', '2026-11-10 08:00:00', '2026-11-09 09:00:00'),
  ('k4',  repeat('4', 64), 'klien4@fixture.example',  'L4',  'u4',  '2099-01-01 00:00:00', NULL,                  '2026-11-09 00:00:00'),
  ('k4n', repeat('a', 64), 'klien4@fixture.example',  'L4',  NULL,  '2026-11-08 00:00:00', NULL,                  '2026-11-07 00:00:00'),
  ('k5a', repeat('5', 64), 'klien5@fixture.example',  'L5a', 'u5',  '2026-11-02 12:00:00', NULL,                  '2026-11-01 12:00:00'),
  ('k5b', repeat('6', 64), 'klien5@fixture.example',  'L5b', 'u5',  '2026-11-12 12:00:00', '2026-11-12 09:30:00', '2026-11-11 12:00:00'),
  ('k8',  repeat('8', 64), 'klien8@fixture.example',  'L8',  'u8',  '2026-11-04 00:00:00', NULL,                  '2026-11-04 00:00:00'),
  ('k10', repeat('9', 64), 'klien10@fixture.example', 'L10', 'u10', '2099-01-01 00:00:00', NULL,                  '2026-11-05 00:00:00');

INSERT INTO audit_logs (id, user_id, action, entity, record_id, ip_address, created_at) VALUES
  ('a1', 'u_admin', 'LOGIN_SUCCESS', 'User', 'u_admin', '10.0.0.1', '2026-11-01 00:00:00'),
  ('a2', NULL,      'LOGIN_FAILED',  'User', NULL,      '10.0.0.2', '2026-11-01 00:01:00');

-- CMS (pola lama: kolom + tabel anak)
INSERT INTO cms_sections (id, section_key, badge_id, badge_en, title_id, title_en, extra_content, is_published, updated_by, created_at, updated_at) VALUES
  ('s_hero', 'hero', 'Badge', 'Badge', 'Judul', 'Title', NULL, true, 'u_admin', '2026-10-01 00:00:00', '2026-10-01 00:00:00'),
  ('s_trusted', 'trusted_by', NULL, NULL, 'Mitra', 'Partners', NULL, true, 'user-yang-sudah-tidak-ada', '2026-10-01 00:00:00', '2026-10-01 00:00:00'),
  ('s_cmp', 'comparison', NULL, NULL, 'Banding', 'Compare', '{"diagnovaBadgeId":"Diagnova"}', true, NULL, '2026-10-01 00:00:00', '2026-10-01 00:00:00'),
  ('s_testi', 'testimonials', NULL, NULL, 'Testimoni', 'Testimonials', '{"readMoreLabelId":"Baca"}', false, NULL, '2026-10-01 00:00:00', '2026-10-01 00:00:00');

INSERT INTO cms_hero_slides (id, section_id, title_id, title_en, image_url, image_alt, sort_order, is_active, created_at, updated_at) VALUES
  ('h2', 's_hero', 'Slide Dua', 'Slide Two', '/images/2.webp', 'dua', 2, false, '2026-10-01 00:00:00', '2026-10-01 00:00:00'),
  ('h1', 's_hero', 'Slide Satu', 'Slide One', '/images/1.webp', NULL, 1, true, '2026-10-01 00:00:00', '2026-10-01 00:00:00');
INSERT INTO cms_partners (id, section_id, name, logo_url, sort_order, is_active, created_at, updated_at) VALUES
  ('p1', 's_trusted', 'Mitra A', '/images/a.png', 0, true, '2026-10-01 00:00:00', '2026-10-01 00:00:00');
INSERT INTO cms_comparison_items (id, section_id, number, conventional_title_id, conventional_title_en, conventional_desc_id, conventional_desc_en,
                                  diagnova_title_id, diagnova_title_en, diagnova_desc_id, diagnova_desc_en, impact_metric, sort_order, is_active, created_at, updated_at) VALUES
  ('c1', 's_cmp', '01', 'Lama', 'Old', 'Desk lama', 'Old desc', 'Baru', 'New', 'Desk baru', 'New desc', '70%', 0, true, '2026-10-01 00:00:00', '2026-10-01 00:00:00');
INSERT INTO cms_testimonials (id, section_id, name, role_id_text, role_en_text, institution, quote_id, quote_en, rating, sort_order, is_active, created_at, updated_at) VALUES
  ('t1', 's_testi', 'Dr. Fixture', 'Kepala Lab', 'Head of Lab', 'RS Z', 'Bagus', 'Great', 4, 0, true, '2026-10-01 00:00:00', '2026-10-01 00:00:00');

-- LIS (harus tidak berubah sama sekali)
INSERT INTO physicians (id, external_code, name, specialization, department, created_at, updated_at) VALUES
  ('ph1', 'DR-FX-1', 'dr. Fixture', 'Sp.PK', 'Lab', '2026-10-01 00:00:00', '2026-10-01 00:00:00');
INSERT INTO patients (id, mrn, national_id, name, birth_date, sex, phone, address, created_at, updated_at) VALUES
  ('pt1', 'MRN-FX-1', '0000000000000001', 'Pasien Sintetis', '1990-01-01 00:00:00', 'female', '0800', 'Alamat sintetis', '2026-10-01 00:00:00', '2026-10-01 00:00:00');
INSERT INTO test_catalogs (id, code, name, category, specimen_type, tube_color, unit, tat_minutes, is_active, created_at, updated_at) VALUES
  ('tc1', 'FX_CBC', 'CBC Fixture', 'Hematologi', 'whole_blood', 'lavender_edta', 'x10^3/uL', 60, true, '2026-10-01 00:00:00', '2026-10-01 00:00:00');
INSERT INTO lab_orders (id, order_number, patient_id, physician_id, source_location, priority, clinical_notes, status, ordered_at, created_at, updated_at) VALUES
  ('o1', 'ORD-FX-1', 'pt1', 'ph1', 'IGD', 'cito', 'catatan', 'ordered', '2026-11-01 03:00:00', '2026-11-01 03:00:00', '2026-11-01 03:00:00');
INSERT INTO lab_order_items (id, order_id, test_catalog_id, created_at) VALUES ('oi1', 'o1', 'tc1', '2026-11-01 03:00:00');
INSERT INTO specimens (id, barcode_number, order_id, specimen_type, tube_color, volume, collected_at, status, created_at, updated_at) VALUES
  ('sp1', 'SP-FX-1', 'o1', 'whole_blood', 'lavender_edta', '3.0 mL', '2026-11-01 03:05:00', 'collected', '2026-11-01 03:05:00', '2026-11-01 03:05:00');
