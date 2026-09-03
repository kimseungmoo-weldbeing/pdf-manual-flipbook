import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

async function createSampleManual() {
  const pdfDoc = await PDFDocument.create();
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const pagesData = [
    {
      title: 'PRODUCT USER MANUAL',
      subtitle: 'Premium Smart Device & System Guide',
      bg: rgb(0.08, 0.12, 0.22),
      textColor: rgb(1, 1, 1),
      content: [
        'Model: PRO-FLIP-2026',
        'Interactive 3D PDF Manual Edition',
        '',
        'Turn pages by dragging corners or clicking edges.',
        'Use keyboard arrows [Left / Right] to navigate.',
      ],
      isCover: true,
    },
    {
      title: 'TABLE OF CONTENTS',
      subtitle: 'Overview & Quick Navigation',
      bg: rgb(0.98, 0.98, 0.99),
      textColor: rgb(0.1, 0.1, 0.1),
      content: [
        '1. Welcome & Getting Started .................... Page 3',
        '2. Safety Information & Precautions ............ Page 4',
        '3. Hardware Features & Controls ................. Page 5',
        '4. System Setup & Configuration ................. Page 6',
        '5. Operation & Advanced Features ................ Page 7',
        '6. Troubleshooting & FAQ ........................ Page 8',
        '7. Technical Specifications ..................... Page 9',
        '8. Warranty & Customer Support ................. Page 10',
      ],
    },
    {
      title: '1. GETTING STARTED',
      subtitle: 'Unboxing and Initial Preparation',
      bg: rgb(1, 1, 1),
      textColor: rgb(0.15, 0.15, 0.15),
      content: [
        'Thank you for selecting our next-generation smart system.',
        'Please inspect the packaging contents before first operation:',
        '',
        '  - Smart Console Main Unit x 1',
        '  - High-Speed USB-C Power Adapter (65W) x 1',
        '  - Magnetic Docking Station x 1',
        '  - Quick Reference Pamphlet & Warranty Card x 1',
        '',
        'Ensure the battery is charged to at least 50% prior to first boot.',
      ],
    },
    {
      title: '2. SAFETY INSTRUCTIONS',
      subtitle: 'Important Precautions for Safe Operation',
      bg: rgb(1, 1, 1),
      textColor: rgb(0.15, 0.15, 0.15),
      content: [
        'WARNING: Failure to follow safety instructions may lead to damage.',
        '',
        '  - Keep the device away from moisture and liquids.',
        '  - Do not expose to extreme temperatures (-10C to 45C operating range).',
        '  - Use only certified power cables and adapters included.',
        '  - Do not attempt to disassemble or repair the device yourself.',
        '  - Keep out of reach of children under 3 years old.',
        '',
        'Compliance: CE / FCC / KC Certified (2026).',
      ],
    },
    {
      title: '3. HARDWARE CONTROLS',
      subtitle: 'Buttons, Indicators & Connector Ports',
      bg: rgb(1, 1, 1),
      textColor: rgb(0.15, 0.15, 0.15),
      content: [
        '[Top Panel]',
        '  - Power / Sleep Button with biometric fingerprint reader',
        '  - Dual Noise-Canceling Microphone Array',
        '',
        '[Front Panel]',
        '  - 10.5-inch Retina Touch Display with 120Hz refresh rate',
        '  - Multi-color LED Status Ring Indicator',
        '',
        '[Bottom & Rear Ports]',
        '  - Dual Thunderbolt 4 / USB-C Ports',
        '  - 3.5mm Hi-Fi Audio Output Jack',
      ],
    },
    {
      title: '4. SYSTEM SETUP',
      subtitle: 'Network Connection & Pairing Instructions',
      bg: rgb(1, 1, 1),
      textColor: rgb(0.15, 0.15, 0.15),
      content: [
        'Step 1: Power On',
        '  Press and hold the Power button for 2 seconds until the LED pulses blue.',
        '',
        'Step 2: Connect to Wi-Fi',
        '  Select your 5GHz or 6GHz Wi-Fi network and input security credentials.',
        '',
        'Step 3: Account Sync',
        '  Scan the on-screen QR code with your mobile companion application.',
        '',
        'Step 4: Firmware Update',
        '  Allow automatic installation of the latest v4.2.0 stability package.',
      ],
    },
    {
      title: '5. ADVANCED FEATURES',
      subtitle: 'Gesture Controls & Voice Command Suite',
      bg: rgb(1, 1, 1),
      textColor: rgb(0.15, 0.15, 0.15),
      content: [
        'Interactive Flipbook & Reader Mode:',
        '  Swipe left or right across the lower corners to turn pages.',
        '  Double tap anywhere to activate 150% high-precision zoom.',
        '',
        'Voice Assistant Integration:',
        '  Wake word: "Hey System, Open Manual"',
        '  Voice commands support page jumps: "Go to page 5", "Zoom in".',
        '',
        'Cloud Backup:',
        '  Your reading position, bookmarks, and annotations sync instantly.',
      ],
    },
    {
      title: '6. TROUBLESHOOTING',
      subtitle: 'Common Questions & Diagnostic Solutions',
      bg: rgb(1, 1, 1),
      textColor: rgb(0.15, 0.15, 0.15),
      content: [
        'Q: Device will not turn on?',
        'A: Connect to the 65W charger for 15 minutes and check the LED indicator.',
        '',
        'Q: Pages are not turning smoothly?',
        'A: Check the zoom level or switch to Single-Page mode in the toolbar.',
        '',
        'Q: Wi-Fi disconnected?',
        'A: Navigate to Settings > Network > Forget Network and reconnect.',
        '',
        'For hard resets, hold Power + Volume Down for 10 seconds.',
      ],
    },
    {
      title: '7. TECHNICAL SPECIFICATIONS',
      subtitle: 'Detailed Engineering Metrics',
      bg: rgb(1, 1, 1),
      textColor: rgb(0.15, 0.15, 0.15),
      content: [
        'Processor: Octa-Core Neural Processing Engine',
        'Memory: 16GB LPDDR5X Unified RAM',
        'Storage: 512GB NVMe Solid-State Storage',
        'Display: 2560 x 1600 Pixel HDR OLED (600 nits)',
        'Battery: 7800 mAh Li-Polymer (Up to 18 Hours read time)',
        'Dimensions: 242mm x 170mm x 6.8mm',
        'Weight: 440 grams',
        'Wireless: Wi-Fi 7 (802.11be), Bluetooth 5.4, NFC',
      ],
    },
    {
      title: 'WARRANTY & SUPPORT',
      subtitle: '2-Year International Limited Warranty',
      bg: rgb(0.08, 0.12, 0.22),
      textColor: rgb(1, 1, 1),
      content: [
        'Customer Care Center: support@manual-flipbook.local',
        'Toll-Free Hotline: 080-800-2026',
        '',
        'Serial Number Barcode: *FLIP-2026-9968-OK*',
        '',
        'Copyright 2026. All rights reserved.',
        'Designed with interactive 3D WebGL page flip technology.',
      ],
      isCover: true,
    },
  ];

  for (let i = 0; i < pagesData.length; i++) {
    const data = pagesData[i];
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 dimensions
    const { width, height } = page.getSize();

    // Background fill
    page.drawRectangle({
      x: 0,
      y: 0,
      width,
      height,
      color: data.bg,
    });

    // Decorative borders
    page.drawRectangle({
      x: 24,
      y: 24,
      width: width - 48,
      height: height - 48,
      borderColor: data.isCover ? rgb(0.3, 0.5, 0.9) : rgb(0.85, 0.85, 0.88),
      borderWidth: 1.5,
    });

    // Title
    page.drawText(data.title, {
      x: 50,
      y: height - 90,
      size: data.isCover ? 26 : 20,
      font: fontBold,
      color: data.textColor,
    });

    // Subtitle
    page.drawText(data.subtitle, {
      x: 50,
      y: height - 120,
      size: 11,
      font: fontRegular,
      color: data.isCover ? rgb(0.7, 0.8, 1) : rgb(0.4, 0.45, 0.5),
    });

    // Divider Line
    page.drawLine({
      start: { x: 50, y: height - 135 },
      end: { x: width - 50, y: height - 135 },
      thickness: 1,
      color: data.isCover ? rgb(0.3, 0.5, 0.8) : rgb(0.85, 0.85, 0.88),
    });

    // Content lines
    let yPos = height - 180;
    for (const line of data.content) {
      if (line === '') {
        yPos -= 14;
        continue;
      }
      page.drawText(line, {
        x: 50,
        y: yPos,
        size: 11.5,
        font: line.startsWith('  -') || line.startsWith('WARNING') || line.startsWith('Model') ? fontBold : fontRegular,
        color: data.textColor,
      });
      yPos -= 24;
    }

    // Page Number Footer
    const footerText = `Page ${i + 1} of ${pagesData.length}`;
    page.drawText(footerText, {
      x: width / 2 - 35,
      y: 40,
      size: 9,
      font: fontRegular,
      color: data.isCover ? rgb(0.6, 0.7, 0.9) : rgb(0.5, 0.5, 0.5),
    });
  }

  const pdfBytes = await pdfDoc.save();
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  const outputPath = path.join(publicDir, 'sample-manual.pdf');
  fs.writeFileSync(outputPath, pdfBytes);
  console.log('Sample manual generated successfully at', outputPath);
}

createSampleManual();
