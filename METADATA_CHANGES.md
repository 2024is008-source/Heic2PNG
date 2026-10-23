# On-page metadata changes — 2026-10-23

Updated local Astro metadata only. No deployment, push, visible-content edit, styling change, layout change or converter-code change was performed.

## Modified files for this task

- `src/pages/[...path].astro`: revised tool/supporting-page metadata; standardized the title suffix and Open Graph site name to HEIC2PNG; applied one Windows 11 article description override only in the document head and matching structured-data description.
- `tests/blog.spec.ts`: adjusted the existing metadata expectations for the brand suffix and Windows 11 head-only description.
- `METADATA_CHANGES.md`: this before/after and verification report.

Pre-existing working-tree edits in the page renderer/test file and other files were preserved. `SEO_AUDIT.md` remains a historical audit of the previous metadata, not a description of the newly built release.

## Approach

The three tool titles use the requested starting wording exactly:

- HEIC to PNG Converter – Free Online | HEIC2PNG
- HEIC to JPG Converter – Free Online | HEIC2PNG
- HEIC to AVIF Converter – Free Online | HEIC2PNG

Descriptions cover actual controls and outputs: dimensions, JPEG quality, AVIF quality/chroma/lossless encoding, individual downloads and batch ZIPs. The homepage description naturally includes .heic. Query variants such as “how to change HEIC to JPG” are not forced into the title or repeated as a keyword list; that page already contains relevant instructions. No meta keywords were added. No new speed, security, unlimited-use or perfect-quality claim was introduced.

All ten article titles remain based on their distinct frontmatter titles, with only the shared brand suffix changed. Nine already-helpful article descriptions are retained. The Windows 11 head description no longer repeats the unsubstantiated “four tested ways” claim. Its visible article and card copy are deliberately unchanged under the metadata-only scope; the earlier audit's separate editorial finding still applies.

Open Graph and Twitter titles/descriptions use the same resolved values as the title and meta description. Article JSON-LD uses the same resolved description. Canonical URLs, og:url, article URLs, publication/update dates, H1s and visible breadcrumb/card text are unchanged. Existing OG image behavior and Twitter card type are unchanged.

## Before / after values

The first 18 content rows are indexable. The error document is included for completeness and retains its noindex rule.

