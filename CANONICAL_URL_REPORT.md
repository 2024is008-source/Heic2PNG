# Canonical URL and duplicate-content audit

23 October 2026. Application fixes are local and verified against the production build. Nothing was deployed. No VPS configuration was edited and Nginx was not reloaded. No configuration belonging to tiksavemp4.online was read or changed.

## Findings and application changes

| Finding | Before | After | Files |
| --- | --- | --- | --- |
| Implicit slash policy | Directory output with slashless canonical identities | Explicit trailingSlash: always; same directory output | astro.config.mjs |
| Repeated URL construction | Template and sitemap constructed URLs separately | Shared fixed HTTPS/non-www origin and page canonical helper | src/lib/urls.mjs, src/pages/[...path].astro, src/pages/sitemap.xml.ts |
| Inconsistent preferred URL structure | Example: https://heic2png.site/heic-to-jpg | https://heic2png.site/heic-to-jpg/; homepage remains https://heic2png.site/ | Same files |
| Query and index aliases | Multiple aliases serve the same page | Canonical helper excludes query/fragment, normalizes terminal index.html and trailing slash, and forces preferred origin | src/lib/urls.mjs, tests/canonical.spec.ts |
| Error output with explicit slash policy | Catch-all error route would move 404.html into a directory | Dedicated 404.astro reuses the existing template, retaining dist/404.html and noindex | src/pages/404.astro, src/pages/[...path].astro |
| Canonical test expectations | Slashless assertions | Trailing-slash assertions plus all indexable alias/query checks | tests/blog.spec.ts, tests/site.spec.ts, tests/canonical.spec.ts |

All 18 indexable pages emit exactly one absolute self-canonical. Open Graph URL, Article mainEntityOfPage and breadcrumb URLs agree. Sitemap membership exactly equals the set of indexable canonical URLs. Queries, fragments, errors and drafts are excluded. robots.txt already identifies the correct sitemap endpoint and was left unchanged.

All 19 existing titles and descriptions remain unchanged; the 18 indexable titles/descriptions were already unique. No meta keywords were added. All 19 generated body HTML hashes match the pre-change build, including the custom error page. CSS, client code, workers, encoder, converter content and the existing deploy/heic2png.site.conf are byte-for-byte unchanged from the start of this task.

Existing internal links and route slugs remain intact. Slashless inbound URLs and directory-index aliases resolve locally. The separate Nginx proposal redirects those aliases permanently; no article or valid route was removed.

## Indexable pages checked

Each URL below was verified in generated HTML and sitemap, with one matching canonical/OG URL, unique title/description and no noindex directive.

| Preferred absolute canonical | Existing title retained |
| --- | --- |
| https://heic2png.site/ | HEIC to PNG Converter – Free Online | HEIC2PNG |
| https://heic2png.site/about/ | About Our HEIC Image Converters | HEIC2PNG |
| https://heic2png.site/blog/ | HEIC Conversion Guides – PNG, JPG & AVIF | HEIC2PNG |
| https://heic2png.site/blog/heic-to-jpg-vs-png-which-format-should-you-choose/ | PNG vs JPG vs AVIF: Which Image Format Should You Use? | HEIC2PNG |
| https://heic2png.site/blog/heic-vs-png-quality-file-size-compatibility/ | HEIC vs PNG: Quality, File Size and Compatibility | HEIC2PNG |
| https://heic2png.site/blog/how-to-convert-heic-images-for-website-uploads/ | How to Convert HEIC Images for Website Uploads | HEIC2PNG |
| https://heic2png.site/blog/how-to-convert-heic-to-jpg-on-iphone/ | How to Convert HEIC to JPG on iPhone | HEIC2PNG |
| https://heic2png.site/blog/how-to-convert-heic-to-jpg-without-losing-quality/ | HEIC to JPG Without Losing Quality: What Is Possible? | HEIC2PNG |
| https://heic2png.site/blog/how-to-convert-heic-to-png-on-mac/ | How to Convert HEIC to PNG on Mac | HEIC2PNG |
| https://heic2png.site/blog/how-to-convert-heic-to-png-on-windows-11/ | How to Convert HEIC to PNG on Windows 11 | HEIC2PNG |
| https://heic2png.site/blog/how-to-fix-heic-files-that-wont-open/ | HEIC Not Supported? Fix Opening and Upload Errors | HEIC2PNG |
| https://heic2png.site/blog/how-to-open-heic-files-on-windows-and-mac/ | How to Open HEIC Files on Windows 10 and Mac | HEIC2PNG |
| https://heic2png.site/blog/why-does-my-iphone-save-photos-as-heic/ | Why iPhone Saves HEIC Photos and How to Turn It Off | HEIC2PNG |
| https://heic2png.site/contact/ | Contact Support & Report Issues | HEIC2PNG |
| https://heic2png.site/heic-to-avif/ | HEIC to AVIF Converter – Free Online | HEIC2PNG |
| https://heic2png.site/heic-to-jpg/ | HEIC to JPG Converter – Free Online | HEIC2PNG |
| https://heic2png.site/privacy/ | Privacy Policy – Image Conversion & Site Data | HEIC2PNG |
| https://heic2png.site/terms/ | Terms of Service | HEIC2PNG |

