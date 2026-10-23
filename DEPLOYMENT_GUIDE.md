# HEIC2PNG-only manual release and rollback guide

These are instructions for an operator, not actions performed by this task. Never change `tiksavemp4.online`, its certificate, `TTsave`, shared default server files or unrelated PM2 apps. This static Astro site needs no PM2 process. No commit/push, deployment, Cloudflare update or live reload is automated.

## 1. Verify the actual installation before choosing paths

On the VPS, inspect `sudo nginx -T`, `sudo certbot certificates`, `readlink -f /var/www/heic2png.site/current` and the existing HEIC repository remote. Identify ONLY the server blocks with `server_name heic2png.site` or `www.heic2png.site`. Record their file paths, roots, certificate paths and current symlink target. No VPS access was available in this task, so the actual configured root has not been asserted to equal the example.

**Stop if the active HEIC TLS block does not use `root /var/www/heic2png.site/current;`, or if `current` is a real directory instead of a symlink.** First prepare/review the HEIC-only root change and preserve the old root for rollback. Do not rename/delete a source checkout or another website to make an example command fit. All paths below assume that exact reviewed HEIC base; substitute paths consistently only after checking the real installation.

Keep Cloudflare **Full (strict)** with valid origin TLS and a certificate covering both HEIC apex and www. Do not use Flexible mode with an origin HTTPS redirect. Review existing redirect rules to avoid competing host/slash rules; this task did not inspect the dashboard. Keep the existing certificate and renewal timer. Preserve webroot `/var/www/heic2png.site/acme/.well-known/acme-challenge/` for both names. Do not issue/overwrite a certificate just because the sample includes paths.

## 2. Build the reviewed commit outside the active release

Use a non-root deployment account with write access only to the HEIC build/release directories. Set `SOURCE_REPO` to the verified existing HEIC source checkout, `COMMIT` to the reviewed full commit ID and `RELEASE_ID` to a new unique name. Do not use placeholders verbatim.

```bash
BASE=/var/www/heic2png.site
SOURCE_REPO=/path/to/verified/HEIC2PNG-checkout
COMMIT=REPLACE_WITH_REVIEWED_FULL_COMMIT_SHA
RELEASE_ID=REPLACE_WITH_UNIQUE_RELEASE_NAME

git -C "$SOURCE_REPO" remote get-url origin
# Must be the reviewed 2024is008-source/Heic2PNG repository.
git -C "$SOURCE_REPO" fetch origin --prune
git -C "$SOURCE_REPO" cat-file -e "$COMMIT^{commit}"
mkdir -p "$BASE/builds" "$BASE/releases"
test ! -e "$BASE/builds/$RELEASE_ID"
test ! -e "$BASE/releases/$RELEASE_ID"
git -C "$SOURCE_REPO" worktree add --detach "$BASE/builds/$RELEASE_ID" "$COMMIT"
cd "$BASE/builds/$RELEASE_ID"

node --version
npm ci
npm run build
npm run check
npm run test:sitemap-build
npm run test:repro
npm test
npm run validate:release
git status --short
```

Use the tested Node 24 line and committed lockfile. Browser tests require the configured Chrome channel (or an explicitly configured installed Playwright Chromium). Provision the test browser in a reviewed CI/build environment, not by restarting services on the shared VPS. If the VPS lacks a browser, use the artifact tested in CI from this exact commit/environment and record that fact; don't label skipped tests as passes. The local Windows clean-install/native-binding lock is avoided by this fresh worktree/isolated install; don't kill unrelated running previews to unlock dependencies.

Normal builds generate `src/generated/`, `.astro/` and `dist/`; they do not rewrite tracked Markdown/client/CSS. `npm run prepare:content` is an explicit editorial migration command, not part of deployment. Do not use `npm audit fix --force`, `git reset --hard`, `git clean` or automatic stashing to bypass an old dirty checkout. Inspect and preserve its diffs separately. Keep any intentional `PUBLIC_CONTACT_EMAIL`/`PUBLIC_SHOW_AD_AREAS` values in the build environment; no private `.env` may be copied into the public directory.

## 3. Stage only the public artifact and retain cached chunks

