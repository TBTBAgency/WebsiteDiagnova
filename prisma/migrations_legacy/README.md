# Arsip migration lama (tidak dipakai)

Tiga migration di folder ini adalah riwayat awal project. Isinya **tidak diubah**, hanya dipindahkan dari
`prisma/migrations/` pada 2026-11-18.

Migration ini tidak lengkap: tabel seperti `cms_sections`, `demo_magic_links`, dan `roles` dibuat lewat `prisma db push`
sehingga tidak tercatat di sini. Sejak 2026-11-18 semua environment memakai satu baseline:
`prisma/migrations/20261117000000_baseline` (diuji di `docs/PHASE_14_BASELINE_MIGRATION_TEST.md`).

Jangan memindahkan folder ini kembali ke `prisma/migrations/`: baseline dan migration lama tidak boleh berdampingan
(lihat §4-C di dokumen pengujian).
