# HEIC2PNG.site technical SEO audit

Audit date: **2026-10-23** (Asia/Colombo). Scope: the current working tree, existing `dist/` output, local production preview, and read-only public HTTP responses from `https://heic2png.site/`.

**Audit only. No SEO fixes, production-file edits, build, deployment, conversion, commit or push was performed.** Only this report was created. The working tree already contained changes to `.env.example`, `README.md`, `src/lib/design.mjs`, `src/pages/[...path].astro`, `src/styles/approved.css`, `tests/blog.spec.ts`, and `tests/site.spec.ts` when this audit started. They are not audit changes. Builds were deliberately avoided because `scripts/prepare-content.mjs` and `scripts/prepare-client.mjs` write source files.

## Assessment

The project has a good static SEO foundation. There are **19 built HTML documents: 18 intended indexable pages and one custom error document**, plus `robots.txt`, `sitemap.xml`, and non-HTML assets. All 18 canonical content routes returned **200** publicly. The sitemap contains exactly those 18 URLs. Each built document has one H1, a unique title and description, and one absolute canonical. The error document is `noindex,follow`; random missing URLs and all three unpublished drafts returned real **404** responses. No site-wide Google indexing blocker was found in the inspected HTML or ordinary public HTTP responses.

The highest-priority corrections are **canonical URL variants that remain independently accessible** and **unsupported claims in older converter/Windows-guide copy**. The nine newly completed articles generally have clearer limitations and source attribution than that older copy. Large fonts/logo assets and two mobile table-clipping cases are meaningful performance/accessibility risks. Their existence does not establish a failed Core Web Vitals assessment or a ranking penalty.

The public release is slightly behind the local build: live pages retain the “404 Template” footer link and have no `data-show-ad-areas="false"` attribute. The local build already removes that link and hides ad areas. Core titles, descriptions, H1s, canonical URLs and article links match between the inspected live pages and local build. Treat the footer/ad difference as a release mismatch, **not a missing implementation or proven Cloudflare cache fault**.

Priorities: **P1** = address first; **P2** = worthwhile improvement or verified usability/trust issue; **P3** = optional refinement/monitoring; **Keep** = preserve the working implementation. No P0 outage or blanket noindex was observed. Priorities are engineering judgments, not predictions of rankings.

## Page-by-page audit

The table records current values extracted from built HTML, cross-checked against public titles/descriptions/H1s/canonicals. URLs are the existing preferred URLs, not proposed new pages. All normal rows are currently indexable by their HTML rules. Shared findings below apply without making an otherwise optimized article a duplicate or requiring a rewrite.

