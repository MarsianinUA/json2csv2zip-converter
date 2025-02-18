const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

class Archiver {
  compress(inputFile, outputFile, options = {}) {
    const inputFilePath = path.resolve(__dirname, inputFile);
    const outputFilePath = path.resolve(__dirname, outputFile);

    const readStream = fs.createReadStream(inputFilePath);
    const writeStream = fs.createWriteStream(outputFilePath);

    let compressStream;
    if (options.algorithm === 'gzip') {
      compressStream = zlib.createGzip();
    } else if (options.algorithm === 'deflate') {
      compressStream = zlib.createDeflate();
    } else {
      throw new Error('Unsupported compression algorithm');
    }

    readStream.pipe(compressStream).pipe(writeStream);

    writeStream.on('finish', () => {
      console.log(`The file is compressed and saved: ${outputFilePath}`);
    });
  }

  decompress(inputFile, outputFile, options = {}) {
    const inputFilePath = path.resolve(__dirname, inputFile);
    const outputFilePath = path.resolve(__dirname, outputFile);

    const readStream = fs.createReadStream(inputFilePath);
    const writeStream = fs.createWriteStream(outputFilePath);

    let decompressStream;
    if (options.algorithm === 'gzip') {
      decompressStream = zlib.createGunzip();
    } else if (options.algorithm === 'deflate') {
      decompressStream = zlib.createInflate();
    } else {
      throw new Error('Unsupported decompression algorithm');
    }

    readStream.pipe(decompressStream).pipe(writeStream);

    writeStream.on('finish', () => {
      console.log(`The file is unzipped and saved: ${outputFilePath}`);
    });
  }
}

module.exports = Archiver;
