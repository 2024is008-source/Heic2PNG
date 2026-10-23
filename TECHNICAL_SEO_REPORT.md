# Technical SEO audit and safe application fixes

Date: 23 October 2026. Live HTTP sample: 2026-10-23T15:13:05.229Z. Scope: local Astro source, the final static build, public HTTPS responses through Cloudflare, responsive browser checks and all automated Playwright tests. No live Cloudflare/Nginx change, deployment, reload or change to tiksavemp4.online was made.

## Prioritized findings

| Priority | Finding and evidence | Status / recommended action |
| --- | --- | --- |
| P1 | Live release is older than the current source: 17 non-root canonical tags and all non-root sitemap URLs remain slashless. The live preferred host is already apex, but www serves 200. | Current source already emits the preferred trailing-slash identities. Deploy a reviewed release separately, then manually review the existing HEIC-only redirect proposal. No automatic infrastructure action. |
| P1 | www and explicit directory-index aliases still return 200, although their canonicals point to apex identities. HTTP → HTTPS already returns 301 with query/path preserved. | Manual HEIC-only Nginx/Cloudflare review. Retain valid inbound links; avoid conflicting slash/host rules and Cloudflare Flexible-mode loops. |
| P2 | Blog search had no explicit accessible name. The hidden file input also lacked a name. | **Fixed in source:** added accessible names without changing visible labels/placeholders. |
| P2 | Escape closed the mobile drawer while leaving aria-expanded=true. Menu relationships and initial FAQ states were incomplete. | **Fixed in source:** aria-controls and accurate initial state; shared ARIA synchronization also runs after Escape. Existing toggles, event hooks and visuals remain. |
| P2 | Fresh local homepage navigation requested all eight TTF fonts: 1,966,500 decoded bytes. The approved logo adds 419,763 bytes. | Performance opportunity, not a measured CWV failure. Evaluate metric-preserving WOFF2/coverage optimization and lossless logo delivery with visual verification. Fonts/logo were not replaced or restyled here. |
| P2 | Windows article at 320px has a document width of 360px. The illustrative queue status extends beyond the viewport; its comparison table also has content wider than its clipped container. | Recorded for a focused responsive/layout review. No layout/CSS change under this task's no-restyling rule. The tested 375px article view has no document overflow. |
| P2 | No usable field/Lighthouse result was retrieved: the public PageSpeed API returned HTTP 429 RESOURCE_EXHAUSTED. | Obtain Search Console/CrUX or an authorized PageSpeed run before prioritizing LCP/INP/CLS work. No score or improvement is claimed. |
| P3 | Content preparation added another space to existing anchor tags on each build and rewrote otherwise unchanged article sources. | **Fixed:** processing is idempotent and writes only changed content. Two consecutive runs changed zero article files. |
| P3 | Unversioned fonts.css and font filenames have a 30-day live cache lifetime. TTF responses use generic application/octet-stream. | Existing Chrome loads them correctly. When changing fonts, use versioned delivery/cache coordination and review HEIC-only MIME settings manually. |
| P3 | Browser implicitly requests missing /favicon.ico locally, receiving the custom 404 HTML. | Provide a separately reviewed brand favicon later. No new logo artwork or placeholder favicon was invented. |
| P3 | Common client JavaScript is loaded on non-converter pages too. | The entry is only 21,156 decoded bytes locally and supplies shared menus/search/contact behavior. Splitting is optional future work; do not remove it without replacing those functions. |

No accidental noindex, missing canonical, broken required worker/WASM resource, or missing indexable page was found in the verified final build.

## Application changes implemented

1. src/lib/design.mjs adds search/file-picker accessible names, menu aria-controls, and FAQ expanded/controlled relationships derived from their actual initial visibility. No class, text, spacing or layout change.
2. src/scripts/runtime.txt synchronizes disclosure attributes after Escape as well as click. The generated src/scripts/client.ts reflects this source change. No decode/encode, quality, resize, queue, worker or download logic was changed.
3. scripts/prepare-content.mjs stops accumulating anchor whitespace and avoids rewriting unchanged files.
4. tests/server.mjs accepts an optional HEIC_TEST_DIST path so validation can serve a frozen build. An external regeneration of dist removed 404.html mid-run and interrupted an earlier test run; the complete final run used an immutable copy of the freshly generated output.
5. tests/technical-seo.spec.ts checks every indexable page with JavaScript disabled and checks disclosure/search accessibility. tests/avif.spec.ts additionally verifies actual worker/WASM responses and MIME during real conversion.