|URL|Primary keyword / search intent|Current title|Current description|H1|Canonical|Issues|Priority|Exact recommended changes|Affected files/settings|
|---|---|---|---|---|---|---|---|---|---|
|https://heic2png.site/|heic to png — immediate conversion|HEIC to PNG Converter – Free, Private Online iPhone Photo Converter \| HEIC2PNG.site|Convert HEIC to PNG privately in your browser. Free batch conversion, original resolution and ZIP downloads. Your photos stay on your device.|HEIC to PNG Converter|https://heic2png.site/|F02: older FAQ/output/device claims; F08: Windows/macOS anchor mismatch; shared F04–F07/F09.|P1 copy|Keep current title/H1/canonical and sole PNG tool URL. Apply the exact FAQ and support-claim corrections in F02 and relabel the platform anchor as F08; shared metadata/performance work only as specified.|src/lib/design.mjs; src/pages/[...path].astro|
|https://heic2png.site/heic-to-jpg|heic to jpg — immediate conversion|HEIC to JPG Converter – Free Online iPhone Photo to JPEG Tool \| HEIC2PNG.site|Convert HEIC to JPG privately in your browser with adjustable JPEG quality, batch conversion and ZIP downloads.|HEIC to JPG Converter|https://heic2png.site/heic-to-jpg|F02: unsubstantiated savings, universal support and archival-quality labels; shared delivery/social metadata.|P1 copy|Keep title/H1/canonical. Replace benchmark/universal/archival labels with the qualified wording in F02; link to the existing quality guide where useful.|src/lib/design.mjs; src/pages/[...path].astro|
|https://heic2png.site/heic-to-avif|heic to avif — immediate conversion|HEIC to AVIF Converter – Free, Private Browser AV1 Image Tool \| HEIC2PNG.site|Convert HEIC to AVIF privately in your browser. Adjust quality, choose 4:2:0, 4:4:4 or lossless encoding, preserve dimensions and download batch ZIP files.|HEIC to AVIF Converter|https://heic2png.site/heic-to-avif|F02: dated support figures, format-vs-tool HDR confusion and incorrect encoder description.|P1 copy|Keep title/H1/canonical. Use the current WASM encoder description and 8-bit limitation wording in F02; remove unsupported global support percentage and fixed size ranking.|src/lib/design.mjs; src/pages/[...path].astro|
|https://heic2png.site/blog|HEIC guides — informational discovery|HEIC & Image Format Guides – Tutorials & Comparisons \| HEIC2PNG.site|Read HEIC guides, image format explanations and practical conversion tutorials.|HEIC & Image Format Guides|https://heic2png.site/blog|F02: featured four-tested-methods claim; F03: live template footer link; metadata/card discovery otherwise correct.|P1 featured copy|Keep title/description/H1/canonical, ten static article anchors and collection intent. Remove “(4 Tested Methods)” from the featured heading; correct its summary as F02. Deploy existing local footer fix only when authorized.|src/lib/design.mjs; src/pages/[...path].astro|
|https://heic2png.site/blog/how-to-convert-heic-to-png-on-windows-11|HEIC to PNG on Windows 11 — platform tutorial|How to Convert HEIC to PNG on Windows 11 \| HEIC2PNG.site|Compare four tested ways to convert iPhone HEIC photos to lossless PNG on Windows 11—including browser batch conversion, Windows Photos Save As, and codec setup.|How to Convert HEIC to PNG on Windows 11|https://heic2png.site/blog/how-to-convert-heic-to-png-on-windows-11|F02: unsupported “four tested” promise and mixed PNG/JPG methods; no external sources; F07: clipped table at 320/375 and page overflow at 320; F09 breadcrumbs.|P1 editorial; P2 mobile|Keep URL/title/H1. Use the exact replacement description in F02; revise method labels/TOC and cite verified official export guidance. Any table/badge responsive treatment needs separate authorization.|src/content/blog/how-to-convert-heic-to-png-on-windows-11.md; src/pages/[...path].astro|
|https://heic2png.site/blog/how-to-convert-heic-to-png-on-mac|convert HEIC to PNG on Mac — platform tutorial|How to Convert HEIC to PNG on Mac \| HEIC2PNG.site|Export HEIC as PNG with Mac Preview or Photos, convert several images, and check dimensions, file size and color before sharing your new files.|How to Convert HEIC to PNG on Mac|https://heic2png.site/blog/how-to-convert-heic-to-png-on-mac|No page-specific title/description/H1/canonical or content-scope defect; shared F04/F06/F09.|Keep content; P2 shared|Keep existing metadata, URL, body, sources and tool links. Only consider the shared real-image/identity/breadcrumb and font improvements described above.|src/content/blog/how-to-convert-heic-to-png-on-mac.md (keep); src/pages/[...path].astro; public/fonts/fonts.css|
|https://heic2png.site/blog/how-to-convert-heic-to-jpg-on-iphone|convert HEIC to JPG on iPhone — existing-photo workflow|How to Convert HEIC to JPG on iPhone \| HEIC2PNG.site|Make a JPG copy of an existing iPhone HEIC photo, find the downloaded file, and understand why camera settings do not convert your older pictures.|How to Convert HEIC to JPG on iPhone|https://heic2png.site/blog/how-to-convert-heic-to-jpg-on-iphone|Distinct existing-file intent; no page-specific metadata defect. Shared F04/F06/F09.|Keep content; P2 shared|Keep URL, metadata, Photos/Files download guidance and distinction from future camera settings. Do not merge with the capture-setting article. Shared improvements only.|src/content/blog/how-to-convert-heic-to-jpg-on-iphone.md (keep); src/pages/[...path].astro|
|https://heic2png.site/blog/why-does-my-iphone-save-photos-as-heic|turn off HEIC on iPhone — future capture settings|Why iPhone Saves HEIC Photos and How to Turn It Off \| HEIC2PNG.site|Switch future iPhone camera photos from HEIC to JPG with Most Compatible, understand the storage tradeoff, and handle the HEIC pictures you already have.|Why iPhone Saves HEIC Photos and How to Turn It Off|https://heic2png.site/blog/why-does-my-iphone-save-photos-as-heic|Distinct camera-setting intent; no page-specific metadata defect. Shared F04/F06/F09.|Keep content; P2 shared|Keep title/H1/canonical and existing slug; preserve future-vs-existing distinction and links to JPG conversion. Do not create a competing turn-off-HEIC page.|src/content/blog/why-does-my-iphone-save-photos-as-heic.md (keep); src/pages/[...path].astro|
|https://heic2png.site/blog/how-to-convert-heic-to-jpg-without-losing-quality|HEIC to JPG without losing quality — compression limits|HEIC to JPG Without Losing Quality: What Is Possible? \| HEIC2PNG.site|Convert HEIC to JPG with fewer visible artifacts. Learn which quality settings matter, what JPEG cannot preserve, and when PNG is the better choice.|HEIC to JPG Without Losing Quality: What Is Possible?|https://heic2png.site/blog/how-to-convert-heic-to-jpg-without-losing-quality|Title is appropriately qualified by “What Is Possible?”; body explains JPEG losses. No page-specific metadata defect.|Keep content; P2 shared|Keep the qualified title, description, H1, URL and source-based limits. Do not replace with an absolute lossless-JPEG promise. Shared F04/F06/F09 only.|src/content/blog/how-to-convert-heic-to-jpg-without-losing-quality.md (keep); src/pages/[...path].astro|
|https://heic2png.site/blog/heic-vs-png-quality-file-size-compatibility|HEIC vs PNG — quality and output size|HEIC vs PNG: Quality, File Size and Compatibility \| HEIC2PNG.site|Does HEIC to PNG reduce quality, and why is the PNG often larger? Understand lossless encoding, decoded pixels, color limits and practical format choices.|HEIC vs PNG: Quality, File Size and Compatibility|https://heic2png.site/blog/heic-vs-png-quality-file-size-compatibility|Both PNG quality/size questions are consolidated appropriately; no page-specific metadata/content defect. Shared F04/F06/F09.|Keep content; P2 shared|Keep title/description/H1/canonical and combined scope; do not split it into competing PNG-quality and PNG-size articles.|src/content/blog/heic-vs-png-quality-file-size-compatibility.md (keep); src/pages/[...path].astro|
|https://heic2png.site/blog/heic-to-jpg-vs-png-which-format-should-you-choose|PNG vs JPG vs AVIF — output-format choice|PNG vs JPG vs AVIF: Which Image Format Should You Use? \| HEIC2PNG.site|Choose JPG, PNG or AVIF for converted HEIC photos by comparing upload compatibility, compression, transparency, quality and the limits of each workflow.|PNG vs JPG vs AVIF: Which Image Format Should You Use?|https://heic2png.site/blog/heic-to-jpg-vs-png-which-format-should-you-choose|F07: format table clips at 320 px. Slug omits AVIF but is established and content/title are accurate; no rename needed.|P2 mobile; keep metadata|Keep URL, title, description, H1 and format-choice content. If separately approved, allow accessible overflow for this one table; shared F06/F09 remain optional improvements.|src/content/blog/heic-to-jpg-vs-png-which-format-should-you-choose.md; src/pages/[...path].astro|
|https://heic2png.site/blog/how-to-convert-heic-images-for-website-uploads|convert HEIC for website upload — preparation checklist|How to Convert HEIC Images for Website Uploads \| HEIC2PNG.site|Prepare HEIC photos for upload forms and website media libraries: choose an accepted format, meet dimensions and file-size limits, and verify the submitted image.|How to Convert HEIC Images for Website Uploads|https://heic2png.site/blog/how-to-convert-heic-images-for-website-uploads|Some topical overlap with error diagnosis, but different task intent; no proven cannibalization. Shared F04/F06/F09.|Keep; monitor overlap|Keep metadata and prepare/submit/verify scope. Preserve links to troubleshooting; merge only if future Search Console evidence establishes competing intent.|src/content/blog/how-to-convert-heic-images-for-website-uploads.md (keep); src/pages/[...path].astro|
|https://heic2png.site/blog/how-to-fix-heic-files-that-wont-open|HEIC not supported — opening/upload error diagnosis|HEIC Not Supported? Fix Opening and Upload Errors \| HEIC2PNG.site|Diagnose unsupported HEIC messages, failed website uploads and incomplete files. Choose the right fix for codecs, format restrictions, size limits or damaged copies.|HEIC Not Supported? Fix Opening and Upload Errors|https://heic2png.site/blog/how-to-fix-heic-files-that-wont-open|Some overlap with upload preparation and platform opening; current error-led scope is distinct. Shared F04/F06/F09.|Keep; monitor overlap|Keep title, H1, canonical, slug and diagnosis tree. Avoid retargeting this to the generic conversion keyword; maintain cross-links rather than adding another unsupported-upload page.|src/content/blog/how-to-fix-heic-files-that-wont-open.md (keep); src/pages/[...path].astro|
|https://heic2png.site/blog/how-to-open-heic-files-on-windows-and-mac|open HEIC files on Windows 10 — viewing support with Mac context|How to Open HEIC Files on Windows 10 and Mac \| HEIC2PNG.site|Open HEIC photos on Windows 10 with supported Microsoft extensions, view them on Mac, or create a compatible copy when an app cannot read the original.|How to Open HEIC Files on Windows 10 and Mac|https://heic2png.site/blog/how-to-open-heic-files-on-windows-and-mac|Opening-vs-converting scope is clear; Windows 10 lifecycle caveat and sources present. Shared F04/F06/F09.|Keep content; P2 shared|Keep metadata and established Windows-and-Mac URL. Maintain source/version caveats; do not add a duplicate Windows 10 opening article.|src/content/blog/how-to-open-heic-files-on-windows-and-mac.md (keep); src/pages/[...path].astro|
|https://heic2png.site/about|about HEIC2PNG — brand/operator trust|About HEIC2PNG – Private Browser Image Conversion \| HEIC2PNG.site|Learn how HEIC2PNG processes images locally in your browser.|Fast, Private Image Conversion Built for Modern Web Browsers|https://heic2png.site/about|F02: unsupported OS-tested assertion; F10: operator/editorial accountability can be clearer.|P1 factual copy; P2 trust|Keep title/H1/canonical. Use “Practical Format Guides” and source-based description in F02. Add verified operator/editorial information only when supplied, with contact/correction route.|src/lib/design.mjs; src/pages/[...path].astro|
|https://heic2png.site/contact|contact HEIC2PNG — support/navigation|Contact HEIC2PNG Support & Feedback \| HEIC2PNG.site|Contact HEIC2PNG about browser conversion issues, unsupported files or editorial corrections.|Contact Us|https://heic2png.site/contact|F10: no static mailbox/mailto fallback; JS opens email app, not an on-site sending backend. Title/H1/canonical and labels are correct.|P2 usability/trust|Keep metadata. Recommend a visible mailto fallback for backbencherz@gmail.com and honest “opens your email app” wording in an approved copy area; do not claim server-side delivery.|src/lib/design.mjs; src/scripts/runtime.txt (behavior reference); src/pages/[...path].astro|
|https://heic2png.site/privacy|HEIC2PNG privacy — data handling|Privacy Policy – Local Browser Image Processing \| HEIC2PNG.site|How HEIC2PNG processes your photos locally and handles website data.|Privacy Policy|https://heic2png.site/privacy|F10: actual Cloudflare/origin log handling and in-memory preferences need policy consistency review. Metadata/indexing are correct.|P2 factual review|Keep title/H1/canonical/indexability. Verify actual logging/cookies before replacing anonymity/preference claims; describe current disabled advertising and any future integration conditionally.|src/lib/design.mjs; deploy/README.md; deployed edge/log settings|
|https://heic2png.site/terms|HEIC2PNG terms — service conditions|Terms of Service \| HEIC2PNG.site|Terms for using HEIC2PNG browser image conversion and guides.|Terms of Service|https://heic2png.site/terms|F10: “Document Template” eyebrow is still visible. No keyword or canonical defect.|P2 copy trust|Change only the eyebrow text to “Terms of Service” or “Legal” after editorial approval. Keep title/H1/canonical; do not pad text or add invented legal/operator facts.|src/lib/design.mjs; original HTML copy|
|https://heic2png.site/404|error recovery — no search keyword|404 Page Not Found \| HEIC2PNG.site|The requested page could not be found.|Page Not Found|https://heic2png.site/404|Correct public 404 + noindex; canonical /404 belongs to error template. F03: live global link already removed locally.|Keep error rules|Keep 404 status/noindex and recovery links; do not index or optimize this for converter keywords. Publish existing footer removal only as a separately authorized release.|src/pages/[...path].astro; src/lib/design.mjs; deploy/heic2png.site.conf|
|https://heic2png.site/robots.txt|crawl policy; not an HTML landing page|N/A — plain text|N/A|N/A|N/A|Live Cloudflare-managed prefix differs from local file; ordinary Google/Bing search not disallowed.|Keep search rules; P3 owner policy|Keep allow/sitemap section; review explicit blocked services only if desired (F12). No title/H1/canonical tags belong in robots.txt.|public/robots.txt; Cloudflare Bot Preference Sync|
|https://heic2png.site/sitemap.xml|URL discovery; not an HTML landing page|N/A — XML|N/A|N/A|N/A|18 correct preferred URLs; drafts/errors excluded; no defect found.|Keep|Keep collection-driven XML and canonical URLs. Optional lastmod only from real modifications.|src/pages/sitemap.xml.ts; dist/sitemap.xml (build artifact)|

