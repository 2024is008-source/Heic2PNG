# GA4 without a consent popup — HEIC2PNG.site

Baseline: `8355a72`, verified as the current local HEAD. Updated October 24, 2026 (Asia/Colombo). Measurement ID: **G-W3XNRQR60H**. No commit, push, deployment, Nginx change, Cloudflare modification or TikSaveMP4 access was performed.

## Changes and deleted code

| File | Change |
| --- | --- |
| `public/analytics.js` | Removed popup open/close state, focus management, Escape handling and footer-link interception. Status output is optional and only updates inline policy controls. Preserved the standard Google tag, attribution filtering, consent/header gates, saved choices, GPC, cookie deletion, cross-tab updates and duplicate guards. A rejection also stays effective for the current document if storage cannot save it. |
| `src/components/AnalyticsConsent.astro` | **Deleted** the globally mounted popup component. |
| `src/styles/analytics-consent.css` | **Deleted** the fixed overlay, z-index, panel, popup-focus and popup-button rules. |
| `src/styles/privacy-choices.css` | Added narrowly scoped styles for the inline controls; no fixed position, modal, overlay or automatic reveal. |
| `src/pages/[...path].astro` | Removed the popup import/mount; imports inline-policy styles. Retains exactly one external fingerprinted analytics initializer and all existing metadata. |
| `src/lib/design.mjs` | Retained the footer Privacy choices link as a normal `/privacy/#analytics-preferences` anchor; removed obsolete popup attributes. |
| `src/lib/privacy.mjs` | Updated disclosure and placed equal Accept analytics / Reject analytics controls within the Privacy Policy, with an accessible status and no-JavaScript explanation. |
| `scripts/validate-release.mjs` | Checks the popup is absent, the footer link is reachable and inline controls occur only on the Privacy Policy, in addition to the existing canonical/asset checks. |
| `tests/analytics.spec.ts` | Replaced popup-specific tests with no-popup/inline-choice coverage; retained attribution, duplicate, consent, storage, GPC, CSP and actual PNG/JPG/AVIF/ZIP regressions. |
| `README.md`, this guide | Replaced obsolete banner descriptions and recorded deployment/verification instructions. |

No converter runtime, encoder, ZIP logic, SEO values, canonical helpers, sitemap, robots, fonts, logos, homepage layout, mobile styles or Nginx files were changed. Other than the requested removal of the shared popup, visible changes are confined to privacy-choice controls/disclosure on the Privacy Policy. No dependency or environment-variable additions were needed.

## Privacy behavior

| Visitor state | Result |
| --- | --- |
| Production enabled, no saved choice, trusted `X-Analytics-Consent: not-required` response | GA4 starts automatically on the current page, without visiting Privacy, accepting a prompt or storing invented consent. |
| `required`, missing, malformed, failed or timed-out policy response | No Google tag, analytics requests or Analytics cookies before opt-in. No popup appears. The normal footer link leads to inline Accept/Reject controls. Visitors may simply ignore analytics and use every converter. |
| Valid saved acceptance | GA4 starts automatically; acceptance expires after 180 days. |
| Saved rejection, including an old rejection timestamp | GA4 stays off until the visitor changes that choice or clears browser storage. |
| Global Privacy Control | GA4 stays off even with a permitting regional header or saved acceptance. Inline Accept is disabled while GPC is active. |
| Expired/malformed choice or unavailable preference storage | No automatic fallback to permission. A fresh successfully saved acceptance is needed. An unsuccessful save keeps collection off, including while policy resolution is in flight. |
| Disabled flag, development, localhost, alternate host or HTTP | No Google tag or policy request. Inline status explains that analytics is disabled. |

Privacy choices is a regular link on every public page, including when JavaScript is disabled. Its destination is a nonmodal section in the Privacy Policy, available by keyboard. Inline buttons have equal visual treatment, visible focus and a 44px minimum height. They remain disabled without JavaScript, and no analytics runs without JavaScript. There is no automatic modal, toast, consent banner, focus movement or forced choice.

The footer link uses ordinary full-page navigation. Open it in a separate tab if you want to retain a currently selected batch; rejection on the Privacy Policy propagates to other open tabs without reloading those tabs. Withdrawal sets Google's disable flag, clears pending initialization commands, informs a previously loaded tag of denial and deletes accessible first-party `_ga` cookies. Requests already in flight and previously sent data cannot be recalled. Reacceptance after an active tag was stopped takes effect on the next page load, avoiding another configuration/page view in that document. Focus/visibility/BFCache and a periodic check still enforce changed GPC/expiry; these are privacy rechecks, not popup handlers.

