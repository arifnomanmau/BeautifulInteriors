// Server-side build script for Vercel
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Starting client build process...');

// Install client dependencies
console.log('Installing client dependencies...');
try {
  execSync('cd client && npm install', { stdio: 'inherit' });
} catch (error) {
  console.error('Error installing client dependencies:', error);
  process.exit(1);
}

// Create a minimal vite.config.js if it doesn't exist
const clientViteConfigPath = path.join('client', 'vite.config.js');
if (!fs.existsSync(clientViteConfigPath)) {
  console.log('Creating minimal vite.config.js...');
  const viteConfig = `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
    emptyOutDir: true
  }
});
`;
  fs.writeFileSync(clientViteConfigPath, viteConfig);
}

// Build the client
console.log('Building client application...');
try {
  execSync('cd client && npx vite build', { stdio: 'inherit' });
} catch (error) {
  console.error('Error building client:', error);
  process.exit(1);
}

console.log('Client build completed successfully!');