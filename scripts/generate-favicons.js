#!/usr/bin/env node

/* jshint esversion: 11, node: true */
/* jshint -W079 */ // Disable redefinition warnings for __filename and __dirname
/* jshint -W070 */ // Disable error for import.meta

// @ts-check
// This script generates favicons and meta images from SVG logo components

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

// Fix for ES modules (use fileURLToPath instead of __filename and __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Create the temp directory if it doesn't exist
const tempDir = path.resolve(projectRoot, './temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

// Create the favicon directory if it doesn't exist
const faviconDir = path.resolve(projectRoot, './public/favicon');
if (!fs.existsSync(faviconDir)) {
  fs.mkdirSync(faviconDir);
}

// SVG content from LogoIcon component
const logoIconSvg = `
<svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#0B0D10"/>
  <line x1="60" y1="130" x2="100" y2="40" stroke="#FF2DA0" strokeWidth="6"/>
  <line x1="100" y1="40" x2="140" y2="130" stroke="#FF2DA0" strokeWidth="6"/>
  <line x1="70" y1="40" x2="100" y2="130" stroke="#00F0FF" strokeWidth="6"/>
  <line x1="100" y1="130" x2="130" y2="40" stroke="#00F0FF" strokeWidth="6"/>
  <line x1="80" y1="100" x2="120" y2="100" stroke="#00F0FF" strokeWidth="4"/>
</svg>`;

// SVG content from LogoFull component
const logoFullSvg = `
<svg width="643" height="180" viewBox="0 0 643 180" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#0B0D10"/>
  <line x1="60" y1="130" x2="100" y2="40" stroke="#FF2DA0" strokeWidth="6"/>
  <line x1="100" y1="40" x2="140" y2="130" stroke="#FF2DA0" strokeWidth="6"/>
  <line x1="70" y1="40" x2="100" y2="130" stroke="#00F0FF" strokeWidth="6"/>
  <line x1="100" y1="130" x2="130" y2="40" stroke="#00F0FF" strokeWidth="6"/>
  <line x1="80" y1="100" x2="120" y2="100" stroke="#00F0FF" strokeWidth="4"/>
  <text x="180" y="105" fontFamily="Sora, sans-serif" fontSize="48" fontWeight="600" fill="#FF2DA0">AWESOME</text>
  <text x="448" y="105" fontFamily="Sora, sans-serif" fontSize="48" fontWeight="600" fill="#00F0FF">VIDEO</text>
</svg>`;

// Save the SVG files
fs.writeFileSync(path.join(tempDir, 'logo-icon.svg'), logoIconSvg);
fs.writeFileSync(path.join(tempDir, 'logo-full.svg'), logoFullSvg);

// Favicon sizes
const faviconSizes = [16, 32, 48, 57, 60, 72, 76, 96, 114, 120, 144, 152, 180, 192, 512];

// Generate favicon.ico (requires a PNG first)
const generateFaviconIco = async () => {
  await sharp(path.join(tempDir, 'logo-icon.svg'))
    .resize(32, 32)
    .toFile(path.join(tempDir, 'favicon-32x32.png'));
  
  console.log('Generated 32x32 PNG for favicon.ico');
  
  // Use ImageMagick's convert to create .ico (if installed)
  try {
    execSync(`convert ${path.join(tempDir, 'favicon-32x32.png')} ${path.join(projectRoot, './public', 'favicon.ico')}`);
    console.log('Generated favicon.ico');
  } catch (error) {
    console.error('Error generating favicon.ico. ImageMagick may not be installed.');
    console.log('Please install ImageMagick or manually convert the PNG to ICO.');
    // Fallback - just copy the PNG in case convert fails
    fs.copyFileSync(
      path.join(tempDir, 'favicon-32x32.png'),
      path.join(projectRoot, './public', 'favicon-32x32.png')
    );
  }
};

// Generate all the PNG favicon sizes
const generateFaviconPngs = async () => {
  for (const size of faviconSizes) {
    try {
      await sharp(path.join(tempDir, 'logo-icon.svg'))
        .resize(size, size)
        .toFile(path.join(faviconDir, `favicon-${size}x${size}.png`));
      console.log(`Generated ${size}x${size} favicon`);
    } catch (error) {
      console.error(`Error generating ${size}x${size} favicon:`, error);
    }
  }
  
  // Create apple-touch-icon.png (180x180)
  fs.copyFileSync(
    path.join(faviconDir, 'favicon-180x180.png'),
    path.join(projectRoot, './public', 'apple-touch-icon.png')
  );
  console.log('Created apple-touch-icon.png');
  
  // Create a default favicon.png
  fs.copyFileSync(
    path.join(faviconDir, 'favicon-32x32.png'),
    path.join(projectRoot, './public', 'favicon.png')
  );
  console.log('Created favicon.png');
};

// Generate OG images for social media
const generateOgImages = async () => {
  // Standard OG image (1200x630)
  await sharp(path.join(tempDir, 'logo-full.svg'))
    .resize(1200, 630, { fit: 'contain', background: '#0B0D10' })
    .toFile(path.join(projectRoot, './public', 'og-image.png'));
  console.log('Generated og-image.png (1200x630)');
  
  // Twitter card (1200x600)
  await sharp(path.join(tempDir, 'logo-full.svg'))
    .resize(1200, 600, { fit: 'contain', background: '#0B0D10' })
    .toFile(path.join(projectRoot, './public', 'twitter-card.png'));
  console.log('Generated twitter-card.png (1200x600)');
};

// Main function to run everything
const generateAll = async () => {
  try {
    console.log('Starting favicon and meta image generation...');
    await generateFaviconIco();
    await generateFaviconPngs();
    await generateOgImages();
    console.log('All favicon and meta images generated successfully!');
  } catch (error) {
    console.error('Error generating images:', error);
  }
};

// Execute the main function
generateAll();
