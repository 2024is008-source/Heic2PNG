# HEIC2PNG GA4 visitor and download tracking

Updated: October 27, 2026. Measurement ID: **G-W3XNRQR60H**.

The current request restores legally required consent gating and adds safe download-initiation events. The previous unconditional production-start behavior has been replaced. No commit, push, deployment, Cloudflare/Nginx modification or TikSaveMP4 access was performed.

## Changed files

| File | Change |
| --- | --- |
| `public/analytics.js` | One official tag and automatic page views; trusted permission-header check, valid saved consent, GPC/DNT/Google opt-out handling; allowlisted download events with permission checks before enqueueing and sending. |
| `src/scripts/runtime.txt` | Emits only download type/known format after invoking a native save for a converted file or generated ZIP. All existing controls use this shared path. No encoding/quality/ZIP contents or UI changes. |
| `src/lib/privacy.mjs` | Updated the disclosure for conditional collection and download starts, without promising completed downloads. Existing inline choices remain. |
| `tests/analytics.spec.ts` | Consent/default-state tests, automatic desktop/mobile visits, source attribution, all download controls/formats, repeats, failed/blocked telemetry, opt-outs and metadata allowlisting. |
| `tests/production-fixes.spec.ts` | Stabilizes the existing keyboard upload check by verifying dropzone focus and sending Enter to that element before awaiting the file chooser. |
| `.env.example` | Updated the activation comment; the single analytics activation flag still defaults false. |
| `README.md`, this guide | Current behavior, dashboard reporting, custom dimensions, manual configuration and deployment instructions. |

No new dependency, tracker, Google tag, runtime country list or country-detection endpoint was added. The existing popup remains removed. Conversion algorithms, image quality, single-image and ZIP behavior, responsive layouts, branding, SEO values, canonical URLs, sitemap, robots and Nginx files are unchanged. No obsolete optional-event or country environment flags are needed.

## One Google tag and appropriate permission

Build production with `PUBLIC_GA4_ENABLED=true`. The initializer also requires the exact `https://heic2png.site` origin, so localhost, development builds and alternate hosts remain off. Google `gtag.js` loads once, with one `config` call for the property per permitted document. GA4 sends its normal automatic page view; there are no manual `page_view` events or history controllers. Re-running the initializer does not register another tag or duplicate the download listener.

| State | Tracking behavior |
| --- | --- |
| No preference; trusted response says `X-Analytics-Consent: not-required` | Starts automatically on the current production page, without a Privacy visit or invented saved acceptance. |
| Response says `required`, is absent/invalid, fails, redirects or times out | No Google tag, analytics requests or Analytics cookies until an explicit Turn on analytics choice on the Privacy Policy. No popup interrupts conversion. |
| Valid saved permission | Starts automatically; permission expires after 180 days. |
| Saved rejection | Stays off, including when its historical expiry timestamp has passed. |
| Expired/corrupt permission record or unavailable storage | Stays off until a valid new choice can be saved; never silently overrides a possible opt-out. |
| GPC, Do Not Track or a pre-existing Google disable flag | Stays off; the UI cannot override that browser signal. |
| Permission withdrawn while an event is waiting | Drops that event before transmission. No pre-consent download events are queued or replayed later. |

The static site reads only a permission decision from a same-origin HEAD request to the current pathname. It omits query, fragment, credentials and referrer, rejects redirects and aborts after two seconds. It never calls `/cdn-cgi/trace`, looks up IP/country data, guesses from language/timezone, or stores country information. A trusted host/edge rule or CMP must determine the applicable policy. Country detection is not an analytics requirement: GA4's standard reports supply country/device/browser dimensions when measurement is permitted.

The existing footer Privacy choices link leads to inline Turn on analytics / Turn off analytics controls. The disclosure makes clear that turning it on permits Google Analytics cookies. This is basic Consent Mode: no Google resource is loaded before permission; the Google consent defaults are denied, then analytics storage is granted only after permission is established. Ads storage/user data/personalization remain denied. See Google's [consent-mode overview](https://developers.google.com/tag-platform/security/concepts/consent-mode) and [implementation guide](https://developers.google.com/tag-platform/security/guides/consent).

