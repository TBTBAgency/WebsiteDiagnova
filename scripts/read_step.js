const fs = require('fs');
const lines = fs.readFileSync('C:/Users/artaa/.gemini/antigravity/brain/35bf0f8f-c1b8-4333-bbab-14286abe6a93/.system_generated/logs/transcript.jsonl', 'utf-8').split('\n');
[1869, 1949, 1951].forEach(idx => {
  const line = lines.find(l => l.includes('"step_index":' + idx + ','));
  if (line) {
    const obj = JSON.parse(line);
    console.log(idx, JSON.stringify(obj.tool_calls || obj.content).substring(0, 300));
  }
});