## Duplicate-content and search-intent assessment

- No duplicate titles, descriptions or canonical identities among 18 indexable pages. All ten published article content bodies are distinct after excluding shared site chrome.
- PNG, JPG and AVIF converter pages offer distinct outputs despite shared interface structure. Keep each self-canonical.
- Mac PNG and Windows 11 PNG tutorials answer different platform workflows; retain both.
- Windows/Mac viewing versus HEIC error troubleshooting has partial overlap, but successful software setup/viewing and diagnosing failed opening/uploads remain different tasks. Retain their current focus.
- Format-choice article compares JPG/PNG/AVIF delivery choices; HEIC-versus-PNG explains source/output quality and size. These are related, distinct answers.
- iPhone JPG tutorial converts existing pictures; iPhone camera-setting article changes future capture; JPEG-quality article explains lossy export limits. Retain all three.
- Upload preparation and error troubleshooting overlap on rejected uploads. Their preparation/checklist versus diagnosis framing is meaningful. No merge or cross-canonical is justified by this inspection.
- Blog category/search filters operate on one archive. Parameter variants canonicalize to /blog/; they are not separate indexable topic pages.
- Actual ranking cannibalization requires Search Console query/page evidence, which was not available. Related topics alone do not establish cannibalization.
- Three drafts stay 404/noindex: what-is-a-heic-file-beginners-guide, heic-vs-avif-whats-the-difference, how-to-convert-multiple-heic-photos-at-once.
- Error responses remain noindex,follow and absent from sitemap. Unique, indexable pages should not canonicalize to other articles.

## Verification results

- npm run check: passed.
- npm run build: passed; 19 HTML documents including dist/404.html, plus sitemap.xml.
- npx playwright test tests/canonical.spec.ts tests/blog.spec.ts tests/site.spec.ts --grep 'canonical|sitemap|blog|ad areas': **9 passed**.
- 18 indexable canonical identities equal the sitemap set; all ten Article mainEntityOfPage values and all breadcrumb URLs match the slash policy.
- 71 distinct local page/alias/query URLs below returned 200 with the same single canonical/OG identity as their preferred page.
- Four missing/draft URLs returned 404/noindex. Existing tests also passed blog links, archive filtering/navigation and responsive article structure.
- git diff --check: passed; Git line-ending notices only.
- Local tests verify static content identity, not Nginx 301 behavior. No nginx -t, server installation, origin TLS inspection, reload or Cloudflare account change was performed.

## Exact local URLs checked

The server at port 4876 served the final production build.

