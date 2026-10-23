# Static VPS deployment

Nothing has been deployed. These instructions operate only on this site's new directory and server block. Keep the existing website and certificates unchanged.

1. Locally, install Node 24 LTS, run `npm ci`, copy `.env.example` to `.env` if overriding the support mailbox, then run `npm run build` and `npm test`. Only `dist/` is public. Do not copy the repository, test fixtures, `.env`, or `node_modules` into the document root.
2. On Ubuntu, inspect existing Nginx server names (`sudo nginx -T`) and choose an unused deployment directory. The example uses `/var/www/heic2png.site/releases/RELEASE_ID` and `/var/www/heic2png.site/current`. Use a distinct release ID for every build. Upload the contents of `dist/` into the new release directory using rsync/SFTP. Do not use a destructive rsync target shared with another site.
3. Create `current` as a symlink to the new release. For updates, create a temporary symlink within `/var/www/heic2png.site/` and atomically rename it over `current`. Record the old target first with `readlink -f /var/www/heic2png.site/current`. Do not delete old releases while deploying.
4. Copy `heic2png.site.conf` to `/etc/nginx/sites-available/heic2png.site` and symlink that file into `sites-enabled` only if the name is unused. Run `sudo nginx -t`. Reload with `sudo systemctl reload nginx` only when validation succeeds. Do not stop or restart services and do not replace the default/other site configurations.
5. Set A records for `heic2png.site` and `www` to this VPS. Add AAAA only when IPv6 is configured and reachable. Verify DNS from outside your network and HTTP access to this site's domain before requesting TLS.
6. Create `/var/www/heic2png.site/acme/.well-known/acme-challenge/`. Inspect `sudo certbot certificates` first. If this site has no existing certificate, request a dedicated one using `sudo certbot certonly --webroot -w /var/www/heic2png.site/acme --cert-name heic2png.site -d heic2png.site -d www.heic2png.site`. Never specify another site's certificate name. If this certificate name already exists, review its domains and expiry rather than overwriting it.
7. Add HTTPS only to this site's configuration using `/etc/letsencrypt/live/heic2png.site/fullchain.pem` and `privkey.pem`. Keep the security headers, root, private logging and locations from the supplied server block. Add a separate HTTP redirect block while retaining the ACME challenge location. Redirect `www` to `https://heic2png.site$request_uri` to match canonical URLs. Run `sudo nginx -t`, then reload. Verify Certbot's renewal timer and `sudo certbot renew --dry-run` without changing unrelated certificates.
8. Check `/`, `/heic-to-jpg`, `/heic-to-avif`, `/blog`, the published article, `/sitemap.xml`, `/robots.txt`, and a random missing URL. All three converters must return HTTP 200 and missing URLs must return HTTP 404; do not add an index.html catch-all. Test actual conversion/download in a browser over HTTPS.

AVIF requires the included `.wasm` asset in `dist/_astro/`. Serve it as `application/wasm` (add that mapping to Nginx's MIME types if absent). Preserve `'wasm-unsafe-eval'` in `script-src`; this permits WebAssembly compilation without permitting JavaScript eval. The codec is single-threaded inside a disposable worker, so no COOP/COEP headers or SharedArrayBuffer setup is needed. No remote codec/CDN request or image upload is required.

## Rollback

Point `current` back to the recorded old release using the same temporary-symlink/atomic-rename process. Because the Nginx root remains the same, a static release rollback needs no service restart. If the server block itself changed, restore only the saved `heic2png.site` configuration, validate with `nginx -t`, then reload. Leave other sites, DNS zones, certificates and releases alone.

## Ads and privacy

The shipped CSP permits no advertising or analytics origins. Reserved ad positions remain unchanged and never receive image data. Publisher configuration alone intentionally cannot bypass this. Activating ads requires an independently verified isolated renderer and a consent-management integration; do not weaken the CSP or insert third-party scripts into the converter document. No publisher/slot IDs have been invented.

Nginx access logging in the example omits IP addresses and query strings. Error logs may contain request/client details during server errors; restrict their permissions and apply a suitable retention policy. Images never reach Nginx.
