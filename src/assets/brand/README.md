# Dark-mode logo source

`heic2png-logo-dark.png` is the transparent dark-mode master generated with the built-in imagegen tool from the owner-supplied `public/brand/heic2png-logo.png`. It is kept outside `public` so the full-resolution master is not deployed.

The final edit prompt was:

> Clean up this exact dark-mode HEIC2PNG.site logo. The current white HEIC and PNG letter edges have many stray white speckles, ragged pixels and smudges outside the letter shapes. Remove ALL this noise; make the typography crisp, smooth, clean solid near-white #F1F5F9 with transparent empty areas surrounding and inside the letters. Preserve exact text HEIC2PNG.site, exact bold geometric font and layout, blue-purple 2, original blue/purple square photo-conversion icon at left and light .site pill at right. All shapes must have clean antialiased edges and no outlines or halos. Background genuinely transparent, no backdrop or backplate. Whole horizontal logo visible, no cropping; preserve the original artwork locations and 2172x724 composition. This should look like a production-ready clean logo file, not a distressed or textured logo.

Run `node scripts/generate-logo-variants.mjs` to export both 600×108 transparent WebP wordmarks. The script crops the transparent outer canvas, preserves alpha, and compresses at quality 90. The existing `npm run assets:brand` command also regenerates these exports.

The shared SVG wrapper retains the existing header/footer dimensions. Theme CSS switches its two image layers without a white background or a JavaScript image swap.
