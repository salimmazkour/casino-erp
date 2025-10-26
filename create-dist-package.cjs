const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const distDir = path.join(__dirname, 'dist');
const outputPath = path.join(distDir, '../dist.zip');

if (!fs.existsSync(distDir)) {
  console.error('Le dossier dist/ n\'existe pas. Lancez "npm run build" d\'abord.');
  process.exit(1);
}

const output = fs.createWriteStream(outputPath);
const archive = archiver('zip', {
  zlib: { level: 9 }
});

output.on('close', () => {
  const sizeMB = (archive.pointer() / 1024 / 1024).toFixed(2);
  console.log(`✅ dist.zip créé avec succès (${sizeMB} MB)`);
  console.log(`📦 Emplacement: ${outputPath}`);
});

archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);
archive.directory(distDir, 'dist');
archive.finalize();
