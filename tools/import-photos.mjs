// Copies chosen photos out of the Drive folders into public/, resized to a
// sensible web width and re-encoded as JPEG. Source files are named explicitly
// rather than by index so a reshuffle in Drive cannot silently swap one photo
// for another.
//
// This replaced a PowerShell version built on System.Drawing. Kim's phone saves
// HEIC, which System.Drawing cannot read and which Windows only decodes with the
// HEIF Image Extensions installed. sharp ships its own libheif, so it reads HEIC
// on any machine. Note that some HEIC files reach Drive with no extension at
// all, so the format is detected from the file contents, not the name.
//
// An optional `crop` of [left, top, right, bottom] as fractions of the source is
// applied before the resize.
//
//   node tools/import-photos.mjs

import { copyFile, mkdir, mkdtemp, rm, stat } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";

const BASE = "G:/My Drive/Projects/Sewing Mum/Product photos";
const ROOT = path.join(import.meta.dirname, "..");
const MAX_WIDTH = 1200;
const QUALITY = 86;

// Kim renumbered the Drive folders into her intended catalogue order in
// September 2026, so every folder name here changed at once. "Product - Wallet
// Bundle" became "Product - 3. Trio Bundle" (same source files), and Face Mask
// and Cup Sleeves moved into Archive, so both were dropped from the site.
const jobs = [
  // Trio Bundle: a snap wallet, a flap pouch and a strapped cup carrier, three
  // pieces to a set, one colourway per photo, all four shot on the same sofa.
  //
  // The HEIC originals of 2, 3 and 4 are all truncated in Drive — each one's
  // decoder seeks about 32 bytes past the end of the file — so Kim re-saved
  // them as JPEG. Those are the files named here; ignore the .heic siblings.
  // Number 5 is a much smaller copy than the rest, so it goes last.
  { folder: "Product - 3. Trio Bundle", file: "2026 - Wallet Bundle 4.jpg", out: "trio-bundle-1.jpg" },
  { folder: "Product - 3. Trio Bundle", file: "2026 - Wallet Bundle 2.jpg", out: "trio-bundle-2.jpg" },
  { folder: "Product - 3. Trio Bundle", file: "2026 - Wallet Bundle 3.jpg", out: "trio-bundle-3.jpg" },
  { folder: "Product - 3. Trio Bundle", file: "2026 - Wallet Bundle 5.jpg", out: "trio-bundle-4.jpg" },

  { folder: "Product - 2. Sun and Moon Cushion", file: "Sun and moon cushion_FB Image 1.jpg", out: "sun-and-moon-cushion-1.jpg" },
  { folder: "Product - 5. Woven Bag", file: "Woven bag_GB Image 1.jpg", out: "woven-bag-1.jpg" },
  { folder: "Product - 11. Cosmestic Pouch", file: "Cosmetic Pouch_FB_Image 1.jpg", out: "cosmetic-pouch-1.jpg" },

  // Tissue Pouch
  { folder: "Product - 4. Tissue Pouch", file: "D800B0B0-41C7-404D-818E-9A778A0D39B4_1_105_c.jpeg", out: "tissue-pouch-1.jpg" },
  { folder: "Product - 4. Tissue Pouch", file: "11B65382-0169-4E46-AD45-227F707FA594_1_105_c.jpeg", out: "tissue-pouch-2.jpg" },
  { folder: "Product - 4. Tissue Pouch", file: "953993DA-1863-49C4-B47C-3EAEA4B994D1_1_105_c.jpeg", out: "tissue-pouch-3.jpg" },

  // Placemats
  { folder: "Product - 7. Placemat", file: "42832CFE-8ADC-47E5-A77C-16B2DDA13CF7_1_105_c.jpeg", out: "placemats-1.jpg" },
  { folder: "Product - 7. Placemat", file: "619E4E07-5010-437C-B043-C4BBFBA61915_1_105_c.jpeg", out: "placemats-2.jpg" },
  { folder: "Product - 7. Placemat", file: "9B4BA88C-87EC-4ECE-AFA6-0B3AEB2CB1F2_1_105_c.jpeg", out: "placemats-3.jpg" },

  // Christmas Placemats
  { folder: "Product - 7. Placemat", file: "E509844E-9EAF-48B9-A8CA-4332C440DF90_4_5005_c.jpeg", out: "christmas-placemats-1.jpg" },
  { folder: "Product - 7. Placemat", file: "A3416282-3C55-4AEA-9608-03AA49FCFE10_4_5005_c.jpeg", out: "christmas-placemats-2.jpg" },
  { folder: "Product - 7. Placemat", file: "SM - Placemats (Xmas).jpeg", out: "christmas-placemats-3.jpg" },

  // Heat Pads. Two of the four available photos are skipped: "Head Pad_FB
  // Image 2.jpg" has a "Heat Pads" caption baked in, and "SM - Heat Pads 2.jpg"
  // is all but the same shot as "Head Pad_FB Image 1.jpg".
  { folder: "Product - 9. Heat Pad", file: "Head Pad_FB Image 1.jpg", out: "heat-pad-1.jpg" },
  { folder: "0. Photos", file: "SM - Heat Pads 1.jpeg", out: "heat-pad-2.jpg" },

  // Coasters. The folder Kim numbered for these is empty; the only photos of
  // them sit loose in "0. Photos".
  { folder: "0. Photos", file: "SM - Coasters 2.jpeg", out: "coasters-2.jpg" },
  { folder: "0. Photos", file: "SM - Coasters.jpg", out: "coasters-1.jpg" },

  // Corporate collaboration samples. Both are cropped: the first to cut the
  // "We customised your brand & name" caption baked into the Facebook version,
  // the second to bring the two labels close enough to read.
  { folder: "Corporate Collaboration", file: "Corporate Sample FB_Image 1.jpg", out: "brand-on-piece.jpg", dir: "corporate", crop: [0, 0.27, 1, 0.845] },
  { folder: "Corporate Collaboration", file: "Corporate Sample FB_Image 2.jpg", out: "co-branded-label.jpg", dir: "corporate", crop: [0, 0.26, 1, 0.78] },
];

