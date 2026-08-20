/**
 * Builds the flattened, email-safe brand assets used by the staff email
 * signature generator (/tools/signature-generator).
 *
 * Email clients strip `data:` URIs (Gmail) and inline <svg> (Gmail, Outlook),
 * so every graphic in a signature has to be a real raster file served from an
 * absolute URL. This script bakes the site's live 3-part logo lockup and the
 * icon set down to PNGs in public/email/.
 *
 * Run: node scripts/build-email-signature-assets.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = path.join(ROOT, "public");
const OUT = path.join(PUBLIC, "email");

// Brand palette — mirrors src/app/globals.css
const GOLD = "#B8963E";
const BRAND_DARK = "#1C1C1E";
// Sampled as the histogram mode of the red in econstruct_red_square.png —
// a deep oxblood, not a bright red. Matches the rgba(155,16,16) stop in the
// logo glow gradient in LogoStatic.tsx.
const BRAND_RED = "#9B1B1C";
const SOCIAL_GLYPH = "#6B6B6B"; // --body-text

/**
 * Logo geometry, ported verbatim from src/components/LogoStatic.tsx so the
 * signature lockup matches the live site header exactly.
 *
 *   markHeight     = height * 1.55      markWidth = markHeight * 1.04
 *   wordmarkHeight = height * 0.61      wordmarkWidth = wordmarkHeight * 4.95
 *   wordmarkGap    = height * 0.05      + the flex `gap-[2px]`
 *   the "e" sits at 65% of the mark box, centred, rotated -9deg (rest state)
 */
const E_ROTATION_DEG = -9;
const BASE_H = 102; // yields a ~479px lockup = 3x the 160px display width

