const fs = require('fs');

// 1. ImageUploader.tsx
let imgUp = fs.readFileSync('components/admin/ImageUploader.tsx', 'utf-8');
if (!imgUp.includes('export default ImageUploader')) {
  imgUp += '\nexport default ImageUploader;\n';
  fs.writeFileSync('components/admin/ImageUploader.tsx', imgUp, 'utf-8');
  console.log('Added export default ImageUploader');
}

// 2. BulkImageUploader.tsx
let bulkUp = fs.readFileSync('components/admin/BulkImageUploader.tsx', 'utf-8');
if (!bulkUp.includes('export default BulkImageUploader')) {
  bulkUp += '\nexport default BulkImageUploader;\n';
  fs.writeFileSync('components/admin/BulkImageUploader.tsx', bulkUp, 'utf-8');
  console.log('Added export default BulkImageUploader');
}

// 3. app/admin/(dashboard)/cms/homepage/page.tsx
let page = fs.readFileSync('app/admin/(dashboard)/cms/homepage/page.tsx', 'utf-8');
page = page.replace(/onChange=\{\(url\)\s*=>/g, 'onChange={(url: string) =>');
fs.writeFileSync('app/admin/(dashboard)/cms/homepage/page.tsx', page, 'utf-8');
console.log('Updated url parameter types in page.tsx');

