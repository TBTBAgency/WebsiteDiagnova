const fs = require('fs');

['solutions.ts', 'modules.ts', 'integrations.ts', 'nova-ai.ts'].forEach(f => {
  const content = fs.readFileSync('content/' + f, 'utf-8');
  console.log(`=== ${f} ===`);
  const lines = content.split('\n');
  lines.forEach((l, i) => {
    if (l.startsWith('export const') || l.startsWith('export interface')) {
      console.log(`line ${i+1}: ${l}`);
    }
  });
});

