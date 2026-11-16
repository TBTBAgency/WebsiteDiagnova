const fs = require('fs');
const c = fs.readFileSync('app/admin/(dashboard)/cms/homepage/page.tsx', 'utf-8');
const lines = c.split('\n');
console.log('Infrastructure section lines 1380 - 1520:');
for (let i = 1380; i <= 1450; i++) {
  console.log(i + ': ' + lines[i]);
}