`/404` is served with `dist/404.html`; that file is not an indexable content page. Live `/404`, `/404.html`, and a random missing URL all return 404 with the same error-page metadata. Its canonical points to `/404`; this is not a reason to index the error template or redirect missing pages to the homepage.

## F01 — Canonical host and URL variants

**P1, confirmed live.** Canonical tags correctly prefer HTTPS, the non-www host, and slashless paths except `/`. The following variants still return duplicate 200 content:

|Request|Observed response|Preferred target / action|
|---|---|---|
|`https://www.heic2png.site/`|200|Permanent redirect to `https://heic2png.site/`|
|`https://www.heic2png.site/blog`|200|Permanent redirect to `https://heic2png.site/blog`|
|`http://heic2png.site/`|301 to non-www HTTPS|Already correct; keep|
|`http://www.heic2png.site/blog`|301 to **www** HTTPS|Consolidate to the final non-www HTTPS URL directly|
|`https://heic2png.site/index.html`|200, canonical `/`|Permanent redirect to `/`|
|`https://heic2png.site/blog/`|200, canonical `/blog`|Permanent redirect to `/blog`|
|`https://heic2png.site/blog/index.html`|200, canonical `/blog`|Permanent redirect to `/blog`|
|`https://heic2png.site/heic-to-jpg/` and `/heic-to-jpg/index.html`|200, canonical `/heic-to-jpg`|Permanent redirect to `/heic-to-jpg`|
|`https://heic2png.site/blog?category=Image%20Formats` and `/blog?q=PNG`|200, canonical `/blog`|Keep these utility variants consolidated to `/blog`; do not create indexable copies|

Exact recommendation: enforce a single permanent redirect policy at the edge or origin, preserving path and query string, and keep the existing canonical format. Resolve explicit `index.html` and trailing-slash variants without causing loops with Astro's directory output. Validate `/`, nested article paths, real directories, assets and the ACME challenge location before any future deployment. Do not apply a blanket strip-slash rewrite to the homepage or asset directories. No redirect configuration was installed during this audit.

Affected files/settings: `deploy/heic2png.site.conf`, `deploy/README.md`, deployed HTTPS Nginx server block and/or Cloudflare Redirect Rules. `astro.config.mjs`, internal links, sitemap and canonical tags already agree on the preferred format; keep that agreement. The supplied Nginx file is an HTTP bootstrap example, not proof of the running HTTPS configuration. Its `try_files $uri $uri/index.html =404` permits multiple representations rather than normalizing them. Deployment documentation already asks for www redirection, but the public response shows it is not currently enforced.

Canonical tags are already useful signals; these duplicate responses do **not** prove that Google indexed every variant. Confirm Google's selected canonical with Search Console. [Google canonicalization guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [Nginx `try_files` reference](https://nginx.org/en/docs/http/ngx_http_core_module.html#try_files).

## F02 — Older copy makes claims the repository does not substantiate

**P1, confirmed content inconsistencies.** Fixing these is an editorial accuracy task, not a request to alter conversion logic. The source template is the long-named original HTML imported by `src/lib/design.mjs`. Future copy-only overrides can be made in that renderer if the approved original must remain a frozen baseline. Article copy/frontmatter belongs in its existing Markdown file. All changes below are recommendations only.

|Page / location|Current issue|Exact recommended editorial action|Affected files|
|---|---|---|---|
|`/`, FAQ 5|Calls PNG pixel storage “uncompressed” while also describing DEFLATE; promises an 8–13 MB result from a particular 2.5 MB input without a documented benchmark.|Replace the answer with: “PNG uses lossless compression. A converted photo can be larger than its HEIC source because the formats encode images differently. The size depends on the image, dimensions and export settings. A larger PNG does not recover additional detail. If the destination accepts JPG, it may be easier to meet a file-size limit.” Keep the helpful JPG link.|`src/lib/design.mjs`; original HTML source; generated FAQ JSON-LD derives from this copy automatically.|
|`/`, FAQ 4 and device-support answers|Unqualified “No” to quality loss does not account for the site's ICC/HDR/8-bit rendering limits. “Any Android phone” and exact browser/device claims exceed the recorded test coverage.|State that PNG encoding adds no lossy compression to the rendered output, while the conversion path may change source color/HDR/associated data. Qualify browser/device support by the required APIs and available memory. Keep original-file guidance. Replace the stale shared “iOS 11–iOS 18” label with “HEIC/HEIF files from compatible devices” unless an actual maintained version matrix is supplied.|`src/lib/design.mjs`; original HTML source; shared converter copy.|
|`/heic-to-jpg`|Unverified fixed file sizes and 70–80% reductions; “100% of devices & software”; “universally” supported print portals; 85% labelled visually lossless; high-quality JPG called an archival master.|Remove exact sizes/percentage savings unless supported by a reproducible, linked test. Use “widely supported” rather than universal claims. Change “Visually Lossless Photography” to “High-quality photo delivery” and “Print & Archival Master” to “Higher-quality delivery copy.” Explain that a quality setting is encoder-dependent and does not replace keeping HEIC originals.|`src/lib/design.mjs`; original HTML source.|
|`/heic-to-avif`|“~94% global” browser support, fixed browser version minima and “smallest” output ranking lack dated evidence. Format-level HDR support may imply this 8-bit converter preserves it. Troubleshooting mentions a browser built-in AV1 encoder even though this implementation uses jSquash/libavif WASM.|Remove the percentage/version list or replace it with a maintained source link and date. Say “AVIF can produce compact files; compare the actual output.” Separate AVIF format capabilities from this site's 8-bit RGB export limits. Replace the encoder sentence with “This site encodes AVIF locally using a WebAssembly encoder in a worker; speed depends on your device and image size.”|`src/lib/design.mjs`, `src/scripts/avif-encoder.ts` and `src/scripts/converter.worker.ts` as evidence only; no encoder changes recommended.|
|`/about`|“Tested Format Guides” and “OS-tested tutorials for Windows, macOS, iOS, and Android” contradict the documented absence of a native-device test matrix.|Change the heading to “Practical Format Guides” and the sentence to “Our guides explain common conversion workflows using official documentation and clearly describe known limitations.” Use testing language only when supported by a published methodology/device record.|`src/lib/design.mjs`; original HTML source; `README.md`/`VERIFICATION.md` are supporting evidence.|
|`/blog` featured guide and Windows 11 article|“4 Tested Methods” / “four tested ways” are unsupported here. The supposed four methods include a comparison and a file-listing command; USB Automatic export is JPG, not a direct PNG method. The article has zero external source links.|Keep the article URL/H1. Remove “4 Tested Methods” from the featured heading and “tested”/“four” from the lead. Proposed description: **“Convert HEIC to PNG on Windows 11 with browser tools and compatible Photos exports. Learn codec requirements, batch options and how to check the result.”** Label PowerShell as inspection, and USB JPG as an alternate transfer path rather than PNG conversion. Verify Photos menus against the installed version, cite official Microsoft/Apple guidance, and state what was actually tested.|`src/content/blog/how-to-convert-heic-to-png-on-windows-11.md`, `src/lib/design.mjs` / original HTML featured-card copy, `scripts/prepare-content.mjs` for existing transforms.|

