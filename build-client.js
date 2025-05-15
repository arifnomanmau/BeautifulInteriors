// Server-side build script for Vercel
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Starting client build process...');

// Make sure dist directory exists
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// Create an empty index.html in dist
fs.writeFileSync('dist/index.html', `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Beautiful Interiors</title>
  <meta http-equiv="refresh" content="0;url=/client/index.html">
  <link rel="stylesheet" href="/client/index.css">
</head>
<body>
  <p>If you are not redirected, <a href="/client/index.html">click here</a>.</p>
</body>
</html>
`);

console.log('Created redirect file in dist/index.html');
console.log('Build process completed');