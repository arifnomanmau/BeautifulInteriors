const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  console.log('Starting custom build process...');
  
  // Install dependencies
  console.log('Installing root dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  // Build client
  console.log('Building client...');
  try {
    // Create client build directory if it doesn't exist
    if (!fs.existsSync(path.join(__dirname, 'dist'))) {
      fs.mkdirSync(path.join(__dirname, 'dist'));
    }
    if (!fs.existsSync(path.join(__dirname, 'dist/client'))) {
      fs.mkdirSync(path.join(__dirname, 'dist/client'));
    }
    
    // Install client dependencies
    console.log('Installing client dependencies...');
    execSync('cd client && npm install', { stdio: 'inherit' });
    
    // Build client
    console.log('Running client build...');
    execSync('cd client && npx vite build --outDir ../dist/client', { stdio: 'inherit' });
    
    console.log('Client build completed successfully');
  } catch (error) {
    console.error('Client build failed:', error);
    process.exit(1);
  }
  
  console.log('Build process completed successfully');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
