#!/usr/bin/env node
/**
 * Build script: transpile JSX files to plain JS using @babel/core.
 * Output goes to dist/ preserving the same filenames with .js extension.
 * lib/data.js and assets/ are copied as-is.
 */

const babel = require('@babel/core');
const fs    = require('fs');
const path  = require('path');

const SRC_DIR  = __dirname;
const DIST_DIR = path.join(__dirname, 'dist');

// Ensure dist directories exist
['dist', 'dist/lib', 'dist/assets', 'dist/deploy'].forEach((d) => {
  const full = path.join(__dirname, d);
  if (!fs.existsSync(full)) fs.mkdirSync(full, { recursive: true });
});

// ---- Transpile JSX files ----
const jsxFiles = [
  'admin-views.jsx',
  'admin-app.jsx',
  'vendedor-views.jsx',
  'vendedor-app.jsx',
];

jsxFiles.forEach((file) => {
  const src  = path.join(SRC_DIR, file);
  const dest = path.join(DIST_DIR, file.replace(/\.jsx$/, '.js'));
  const code = fs.readFileSync(src, 'utf8');

  const result = babel.transformSync(code, {
    presets: [
      ['@babel/preset-react', { runtime: 'classic' }],
    ],
    filename: file,
  });

  fs.writeFileSync(dest, result.code, 'utf8');
  console.log(`✓ ${file} → dist/${path.basename(dest)}`);
});

// ---- Copy plain JS / static files ----
const copies = [
  ['lib/data.js',          'dist/lib/data.js'],
  ['dashboard-admin.html', 'dist/dashboard-admin.html'],
  ['dashboard-vendedor.html', 'dist/dashboard-vendedor.html'],
];

copies.forEach(([src, dest]) => {
  fs.copyFileSync(path.join(SRC_DIR, src), path.join(SRC_DIR, dest));
  console.log(`✓ copied ${src} → ${dest}`);
});

// ---- Copy assets ----
const assetsDir = path.join(SRC_DIR, 'assets');
if (fs.existsSync(assetsDir)) {
  fs.readdirSync(assetsDir).forEach((f) => {
    fs.copyFileSync(
      path.join(assetsDir, f),
      path.join(DIST_DIR, 'assets', f)
    );
    console.log(`✓ copied assets/${f}`);
  });
}

console.log('\nBuild complete → dist/');
