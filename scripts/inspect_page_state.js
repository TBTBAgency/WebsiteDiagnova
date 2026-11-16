const fs = require('fs');
const c = fs.readFileSync('app/admin/(dashboard)/cms/homepage/page.tsx', 'utf-8');
const lines = c.split('\n');
console.log('Top state variables:');
for (let i = 24; i <= 65; i++) {
  console.log(i + ': ' + lines[i]);
}