Stylesheets, font/image assets, article wording, source publication dates, converter.worker.ts and avif-encoder.ts remain unchanged from the start of this task. Earlier uncommitted work was preserved.

## Sitemap, robots and indexing

**Local final build:** 18 unique sitemap entries: homepage, JPG, AVIF, blog archive, About, Contact, Privacy, Terms and ten published articles. Every entry is an intended, HTTPS/non-www/trailing-slash canonical page with HTTP 200, one canonical tag and no noindex. Three drafts, errors and query/filter aliases are excluded. The existing sitemap implementation and source robots.txt already satisfy these requirements and were left unchanged.

**Production:** sitemap.xml returns 200 with XML content type and 18 intended pages. Entries match the live release's older slashless canonical policy; they do not yet match the preferred policy already implemented in local source. All 18 checked live intended pages return 200 and have one canonical, an H1, description and viewport in the raw response. No accidental meta or X-Robots-Tag noindex was observed on them.

Production robots.txt returns 200 text/plain. Cloudflare prepends managed content signals and explicit crawler exclusions to the source file. The retrieved file does not disallow Googlebot; its wildcard Allow: / leaves /_astro/, /fonts/ and /brand/ crawlable. It separately excludes several AI/other crawlers, including GoogleOther and Google-Extended, which should not be conflated with Googlebot. These owner/provider policies were not overwritten. Googlebot WAF access from Google's real IPs, Search Console coverage and Cloudflare dashboard settings were not independently verified.

Source robots.txt remains:

```text
User-agent: *
Allow: /
Sitemap: https://heic2png.site/sitemap.xml
```

Missing and draft URLs return real 404 responses with noindex,follow, rather than HTTP-200 homepage fallbacks. The local custom error remains dist/404.html. Its noindex status is intentional.

## Production HTTP and canonical checks

These are actual public responses from the older live release, not claims that the new local source is deployed. No 308 response was observed; the HTTP scheme redirect uses the valid permanent 301 status.

