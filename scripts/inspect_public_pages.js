const fs = require('fs');
const path = require('path');

const pagePaths = [
  'app/platform/page.tsx',
  'app/solutions/page.tsx',
  'app/modules/page.tsx',
  'app/nova-ai/page.tsx',
  'app/integration/page.tsx',
];

pagePaths.forEach(p => {
  if (fs.existsSync(p)) {
    console.log(`=== ${p} ===`);
    const content = fs.readFileSync(p, 'utf-8');
    const lines = content.split('\n');
    console.log(`Lines: ${lines.length}`);
    console.log(lines.slice(0, 30).join('\n'));
    console.log('...\n');
  } else {
    console.log(`=== ${p} (NOT FOUND) ===\n`);
  }
});

