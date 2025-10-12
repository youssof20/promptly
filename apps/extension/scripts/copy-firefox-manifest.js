#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Copy Firefox-compatible manifest
const sourceManifest = path.join(__dirname, '..', 'manifest.json');
const firefoxManifest = path.join(__dirname, '..', 'manifest.firefox.json');

try {
  const manifest = JSON.parse(fs.readFileSync(sourceManifest, 'utf8'));
  
  // Create Firefox-compatible manifest (MV2 for better compatibility)
  const firefoxManifestData = {
    ...manifest,
    manifest_version: 2,
    background: {
      scripts: ['background.js'],
      persistent: false
    },
    content_scripts: manifest.content_scripts.map(script => ({
      ...script,
      js: script.js.map(file => file.replace('dist/', ''))
    })),
    web_accessible_resources: manifest.web_accessible_resources.map(resource => ({
      ...resource,
      resources: resource.resources.map(file => file.replace('dist/', ''))
    }))
  };
  
  fs.writeFileSync(firefoxManifest, JSON.stringify(firefoxManifestData, null, 2));
  console.log('✅ Created Firefox manifest');
} catch (error) {
  console.error('❌ Firefox manifest creation error:', error.message);
  process.exit(1);
}
