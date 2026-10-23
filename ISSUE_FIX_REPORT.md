# HEIC2PNG technical fixes and production-readiness report

23 October 2026. The initial working tree was clean. This report describes the uncommitted local changes, verified against the existing project and fresh public responses. **No commit, push, deployment, VPS modification, Nginx service reload or Cloudflare change was performed.** TikSaveMP4, TTsave, other certificates/configurations and PM2 applications were untouched.

Companion deliverables: **ISSUE_FIX_PLAN.md**, **REDIRECT_TEST_REPORT.md**, **SEO_REGRESSION_REPORT.md**, **DEPLOYMENT_GUIDE.md**. Historical reports remain intact as dated evidence; new results supersede only the findings explicitly rechecked here.

## Implemented fixes

### Canonical URLs and hosting proposal

Source canonicals/sitemap already used HTTPS apex trailing slashes. Fresh public inspection confirms the canonical gap recorded in older audits is now resolved; those correct helpers were preserved. Public www/slashless/index aliases still served 200, so the complete HEIC-only Nginx proposal remains necessary as a **manual** change. The old HTTP bootstrap file is replaced locally with the same full reviewed TLS proposal as the example, avoiding contradictory installation choices. Install only one.

The proposal preserves paths/queries, ACME challenges and real 404s; redirects only existing page aliases; blocks hidden files before alias handling; keeps worker/WASM/CSP/caching behavior; explicitly maps XML, manifest and font MIME. **Real disposable Nginx 1.30.6 passes syntax plus 97 assertions**, including loop detection and required asset routes. A host-plus-index case takes two 301s then a canonical 200. No production block was installed. Ubuntu-specific actual root/certificate/include/permission checks remain mandatory before a manual reload.

### Approved brand icons and sharing image

All artwork is derived deterministically from the existing approved 2172×724 logo, which remains unchanged on disk. The favicon uses its original square gradient conversion mark; the social image uses the existing wordmark on the established light background. No new logo, fictional trust badge, testimonial or statistic was invented.

|File|Dimensions / content|
|---|---|
|`public/favicon.ico`|PNG-backed ICO frames 16×16, 32×32 and 48×48; 10,103 bytes|
|`public/favicon.svg`|SVG wrapper of the approved raster mark; 192×192 viewBox, embedded 64×64 raster; 12,968 bytes|
|`public/favicon-16x16.png`|16×16 transparent PNG; 1,009 bytes|
|`public/favicon-32x32.png`|32×32 transparent PNG; 3,048 bytes|
|`public/apple-touch-icon.png`|180×180 PNG; 52,266 bytes|
|`public/icons/icon-48.png`|48×48 source derivative, also represented in the ICO|
|`public/icons/icon-192.png`|192×192 manifest icon|
|`public/icons/icon-512.png`|512×512 manifest icon|
|`public/site.webmanifest`|HEIC2PNG name/short name, browser display, `/` start URL, 192/512 icons, existing #4F46E5/#F8FAFC theme/background|
|`public/brand/social-preview.webp`|1200×630, 22,718 bytes|
|`public/brand/heic2png-logo.lossless.webp`|2172×724, 237,324 bytes, unchanged visible pixels|

Head references use the actual existing assets; every indexable page has absolute OG/Twitter image URLs, dimensions for the fallback, descriptive image alt and `summary_large_image`. Future genuine article-specific image metadata remains supported; no unverified dimensions are asserted for such an image. Icon/manifest/image MIME and dimensions pass tests. No service worker/offline installation flow was added. The favicon SVG is honestly raster-derived because no true vector source artwork was supplied; it is not described as a newly traced vector logo. Assets were visually inspected.

### Minimal mobile and accessibility corrections

The fresh baseline reproduced Windows-guide document width 360px at a 320px viewport and table clipping at 320/375/390px; format-choice table clipping reproduced at 320px. Render-time HTML middleware adds named, focusable scrolling regions to existing article table wrappers and a class to the existing Windows illustration row. Narrow scoped CSS changes table overflow to auto and lets that illustration row/text wrap. No Markdown is rewritten, no new content section is added, and converter dropzone dimensions are unchanged. Existing desktop layout and classes remain the baseline.