|URL path|Title before|Title after|Description before|Description after|Notes|
|---|---|---|---|---|---|
|/|HEIC to PNG Converter – Free, Private Online iPhone Photo Converter \| HEIC2PNG.site|HEIC to PNG Converter – Free Online \| HEIC2PNG|Convert HEIC to PNG privately in your browser. Free batch conversion, original resolution and ZIP downloads. Your photos stay on your device.|Convert HEIC to PNG with a free online converter. Add .heic files, choose image dimensions, and download PNGs individually or in a batch ZIP.|Title and description updated.|
|/heic-to-jpg|HEIC to JPG Converter – Free Online iPhone Photo to JPEG Tool \| HEIC2PNG.site|HEIC to JPG Converter – Free Online \| HEIC2PNG|Convert HEIC to JPG privately in your browser with adjustable JPEG quality, batch conversion and ZIP downloads.|Convert HEIC to JPG online for free. Adjust JPEG quality and image dimensions, then download individual JPG files or a ZIP of your converted photos.|Title and description updated.|
|/heic-to-avif|HEIC to AVIF Converter – Free, Private Browser AV1 Image Tool \| HEIC2PNG.site|HEIC to AVIF Converter – Free Online \| HEIC2PNG|Convert HEIC to AVIF privately in your browser. Adjust quality, choose 4:2:0, 4:4:4 or lossless encoding, preserve dimensions and download batch ZIP files.|Convert HEIC to AVIF online for free. Choose quality, chroma subsampling or lossless encoding, adjust dimensions, and download AVIF files or a ZIP.|Title and description updated.|
|/blog|HEIC & Image Format Guides – Tutorials & Comparisons \| HEIC2PNG.site|HEIC Conversion Guides – PNG, JPG & AVIF \| HEIC2PNG|Read HEIC guides, image format explanations and practical conversion tutorials.|Learn how to convert HEIC photos to PNG, JPG or AVIF. Explore Windows, Mac and iPhone tutorials, format comparisons, quality tips and upload fixes.|Title and description updated.|
|/about|About HEIC2PNG – Private Browser Image Conversion \| HEIC2PNG.site|About Our HEIC Image Converters \| HEIC2PNG|Learn how HEIC2PNG processes images locally in your browser.|Learn about HEIC2PNG's browser-based image converters, local photo processing, output limitations and guides for HEIC, PNG, JPG and AVIF.|Title and description updated.|
|/contact|Contact HEIC2PNG Support & Feedback \| HEIC2PNG.site|Contact Support & Report Issues \| HEIC2PNG|Contact HEIC2PNG about browser conversion issues, unsupported files or editorial corrections.|Contact HEIC2PNG about conversion problems, unsupported HEIC files or guide corrections. The contact form opens your email app to prepare a message.|Title and description updated.|
|/privacy|Privacy Policy – Local Browser Image Processing \| HEIC2PNG.site|Privacy Policy – Image Conversion & Site Data \| HEIC2PNG|How HEIC2PNG processes your photos locally and handles website data.|Read how HEIC2PNG handles local image conversion, technical logs, cookies and possible advertising, plus how to contact us about privacy.|Title and description updated.|
|/terms|Terms of Service \| HEIC2PNG.site|Terms of Service \| HEIC2PNG|Terms for using HEIC2PNG browser image conversion and guides.|Read the terms for using HEIC2PNG's image converters and guides, including file responsibilities, copyright and service limitations.|Title and description updated.|
|/404.html|404 Page Not Found \| HEIC2PNG.site|404 Page Not Found \| HEIC2PNG|The requested page could not be found.|The requested page could not be found.|Non-indexable error page; brand suffix only.|
|/blog/heic-to-jpg-vs-png-which-format-should-you-choose|PNG vs JPG vs AVIF: Which Image Format Should You Use? \| HEIC2PNG.site|PNG vs JPG vs AVIF: Which Image Format Should You Use? \| HEIC2PNG|Choose JPG, PNG or AVIF for converted HEIC photos by comparing upload compatibility, compression, transparency, quality and the limits of each workflow.|Choose JPG, PNG or AVIF for converted HEIC photos by comparing upload compatibility, compression, transparency, quality and the limits of each workflow.|Description retained; title brand suffix standardized.|
|/blog/heic-vs-png-quality-file-size-compatibility|HEIC vs PNG: Quality, File Size and Compatibility \| HEIC2PNG.site|HEIC vs PNG: Quality, File Size and Compatibility \| HEIC2PNG|Does HEIC to PNG reduce quality, and why is the PNG often larger? Understand lossless encoding, decoded pixels, color limits and practical format choices.|Does HEIC to PNG reduce quality, and why is the PNG often larger? Understand lossless encoding, decoded pixels, color limits and practical format choices.|Description retained; title brand suffix standardized.|
|/blog/how-to-convert-heic-images-for-website-uploads|How to Convert HEIC Images for Website Uploads \| HEIC2PNG.site|How to Convert HEIC Images for Website Uploads \| HEIC2PNG|Prepare HEIC photos for upload forms and website media libraries: choose an accepted format, meet dimensions and file-size limits, and verify the submitted image.|Prepare HEIC photos for upload forms and website media libraries: choose an accepted format, meet dimensions and file-size limits, and verify the submitted image.|Description retained; title brand suffix standardized.|
|/blog/how-to-convert-heic-to-jpg-on-iphone|How to Convert HEIC to JPG on iPhone \| HEIC2PNG.site|How to Convert HEIC to JPG on iPhone \| HEIC2PNG|Make a JPG copy of an existing iPhone HEIC photo, find the downloaded file, and understand why camera settings do not convert your older pictures.|Make a JPG copy of an existing iPhone HEIC photo, find the downloaded file, and understand why camera settings do not convert your older pictures.|Description retained; title brand suffix standardized.|
|/blog/how-to-convert-heic-to-jpg-without-losing-quality|HEIC to JPG Without Losing Quality: What Is Possible? \| HEIC2PNG.site|HEIC to JPG Without Losing Quality: What Is Possible? \| HEIC2PNG|Convert HEIC to JPG with fewer visible artifacts. Learn which quality settings matter, what JPEG cannot preserve, and when PNG is the better choice.|Convert HEIC to JPG with fewer visible artifacts. Learn which quality settings matter, what JPEG cannot preserve, and when PNG is the better choice.|Description retained; title brand suffix standardized.|
|/blog/how-to-convert-heic-to-png-on-mac|How to Convert HEIC to PNG on Mac \| HEIC2PNG.site|How to Convert HEIC to PNG on Mac \| HEIC2PNG|Export HEIC as PNG with Mac Preview or Photos, convert several images, and check dimensions, file size and color before sharing your new files.|Export HEIC as PNG with Mac Preview or Photos, convert several images, and check dimensions, file size and color before sharing your new files.|Description retained; title brand suffix standardized.|
|/blog/how-to-convert-heic-to-png-on-windows-11|How to Convert HEIC to PNG on Windows 11 \| HEIC2PNG.site|How to Convert HEIC to PNG on Windows 11 \| HEIC2PNG|Compare four tested ways to convert iPhone HEIC photos to lossless PNG on Windows 11—including browser batch conversion, Windows Photos Save As, and codec setup.|Convert HEIC to PNG on Windows 11 with browser tools and compatible Photos exports. Learn codec requirements, batch options and how to check the result.|Head-only description override; visible card/article unchanged.|
|/blog/how-to-fix-heic-files-that-wont-open|HEIC Not Supported? Fix Opening and Upload Errors \| HEIC2PNG.site|HEIC Not Supported? Fix Opening and Upload Errors \| HEIC2PNG|Diagnose unsupported HEIC messages, failed website uploads and incomplete files. Choose the right fix for codecs, format restrictions, size limits or damaged copies.|Diagnose unsupported HEIC messages, failed website uploads and incomplete files. Choose the right fix for codecs, format restrictions, size limits or damaged copies.|Description retained; title brand suffix standardized.|
|/blog/how-to-open-heic-files-on-windows-and-mac|How to Open HEIC Files on Windows 10 and Mac \| HEIC2PNG.site|How to Open HEIC Files on Windows 10 and Mac \| HEIC2PNG|Open HEIC photos on Windows 10 with supported Microsoft extensions, view them on Mac, or create a compatible copy when an app cannot read the original.|Open HEIC photos on Windows 10 with supported Microsoft extensions, view them on Mac, or create a compatible copy when an app cannot read the original.|Description retained; title brand suffix standardized.|
|/blog/why-does-my-iphone-save-photos-as-heic|Why iPhone Saves HEIC Photos and How to Turn It Off \| HEIC2PNG.site|Why iPhone Saves HEIC Photos and How to Turn It Off \| HEIC2PNG|Switch future iPhone camera photos from HEIC to JPG with Most Compatible, understand the storage tradeoff, and handle the HEIC pictures you already have.|Switch future iPhone camera photos from HEIC to JPG with Most Compatible, understand the storage tradeoff, and handle the HEIC pictures you already have.|Description retained; title brand suffix standardized.|

