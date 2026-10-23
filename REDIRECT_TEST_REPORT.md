# Canonical redirect verification

23 October 2026. No production configuration was installed, reloaded or changed.

## Current public behavior

Fresh ordinary public sample at **2026-10-23T16:36:20.962Z**: all 18 intended pages return 200 with HTTPS apex trailing-slash canonicals. Thus the old report's slashless-canonical release gap is already resolved publicly and was not reimplemented here. However www JPG, slashless JPG, JPG index.html with query and blog index.html still returned **200**, so permanent duplicate URL consolidation is still a verified live issue. HTTP JPG with a query returned 301 to HTTPS with the same path/query. Missing URL variants and all three drafts returned real 404/noindex responses. These are public samples, not origin/Cloudflare-dashboard inspection.

## Reviewed local configuration

`deploy/heic2png.site.conf` and `deploy/heic2png.canonical.conf.example` are identical complete TLS alternatives. Install **only one**, after matching the real HEIC vhost/root/certificates. The first file replaces the older HTTP-only bootstrap reference. No default_server or unrelated website is changed.

- HTTP apex/www → fixed HTTPS apex origin, preserving `$request_uri`; ACME HTTP challenges are exempt.
- HTTPS www → fixed HTTPS apex origin, preserving path/query.
- Apex `/index.html` → `/`; existing directory `index.html` aliases → their trailing-slash directory.
- Existing slashless page directories redirect only when their `index.html` file exists. Missing pages remain 404. No arbitrary unknown URL is sent to the homepage.
- Canonical directories use the index file first, preventing internal-index redirect loops.
- Hidden-file denial precedes regex index rules. ACME, `_astro`, fonts and physical files are excluded from page trailing-slash rules.
- The actual worker, WASM, fonts, XML, manifest, favicon and static files remain directly addressable. XML/manifest/WOFF2/TTF MIME mappings are explicit where needed.

## Disposable real-Nginx tests

Official portable **Nginx 1.30.6 for Windows** was downloaded into ignored `.astro/`; Docker/native Linux Nginx were unavailable and WSL enumeration was denied. A local one-day test certificate and isolated PID/log/temp directories were generated. Nginx bound only **127.0.0.1:18080 and 127.0.0.1:18443**. The production proposal itself was used, changing only local listen addresses, certificate/root/log/ACME paths and the surrounding test http context. Redirect targets remained the real canonical URL strings; the harness followed them by mapping back to loopback, never by modifying production. Its own process was gracefully stopped after testing.

**Result: nginx -t passes; 97 HTTP assertions pass; no redirect loop.**

|Case|Verified result|
|---|---|
|HTTP apex root `/?q=one`|301 → `https://heic2png.site/?q=one`|
|HTTP www root `/?q=one`|301 → same apex destination|
|HTTPS www, each of 18 canonical paths with query|301 → matching HTTPS apex path/query|
|All 18 canonical URLs|200, no redirect|
|JPG `/heic-to-jpg?x=1&y=two`|301 → `https://heic2png.site/heic-to-jpg/?x=1&y=two`|
|JPG `/heic-to-jpg/index.html?x=1&y=two`|301 → same preferred directory/query|
|Blog `/blog?x=1&y=two`|301 → `https://heic2png.site/blog/?x=1&y=two`|
|Blog `/blog/index.html?x=1&y=two`|301 → same preferred directory/query|
|Every other existing normal/article directory|Same existing-file-gated slash/index behavior|
|Missing `/missing`, `/missing/`, `/missing/index.html`|404|
|Three unpublished article URLs|404|
|`/.env`, `/.git/config`, `/.git/index.html`|403, never exposed|
|HTTP ACME probe on apex and www|200; no HTTPS/page-slash rewrite|
|sitemap, robots, manifest, favicon SVG/ICO, font CSS/WOFF2, all actual `_astro` JS/CSS/WASM|200; no inappropriate page redirect|
|HTTP www + explicit JPG index + query, followed to completion|Two 301s, then canonical 200; query retained; visited-URL loop guard passes|

Observed local Nginx MIME: sitemap `application/xml`, manifest `application/manifest+json`, WOFF2 `font/woff2`, ICO `image/x-icon`, SVG `image/svg+xml`, AVIF WASM `application/wasm`. No 308 is used because the requested behavior is 301.

The two-hop host-plus-path case is intentional: the domain server normalizes origin, then the apex block normalizes the existing path. Already-canonical requests do not redirect. This avoids a broad rewrite of assets/nonexistent routes for the sake of one fewer hop.

## Reproduction and remaining manual review

```powershell
$env:NGINX_BIN='ABSOLUTE_PATH_TO_DISPOSABLE_NGINX.EXE'
$env:OPENSSL_BIN='ABSOLUTE_PATH_TO_OPENSSL.EXE'
$env:HEIC_TEST_DIST='ABSOLUTE_PATH_TO_FROZEN_DIST'
npm run test:redirects
```

On Linux, supply the installed disposable binary/MIME file through `NGINX_BIN`/`NGINX_MIME`; the test still uses isolated loopback configuration. Do not point it at a service configuration or PID. Keep its generated certificate outside the public root.

One repeat attempt read a mutable `dist` while another test rebuilt it and saw ENOENT; the final repeat used the frozen final artifact and passed all 97 checks. This was a test orchestration race, not an Nginx routing failure.

Windows Nginx results do not validate Linux filesystem case/symlink permissions, the actual Ubuntu package, existing shared includes, real certificate coverage, Cloudflare TLS/WAF/rules or origin access. Before manual installation, inspect only the relevant HEIC blocks, confirm the actual root/current symlink and dedicated certificates, require Cloudflare Full (strict), run the VPS's own `nginx -t`, then perform the HEIC-only reload after review. Preserve existing ACME renewal and the other site's configuration. Exact release/configuration rollback instructions are in **DEPLOYMENT_GUIDE.md**.

Rule behavior follows the actual [Nginx core-module documentation](https://nginx.org/en/docs/http/ngx_http_core_module.html); the downloaded version was selected from the [official Nginx downloads](https://nginx.org/en/download.html). No live installation or indexing outcome is claimed.
