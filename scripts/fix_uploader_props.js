const fs = require('fs');

let page = fs.readFileSync('app/admin/(dashboard)/cms/homepage/page.tsx', 'utf-8');

// 1. Fix BulkImageUploader props
page = page.replace(
  /<BulkImageUploader\s+onUploadComplete=\{handleBulkPartnerUpload\}[\s\S]*?\/>/,
  `<BulkImageUploader
                onUploadSuccess={handleBulkPartnerUpload}
                title="Pilih Banyak Logo Mitra / Folder Logo"
                description="Pilih banyak file logo sekaligus atau pilih seluruh folder di komputer"
              />`
);

page = page.replace(
  /<BulkImageUploader\s+onUploadComplete=\{handleBulkTestimonialUpload\}[\s\S]*?\/>/,
  `<BulkImageUploader
                onUploadSuccess={handleBulkTestimonialUpload}
                title="Pilih Banyak Foto Profil / Folder Foto"
                description="Pilih banyak foto dokter atau pilih folder foto untuk membuat draf testimonial otomatis"
              />`
);

// 2. Fix ImageUploader placeholder -> hint
page = page.replace(/placeholder="Pilih atau seret/g, 'hint="Pilih atau seret');
page = page.replace(/placeholder="Upload file SVG/g, 'hint="Upload file SVG');

fs.writeFileSync('app/admin/(dashboard)/cms/homepage/page.tsx', page, 'utf-8');
console.log('Fixed BulkImageUploader and ImageUploader props in page.tsx');

