const { execSync } = require('child_process');
const output = execSync('wmic process where "name=\'node.exe\'" get processid,commandline /format:csv', { encoding: 'utf-8' });
console.log(output);

