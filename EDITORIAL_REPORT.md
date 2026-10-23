# Blog editorial report — October 23, 2026

Nine substantive articles are enabled in the existing Astro collection: three new files and six previously empty drafts completed at their existing slugs. Together with the existing Windows 11 guide, the blog has ten published articles. Three unfinished drafts remain unpublished. Production deployment and GitHub push are outside this change.

## Article inventory and keyword map

Article links below open the local production preview. Their paths are the slugs used by the canonical https://heic2png.site URLs after deployment.

Word counts cover the introduction, section headings and article content, including FAQs and source labels; they exclude navigation, sidebar, diagram, advertisements and author boilerplate. Reading time is rounded up at 220 words per minute. These are editorial estimates, not reading benchmarks.

|Status|Title and route|Category|Primary keyword|Secondary keywords|Words|
|---|---|---|---|---|---|
|Completed draft|[HEIC Not Supported? Fix Opening and Upload Errors](http://127.0.0.1:4877/blog/how-to-fix-heic-files-that-wont-open)|Troubleshooting|HEIC not supported|HEIC upload error; HEIC files won’t open; unsupported image type|1104|
|Completed draft|[HEIC vs PNG: Quality, File Size and Compatibility](http://127.0.0.1:4877/blog/heic-vs-png-quality-file-size-compatibility)|Image Formats|HEIC vs PNG|does HEIC to PNG reduce quality; why PNG larger than HEIC; lossless HEIC conversion|1072|
|Completed draft|[PNG vs JPG vs AVIF: Which Image Format Should You Use?](http://127.0.0.1:4877/blog/heic-to-jpg-vs-png-which-format-should-you-choose)|Image Formats|PNG vs JPG vs AVIF|HEIC output format; JPG or PNG; AVIF compatibility|1088|
|New file|[How to Convert HEIC Images for Website Uploads](http://127.0.0.1:4877/blog/how-to-convert-heic-images-for-website-uploads)|Tutorials|convert HEIC for website upload|HEIC website upload; image upload size limit; convert iPhone photos for forms|1108|
|Completed draft|[How to Open HEIC Files on Windows 10 and Mac](http://127.0.0.1:4877/blog/how-to-open-heic-files-on-windows-and-mac)|HEIC Guides|open HEIC files on Windows 10|HEIC Windows extensions; open HEIC on Mac; HEIC viewer|1043|
|Completed draft|[How to Convert HEIC to JPG on iPhone](http://127.0.0.1:4877/blog/how-to-convert-heic-to-jpg-on-iphone)|iPhone Photos|convert HEIC to JPG on iPhone|change HEIC to JPG iPhone; iPhone photo JPEG; existing HEIC conversion|1076|
|Completed draft|[Why iPhone Saves HEIC Photos and How to Turn It Off](http://127.0.0.1:4877/blog/why-does-my-iphone-save-photos-as-heic)|iPhone Photos|turn off HEIC on iPhone|iPhone Most Compatible; why iPhone saves HEIC; iPhone camera JPG setting|934|
|New file|[HEIC to JPG Without Losing Quality: What Is Possible?](http://127.0.0.1:4877/blog/how-to-convert-heic-to-jpg-without-losing-quality)|Tutorials|HEIC to JPG without losing quality|high quality HEIC to JPG; JPEG compression; HEIC photo resolution|1096|
|New file|[How to Convert HEIC to PNG on Mac](http://127.0.0.1:4877/blog/how-to-convert-heic-to-png-on-mac)|Tutorials|convert HEIC to PNG on Mac|Preview HEIC export; Mac PNG conversion; batch HEIC on Mac|1193|

## Consolidation decisions

- Windows 10 opening instructions complete the existing Windows-and-Mac draft; there is no competing Windows 10 page. The previously published Windows 11 conversion guide retains its title, dates, description and body.
- “Change HEIC to JPG on iPhone” completes the existing iPhone JPG draft.
- “Turn off HEIC” is incorporated into the existing why-iPhone-uses-HEIC draft. This page covers future capture; the separate iPhone conversion page covers existing files.
- Unsupported uploads complete the existing troubleshooting draft. The new website-upload guide covers preparation and submission, and points to troubleshooting for failures.
- PNG quality and larger-file questions are combined in the existing HEIC-versus-PNG draft, avoiding two overlapping pages.
- JPG/PNG/AVIF choice completes and expands the existing output-choice draft. Its established slug is preserved.
- Beginner HEIC, HEIC-versus-AVIF, and general batch-conversion drafts are retained unchanged and unpublished; none is linked as a published related guide.

## Integration and changed files

- Ten Markdown files in src/content/blog/: the nine listed above plus related links in the existing Windows 11 guide.
- tests/site.spec.ts updates the old one-article assumptions; tests/blog.spec.ts verifies the expanded collection, metadata, links and browsing behavior.
- EDITORIAL_REPORT.md records keywords, topic decisions, research and validation.
- Cards, category filtering, search, pagination, routes, canonicals, Article JSON-LD and sitemap already derive from the content collection. They require no application-code edits. src/design/article-catalog.json is an unused extraction artifact and is intentionally unchanged.
- Existing HTML article structure, classes, fonts, layout, header/footer and all three ad locations are reused. Each article retains one H1 and matching mobile/desktop TOCs. No converter, stylesheet, ad code, schema or framework change is needed.
- Every completed article links to working converters and three published related guides. Contextual links connect iPhone capture to conversion, format choice to quality/file size, upload preparation to error diagnosis, and platform opening to native export.

## Research and editorial limits

Reviewed official sources on October 23, 2026:

- [Apple: HEIF capture, compatibility, sharing and conversion](https://support.apple.com/en-us/116944)
- [Apple: Preview image conversion](https://support.apple.com/guide/preview/convert-image-file-types-prvw1012/mac)
- [Apple: Photos export controls](https://support.apple.com/guide/photos/export-photos-videos-and-slideshows-pht6e157c5f/mac)
- [Apple: model-dependent camera settings](https://support.apple.com/en-ie/guide/iphone/iphb362b394e/ios)
- [Microsoft: Windows 10 Photos HEIF/HEVC guidance](https://support.microsoft.com/en-us/windows/apps/photos/photos-app-video-editor-error-can-t-view-this-file-type) — explicitly identified as version-dependent, including its Video Editor context; no fixed Store price is promised.
- [Microsoft: Windows 10 servicing](https://learn.microsoft.com/en-us/windows/release-health/release-information)
- [W3C: PNG specification](https://www.w3.org/TR/png-3/)
- [MDN: image file format guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types)
- [Google web.dev: AVIF](https://web.dev/learn/images/avif/) — capability overview; no historical browser-support table or universal savings reused.

Converter-specific statements were checked against the current client and worker implementation. The copy distinguishes lossless output encoding from whole-source preservation; JPEG quality from resolution; and browser rendering from server upload acceptance. It explicitly describes this converter's 8-bit RGB, stripped EXIF, source ICC/HDR and auxiliary-layer limits. There are no invented benchmarks, hands-on OS tests, personal experiences, screenshots or licensed-stock claims. Existing abstract workflow diagrams are adapted with descriptive accessible labels; no new photo assets or fake image metadata are introduced.

First publication and update dates for the nine completed articles are 2026-10-23. Older draft-placeholder dates are replaced with the actual publication date. The existing published guide's metadata remains unchanged.

Platform menus vary by installed version. Source review verifies the written instructions; it is not a claim of executing them on physical Windows 10, Mac or iPhone devices. A future editorial review should recheck platform menus and accepted-format guidance as software evolves. Source HEICs should remain the archive; no perfect HDR/ICC/EXIF preservation is claimed.

The pre-existing Windows 11 featured card includes historical testing and color wording. Those claims were not independently established in this content task; its unrelated copy is preserved under the requested scope and remains a separate editorial review item. The nine completed articles do not claim native-device testing.

## Validation

- `npm run build`: passed. Astro content schema synchronization succeeded; the static build generated 19 HTML pages, including all ten published article routes, plus the sitemap endpoint.
- `npm run check`: passed both application and worker TypeScript checks.
- `npm test`: final completed run passed **14/14 tests in 1.4 minutes**, including all existing PNG/JPG/AVIF conversion tests and four new blog tests.
- Blog checks cover unique slugs/titles/descriptions, permitted frontmatter keys, content depth, visible author, one H1, canonical/Open Graph/Article JSON-LD fields and dates, accessible workflow labels, matching mobile/desktop TOCs, preserved three ad positions, three published related guides, and every internal article link and fragment.
- Listing checks cover ten cards, six/four pagination, all five existing categories, exact-title search for every article, and Read Guide navigation. Three remaining drafts return 404 and are absent from the sitemap.
- Responsive browser checks passed at 1280 px and 375 px without horizontal overflow. Five production-preview screenshots were captured; listing, desktop header/body/sidebar, and mobile header/body were visually inspected. The author-line issue found during inspection was corrected and covered by an automated assertion.
- `git diff --check`: passed. The generated stylesheet has no diff. Converter code, shared article/page rendering, content schema, navigation/footer, catalog, ad code and original approved HTML are unchanged. The original HTML SHA-256 remains `901DC094BDF66FA8B7691F06E8C81790183DDF2EC6A3BED0ECF5A1DD10602C45`.
- Initial test-authoring failures were corrected (an image-label selector matched the site logo, and link validation included the intentional 404 footer route). One intermediate run was interrupted by rebuilding the test server's output directory; the final run used the completed build and passed without that interruption.
- The build reports an existing outdated Browserslist data notice. It does not prevent compilation; dependency changes are outside this content-only task.

Local preview: [blog](http://127.0.0.1:4877/blog). No VPS deployment, GitHub push or commit was performed.