async function buildLogo() {
  const markHeight = Math.round(BASE_H * 1.55); // 158
  const markWidth = Math.round(markHeight * 1.04); // 164
  const wordmarkHeight = Math.round(BASE_H * 0.61); // 62
  const wordmarkWidth = Math.round(wordmarkHeight * 4.95); // 307
  const gap = 2 + Math.round(BASE_H * 0.05); // flex gap + margin-left

  const canvasW = markWidth + gap + wordmarkWidth;
  const canvasH = markHeight;

  // 1. Red square mark — object-contain inside markWidth x markHeight
  const square = await sharp(path.join(PUBLIC, "econstruct_red_square.png"))
    .resize(markWidth, markHeight, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  // 2. White "e" — 65% of the mark box, object-contain, then rotated to rest
  const eBoxW = Math.round(markWidth * 0.65);
  const eBoxH = Math.round(markHeight * 0.65);
  const eRotated = await sharp(path.join(PUBLIC, "econstruct_e_white.png"))
    .resize(eBoxW, eBoxH, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .rotate(E_ROTATION_DEG, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
  const eMeta = await sharp(eRotated).metadata();

  // 3. "construct" wordmark — object-contain inside its box
  const wordmark = await sharp(path.join(PUBLIC, "construct.png"))
    .resize(wordmarkWidth, wordmarkHeight, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toBuffer();

  await sharp({
    create: {
      width: canvasW,
      height: canvasH,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: square, left: 0, top: 0 },
      {
        input: eRotated,
        left: Math.round(markWidth / 2 - eMeta.width / 2),
        top: Math.round(markHeight / 2 - eMeta.height / 2),
      },
      { input: wordmark, left: markWidth + gap, top: Math.round((canvasH - wordmarkHeight) / 2) },
    ])
    // Palette-quantised: this image ships on every email the team sends, so
    // weight matters more than the last few percent of gradient fidelity.
    .png({ compressionLevel: 9, palette: true, quality: 90 })
    .toFile(path.join(OUT, "econstruct-logo.png"));

  return { canvasW, canvasH };
}

/** Social glyphs, drawn as monochrome paths on a transparent square. */
const SOCIAL_PATHS = {
  x: "M18.9 2.6h3.7l-8.1 9.2 9.5 12.6h-7.4l-5.8-7.6-6.7 7.6H.4l8.6-9.9L0 2.6h7.6l5.2 6.9ZM17.6 22.2h2L6.5 4.6H4.3Z",
  linkedin:
    "M5.4 8.9H.9V24h4.5ZM3.1 0a2.7 2.7 0 1 0 0 5.4 2.7 2.7 0 0 0 0-5.4M24 15.6c0-4.4-1-7-5.6-7a5.1 5.1 0 0 0-4.6 2.4V8.9H9.5V24H14v-7.5c0-2 .4-3.9 2.8-3.9s2.6 2.2 2.6 4V24H24Z",
  instagram:
    "M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.6 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1s-3.6 0-4.8-.1c-3.3-.2-4.8-1.7-4.9-4.9-.1-1.3-.1-1.6-.1-4.8s0-3.6.1-4.9C2.4 4 3.9 2.4 7.2 2.3c1.2-.1 1.6-.1 4.8-.1M12 0C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1 0 8.3 0 8.7 0 12s0 3.7.1 4.9c.2 4.4 2.6 6.8 7 7 1.2.1 1.6.1 4.9.1s3.7 0 4.9-.1c4.4-.2 6.8-2.6 7-7 .1-1.2.1-1.6.1-4.9s0-3.7-.1-4.9c-.2-4.4-2.6-6.8-7-7C15.7 0 15.3 0 12 0m0 5.8a6.2 6.2 0 1 0 0 12.4A6.2 6.2 0 0 0 12 5.8m0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8m6.4-11.8a1.4 1.4 0 1 0 0 2.9 1.4 1.4 0 0 0 0-2.9",
  youtube:
    "M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8M9.6 15.6V8.4l6.3 3.6Z",
  facebook:
    "M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.6 4.5-4.6 1.3 0 2.6.2 2.6.2v2.9h-1.5c-1.5 0-1.9.9-1.9 1.8V12h3.3l-.5 3.5h-2.8v8.4A12 12 0 0 0 24 12",
};

/** Contact glyphs for the gold circles in the dark info bar. */
const CONTACT_PATHS = {
  location:
    "M12 0C7.6 0 4 3.6 4 8c0 5.8 8 16 8 16s8-10.2 8-16c0-4.4-3.6-8-8-8m0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6",
  email:
    "M2 4h20a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2m10 8.7L21.6 6H2.4Zm0 2.4L2 8.2V18h20V8.2Z",
  phone:
    "M6.6 10.8a17 17 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.2.4 2.4.6 3.7.6.6 0 1 .4 1 1V22c0 .6-.4 1-1 1A19 19 0 0 1 1 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.7.1.3 0 .7-.2 1Z",
  website:
    "M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24m8.3 7.2h-3.5a18.7 18.7 0 0 0-1.6-4.1 9.8 9.8 0 0 1 5.1 4.1M12 2.3c.9 1.3 1.6 2.8 2.1 4.9H9.9c.5-2.1 1.2-3.6 2.1-4.9M2.5 14.4a9.8 9.8 0 0 1 0-4.8h4a20.4 20.4 0 0 0 0 4.8Zm.8 2.4h3.5c.4 1.5.9 2.9 1.6 4.1a9.8 9.8 0 0 1-5.1-4.1m3.5-9.6H3.3a9.8 9.8 0 0 1 5.1-4.1 18.7 18.7 0 0 0-1.6 4.1M12 21.7c-.9-1.3-1.6-2.8-2.1-4.9h4.2c-.5 2.1-1.2 3.6-2.1 4.9m2.5-7.3h-5a18.2 18.2 0 0 1 0-4.8h5a18.2 18.2 0 0 1 0 4.8m1.1 6.5c.7-1.2 1.2-2.6 1.6-4.1h3.5a9.8 9.8 0 0 1-5.1 4.1m1.9-6.5a20.4 20.4 0 0 0 0-4.8h4a9.8 9.8 0 0 1 0 4.8Z",
};

/** Rasterise a 24x24 glyph path to a PNG at `size`, in `color`. */
async function glyphPng(d, color, size, file) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}"><path d="${d}" fill="${color}"/></svg>`;
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(path.join(OUT, file));
}

/**
 * A hairline accent ring with the glyph centred inside it, matching the
 * outline-circle treatment in the signature template. Rendered at 60px for a
 * ~18px display size, so the 3.2px stroke lands just under 1px on screen.
 */
async function ringIconPng(d, file) {
  const S = 60;
  const stroke = 3.2;
  const r = S / 2 - stroke / 2;
  const glyph = 26;
  const inset = (S - glyph) / 2;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
  <circle cx="${S / 2}" cy="${S / 2}" r="${r}" fill="none" stroke="${GOLD}" stroke-width="${stroke}"/>
  <g transform="translate(${inset} ${inset}) scale(${glyph / 24})"><path d="${d}" fill="${GOLD}"/></g>
</svg>`;
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(path.join(OUT, file));
}

/** The solid map pin that sits beside the address, with no surrounding ring. */
async function pinPng(file) {
  const S = 42;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 24 24">
  <path d="${CONTACT_PATHS.location}" fill="${GOLD}"/>
</svg>`;
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(path.join(OUT, file));
}

async function main() {
  await mkdir(OUT, { recursive: true });

  const logo = await buildLogo();
  console.log(`logo        econstruct-logo.png ${logo.canvasW}x${logo.canvasH}`);

  for (const [name, d] of Object.entries(SOCIAL_PATHS)) {
    // Muted rather than full brand-dark, so the row recedes beside the name.
    await glyphPng(d, SOCIAL_GLYPH, 60, `social-${name}.png`); // 3x of 20px
    console.log(`social      social-${name}.png`);
  }

  // Ring icons for the right-hand contact stack; the address uses a bare pin.
  for (const name of ["phone", "email", "website"]) {
    await ringIconPng(CONTACT_PATHS[name], `icon-${name}.png`);
    console.log(`contact     icon-${name}.png`);
  }
  await pinPng("icon-pin.png");
  console.log(`contact     icon-pin.png`);

  console.log(`\npalette: gold ${GOLD}  dark ${BRAND_DARK}  red ${BRAND_RED}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
