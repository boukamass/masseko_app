import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const svgPath = path.resolve('public/icon.svg');
const svgBuffer = fs.readFileSync(svgPath);

// SVG for circular launcher icons (Full brand logo inside circle)
const roundSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0A3D62"/>
      <stop offset="50%" stop-color="#0E5A8A"/>
      <stop offset="100%" stop-color="#1BA9C5"/>
    </linearGradient>
    <linearGradient id="turtleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34D399"/>
      <stop offset="100%" stop-color="#10B981"/>
    </linearGradient>
    <linearGradient id="shellGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1BA9C5"/>
      <stop offset="100%" stop-color="#0A3D62"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
    <clipPath id="circleClip">
      <circle cx="256" cy="256" r="256"/>
    </clipPath>
  </defs>

  <g clip-path="url(#circleClip)">
    <circle cx="256" cy="256" r="256" fill="url(#bgGrad)"/>
    <path d="M0 380 C 120 340, 220 420, 360 370 C 440 340, 480 360, 512 370 L 512 512 L 0 512 Z" fill="#061A2B" opacity="0.4"/>
    <path d="M0 410 C 150 370, 270 440, 390 390 C 460 360, 490 380, 512 390 L 512 512 L 0 512 Z" fill="#10B981" opacity="0.15"/>

    <g filter="url(#glow)" transform="translate(256, 235) scale(1.05)">
      <path d="M -70 -50 C -130 -90, -170 -40, -110 10 C -85 25, -60 0, -50 -20 Z" fill="url(#turtleGrad)"/>
      <path d="M 70 -50 C 130 -90, 170 -40, 110 10 C 85 25, 60 0, 50 -20 Z" fill="url(#turtleGrad)"/>
      <path d="M -50 70 C -95 110, -110 145, -75 145 C -45 145, -35 110, -30 85 Z" fill="url(#turtleGrad)"/>
      <path d="M 50 70 C 95 110, 110 145, 75 145 C 45 145, 35 110, 30 85 Z" fill="url(#turtleGrad)"/>
      <ellipse cx="0" cy="-105" rx="30" ry="42" fill="url(#turtleGrad)"/>
      <circle cx="-14" cy="-115" r="4.5" fill="#0A3D62"/>
      <circle cx="14" cy="-115" r="4.5" fill="#0A3D62"/>
      <path d="M -10 105 L 0 135 L 10 105 Z" fill="url(#turtleGrad)"/>
      <ellipse cx="0" cy="20" rx="76" ry="92" fill="#061A2B" stroke="#34D399" stroke-width="8"/>
      <ellipse cx="0" cy="20" rx="66" ry="80" fill="url(#shellGrad)"/>
      <polygon points="0,-40 32,-20 32,20 0,40 -32,20 -32,-20" fill="none" stroke="#A7F3D0" stroke-width="4.5" stroke-linejoin="round"/>
      <polygon points="0,40 28,55 28,80 0,92 -28,80 -28,55" fill="none" stroke="#A7F3D0" stroke-width="4" stroke-linejoin="round"/>
      <polygon points="0,-40 25,-52 25,-70 0,-78 -25,-70 -25,-52" fill="none" stroke="#A7F3D0" stroke-width="3.5" stroke-linejoin="round"/>
      <line x1="32" y1="-20" x2="62" y2="-30" stroke="#A7F3D0" stroke-width="3.5"/>
      <line x1="32" y1="20" x2="65" y2="25" stroke="#A7F3D0" stroke-width="3.5"/>
      <line x1="28" y1="55" x2="60" y2="68" stroke="#A7F3D0" stroke-width="3.5"/>
      <line x1="-32" y1="-20" x2="-62" y2="-30" stroke="#A7F3D0" stroke-width="3.5"/>
      <line x1="-32" y1="20" x2="-65" y2="25" stroke="#A7F3D0" stroke-width="3.5"/>
      <line x1="-28" y1="55" x2="-60" y2="68" stroke="#A7F3D0" stroke-width="3.5"/>
    </g>

    <text x="256" y="445" text-anchor="middle" fill="#E2E8F0" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="32" letter-spacing="3">MASSEKO</text>
  </g>
