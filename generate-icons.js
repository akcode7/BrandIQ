const fs = require('fs');
const path = require('path');

// Simple SVG to create icons
const createIconSVG = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${size/8}" fill="url(#gradient)"/>
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8B5CF6;stop-opacity:1" />
    </linearGradient>
  </defs>
  <text x="${size/2}" y="${size*0.6}" font-family="Arial, sans-serif" font-size="${size*0.4}" font-weight="bold" text-anchor="middle" fill="white">Q</text>
</svg>`;

// Create icon files
const iconSizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, 'public', 'icons');

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

iconSizes.forEach(size => {
  const svgContent = createIconSVG(size);
  fs.writeFileSync(path.join(iconsDir, `icon-${size}x${size}.svg`), svgContent);
  console.log(`Created icon-${size}x${size}.svg`);
});

console.log('Icons generated successfully!');