Withdrawal disables the property, clears pending commands and accessible first-party `_ga` cookies, and propagates to other open tabs without losing those tabs' selected files. Already-sent/in-flight requests cannot be recalled. If an active tag was stopped, enabling it again takes effect on the next page load, avoiding another page-view configuration in the same document. If a preference cannot be saved, opting out still stops the current document. Permission checks remain active on focus/visibility, BFCache restoration and periodically.

## Download events and counting semantics

| Event | Custom parameters | When it is emitted |
| --- | --- | --- |
| `file_download` | `output_format`: `png`, `jpg` or `avif`; `download_type`: `single` | After an existing download action invokes the native save for a successfully converted image. |
| `zip_download` | `download_type`: `zip`; `output_format` only if all files have the same known format | After ZIP generation succeeds and the ZIP is handed to the native save action. |

The format is determined from allowlisted converted Blob MIME types, not a filename. A mixed/unknown ZIP omits the format rather than guessing. Routing uses the fixed property ID and sanitized standard page context; arbitrary event details are never spread into a GA request.

All controls converge on the same native save path: green single-image banner, green batch ZIP banner, main image/ZIP controls, desktop row buttons and mobile row icons. There are no additional click trackers. One native save request creates at most one analytics event; a separately initiated repeat download creates another event. Two image downloads followed by a ZIP should increment `file_download` by 2 and `zip_download` by 1, not count the ZIP's contents as individual-image downloads.

Unavailable/disabled controls, uploads, mere conversions, failed native save calls and failed ZIP generation do not create a download event. Browser request blockers and failed `gtag` calls do not interrupt the native save. Telemetry is deferred after the save request, never awaited, and fails silently. Permission must be valid both when the native save is observed and when the telemetry call executes.

**These are initiation counts, not completed-file counts.** A normal web page cannot confirm that the user finished saving a file or that the browser did not subsequently block/cancel it. Native anchor invocation is the observable handoff. The tests separately confirm actual browser download events and valid resulting files, but the production event does not claim completion.

## What is excluded and how attribution is preserved

No event includes uploaded images, filenames, file paths, image contents, EXIF, image dimensions, image sizes, counts of images, raw errors or personal details. No upload/conversion events are collected. The event boundary accepts only the documented type/format values plus sanitized static page context and the fixed routing ID. The Google tag executes in the page context, not a sandbox; remote property settings below remain release prerequisites.

The initializer preserves the canonical page path, safe public `utm_source`, `utm_medium`, `utm_campaign`, `utm_id`, `utm_term`, `utm_content` values and HTTP(S) referring origins. It does not blank legitimate referring domains or set `ignore_referrer:true`. Other query parameters, fragments, referrer paths and queries are omitted. Safe labels start with a letter/digit, contain only letters/digits/dots/underscores/tildes/hyphens, and are at most 100 characters; long numeric runs and image/archive filename suffixes are excluded. Unsupported campaign formats are intentionally dropped. Never encode personal data in campaign labels; a regex cannot identify every disguised personal name.

Google/Bing, social and referring-site origins remain available to standard GA4 attribution, along with filtered public campaigns. Direct visits have an empty referrer. Browser referrer policies, blockers and missing consent can reduce observed attribution. If consent is first given on the Privacy Policy, pre-consent browsing/landing history is not stored or replayed retrospectively. Automated tests verify supplied configuration, not Google's final channel classifications.

## Where to see the requested statistics

Choose the correct property and date range first. Report collections can differ; Editors can restore missing standard reports.

| Question | GA4 view and metric |
| --- | --- |
| Total website visitors | Explore → Free form, metric **Total users** over the selected date range. Standard reports often emphasize Active users; do not confuse that with total users. |
| Google organic search visitors | Reports → Acquisition → Traffic acquisition; use **Session source / medium** and filter `google / organic`. Use Users for visitors or Sessions for visits. For an explicit Total users measure, use Explore with the same source/medium filter. |
| Bing/social/referral/campaign traffic | Use Session source / medium, Session default channel group and Session campaign in Traffic acquisition or Explore. First user dimensions answer first acquisition, not every subsequent visit. |
| Total individual-image download starts | Reports → Engagement → Events: `file_download`, metric **Event count**. This counts repeats, not unique downloaders or files saved to disk. |
| Total ZIP download starts | Same Events report: `zip_download`, metric **Event count**. |
| Downloads by output format | Explore → Free form: rows **Output format**, columns **Event name**, values **Event count**; filter Event name to `file_download` or `zip_download`. Register the dimension below first. |
| Countries | Country in Demographic details or Explore. |
| Devices and browsers | Reports → Tech → Tech details, using Device category and Browser, or those dimensions in Explore. |

