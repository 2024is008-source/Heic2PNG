# Standard GA4 integration — HEIC2PNG.site

Measurement ID: **G-W3XNRQR60H**. No commit, push, deployment, Cloudflare change, Nginx change or TikSaveMP4 access was performed.

## Implementation and removed legacy behavior

`public/analytics.js` is an external initializer loaded once from the shared Astro page. Vite fingerprints its URL. It inserts one asynchronous official `https://www.googletagmanager.com/gtag/js?id=G-W3XNRQR60H` tag after permission and calls `gtag('config', id, options)` once. GA4 sends its default page view; there is no custom `page_view` event, `send_page_view:false`, history controller, or BFCache view injection. This is a static multipage site without Astro client routing. Repeated acceptance does not send another view.

Removed: diagnostic country lookup, browser country lists, `PUBLIC_GA4_AUTO_COUNTRIES`, `PUBLIC_GA4_EVENTS`, custom conversion/download/failure events and their observation hooks, the old manual page-view controller, obsolete regional tests and obsolete documentation. No standalone files needed deletion: the initializer, policy helper, tests and guide were replaced in place. The existing compact consent component/CSS and footer link are reused for the consent that is still required. There are no permission buttons inside the Privacy Policy article.

Changed/added files in the working tree:

- `.env.example`: one analytics enable flag; removed country/event flags.
- `public/analytics.js`: standard Google tag, attribution filtering and small consent gate.
- `src/pages/[...path].astro`: one external shared initializer, no regional/event attributes.
- `src/scripts/runtime.txt`: removed analytics observers only; encoding/download behavior unchanged.
- `src/lib/privacy.mjs`: short disclosure and withdrawal explanation.
- `src/lib/design.mjs`: persistent footer Privacy choices link.
- `src/components/AnalyticsConsent.astro`: minimal shared accessible Accept/Reject panel.
- `src/styles/analytics-consent.css`: isolated panel styles; existing site design is unchanged.
- `tests/analytics.spec.ts`: standard configuration, attribution, consent and actual conversion regressions.
- `README.md` and this guide: current behavior and deployment/verification instructions.

Some files above were already modified/untracked by the preceding consent work; this list describes the complete current reviewable working tree, not a claim that all files originated in this pass.

## Production switch and GA4 property prerequisites

Only analytics environment variable:

```dotenv
PUBLIC_GA4_ENABLED=true
```

It is a public build-time switch, not a secret. `.env.example` defaults false. Rebuild after changing it. Even with true, development builds, localhost, IP addresses, HTTP and other hostnames cannot load this installation. The exact production origin is required. No country or event environment variables remain. Existing contact/ad settings are unrelated and may remain as configured.

Before enabling, inspect this property's web stream:

1. Turn **Enhanced Measurement off** (including file downloads, form interactions, outbound clicks and history-based page views). The standard configuration still sends its initial page view; enhanced interactions could otherwise inspect DOM/file-related data or unfiltered addresses. Do not enable automatic user-provided data collection.
2. Keep Google signals, advertising personalization and Ads destinations/linking off. The initializer also sets `ad_storage`, `ad_user_data` and `ad_personalization` to denied; `allow_google_signals` and `allow_ad_personalization_signals` are false; ads data redaction is enabled. No Ads tag is installed.
3. Remove any additional installation in GTM, Zaraz, Cloudflare apps or other snippets for this property. The source has one installation and refuses to initialize if another `gtag`/Google tag script is already present. External dashboard injections cannot be audited from repository code alone.
4. Enable GA4's email/query data redaction as additional protection. Use only public non-identifying campaign labels. Do not collect user IDs or add remote custom tags/events.

Google's [default page-view documentation](https://developers.google.com/analytics/devguides/collection/ga4/views) explains that `config` sends a page view without a manual event. [Enhanced measurement settings](https://support.google.com/analytics/answer/9216061?hl=en) are controlled in the property, not this repository.

## Consent behavior

