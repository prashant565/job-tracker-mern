const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'data', 'jobs.json');

function readJobs() {
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw || '[]');
}

function writeJobs(jobs) {
  fs.writeFileSync(filePath, JSON.stringify(jobs, null, 2));
}

module.exports = { readJobs, writeJobs };
