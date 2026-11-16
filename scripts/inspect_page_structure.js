const fs = require('fs');
const c = fs.readFileSync('app/admin/(dashboard)/cms/homepage/page.tsx', 'utf-8');
const lines = c.split('\n');
console.log('Total lines:', lines.length);
lines.forEach((l, i) => {
  if (l.includes('{activeTab ===') || l.includes('TAB CONTENT') || l.includes('MODAL')) {
    console.log((i+1) + ': ' + l.trim());
  }
});

