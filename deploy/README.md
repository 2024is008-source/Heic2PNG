# HEIC2PNG static deployment

Use [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md) for the reviewed manual workflow.
Build in a separate checkout, validate the artifact, then atomically switch only
this site's existing document-root symlink. The guide includes rollback and
retention of fingerprinted assets for open browser tabs.

`heic2png.site.conf` and `heic2png.canonical.conf.example` are identical complete
TLS proposals. Install exactly one after checking the actual HEIC root, existing
certificate paths, Cloudflare Full (strict), server-name blocks and ACME webroot.
They replace the old HTTP-only bootstrap reference; never append duplicate blocks.
No shared/default configuration, other site, certificate or PM2 app may be changed.

Do not rebuild an active release, copy `.env` or Git metadata into the web root,
force-upgrade Tailwind, discard editorial diffs, or delete old releases during a
switch. Nothing in this task deploys or reloads Nginx automatically.

Preserve the CSP worker and WebAssembly allowances and the actual fingerprinted
worker/AVIF WASM files. No COOP/COEP or third-party codec CDN is required. The
configuration declares XML, manifest, WOFF2 and TTF MIME types and retains real
404 responses. Ads remain disabled; adding a third-party ad renderer or consent
system is outside this change.

Access logging in the apex proposal omits IP/query strings. Error logs and other
infrastructure can still contain request/client data; an operator must verify
Cloudflare/origin logging and retention before making anonymity claims.