The visitor does not need to opt in where the reviewed policy allows automatic collection. In consent-required regions, pre-consent landing pages remain untracked; acceptance on the Privacy Policy begins measurement there. The implementation does not invent or retrospectively replay earlier page views or preserve pre-consent browsing history.

## Standard Google tag, attribution and privacy limits

The shared layout loads one same-origin external initializer. After permission, it inserts one asynchronous official `gtag.js` and calls `gtag('config', 'G-W3XNRQR60H', options)` once. GA4 supplies its initial automatic page view; no manual page-view controller or history injection was added. The static multipage site creates one configuration per new permitted document. See Google's [default page-view documentation](https://developers.google.com/analytics/devguides/collection/ga4/views).

The initializer still passes the canonical path with filtered `utm_source`, `utm_medium`, `utm_campaign`, `utm_id`, `utm_term` and `utm_content`, plus the HTTP(S) referring origin. Google/Bing/social/referral domains and safe campaigns remain available to GA4; direct visits keep an empty referrer. There is no blanket referral erasure or `ignore_referrer:true`. Query values must be public campaign slugs: 1–100 characters, starting with a letter/digit and containing only letters, digits, dots, underscores, tildes or hyphens. Long numeric runs and image/archive filename suffixes are excluded. Other query parameters, fragments, referrer paths and referrer queries are omitted. Filtered-out campaign formats will not be attributed from those values.

Application code sends no images, filenames, EXIF, file objects, image contents, local paths, dimensions or conversion errors. There are no custom converter events. Harmless-looking campaign labels cannot be reliably classified as nonpersonal by a regex; campaign owners must never encode personal data in them. Google runs as third-party JavaScript in the page context, not a sandbox.

Google Ads storage, user data and personalization remain denied. Google signals and advertising personalization flags are false, and ads data redaction remains enabled. No Ads tag is installed. Basic gating blocks Google's script until permission; it does not send advanced-mode cookieless pings before consent. Google documents the distinction in its [consent-mode overview](https://developers.google.com/tag-platform/security/concepts/consent-mode).

## Environment, GA4 account and CSP

Only analytics build flag:

```dotenv
PUBLIC_GA4_ENABLED=true
```

`.env.example` stays false. Rebuild to change the flag. Production requires both the build flag and the exact `https://heic2png.site` origin; a true flag does not enable localhost or Astro development. Preserve unrelated contact/ad build variables as currently configured.

Before activation, keep Enhanced Measurement (including form/file/download/outbound/history interaction collection), automatic user-provided data, Google signals and Ads destinations off in the GA4 property. Enable available email/query data redaction as an additional safeguard. Do not add another install through GTM, Zaraz, Cloudflare apps or snippets. Dashboard settings cannot be verified from this repository; they remain operator prerequisites.

**No Nginx/CSP changes are required or proposed.** The integration retains external same-origin initialization and the same Google hosts: `www.googletagmanager.com` for scripts; existing Google Analytics collection hosts for connections/images. The policy HEAD request is same-origin. Inline choices use external CSS, not inline executable JavaScript. Preserve the existing script/worker/WASM/ZIP allowances and all other security directives. No `unsafe-inline` JavaScript, broad new origins or advertising domains are needed. The browser tests use the existing GA-permissive policy with a stubbed Google script; real collection still needs post-release observation.

## Exact manual Cloudflare policy changes

Do not change Cloudflare automatically. A global `X-Analytics-Consent: required` rule will keep new, unconsented visitors untracked; it **will no longer cause a popup**, because the popup code is removed. This is the correct safe fallback. To allow automatic tracking in an approved jurisdiction, use a narrow exception, not a global header replacement.

In the **heic2png.site zone only**, under Rules → Transform Rules → Modify Response Header:

1. Keep the default response rule `(http.host eq "heic2png.site")` setting **one** `X-Analytics-Consent` header to `required`.
2. After that rule, create an exception matching only a reviewed set of jurisdictions where this site's actual configuration permits analytics without prior opt-in. Use **Set**, not Append, with the same header and value `not-required`.
3. For example, **only after review approves the US for this deployment**, the exception expression is:

```text
(http.host eq "heic2png.site" and ip.src.country in {"US"})
```

