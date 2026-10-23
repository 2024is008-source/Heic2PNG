# HEIC2PNG.site

Static Astro website built around the supplied approved HTML. The original file is unchanged; it remains the design source used during prerendering. React was not introduced because the existing DOM-based controls can be connected directly without replacing the approved component structure.

## Run locally

Requires Node 24 LTS and npm.

```sh
npm ci
npm run dev
```

Open the localhost URL printed by Astro. `npm run build` produces `dist/`; `npm run preview` serves the production build locally. Framework telemetry is disabled by the included command wrapper. `.env.example` contains public build-time configuration; the support mailbox defaults to **backbencherz@gmail.com**. The contact form opens a composed email in the visitor's email application and never claims delivery.

## Implemented

- Real browser-side HEIC/HEIF decoding using `heic-to` in a disposable worker, with PNG, quality-controlled JPEG and WebAssembly AVIF encoding. No image upload, conversion endpoint, database or server image processing.
- AVIF quality defaults to 78%; 4:2:0, 4:4:4 and lossless modes use the original settings controls. Lossless automatically uses full quality and 4:4:4, and disables the lossy quality slider. The encoder is lazy-loaded and single-threaded inside the conversion worker, without SharedArrayBuffer or cross-origin-isolation requirements.
- File picker, drag and drop, multiple files, real filenames and sizes, actual result thumbnails, source resolution/orientation, individual removal, clear/cancel, per-file errors and retry via the conversion button.
- Genuine PNG/JPG/AVIF downloads and JSZip archives. Duplicate names are suffixed; names are sanitized to prevent archive path traversal. No generated gradient images, sample queue, invented output sizes, conversion timers or fake percentages run in production.
- Sequential decoding, 100 MB/file and 50-file limits, 256 MB aggregate input, 512 MB retained output, 60 MP image/output limits, declared-dimension preflight and timeouts (two minutes for PNG/JPG, five minutes for AVIF). Workers, bitmaps and preview URLs are cleaned up. Very large or complex files may still exceed a particular mobile browser's memory capacity.
- Original resolution, half-size, maximum-1920-pixel-width and custom sizing. Aspect locking uses each image's actual ratio. JPEG uses the chosen quality and a white background for transparent input.
- Static routes: `/`, `/heic-to-jpg`, `/heic-to-avif`, `/blog`, published `/blog/[slug]`, `/about`, `/contact`, `/privacy`, `/terms`, and a genuine 404 document. Direct navigation and refresh work with the supplied Nginx configuration.
- Astro Content Collections with Markdown/MDX, validated metadata, dates, author, category, descriptions, draft exclusion, search, category filtering and six-item client pagination over statically rendered article links. Featured images and related slugs are available in the schema. The supplied fully styled article stays in its approved HTML-in-Markdown template; copy its structure when authoring another article to preserve the design.
- Unique titles/descriptions, canonical URLs, Open Graph/Twitter metadata, structured data, sitemap and robots.txt. All three verified converters are indexable; drafts have no public routes or sitemap entries.
- Compiled Tailwind 3 CSS with the exact original configuration and custom CSS, locally hosted approved font families/weights, lazy decoder/ZIP loading, static asset caching and a CSP-compatible event binding layer without inline JavaScript execution.
- Existing ad containers and spacing retained. Publisher configuration is validated, but ad loading is deliberately gated off until a consent-controlled isolated integration is verified. No ad/analytics script has access to the converter document or its images.

## Important files

| File | Purpose |
| --- | --- |
| Original long-named `.html` file | Unchanged approved UI source; includes the retained AVIF and design-studio views |
| `src/lib/design.mjs` | Prerenders selected approved views, connects real navigation, removes developer controls and applies documented technical corrections |
| `src/pages/[...path].astro` | Static page routes, metadata, structured data and content rendering |
| `src/styles/approved.css`, `tailwind.config.cjs` | Exact extracted custom CSS and Tailwind design tokens |
| `src/scripts/converter.worker.ts` | HEIF size preflight, decoding, resizing and PNG/JPEG encoding |
| `src/scripts/avif-encoder.ts` | Lazy browser AVIF encoder, actual quality/chroma/lossless settings and container validation |
| `src/scripts/runtime.txt` | Functional browser runtime source fragment |
| `scripts/prepare-client.mjs` | Combines preserved UI renderers and runtime into `src/scripts/client.ts` during builds |
| `src/content/blog/` | One complete supplied article and nine unpublished drafts whose bodies were not supplied |
| `src/components/AdSlot.astro` | Existing reserved ad markup with disabled integration configuration |
| `tests/` | Real HEIC integration tests, isolated static test server and original-versus-production visual comparisons |
| `deploy/` | Separate Nginx site configuration, safe DNS/TLS deployment and rollback instructions |

`scripts/extract-design.mjs` records the initial extraction process. It is not part of normal builds and would reset extracted content from the original prototype; do not run it after editorial changes unless deliberately regenerating those files.

## UI Preservation Verification

