const fs = require('fs');
const path = require('path');

const marketingDir = path.join(process.cwd(), 'app', '(marketing)');
function scanDir(dir, prefix = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    const rel = path.join(prefix, entry.name);
    if (entry.isDirectory()) {
      scanDir(full, rel);
    } else if (entry.name === 'page.tsx') {
      console.log(`=== page: ${rel} ===`);
      const c = fs.readFileSync(full, 'utf-8');
      const lines = c.split('\n');
      console.log(`Total lines: ${lines.length}`);
      console.log(lines.slice(0, 15).join('\n'));
      console.log('----------------------------\n');
    }
  }
}

scanDir(marketingDir);

