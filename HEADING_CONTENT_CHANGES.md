# Converter headings and content changes — 2026-10-23

Updated the existing PNG, JPG and AVIF converter content. No new UI sections, CSS, responsive rules, conversion code or dependencies were added.

## Files changed for this request

- `src/lib/converter-content.mjs` — build-time editorial changes to the existing converter DOM, retaining its controls, IDs, links, inline formatting and classes. This is not client-side conversion logic.
- `src/lib/design.mjs` — invokes the content changes only for the three converter routes; adjusts homepage FAQ JSON-LD question extraction for the semantic heading wrapper.
- `tests/converter-content.spec.ts` — checks intent-specific H1s, ordered heading levels, removal of unsupported comparison claims, retained FAQ hooks and schema/answer parity.
- `HEADING_CONTENT_CHANGES.md` — this report.

All pre-existing uncommitted changes were preserved. The original approved HTML, metadata implementation, stylesheets, article Markdown, runtime/client, workers and encoder sources remain unchanged by this task.

## What changed

**PNG homepage:** retained “HEIC to PNG Converter” as its sole H1. Improved the existing capability cards, three-step instructions, comparison table, use cases, tool summaries and FAQs. Replaced universal compatibility and fixed photographic file-size claims with destination-specific guidance. Clarified that PNG encoding is lossless for rendered pixels, rather than promising perfect source preservation. Explained 8-bit RGB, removed EXIF, source ICC/HDR and auxiliary-layer limits, and keeping originals. Removed the stale iOS-version range, “in seconds,” sample file-size/performance labels and the unsupported “Most Popular” badge wording. The existing platform guide link now accurately says Windows 11.

**JPG page:** retained “HEIC to JPG Converter” as its sole H1. Tightened the three conversion steps and described quality as a size/detail tradeoff. Replaced fixed size savings, “visually lossless,” universal support and “archival master” claims with useful delivery-copy guidance. Promoted existing quality-card labels and FAQ questions to H3s without changing their classes. Separated converting an existing file from Windows viewing support and changing future iPhone capture settings.

**AVIF page:** retained “HEIC to AVIF Converter” as its sole H1. Reused the first existing card and its three list items for clear select/settings/convert-and-download instructions. The second card answers destination-compatibility questions and explains actual WASM-worker encoding, quality/chroma/lossless choices and known output limits. Removed unverified global support percentages, fixed browser-version lists, smallest-file rankings and implied HDR preservation. The existing comparison table now distinguishes compatibility, transparency capabilities and compression modes.

**Shared heading semantics:** the dropzone remains an H2. Status messages and the selected-files label are paragraphs rather than editorial H3s, retaining their exact IDs/classes and nested spans. Homepage FAQ buttons are now inside H3 wrappers: the original buttons, event hooks and icons remain intact. No change to toggle or conversion logic was needed.

Numeric quality controls and documented batch/file limits are implementation settings, not invented conversion benchmarks. No testimonials, test results or performance percentages were added.

## Heading verification

Counts below are inside `main`; unchanged footer headings are outside this content hierarchy. FAQ icons are excluded from the readable outline below.

|Page|H1 before → after|H2 before → after|H3 before → after|
|---|---|---|---|
|/|1 → 1|7 → 7|18 → 25|
|/heic-to-jpg|1 → 1|7 → 7|3 → 5|
|/heic-to-avif|1 → 1|4 → 4|3 → 1|

### /

- **H1** HEIC to PNG Converter
- **H2** Select HEIC files to convert
- **H2** Why Convert HEIC to PNG Here?
- **H3** Local Image Processing
- **H3** Lossless PNG Encoding
- **H3** Batch HEIC Conversion
- **H3** Keep or Resize Dimensions
- **H3** Browser Compatibility
- **H3** No Installation or Signup
- **H2** How to Convert HEIC to PNG Online
- **H3** Step 1: Select your HEIC photos
- **H3** Step 2: Convert the files to PNG
- **H3** Step 3: Download PNG or ZIP
- **H2** HEIC vs PNG: Quality and Compatibility
- **H2** When Should You Convert HEIC to PNG?
- **H3** Uploading to services that reject HEIC
- **H3** Editing images in applications that support PNG
- **H3** Preparing graphics for presentations
- **H3** Sharing between devices & design workflows
- **H2** More HEIC Conversion Tools
- **H3** HEIC to JPG Converter
- **H3** HEIC to AVIF Converter
- **H2** Frequently Asked Questions
- **H3** 1. What is a HEIC file?
- **H3** 2. How do I convert HEIC to PNG?
- **H3** 3. Can I convert multiple HEIC files at once?
- **H3** 4. Does HEIC to PNG conversion reduce quality?
- **H3** 5. Why is my converted PNG larger?
- **H3** 6. Can I convert HEIC files on Windows?
- **H3** 7. Can I convert HEIC photos on Android?
- **H3** 8. Will PNG conversion remove the background?
- **H3** 9. Are my photos uploaded for conversion?
- **H3** 10. Is the HEIC to PNG converter free?

