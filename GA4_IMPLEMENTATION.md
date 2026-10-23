# Default-on GA4 — HEIC2PNG.site

Updated October 24, 2026. Measurement ID: **G-W3XNRQR60H**.

The latest user instruction replaces the earlier regional opt-in behavior with automatic production tracking. No popup or Accept step remains. No commit, push, deployment, Nginx/Cloudflare change or TikSaveMP4 access was performed.

## Behavior

- When built with `PUBLIC_GA4_ENABLED=true`, a new visitor on `https://heic2png.site` starts one standard Google tag immediately on mobile and desktop.
- There is no country lookup, policy HEAD request, regional allowlist or dependency on `X-Analytics-Consent`. The client now ignores that header, **including a value of required**. Existing Cloudflare rules do not need editing for this client behavior.
- No fake acceptance is saved for new visitors. Existing explicit opt-outs and Global Privacy Control still block Analytics. Invalid preference records or unavailable preference storage also keep collection off rather than risking an ignored opt-out.
- Expiration of a historical acceptance does not trigger another Accept requirement. The new setting is default-on, rather than a recorded consent renewal.
- The footer Privacy choices link reaches inline **Turn off analytics / Turn on analytics** controls. Preferences persist until changed or browser storage is cleared. After an active tag is stopped, turning it on again resumes on the next page load to avoid duplicate configuration/views.
- Opt-out stops future collection, clears accessible first-party `_ga` cookies and reaches other open tabs without reloading or discarding their selected files. In-flight requests and previously sent data cannot be recalled. If saving fails, opt-out still blocks the current document.
- Localhost, development builds, HTTP/alternate origins and builds without the enable flag stay off. Ad blockers, network restrictions and browser privacy features may also prevent collection; “default-on” is not a guarantee that every request succeeds.

**Deployment limitation:** the regional prior-consent safeguard has been removed. This default-on cookie configuration is not appropriate where valid prior consent is required. Restore an appropriate consent mechanism before serving this configuration in those circumstances; do not describe the default as visitor consent or universally compliant. Google's [EU user consent policy](https://www.google.com/about/company/user-consent-policy/) requires consent for cookies/local storage where legally required. No legal determination about your visitors or jurisdictions was made here.

## Preserved protections

One external fingerprinted same-origin initializer creates one asynchronous official `gtag.js` and one `gtag('config', id, options)` per permitted document. GA4 supplies its normal initial page view. There are no manual page-view events, history listeners or duplicate-view injection on BFCache restoration. Repeated Turn on clicks do not send another config/view.

Google Ads storage/user data/personalization remain denied; Google signals and ad-personalization flags remain false; ads-data redaction stays on. Keep Ads destinations/linking off in the property. There is no Ads tag.

The canonical path and filtered public UTM labels preserve available campaign attribution; HTTP(S) referring origins preserve search/social/referral sources without forwarding their paths or query strings. Direct visits have an empty referrer. Safe labels use 1–100 letters/digits/dots/underscores/tildes/hyphens and start with a letter/digit; long numeric runs and image/archive filename suffixes are excluded. Other query parameters and fragments are omitted. Campaign owners must never put personal information in labels; a regex cannot identify every personal name hidden in an ordinary slug.

No application events pass selected images, filenames, EXIF, file contents, local paths, dimensions or conversion errors. Google runs in the page context, not a sandbox. Keep Enhanced Measurement (forms, file downloads, outbound interactions and history collection), automatic user-provided data, Google signals and Ads destinations off in GA4; use available email/query redaction as an extra safeguard. Account settings and Google's remotely maintained internals are not proven by local tests.

The existing Nginx CSP and script/connection hosts are unchanged. No inline executable GA script, new origins, relaxed worker/WASM policies or advertising domains are required. Conversion algorithms, quality controls, ZIP behavior, layout, SEO metadata, canonicals, sitemap and robots were not edited.

## Files changed in this pass