The nine newer articles already distinguish JPEG compression, PNG losslessness, rendering limitations, source preservation and website upload policy. Preserve that qualification. No fabricated benchmark, rating, credential, native test result or “100% compatibility” claim should be introduced to improve apparent trust.

## F03 — Live release differs from the local build

**P2, deployment-only follow-up; local fixes already exist.** Every publicly inspected HTML route still contains the footer `/404` link. Local built HTML does not. The local body has `data-show-ad-areas="false"`; public HTML does not. The public stylesheet is `/_astro/_..DKWI-5o6.css`; the local one is `/_astro/_..BGb-cNNO.css`. Both are expected release-specific fingerprints.

The live page's actual referenced stylesheet, font CSS, module script and logo all returned 200. A local-only stylesheet URL returning 404 publicly is **not** a broken live stylesheet: live HTML references its own existing asset. Do not “fix” asset hashes manually.

Exact recommendation: when a release is separately authorized, publish a consistent finished `dist/` release atomically, verify the footer/ad state and retain enough old hashed assets for cached documents. Do not redo the already-implemented footer/ad changes, weaken CSP, or deploy as part of this audit. HTML was reported `CF-Cache-Status: DYNAMIC` in the sampled responses; that does not support blaming a stale Cloudflare HTML cache for the mismatch.

Affected files/settings: existing `deploy/README.md`, release symlink/origin configuration and Cloudflare caching rules. Local source implementation is in `src/lib/design.mjs`, `src/pages/[...path].astro`, `src/styles/approved.css` and `.env.example`; no additional local fix is needed for the requested ad/footer behavior.

## F04 — Font delivery is heavier than necessary

**P2, measured assets; field performance unknown.** All fonts are self-hosted, which avoids a third-party font dependency, and all use `font-display: swap`. Those are positives. The homepage requested all five Inter weights and all three JetBrains Mono weights in the observed browser session. Their raw file sizes total **1,966,500 bytes**. Individual Inter files are about 325 KB.

Public `/fonts/Inter-400.ttf` returned 200 with `Content-Type: application/octet-stream`, `Content-Length: 324820` and no content encoding in the sampled request. The supplied Nginx gzip types do not include TTF. Actual transfer conditions vary; the local resource-timing sample was cache-warm and its zero decoded sizes were **not** treated as cold-load measurements.

Exact recommendation: generate WOFF2 versions/subsets of the **same approved fonts and required character set**, retain the same family/weight assignments, and update `public/fonts/fonts.css`. Correct origin MIME mapping (`font/woff2`, and `font/ttf` while TTF remains). Keep swap behavior. Test glyph coverage and font metrics before any future change. Preload only a demonstrated critical face; do not preload all eight files. Font substitution, color or layout changes are not recommended.

Affected files: `public/fonts/`, `public/fonts/fonts.css`, `deploy/heic2png.site.conf`; optional preload metadata in `src/pages/[...path].astro` only after measurement. This is a risk reduction proposal, not a claim of measured LCP/CLS/INP failure.

## F05 — Logo and image handling

**P2 optimization opportunity; no missing ordinary image alt attributes found.** Every built HTML page has **zero `<img>` elements** and two logo SVG wrappers containing `<image href="/brand/heic2png-logo.png">`. The wrappers have `role="img"`, `aria-label="HEIC2PNG.site"`, and explicit dimensions: header approximately 177 × 36, footer 145 × 32. An SVG `<image>` is not an HTML `<img>`; a missing `alt` attribute on it is not an HTML-alt defect.

The source logo is **2172 × 724 and 419,763 bytes**, reused for these small rendered sizes. Browsers can reuse that resource; count one shared payload, not two independent 420 KB transfers. Nine newer articles have labelled conceptual HTML diagrams, not photographic image assets. The Windows 11 illustration is also HTML, with readable captions. User conversion previews are generated only after selecting files and have descriptive filename-based alt text in `src/scripts/client.ts`; these private blob thumbnails are not indexable site imagery and should not be added to a sitemap.

Exact recommendation: prepare a losslessly optimized or appropriately sized derivative of the **approved** logo while preserving transparency, optical appearance, viewport crop, and displayed dimensions. If the intrinsic image dimensions change, update the SVG image size/viewBox together; swapping only the file would risk a broken crop. Do not invent article screenshots or add stock images simply to fill alt fields. Add real workflow images only where they improve the explanation, then use descriptive alt text and explicit dimensions.