| Requested URL | Status | Canonical or redirect destination | Index directive |
| --- | --- | --- | --- |
| https://heic2png.site/ | 200 | https://heic2png.site/ | No noindex observed |
| https://heic2png.site/heic-to-jpg/ | 200 | https://heic2png.site/heic-to-jpg | No noindex observed |
| https://heic2png.site/heic-to-avif/ | 200 | https://heic2png.site/heic-to-avif | No noindex observed |
| https://heic2png.site/blog/ | 200 | https://heic2png.site/blog | No noindex observed |
| https://heic2png.site/about/ | 200 | https://heic2png.site/about | No noindex observed |
| https://heic2png.site/contact/ | 200 | https://heic2png.site/contact | No noindex observed |
| https://heic2png.site/privacy/ | 200 | https://heic2png.site/privacy | No noindex observed |
| https://heic2png.site/terms/ | 200 | https://heic2png.site/terms | No noindex observed |
| https://heic2png.site/blog/heic-to-jpg-vs-png-which-format-should-you-choose/ | 200 | https://heic2png.site/blog/heic-to-jpg-vs-png-which-format-should-you-choose | No noindex observed |
| https://heic2png.site/blog/heic-vs-png-quality-file-size-compatibility/ | 200 | https://heic2png.site/blog/heic-vs-png-quality-file-size-compatibility | No noindex observed |
| https://heic2png.site/blog/how-to-convert-heic-images-for-website-uploads/ | 200 | https://heic2png.site/blog/how-to-convert-heic-images-for-website-uploads | No noindex observed |
| https://heic2png.site/blog/how-to-convert-heic-to-jpg-on-iphone/ | 200 | https://heic2png.site/blog/how-to-convert-heic-to-jpg-on-iphone | No noindex observed |
| https://heic2png.site/blog/how-to-convert-heic-to-jpg-without-losing-quality/ | 200 | https://heic2png.site/blog/how-to-convert-heic-to-jpg-without-losing-quality | No noindex observed |
| https://heic2png.site/blog/how-to-convert-heic-to-png-on-mac/ | 200 | https://heic2png.site/blog/how-to-convert-heic-to-png-on-mac | No noindex observed |
| https://heic2png.site/blog/how-to-convert-heic-to-png-on-windows-11/ | 200 | https://heic2png.site/blog/how-to-convert-heic-to-png-on-windows-11 | No noindex observed |
| https://heic2png.site/blog/how-to-fix-heic-files-that-wont-open/ | 200 | https://heic2png.site/blog/how-to-fix-heic-files-that-wont-open | No noindex observed |
| https://heic2png.site/blog/how-to-open-heic-files-on-windows-and-mac/ | 200 | https://heic2png.site/blog/how-to-open-heic-files-on-windows-and-mac | No noindex observed |
| https://heic2png.site/blog/why-does-my-iphone-save-photos-as-heic/ | 200 | https://heic2png.site/blog/why-does-my-iphone-save-photos-as-heic | No noindex observed |
| https://heic2png.site/robots.txt | 200 | — | No noindex observed |
| https://heic2png.site/sitemap.xml | 200 | — | No noindex observed |
| http://heic2png.site/heic-to-jpg/?utm_source=seo-audit | 301 | 301 → https://heic2png.site/heic-to-jpg/?utm_source=seo-audit | No noindex observed |
| https://www.heic2png.site/heic-to-jpg/?utm_source=seo-audit | 200 | https://heic2png.site/heic-to-jpg | No noindex observed |
| https://heic2png.site/heic-to-jpg | 200 | https://heic2png.site/heic-to-jpg | No noindex observed |
| https://heic2png.site/heic-to-jpg/index.html?utm_source=seo-audit | 200 | https://heic2png.site/heic-to-jpg | No noindex observed |
| https://heic2png.site/blog/index.html | 200 | https://heic2png.site/blog | No noindex observed |
| https://heic2png.site/blog/?category=Image%20Formats&q=PNG | 200 | https://heic2png.site/blog | No noindex observed |
| https://heic2png.site/technical-seo-missing-20261023/ | 404 | https://heic2png.site/404 | noindex,follow |
| https://heic2png.site/technical-seo-missing-20261023 | 404 | https://heic2png.site/404 | noindex,follow |
| https://heic2png.site/blog/heic-vs-avif-whats-the-difference/ | 404 | https://heic2png.site/404 | noindex,follow |
| https://heic2png.site/blog/what-is-a-heic-file-beginners-guide/ | 404 | https://heic2png.site/404 | noindex,follow |
| https://heic2png.site/blog/how-to-convert-multiple-heic-photos-at-once/ | 404 | https://heic2png.site/404 | noindex,follow |

## Static rendering, semantics and accessibility

- All metadata and article/converter explanatory content are rendered into static HTML by Astro; indexing does not depend on client-side conversion code.
- Browser validation with JavaScript disabled passed across all 18 indexable pages at 375px: visible main content/H1, title, description, canonical, English document language and width=device-width, initial-scale=1.0 viewport.
- No duplicate IDs or missing main landmarks were found in the 19-document static scan. All form controls now have a label or accessible name; the hidden native file input remains paired with the existing visible picker interaction.
- Header menus close with Escape and now expose the correct closed state. FAQ state matches the initial visible/hidden panels and updates after toggles.
- Thirty extra layout checks covered homepage, JPG, AVIF, blog and Windows article at 320, 375, 390, 768, 1024 and 1440px. The one document-overflow result was the Windows article at 320px, recorded above.
- These checks do not constitute full WCAG certification, a screen-reader usability study or a contrast audit. Existing colors and layout were preserved.

## Images, fonts, layout-shift risks and JavaScript

The header/footer use the same approved PNG within SVG viewports with explicit dimensions and accessible names. The repeated URL is reused rather than requiring a second logo download. Article diagrams are inline HTML/SVG rather than unbounded external screenshots. The upload queue's small generated previews are part of converter UI. No image format was re-encoded and no required resource removed.