## Verification

- `npm run check`: passed application and worker TypeScript checks.
- `npm run build`: passed Astro content synchronization and static generation of 19 HTML pages.
- Direct inspection of **all 19 generated HTML documents**: exactly one non-empty title, one non-empty description and one absolute canonical per page; **zero duplicate titles and zero duplicate descriptions**.
- **18 indexable pages** and one `noindex,follow` error document remain. All indexable canonicals are still present in the sitemap.
- Open Graph title/description and Twitter title/description equal the actual page title/description on every document. og:url equals the canonical on every document. All Article JSON-LD descriptions and mainEntityOfPage values match the resolved description/canonical.
- **Zero meta keywords** tags found.
- All **19 page-body SHA-256 hashes are identical before and after**, using parsed/serialized body markup. This verifies no changes to visible headings, cards, article content, forms, tools, navigation, footer, ad state or body structure.
- All canonical values are identical before and after.
- Source SHA-256 comparison: only `src/pages/[...path].astro` changed within `src/`; the other **28 source files**, including converter/client/worker code, article Markdown, content schema and stylesheets, are unchanged.
- `npx playwright test tests/blog.spec.ts tests/site.spec.ts --grep 'blog|static routes|ad areas'`: **7 passed in 12.4 seconds**. These cover article metadata/schema and links, blog search/categories/pagination, static route SEO, preserved ad state, responsive structure and site navigation/contact behavior.
- Build preparation rewrites anchor whitespace in Markdown; those build-only source differences were removed after confirming the contents were otherwise identical. Article bodies/frontmatter were retained.
- The build emitted the existing outdated Browserslist-data notice; it did not prevent compilation. No dependency changes were made.
- Full image conversion tests were not repeated: converter code is unchanged. No live-site deployment or Search Console ranking/CTR validation is claimed.

The built results can be reviewed at [the local preview](http://127.0.0.1:4877/). Public production metadata will change only after a separately authorized deployment.

