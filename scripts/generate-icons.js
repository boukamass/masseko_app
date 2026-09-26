import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const svgPath = path.resolve('public/icon.svg');
const svgBuffer = fs.readFileSync(svgPath);

async function generateIcons() {
  console.log('Generating Masseko brand icons...');

  // Public PWA icons
  await sharp(svgBuffer).resize(192, 192).png().toFile('public/pwa-192x192.png');
  await sharp(svgBuffer).resize(512, 512).png().toFile('public/pwa-512x512.png');
  await sharp(svgBuffer).resize(512, 512).png().toFile('public/pwa-maskable-512x512.png');
  await sharp(svgBuffer).resize(180, 180).png().toFile('public/apple-touch-icon.png');
  await sharp(svgBuffer).resize(64, 64).png().toFile('public/favicon.png');

  // Android mipmap icons if directory exists
  const androidResDir = path.resolve('android/app/src/main/res');
  if (fs.existsSync(androidResDir)) {
    const densities = [
      { dir: 'mipmap-mdpi', size: 48, fgSize: 108 },
      { dir: 'mipmap-hdpi', size: 72, fgSize: 162 },
      { dir: 'mipmap-xhdpi', size: 96, fgSize: 216 },
      { dir: 'mipmap-xxhdpi', size: 144, fgSize: 324 },
      { dir: 'mipmap-xxxhdpi', size: 192, fgSize: 432 },
    ];

    for (const d of densities) {
      const targetDir = path.join(androidResDir, d.dir);
      if (fs.existsSync(targetDir)) {
        await sharp(svgBuffer).resize(d.size, d.size).png().toFile(path.join(targetDir, 'ic_launcher.png'));
        await sharp(svgBuffer).resize(d.size, d.size).png().toFile(path.join(targetDir, 'ic_launcher_round.png'));
        await sharp(svgBuffer).resize(d.fgSize, d.fgSize).png().toFile(path.join(targetDir, 'ic_launcher_foreground.png'));
        console.log(`Generated Android icons for ${d.dir}`);
      }
    }
  }

  console.log('All Masseko icons generated successfully!');
}

generateIcons().catch(console.error);