| File | Change |
| --- | --- |
| `public/analytics.js` | Removed the asynchronous regional/header gate; initialize by default when production is enabled. Preserved opt-outs, GPC, attribution, cookie cleanup and duplicate guards; scoped preference clicks to the inline controls. |
| `src/lib/privacy.mjs` | Updated the disclosure to reflect automatic collection; replaced Accept/Reject with Turn on/Turn off preferences. |
| `tests/analytics.spec.ts` | Default-on desktop/mobile and no-HEAD assertions; migration, GPC, opt-out, attribution, duplicate, failed-storage and actual conversion/download tests. |
| `scripts/validate-release.mjs` | Updated terminology for the runtime initializer and inline privacy controls. |
| `.env.example` | Updated the flag comment; retained the safe false example default. |
| `README.md`, this guide | Replaced regional activation instructions with actual default-on behavior and its deployment limitation. |

No additional files were deleted. The previous popup component and popup stylesheet remain removed.

## Build configuration and checks

Production build setting:

```bash
export PUBLIC_GA4_ENABLED=true
npm run check
npm run build
npm run validate:release
npm test
```

Preserve existing unrelated contact/ad build settings. No other analytics environment variable is required. Rebuilding is necessary; changing an environment variable after static HTML is built has no effect. Keep the flag disabled until the deployment limitation and GA4 property settings have been reviewed. No deployment was executed.

| Check | Result |
| --- | --- |
| `npm run check` | Passed application and worker TypeScript checks. |
| `npm run build` | Passed, generating 19 HTML documents. |
| `npm run validate:release` | Passed canonical, no-popup, privacy-link and worker/WASM artifact checks. |
| `npx playwright test tests/analytics.spec.ts --reporter=list` | **13/13 passed in 21.1 seconds**: immediate desktop/mobile startup, zero policy lookups, one config/view per navigation, attribution, saved opt-outs/GPC, local/flag gates, preference controls, failed storage, BFCache, and actual PNG/JPG/AVIF single/ZIP downloads and error handling. |
| Syntax/whitespace | `node --check public/analytics.js` and `git diff --check` passed. |

Google was stubbed; these tests did not send to the live GA4 property or establish Realtime receipt. The existing outdated Browserslist-data warning did not fail the build. No dependency versions were changed. No physical-device testing was performed.

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

Preserve established contact/ad build environment settings. Do not copy `.env` to the release. If tests cannot run on the VPS, stage only an artifact already tested from this exact commit and production environment in CI; record the skipped VPS checks accurately. The switch requires no Nginx reload. Verify the new fingerprinted initializer is served (Cloudflare may retain old HTML); if a purge is necessary, scope it to reviewed HEIC URLs only. Do not enable the tag until GA property prerequisites are satisfied. Rollback commands that preserve cached assets are in the deployment guide.



## Manual verification after a separately authorized release

1. Check that the new HTML has one fingerprinted analytics initializer and `data-enabled="true"`. Cached pages may still use an older implementation until reloaded or a separately reviewed HEIC-only cache purge occurs.
2. In a fresh test profile without a saved opt-out or GPC, open a production converter on mobile and desktop. Expect no popup or Accept step, one `gtag/js?id=G-W3XNRQR60H` request and no policy HEAD request.
3. Observe the real `g/collect` request in DevTools: `tid=G-W3XNRQR60H`, `en=page_view`, sanitized `dl` and referring origin `dr`. Confirm one initial view per navigation. Do not use personal information in test URLs.
4. Test safe synthetic UTMs such as `?utm_source=qa&utm_medium=test&utm_campaign=ga4-check`. Check the real property in [GA4 Realtime](https://support.google.com/analytics/answer/9271392?hl=en) and optionally [Tag Assistant](https://tagassistant.google.com/). Traffic acquisition classification may appear later. Do not weaken CSP for debugging.
5. Turn Analytics off through Privacy choices; verify cookie cleanup, subsequent pages remain off and another open converter tab retains its files while tracking stops. Test GPC independently. Use Turn on to restore the preference and navigate once after a previously started tag was stopped.
6. Verify PNG/JPG/AVIF and ZIP on real iOS/Android devices. Automated desktop Chrome does not establish physical-device memory behavior.

Google Realtime, Tag Assistant, actual source classification and physical devices were not observed by this task. No Cloudflare or Nginx changes are required for the new client behavior, but the absence of regional consent gating remains the deployment limitation stated above.