let failed = 0;
// Sources are copied here before being decoded. Reading a HEIC straight off the
// Drive letter fails part-way with "bad seek": Drive for Desktop streams the
// file on demand, and libheif's random access outruns what has been fetched.
// Copying forces the whole file down first.
const staging = await mkdtemp(path.join(os.tmpdir(), "sm-import-"));

for (const job of jobs) {
  const src = path.join(BASE, job.folder, job.file);

  try {
    await stat(src);
  } catch {
    console.log(`MISSING  ${job.out}  <- ${job.file}`);
    failed += 1;
    continue;
  }

  const local = path.join(staging, job.out);
  await copyFile(src, local);

  // failOn: "none" so a warning in a phone-written HEIC does not abort the run.
  let pipeline = sharp(local, { failOn: "none" }).rotate();
  const { width, height } = await pipeline.metadata();

  if (job.crop) {
    const [l, t, r, b] = job.crop;
    pipeline = pipeline.extract({
      left: Math.round(l * width),
      top: Math.round(t * height),
      width: Math.round((r - l) * width),
      height: Math.round((b - t) * height),
    });
  }

  const subdir = job.dir ?? "products";
  const destDir = path.join(ROOT, "public", subdir);
  await mkdir(destDir, { recursive: true });
  const out = path.join(destDir, job.out);

  try {
    // withoutEnlargement so a source smaller than MAX_WIDTH is left alone.
    const info = await pipeline
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toFile(out);

    const kb = Math.round(info.size / 1024);
    console.log(
      `${subdir.padEnd(10)} ${job.out.padEnd(28)} ${info.width}x${String(info.height).padEnd(5)} ${String(kb).padStart(5)} KB`,
    );
  } catch (error) {
    // One unreadable source should not cost the whole run. Truncated HEICs off
    // a phone are the usual cause.
    console.log(`UNREADABLE  ${job.out}  <- ${job.file}`);
    console.log(`            ${String(error.message).split("\n")[0]}`);
    failed += 1;
  }
}

// Best effort: sharp caches open input files, so on Windows the last few are
// still locked at this point. Leaving them in the temp folder is harmless.
try {
  await rm(staging, { recursive: true, force: true });
} catch {
  /* the OS will clear the temp folder in its own time */
}

console.log("---");
console.log(`${jobs.length - failed}/${jobs.length} imported`);
if (failed > 0) process.exit(1);