The fixed logo viewport and existing hidden-ad styling provide useful geometry safeguards. Fonts already use font-display: swap. Font replacement can still shift text; no measured CLS value is available here. There is no basis to promise CLS=0, an LCP reduction or a Lighthouse score increase.

A fresh local Chrome homepage session, after fonts loaded, observed:

| Resource group | Decoded bytes |
| --- | ---: |
| Eight requested TTF faces | 1,966,500 |
| Approved logo PNG | 419,763 |
| Generated CSS | 37,535 |
| Shared JavaScript entry | 21,156 |
| Font CSS | 1,302 |
| Total above, excluding document and implicit favicon request | 2,446,256 |

These are measured decoded resource sizes from the local static server, **not** compressed production transfer totals, device field data or Core Web Vitals. Inter and JetBrains Mono loaded successfully.

The initial navigation did not request the conversion worker, AVIF encoder/WASM or ZIP module. They remain lazy: the worker runs on conversion, AVIF loads its encoder/WASM when needed, and ZIP code loads on ZIP download. The main shared entry is necessary for the existing menus, FAQ, blog filters and contact behavior, so it was not stripped from pages.

## Production caching, MIME and runtime assets

Observed HTML and sitemap responses are Cloudflare DYNAMIC and have no explicit Cache-Control in the inspected headers. This is not itself an indexing error. Fingerprinted JS/CSS use a one-year cache lifetime; font CSS/TTFs use 30 days; the logo and robots.txt show four-hour cache policy. CSS/JS compression and ETag/Last-Modified headers were observed; conditional 304 behavior was not independently tested.

| Asset URL | Status | MIME | Cache-Control |
| --- | --- | --- | --- |
| https://heic2png.site/fonts/fonts.css | 200 | text/css | max-age=2592000 |
| https://heic2png.site/_astro/_..DKWI-5o6.css | 200 | text/css | max-age=31536000 |
| https://heic2png.site/brand/heic2png-logo.png | 200 | image/png | max-age=14400 |
| https://heic2png.site/_astro/_...path_.astro_astro_type_script_index_0_lang.6LgET1EG.js | 200 | application/javascript | max-age=31536000 |
| https://heic2png.site/fonts/Inter-400.ttf | 200 | application/octet-stream | max-age=2592000 |
| https://heic2png.site/fonts/Inter-500.ttf | 200 | application/octet-stream | max-age=2592000 |
| https://heic2png.site/fonts/Inter-600.ttf | 200 | application/octet-stream | max-age=2592000 |
| https://heic2png.site/fonts/Inter-700.ttf | 200 | application/octet-stream | max-age=2592000 |
| https://heic2png.site/fonts/Inter-800.ttf | 200 | application/octet-stream | max-age=2592000 |
| https://heic2png.site/fonts/JetBrains-Mono-400.ttf | 200 | application/octet-stream | max-age=2592000 |
| https://heic2png.site/fonts/JetBrains-Mono-500.ttf | 200 | application/octet-stream | max-age=2592000 |
| https://heic2png.site/fonts/JetBrains-Mono-600.ttf | 200 | application/octet-stream | max-age=2592000 |
| https://heic2png.site/_astro/converter.worker-Ddi2gMQz.js | 200 | application/javascript | max-age=31536000 |
| https://heic2png.site/_astro/jszip.min.uG50CNN7.js | 200 | application/javascript | max-age=31536000 |
| https://heic2png.site/_astro/libheif.wasm | 404 | text/html | No explicit Cache-Control observed |
| https://heic2png.site/_astro/avif-encoder-B_p9qBRl.js | 200 | application/javascript | max-age=31536000 |
| https://heic2png.site/_astro/avif_enc.wasm | 404 | text/html | No explicit Cache-Control observed |
| https://heic2png.site/_astro/avif_enc-Co4TcJko.wasm | 200 | application/wasm | max-age=31536000 |