```text
http://127.0.0.1:4876/
http://127.0.0.1:4876/index.html
http://127.0.0.1:4876/?utm_source=audit&q=PNG
http://127.0.0.1:4876/about/
http://127.0.0.1:4876/about
http://127.0.0.1:4876/about/index.html
http://127.0.0.1:4876/about/?utm_source=audit&q=PNG
http://127.0.0.1:4876/blog/
http://127.0.0.1:4876/blog
http://127.0.0.1:4876/blog/index.html
http://127.0.0.1:4876/blog/?utm_source=audit&q=PNG
http://127.0.0.1:4876/blog/heic-to-jpg-vs-png-which-format-should-you-choose/
http://127.0.0.1:4876/blog/heic-to-jpg-vs-png-which-format-should-you-choose
http://127.0.0.1:4876/blog/heic-to-jpg-vs-png-which-format-should-you-choose/index.html
http://127.0.0.1:4876/blog/heic-to-jpg-vs-png-which-format-should-you-choose/?utm_source=audit&q=PNG
http://127.0.0.1:4876/blog/heic-vs-png-quality-file-size-compatibility/
http://127.0.0.1:4876/blog/heic-vs-png-quality-file-size-compatibility
http://127.0.0.1:4876/blog/heic-vs-png-quality-file-size-compatibility/index.html
http://127.0.0.1:4876/blog/heic-vs-png-quality-file-size-compatibility/?utm_source=audit&q=PNG
http://127.0.0.1:4876/blog/how-to-convert-heic-images-for-website-uploads/
http://127.0.0.1:4876/blog/how-to-convert-heic-images-for-website-uploads
http://127.0.0.1:4876/blog/how-to-convert-heic-images-for-website-uploads/index.html
http://127.0.0.1:4876/blog/how-to-convert-heic-images-for-website-uploads/?utm_source=audit&q=PNG
http://127.0.0.1:4876/blog/how-to-convert-heic-to-jpg-on-iphone/
http://127.0.0.1:4876/blog/how-to-convert-heic-to-jpg-on-iphone
http://127.0.0.1:4876/blog/how-to-convert-heic-to-jpg-on-iphone/index.html
http://127.0.0.1:4876/blog/how-to-convert-heic-to-jpg-on-iphone/?utm_source=audit&q=PNG
http://127.0.0.1:4876/blog/how-to-convert-heic-to-jpg-without-losing-quality/
http://127.0.0.1:4876/blog/how-to-convert-heic-to-jpg-without-losing-quality
http://127.0.0.1:4876/blog/how-to-convert-heic-to-jpg-without-losing-quality/index.html
http://127.0.0.1:4876/blog/how-to-convert-heic-to-jpg-without-losing-quality/?utm_source=audit&q=PNG
http://127.0.0.1:4876/blog/how-to-convert-heic-to-png-on-mac/
http://127.0.0.1:4876/blog/how-to-convert-heic-to-png-on-mac
http://127.0.0.1:4876/blog/how-to-convert-heic-to-png-on-mac/index.html
http://127.0.0.1:4876/blog/how-to-convert-heic-to-png-on-mac/?utm_source=audit&q=PNG
http://127.0.0.1:4876/blog/how-to-convert-heic-to-png-on-windows-11/
http://127.0.0.1:4876/blog/how-to-convert-heic-to-png-on-windows-11
http://127.0.0.1:4876/blog/how-to-convert-heic-to-png-on-windows-11/index.html
http://127.0.0.1:4876/blog/how-to-convert-heic-to-png-on-windows-11/?utm_source=audit&q=PNG
http://127.0.0.1:4876/blog/how-to-fix-heic-files-that-wont-open/
http://127.0.0.1:4876/blog/how-to-fix-heic-files-that-wont-open
http://127.0.0.1:4876/blog/how-to-fix-heic-files-that-wont-open/index.html
http://127.0.0.1:4876/blog/how-to-fix-heic-files-that-wont-open/?utm_source=audit&q=PNG
http://127.0.0.1:4876/blog/how-to-open-heic-files-on-windows-and-mac/
http://127.0.0.1:4876/blog/how-to-open-heic-files-on-windows-and-mac
http://127.0.0.1:4876/blog/how-to-open-heic-files-on-windows-and-mac/index.html
http://127.0.0.1:4876/blog/how-to-open-heic-files-on-windows-and-mac/?utm_source=audit&q=PNG
http://127.0.0.1:4876/blog/why-does-my-iphone-save-photos-as-heic/
http://127.0.0.1:4876/blog/why-does-my-iphone-save-photos-as-heic
http://127.0.0.1:4876/blog/why-does-my-iphone-save-photos-as-heic/index.html
http://127.0.0.1:4876/blog/why-does-my-iphone-save-photos-as-heic/?utm_source=audit&q=PNG
http://127.0.0.1:4876/contact/
http://127.0.0.1:4876/contact
http://127.0.0.1:4876/contact/index.html
http://127.0.0.1:4876/contact/?utm_source=audit&q=PNG
http://127.0.0.1:4876/heic-to-avif/
http://127.0.0.1:4876/heic-to-avif
http://127.0.0.1:4876/heic-to-avif/index.html
http://127.0.0.1:4876/heic-to-avif/?utm_source=audit&q=PNG
http://127.0.0.1:4876/heic-to-jpg/
http://127.0.0.1:4876/heic-to-jpg
http://127.0.0.1:4876/heic-to-jpg/index.html
http://127.0.0.1:4876/heic-to-jpg/?utm_source=audit&q=PNG
http://127.0.0.1:4876/privacy/
http://127.0.0.1:4876/privacy
http://127.0.0.1:4876/privacy/index.html
http://127.0.0.1:4876/privacy/?utm_source=audit&q=PNG
http://127.0.0.1:4876/terms/
http://127.0.0.1:4876/terms
http://127.0.0.1:4876/terms/index.html
http://127.0.0.1:4876/terms/?utm_source=audit&q=PNG
http://127.0.0.1:4876/sitemap.xml
http://127.0.0.1:4876/robots.txt
http://127.0.0.1:4876/canonical-audit-missing/
http://127.0.0.1:4876/blog/what-is-a-heic-file-beginners-guide/
http://127.0.0.1:4876/blog/heic-vs-avif-whats-the-difference/
http://127.0.0.1:4876/blog/how-to-convert-multiple-heic-photos-at-once/
```

## Live URLs checked before deployment

