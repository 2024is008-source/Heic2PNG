# Internal linking report

Date: 23 October 2026. Scope: all three converter pages, all ten published articles, and a crawl of every built HTML document. Changes are local; no deployment was performed.

## Outcome and approach

Added **11 contextual links** by wrapping existing words in existing explanatory paragraphs/list items: seven links from converter content to guides, three Windows 11 article links to supporting articles, and one relevant AVIF tool link from the PNG comparison article. Visible wording, heading hierarchy and existing sections are unchanged.

The published articles already contained relevant PNG/JPG tool links and a useful related-article network. Those links were retained rather than adding repetitive exact-match anchors. Direct article HTML links now target the preferred trailing-slash page URLs. Existing converter prose anchors are normalized where they are already HTML anchors; shared navigation and prototype-generated navigation/CTA aliases remain functional and unchanged. No global menu entries, sections or additional cards were added.

New anchors reuse the site's existing indigo, semibold, underlined link classes. No stylesheet, responsive layout, client conversion script, worker, encoder, image asset or metadata implementation changed in this task. The converter content module adds links only inside explanatory text after its existing editorial pass; converter controls and event hooks are untouched.

No unpublished pages were invented or linked. In particular, the draft HEIC-versus-AVIF article remains unpublished; the existing published format-choice article supplies the AVIF explanation.

## Topic and intent map

Paths in this report are relative to https://heic2png.site. The table lists links in explanatory paragraphs/list items; existing header/footer navigation, tool buttons and article sidebars remain available separately.

| Source page | Contextual tool destinations | Contextual guide destinations |
| --- | --- | --- |
| / | Existing tool CTAs retained | /blog/heic-vs-png-quality-file-size-compatibility/, /blog/how-to-convert-heic-images-for-website-uploads/ |
| /blog/heic-to-jpg-vs-png-which-format-should-you-choose/ | /heic-to-jpg/, /, /heic-to-avif/ | /blog/how-to-convert-heic-to-jpg-without-losing-quality/, /blog/heic-vs-png-quality-file-size-compatibility/, /blog/how-to-convert-heic-images-for-website-uploads/ |
| /blog/heic-vs-png-quality-file-size-compatibility/ | /heic-to-avif/, /, /heic-to-jpg/ | /blog/heic-to-jpg-vs-png-which-format-should-you-choose/, /blog/how-to-convert-heic-to-png-on-mac/ |
| /blog/how-to-convert-heic-images-for-website-uploads/ | /heic-to-jpg/, /, /heic-to-avif/ | /blog/heic-to-jpg-vs-png-which-format-should-you-choose/, /blog/how-to-convert-heic-to-jpg-on-iphone/, /blog/how-to-convert-heic-to-png-on-mac/, /blog/heic-vs-png-quality-file-size-compatibility/, /blog/how-to-fix-heic-files-that-wont-open/ |
| /blog/how-to-convert-heic-to-jpg-on-iphone/ | /heic-to-jpg/ | /blog/how-to-convert-heic-images-for-website-uploads/, /blog/how-to-convert-heic-to-jpg-without-losing-quality/, /blog/why-does-my-iphone-save-photos-as-heic/ |
| /blog/how-to-convert-heic-to-jpg-without-losing-quality/ | /, /heic-to-jpg/ | /blog/how-to-convert-heic-images-for-website-uploads/, /blog/heic-to-jpg-vs-png-which-format-should-you-choose/, /blog/heic-vs-png-quality-file-size-compatibility/ |
| /blog/how-to-convert-heic-to-png-on-mac/ | /, /heic-to-jpg/ | /blog/heic-vs-png-quality-file-size-compatibility/, /blog/how-to-fix-heic-files-that-wont-open/, /blog/heic-to-jpg-vs-png-which-format-should-you-choose/ |
| /blog/how-to-convert-heic-to-png-on-windows-11/ | /, /heic-to-jpg/ | /blog/how-to-open-heic-files-on-windows-and-mac/, /blog/how-to-fix-heic-files-that-wont-open/, /blog/how-to-convert-heic-images-for-website-uploads/ |
| /blog/how-to-fix-heic-files-that-wont-open/ | /heic-to-jpg/, /, /heic-to-avif/ | /blog/how-to-open-heic-files-on-windows-and-mac/, /blog/how-to-convert-heic-images-for-website-uploads/ |
| /blog/how-to-open-heic-files-on-windows-and-mac/ | /heic-to-jpg/, / | /blog/how-to-convert-heic-to-png-on-mac/, /blog/how-to-fix-heic-files-that-wont-open/, /blog/how-to-convert-heic-to-png-on-windows-11/ |
| /blog/why-does-my-iphone-save-photos-as-heic/ | /heic-to-jpg/, / | /blog/how-to-convert-heic-to-jpg-on-iphone/, /blog/how-to-fix-heic-files-that-wont-open/ |
| /heic-to-avif/ | /, /heic-to-jpg | /blog/heic-to-jpg-vs-png-which-format-should-you-choose/, /blog/how-to-convert-heic-images-for-website-uploads/ |
| /heic-to-jpg/ | Existing tool CTAs retained | /blog/how-to-convert-heic-to-jpg-without-losing-quality/, /blog/how-to-open-heic-files-on-windows-and-mac/, /blog/why-does-my-iphone-save-photos-as-heic/ |

