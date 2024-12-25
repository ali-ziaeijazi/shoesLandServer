const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../db.json');

const readDb = () => {
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
};

const writeDb = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
};

module.exports = { readDb, writeDb };