Affected files: `public/brand/heic2png-logo.png` or a new derivative, `src/lib/design.mjs`; article frontmatter/body only if a genuinely useful image is later produced. [Google image discovery guidance](https://developers.google.com/search/docs/appearance/google-images).

## F06 — Social previews and favicon are not configured fully

**P2, confirmed missing metadata/assets.** All pages have `og:title`, `og:description`, `og:type`, `og:url`, `og:site_name`, `twitter:card`, `twitter:title`, and `twitter:description`. These match the page metadata. Articles use `og:type=article`. There are **no current `og:image` or `twitter:image` values**. The schema supports an optional article `image`, but no published article supplies one; `twitter:image` is not emitted even if a future article does. Other pages have no OG image fallback.

No favicon link exists in the built head. Public `/favicon.ico` and `/favicon.svg` both returned 404.

Exact recommendation: create a real brand social-preview asset without changing the visible UI, then use an absolute URL as a site-wide fallback for `og:image` and `twitter:image`, with appropriate image description/type/dimensions. Prefer a genuine article-specific asset when available; do not claim the HTML diagrams are already raster images. Keep `summary` unless the selected image warrants `summary_large_image`. Add a square approved-brand favicon in `public/` and a homepage/head `rel="icon"` reference. Verify asset URLs return 200 before shipping.

Affected files: `src/pages/[...path].astro`, `public/brand/` and favicon assets; optionally `src/content/blog/*.md` `image` values. Missing social images do not block ordinary Google indexing. [Google favicon documentation](https://developers.google.com/search/docs/appearance/favicon-in-search).

## F07 — Heading and mobile accessibility audit

All 19 documents have exactly one H1. Tool H1s match their format intent. Article H2s cover steps, decisions, troubleshooting and FAQs; H3s are used for FAQ questions. The complete built outline is recorded in the appendix. Counts there include footer/sidebar headings and headings inside hidden converter states; those are not additional H1s or separate indexable pages. Contact/404 go from H1 to footer H3s, and article/sidebar/footer H3s are not always under a related H2. This is a semantic cleanup opportunity, **not a demonstrated ranking penalty**.

**P2, verified mobile defects:**

|Page / width|Measured result|Recommendation, only if a responsive correction is separately authorized|
|---|---|---|
|Windows 11 article, 320 px|Document scroll width 360 px; status/demo badge overflows.|Allow that specific badge/row to wrap or shrink within the reading column; preserve desktop appearance.|
|Windows 11 article, 320 px and 375 px|Method table about 376 px wide inside a 236 px / 291 px container with `overflow-x:hidden`.|Replace clipping with an accessible horizontal table scroller or an equivalent approved small-screen treatment. Retain the table's semantic headers.|
|PNG/JPG/AVIF comparison article, 320 px|Format table about 270 px inside a 236 px `overflow-x:hidden` container.|Use the same approved table-overflow treatment; currently the right side is clipped despite no document-level overflow.|

All 18 content routes were checked at **320 px and 375 px**. No other document-level horizontal overflow or clipped visible tables were found in those checks. This does not certify all viewports/devices or full WCAG compliance. Desktop Chrome with viewport emulation is not a physical iPhone/Safari test.

**P2 accessibility recommendations without conversion changes:** initial FAQ buttons lack `aria-expanded`/`aria-controls` even though the first answer is open; runtime only adds expanded state after interaction. Give each FAQ its initial state and associated panel ID. Add `aria-controls` to the existing mobile menu/tools/advanced toggles. Existing error/success banners lack a live-region role; consider `role="alert"` for newly raised errors and `role="status"` for completion messages. The dropzone already has a name, button role, keyboard focus and Enter/Space handling; preserve them. No unlabeled visible homepage form controls were found. Contact inputs have labels. There is no skip-to-main link; treat that as a P3 navigation improvement requiring separate approval if a focus-visible control would be added.

Affected files: the two article Markdown files above; shared source markup through `src/lib/design.mjs` / original HTML; `src/scripts/client.ts` or its runtime source only for semantic state updates if later authorized. No responsive/CSS/component or conversion changes were made here. Do not implement the mobile recommendations under the current audit-only constraint.

## F08 — Internal links and search-intent ownership

**Verified positives:** all built internal anchor destinations resolved to a built file/route, all local fragment targets existed, and no empty unnamed anchor was found in the static link check. Every article is linked by `/blog` and has at least one additional article/homepage incoming link. All published articles link to actual converter routes and three published related guides. There are no orphaned published articles. The local footer no longer links to `/404`; the public footer still does because of F03.

**P2, one misleading anchor:** homepage text “complete Windows 11 & macOS HEIC to PNG tutorial” points only to the Windows 11 guide. Relabel it “HEIC to PNG on Windows 11” and, if appropriate within the approved copy area, point a distinct “HEIC to PNG on Mac” anchor to the already-published Mac guide. Do not promise Mac instructions at a Windows-only destination. Source: `src/lib/design.mjs` / original HTML homepage copy.

The home route owns **heic to png** tool intent. `/heic-to-jpg` and `/heic-to-avif` own their respective conversion intents. `/heic-to-png` currently returns 404; no internal link requires it. Do **not** create a second indexable PNG tool page at that path merely for the keyword. If legacy external demand for that alias is established, redirect it to `/` rather than cloning the tool.

No identical titles/descriptions or duplicate article bodies were identified. Reused navigation, tool widgets, author boxes and related links are expected shared template content. Similar wording alone does not demonstrate cannibalization. These pairs should retain separate intent:

|Pages|Distinct ownership / recommendation|
|---|---|
|JPG tool vs iPhone JPG guide vs JPG quality guide|Perform conversion vs phone-specific file selection/download steps vs compression decisions. Keep all three; do not retarget each to the same generic head term.|
|iPhone JPG guide vs why-iPhone-saves-HEIC guide|Existing-file export vs future camera capture. Keep the cross-links and distinct headings.|
|Upload preparation vs unsupported-HEIC troubleshooting|Prepare an acceptable file before submission vs diagnose a specific failure. Moderate overlap to monitor with actual query/landing-page data; do not merge preemptively.|
|HEIC-vs-PNG vs JPG/PNG/AVIF comparison|PNG quality/size explanation vs output-format selection. Keep the current scope boundaries.|
|Windows 11 and Mac PNG guides vs root PNG tool|Platform instructions vs immediate conversion. These are useful long-tail intents, not automatically duplicate tool pages.|

No Search Console query data, selected-canonical history, rankings or backlink data was available. Cannibalization cannot be declared conclusively without that evidence. The established JPG/PNG comparison slug does not include AVIF, but its title/content now do; retain the URL rather than changing it just to add another keyword.

## F09 — Structured data exists and mostly matches the content

All 19 JSON-LD blocks parsed successfully. The implementation already emits:

|Page type|Observed nodes|Assessment|
|---|---|---|
|Every document|`WebSite`, `BreadcrumbList`|Present, not missing.|
|Three tools|`SoftwareApplication`, category `MultimediaApplication`, `operatingSystem=Web browser`, free offer with `price=0` and USD|Represents the tool. No rating/review nodes are present; do not invent them.|
|Home only|`FAQPage` with ten questions/answers|Matches FAQ content generation; see current rich-result note below.|
|Blog index|`CollectionPage`|Correct collection intent.|
|Ten articles|`Article`, headline/description, publication/update dates, organization author, `mainEntityOfPage`|Matches frontmatter and canonical. Dates are not missing or future-dated relative to the audit.|

**P2 optional accuracy improvement:** article visual breadcrumbs show Home → Blog → category → article, while JSON-LD has only Home → article. Emit a truthful Home → Blog → article trail at minimum; include a category only if it has a real destination you intend to represent. Do not fabricate category landing pages. Link author/publisher identity to an actual About/editorial destination if verified, and optionally give shared website/organization entities stable `@id` values. Article images are absent, not invalid URLs; supply a real image only when available. Missing recommended properties are not the same as invalid JSON-LD or an indexing blocker. [Google Article guidance](https://developers.google.com/search/docs/appearance/structured-data/article).

Software-app rich-result eligibility is more specific than Schema.org validity. Google's guidance calls for a genuine rating or review for that feature. The current app nodes do not have one; accept limited eligibility unless authentic visible reviews are later collected. Do not add made-up stars, and do not change to a misleading schema type to evade requirements. [Google software-app guidance](https://developers.google.com/search/docs/appearance/structured-data/software-app).

**Current-date check:** Google's documentation states FAQ rich results stopped appearing starting **May 7, 2026**. The older recommendation to add FAQ markup across every tool/article for FAQ rich results would therefore be inappropriate for this October 2026 audit. Existing FAQPage data can remain descriptive; it is not a reason to promise rich-result traffic or add duplicate FAQ content. [Google's feature deprecation record](https://developers.google.com/search/updates).

Affected file for future shared JSON-LD work: `src/pages/[...path].astro`; author/image data may involve `src/content.config.ts` and article frontmatter only if existing fields are insufficient. The current schema already supports `image`; no new CMS or package is necessary.

## F10 — Content quality, operator identity and legal-page trust

The nine newer guides provide usable steps, limitations, troubleshooting and source links. Their roughly 900–1,200 editorial words are not an SEO guarantee, but they are substantive rather than empty cards. Keep source citations, actual dates and the organizational attribution. All articles using the same team byline is not itself a defect; do not replace it with fabricated individuals or credentials.

**P2, About/contact:** About explains the technology but not who operates the service or how editorial corrections are handled. Add only verifiable operator/team information and a concise review/testing policy if the owner chooses to disclose it. The contact page has a named/labeled form, but no visible static support email or mailto link. Submission is handled by JavaScript and opens the configured mailbox `backbencherz@gmail.com`; the HTML form has no action or field names for a no-JS fallback. Add a descriptive static support mailto fallback or clarify “opens your email app” within an approved copy area if a future content change is authorized. Do not claim messages were sent from the website or silently introduce a form backend. The missing fallback is a usability/trust improvement, not an indexing blocker.

**P2, privacy accuracy:** the privacy text describes non-identifying infrastructure logs and local preferences. The supplied Nginx access log excludes IP/query strings, but deployment docs acknowledge error logs can contain client details; public requests also traverse Cloudflare. The client code does not use `document.cookie`, `localStorage` or `sessionStorage`; settings are in page-memory variables. Verify actual host/Cloudflare logging and cookies with the operator, then describe those actual practices without an unverified anonymity claim or implying persistent preference cookies. No active analytics or ad network script was found in the inspected build; “may display ads” should be clearly conditional. This is a technical consistency finding, not a jurisdiction-specific legal opinion or a completed privacy-policy compliance review.

**P2, terms:** the visible eyebrow still says “Document Template.” Replace that text with “Terms of Service” or “Legal” after editorial approval. Do not invent an operator address, registration, liability provision or compliance certification. Short contact/legal pages should not be padded to reach a word-count target, and indexing them is not inherently harmful. Keep their current self-canonicals, headings and accessible footer links; no blanket noindex is recommended.

Affected files: `src/lib/design.mjs` / original HTML copy, `src/scripts/runtime.txt` for the existing contact behavior as evidence, `deploy/README.md`, deployed log/edge settings. Their existing technical facts should be verified rather than replaced by generic SEO prose.

## F11 — JavaScript rendering and discovery

The site is Astro static output, not a client-only SPA. Titles, descriptions, H1s, article text, JSON-LD, canonical tags and ordinary anchors are in the initial HTML. In a JS-disabled browser, `/blog` displayed all **ten** linked article cards; with JS it displayed the first six. The Mac article's body was readable without JS (about 7,881 characters in the article including its surrounding article UI). All remaining cards are already in the static HTML, so the current two-page client paginator does not hide their links from an HTML crawler. No page errors were captured during the read-only route sweep.

Keep that static rendering. Do not add SSR/hydration libraries or create indexable category/search pages just to fix an absent problem. `/blog?q=...` and category-query variants canonicalize to `/blog`; this is sensible for utility filtering. Page buttons do not produce independent page URLs; that is acceptable at the current ten-card scale because all links are emitted server-side. If the collection grows to require actual server pagination, revisit crawlable page anchors and their canonicals then.

The shared initial module is about **21,133 bytes raw / 7,892 bytes gzip when compressed locally**. The ~3.15 MB worker, ~3.49 MB AVIF WASM and ZIP module are lazy paths for conversion/download, not initial content-rendering prerequisites. Worker/AVIF encoding runs after user actions, not to create SEO headings. Do not move decoding onto the main thread or preload heavy codecs as an SEO “fix.” Conversion latency/memory on lower-end phones can affect user experience, but no conversion was executed in this audit and no conversion-logic change is proposed.

Optional small improvement: add a concise noscript explanation for converter users when a copy/accessibility change is separately approved. It should explain the need for JavaScript rather than duplicate keyword text. The conversion's JS requirement is expected and does not make the surrounding static page unindexable. [Google JavaScript SEO guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics).

## F12 — robots, sitemap and index/noindex

**Local files are correct:** `public/robots.txt` and `dist/robots.txt` allow crawling and declare the absolute sitemap URL. `src/pages/sitemap.xml.ts` filters `draft:false` entries, and built/public sitemaps contain 18 unique, canonical-format URLs. No 404, draft, localhost, query or www URL is listed. XML is well-formed. `<lastmod>` is absent; it is optional. If added later, use real editorial changes from frontmatter/deployment records rather than the current date on every build. No sitemap plugin is needed merely to duplicate this working generator.

**Indexing:** all 18 intended public content routes lack meta noindex and sampled public responses have no `X-Robots-Tag` restriction. Omitted `index,follow` is normal; adding it is unnecessary. Error responses carry `noindex,follow` and HTTP 404. Three drafts are present on disk but are excluded from generated routes and sitemap and returned public 404:

- `/blog/what-is-a-heic-file-beginners-guide`
- `/blog/heic-vs-avif-whats-the-difference`
- `/blog/how-to-convert-multiple-heic-photos-at-once`

Keep those drafts unpublished until they have distinct, reviewed bodies. Do not add `Disallow` rules to hide noindex pages; crawlers need access to read a page-level noindex. [Google robots metadata reference](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag).

**Public robots differs from the repository:** Cloudflare prepends a managed policy including `Content-Signal: search=yes,ai-train=no,use=reference` and explicit crawler groups. The original allow/sitemap section remains at the bottom. There is no Googlebot or Bingbot disallow in the fetched file. Google-Extended, GPTBot, ChatGPT-User, Claude-User, Perplexity-User and several other named crawlers are disallowed; Baiduspider and PetalBot are also listed. These affect those crawlers/products, not necessarily Google's ordinary web index. Google explicitly says Google-Extended does not control Google Search inclusion/ranking. [Google crawler documentation](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers).

Exact recommendation: preserve the Google/Bing search allow behavior, and review Cloudflare's Search/Agent/Training preferences deliberately with the owner if visibility in those additional services matters. Do not remove AI-training restrictions indiscriminately or describe this as a blanket Google block. Changes to the local robots file alone will not remove the edge-managed prefix. [Cloudflare managed robots policy](https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/).

## F13 — Cloudflare/Nginx risks and verified safeguards

|Check|Evidence / current status|Recommendation / priority|
|---|---|---|
|HTTP → HTTPS|301 observed for root.|Keep; consolidate www directly as F01.|
|www → preferred host|www HTTPS returns 200 on root and blog.|P1 permanent host consolidation; canonical tags already help.|
|Unknown routes / unpublished drafts|Public 404 and noindex; no SPA catch-all.|Keep `try_files ... =404`; never rewrite every unknown URL to a 200 homepage.|
|TLS / origin scheme|Public HTTPS requests succeed. The committed config only defines port 80; docs describe later TLS setup.|Do not report HTTPS as missing. Actual certificate expiry, origin TLS mode and deployed port-443 block were not inspected. Verify separately in operations.|
|Crawler challenge/WAF|Ordinary requests returned page HTML, not a challenge; Cloudflare headers confirm the proxy.|P2 operational verification: use verified-bot controls, logs and Search Console URL Inspection to check Googlebot. Do not assume a normal user-agent request proves Googlebot access. No WAF/dashboard inspection was possible. [Cloudflare verified bots](https://developers.cloudflare.com/bots/concepts/bot/verified-bots/).|
|Robots rewrite|Managed prefix confirmed; search allowed for ordinary Google/Bing groups.|Owner policy decision as F12; no code-only “fix.”|
|HTML / static asset delivery|Actual live CSS/module/font stylesheet/logo URLs returned 200. JS/CSS compressed; hashed assets have one-year cache headers.|Keep fingerprinting and compression. Release old/new HTML and assets consistently; avoid long caching of unversioned HTML by broad Cache Everything rules.|
|Font MIME / compression|TTF served as octet-stream, unencoded in sample.|P2 map correct MIME and prefer WOFF2 (F04).|
|AVIF WASM|Public WASM returns `application/wasm` with Brotli in sample; CSP contains `wasm-unsafe-eval`.|Already correct; do not weaken CSP or remove the WASM allowance.|
|Asset 404 caching|Missing favicon and an unreferenced local-only CSS hash had a four-hour cache policy.|P2 release risk: when adding formerly missing assets, account for negative edge/browser caching. Do not infer a broken live CSS URL from the local-only hash.|
|Security/CSP headers|Live CSP permits same-origin assets/workers, not third-party ads. Canonical public content is accessible.|Keep. No need to add analytics, remote fonts or ad scripts for SEO.|
|Origin / Search Console evidence|No access to `nginx -T`, origin logs, Cloudflare account/rules, Search Console, CrUX or field analytics.|Mark these as unverified rather than guessing. No bot UA spoofing, server setting changes or sitemap submission was performed.|

## Optimized elements and pages to leave unchanged

- Preserve **`/` as the only primary HEIC-to-PNG tool URL** and the three format-specific tool H1s. Keep the primary keyword near the beginning of the title. The home/JPG/AVIF titles are 83/77/77 characters; they may truncate by device width, but length is not a fixed SEO failure. Do not mechanically cut useful wording or rewrite every title to meet a 60-character rule. Consider a concise title experiment only with actual impression/CTR data. [Google title guidance](https://developers.google.com/search/docs/appearance/title-link).
- Preserve the **existing unique titles, descriptions, H1s, slugs and distinct search intents of the nine newer articles**. The choice article's 320 px table issue and shared image/schema opportunities do not require a content rewrite, URL rename or merge.
- Preserve the blog index's collection purpose and all server-rendered article anchors. Keep current utility-query canonicalization and draft filtering.
- Preserve the Mac guide, iPhone existing-file guide, iPhone future-camera guide, JPG quality guide, PNG quality/size guide, upload-preparation guide, Windows/Mac opening guide and HEIC troubleshooting guide's useful scope and citations. Platform instructions may need normal future maintenance, but no missing-body or duplicate-intent defect was found.
- Preserve self-canonicals and default indexability on About/contact/legal pages. Improve factual trust copy selectively; do not stuff tool keywords into legal titles/headings or pad them to arbitrary length.
- Preserve noindex/404 behavior, `robots.txt`'s sitemap declaration, the 18-URL sitemap, local ad-disable switch, removed local footer template link, original dimensions/privacy limitations, lazy codec loading and CSP/WASM support.
- Keep existing page components, styling, responsive behavior and conversion logic unchanged in this audit. Recommendations that would affect them need a separate implementation request; none has been applied.

## Suggested future work order — recommendations only

1. Normalize host/URL variants (F01) and correct unsupported older copy (F02). Keep current working titles/URLs unless a specific factual claim must change.
2. When separately authorized, deploy the already-completed footer/ad state as a coherent release (F03); verify live output rather than editing it again.
3. Address font MIME/payload and logo payload without changing appearance (F04–F05); measure cold mobile performance before and after.
4. Add real social-preview/favicon assets and truthful breadcrumb/entity enrichment (F06/F09). No invented reviews or images.
5. Obtain approval before the narrowly scoped mobile table/badge and accessibility corrections (F07). Review support/operator/privacy copy with actual facts (F10).
6. Verify selected canonicals, Googlebot crawl access and query overlap in Search Console and Cloudflare/origin records. No Search Console/field-data conclusions can be supplied from repository inspection alone.

## Appendix — heading inventory from built HTML

Counts include the whole document. Ordered lists below preserve H2/H3 order in the built DOM, including hidden state/footer/sidebar headings. They are included as evidence, not a recommendation to add more headings or repeat keywords.

### /

H1: 1 · H2: 7 · H3: 21

- **H1** HEIC to PNG Converter
- **H2** Drag and drop HEIC files here
- **H3** 1 file could not be processed
- **H3** Conversion completed
- **H3** Selected Photos (0)
- **H2** Why Use HEIC2PNG?
- **H3** Private Image Conversion
- **H3** High-Quality PNG Output
- **H3** Batch HEIC Conversion
- **H3** Original Image Dimensions
- **H3** Works Across Devices
- **H3** No Installation or Registration
- **H2** How to Convert HEIC to PNG Online
- **H3** Step 1: Select your HEIC photos
- **H3** Step 2: Convert the files to PNG
- **H3** Step 3: Download PNG or ZIP
- **H2** What Is the Difference Between HEIC and PNG?
- **H2** When Should You Convert HEIC to PNG?
- **H3** Uploading to services that reject HEIC
- **H3** Editing images in applications that support PNG
- **H3** Preparing graphics for presentations
- **H3** Sharing between devices & design workflows
- **H2** More HEIC Conversion Tools
- **H3** HEIC to JPG Converter
- **H3** HEIC to AVIF Converter
- **H2** Frequently Asked Questions
- **H3** Conversion Tools
- **H3** Learn
- **H3** Company

### /heic-to-jpg

H1: 1 · H2: 7 · H3: 6

- **H1** HEIC to JPG Converter
- **H2** Drag and drop HEIC files here
- **H3** 1 file could not be processed
- **H3** Conversion completed
- **H3** Selected Photos (0)
- **H2** How to Convert HEIC to JPG
- **H2** Why Convert HEIC Photos to JPG?
- **H2** Understanding JPG Image-Quality Settings
- **H2** HEIC versus JPG: Side-by-Side Comparison
- **H2** How to Open HEIC Photos on Windows
- **H2** HEIC to JPG Frequently Asked Questions
- **H3** Conversion Tools
- **H3** Learn
- **H3** Company

### /heic-to-avif

H1: 1 · H2: 4 · H3: 6

- **H1** HEIC to AVIF Converter
- **H2** Drag and drop HEIC files here
- **H3** 1 file could not be processed
- **H3** Conversion completed
- **H3** Selected Photos (0)
- **H2** When Is AVIF Useful?
- **H2** Browser & Software Support Notes
- **H2** Image Format Comparison: HEIC vs AVIF vs PNG vs JPG
- **H3** Conversion Tools
- **H3** Learn
- **H3** Company

### /blog

H1: 1 · H2: 1 · H3: 14

- **H1** HEIC & Image Format Guides
- **H2** How to Convert HEIC to PNG on Windows 11 (4 Tested Methods)
- **H3** PNG vs JPG vs AVIF: Which Image Format Should You Use?
- **H3** HEIC vs PNG: Quality, File Size and Compatibility
- **H3** How to Convert HEIC Images for Website Uploads
- **H3** How to Convert HEIC to JPG on iPhone
- **H3** HEIC to JPG Without Losing Quality: What Is Possible?
- **H3** How to Convert HEIC to PNG on Mac
- **H3** HEIC Not Supported? Fix Opening and Upload Errors
- **H3** How to Open HEIC Files on Windows 10 and Mac
- **H3** Why iPhone Saves HEIC Photos and How to Turn It Off
- **H3** How to Convert HEIC to PNG on Windows 11
- **H3** No matching guides found
- **H3** Conversion Tools
- **H3** Learn
- **H3** Company

### /blog/how-to-convert-heic-to-png-on-windows-11

H1: 1 · H2: 6 · H3: 6

- **H1** How to Convert HEIC to PNG on Windows 11
- **H2** 1. Why Windows 11 Sometimes Rejects HEIC Files
- **H2** 2. Method 1: Convert HEIC to PNG in Your Browser (Best for Batches)
- **H2** 3. Method 2: Use the Built-In Windows 11 Photos App
- **H2** 4. Comparing Windows 11 HEIC to PNG Methods
- **H2** 5. Verifying File Extensions & Troubleshooting Failed Files
- **H2** 6. Windows 11 HEIC to PNG FAQ
- **H3** Does changing the file extension from .heic to .png in File Explorer work?
- **H3** When should I convert to JPG instead of PNG on Windows?
- **H3** Convert Your HEIC Photos Now
- **H3** Conversion Tools
- **H3** Learn
- **H3** Company

### /blog/how-to-convert-heic-to-png-on-mac

H1: 1 · H2: 8 · H3: 7

- **H1** How to Convert HEIC to PNG on Mac
- **H2** Choose the file you actually want to export
- **H2** Export one HEIC as PNG in Preview
- **H2** Convert several images or export from Photos
- **H2** Use the browser converter when it fits your workflow
- **H2** Check dimensions, color and file size
- **H2** Troubleshoot a missing format or failed export
- **H2** Mac HEIC to PNG FAQ
- **H3** Can I rename .heic to .png in Finder?
- **H3** Will converting to PNG make my photo sharper?
- **H3** Must I install a converter?
- **H2** Finish with a verified copy
- **H3** Convert Your HEIC Photos Now
- **H3** Conversion Tools
- **H3** Learn
- **H3** Company

### /blog/how-to-convert-heic-to-jpg-on-iphone

H1: 1 · H2: 7 · H3: 8

- **H1** How to Convert HEIC to JPG on iPhone
- **H2** Identify whether you need an old photo or a new camera setting
- **H2** Convert an existing HEIC in the browser
- **H2** Check the file before submitting it
- **H2** Consider an Apple export when it is available
- **H2** Understand quality, privacy and future captures
- **H2** iPhone HEIC to JPG FAQ
- **H3** Why did changing the camera setting leave my old photos as HEIC?
- **H3** Why can I see the photo in Photos but not upload it?
- **H3** Can I convert several photos on my phone?
- **H3** Does downloading a JPG automatically place it in Photos?
- **H2** Send the checked output
- **H3** Convert Your HEIC Photos Now
- **H3** Conversion Tools
- **H3** Learn
- **H3** Company

### /blog/why-does-my-iphone-save-photos-as-heic

H1: 1 · H2: 7 · H3: 7

- **H1** Why iPhone Saves HEIC Photos and How to Turn It Off
- **H2** Why HEIC appears in your photo library
- **H2** Turn off HEIC for future standard camera photos
- **H2** What changes and what stays in the library
- **H2** Handle HEIC photos you already took
- **H2** Troubleshoot photos that still seem to be HEIC
- **H2** Camera format FAQ
- **H3** Can I switch back to HEIC later?
- **H3** Does Most Compatible convert my iCloud library?
- **H3** Will all my images now be JPG?
- **H2** Choose the setting that matches your routine
- **H3** Convert Your HEIC Photos Now
- **H3** Conversion Tools
- **H3** Learn
- **H3** Company

### /blog/how-to-convert-heic-to-jpg-without-losing-quality

H1: 1 · H2: 8 · H3: 7

- **H1** HEIC to JPG Without Losing Quality: What Is Possible?
- **H2** Can HEIC to JPG conversion really be lossless?
- **H2** Convert once from the original HEIC
- **H2** Choose quality by inspecting the picture
- **H2** Avoid confusing resolution with quality
- **H2** Know the color and metadata limits
- **H2** Frequently asked questions
- **H3** Does quality 100 make the JPG lossless?
- **H3** Is JPG different from JPEG?
- **H3** Should I choose PNG instead?
- **H2** Keep an original and a checked delivery copy
- **H2** Sources and scope
- **H3** Convert Your HEIC Photos Now
- **H3** Conversion Tools
- **H3** Learn
- **H3** Company

### /blog/heic-vs-png-quality-file-size-compatibility

H1: 1 · H2: 7 · H3: 8

- **H1** HEIC vs PNG: Quality, File Size and Compatibility
- **H2** What “lossless PNG” actually means
- **H2** Why a PNG photo is often larger than HEIC
- **H2** Compare image quality separately from photo features
- **H2** When PNG is a useful output choice
- **H2** Convert and check one image before a batch
- **H2** HEIC and PNG FAQ
- **H3** Does a larger PNG contain more camera detail?
- **H3** Can PNG be smaller than HEIC?
- **H3** Is PNG always better for printing?
- **H3** Can I delete HEIC once PNG opens?
- **H2** Use PNG for a defined purpose
- **H3** Convert Your HEIC Photos Now
- **H3** Conversion Tools
- **H3** Learn
- **H3** Company

### /blog/heic-to-jpg-vs-png-which-format-should-you-choose

H1: 1 · H2: 7 · H3: 8

- **H1** PNG vs JPG vs AVIF: Which Image Format Should You Use?
- **H2** Start with the destination, not a universal winner
- **H2** Choose JPG for familiar photo delivery
- **H2** Choose PNG when exact rendered pixels matter
- **H2** Choose AVIF when the full workflow supports it
- **H2** Compare outputs without misleading yourself
- **H2** Format-choice FAQ
- **H3** Is AVIF always smaller than JPG?
- **H3** Is PNG always higher quality than JPG?
- **H3** Can I rename JPG to AVIF?
- **H3** Which should I use for a website form?
- **H2** Pick the file that completes the job
- **H3** Convert Your HEIC Photos Now
- **H3** Conversion Tools
- **H3** Learn
- **H3** Company

### /blog/how-to-convert-heic-images-for-website-uploads

H1: 1 · H2: 7 · H3: 8

- **H1** How to Convert HEIC Images for Website Uploads
- **H2** Read the upload requirements before converting
- **H2** Choose an accepted output format
- **H2** Convert with the dimensions you need
- **H2** Meet the file-size limit without blind retries
- **H2** Upload the new file and verify the saved result
- **H2** Website upload FAQ
- **H3** Why is HEIC rejected when my browser shows it?
- **H3** Should I always choose the smallest output?
- **H3** Can I upload my downloaded ZIP?
- **H3** Does conversion remove the background?
- **H2** Use a repeatable submission checklist
- **H3** Convert Your HEIC Photos Now
- **H3** Conversion Tools
- **H3** Learn
- **H3** Company

### /blog/how-to-fix-heic-files-that-wont-open

H1: 1 · H2: 7 · H3: 8

- **H1** HEIC Not Supported? Fix Opening and Upload Errors
- **H2** Start with three quick checks
- **H2** If Windows or an editor cannot open HEIC
- **H2** If a website says the image type is unsupported
- **H2** If the converted file is still rejected
- **H2** If the original download or conversion is incomplete
- **H2** Frequently asked questions
- **H3** Why does my phone show the picture while the form refuses it?
- **H3** Will converting repair a corrupt HEIC?
- **H3** Why did one HEIC work and another fail?
- **H3** Should I send the original to support?
- **H2** Match the fix to the failure
- **H3** Convert Your HEIC Photos Now
- **H3** Conversion Tools
- **H3** Learn
- **H3** Company

### /blog/how-to-open-heic-files-on-windows-and-mac

H1: 1 · H2: 7 · H3: 7

- **H1** How to Open HEIC Files on Windows 10 and Mac
- **H2** Opening a file and converting it solve different problems
- **H2** Open HEIC files on Windows 10
- **H2** View an HEIC image on Mac
- **H2** Create a copy when you only need to send the photo
- **H2** Use the error message to choose the next check
- **H2** Frequently asked questions
- **H3** Do I need both HEIF and HEVC extensions?
- **H3** Will a codec fix a website upload error?
- **H3** Can opening an HEIC reduce its quality?
- **H2** Keep viewing support separate from delivery requirements
- **H3** Convert Your HEIC Photos Now
- **H3** Conversion Tools
- **H3** Learn
- **H3** Company

### /about

H1: 1 · H2: 3 · H3: 4

- **H1** Fast, Private Image Conversion Built for Modern Web Browsers
- **H2** Zero Server Uploads
- **H2** True Format Fidelity
- **H2** Tested Format Guides
- **H3** Ready to convert your iPhone photos?
- **H3** Conversion Tools
- **H3** Learn
- **H3** Company

### /contact

H1: 1 · H2: 0 · H3: 3

- **H1** Contact Us
- **H3** Conversion Tools
- **H3** Learn
- **H3** Company

### /privacy

H1: 1 · H2: 5 · H3: 3

- **H1** Privacy Policy
- **H2** 1. Browser-Based Image Conversion (No File Uploads)
- **H2** 2. Information Processing & Technical Logs
- **H2** 3. Analytics & Advertising Disclosures (Google AdSense)
- **H2** 4. Cookie Information
- **H2** 5. Contact Details
- **H3** Conversion Tools
- **H3** Learn
- **H3** Company

### /terms

H1: 1 · H2: 3 · H3: 3

- **H1** Terms of Service
- **H2** 1. Acceptance of Terms
- **H2** 2. User Responsibility & Copyright
- **H2** 3. Disclaimer of Warranties
- **H3** Conversion Tools
- **H3** Learn
- **H3** Company

### /404

H1: 1 · H2: 0 · H3: 3

- **H1** Page Not Found
- **H3** Conversion Tools
- **H3** Learn
- **H3** Company

## Verification and boundaries

- Inspected all 19 existing built HTML documents and routing/content/schema/rendering source, plus robots, sitemap, assets, fonts and deployment files.
- Queried all 18 canonical public content routes, custom/random 404s, three draft URLs, host/path/query variants and actual live asset URLs. No public response was inferred from a local test server's behavior.
- Read-only Chrome checks covered 18 content pages at 320/375 px, table clipping, initial control semantics, JS-disabled blog/article readability, resource names and page errors. No upload or conversion action was performed.
- Parsed all JSON-LD blocks; checked static local anchor/fragment targets, title/description uniqueness, single H1s, sitemap membership and metadata parity. No Lighthouse, Rich Results Test, Search Console validation or Core Web Vitals field test was run; no unexecuted score/pass is claimed.
- Current Google/Cloudflare/Nginx primary documentation is linked next to relevant recommendations. Public HTML observations were fetched directly from the named domain; this report does not rely on cached search snippets for site metadata.
- Only `SEO_AUDIT.md` is an intended audit artifact. Source/public/deploy/dist/root-file integrity is checked against the audit-start hash snapshot below.

**Integrity result:** SHA-256 comparison of **105 existing files** across `src/`, `public/`, `deploy/`, `dist/` and root files (excluding this new report) found **zero changed, added or removed files** in the compared set. The report's 21 page/resource rows each have all ten requested columns, and all 19 heading outlines were generated from existing built HTML. Ten article body hashes were distinct. Only this audit report is new; the seven pre-existing working-tree changes listed at the start remain untouched.