The PNG tutorials/comparison continue linking to the homepage tool. JPG tutorials continue linking to /heic-to-jpg/. AVIF links occur where the prose discusses actual AVIF support or output choices; AVIF links were not forced into unrelated platform tutorials.

## New links implemented

| Source page | Destination | Anchor text | Reason |
| --- | --- | --- | --- |
| /blog/heic-vs-png-quality-file-size-compatibility/ | /heic-to-avif/ | AVIF may be worth comparing | Try AVIF only in a workflow that accepts the format. |
| /blog/how-to-convert-heic-to-png-on-windows-11/ | /blog/how-to-open-heic-files-on-windows-and-mac/ | HEIF/HEVC extensions | Review platform viewing support and extension requirements. |
| /blog/how-to-convert-heic-to-png-on-windows-11/ | /blog/how-to-fix-heic-files-that-wont-open/ | incomplete iCloud placeholder file | Diagnose unsupported, incomplete or failed HEIC files. |
| /blog/how-to-convert-heic-to-png-on-windows-11/ | /blog/how-to-convert-heic-images-for-website-uploads/ | strict 5 MB file limit | Check accepted types, dimensions, file size and upload results. |
| /heic-to-avif/ | /blog/heic-to-jpg-vs-png-which-format-should-you-choose/ | a destination that accepts AVIF | Compare JPG, PNG and AVIF against destination requirements. |
| /heic-to-avif/ | /blog/how-to-convert-heic-images-for-website-uploads/ | Check the destination | Check accepted types, dimensions, file size and upload results. |
| /heic-to-jpg/ | /blog/how-to-convert-heic-to-jpg-without-losing-quality/ | JPEG quality trades file size against visible detail | Explain JPEG compression settings and quality limitations. |
| /heic-to-jpg/ | /blog/how-to-open-heic-files-on-windows-and-mac/ | HEIF/HEVC extension requirements | Review platform viewing support and extension requirements. |
| /heic-to-jpg/ | /blog/why-does-my-iphone-save-photos-as-heic/ | changes future iPhone captures | Distinguish future capture settings from converting existing photos. |
| / | /blog/heic-vs-png-quality-file-size-compatibility/ | lossless image compression | Explain PNG lossless encoding, file size and source limitations. |
| / | /blog/how-to-convert-heic-images-for-website-uploads/ | format, size and crop requirements | Check accepted types, dimensions, file size and upload results. |

## Existing useful contextual links retained

These links were already useful. Their destinations were normalized to preferred trailing-slash URLs where needed, while their natural anchor wording was retained.

