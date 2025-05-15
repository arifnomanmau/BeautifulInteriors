const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create a minimal index.html if it doesn't exist
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist', { recursive: true });
}

if (!fs.existsSync('dist/index.html')) {
  fs.writeFileSync('dist/index.html', `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Beautiful Interiors</title>
</head>
<body>
  <div id="root"></div>
  <script>
    window.location.href = '/';
  </script>
</body>
</html>
  `);
}

console.log('✅ Created static files'); 