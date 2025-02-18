const fs = require('fs').promises;
const path = require('path');
const Archiver = require('./archiver.js');

class Json2Csv {
  constructor(jsonFilePath, fields) {
    this.jsonFilePath = jsonFilePath;
    this.fields = fields;
  }

  async loadJson() {
    const data = await fs.readFile(this.jsonFilePath, 'utf8');
    this.jsonData = JSON.parse(data);
  }

  convert() {
    if (!Array.isArray(this.jsonData) || this.jsonData.length === 0) {
      throw new Error('JSON should be an array of objects.');
    }

    const headers = this.fields;
    const csvRows = this.jsonData.map((row) =>
      headers.map((field) => JSON.stringify(row[field] || '')).join(','),
    );

    return [headers.join(','), ...csvRows].join('\n');
  }

  async saveToFile(filename) {
    await this.loadJson();
    const csvData = this.convert();
    const filePath = path.resolve(__dirname, filename);
    await fs.writeFile(filePath, csvData, 'utf8');
    console.log(`CSV file saved: ${filePath}`);
  }
}

(async () => {
  console.log(__dirname);
  const jsonFilePath = 'data/comments.json'; // Path to JSON file
  const fields = ['postId', 'name', 'body']; // Fields to include in CSV
  const converter = new Json2Csv(jsonFilePath, fields);
  await converter.saveToFile('../data/output.csv');

  const archiver = new Archiver();
  archiver.compress('../data/output.csv', '../data/output.gzip', {
    algorithm: 'gzip',
  });
})();