| Source page | Destination | Anchor text | Reason |
| --- | --- | --- | --- |
| /blog/heic-to-jpg-vs-png-which-format-should-you-choose/ | /heic-to-jpg/ | HEIC to JPG | Create a JPEG delivery copy when the destination accepts it. |
| /blog/heic-to-jpg-vs-png-which-format-should-you-choose/ | /blog/how-to-convert-heic-to-jpg-without-losing-quality/ | The JPEG quality guide | Explain JPEG compression settings and quality limitations. |
| /blog/heic-to-jpg-vs-png-which-format-should-you-choose/ | / | HEIC to PNG | Create the PNG copy described in the workflow. |
| /blog/heic-to-jpg-vs-png-which-format-should-you-choose/ | /blog/heic-vs-png-quality-file-size-compatibility/ | HEIC vs PNG quality and file size | Explain PNG lossless encoding, file size and source limitations. |
| /blog/heic-to-jpg-vs-png-which-format-should-you-choose/ | /heic-to-avif/ | HEIC to AVIF converter | Try AVIF only in a workflow that accepts the format. |
| /blog/heic-to-jpg-vs-png-which-format-should-you-choose/ | /blog/how-to-convert-heic-images-for-website-uploads/ | The website upload guide | Check accepted types, dimensions, file size and upload results. |
| /blog/heic-vs-png-quality-file-size-compatibility/ | /blog/heic-to-jpg-vs-png-which-format-should-you-choose/ | the JPG, PNG and AVIF decision guide | Compare JPG, PNG and AVIF against destination requirements. |
| /blog/heic-vs-png-quality-file-size-compatibility/ | / | HEIC to PNG converter | Create the PNG copy described in the workflow. |
| /blog/heic-vs-png-quality-file-size-compatibility/ | /heic-to-jpg/ | export a JPEG copy | Create a JPEG delivery copy when the destination accepts it. |
| /blog/heic-vs-png-quality-file-size-compatibility/ | /blog/how-to-convert-heic-to-png-on-mac/ | convert with Preview or Photos | Follow native Mac PNG export steps in Preview or Photos. |
| /blog/how-to-convert-heic-images-for-website-uploads/ | /heic-to-jpg/ | HEIC to JPG | Create a JPEG delivery copy when the destination accepts it. |
| /blog/how-to-convert-heic-images-for-website-uploads/ | / | HEIC to PNG | Create the PNG copy described in the workflow. |
| /blog/how-to-convert-heic-images-for-website-uploads/ | /heic-to-avif/ | HEIC to AVIF | Try AVIF only in a workflow that accepts the format. |
| /blog/how-to-convert-heic-images-for-website-uploads/ | /blog/heic-to-jpg-vs-png-which-format-should-you-choose/ | The format comparison guide | Compare JPG, PNG and AVIF against destination requirements. |
| /blog/how-to-convert-heic-images-for-website-uploads/ | /blog/how-to-convert-heic-to-jpg-on-iphone/ | The iPhone JPG guide | Follow the iPhone conversion/download-selection workflow. |
| /blog/how-to-convert-heic-images-for-website-uploads/ | /blog/how-to-convert-heic-to-png-on-mac/ | Preview and Photos export | Follow native Mac PNG export steps in Preview or Photos. |
| /blog/how-to-convert-heic-images-for-website-uploads/ | /blog/heic-vs-png-quality-file-size-compatibility/ | Why PNGs often become larger after HEIC conversion | Explain PNG lossless encoding, file size and source limitations. |
| /blog/how-to-convert-heic-images-for-website-uploads/ | /blog/how-to-fix-heic-files-that-wont-open/ | The unsupported HEIC troubleshooting guide | Diagnose unsupported, incomplete or failed HEIC files. |
| /blog/how-to-convert-heic-to-jpg-on-iphone/ | /heic-to-jpg/ | HEIC to JPG converter | Create a JPEG delivery copy when the destination accepts it. |
| /blog/how-to-convert-heic-to-jpg-on-iphone/ | /blog/how-to-convert-heic-images-for-website-uploads/ | This upload checklist | Check accepted types, dimensions, file size and upload results. |
| /blog/how-to-convert-heic-to-jpg-on-iphone/ | /blog/how-to-convert-heic-to-jpg-without-losing-quality/ | the HEIC to JPG quality guide | Explain JPEG compression settings and quality limitations. |
| /blog/how-to-convert-heic-to-jpg-on-iphone/ | /blog/why-does-my-iphone-save-photos-as-heic/ | the guide to turning off HEIC captures | Distinguish future capture settings from converting existing photos. |
| /blog/how-to-convert-heic-to-jpg-without-losing-quality/ | / | HEIC to PNG | Create the PNG copy described in the workflow. |
| /blog/how-to-convert-heic-to-jpg-without-losing-quality/ | /heic-to-jpg/ | HEIC to JPG converter | Create a JPEG delivery copy when the destination accepts it. |
| /blog/how-to-convert-heic-to-jpg-without-losing-quality/ | /blog/how-to-convert-heic-images-for-website-uploads/ | the website upload workflow | Check accepted types, dimensions, file size and upload results. |
| /blog/how-to-convert-heic-to-jpg-without-losing-quality/ | /blog/heic-to-jpg-vs-png-which-format-should-you-choose/ | PNG vs JPG vs AVIF | Compare JPG, PNG and AVIF against destination requirements. |
| /blog/how-to-convert-heic-to-jpg-without-losing-quality/ | /blog/heic-vs-png-quality-file-size-compatibility/ | HEIC vs PNG quality and file size | Explain PNG lossless encoding, file size and source limitations. |
| /blog/how-to-convert-heic-to-png-on-mac/ | / | HEIC to PNG converter | Create the PNG copy described in the workflow. |
| /blog/how-to-convert-heic-to-png-on-mac/ | /blog/heic-vs-png-quality-file-size-compatibility/ | why converted PNGs can be much larger | Explain PNG lossless encoding, file size and source limitations. |
| /blog/how-to-convert-heic-to-png-on-mac/ | /heic-to-jpg/ | JPG output | Create a JPEG delivery copy when the destination accepts it. |
| /blog/how-to-convert-heic-to-png-on-mac/ | /blog/how-to-fix-heic-files-that-wont-open/ | HEIC troubleshooting guide | Diagnose unsupported, incomplete or failed HEIC files. |
| /blog/how-to-convert-heic-to-png-on-mac/ | /blog/heic-to-jpg-vs-png-which-format-should-you-choose/ | JPG, PNG and AVIF | Compare JPG, PNG and AVIF against destination requirements. |
| /blog/how-to-convert-heic-to-png-on-windows-11/ | / | HEIC to PNG Converter | Create the PNG copy described in the workflow. |
| /blog/how-to-convert-heic-to-png-on-windows-11/ | /heic-to-jpg/ | HEIC to JPG converter | Create a JPEG delivery copy when the destination accepts it. |
| /blog/how-to-fix-heic-files-that-wont-open/ | /blog/how-to-open-heic-files-on-windows-and-mac/ | The Windows and Mac opening guide | Review platform viewing support and extension requirements. |
| /blog/how-to-fix-heic-files-that-wont-open/ | /heic-to-jpg/ | HEIC to JPG | Create a JPEG delivery copy when the destination accepts it. |
| /blog/how-to-fix-heic-files-that-wont-open/ | / | HEIC to PNG | Create the PNG copy described in the workflow. |
| /blog/how-to-fix-heic-files-that-wont-open/ | /heic-to-avif/ | HEIC to AVIF | Try AVIF only in a workflow that accepts the format. |
| /blog/how-to-fix-heic-files-that-wont-open/ | /blog/how-to-convert-heic-images-for-website-uploads/ | the upload preparation guide | Check accepted types, dimensions, file size and upload results. |
| /blog/how-to-open-heic-files-on-windows-and-mac/ | /blog/how-to-convert-heic-to-png-on-mac/ | the Mac HEIC to PNG guide | Follow native Mac PNG export steps in Preview or Photos. |
| /blog/how-to-open-heic-files-on-windows-and-mac/ | /heic-to-jpg/ | HEIC to JPG | Create a JPEG delivery copy when the destination accepts it. |
| /blog/how-to-open-heic-files-on-windows-and-mac/ | / | HEIC to PNG | Create the PNG copy described in the workflow. |
| /blog/how-to-open-heic-files-on-windows-and-mac/ | /blog/how-to-fix-heic-files-that-wont-open/ | the HEIC error checklist | Diagnose unsupported, incomplete or failed HEIC files. |
| /blog/how-to-open-heic-files-on-windows-and-mac/ | /blog/how-to-convert-heic-to-png-on-windows-11/ | the existing Windows 11 guide | Follow the Windows 11 PNG conversion workflow. |
| /blog/why-does-my-iphone-save-photos-as-heic/ | /heic-to-jpg/ | HEIC to JPG converter | Create a JPEG delivery copy when the destination accepts it. |
| /blog/why-does-my-iphone-save-photos-as-heic/ | /blog/how-to-convert-heic-to-jpg-on-iphone/ | The iPhone conversion guide | Follow the iPhone conversion/download-selection workflow. |
| /blog/why-does-my-iphone-save-photos-as-heic/ | / | HEIC to PNG | Create the PNG copy described in the workflow. |
| /blog/why-does-my-iphone-save-photos-as-heic/ | /blog/how-to-fix-heic-files-that-wont-open/ | the HEIC error guide | Diagnose unsupported, incomplete or failed HEIC files. |
| /heic-to-avif/ | / | HEIC to PNG | Create the PNG copy described in the workflow. |
| /heic-to-avif/ | /heic-to-jpg | HEIC to JPG | Continue the related conversion workflow. |

