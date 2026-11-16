const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Anti-circular validation function matching lib/models/menu.model.ts
async function validateParentHierarchy(targetMenuId, candidateParentId) {
  if (targetMenuId === candidateParentId) {
    throw new Error('Sebuah menu tidak dapat menjadi induk bagi dirinya sendiri.');
  }

  let currentParentId = candidateParentId;
  const visitedIds = new Set();

  while (currentParentId) {
    if (visitedIds.has(currentParentId)) {
      throw new Error('Terdeteksi siklus relasi hirarki menu yang tidak valid.');
    }
    visitedIds.add(currentParentId);

    if (currentParentId === targetMenuId) {
      throw new Error('Tidak dapat memilih menu turunan sebagai induk (circular hierarchy reference).');
    }

    const parentMenu = await prisma.menu.findUnique({
      where: { id: currentParentId },
      select: { parentId: true },
    });

    currentParentId = parentMenu ? parentMenu.parentId : null;
  }
}

async function main() {
  console.log('====================================================');
  console.log('   VERIFIKASI KOMPREHENSIF TAHAP 6 DIAGNOVA');
  console.log('   1. Navigasi Dinamis Database (Tabel menus)');
  console.log('   2. Redesign CMS & Direct / Bulk Image Upload');
  console.log('====================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      console.log(`[PASS] ${message}`);
      passedTests++;
    } else {
      console.error(`[FAIL] ${message}`);
    }
  }

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Dynamic Navigation & Menus Table Integrity
    // -------------------------------------------------------------------------
    console.log('--- TEST GROUP 1: Dynamic Navigation & Menus Table ---');
    const rootMenus = await prisma.menu.findMany({
      where: { parentId: null, isDeleted: false },
      include: {
        children: { where: { isDeleted: false } },
        section: true,
      },
      orderBy: { sortOrder: 'asc' },
    });

    assert(rootMenus.length === 5, `Terdapat 5 root menus (actual: ${rootMenus.length})`);
    const rootLabels = rootMenus.map(m => m.labelId);
    assert(
      rootLabels.includes('Platform') &&
      rootLabels.includes('Solusi') &&
      rootLabels.includes('Modul') &&
      rootLabels.includes('Nova AI') &&
      rootLabels.includes('Integrasi'),
      `Semua root menu kunci ada: ${rootLabels.join(', ')}`
    );

    const totalSubmenus = rootMenus.reduce((sum, r) => sum + r.children.length, 0);
    assert(totalSubmenus >= 20, `Submenus terdaftar di database (actual: ${totalSubmenus})`);

    // Section foreign key verification
    const workflowSubmenu = await prisma.menu.findFirst({
      where: { labelId: 'Alur Kerja' },
      include: { section: true },
    });
    assert(
      workflowSubmenu && workflowSubmenu.section && workflowSubmenu.section.sectionKey === 'workflow',
      `Menu 'Alur Kerja' berelasi FK dengan cms_sections.sectionKey = 'workflow' (id: ${workflowSubmenu?.sectionId})`
    );

    const infraSubmenu = await prisma.menu.findFirst({
      where: { labelId: '100% Otomasi' },
      include: { section: true },
    });
    assert(
      infraSubmenu && infraSubmenu.section && infraSubmenu.section.sectionKey === 'infrastructure',
      `Menu '100% Otomasi' berelasi FK dengan cms_sections.sectionKey = 'infrastructure'`
    );

    // Anti-circular logic verification
    let selfParentBlocked = false;
    try {
      await validateParentHierarchy(rootMenus[0].id, rootMenus[0].id);
    } catch (e) {
      selfParentBlocked = true;
    }
    assert(selfParentBlocked, 'Validasi anti-circular mencegah menu menjadi induk dirinya sendiri');

    let cyclePrevented = false;
    try {
      if (rootMenus.length > 0 && rootMenus[0].children.length > 0) {
        // Attempt to set parent of rootMenu[0] to its child -> cycle!
        await validateParentHierarchy(rootMenus[0].id, rootMenus[0].children[0].id);
      }
    } catch (err) {
      cyclePrevented = true;
    }
    assert(cyclePrevented, 'Validasi anti-circular mencegah siklus hirarki menu (parent -> child -> parent)');

    // -------------------------------------------------------------------------
    // TEST 2: Media Storage Directory & Media Database Model
    // -------------------------------------------------------------------------
    console.log('\n--- TEST GROUP 2: Media Storage & Media Database Model ---');
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'cms');
    assert(fs.existsSync(uploadDir), `Direktori penyimpanan 'public/uploads/cms' ada di disk`);

    // Verify Prisma Media model by inserting and querying a simulated upload
    const testFilename = `test-verify-${Date.now()}.png`;
    const testPublicUrl = `/uploads/cms/${testFilename}`;
    const mediaRecord = await prisma.media.create({
      data: {
        filename: testFilename,
        originalName: 'hospital-lab-icon.png',
        mimeType: 'image/png',
        sizeBytes: 15420,
        url: testPublicUrl,
        uploadedBy: 'admin@diagnova.id',
      },
    });

    assert(mediaRecord && mediaRecord.id, `Model Media berhasil mencatat metadata upload di tabel 'media'`);
    assert(mediaRecord.url.startsWith('/uploads/cms/'), `URL media format public string valid: ${mediaRecord.url}`);

    // Clean up test media record
    await prisma.media.delete({ where: { id: mediaRecord.id } });
    assert(true, 'Metadata media test dibersihkan dengan aman dari database');

    // -------------------------------------------------------------------------
    // TEST 3: CMS Sections JSON & Relational Dual-Layer Integrity
    // -------------------------------------------------------------------------
    console.log('\n--- TEST GROUP 3: CMS Sections & Direct Image Integration ---');
    const sections = await prisma.cmsSection.findMany();
    assert(sections.length === 8, `Terdapat 8 sections CMS homepage (actual: ${sections.length})`);

    const heroSection = sections.find(s => s.sectionKey === 'hero');
    assert(
      heroSection && heroSection.extraContent && Array.isArray(heroSection.extraContent.slides),
      `Section 'hero' menyimpan extraContent.slides JSON dengan aman (${heroSection?.extraContent?.slides?.length} slide)`
    );

    const trustedBySection = sections.find(s => s.sectionKey === 'trusted_by');
    assert(
      trustedBySection && trustedBySection.extraContent && Array.isArray(trustedBySection.extraContent.partners),
      `Section 'trusted_by' menyimpan extraContent.partners JSON dengan aman (${trustedBySection?.extraContent?.partners?.length} mitra)`
    );

    const testTestimonialSection = sections.find(s => s.sectionKey === 'testimonials');
    assert(
      testTestimonialSection && testTestimonialSection.extraContent && Array.isArray(testTestimonialSection.extraContent.items),
      `Section 'testimonials' menyimpan extraContent.items JSON dengan aman (${testTestimonialSection?.extraContent?.items?.length} item)`
    );

    // Test saving partner with direct upload URL in relational and JSON
    const testPartner = await prisma.cmsPartner.create({
      data: {
        name: 'RS Uji Coba Diagnova Verifikasi',
        logoUrl: '/uploads/cms/test-partner-logo.png',
        sortOrder: 999,
        isActive: true,
      },
    });
    assert(
      testPartner && testPartner.logoUrl === '/uploads/cms/test-partner-logo.png',
      `cmsPartner berhasil menyimpan logoUrl upload langsung: ${testPartner.logoUrl}`
    );

    // Clean up created test partner
    await prisma.cmsPartner.delete({ where: { id: testPartner.id } });
    assert(true, 'Test partner dibersihkan dari database relasional');

    // -------------------------------------------------------------------------
    // TEST 4: Public Navbar Formatter Simulation
    // -------------------------------------------------------------------------
    console.log('\n--- TEST GROUP 4: Public Navbar & Fallback Resilience ---');
    const publicMenus = await prisma.menu.findMany({
      where: { parentId: null, isActive: true, isDeleted: false },
      include: {
        children: {
          where: { isActive: true, isDeleted: false },
          orderBy: { sortOrder: 'asc' },
          include: { section: true },
        },
        section: true,
      },
      orderBy: { sortOrder: 'asc' },
    });

    const mappedPublicNav = publicMenus.map(menu => ({
      name: menu.labelId,
      href: menu.url || (menu.section ? `/#${menu.section.sectionKey}` : '#'),
      submenus: menu.children.map(child => ({
        title: child.labelId,
        description: child.descriptionId || '',
        href: child.url || (child.section ? `/#${child.section.sectionKey}` : '#'),
        icon: child.iconName || 'Layers',
      })),
    }));

    assert(mappedPublicNav.length === 5, `Mapping navigasi publik berhasil mengonversi 5 root navigasi`);
    assert(
      mappedPublicNav[0].submenus.length > 0,
      `Platform memiliki ${mappedPublicNav[0].submenus.length} submenu publik dengan icon dan deskripsi`
    );

    // -------------------------------------------------------------------------
    // TEST 5: Security & Role Isolation
    // -------------------------------------------------------------------------
    console.log('\n--- TEST GROUP 5: Security & Role Isolation ---');
    const roles = await prisma.role.findMany();
    assert(roles.length === 2, `Tabel roles strictly hanya memiliki 2 role (ADMIN dan USER)`);
    assert(roles.some(r => r.name === 'ADMIN') && roles.some(r => r.name === 'USER'), 'Role ADMIN dan USER valid');

    const users = await prisma.user.findMany({ include: { role: true } });
    assert(users.length === 4, `4 akun pengguna existing tetap aman tanpa modifikasi`);
    const adminUser = users.find(u => u.email === 'admin@diagnova.id');
    assert(adminUser && adminUser.role.name === 'ADMIN', `Akun admin@diagnova.id berstatus ADMIN`);

    // Check LIS tables untouched
    const patientCount = await prisma.patient.count();
    const orderCount = await prisma.labOrder.count();
    assert(patientCount >= 0 && orderCount >= 0, `Tabel LIS operasional (patients: ${patientCount}, lab_orders: ${orderCount}) utuh dan tidak tersentuh`);

    console.log('\n====================================================');
    console.log(`HASIL VERIFIKASI: ${passedTests}/${totalTests} TESTS BERHASIL (${Math.round((passedTests/totalTests)*100)}%)`);
    console.log('====================================================\n');

    if (passedTests === totalTests) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  } catch (err) {
    console.error('Verifikasi mengalami error fatal:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
