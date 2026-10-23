// One standard Google tag. Consent gates loading; GA4 owns page-view delivery.
(() => {
  if (window.__heicGa4Installed) return;
  window.__heicGa4Installed = true;
  const id = 'G-W3XNRQR60H';
  const origin = 'https://heic2png.site';
  const key = 'heic2png-analytics-consent-v1'; // Preserve existing opt-outs.
  const lifetime = 180 * 86400000;
  const enabled = document.currentScript?.dataset.enabled === 'true' && location.origin === origin;
  const banner = document.getElementById('analytics-consent');
  const blocked = () => navigator.globalPrivacyControl === true;
  let started = false, revoked = false, automatic = false, dismissed = false, previousFocus;
  window['ga-disable-' + id] = true;

  function choice() {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return null;
      const saved = JSON.parse(raw);
      if (saved?.version !== 1 || !['granted', 'denied'].includes(saved.value) || !Number.isFinite(saved.expires) || saved.expires > Date.now() + lifetime) return 'invalid';
      if (saved.value === 'denied') return 'denied';
      return saved.expires > Date.now() ? 'granted' : 'expired';
    } catch { return 'unavailable'; }
  }
  const permitted = () => enabled && !blocked() && !revoked && (choice() === 'granted' || (choice() === null && automatic));
  function status(message) {
    document.querySelector('[data-analytics-consent="granted"]')?.toggleAttribute('disabled', !enabled || blocked());
    document.getElementById('analytics-consent-status').textContent = message || (!enabled ? 'Analytics is disabled here.' : blocked() ? 'Global Privacy Control keeps analytics off.' : permitted() ? 'Analytics is on. You can reject to turn it off.' : 'Analytics is off.');
  }
  function show(focus = false) {
    banner.hidden = false;
    document.querySelector('[data-analytics-settings]')?.setAttribute('aria-expanded', 'true');
    status();
    if (focus) { previousFocus = document.activeElement; document.getElementById('analytics-consent-title').focus(); }
  }
  function hide() {
    banner.hidden = true;
    document.querySelector('[data-analytics-settings]')?.setAttribute('aria-expanded', 'false');
    previousFocus?.focus(); previousFocus = null;
  }
  function pageFields() {
    let page = new URL('/404/', origin);
    try {
      const canonical = new URL(document.querySelector('link[rel="canonical"]').href);
      if (canonical.origin === origin) page = new URL(canonical.pathname, origin);
    } catch { /* Unknown paths are never forwarded. */ }
    // Campaign labels must be public labels, never customer/user information.
    const query = new URLSearchParams(location.search);
    for (const name of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_id', 'utm_term', 'utm_content']) {
      const value = query.get(name);
      if (value && /^[a-zA-Z0-9][a-zA-Z0-9_.~-]{0,99}$/.test(value) && !/\d{7}|\.(?:heic|heif|png|jpe?g|avif|zip)$/i.test(value)) page.searchParams.set(name, value);
    }
    let referrer = '';
    try { const url = new URL(document.referrer); if (/^https?:$/.test(url.protocol)) referrer = url.origin + '/'; } catch { /* Direct navigation. */ }
    return {page_location: page.href, page_referrer: referrer, page_title: document.title};
  }
  function start() {
    if (!permitted() || started) return;
    if (window.gtag || document.querySelector('script[src*="googletagmanager.com/"]')) { status('Another Google tag is present; this installation stayed off.'); return; }
    started = true;
    window['ga-disable-' + id] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied'});
    window.gtag('set', 'ads_data_redaction', true);
    window.gtag('js', new Date());
    window.gtag('config', id, {...pageFields(), allow_google_signals: false, allow_ad_personalization_signals: false, cookie_domain: 'heic2png.site', cookie_path: '/', cookie_expires: lifetime / 1000, cookie_update: false, cookie_flags: 'SameSite=Lax;Secure'});
    const tag = document.createElement('script');
    tag.id = 'heic-ga4-tag'; tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    tag.referrerPolicy = 'strict-origin';
    tag.onerror = () => status('Analytics could not load. The converter remains available.');
    document.head.append(tag);
  }
  function stop() {
    window['ga-disable-' + id] = true;
    if (started && !revoked) { revoked = true; window.dataLayer.length = 0; window.gtag('consent', 'update', {analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied'}); }
    document.getElementById('heic-ga4-tag')?.remove();
    for (const cookie of (location.origin === origin ? document.cookie : '').split(';')) {
      const name = cookie.trim().split('=')[0];
      if (/^_ga(?:_|$)/.test(name)) for (const domain of ['', '; Domain=heic2png.site', '; Domain=.heic2png.site']) document.cookie = name + '=; Max-Age=0; Path=/' + domain + '; SameSite=Lax; Secure';
    }
    status();
  }
  async function initialize() {
    if (!enabled || blocked() || choice() === 'denied') { stop(); return; }
    if (choice() === 'granted') { start(); return; }
    if (choice() === null) {
      const controller = new AbortController(), timer = setTimeout(() => controller.abort(), 2000);
      try {
        // Policy header is set per visitor at the edge, never by a query or build-time country list.
        const response = await fetch(location.pathname, {method: 'HEAD', cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer', redirect: 'error', signal: controller.signal});
        automatic = response.ok && response.headers.get('X-Analytics-Consent') === 'not-required';
      } catch { /* Missing/unavailable policy means prior opt-in. */ }
      finally { clearTimeout(timer); }
    }
    if (permitted()) { start(); if (!dismissed && !previousFocus) hide(); }
    else if (!blocked() && choice() !== 'denied' && !dismissed) show();
  }
  document.addEventListener('click', event => {
    if (event.target.closest?.('[data-analytics-settings]')) { event.preventDefault(); show(true); return; }
    const value = event.target.closest?.('[data-analytics-consent]')?.dataset.analyticsConsent;
    if (!['granted', 'denied'].includes(value) || (value === 'granted' && (!enabled || blocked()))) return;
    dismissed = true;
    try { localStorage.setItem(key, JSON.stringify({version: 1, value, expires: Date.now() + lifetime})); }
    catch { stop(); if (value === 'denied') hide(); else status('Your browser could not save this choice. Analytics remains off.'); return; }
    if (value === 'denied') { stop(); hide(); }
    else if (revoked) status('Choice saved. Analytics can resume on your next page load.');
    else { start(); hide(); }
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') { dismissed = true; hide(); } });
  window.addEventListener('storage', event => { if (event.key === key || event.key === null) { automatic = false; if (choice() !== 'granted') stop(); else start(); hide(); } });
  function recheck() { if (blocked() || (started && !permitted())) stop(); }
  window.addEventListener('focus', recheck);
  window.addEventListener('pageshow', recheck); // No extra manual page view on BFCache restoration.
  document.addEventListener('visibilitychange', recheck);
  setInterval(recheck, 60000);
  status(); void initialize();
})();
