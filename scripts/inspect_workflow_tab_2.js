const fs = require('fs');
const c = fs.readFileSync('app/admin/(dashboard)/cms/homepage/page.tsx', 'utf-8');
const lines = c.split('\n');
console.log('Workflow section lines 1301 - 1378:');
for (let i = 1301; i <= 1378; i++) {
  console.log(i + ': ' + lines[i]);
}