| Situation | Behavior |
| --- | --- |
| Production enabled, no saved choice, trusted response header exactly `X-Analytics-Consent: not-required` | Load GA4 automatically; no banner or acceptance stored. |
| Header `required`, absent, invalid, timed out, redirected or unsuccessful response | No Google tag, requests or Analytics cookies before Accept; show equal Accept/Reject controls. |
| Valid saved acceptance | Load automatically; acceptance expires after 180 days. |
| Saved rejection, including an old rejection timestamp | No GA4; remains off until explicitly changed or browser storage cleared. |
| Global Privacy Control | No GA4 everywhere, including otherwise automatic regions and saved acceptance. Accept is disabled while GPC is active. |
| Invalid/expired preference | Require a fresh explicit choice; never silently override it with automatic permission. |
| Unavailable preference storage | Stay off; failed acceptance does not grant permission. Reject dismisses the panel for that document. |
| Local/development/disabled release | No Google tag or policy request; panel only opens on deliberate settings access. |

The footer's **Privacy choices** link opens the same panel on every public page. Keyboard focus enters its heading and returns to the opener; Escape dismisses without consenting. Both buttons have equal styling and 44px minimum height. No forced reload or conversion cancellation occurs.

Withdrawal sets Google's documented `ga-disable-G-W3XNRQR60H` flag before notifying the loaded tag of denial, clears pending initialization commands and accessible first-party `_ga` cookies, and removes the script element. Cross-tab rejection is respected. Existing in-flight requests/data already sent cannot be recalled. If tracking has started and is then stopped, reacceptance resumes on the next navigation; the current page does not receive another configuration/page view. Focus, visibility, BFCache restoration and a one-minute check recheck GPC/expiry. BFCache restoration does not manually send a view.

