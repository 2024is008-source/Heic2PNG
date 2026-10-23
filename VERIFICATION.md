# Implementation verification — October 23, 2026

AVIF was fully implemented after the initial PNG/JPG release, at the user's explicit request. The previously disabled AVIF controls and `/heic-to-avif` route are now enabled. No design removal was performed.

## Executed checks

| Check | Actual result |
| --- | --- |
| `npm run check` | Passed application/content TypeScript check and separately checked the conversion worker |
| `npm run build` | Passed; ten static pages, sitemap, robots, compiled assets, AVIF WebAssembly encoder and locally hosted fonts emitted to `dist/` |
| `npm test` | **10 passed in 41.8 seconds** in the complete AVIF/PNG/JPG functional run |
| `npm run test:visual` | Initial release completed 24 original/production full-page comparisons: four routes × six viewport widths |
| `node tests/visual.mjs heic-to-avif` | AVIF update completed six original/production full-page comparisons; header, converter heading and dropzone have zero differing pixels at every width |
| `node tests/headers.mjs` | Final focused navigation-alignment verification: **24/24 headers, zero differing pixels** |
| `node tests/states.mjs` | Queued and completed file-row comparisons: **zero differing pixels at all six widths**; mobile menus match at 390/375/320 |
| `npm audit --omit=dev --json` | Zero production-dependency findings at execution |
| Full `npm audit --json` | Seven build/development dependency advisories; see README limitations |
| VPS/Nginx/TLS validation | Not executed; deployment was not authorized and no VPS changes were made |

The directory was not a Git repository, so no Git diff, commit or PR was created. The approved original HTML remains unchanged. Its SHA-256 is `901DC094BDF66FA8B7691F06E8C81790183DDF2EC6A3BED0ECF5A1DD10602C45`.

## Functional coverage

1. A real public libheif HEIC fixture converts into a decodable **1280×854 PNG**. A batch of two images produces a real ZIP with two independently decodable PNGs and collision-safe filenames. No POST/image-upload request occurs, and no page JavaScript error is raised.
2. Real JPEG output has JPEG signatures, quality 100 produces materially different/larger bytes than quality 40, and 50% resizing yields **640×427**, using the actual source aspect ratio.
3. A real portrait HEIC from pillow-heif contains an `irot` property and decodes into an upright **3024×4032 PNG**. The test checks both dimensions and the known arrow's directional geometry. The output was also inspected visually.
4. PDF/non-HEIC inputs, renamed files and a malformed HEIF container produce genuine errors. Download stays disabled after a failed conversion, and retry remains available.
5. Drag/drop queues real files. Clearing during decoding cancels the worker, removes rows and prevents stale results; conversion works again afterward.
6. All required static routes, including `/heic-to-avif`, load; titles are unique, canonical metadata and JSON-LD are present, sitemap/robots work, and missing/draft routes return 404 in the isolated static verification server.
7. Search/category filters, no-results reset, FAQ toggles, Tools/Escape, mobile navigation, JPG refresh routing and the configured support-email handoff work.
8. Real HEIC fixtures produce AVIF containers that decode natively in Chrome at **1280×854**. Batch ZIP downloads contain two valid `.avif` files with collision-safe filenames. Quality 40 versus 95 changes actual file bytes, size and decoded pixels. Inspecting the AV1 configuration verifies 4:2:0 versus 4:4:4 chroma. No POST or image-upload request occurs, and no page/CSP error is raised.
9. AVIF lossless mode disables the lossy slider and produces a **640×427** image whose decoded RGBA SHA-256 exactly matches the resized PNG reference. Returning to lossy mode re-enables the slider and invalidates the previous output. Lossless applies to the decoded 8-bit pixels, not the source HEIC bitstream or lost HDR/ICC data.
10. The portrait HEIC's orientation/aspect ratio is preserved in a **378×504 AVIF**. AVIF cancellation, invalid-input errors, tool-tab navigation, direct URL loading and refresh are tested. All existing PNG/JPG tests pass in the same run.

The functional tests ran against built files under the same restrictive CSP shown in the Nginx example, using installed desktop Chrome. Real iPhone/Safari/Android/Firefox testing and exhaustive unsupported-camera coverage remain unperformed.