After fixes, **108 checks (18 pages × 320/375/390/768/1024/1440px) show no document overflow or hidden-overflow table clipping**. ArrowRight scrolls focused wide tables. A 640 CSS-pixel viewport checks equivalent reflow for a 1280px desktop at 200% browser zoom; native browser-menu zoom and screen-reader testing still require device coverage.

Conversion/contact errors now expose `role=alert`; success/toast messages expose `role=status`, with atomic announcements. Keyboard Enter on the existing upload dropzone opens the file chooser and invalid input produces the accessible alert. Existing accessible input names, menu/FAQ relationships/Escape behavior, file-row styling and animations are preserved.

### Appearance-preserving performance work

Eight WOFF2 copies preserve the **same full fonts**, family/weight names, glyph maps and metrics. No subsetting or font substitution occurred. The one-time conversion used FontTools 4.67.0/Brotli 1.2.1 and checked compiled cmap/hmtx/hhea/OS2/name data; browser comparisons verify the rendered result. Normal builds need no Python tooling. Original TTFs remain available for old cached CSS, and the old PNG remains available for cached pages/schema/source artwork. The page now loads WOFF2 plus the lossless WebP logo.

|Asset group|Before bytes|After active bytes|Reduction|
|---|---:|---:|---:|
|Eight fonts|1,966,500 TTF|672,512 WOFF2|1,293,988 (65.8%)|
|Visible brand logo|419,763 PNG|237,324 lossless WebP|182,439 (43.5%)|
|Combined fonts + logo|2,386,263|909,836|1,476,427 (61.9%)|

These are file-byte comparisons, **not measured transfer, LCP, INP, CLS or ranking improvements**. No Lighthouse/CrUX/field score was obtained. CSS/JS parsing was reviewed; essential decoder/AVIF/JSZip/worker/WASM dependencies and lazy loading are retained. The common browser script still supplies navigation/search/contact behavior; speculative code splitting or font-weight removal was avoided. The final browser test confirms no TTF request on the new initial page, existing font family and working decoder/WASM fetches.

Own baseline comparisons (pixelmatch threshold 0.1): all **18 converter dropzone crops** and **six full homepage screenshots** have zero differing pixels; the format-choice article matches at all six widths; the Windows article matches at 768/1024/1440px. Its 320px screenshot narrows from the defective 360px document to 320px, and its 320/375/390px page height increases **24px** as the illustration badge wraps. Wide tables are now scrollable even where initial pixels are unchanged. This is the intended minimal visible correction. The historical prototype is not used as a false current-content pass/fail baseline.

### Build reproducibility and Git safety

Normal builds/dev startup no longer run the editorial Markdown migration. `npm run prepare:content` remains explicit for a reviewed editorial operation. Generated client/CSS move from tracked `src/scripts/client.ts` / `src/styles/generated.css` to ignored `src/generated/client.ts` / `src/generated/styles.css`; the page imports those generated outputs. The old tracked copies are deliberately deleted, not hand-maintained duplicates. Worker-relative URLs are adjusted only in generated module assembly so the unchanged worker source still bundles correctly. No decode/encode, queue, resize, thumbnail, quality, download, ZIP or cancellation algorithm was edited.

Two consecutive production builds of the same working sources produced **62 identical artifact files** and changed neither source hashes nor Git status. All 13 existing Markdown files, `src/scripts/runtime.txt`, `converter.worker.ts` and `avif-encoder.ts` match their pre-task hashes. Existing `.env`/private inputs are not published. Git status contains the intentional changes enumerated below; no claim is made that an uncommitted implementation should literally show an empty working tree. No commit was created, so reproducibility is reported for the controlled same-source builds rather than a fabricated newly committed release.

The requested initial root `npm ci` encountered Windows EPERM on a native compiler binding while the existing preview was running; the exact handle owner was not established. The local install was restored without killing the user's preview. A separate temporary clean copy successfully ran `npm ci`, build, TypeScript, a second build and artifact validation; that temporary copy was removed. The build commands now generate missing ignored files from scratch. The release guide uses isolated checkout/build locations to avoid the active-directory and locked-preview problems.

### Trust copy and remaining owner facts

About's unsupported OS-tested claim becomes qualified practical workflow guidance. Terms' Document Template label becomes Legal. The existing contact note now contains the configured support email link and explains the email-app handoff, usable without JavaScript; it does not claim successful email delivery. Privacy's local-preference sentence now accurately describes settings in page memory/reset on leaving or reloading.