This implements basic consent gating: Google is not loaded while permission is unresolved. [Google distinguishes basic from advanced consent mode](https://developers.google.com/tag-platform/security/concepts/consent-mode); advanced cookieless pre-consent pings are not used here.

## Manual Cloudflare response-header setup

**Not configured by this task.** You confirmed there is no current provider and requested documentation for manual setup. Until this setup is reviewed and installed, unknown visitors are opt-in worldwide. No absence of choice is interpreted as permission.

A static Astro build cannot know a visitor's jurisdiction. The browser makes one same-origin **HEAD** request to the current pathname, excluding query/fragment, only when there is no saved preference and no GPC. It reads a policy result, not a country/IP body. There is no diagnostic endpoint or geolocation API. The request omits credentials/referrer, bypasses browser cache, rejects redirects and times out after two seconds.

In the **heic2png.site zone only**, open Rules → Transform Rules → Modify Response Header. Create these in order using **Set**, not Append:

1. Default rule expression: `(http.host eq "heic2png.site")`. Set `X-Analytics-Consent` to `required`.
2. After that rule, create a narrower exception only for jurisdictions reviewed as permitting this site's actual analytics without prior opt-in. Set the same header to `not-required`.

For example, if review explicitly approves the United States for this configuration, the exception expression is:

```text
(http.host eq "heic2png.site" and ip.src.country in {"US"})
```

This is an executable rule example, **not a legal determination that all US situations are exempt**. Start with no exception if no regions have been approved. Keep EEA/UK/Switzerland and unknown countries on `required`; extend exceptions only after jurisdiction-specific review, including applicable state/privacy/minor requirements. Country-only policy is coarse: where finer rules are needed, retain opt-in or use an appropriate CMP. Browser language/timezone and campaign parameters never grant permission. GPC and saved opt-outs always override the header.

Apply the transform to all responses, including HEAD and cache hits, on this hostname. Do not bake the value into static HTML, origin-wide headers or an HTML cache variant. Use a response transform that evaluates the current visitor on every response. Cloudflare documents that [response header transforms use visitor `ip.src.country` and run after cache evaluation](https://developers.cloudflare.com/rules/transform/response-header-modification/). No origin country database, new endpoint, Worker, Nginx reload or CORS change is needed.

Validate from an approved region and a consent-required region using actual remote locations/VPNs and clean browser storage. `curl -I https://heic2png.site/` and DevTools' HEAD response must show the appropriate **single** header. Spoofing a request header is not a jurisdiction test. Test with a warm Cloudflare cache in both regions. Missing/failed policy always falls back to opt-in. No changes to the TikSaveMP4 zone are needed.

## Attribution and data boundaries

The configuration keeps the canonical page path and these landing parameters when they pass filtering: `utm_source`, `utm_medium`, `utm_campaign`, `utm_id`, `utm_term`, `utm_content`. Labels must start with a letter or digit, contain only letters, digits, dots, underscores, tildes or hyphens, and be at most 100 characters. Long numeric runs and image/archive filename suffixes are rejected. Other query parameters and all fragments are omitted. Public campaign labels with spaces or characters outside this allowlist are intentionally dropped; use safe slugs such as `autumn-2026`.

The referrer retains its HTTP(S) **origin**, allowing search-engine, social and referring-site distinction without sending its path/query. Direct visits retain an empty referrer. There is no `ignore_referrer:true` or blanket referral erasure. No client code sets an organic/direct classification; GA4 performs attribution from the available data. Google Ads click IDs are not forwarded as landing parameters. Ad blockers, browser referrer policies, consent delays and GA processing can still affect attribution; do not promise perfect channel reporting.

Only static page metadata and filtered URLs are supplied. No converter events, filenames, file objects, image data, EXIF, private file paths, dimensions or raw conversion errors are sent by application code. The Google tag runs in the page context, not a sandbox. Filtering cannot identify every possible personal name disguised as a harmless campaign slug; campaign owners must not put PII in labels. The GA property settings above are a release prerequisite. Local tests inspect supplied configuration; they do not prove every internal behavior of Google's remotely maintained script.

## Existing CSP

A read-only HTTPS HEAD request on October 24, 2026 (local date) returned HTTP 200 and this existing live policy:

```text
default-src 'self'; script-src 'self' 'wasm-unsafe-eval' https://www.googletagmanager.com; worker-src 'self' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https://www.googletagmanager.com https://*.google-analytics.com; font-src 'self'; connect-src 'self' https://www.googletagmanager.com https://*.google-analytics.com https://*.google.com; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'none'
```

**Required Nginx/CSP changes: none.** The initializer is same-origin external JS, the tag host is already allowed by `script-src`, and Google collection hosts are allowed by `connect-src`/`img-src`. There is no inline executable GA code, eval, nonce requirement, wildcard expansion or advertising-domain addition. The same-origin policy HEAD request uses existing `connect-src 'self'`. Preserve existing worker/blob/WASM allowances. Repository Nginx proposal files are not an instruction to replace the already reviewed live policy.

The production-origin browser tests use this policy with a stub tag. Live Google collection and browser enforcement after deployment still need manual verification. Tag Assistant debugging may involve additional debug UI resources; do not weaken production CSP just to load debug tools.

## Validation record

Results are recorded below after the final build. All Google traffic in automated tests is intercepted; no test sends to the live property. A mocked default-config page view is a configuration assertion, not a Google Realtime result.

## Exact manual VPS release commands

Do not execute automatically. Use the reviewed HEIC-only symlink release process in [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md). That guide's root assumption is `/var/www/heic2png.site/current`; first inspect the existing HEIC server block read-only and **stop if the actual root differs**. Do not change another server block, restart services, modify shared configuration, or copy a repository into the public root.

After the operator has separately reviewed and made the changes available as a commit, replace the three placeholders below with the existing HEIC checkout path, full reviewed SHA and new release name. These are unknown local deployment values, not invented credentials. Run as the established HEIC deploy account, with Node 24 and the test browser provisioned:

```bash
set -euo pipefail
BASE=/var/www/heic2png.site
SOURCE_REPO=/path/to/verified/HEIC2PNG-checkout
COMMIT=REPLACE_WITH_REVIEWED_FULL_COMMIT_SHA
RELEASE_ID=REPLACE_WITH_UNIQUE_RELEASE_NAME

test -L "$BASE/current"
OLD=$(readlink -f "$BASE/current")
case "$OLD" in "$BASE"/releases/*) ;; *) echo 'STOP: unexpected current release'; exit 1;; esac
test -d "$OLD"
git -C "$SOURCE_REPO" remote get-url origin
# Verify this is the reviewed HEIC2PNG repository before continuing.
git -C "$SOURCE_REPO" fetch origin --prune
git -C "$SOURCE_REPO" cat-file -e "$COMMIT^{commit}"
mkdir -p "$BASE/builds" "$BASE/releases"
test ! -e "$BASE/builds/$RELEASE_ID"
test ! -e "$BASE/releases/$RELEASE_ID"
git -C "$SOURCE_REPO" worktree add --detach "$BASE/builds/$RELEASE_ID" "$COMMIT"
cd "$BASE/builds/$RELEASE_ID"
node --version
npm ci
export PUBLIC_GA4_ENABLED=true
npm run check
npm run build
npm test
npm run test:sitemap-build
npm run validate:release

NEW="$BASE/releases/$RELEASE_ID"
mkdir "$NEW"
rsync -a dist/ "$NEW/"
node scripts/validate-release.mjs "$NEW"
test ! -e "$NEW/.git"
test ! -e "$NEW/.env"
test ! -e "$NEW/node_modules"
if test -d "$OLD/_astro"; then rsync -a --ignore-existing "$OLD/_astro/" "$NEW/_astro/"; fi
printf '%s\n' "$OLD" > "$BASE/previous-release-$RELEASE_ID.txt"
TEMP="$BASE/current.next.$RELEASE_ID"
test ! -e "$TEMP"
ln -s "$NEW" "$TEMP"
mv -Tf "$TEMP" "$BASE/current"
curl --fail --silent --show-error --head https://heic2png.site/
```

Preserve established contact/ad build environment settings. Do not copy `.env` to the release. If tests cannot run on the VPS, stage only an artifact already tested from this exact commit and production environment in CI; record the skipped VPS checks accurately. The switch requires no Nginx reload. Verify the new fingerprinted initializer is served (Cloudflare may retain old HTML); if a purge is necessary, scope it to reviewed HEIC URLs only. Do not enable the tag until GA property prerequisites are satisfied. Header setup is a separately reviewed manual Cloudflare action above, not part of this command block. Rollback commands that preserve cached assets are in the deployment guide.

## Tag Assistant and Realtime procedure — manual after release

1. Verify the production build has one initializer with `data-enabled="true"`; search Network for one `gtag/js?id=G-W3XNRQR60H`. Ensure no extra Zaraz/GTM installation. Check Console for CSP issues.
2. In a clean browser from a consent-required/unknown region, verify **no Google tag/collect requests or `_ga` cookies** before Accept, after Reject, or with GPC. Confirm converters still work. Confirm Privacy choices can reopen and withdraw without losing selected files. Reload and test saved rejection.
3. From a reviewed automatic region with the response-header rule active, verify the HEAD result is `not-required`, no banner appears, and GA loads without visiting Privacy. Repeat with GPC and saved rejection: both must keep GA off. Check a cache hit and a consent-required-region visit.
4. Accept where needed and use DevTools Network to observe the real `g/collect` request for `tid=G-W3XNRQR60H` and `en=page_view`. Check one initial view per document, no duplicate after clicking Accept again, and one on full navigation. Inspect decoded `dl`/`dr` for safe UTM values and referring origin; do not use PII as test data. Test with ad blockers disabled only in the test profile.
5. Visit `https://heic2png.site/?utm_source=qa&utm_medium=test&utm_campaign=ga4-check` and a second page. Connect [Tag Assistant](https://tagassistant.google.com/) when available under existing CSP and confirm one destination/configuration. Use [GA4 Realtime](https://support.google.com/analytics/answer/9271392?hl=en) for the property and check the real page view. Traffic acquisition reports can take longer; Realtime alone is not proof of all channel classifications. Test real search/social/referral journeys separately.
6. Withdraw, inspect the disable flag and cleared accessible `_ga` cookies, then navigate: no further analytics requests should originate from the new document. Already in-flight requests are not recallable. Test PNG, JPG, AVIF and ZIP again on production, including mobile devices.

**Google Analytics Realtime, Tag Assistant, the manual Cloudflare rule and real regional journeys were not observed or configured by this task.**

## Additional requested mobile file-list change

The later mobile request authorizes the compact queue shown in the supplied examples. `src/design/helpers.js`, `src/lib/design.mjs`, `src/styles/approved.css` and `tests/mobile-ui.spec.ts` now provide:

- One mobile row per file, with an actual asynchronously decoded thumbnail, truncated filename, size, status and 44px remove control.
- A simple file count and Clear All; redundant dimensions/output-name/color-space details are hidden on mobile.
- Ready before conversion, Queued while another file is converting, and Converting with an indeterminate progress bar. The encoder exposes no percentage callbacks; no time-based or fabricated percentages are shown.
- A labeled download icon for each completed row. Global conversion/download/ZIP controls and the sequential conversion algorithms remain unchanged.
- Existing desktop row appearance and controls retained; filename tooltips and detailed error text retained.

The mobile regression uploads six actual HEIC files, verifies all real thumbnails, inspects queued/converting states while delaying actual worker startup, removes a waiting file during conversion and downloads a completed AVIF. Screenshots are generated at `test-results/mobile-queue-ready.png` and `test-results/mobile-queue-converting.png` and were visually inspected. These are local test artifacts, not uploaded production assets.

`scripts/validate-release.mjs` also now checks for exactly one external analytics initializer and no eagerly embedded Google script or obsolete regional/event attributes on every sitemap page.

The subsequent Output Defaults request is implemented only below 768px: Output Defaults is followed by the format badge on its own full-width row, then Advanced Settings is a full-width 44px control. The resolution and quality badges are hidden on mobile as subsequently requested; the actual resize settings and desktop badge are preserved. Padding and gaps are reduced to keep the panel at most 180px high at tested mobile widths. Values wrap within their cells. The expanded settings controls and all conversion options remain unchanged. `tests/mobile-ui.spec.ts` checks this arrangement at 320, 390 and 767px on PNG/JPG/AVIF and produces `mobile-output-defaults-{png,jpg,avif}.png` screenshots.

### Recorded results

The broad suite passed before the last mobile-panel refinements; the affected mobile scenarios were rerun afterward.

| Check | Observed result |
| --- | --- |
| `npm run check` | Passed TypeScript app and worker checks after final source edits. |
| `npm run build` | Passed; 19 HTML pages generated, including 404. Both an explicitly GA-enabled production build and the normal disabled-default build were exercised. |
| Full Playwright regression suite on the enabled build | 55/55 passed in 3.3 minutes; includes actual PNG/JPG/AVIF conversions, ZIPs, errors, thumbnails, mobile widths, metadata, links, schema and themes. |
| Latest analytics initializer including numeric/date-prefixed UTM labels | All 13 analytics cases passed; actual Google requests were stubbed. |
| Compact queue and lowered-panel targeted checks | 2/2 passed, including six real previews, conversion/queued states, waiting-file removal and row download. |
| Final mobile resolution-badge removal | 1/1 passed across PNG/JPG/AVIF at 320, 390 and 767px; screenshots visually checked. |
| `npm run test:sitemap-build` | 1/1 passed with isolated published/draft/noindex builds. |
| `npm run validate:release` | Passed after the final build: 18 canonical sitemap pages, icons, converter worker/WASM and one analytics initializer per page. |
| Generated HTML inspection | All 19 HTML documents had one initializer, one consent panel and one footer settings link; the normal build's activation flag was false. |
| `node --check public/analytics.js`, `git diff --check` | Passed. Git prints informational LF/CRLF conversion notices. |
| Existing public HTTPS/CSP | Read-only HEAD returned 200; Google script/collection endpoints are already allowed. No infrastructure change required. |
| Real regional policy, Tag Assistant and GA4 Realtime | Not verified; manual Cloudflare configuration and production observation remain required. |

The build reports an existing outdated Browserslist data warning; it does not fail. No dependency versions or lockfile were changed. Automated browser execution used installed desktop Chrome, not physical iOS/Android devices; physical-device memory and browser-specific behavior remain manual checks.