The original HTML, custom CSS, palette, typography classes, shadows, spacing, layout widths and responsive breakpoints remain the design baseline. Navigation is converted to real links with the original button display/alignment restored. The original AVIF design is now functional at `/heic-to-avif`, including its settings, navigation, tool card, article link and footer link.

The permitted visible deviations are removal of development inspectors/state presets/sample loaders; an empty real-file queue; actual file data, thumbnails, errors and completion states; honest disabled metadata/color controls; real published-article counts; disabled links to unpublished guides; and corrections to unsupported technical/testing claims. The footer's development-spec link is omitted. No new ad positions or cosmetic layout rules were added.

Visual comparison runs the **original Tailwind CDN runtime independently**, then compares against the compiled production CSS. Both sides use the exact approved font files. Baselines remove development controls and simulated queued files, and restrict blog cards to the one article with a body. Original, production and difference screenshots are written at 1440, 1024, 768, 390, 375 and 320 pixels for PNG, JPG, AVIF, blog and article pages. Full-suite results are recorded in `test-results/visual/results.json`; the focused AVIF update is in `test-results/visual/heic-to-avif-results.json`. These comparisons are not a claim that all full-page pixels match: truthful content changes and actual inventory counts produce expected differences. The original article itself overflows a 320px viewport to 360px; the production page retains this inherited behavior rather than silently changing the approved breakpoint/layout.

## Technical/content limitations and corrections

- **AVIF precision:** output is 8-bit RGB. Lossless means no additional loss relative to the decoded/resized 8-bit pixels; it cannot restore details already discarded by HEIC or preserve source HDR/ICC metadata. Encoding can be slower than PNG/JPG, particularly on mobile; the existing clear/remove controls cancel work.
- **Color and metadata:** output is 8-bit RGB. Source ICC/HDR fidelity, auxiliary alpha/depth, animation/Live Photos and multi-image sequence preservation are not promised. Camera/GPS EXIF is always removed; retaining metadata is unavailable. The controls reflect these limits. Keep originals for archival use.
- **Article inventory:** only the Windows guide has a supplied complete body. Nine original sample cards remain drafts and have no public URLs. No unrelated article body is substituted under their titles. Their disabled related-guide previews are preserved in the supplied article design.
- **Ads:** all ad areas are temporarily hidden by default, including their labels and reserved space on converter and article pages. To restore the existing placements, set `PUBLIC_SHOW_AD_AREAS=true` in `.env`, then run `npm run build` and redeploy (restart the development server when using dev mode). Set it back to `false` to hide them again. This switch restores the areas; live AdSense/CMP integration still needs separate setup. Configuring a publisher ID does not enable third-party scripts. No publisher or slot identifier was invented.
- **Device support:** browser integration tests use desktop Chrome. A real iPhone/Safari/Android/Firefox device matrix has not been executed. OffscreenCanvas/Workers/modern browser APIs are required; failures produce honest per-file errors.
- **Nginx/TLS:** deployment instructions are prepared, but no VPS, DNS or certificate changes have been made. Nginx validation must be run on the VPS.
- **Build dependencies:** the network-backed npm audit found seven advisories in Tailwind 3's development/build dependency chain (including braces, with no patched 3.x release available at inspection). `npm audit --omit=dev` reported zero production-dependency findings. Tailwind 4 was not substituted because it would change the approved CSS baseline. No build dependency is served from `dist/`.

Corrections to public copy are limited to unsupported P3/HDR/alpha/EXIF promises, the claim that the selected HEIC decoder is a WebAssembly pipeline (it is currently a JavaScript libheif build), and unsubstantiated device-testing claims in the article. AVIF encoding itself uses WebAssembly. Educational sections and the original article body otherwise remain supplied content. Detailed testing evidence is in `VERIFICATION.md`.

## Tests

```sh
npm run check
npm run build
npm test
```

The Playwright config uses an installed Chrome channel. Set `PLAYWRIGHT_CHANNEL` for another installed Chromium-based channel, or install Chrome with Playwright. The test server uses port **4876**, separate from Astro's default port. For visual comparisons, start `node tests/server.mjs` in another terminal, then run `npm run test:visual`. This server exposes test-only original HTML endpoints and must never be deployed publicly.

Real fixtures are described in `tests/fixtures/README.md`. The checks validate PNG pixel dimensions, JPEG signatures and quality-dependent bytes, ZIP entries, rotation, resizing, corrupt/renamed files, cancellation, routes, metadata, sitemap, menus, FAQs, filtering and the email handoff. A malformed HEIF fixture exercises decoder failure; this does not establish coverage of every unsupported camera variant.

## Deploy

Build with `npm run build` and deploy only `dist/` to the new release directory. Follow `deploy/README.md` for the separate Nginx block, DNS, dedicated TLS certificate, validation, reload and rollback procedure. Do not overwrite another site's root, server block or certificates. Deployment requires a separate explicit instruction.

The decoder's LGPL notice/source links and font licenses are retained under `public/legal/` and `public/fonts/`. Review third-party license obligations when redistributing a modified decoder.