## Broken links, orphan pages and repetition

- Scanned **19 built HTML documents**: 18 indexable pages plus the custom error page.
- Validated **840 local anchor references**, including shared menus, sidebars, tool links, category queries and table-of-contents fragments.
- **Zero broken local destinations** and **zero missing fragment IDs** found.
- **Zero orphan indexable pages**: every indexable page has at least one link from another indexable page. All 18 are reachable by following links from the homepage; self-links and the error page are excluded from that graph.
- All ten published articles were already discoverable from the blog archive before this change. The new contextual links improve topic connections rather than claiming to repair nonexistent orphans.
- No repeated destination was found within an individual paragraph or list item.
- Repeated links across header, mobile menu, footer, article sidebar, contextual steps and conversion CTAs serve different navigation/actions and were retained. The Windows article's sidebar CTA, in-article CTA and numbered conversion step intentionally lead to the same PNG tool; removing those would change the established interface.
- Repetition between related-article sidebars and a relevant contextual citation is also intentional. No unnecessary duplicate prose links were added.
- Three draft slugs remain excluded and return 404/noindex: what-is-a-heic-file-beginners-guide, heic-vs-avif-whats-the-difference, how-to-convert-multiple-heic-photos-at-once.

## Build and local validation

- npm run check: passed.
- npm run build: passed; generated all 19 HTML pages and sitemap.xml.
- Generated-HTML checks resolved every local anchor to an existing built page/file and checked fragments against destination IDs. The crawl also checked incoming links and homepage reachability.
- HTTP validation of all **34 distinct linked path/query combinations** returned 200 using the local production-build server at http://127.0.0.1:4876. Fragment validity was checked separately in HTML; fragments are not sent in HTTP requests.
- Focused Playwright run: **11 passed (1.2 minutes)**. Coverage includes published article links/metadata, unpublished exclusions, archive search/navigation, responsive article structure, canonical aliases, converter heading/FAQ hooks and site navigation.
- External third-party destinations were outside this internal-link task.

## Files changed in this task

- src/content/blog/heic-to-jpg-vs-png-which-format-should-you-choose.md
- src/content/blog/heic-vs-png-quality-file-size-compatibility.md
- src/content/blog/how-to-convert-heic-images-for-website-uploads.md
- src/content/blog/how-to-convert-heic-to-jpg-on-iphone.md
- src/content/blog/how-to-convert-heic-to-jpg-without-losing-quality.md
- src/content/blog/how-to-convert-heic-to-png-on-mac.md
- src/content/blog/how-to-convert-heic-to-png-on-windows-11.md
- src/content/blog/how-to-fix-heic-files-that-wont-open.md
- src/content/blog/how-to-open-heic-files-on-windows-and-mac.md
- src/content/blog/why-does-my-iphone-save-photos-as-heic.md
- src/lib/converter-content.mjs
- tests/blog.spec.ts: related-article assertion accepts the preferred trailing slash without changing the expected published article identities.
- INTERNAL_LINKING_REPORT.md: this report.

Other changes already present in the workspace were preserved. No server configuration, deployment or conversion behavior was changed.

