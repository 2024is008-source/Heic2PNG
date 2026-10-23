# PageSpeed findings and fixes

Reviewed October 24, 2026. No deployment, Cloudflare setting change, Nginx modification/reload or change to `tiksavemp4.online` was made. The previous GA4 work is preserved.

## Supplied production reports

The exact reports were opened in Chrome and their expanded diagnostics inspected:

- [Mobile report](https://pagespeed.web.dev/analysis/https-heic2png-site/73uzinejxl?form_factor=mobile)
- [Desktop report](https://pagespeed.web.dev/analysis/https-heic2png-site/73uzinejxl?form_factor=desktop)

| Production lab result, captured October 24 at 00:34 | Mobile | Desktop |
| --- | --- | --- |
| Performance | 96 | 97 |
| Accessibility | 97 | 97 |
| Best Practices | 92 | 92 |
| SEO | 100 | 100 |
| FCP | 2.1 s | 0.9 s |
| LCP | 2.1 s | 0.9 s |
| Total blocking time | 0 ms | 0 ms |
| CLS | 0.004 | 0.002 |
| Speed Index | 3.2 s | 1.4 s |

The reports have **no real-user field data**. These are Lighthouse lab results, not measured production Core Web Vitals percentiles. The performance scores are already high; a redesign or removal of converter features would not be justified.

## Findings and implemented source fixes

| Finding | Evidence | Fix |
| --- | --- | --- |
| Blocking font stylesheet and heavy fonts | Mobile report estimates 450 ms savings across render-blocking requests. It lists `/fonts/fonts.css` followed by eight TTF downloads, with critical-chain latency up to 4,047 ms. A fresh production fetch confirmed `fonts.css` is a Cloudflare HIT with `max-age=2592000`, containing TTF references and no WOFF2. | Embed the small, locally generated font-face definitions in the shared head, eliminating the extra stylesheet request and dependency on that stale cached URL. Use smaller WOFF2 subsets. Existing stylesheet and full-font URLs remain available for old pages and non-common characters. |
| Full WOFF2 files still larger than needed for common text | Local source already had lossless WOFF2 versions, totaling 672,512 bytes across the eight weights. | Add common Latin/punctuation/symbol subsets totaling **329,064 bytes**, a **51.1% reduction** in those font assets. Complementary `unicode-range` faces retain the original full fonts. No source fonts or licenses were deleted. |
| Logos/theme only cached for four hours | Both reports identify approximately 26 KiB of cache savings for the light/dark logos and `/theme.js`. Live `/theme.js` has `max-age=14400`; the existing hashed CSS has `max-age=31536000`. | Build theme and logo references through Vite fingerprinted `/_astro/` URLs, covered by the existing one-year asset-cache rule. Original public URLs remain valid. Saved theme applies before paint; logo sizes and theme behavior are preserved. |
| Low contrast | Report identifies inactive format tabs, upload hints, extension code chips, green download illustration labels/badge and green/violet use-case captions. Local Lighthouse reproduced the exact elements and contrast ratios. | Scope darker foreground shades to those pale-surface cases and use a darker green for the illustrative white-on-green ZIP badge. Dark-theme colors, layout, typography and spacing remain unchanged. |
| Upload accessible name differs from visible label | Local Lighthouse identified the dropzone's overriding `aria-label`, which did not contain its visible instruction text. | Remove that override and let the button-role container obtain its accessible name from visible contents. Preserve focus, keyboard handling, real file input and all drag/drop hooks. |
| Existing 200% text overflow | The previous full suite found a 337px document width in a 320px viewport. | Preserve the normal mobile header's existing 16px padding/12px row gap/8px action gap in pixels below 640px. The header now fits when root text size is enlarged, without changing normal mobile geometry. |

`scripts/subset-fonts.py` verifies the original horizontal metrics for every retained common character and the original units-per-em. Browser tests additionally compare measured Latin and Greek/Cyrillic text against the original full font. Full-character fallbacks are loaded on demand. Normal builds use committed generated font files and require no Python or extra package installation.

The main compiled stylesheet and the tiny theme initializer remain render-blocking deliberately: the stylesheet prevents an unstyled page, and the initializer applies the saved theme before paint. The fix removes one critical stylesheet dependency; it does not claim every render-blocking request has disappeared. Converter workers, WebAssembly, AVIF encoder and ZIP code remain lazy-loaded and unchanged.

## Cloudflare CSP console error — manual action still required

The screenshot and both expanded reports show exactly this conflict:

```text
https://static.cloudflareinsights.com/beacon.min.js/<version>
blocked by script-src 'self' 'wasm-unsafe-eval'
```

The live HTTP response has that same enforced CSP. The beacon is injected by Cloudflare; it is absent from the project source. A source-level script removal or console-error suppression cannot reliably repair an edge-injected script that the browser has already blocked.

**Recommended resolution, preserving the current CSP:** in Cloudflare, select **HEIC2PNG.site only**, open Web Analytics → Manage site, and set automatic JS snippet injection to **Disable**. If this site's RUM beacon is also enabled through Observatory, review that setting for this hostname as well. Cloudflare documents the [automatic setup and Disable option](https://developers.cloudflare.com/web-analytics/get-started/). This is not the same as disabling Cloudflare proxy/security or changing the other website. Recheck the HTML afterward: the injected script should be absent. Leave the CSP intact.

**Alternative only if you intentionally want Cloudflare browser RUM:** after reviewing its collection/privacy behavior, add exactly one host to the existing HEIC2PNG `script-src` directive:

```nginx
script-src 'self' 'wasm-unsafe-eval' https://static.cloudflareinsights.com;
```

This is a fragment inside the existing `add_header Content-Security-Policy` value, not a new standalone Nginx directive. Preserve every other directive. For the currently observed automatic proxied integration, beacon collection uses the same site's `/cdn-cgi/rum`, so the existing `connect-src 'self'` already covers it. A manually embedded external-endpoint integration would instead need a separately reviewed `https://cloudflareinsights.com` connection allowance. See [Cloudflare's documented CSP and endpoint distinctions](https://developers.cloudflare.com/web-analytics/faq/).

Do **not** add script `'unsafe-inline'`, `'unsafe-eval'`, broad wildcards or advertising hosts to silence the error. Do not append a second CSP header: multiple enforced policies intersect. Do not assume an allowlist makes automatic RUM consent-controlled. If GA4 is later activated, its separate manual CSP proposal in `GA4_IMPLEMENTATION.md` still applies; combine only the intentionally enabled services' destinations after review. No CSP change from either report has been applied.

Until that manual Cloudflare action or a reviewed hosting policy change is completed, the live console error and related Best Practices deductions can remain. Local best-practices results do not prove the edge injection is fixed.

## Local measurements, not a replacement for live PageSpeed

Lighthouse 13.5.0 was run before and after against the same local static test server with Chrome and the same mobile/desktop settings. The test server does **not** reproduce production gzip, HTTP caching, Cloudflare routing or injected analytics; therefore these absolute scores must not be compared directly with the 96/97 production scores. Runs are single lab samples, not statistical benchmarks. The final after-runs were performed without simultaneous browser regression tests.

| Local result | Before mobile | After mobile | Before desktop | After desktop |
| --- | --- | --- | --- | --- |
| Performance | 63 | 77 | 94 | 99 |
| Accessibility | 97 | 100 | 97 | 100 |
| Best Practices | 100 | 100 | 100 | 100 |
| SEO | 100 | 100 | 100 | 100 |
| FCP | 5.72 s | 3.76 s | 1.15 s | 0.73 s |
| LCP | 6.32 s | 4.23 s | 1.23 s | 0.82 s |
| TBT | 9 ms | 0 ms | 0 ms | 0 ms |
| CLS | 0.0045 | 0.0045 | 0.0028 | 0.0028 |

Both final audits pass color contrast and browser-console checks. The console also passed on the local baseline because Cloudflare does not inject there. The local cache audit remains noisy because the test server sends no production cache headers. Actual production cache behavior was verified separately as described above; no post-deployment cache or production-score claim is made.

Machine-readable values are in `reports/pagespeed/local-lighthouse-summary.json`. Full raw Lighthouse audit files are retained in the ignored local `.astro/lighthouse-{before,after}-{mobile,desktop}.json` files for inspection.

## Verification and remaining steps

- `npm run build`: passed, 19 static HTML pages. Existing nonfatal Browserslist freshness notice remains.
- `npm run check`: passed.
- `npx playwright test --reporter=list`: **49/49 passed** in 2.3 minutes, including real PNG/JPG/AVIF conversion, thumbnails, single/ZIP downloads, consent, canonical/schema/sitemap checks, font metrics/fallbacks, theme behavior, mobile layout and 200% text enlargement. The prior task's one header accessibility failure is now resolved.
- `git diff --check`: passed; only Windows line-ending notices remain.
- Normal homepage geometry: all measured heading, paragraph and section boxes exactly matched the pre-change capture at 375px and 1440px after fonts loaded. The intended visual differences are the targeted contrast corrections. The existing text-enlargement defect is separately fixed.
- Original glyphs/metrics, theme behavior, no-upload conversion, consent defaults and static SEO are retained. Converter runtime/worker/encoder changes from the previous GA4 task were not altered during this pass.

After a separately authorized deployment, confirm new `/_astro/theme.*.js` and logo URLs, inline WOFF2 definitions, successful subset/full fallback requests and one-year `/_astro/` caching. Recheck the deployed HTML before clearing any cache. If old HTML persists, invalidate only the affected HEIC2PNG URLs after review; the new asset URLs do not need a blanket cache purge. Old stylesheet URLs may remain cached for old pages without affecting the new inline definitions.

Complete the Cloudflare action above, then run **fresh** mobile and desktop PageSpeed analyses of the production homepage; the supplied report links are historical snapshots. Verify PNG/JPG/AVIF uploads, previews, conversion, single/ZIP downloads, theme persistence and analytics opt-out. No particular future score or production Core Web Vitals improvement is guaranteed by the local measurements.

The DOM-size diagnostic reports 595 elements and is informational in these reports. Educational sections and controls were not removed just to reduce that count. Likewise, initial-load CSS coverage does not justify deleting styles required for queued files, errors, advanced settings and other routes. HSTS, COOP and Trusted Types suggestions require separate hosting/application review; blindly enforcing them can change behavior, and they were not enabled to chase an audit score.

## Files changed in this PageSpeed pass

- `src/pages/[...path].astro`: inline font-face definitions; fingerprinted theme URL.
- `src/lib/design.mjs`: fingerprinted light/dark logo URLs; accessible upload name.
- `src/styles/approved.css`: targeted contrast corrections and existing 200% text-overflow fix.
- `public/fonts/fonts.css`: generated subset/fallback faces.
- Eight new `public/fonts/*-latin.<hash>.woff2` assets.
- `scripts/subset-fonts.py`: optional reproducible font export/metric checks.
- `tests/pagespeed.spec.ts`: font fallback/metric and fingerprinted asset regressions.
- `reports/pagespeed/local-lighthouse-summary.json`: measured local results.
- `PAGESPEED_FIX_REPORT.md`: this report and manual Cloudflare/CSP instructions.

No production configuration, sitemap/canonical helper, image conversion implementation, article text or branding artwork was edited in this pass.
