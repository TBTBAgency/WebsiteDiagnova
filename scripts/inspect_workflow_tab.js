const fs = require('fs');
const c = fs.readFileSync('app/admin/(dashboard)/cms/homepage/page.tsx', 'utf-8');
const lines = c.split('\n');
console.log('Workflow section lines 1234 - 1378:');
for (let i = 1234; i <= 1300; i++) {
  console.log(i + ': ' + lines[i]);
}