The AVIF encoder is the unmodified single-thread `@jsquash/avif` 2.1.1 codec, loaded only when converting to AVIF. The CSP permits WebAssembly compilation through `'wasm-unsafe-eval'`; JavaScript eval and inline event-handler execution remain blocked. No SharedArrayBuffer, COOP/COEP headers or remote encoding service is used.

## UI Preservation Verification

The approved source HTML supplies the DOM, custom CSS, Tailwind tokens/classes, fonts, colors, gradients, shadows, spacing, cards and responsive breakpoints. Screenshots compare the original's independent Tailwind 3.4.17 CDN runtime to the production compiled CSS; the CDN script is local only in the test harness. Both use the exact approved Inter and JetBrains Mono font files, eliminating network/fallback-font differences.

Comparison widths: **1440, 1024, 768, 390, 375 and 320 px**.

| Area | Comparison result |
| --- | --- |
| Header/navigation | Zero differing pixels in the final focused comparison for all four routes at all widths |
| Converter headings | Zero differing pixels on PNG/JPG at all widths |
| Upload dropzones | Zero differing pixels on PNG/JPG at all widths |
| AVIF header, converter heading and dropzone | Zero differing pixels at 1440, 1024, 768, 390, 375 and 320 px in the AVIF update |
| Queued file rows | Zero differing pixels at all six widths with real file data substituted into the original renderer |
| Completed file rows | Zero differing pixels at all six widths with actual sizes/dimensions/previews substituted into the original renderer |
| Mobile menu | Zero differing pixels at 390, 375 and 320 px |
| Advanced settings | Same controls/classes/layout; truthful labels, disabled unsupported controls and removal of fabricated dimensions cause text reflow and different panel heights |
| Blog/cards/article/footer | Same templates/classes; counts, disabled unpublished guides, factual corrections and removed developer links cause expected full-page differences |

Full-page pixel differences range from about **0.038% to 10.669%** before the final navigation-only alignment correction. A 16px text-wrap change can shift every following section, making a full-page percentage much larger than the local text difference. These numbers are not a claim of zero full-page differences. The final header-only correction was independently rechecked without rerunning unrelated conversion tests.

AVIF full-page differences range from **0.181% to 6.319%**. The original styles and layout classes remain the baseline; differences reflect the corrected encoder note/quality summary, honest HDR wording, and previously documented developer-link removal. The original AVIF controls are enabled, and lossless mode adds only the necessary disabled-slider state.

Original baselines deliberately remove only developer inspectors, UI-state presets and the sample-loader control, start with an empty real-file state, and limit blog cards to the one supplied article body. Row-specific comparisons substitute the real fixture's data and thumbnail into the original renderer so the visual comparison measures layout rather than fake versus real content.

The inherited article layout overflows a 320px viewport to a 360px full-page screenshot in both versions. This existing responsive behavior is documented rather than silently redesigned.

Raw evidence (generated locally, ignored by Git):

- `test-results/visual/results.json` — 24 full-page comparisons plus header/hero/dropzone/footer crop measurements.
- `test-results/visual/heic-to-avif-results.json` — six current AVIF comparisons and their original/production/difference screenshots. Playwright clears `test-results` when starting a functional run, so rerun visual checks after functional tests to regenerate earlier screenshots.
- `test-results/visual/headers-final.json` — final corrected header results and accompanying header screenshots.
- `test-results/states/results.json` — file rows, advanced settings and mobile-menu results.
- `test-results/visual/*-original.png`, `*-production.png`, `*-diff.png` — full-page evidence.
- `playwright-report/index.html` — functional report.

## Remaining limitations

AVIF conversion, controls, navigation, SEO, individual downloads and ZIP downloads are implemented and verified. Nine card-only articles remain unpublished drafts. Live AdSense/CMP activation is not implemented; placements and publisher validation are prepared with all ad execution disabled. ICC/HDR fidelity, retained EXIF, auxiliary layers and multi-frame preservation are unsupported and documented in the UI. Contact opens the visitor's email client; it does not submit mail from the VPS. Deployment, certificate installation and real-device acceptance testing remain separate work.

See `README.md` for implementation/file details and local commands, and `deploy/README.md` for the separate Nginx server block, DNS/TLS instructions and rollback procedure.