**Owner review remains:** actual Cloudflare/origin access/error logs, IP/query retention, cookie/advertising/consent behavior, operator identity/contact details and any legal commitments. Public wording about non-identifying/anonymized infrastructure logs is not established by repository evidence. No owner name, credentials, physical device tests, anonymous logging guarantee or legal-compliance claim was invented. Current no-upload behavior is supported by client code and observed no-POST conversion cases; it is not a certification covering future deployments, extensions or third-party integrations.

## Dependency audit

Before: Tailwind **3.4.17**, selector-parser **6.1.5**, three moderate findings; zero high/critical. Applied compatible Tailwind **3.4.19** and kept the existing v3 CLI/configuration. Sharp **0.35.5**, already installed transitively, is explicitly pinned as a development tool for deterministic brand-asset generation. Lockfile/clean install/build/screenshots/regressions pass; no Tailwind v4 or forced parser-major override was used.

After: **three moderate findings remain** (`postcss-selector-parser`, `postcss-nested`, `tailwindcss`); zero high/critical in the sampled npm advisory result. This is one underlying selector-parser CPU-exhaustion issue propagated through its dependents, not three unrelated converter vulnerabilities. No patched v6 release was available; npm's proposed full fix changes Tailwind to v4. The advisory explicitly distinguishes untrusted request-path selector parsing from ordinary trusted-source build use. This static site does not run Tailwind in a request path or feed uploaded HEIC bytes into PostCSS. Build/source trust still matters. Do not equate the exposure assessment or audit count with a general security certification. [Reviewed selector-parser advisory](https://github.com/advisories/GHSA-rj75-hqrm-r3gf).

Recommended separate remediation: evaluate a maintained upstream-compatible Tailwind v3 patch/backport or test Tailwind/parser major upgrades in isolation with CSS/output comparisons before adopting them. Do not blindly override a transitive parser major. The existing outdated Browserslist warning remains nonfatal; no unsupported force-upgrade was used to hide it.

## Tests and evidence

|Check|Outcome|
|---|---|
|`npm run check`|Pass for application/worker TypeScript|
|`npm run build`|Pass; 19 HTML documents and the existing canonical 18-entry sitemap|
|`npm test -- --reporter=list`|**32/32 pass**, final frozen build, approximately 1.1 minutes|
|`npm run test:sitemap-build`|Pass; three isolated publication/draft/noindex builds|
|`npm run test:repro`|Pass; two builds, 62 identical files, unchanged source/Git status|
|`npm run test:clean-build`|Pass; isolated npm ci/build/check/build/artifact validation; initial root EPERM limitation documented above|
|`npm run test:redirects`|Pass; real disposable Nginx syntax and 97 HTTP checks using a frozen final artifact|
|`npm run validate:release`|Pass; canonical pages, error document, icons, manifest and required codec artifacts|
|Static SEO crawl|18 unique metadata/H1/canonical identities; 811 internal references, no broken destinations/fragments; no missing referenced assets|
|Responsive/visual|108 before/after checks; zero final overflow/clipping; converter/homepage/desktop comparisons as above|
|Brand/font generation|Visible logo pixels preserved; font maps/metrics/names preserved; PNG/ICO/SVG/manifest/social dimensions/MIME checked|
|`git diff --check`|Pass; Windows LF→CRLF notices are not whitespace errors|

Real `example.heic` produces PNG/JPG/AVIF at 1280×854, with actual downloaded bytes/decoded output and ZIP contents checked. Portrait `arrow.heic` retains orientation, including PNG 3024×4032 and AVIF custom 378×504. JPEG/AVIF quality/chroma/lossless controls, half-size ratio, invalid/renamed/corrupt inputs, clear/remove/cancellation/retry, unique ZIP names, upload previews and actual worker/WASM/CSP behavior pass. Instrumented cases observe no upload POST and no page/CSP failures. Large/mixed/camera-specific batches and every native browser are not exhausted by these fixtures.

