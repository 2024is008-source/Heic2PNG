# GA4 implementation and manual activation review

Date: October 24, 2026. Property measurement ID: **G-W3XNRQR60H**.

## Status and activation prerequisites

The integration is implemented in the shared Astro head on all 19 public HTML pages, including the static 404. No prior GA4/GTM installation was found in source, public assets or deployment configuration. No deployment, Nginx reload, Cloudflare change, Google Analytics account change or modification to `tiksavemp4.online` was made.

**Collection is deliberately release-gated off in the default build.** This prevents enabling Google's remotely configured automatic measurement before its settings and the server CSP have been reviewed. Before a separately authorized release:

1. In GA4 Admin → Data streams → the web stream for `G-W3XNRQR60H`, turn **Enhanced measurement OFF entirely**, including history-based page views, downloads, site search, outbound clicks and form interactions. Also disable automatic user-provided data collection, Google signals and any connected/forwarded tag destinations or Ads features. Do not install this ID a second time through GTM, Cloudflare Zaraz, an injected snippet or a plugin. These settings require account access; they were not changed or verified here. Google's [enhanced measurement documentation](https://support.google.com/analytics/answer/9216061?hl=en) explains that these settings can start automatic events remotely, including download parameters.
2. Review and manually apply the HEIC2PNG-only CSP proposal below. Neither tracked Nginx configuration was edited.
3. Set `PUBLIC_GA4_ENABLED=true` in the production build environment. Optionally set `PUBLIC_GA4_EVENTS=true` for conversion and download events; it defaults to false. Rebuild using `npm run check` and `npm run build`. The measurement ID is a public identifier, not an API secret.
4. Deploy only through the separately approved deployment process, then perform the live checks below. Preview builds, localhost, loopback/IP hosts, HTTP, alternate domains and development mode remain disabled. Even a development server started with `PUBLIC_GA4_ENABLED=true` renders the integration as disabled.

## Consent and data handling

This uses a conservative worldwide opt-in rather than geolocation. No Google script, preconnect, analytics cookie, queued interaction or cookieless analytics ping is created before consent. The existing Privacy Policy section contains “Allow analytics” and “Keep analytics off / withdraw consent” controls; there is no new banner or navigation item. This preserves the converter and other page layouts, but means visitors must open Privacy Policy themselves to opt in, so measured traffic will be a consented subset.

Consent is versioned in local storage for up to 180 days. Storage failures, expired/malformed choices and Global Privacy Control fail closed. On consent, the local bootstrap queues default denied consent followed by analytics-only permission before configuring/loading Google. Advertising storage, advertising user data, ad personalization and Google signals stay disabled. This follows Google's [basic consent approach](https://developers.google.com/tag-platform/security/concepts/consent-mode).

