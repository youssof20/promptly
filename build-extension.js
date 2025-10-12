#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Check if sharp is available for image conversion
let sharp;
try {
  sharp = require('sharp');
} catch (error) {
  console.log('⚠️  Sharp not installed. Installing sharp for image conversion...');
  const { execSync } = require('child_process');
  try {
    execSync('npm install sharp', { stdio: 'inherit' });
    sharp = require('sharp');
    console.log('✅ Sharp installed successfully');
  } catch (installError) {
    console.error('❌ Failed to install sharp:', installError.message);
    console.log('📝 Please run: npm install sharp');
    process.exit(1);
  }
}

const iconSizes = [16, 32, 48, 128];
const extensionDir = path.join(__dirname, 'apps', 'extension', 'icons');
const svgPath = path.join(extensionDir, 'icon.svg');

// Check if SVG exists
if (!fs.existsSync(svgPath)) {
  console.error('❌ SVG icon not found at:', svgPath);
  console.log('📝 Please create an SVG icon at apps/extension/icons/icon.svg');
  process.exit(1);
}

console.log('🎨 Converting SVG to PNG icons...');

// Convert SVG to PNG at different sizes
Promise.all(iconSizes.map(size => {
  const filename = `icon-${size}.png`;
  const filepath = path.join(extensionDir, filename);
  
  return sharp(svgPath)
    .resize(size, size)
    .png()
    .toFile(filepath)
    .then(() => {
      console.log(`✅ Created ${filename} (${size}x${size}px)`);
    })
    .catch(error => {
      console.error(`❌ Failed to create ${filename}:`, error.message);
      throw error;
    });
}))
.then(() => {
  console.log('\n🎉 Extension icons created successfully!');
  console.log('📁 Icons saved to: apps/extension/icons/');
})
.catch(error => {
  console.error('\n❌ Icon generation failed:', error.message);
  process.exit(1);
});
