#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Cross-platform postbuild script
// Moves popup.html to the correct location in dist/

const distDir = path.join(__dirname, '..', 'dist');
const popupHtmlSource = path.join(distDir, 'src', 'popup', 'index.html');
const popupHtmlDest = path.join(distDir, 'popup.html');

try {
  // Check if source exists
  if (fs.existsSync(popupHtmlSource)) {
    // Copy popup.html to root of dist
    fs.copyFileSync(popupHtmlSource, popupHtmlDest);
    console.log('✅ Moved popup.html to dist root');
    
    // Clean up the src/popup directory
    const srcDir = path.join(distDir, 'src');
    if (fs.existsSync(srcDir)) {
      fs.rmSync(srcDir, { recursive: true, force: true });
      console.log('✅ Cleaned up src directory');
    }
  } else {
    console.log('⚠️  popup.html not found at expected location');
  }
} catch (error) {
  console.error('❌ Postbuild error:', error.message);
  process.exit(1);
}