Withdrawal sets Google's `ga-disable-G-W3XNRQR60H` opt-out flag, removes the loader and pending command queue, and deletes accessible `_ga` cookies at the site/domain root. Other open tabs receive the change. It does not reload a converter tab or discard selected files. Requests already transmitted cannot be recalled. Re-allowing after withdrawal applies on the next page load, avoiding reinitializing an already-loaded tag. Expiration is checked at startup, each custom event and every minute while a tag is active. See Google's [privacy controls](https://developers.google.com/tag-platform/security/guides/privacy).

GA cookies are configured for 180 days without rolling expiration. Configure GA property data retention separately; this implementation does not assert the existing account setting. Analytics includes cookie identifiers and technical device/network information and is **not anonymous**. Google's tag runs in the page context after consent, not in an isolated sandbox. The README and Privacy Policy now say this accurately.

Page views are explicit: `send_page_view:false`, followed by one manual `page_view` per consented static document load. Repeated consent clicks and duplicate bootstrap execution do not repeat it; an actual back/forward-cache restoration records a new view. Google history auto-measurement must remain disabled as above. [Google documents the distinction](https://developers.google.com/analytics/devguides/collection/ga4/views).

All page locations come from the static canonical, with query strings and fragments excluded. Referrer is overridden to empty and the Google loader uses `no-referrer`. This intentionally loses campaign-query/referrer attribution. Page titles are static SEO titles. No user ID, email, user-provided data, arbitrary event detail, file name/path, file object, EXIF, dimensions, size, error text or image payload is passed to GA.

| Optional event | Trigger | Additional fields |
| --- | --- | --- |
| `conversion_success` | Each completed file, after the worker result is accepted | `output_format`: `png`, `jpg`, `avif` |
| `conversion_failure` | Each actual conversion attempt that fails | `output_format` only; no error message |
| `download_start` | After initiating a real converted-file or ZIP download | `output_format`; `download_type`: `single` or `zip` |

Common event parameters are only sanitized `page_location`, static `page_title`, empty `page_referrer`, and `send_to`. Events before consent are discarded, not replayed later. “Download start” does not claim the user saved the file. Invalid file selection, canceled/removed stale work and ZIP creation failures do not fabricate successful conversion/download events. Worker, encoder, resizing, ZIP generation and file bytes are unchanged; the runtime changes only emit these observer events. GA may still emit standard session/engagement events after consent; enhanced interactions must stay off.

## Exact Nginx CSP proposal — manual review only

In the **HEIC2PNG HTTPS server block only**, replace its existing `add_header Content-Security-Policy` line with this single directive. Do not append a second policy: multiple policies intersect and the old one would continue blocking Google.

```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'wasm-unsafe-eval' https://www.googletagmanager.com; worker-src 'self' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https://www.googletagmanager.com https://*.google-analytics.com; font-src 'self'; connect-src 'self' https://www.googletagmanager.com https://*.google-analytics.com https://*.google.com; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'none'" always;
```

Only `script-src`, `img-src` and `connect-src` gain Google destinations. This is Google's [documented GA-without-Ads endpoint set](https://developers.google.com/tag-platform/security/guides/csp), using the existing `script-src` fallback because the site has no separate `script-src-elem`. It adds no Google Ads, DoubleClick, frame, font or stylesheet allowances. The Google subdomain wildcard in `connect-src` is included by that documented no-Ads baseline; it is not an allowance for arbitrary domains. Further host-by-host tightening needs observed production endpoint coverage, including regional collection hosts.

Keep `'wasm-unsafe-eval'`, `worker-src 'self' blob:`, local asset connections and `img-src blob: data:`. Do not add `'unsafe-eval'`, script `'unsafe-inline'`, `*`, `data:` scripts, a GTM container, advertising endpoints or a relaxed `default-src`. No inline executable GA snippet or nonce is required because the bootstrap is an external same-origin script.

If Cloudflare also injects an enforced CSP, it must allow the same destinations after separate review; a more permissive Nginx policy cannot override a restrictive Cloudflare policy. Do not change the other site's server block or a shared/global header. Check the effective response and any `script-src-elem` override before activation. Tag Assistant's optional preview UI can have additional CSP needs; do not weaken the production policy just to load its overlays. Use its browser extension and Network inspection, or separately reviewed temporary preview permissions.

## Verification procedure after authorized deployment

1. In a fresh profile with no consent, inspect Network: no `googletagmanager.com` or `google-analytics.com` requests and no `_ga` cookies. Denying must keep this state. Without consent, Tag Assistant showing no Google tag is expected, not an installation failure.
2. Start [Tag Assistant](https://tagassistant.google.com/) for the production domain, or use its Chrome extension. Open Privacy Policy and allow analytics. Confirm exactly one Google tag with ID `G-W3XNRQR60H`, default denied consent followed by analytics-only granted, and one `page_view` per navigation. Do not add another tag to make the debugger connect. See [Tag Assistant guidance](https://support.google.com/tagassistant/answer/10039345?hl=en).
3. In DevTools Network, inspect the Google script and `/g/collect` requests. Confirm the canonical path is used and no query, fragment, referrer, email, filename, error or file contents appear. Verify no CSP violations. If Google is blocked by an extension, test once in a clean consented profile; do not bypass browser privacy choices.
4. In GA4 → Reports → Realtime, check page views and, if opted in and enabled, the three event names. Convert a non-sensitive test file to each format, start a single download and ZIP, and try a corrupt HEIC. Each successful file should add one success; downloads should add one start each. Realtime is a delayed monitoring report, not an exact instantaneous delivery guarantee. See [Google's Realtime documentation](https://support.google.com/analytics/answer/9271392?hl=en).
5. Withdraw consent. Confirm cookies are cleared and no subsequent events are collected; check another open converter tab without losing its queue. Reload and confirm the tag remains absent. Re-test consent persistence, Global Privacy Control, mobile upload, workers/WASM and ZIP.

**Live Tag Assistant/Realtime receipt is not verified here.** No account access, deployment or real collection traffic was used. Local tests intercept Google with a recording stub; they verify integration behavior and payloads, not Google's remote configuration or processing.

## Changed files

| File | Change |
| --- | --- |
| `.env.example` | Documented release and optional-events flags |
| `src/pages/[...path].astro` | One deferred same-origin bootstrap in the shared head, guarded by production mode and release flag |
| `public/analytics.js` | Origin gating, consent, manual views, event allowlist, expiry and withdrawal |
| `src/lib/privacy.mjs` | Accurate policy copy and inline consent controls within existing sections |
| `src/lib/design.mjs` | Apply updated policy only on `/privacy/` |
| `src/scripts/runtime.txt` | Four observer call sites for successful/failed conversions and actual single/ZIP download starts; no conversion algorithm changes |
| `README.md` | Corrected analytics disclosure and link to this guide |
| `tests/analytics.spec.ts` | Consent, gating, duplicates, sanitized events, failure isolation and real conversion/download regression tests |
| `GA4_IMPLEMENTATION.md` | This implementation, activation, CSP and verification report |

No CSS, logos, canonical helper, sitemap source, robots source, converter worker/encoder or Nginx configuration was edited. Privacy text and its inline consent controls are the only visible content changes.

## Verification results

| Check | Result |
| --- | --- |
| `npm run check` | Passed (site TypeScript and worker TypeScript) |
| `npm run build` | Passed; 19 public HTML pages generated. Existing nonfatal Browserslist dataset warning remains. |
| `npx playwright test --reporter=list` | **46 passed, 1 pre-existing failure** out of 47, in 2.8 minutes |
| New analytics tests | **8/8 passed** as part of that full run; no real Google collection requests used |
| Actual conversion regressions | PNG/JPG/AVIF successes, quality/lossless/resize, orientation, thumbnails, invalid/corrupt input, cancellation, single-file and ZIP download tests passed |
| Proposed CSP | Real worker/WASM conversions and ZIP passed with the proposed policy in the isolated production-origin fixture |
| Development-mode guard | Started an isolated Astro dev server with `PUBLIC_GA4_ENABLED=true`; the served shared head still had `data-enabled="false"`. Server then stopped. |
| Static integration | All 19 generated documents have exactly one local analytics bootstrap, no direct Google script, and the default release gate off |
| Visible markup preservation | Compared pre-change Git HEAD renderer against the new renderer: 18 non-privacy route outputs were identical, including header, footer, controls and classes |
| SEO/infrastructure preservation | `robots.txt` and `sitemap.xml` byte-identical to pre-change build; both tracked Nginx configurations byte-identical. Canonical, SEO, schema and link regression tests passed. |
| `git diff --check` | Passed; only existing Windows line-ending notices |

The one failure is `tests/mobile-ui.spec.ts:71`, specifically its 200% root-font-size assertion at line 78: a 320px viewport has a 337px document width. It is an existing header text-enlargement problem. An independent browser run with `/analytics.js` replaced by an empty response reproduced the same **337px** overflow, and the pre-change/new renderer comparison confirmed identical homepage/header markup. It was not fixed because this task expressly prohibits UI/responsiveness changes. Ordinary viewport/queued-file mobile checks passed. This remaining accessibility issue needs a separate UI fix.

No Lighthouse improvement, production CSP change, live Tag Assistant result or GA Realtime receipt is claimed. Live receipt and remote measurement settings remain the manual post-activation checks described above.