</svg>`;

// SVG for Android Adaptive Icon Foreground (Transparent background, centered within 66% safe circle of 108dp)
const adaptiveForegroundSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="turtleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34D399"/>
      <stop offset="100%" stop-color="#10B981"/>
    </linearGradient>
    <linearGradient id="shellGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1BA9C5"/>
      <stop offset="100%" stop-color="#0A3D62"/>
    </linearGradient>
    <filter id="glow" x="-25%" y="-25%" width="150%" height="150%">
      <feDropShadow dx="0" dy="6" stdDeviation="12" flood-color="#000000" flood-opacity="0.45"/>
    </filter>
  </defs>

  <!-- Turtle Icon Graphic Group (Centered directly in safe zone) -->
  <g filter="url(#glow)" transform="translate(256, 256) scale(1.08)">
    <path d="M -70 -50 C -130 -90, -170 -40, -110 10 C -85 25, -60 0, -50 -20 Z" fill="url(#turtleGrad)"/>
    <path d="M 70 -50 C 130 -90, 170 -40, 110 10 C 85 25, 60 0, 50 -20 Z" fill="url(#turtleGrad)"/>
    <path d="M -50 70 C -95 110, -110 145, -75 145 C -45 145, -35 110, -30 85 Z" fill="url(#turtleGrad)"/>
    <path d="M 50 70 C 95 110, 110 145, 75 145 C 45 145, 35 110, 30 85 Z" fill="url(#turtleGrad)"/>
    <ellipse cx="0" cy="-105" rx="30" ry="42" fill="url(#turtleGrad)"/>
    <circle cx="-14" cy="-115" r="4.5" fill="#0A3D62"/>
    <circle cx="14" cy="-115" r="4.5" fill="#0A3D62"/>
    <path d="M -10 105 L 0 135 L 10 105 Z" fill="url(#turtleGrad)"/>
    <ellipse cx="0" cy="20" rx="76" ry="92" fill="#061A2B" stroke="#34D399" stroke-width="8"/>
    <ellipse cx="0" cy="20" rx="66" ry="80" fill="url(#shellGrad)"/>
    <polygon points="0,-40 32,-20 32,20 0,40 -32,20 -32,-20" fill="none" stroke="#A7F3D0" stroke-width="4.5" stroke-linejoin="round"/>
    <polygon points="0,40 28,55 28,80 0,92 -28,80 -28,55" fill="none" stroke="#A7F3D0" stroke-width="4" stroke-linejoin="round"/>
    <polygon points="0,-40 25,-52 25,-70 0,-78 -25,-70 -25,-52" fill="none" stroke="#A7F3D0" stroke-width="3.5" stroke-linejoin="round"/>
    <line x1="32" y1="-20" x2="62" y2="-30" stroke="#A7F3D0" stroke-width="3.5"/>
    <line x1="32" y1="20" x2="65" y2="25" stroke="#A7F3D0" stroke-width="3.5"/>
    <line x1="28" y1="55" x2="60" y2="68" stroke="#A7F3D0" stroke-width="3.5"/>
    <line x1="-32" y1="-20" x2="-62" y2="-30" stroke="#A7F3D0" stroke-width="3.5"/>
    <line x1="-32" y1="20" x2="-65" y2="25" stroke="#A7F3D0" stroke-width="3.5"/>
    <line x1="-28" y1="55" x2="-60" y2="68" stroke="#A7F3D0" stroke-width="3.5"/>
  </g>
</svg>`;

// SVG for Android Adaptive Icon Background (Oceanic gradient with coastal waves)
const adaptiveBackgroundSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0A3D62"/>
      <stop offset="50%" stop-color="#0E5A8A"/>
      <stop offset="100%" stop-color="#1BA9C5"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#bgGrad)"/>
  <path d="M0 380 C 120 340, 220 420, 360 370 C 440 340, 480 360, 512 370 L 512 512 L 0 512 Z" fill="#061A2B" opacity="0.4"/>
  <path d="M0 410 C 150 370, 270 440, 390 390 C 460 360, 490 380, 512 390 L 512 512 L 0 512 Z" fill="#10B981" opacity="0.18"/>