```bash
NEW="$BASE/releases/$RELEASE_ID"
mkdir "$NEW"
rsync -a dist/ "$NEW/"
node scripts/validate-release.mjs "$NEW"
test ! -e "$NEW/.git"
test ! -e "$NEW/.env"
test ! -e "$NEW/node_modules"
test -L "$BASE/current"
OLD=$(readlink -f "$BASE/current")
case "$OLD" in "$BASE"/releases/*) ;; *) echo 'STOP: unexpected old release'; exit 1;; esac
test -d "$OLD"
# Retain old fingerprinted chunks for visitors with pages already open.
if test -d "$OLD/_astro"; then rsync -a --ignore-existing "$OLD/_astro/" "$NEW/_astro/"; fi
printf '%s\n' "$OLD" > "$BASE/previous-release-$RELEASE_ID.txt"
```

This copies only trusted fingerprinted `_astro` assets forward; no old HTML, repository metadata or private environment is merged. Original TTF/PNG URLs remain available for older cached font CSS/pages. Keep Nginx read/traverse permissions for the chosen deploy account/group; do not make the repository world-writable or expose source as the document root.

## 4. Switch atomically, then verify

```bash
TEMP="$BASE/current.next.$RELEASE_ID"
test ! -e "$TEMP"
ln -s "$NEW" "$TEMP"
mv -Tf "$TEMP" "$BASE/current"
readlink -f "$BASE/current"
```

`current.next.*` and `current` must be on the same filesystem. A symlink swap with unchanged Nginx root needs **no Nginx reload and no PM2 restart**. Verify publicly and, when authorized, directly against the origin using `curl --resolve`; Cloudflare may cache an older response. Check the 18 canonical pages, sitemap, robots, icons/manifest/social image, actual worker/WASM requests, conversions, downloads and a random real 404. Check old-open-page lazy conversion after the switch. Do not purge an unrelated site's cache.

## 5. Roll back without losing new-page assets

Use the recorded exact previous release, not a guessed directory:

```bash
OLD=$(cat "$BASE/previous-release-$RELEASE_ID.txt")
case "$OLD" in "$BASE"/releases/*) ;; *) echo 'STOP: unexpected rollback target'; exit 1;; esac
test -d "$OLD"
# Keep chunks used by visitors who loaded the newer release before rollback.
if test -d "$NEW/_astro"; then rsync -a --ignore-existing "$NEW/_astro/" "$OLD/_astro/"; fi
TEMP="$BASE/current.rollback.$RELEASE_ID"
test ! -e "$TEMP"
ln -s "$OLD" "$TEMP"
mv -Tf "$TEMP" "$BASE/current"
readlink -f "$BASE/current"
```

Recheck the old release and converter assets. This changes only the HEIC symlink and retained public chunks. No restart is needed. Keep both release directories until successful verification and the rollback window have passed. Garbage collection is a separate manual task: list candidate paths, resolve them, exclude current/previous targets and required cached chunks, then review before deletion. No automatic cleanup command is provided.

## 6. Separately review/install the Nginx proposal

`deploy/heic2png.site.conf` and `deploy/heic2png.canonical.conf.example` are identical alternatives; **install exactly one, never both**. The current `heic2png.site.conf` is a complete TLS proposal, replacing the old HTTP-only bootstrap reference. It is an http-context site include, not a full shared nginx.conf. Verify the actual HEIC root, certificate paths, enabled include and MIME mappings against step 1. Keep a dated backup of ONLY the existing HEIC site file and a copy of the existing symlink target. Don't append duplicate server-name blocks.

The proposal preserves normal 200 pages, permanent www/HTTPS/slash/index redirects, query strings, ACME on port 80, real 404s, CSP WASM/worker support and correct XML/manifest/font MIME. A host-plus-path alias takes two redirects; canonical URLs do not redirect. The test uses a generated one-day local certificate and loopback ports, not the real certificate or production server.

After manual review, copy only the chosen HEIC site file to its verified existing HEIC path (do not replace shared/default files). Then the operator may run `sudo nginx -t` and, only if successful, `sudo systemctl reload nginx`. If validation fails, restore the backed-up HEIC file before any reload. Configuration rollback similarly restores ONLY that file, tests syntax, then reloads. These commands are documented, not executed by Codex. No Let's Encrypt material is replaced. Validate renewal with the HEIC certificate's existing webroot/renewal configuration; avoid a blanket command affecting unrelated certificates.

## Search Console after release

Submit/recheck `https://heic2png.site/sitemap.xml`, inspect representative tool/article URLs, compare declared and Google-selected canonicals after recrawl, and review indexing/404/redirect reports. Check genuine rich-result eligibility and field Core Web Vitals separately. Neither sitemap generation nor a passing local test proves indexing, ranking gains, complete security or real-device support.