This is a rule example, not a determination that every US situation is exempt. With no approved jurisdictions, leave the default rule alone. Keep consent-required and unknown regions on `required`; do not blanket-allow the world outside Europe. Country-level policy is coarse: use opt-in wherever state, age, purpose or other requirements cannot be resolved adequately. GPC and explicit opt-outs override every region.

Apply response transforms per visitor to HEAD and normal responses, including cache hits. Do not bake regional permission into static HTML or a shared cached body. Cloudflare's [response-header documentation](https://developers.cloudflare.com/rules/transform/response-header-modification/) explains visitor-country evaluation. The browser reads only this policy header through a same-origin HEAD to the current pathname, omitting query, fragment, credentials and referrer; it rejects redirects and times out after two seconds. No country/IP diagnostic body or third-party geolocation service is involved.

Validate with clean storage from actual eligible and consent-required locations, including warm cache hits. Check the HEAD response's single header. A spoofed browser request header does not prove geographic behavior. No live Cloudflare dashboard rules were inspected or altered here.

## Verification results

| Check | Result |
| --- | --- |
| `npm run check` | Passed application and worker TypeScript checks. |
| `npm run build` | Passed; generated 19 HTML documents. The normal build retains the disabled-by-default analytics flag. |
| `npm run validate:release` | Passed 18 canonical sitemap pages, assets/worker/WASM and the new no-popup/privacy-link checks. |
| `npx playwright test --reporter=list` | **58/58 passed in 2.6 minutes**, including all 14 analytics scenarios, actual PNG/JPG/AVIF conversions, single/ZIP downloads, failures, queue behavior, mobile widths, themes, links, metadata and structured data. |
| Additional generated-HTML inspection | All 19 documents (including 404) have no popup, exactly one normal Privacy choices footer link, no popup-specific footer attributes, and inline controls only on `/privacy/`. |
| Visual inspection | Inline controls were checked in the generated dark mobile Privacy screenshot; light/dark button sizing and keyboard operation were tested. |
| `node --check public/analytics.js`, `git diff --check` | Passed. Git's LF/CRLF notices are informational. |
| Real GA4 Realtime, Tag Assistant and actual regional Cloudflare policy | Not observed or changed; follow the manual verification below. |

Google requests were stubbed throughout automated testing. The mock records one default-config page view; it does not establish real Google receipt. The existing outdated Browserslist-data warning did not fail the build. No dependencies were changed. Physical iOS/Android and browser-specific memory limits still need real-device testing.

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


## Manual post-release verification

1. Confirm the new HTML loads one fingerprinted initializer, no old popup markup/CSS and no extra GTM/Zaraz installation. Confirm the build's `data-enabled="true"` and inspect Console for CSP errors.
2. In a fresh consent-required or unknown region, open the converter. No popup, Google script, collect request or `_ga` cookie should appear. PNG/JPG/AVIF conversion and ZIP should still work. Follow the footer link; Accept and Reject must be inline on Privacy. Accept starts measurement only then; Reject remains off after reload/navigation.
3. In a reviewed automatic region, verify the HEAD response says `not-required`: the current page should initialize GA4 immediately without a Privacy visit or user action. Repeat with saved rejection and GPC; both must prevent collection.
4. In DevTools Network, observe real `g/collect` traffic with `tid=G-W3XNRQR60H` and `en=page_view`. Confirm one initial view per permitted document and none from repeated Accept. Check decoded `dl`/`dr` for safe campaign labels and referring origin. Use synthetic public labels, never PII.
5. Visit `https://heic2png.site/?utm_source=qa&utm_medium=test&utm_campaign=ga4-check`, navigate once, and inspect the correct property in [GA4 Realtime](https://support.google.com/analytics/answer/9271392?hl=en). Optionally connect [Tag Assistant](https://tagassistant.google.com/) under the existing CSP. Do not weaken CSP for debug tooling. Traffic acquisition reports may take longer than Realtime; test real Google/Bing/social/referral journeys separately.
6. Keep a converter tab with selected files open, reject analytics from Privacy in another tab and confirm the original tab disables collection while retaining its files. Check accessible `_ga` cookies are cleared. Reacceptance after stopping the tag resumes on the next page load. Previously sent/in-flight data cannot be recalled.
7. Check mobile Privacy controls in light/dark modes and converters/downloads on actual iOS/Android devices. Local automated browser execution does not substitute for physical-device testing.

Realtime, Tag Assistant, actual regional header rules and real traffic-source classification have not been observed by this task. Do not label them verified until the operator performs these checks after a separately authorized release.