</svg>`;

async function generateIcons() {
  console.log('Generating Masseko brand icons...');

  // Public PWA icons
  await sharp(svgBuffer).resize(192, 192).png().toFile('public/pwa-192x192.png');
  await sharp(svgBuffer).resize(512, 512).png().toFile('public/pwa-512x512.png');
  await sharp(svgBuffer).resize(512, 512).png().toFile('public/pwa-maskable-512x512.png');
  await sharp(svgBuffer).resize(180, 180).png().toFile('public/apple-touch-icon.png');
  await sharp(svgBuffer).resize(64, 64).png().toFile('public/favicon.png');

  // Also sync to masseko/ folder if present
  if (fs.existsSync('masseko')) {
    fs.copyFileSync('public/pwa-192x192.png', 'masseko/pwa-192x192.png');
    fs.copyFileSync('public/pwa-512x512.png', 'masseko/pwa-512x512.png');
    fs.copyFileSync('public/pwa-maskable-512x512.png', 'masseko/pwa-maskable-512x512.png');
    fs.copyFileSync('public/apple-touch-icon.png', 'masseko/apple-touch-icon.png');
    fs.copyFileSync('public/favicon.png', 'masseko/favicon.png');
    fs.copyFileSync('public/icon.svg', 'masseko/icon.svg');
  }

  // Android mipmap and drawable icons if directory exists
  const androidResDir = path.resolve('android/app/src/main/res');
  if (fs.existsSync(androidResDir)) {
    const densities = [
      { name: 'mdpi', size: 48, fgSize: 108 },
      { name: 'hdpi', size: 72, fgSize: 162 },
      { name: 'xhdpi', size: 96, fgSize: 216 },
      { name: 'xxhdpi', size: 144, fgSize: 324 },
      { name: 'xxxhdpi', size: 192, fgSize: 432 },
    ];

    const roundSvgBuffer = Buffer.from(roundSvg);
    const fgSvgBuffer = Buffer.from(adaptiveForegroundSvg);
    const bgSvgBuffer = Buffer.from(adaptiveBackgroundSvg);

    for (const d of densities) {
      // 1. Target mipmap folder
      const mipmapDir = path.join(androidResDir, `mipmap-${d.name}`);
      if (!fs.existsSync(mipmapDir)) {
        fs.mkdirSync(mipmapDir, { recursive: true });
      }

      // Standard legacy launcher icon
      await sharp(svgBuffer).resize(d.size, d.size).png().toFile(path.join(mipmapDir, 'ic_launcher.png'));
      // Round launcher icon
      await sharp(roundSvgBuffer).resize(d.size, d.size).png().toFile(path.join(mipmapDir, 'ic_launcher_round.png'));
      // Adaptive foreground icon (centered logo on transparent background)
      await sharp(fgSvgBuffer).resize(d.fgSize, d.fgSize).png().toFile(path.join(mipmapDir, 'ic_launcher_foreground.png'));
      // Adaptive background icon
      await sharp(bgSvgBuffer).resize(d.fgSize, d.fgSize).png().toFile(path.join(mipmapDir, 'ic_launcher_background.png'));

      // 2. Also populate drawable-* density folders to guarantee compatibility across all Android launchers
      const drawableDir = path.join(androidResDir, `drawable-${d.name}`);
      if (!fs.existsSync(drawableDir)) {
        fs.mkdirSync(drawableDir, { recursive: true });
      }
      await sharp(svgBuffer).resize(d.size, d.size).png().toFile(path.join(drawableDir, 'ic_launcher.png'));
      await sharp(roundSvgBuffer).resize(d.size, d.size).png().toFile(path.join(drawableDir, 'ic_launcher_round.png'));
      await sharp(fgSvgBuffer).resize(d.fgSize, d.fgSize).png().toFile(path.join(drawableDir, 'ic_launcher_foreground.png'));
      await sharp(bgSvgBuffer).resize(d.fgSize, d.fgSize).png().toFile(path.join(drawableDir, 'ic_launcher_background.png'));

      console.log(`Generated Android icons for ${d.name}`);
    }

    // Default drawable fallback
    const defaultDrawableDir = path.join(androidResDir, 'drawable');
    if (fs.existsSync(defaultDrawableDir)) {
      await sharp(fgSvgBuffer).resize(432, 432).png().toFile(path.join(defaultDrawableDir, 'ic_launcher_foreground.png'));
    }

    // Generate Masseko splash screens
    const splashScreens = [
      { file: 'drawable/splash.png', w: 480, h: 320 },
      { file: 'drawable-port-mdpi/splash.png', w: 320, h: 480 },
      { file: 'drawable-port-hdpi/splash.png', w: 480, h: 800 },
      { file: 'drawable-port-xhdpi/splash.png', w: 720, h: 1280 },
      { file: 'drawable-port-xxhdpi/splash.png', w: 960, h: 1600 },
      { file: 'drawable-port-xxxhdpi/splash.png', w: 1280, h: 1920 },
      { file: 'drawable-land-mdpi/splash.png', w: 480, h: 320 },
      { file: 'drawable-land-hdpi/splash.png', w: 800, h: 480 },
      { file: 'drawable-land-xhdpi/splash.png', w: 1280, h: 720 },
      { file: 'drawable-land-xxhdpi/splash.png', w: 1600, h: 960 },
      { file: 'drawable-land-xxxhdpi/splash.png', w: 1920, h: 1280 },
    ];

    for (const s of splashScreens) {
      const fullPath = path.join(androidResDir, s.file);
      if (fs.existsSync(path.dirname(fullPath))) {
        // Center the Masseko logo onto the background color #0A3D62
        const logoSize = Math.min(Math.round(Math.min(s.w, s.h) * 0.45), 360);
        const logoPng = await sharp(svgBuffer).resize(logoSize, logoSize).png().toBuffer();
        await sharp({
          create: {
            width: s.w,
            height: s.h,
            channels: 4,
            background: { r: 10, g: 61, b: 98, alpha: 1 }
          }
        })
          .composite([{ input: logoPng, gravity: 'center' }])
          .png()
          .toFile(fullPath);
      }
    }
    console.log('Masseko splash screens generated successfully!');
  }

  console.log('All Masseko icons & branding assets generated successfully!');
}

generateIcons().catch(console.error);