The two unversioned library fallback names, /_astro/libheif.wasm and /_astro/avif_enc.wasm, were speculative probes found by scanning bundle strings and returned 404. They were **not requested during passing real conversion tests**. The actual configured AVIF dependency is /_astro/avif_enc-Co4TcJko.wasm, which returned 200 application/wasm and passed WebAssembly.validate on its downloaded bytes. Missing inactive fallback strings do not justify inventing duplicate codec files or changing a working loader.

The real public runtime dependency checks returned 200 for the entry, converter worker, ZIP module, AVIF encoder and fingerprinted WASM. The worker is 3,153,621 decoded bytes and the AVIF WASM is 3,485,872 bytes. Current CSP permits same-origin workers and WebAssembly compilation. The single-thread AVIF encoder does not require global COOP/COEP or changes to the other VPS site.

The local scan found all 95 explicit HTML asset references present. Real PNG, JPG and AVIF tests verified dimensions, rotation, quality/chroma behavior, lossless AVIF pixel matching, ZIP contents, cancellation and genuine errors. The instrumented AVIF test observed successful worker/WASM requests with application/wasm MIME and no HTTP error among its JS/WASM dependencies.

## Core Web Vitals evidence and limits

The public mobile PageSpeed API request returned HTTP 429 RESOURCE_EXHAUSTED (quota), not a Lighthouse result. No Search Console or CrUX account data was supplied. No field LCP, INP or CLS measurement, Lighthouse score, ranking improvement or before/after performance gain is claimed. The API failure does not demonstrate that the site lacks CrUX data or fails CWV.

Prioritize measurement first, then the observed font/logo payload and narrow-screen issue. Conversion CPU work already runs off the main thread, but user-perceived conversion duration and interaction performance still depend on source dimensions, device and encoder settings.

## Infrastructure recommendations — manual review only

- Review deployment of the verified source separately; the live site still serves older metadata/canonicals/sitemap policy.
- Review the existing [HEIC-only canonical Nginx proposal](deploy/heic2png.canonical.conf.example) and [canonical audit](CANONICAL_URL_REPORT.md). Nothing was installed or reloaded here.
- Before any origin HTTPS enforcement, verify Cloudflare Full (strict), a valid certificate for both HEIC hostnames and no competing host/slash redirects. Preserve paths and queries.
- Keep previously referenced fingerprinted assets available through a release transition; coordinate any HEIC HTML/sitemap cache refresh so cached documents do not reference removed assets.
- Review only this site's font MIME/cache configuration when changing font delivery. Do not edit global/shared settings or tiksavemp4.online.
- Astro's static source cannot impose origin HTTP cache headers or real host redirects on an existing Nginx deployment by adding an ineffective source-side metadata tag.

## Verification results

- npm run check: passed.
- npm run build: passed, 19 HTML pages and sitemap.xml.
- npm test -- --reporter=list: **23 passed (48.1 seconds)** on the final frozen build.
- Content preparation repeated twice: zero article file changes on either run.
- Sitemap/canonical/robots checks, JavaScript-disabled rendering, responsive/accessibility checks and actual worker/WASM-backed conversion checks completed as described above.
- npm run test:visual: completed successfully with **30 comparisons** across five routes and six viewport widths. Its reference is the original prototype, which predates the approved logo, hidden ads and earlier content changes; differences against that old reference are not evidence of new regressions or pixel-identical validation. The current source stylesheets and all article text remain unchanged in this task.
- git diff --check: passed, Git line-ending notices only.

## Files changed in this task

- src/lib/design.mjs: accessible names and disclosure relationships/states.
- src/scripts/runtime.txt: menu ARIA synchronization after Escape.
- src/scripts/client.ts: regenerated from runtime source.
- scripts/prepare-content.mjs: idempotent anchor handling and change-only writes.
- tests/technical-seo.spec.ts: no-JavaScript SEO/responsive and disclosure accessibility checks.
- tests/avif.spec.ts: actual runtime asset status/MIME assertions.
- tests/server.mjs: optional frozen-build root for reliable verification.
- TECHNICAL_SEO_REPORT.md: this report.

Primary references: [Google robots interpretation](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec), [Google crawler distinctions](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers), [JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals), [web-font loading guidance](https://web.dev/articles/optimize-webfont-loading).