These findings describe the deployed older release, not the local fixes.

| Exact requested URL | Result |
| --- | --- |
| http://heic2png.site/heic-to-jpg/?utm_source=audit | 301 to HTTPS apex with path/query preserved |
| https://www.heic2png.site/heic-to-jpg/?utm_source=audit | 200; missing www redirect; older apex slashless canonical |
| https://heic2png.site/ | 200; correct root canonical |
| https://heic2png.site/heic-to-jpg | 200; older slashless canonical |
| https://heic2png.site/heic-to-jpg/ | 200; older slashless canonical |
| https://heic2png.site/heic-to-jpg/index.html?utm_source=audit | 200; older slashless canonical |
| https://heic2png.site/heic-to-avif/ | 200; older slashless canonical |
| https://heic2png.site/blog/ | 200; older slashless canonical |
| https://heic2png.site/blog/?category=Image%20Formats&q=PNG | 200; canonical excludes parameters |
| https://heic2png.site/blog/index.html | Initial timeout; retry 200, confirming public index alias |
| https://heic2png.site/sitemap.xml | 200; 18 URLs under older slashless policy |
| https://heic2png.site/robots.txt | 200 |
| https://heic2png.site/canonical-audit-missing-20261023/ | 404/noindex; no homepage soft-404 |

Cloudflare appears in public response headers. These responses do not reveal configured SSL mode, redirect rules, cache policy, WAF rules or Googlebot accessibility; those require manual account/origin review.

## Separate infrastructure proposal — manual review only

Complete proposal: [deploy/heic2png.canonical.conf.example](deploy/heic2png.canonical.conf.example).
Deployment guidance: [deploy/README.md](deploy/README.md).

The example is uninstalled. Review this site's actual certificate paths/root and replace only its matching HEIC server blocks; do not append competing blocks, edit another virtual host or treat the file as automatically validated infrastructure.

Exact host/scheme redirects:

```nginx
# HEIC-only port 80 server, outside ACME validation exception:
location / { return 301 https://heic2png.site$request_uri; }

# Dedicated TLS www.heic2png.site server:
return 301 https://heic2png.site$request_uri;
```

$request_uri preserves the original path and query. HTTP ACME validation is intentionally exempt. The certificate must cover both HEIC hostnames before an HTTPS www redirect can be received.

The apex TLS block separately redirects existing slashless HTML routes and terminal index.html aliases to trailing-slash pages, preserving arguments with $is_args$args. File-existence guards preserve missing-page 404s. Assets, robots.txt and sitemap.xml retain file URLs. The index file is served directly before directory fallback to avoid an index-module internal redirect loop.

| Request | Expected behavior after manual installation |
| --- | --- |
| http://heic2png.site/blog/?q=PNG | 301 → https://heic2png.site/blog/?q=PNG → 200 |
| https://www.heic2png.site/heic-to-jpg/?utm_source=test | 301 → https://heic2png.site/heic-to-jpg/?utm_source=test → 200 |
| https://www.heic2png.site/heic-to-jpg?utm_source=test | Host 301, slash 301, then 200; finite two-hop chain |
| https://heic2png.site/heic-to-jpg?utm_source=test | 301 → https://heic2png.site/heic-to-jpg/?utm_source=test → 200 |
| https://heic2png.site/blog/index.html?q=PNG | 301 → https://heic2png.site/blog/?q=PNG → 200 |
| https://heic2png.site/index.html?q=PNG | 301 → https://heic2png.site/?q=PNG → 200 |
| https://heic2png.site/blog/ | 200 without redirect |
| https://heic2png.site/sitemap.xml | 200 without appended slash |
| https://heic2png.site/nonexistent-audit-route/ | 404/noindex, no homepage redirect |

Cloudflare/operator prerequisites:

1. Use **Full (strict)** with a valid, reachable origin certificate covering both HEIC names. Flexible uses HTTP to the origin; origin HTTPS enforcement under Flexible can loop.
2. Manually inspect existing Cloudflare rules: none should redirect apex to www, HTTPS to HTTP, or canonical slash URLs back to slashless URLs.
3. The apex HTTPS server does not force another HTTPS redirect. No untrusted forwarded-protocol conditional is introduced.
4. Syntax, certificate/root validation and redirect-chain acceptance checks remain manual operator work. Nothing was installed or reloaded. If later deployed, coordinate the new build and redirect policy and clear stale HEIC HTML/sitemap cache as appropriate.

References: [Astro trailingSlash](https://docs.astro.build/en/reference/configuration-reference/#trailingslash), [Google URL consolidation](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [Nginx return](https://nginx.org/en/docs/http/ngx_http_rewrite_module.html#return), [Cloudflare Full (strict)](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/full-strict/).

