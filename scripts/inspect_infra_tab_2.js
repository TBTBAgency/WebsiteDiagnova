const fs = require('fs');
const c = fs.readFileSync('app/admin/(dashboard)/cms/homepage/page.tsx', 'utf-8');
const lines = c.split('\n');
console.log('Infrastructure cards lines 1451 - 1520:');
for (let i = 1451; i <= 1522; i++) {
  console.log(i + ': ' + lines[i]);
}

