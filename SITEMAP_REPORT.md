# HEIC2PNG.site sitemap implementation report

Date: 23 October 2026. Scope: application-level sitemap generation and validation only. No deployment, Cloudflare/Nginx/VPS modification, styling change or conversion-code change was performed in this task. Existing thumbnail work remains intact.

## Existing implementation and findings

The existing `src/pages/sitemap.xml.ts` was already correct about the intended route inventory: eight main/support/legal pages plus ten published articles, with three draft articles excluded. Astro's glob content loader discovers Markdown/MDX under `src/content/blog/`; the endpoint uses `getCollection('blog')` and the existing absolute canonical helper. Astro already uses HTTPS apex `site`, trailingSlash `always` and directory output. No missing, stale or duplicate intended URLs were found in the original 18-entry local sitemap.

The improvements address verified gaps rather than replacing the endpoint: XML values were concatenated without entity escaping; no reliable article dates were emitted; the eight main routes were duplicated between page generation and sitemap generation; and there were no dedicated publication-state/build or XML/date tests. The old content schema had only `draft`, with no explicit article `noindex` option. Existing `robots.txt` was already correct and remains unchanged. There is one sitemap endpoint and one generated `dist/sitemap.xml`; no competing public file, Astro sitemap integration or sitemap index was added.

Inspected `scripts/prepare-content.mjs`: it prepares existing embedded article HTML, not the sitemap or publication metadata. Its correct behavior was preserved, and published article bodies/frontmatter were not edited for this task.

## Changes and exact files

|File changed/added for this task|Purpose|
|---|---|
|`src/pages/sitemap.xml.ts`|Keep the existing static endpoint; serialize eligible collection entries through the helper; declare `application/xml; charset=utf-8`|
|`src/lib/sitemap.mjs`|Escape XML; derive editorial lastmod; exclude drafts/noindex articles; canonicalize and deduplicate; emit readable UTF-8 protocol XML|
|`src/lib/page-routes.mjs`|One shared list of eight normal pages; no error document or assets|
|`src/pages/[...path].astro`|Read that same route list; honor explicit article noindex in robots metadata and schema eligibility; current published page metadata remains unchanged|
|`src/content.config.ts`|Add optional `noindex` boolean, default false, to the article schema|
|`tests/sitemap.spec.ts`|Dedicated helper, strict browser XML, URL, canonical, indexability, date and robots checks|
|`tests/sitemap-build.mjs`|Three actual isolated production builds proving article inclusion/draft removal/noindex exclusion without adding a real article|
|`package.json`|Add `npm run test:sitemap-build`; dependencies unchanged|
|`SITEMAP_REPORT.md`|This inventory, results and manual follow-up|

`astro.config.mjs`, `src/lib/urls.mjs`, `scripts/prepare-content.mjs`, `public/robots.txt`, published article content, styles, fonts, workers and WASM were inspected/preserved. Previously pending thumbnail files/tests are unrelated to the sitemap changes. The generated CSS, main browser script, converter worker, AVIF encoder and WASM are byte-identical to the preceding thumbnail build.

## Final sitemap: 18 URLs

Every listed URL returned 200 on the local production verification server, has one matching self-canonical and is indexable. All values are absolute HTTPS apex URLs, with no query strings, fragments or index aliases. The root appears exactly once. Ten article dates come from existing `updated: 2026-10-23` frontmatter; their equality to today's date is coincidental, not generated from the build clock. The Windows article retains its real earlier publication date of 2026-10-14.

|Included canonical URL|lastmod|
|---|---|
|https://heic2png.site/|Omitted: no reliable page modification date|
|https://heic2png.site/heic-to-jpg/|Omitted|
|https://heic2png.site/heic-to-avif/|Omitted|
|https://heic2png.site/blog/|Omitted|
|https://heic2png.site/about/|Omitted|
|https://heic2png.site/contact/|Omitted|
|https://heic2png.site/privacy/|Omitted|
|https://heic2png.site/terms/|Omitted|
|https://heic2png.site/blog/heic-to-jpg-vs-png-which-format-should-you-choose/|2026-10-23|
|https://heic2png.site/blog/heic-vs-png-quality-file-size-compatibility/|2026-10-23|
|https://heic2png.site/blog/how-to-convert-heic-images-for-website-uploads/|2026-10-23|
|https://heic2png.site/blog/how-to-convert-heic-to-jpg-on-iphone/|2026-10-23|
|https://heic2png.site/blog/how-to-convert-heic-to-jpg-without-losing-quality/|2026-10-23|
|https://heic2png.site/blog/how-to-convert-heic-to-png-on-mac/|2026-10-23|
|https://heic2png.site/blog/how-to-convert-heic-to-png-on-windows-11/|2026-10-23|
|https://heic2png.site/blog/how-to-fix-heic-files-that-wont-open/|2026-10-23|
|https://heic2png.site/blog/how-to-open-heic-files-on-windows-and-mac/|2026-10-23|
|https://heic2png.site/blog/why-does-my-iphone-save-photos-as-heic/|2026-10-23|

The current draft slugs `what-is-a-heic-file-beginners-guide`, `heic-vs-avif-whats-the-difference` and `how-to-convert-multiple-heic-photos-at-once` are absent. 404/error documents, HTTP/www aliases, `/index.html`, utility queries, APIs and all assets/scripts/styles/images/fonts/workers/WASM are absent. No intended currently published page was removed.

## Ongoing publication/date behavior