Ignored evidence: `.astro/production-before*`, `.astro/production-after/`, `.astro/production-last-dist/`, `.astro/production-visual-results.json`, `.astro/production-static-results.json`, `.astro/nginx-redirect-results.json`, `.astro/build-reproducibility-results.json`, `.astro/clean-build-results.json`, `.astro/dependency-audit-before.json`, `.astro/dependency-audit-after.json`, plus Playwright results. Build/test services used loopback only; final results do not imply anything was deployed.

## Manual items / limits

1. Review actual HEIC vhost root/current symlink, certificate coverage/renewal and Cloudflare Full (strict)/redirect rules before installing one Nginx proposal. Run Ubuntu's own nginx -t. Actual origin settings were not available; do not assume the example root already matches production.
2. Perform a separately authorized release via the documented isolated build and atomic symlink procedure, retain old hashed assets for open tabs and verify rollback. The Linux atomic mv/symlink procedure is documented and guarded, not claimed to have been executed on the shared VPS.
3. Recheck live icons/social/font MIME/caching/redirects and sitemap after release. Older cached TTF CSS/PNG URLs remain available. Review cache lifetime/versioning when changing these unversioned public assets in future.
4. Confirm real logging/privacy/consent/operator facts and review three remaining moderate build-tool advisories separately.
5. Test native Safari/iOS/Android/Firefox/Edge, screen readers, actual 200% browser zoom, memory-constrained/very large/mixed input and configured email delivery. No real-device matrix, field CWV, authenticated Search Console, external Google Rich Results Test or verified Googlebot/WAF test was available.
6. Follow Search Console steps in SEO_REGRESSION_REPORT.md after release; do not interpret local code as a ranking/indexing change.

## Exact changed files

This inventory is the actual final Git diff/untracked-file set, including the five requested documents and generated assets. Ignored test/build/tooling outputs are excluded.

|Path|Change|
|---|---|
|`.gitignore`|Modified|
|`DEPLOYMENT_GUIDE.md`|Added|
|`ISSUE_FIX_PLAN.md`|Added|
|`ISSUE_FIX_REPORT.md`|Added|
|`README.md`|Modified|
|`REDIRECT_TEST_REPORT.md`|Added|
|`SEO_REGRESSION_REPORT.md`|Added|
|`deploy/README.md`|Modified|
|`deploy/heic2png.canonical.conf.example`|Modified|
|`deploy/heic2png.site.conf`|Modified|
|`package-lock.json`|Modified|
|`package.json`|Modified|
|`public/apple-touch-icon.png`|Added|
|`public/brand/heic2png-logo.lossless.webp`|Added|
|`public/brand/social-preview.webp`|Added|
|`public/favicon-16x16.png`|Added|
|`public/favicon-32x32.png`|Added|
|`public/favicon.ico`|Added|
|`public/favicon.svg`|Added|
|`public/fonts/Inter-400.woff2`|Added|
|`public/fonts/Inter-500.woff2`|Added|
|`public/fonts/Inter-600.woff2`|Added|
|`public/fonts/Inter-700.woff2`|Added|
|`public/fonts/Inter-800.woff2`|Added|
|`public/fonts/JetBrains-Mono-400.woff2`|Added|
|`public/fonts/JetBrains-Mono-500.woff2`|Added|
|`public/fonts/JetBrains-Mono-600.woff2`|Added|
|`public/fonts/fonts.css`|Modified|
|`public/icons/icon-192.png`|Added|
|`public/icons/icon-48.png`|Added|
|`public/icons/icon-512.png`|Added|
|`public/site.webmanifest`|Added|
|`scripts/convert-fonts.py`|Added|
|`scripts/generate-brand-assets.mjs`|Added|
|`scripts/prepare-client.mjs`|Modified|
|`scripts/validate-release.mjs`|Added|
|`src/lib/article-markup.mjs`|Added|
|`src/lib/design.mjs`|Modified|
|`src/middleware.ts`|Added|
|`src/pages/[...path].astro`|Modified|
|`src/scripts/client.ts`|Deleted tracked generated output; replaced by ignored src/generated|
|`src/styles/approved.css`|Modified|
|`src/styles/generated.css`|Deleted tracked generated output; replaced by ignored src/generated|
|`tests/build-reproducibility.mjs`|Added|
|`tests/clean-build.mjs`|Added|
|`tests/nginx-redirects.mjs`|Added|
|`tests/production-fixes.spec.ts`|Added|
|`tests/server.mjs`|Modified|
