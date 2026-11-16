const fs = require('fs');
const path = require('path');

const targets = [
  'cmsHeroSlide',
  'CmsHeroSlide',
  'cms_hero_slides',
  'cmsPartner',
  'CmsPartner',
  'cms_partners',
  'cmsComparisonItem',
  'CmsComparisonItem',
  'cms_comparison_items',
  'cmsTestimonial',
  'CmsTestimonial',
  'cms_testimonials',
  'prisma.menu',
  'db.menu',
  'model Menu',
  'prisma.media',
  'db.media',
  'model Media',
];

const ignoreDirs = new Set(['node_modules', '.next', '.git', 'backups']);

function searchFiles(dir) {
  const results = {};
  targets.forEach(t => (results[t] = []));

  function scan(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (!ignoreDirs.has(entry.name)) {
          scan(path.join(currentDir, entry.name));
        }
      } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx') || entry.name.endsWith('.js') || entry.name.endsWith('.prisma'))) {
        const fullPath = path.join(currentDir, entry.name);
        // exclude scripts/audit_*
        if (entry.name.startsWith('audit_')) continue;
        const content = fs.readFileSync(fullPath, 'utf-8');
        targets.forEach(t => {
          if (content.includes(t)) {
            const relPath = path.relative(process.cwd(), fullPath);
            if (!results[t].includes(relPath)) {
              results[t].push(relPath);
            }
          }
        });
      }
    }
  }

  scan(dir);
  return results;
}

const hits = searchFiles(process.cwd());
console.log('=== HASIL AUDIT DEPENDENSI CODEBASE ===\n');
for (const [target, files] of Object.entries(hits)) {
  if (files.length > 0) {
    console.log(`[${target}] ditemukan di ${files.length} berkas:`);
    files.forEach(f => console.log(`   - ${f}`));
  } else {
    console.log(`[${target}] -> TIDAK DITEMUKAN (Aman)`);
  }
}

