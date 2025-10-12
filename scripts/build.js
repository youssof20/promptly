#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🏗️  Building Promptly monorepo...');

try {
  // Build database package first
  console.log('📦 Building database package...');
  execSync('npm run build', { 
    cwd: path.join(__dirname, 'packages', 'database'),
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, FORCE_COLOR: '1' }
  });

  // Build web app
  console.log('🌐 Building web app...');
  execSync('npm run build', { 
    cwd: path.join(__dirname, 'apps', 'web'),
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, FORCE_COLOR: '1' }
  });

  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
