const fs = require('fs');
const c = fs.readFileSync('lib/models/cms.model.ts', 'utf-8');
const lines = c.split('\n');
console.log('Total lines in cms.model.ts:', lines.length);
lines.forEach((l, i) => {
  if (l.startsWith('export async function') || l.startsWith('export const')) {
    console.log((i+1) + ': ' + l.trim());
  }
});