Google documents [user metrics](https://support.google.com/analytics/answer/12253918?hl=en), [Traffic acquisition](https://support.google.com/analytics/answer/12923437?hl=en), [Events](https://support.google.com/analytics/answer/12926615?hl=en), [Tech details](https://support.google.com/analytics/answer/12980150?hl=en) and [Country reporting](https://support.google.com/analytics/answer/12948931?hl=en). These figures represent observed, permitted measurement, not an unconditional count of every human visitor.

## Register `output_format` as an event-scoped dimension — manual dashboard action

Use an Editor/Administrator account for this property:

1. Admin → Data display → Custom definitions → Custom dimensions → Create custom dimension.
2. Dimension name: **Output format**.
3. Scope: **Event**.
4. Event parameter: **`output_format`** (exact spelling).
5. Save. Optionally repeat for **Download type**, Event scope, parameter `download_type`.

No GA dashboard Create event rule is needed: the browser sends the two event names directly. Do not create rules that duplicate those events. Reports using the new dimension can require 24–48 hours after data collection and definition creation; it does not retroactively reconstruct parameters from earlier events. Realtime event details can help inspect newly received parameters. See Google's [event-scoped dimension instructions](https://support.google.com/analytics/answer/14239696?hl=en). Marking an event as a key event is optional and was not done here.

## GA4 dashboard prerequisites — manual review only

- Admin → Data collection and modification → Data streams → select the HEIC web stream → Enhanced measurement settings: **turn automatic File downloads OFF**. Otherwise Google may produce duplicate `file_download` events and automatic file/link metadata outside this allowlist. Keep the existing privacy baseline of other automatic interaction measurements (forms, outbound links, searches, history interactions) off; turning Enhanced measurement off does not remove the initial page view sent by the standard `config` call.
- Keep automatic user-provided data collection, Google signals, Ads destinations/personalization and additional tag destinations off. Keep only this GA4 installation; no GTM/Zaraz/second Google snippet is required.
- Review available email/query data redaction and existing data filters. An internal/developer filter may exclude QA traffic; do not mistake filtering for a code failure.
- No custom country/device/browser event parameters are needed; use GA4's standard dimensions.

These settings were not changed or certified from this repository. Google documents the [Enhanced measurement controls and collected parameters](https://support.google.com/analytics/answer/9216061?hl=en). Account settings can affect duplication and privacy even when source code is correct.

## Cloudflare policy and existing CSP — separate manual actions

A read-only public fetch on October 27, 2026 returned HTTP 200, one external fingerprinted initializer with `data-enabled="true"`, `X-Analytics-Consent: required`, and no Cloudflare Analytics beacon in that HTML response. That observation is not a global geographic audit or proof of every dashboard setting.

The application now respects the existing policy header. Keep `required` as the safe default. Automatic first-visit tracking needs a narrowly scoped, reviewed `not-required` exception where this site's actual use is permitted without prior opt-in. In the **heic2png.site zone only**, use response-header transforms in this order:

1. `(http.host eq "heic2png.site")`: **Set** `X-Analytics-Consent` to `required`.
2. A later rule restricted to an approved jurisdiction set: **Set**, not Append, that same header to `not-required`.

For example, **only if review approves the US for this configuration**, use:

```text
(http.host eq "heic2png.site" and ip.src.country in {"US"})
```

This example is not a legal conclusion about every US situation. Without an approved jurisdiction list, retain required. Do not replace the header globally, assume all non-European countries are exempt, or cache a visitor-specific permission in shared static HTML. Apply response transforms per visitor to HEAD/normal responses and cache hits; verify actual locations with clean test profiles and then verify GPC/opt-out override them. Cloudflare documents [response-header transforms](https://developers.cloudflare.com/rules/transform/response-header-modification/).

Do not enable Cloudflare Web Analytics, a Zaraz analytics provider or another tracker. No such service was added. If a dashboard feature separately injects one, its removal is an operator task limited to HEIC, not this source change.

**Nginx/CSP change required: none.** The observed policy already allows the official tag host in script-src, GA collection hosts in connect-src/img-src, and same-origin permission checks. External initialization uses no inline executable GA script. Existing WASM/worker/blob allowances and ZIP behavior are preserved; no security directive was weakened. TikSaveMP4 and all VPS configuration remain untouched.

## Test results and live-verification limit

Validated locally on October 27, 2026:

- `npm run check`: passed (application and worker TypeScript).
- `npm run build` with `PUBLIC_GA4_ENABLED=true`: passed, 19 HTML pages.
- `npm run validate:release`: passed, 18 canonical pages plus error rules, icons and converter artifacts.
- Full Playwright regression suite: **65/65 passed** after correcting the existing keyboard-picker test's focus targeting. The first run had passed 64 and timed out on that picker; three isolated repeats and the subsequent full run passed. This includes actual HEIC-to-PNG/JPG/AVIF files, ZIP contents, thumbnails, all download controls, mobile layouts, consent, attribution, SEO, assets and workers/WASM.
- `npm run test:sitemap-build`: passed, including isolated published/draft/noindex builds.
- Final static inspection: all 19 HTML pages contain one enabled external initializer, no consent popup or extra analytics provider, with inline privacy controls only on the Privacy page. JavaScript syntax and `git diff --check` passed.

The permission HEAD URL was then explicitly anchored to the production origin to handle double-slash paths safely; the final Analytics-only rerun passed **21/21**, including the new same-origin regression and all consent/download cases. Automated Google traffic is stubbed; recorded calls are not proof of Google receipt. The browser tests use desktop Chrome and mobile-sized Chrome viewports, not physical phones. The build emits an existing outdated Browserslist database advisory; no dependency changes were made.

**Realtime is not verified.** The existing Firefox Analytics window was discovered, but Computer Use ended because browser URL-policy enforcement is not supported for that Windows browser. No further UI automation or account changes were attempted. The live fetch above only inspected public HTML/headers; it did not send a test page view or download event. No real GA4 test traffic was deliberately sent by the automated suite. Property receipt, dashboard settings and real channel classification remain manual checks rather than claimed passes.

### Realtime and production verification — manual after a separately authorized release

1. Select the property whose web stream uses `G-W3XNRQR60H`. Confirm one new fingerprinted initializer, no additional Google installation and no Cloudflare/Zaraz analytics beacon.
2. In a reviewed eligible location, use a fresh test profile without opt-out/GPC/DNT and visit `https://heic2png.site/?utm_source=qa&utm_medium=test&utm_campaign=ga4-download-check`. Check the policy HEAD response is `not-required` and the tag starts without a Privacy visit. In a consent-required location, verify no Google script/collect/cookies before the existing Privacy choices → Turn on analytics action. Do not clear another user's opt-outs or bypass consent just to make a report populate.
3. With measurement permitted, convert a test file and use the green single-image button, main image download and row button (including mobile). In DevTools, inspect real `g/collect` requests for `tid=G-W3XNRQR60H`, `en=file_download`, `ep.output_format` and `ep.download_type=single`; no filename, file size or image data should appear. A single intentional repeat should add one event. Google may batch events, so HTTP request count is not the same as event count.
4. Convert a batch and use both ZIP controls. Expect one `zip_download` per initiated ZIP, `download_type=zip` and only an unambiguous known `output_format`. The ZIP must still work if Google is blocked. Failed generation/unavailable controls must not add an event.
5. In GA4 Realtime → Event count by Event name, observe the actual new `page_view`, `file_download` and `zip_download` traffic. Inspect event parameter values. Realtime covers the recent window; processed Events reports may take up to 24 hours. A collector's HTTP response alone is not proof of Realtime appearance. Optionally use Tag Assistant without weakening CSP.
6. Reject analytics and confirm further downloads still save but no additional analytics is sent. Check another open converter tab retains its queue while tracking stops. Repeat with GPC/DNT and a blocked Google script.
7. Check normal reporting later for `google / organic`, referral domains and synthetic public UTMs. Country/device/browser and unique-user numbers need actual property data; local mocks do not establish these classifications. Test physical iOS/Android separately.

## Exact manual VPS release commands

Do not execute automatically. Skip the Nginx proposal/reload sections of the older deployment guide for this Analytics change; preserve the live CSP. Use the reviewed HEIC-only symlink release process in [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md). That guide's root assumption is `/var/www/heic2png.site/current`; first inspect the existing HEIC server block read-only and **stop if the actual root differs**. Do not change another server block, restart services, modify shared configuration, or copy a repository into the public root.

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