### /heic-to-jpg

- **H1** HEIC to JPG Converter
- **H2** Select HEIC files to convert
- **H2** How to Convert HEIC to JPG
- **H2** Why Convert HEIC Photos to JPG?
- **H2** How Does JPG Quality Affect the Result?
- **H3** Smaller Delivery Copies
- **H3** High-Quality Starting Point
- **H3** Higher-Quality Export
- **H2** HEIC versus JPG: Side-by-Side Comparison
- **H2** What If Windows Cannot Open My HEIC?
- **H2** HEIC to JPG Frequently Asked Questions
- **H3** Should I choose HEIC to JPG or HEIC to PNG?
- **H3** What happens to Wide Color (Display P3) in JPG?

### /heic-to-avif

- **H1** HEIC to AVIF Converter
- **H2** Select HEIC files to convert
- **H2** How to Convert HEIC to AVIF
- **H2** Will My App or Website Accept AVIF?
- **H3** AVIF Quality and Conversion Limits
- **H2** Image Format Comparison: HEIC vs AVIF vs PNG vs JPG

## Validation

- `npm run check`: passed application and worker TypeScript checks.
- `npm run build`: final production build passed; all 19 HTML documents generated.
- Generated HTML inspection confirmed one primary H1 per converter, intent-specific conversion-step H2s, and no skipped levels in each main H1–H3 sequence.
- `npm test`: **17 passed in 3.4 minutes**. Includes real HEIC → PNG/JPG/AVIF outputs, AVIF lossless/chroma behavior, rotation, resize, errors/cancellation/downloads, blog/static routes, ad state, new heading assertions and FAQ toggles/schema parity.
- Before/after hashes: only the three converter bodies changed. The other **16 page bodies are identical**. The homepage head changes only through its updated FAQ structured data; other page heads are identical.
- Across all built pages, ordered lists of existing non-empty CSS class attributes are identical. Ordered attribute signatures for elements with IDs and for buttons, inputs, selects, textareas and anchors are identical. Semantic heading tags/wrappers changed intentionally; DOM hooks, destinations and controls did not.
- Source hash comparison after removing verified build-only Markdown anchor-whitespace churn found only the new content module and the existing design renderer changed within `src/`. All converter/runtime/client/encoder/worker files, article bodies/frontmatter and both stylesheets are unchanged.
- Desktop (1280 px) and mobile (375 px) browser checks of all three converters found no horizontal document overflow. Seven screenshots were captured for visual review; JPG cards, AVIF compatibility content and homepage FAQ headings were inspected. Grid/card structure, colors, type classes, spacing rules, ad state and navigation are retained. Revised copy naturally changes text wrapping; no fixed-height or responsive CSS changes were introduced.
- `git diff --check`: passed.
- Existing outdated Browserslist-data notice remains non-blocking. No dependency update was made.
- No deployment or push was performed. The trailing-slash URLs use the existing route handling; no canonical or redirect changes are included.

## Technical references checked

- [W3C PNG specification](https://www.w3.org/TR/png-3/) — lossless encoding and format capabilities.
- [MDN image format guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types) — JPEG/PNG/AVIF capabilities and compatibility considerations.
- [Apple HEIF/HEVC guidance](https://support.apple.com/en-us/116944) — capture, viewing and export distinctions.
- Current `src/scripts/runtime.txt`, `src/scripts/converter.worker.ts` and `src/scripts/avif-encoder.ts` — actual file/batch limits, output behavior and encoder implementation.

[Local preview](http://127.0.0.1:4877/)