- New articles are discovered by the existing Astro content glob on the next production build; no individual article slug is hardcoded in the sitemap.
- `draft: true` prevents article-route generation and sitemap inclusion. Removing the source article also removes its collection entry on the next normal build.
- `noindex: true` keeps a published article accessible, emits `noindex,follow`, omits its structured-data graph and excludes it from the sitemap. Default false preserves all current article behavior. Archive links may still lead to a published noindex article; no archive redesign was introduced.
- `<lastmod>` uses `updated`, otherwise trustworthy `published`; missing dates are omitted. Days are serialized as valid W3C `YYYY-MM-DD`, consistent with current source precision and article JSON-LD. Invalid dates or updates preceding publication fail validation rather than produce fabricated dates.
- Do not advance `updated` for every build or trivial footer changes. Record actual material editorial changes. No current-time/filesystem-mtime fallback, arbitrary priority or changefreq is used.
- Future normal pages should be registered in the shared `pagePaths` list used by both page generation and sitemap; the 404 document stays separate. Current indexable normal pages have no noindex directives; the page-level regression test detects future mismatch.

These choices follow Google's guidance to include canonical URLs, entity-escape XML and use accurate significant-update dates. Google ignores priority/changefreq and a sitemap does not guarantee indexing. [Google Search Central sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

## Validation results

|Command/check|Result|
|---|---|
|`npm run check`|Pass: application and worker TypeScript projects|
|`npm run build`|Pass: 19 HTML pages, one generated sitemap, unchanged 18-page indexable inventory|
|`npm run test:sitemap-build`|Pass: one integration test executes three actual isolated builds, approximately 20 seconds|
|`npm test -- --reporter=list`|26 passed; one new test initially failed because its archive/article distinction incorrectly assumed every `/blog/` path had BlogPosting data. This was a test assertion error, not invalid application schema|
|`npx playwright test tests/sitemap.spec.ts --reporter=list` after correcting that assertion|2/2 pass, including strict generated XML, all 18 canonical/indexability checks and all ten article date comparisons|
|Combined case coverage|All 27 distinct current browser/helper cases have passing results across these runs; not represented as a single clean 27-test invocation|
|Existing functional regression cases in the full run|Real PNG/JPG/AVIF conversions, ZIP/downloads, cancellation/errors, upload thumbnails, blog/navigation, metadata/schema and accessibility checks passed|

Inspected the actual generated `dist/sitemap.xml`: UTF-8 XML declaration; sitemap protocol namespace; 18 unique loc values; ten valid editorial lastmod values; no priority/changefreq. Strict Chrome DOMParser reports no XML parser errors. Helper tests cover escaped ampersands and all XML entity characters, duplicate canonical aliases, publication-date fallback, undated omission, real Date objects, invalid calendar dates and update-before-publication rejection. Each article lastmod is cross-checked against its built BlogPosting dateModified.

The isolated build test copies the project source into a generated `.astro/sitemap-fixture-*` workspace and runs Astro three times. A temporary published fixture with publication 2025-01-02 and update 2025-02-03 produces 19 sitemap URLs with lastmod 2025-02-03, demonstrating independence from today's build date. Switching the same fixture to draft produces 18 URLs and no article output. Switching it to published/noindex produces 18 URLs, an accessible article HTML document with noindex and no schema graph. The temporary workspace is removed in finally; no test article was added to the real content directory or deployed.

The final production build and browser tests use the real unchanged converter dependencies. Existing nonfatal outdated Browserslist data and NO_COLOR/FORCE_COLOR warnings remain; they are not sitemap failures. No dependency upgrade was attempted.

## Public robots/sitemap observations and remaining manual steps

Fresh read-only public sample: **2026-10-23T16:13:04.862Z**.

- Public sitemap returns 200 with the same 18 canonical trailing-slash URLs. The representative JPG page returns 200 and now has the matching trailing-slash canonical. This supersedes the older release-gap observation in SEO_FINAL_REPORT.md; the live state changed between audits. It does not establish that this task deployed anything.
- Public sitemap currently has no lastmod values. The changes in this task remain local until a separately approved release.
- Public robots returns 200, includes `Sitemap: https://heic2png.site/sitemap.xml` and retains Cloudflare-managed directives before the source wildcard Allow rule. No Googlebot or required converter-asset block was found in the inspected rules. Named bot-specific policies remain intentional owner-controlled settings; they were not changed. Ordinary public requests do not prove verified Googlebot/WAF access.
- The endpoint declares `application/xml; charset=utf-8`, and the local static verification server serves application/xml. The deployed static sitemap currently returns **text/xml** from the hosting MIME mapping. Response headers in a prerendered Astro endpoint do not reconfigure Nginx static-file headers. If strict application/xml delivery is required on production, review that MIME mapping manually in the HEIC site's own server configuration after release; no server edit or reload was performed here. Do not touch the other site's configuration.
- After a separately approved deployment, fetch sitemap/robots again; check the 18 URLs, canonical matches, real 404s, correct dates and intended MIME header. Account for Cloudflare caching if output remains older; do not silently change edge rules.
- In the correct Google Search Console property, submit or recheck `https://heic2png.site/sitemap.xml`, review processing errors/discovered URLs, then inspect representative PNG/JPG/AVIF/article URLs and Google's selected canonicals. Publishing a sitemap is a discovery hint, not evidence that a URL has been indexed. No Search Console submission or indexing claim was made by this task.
