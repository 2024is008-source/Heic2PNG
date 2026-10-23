// Basic consent mode: no Google tag, connections or event queue before opt-in.
(() => {
  if (window.__heicGa4Installed) return;
  window.__heicGa4Installed = true;
  const source = document.currentScript;
  const id = 'G-W3XNRQR60H';
  const key = 'heic2png-analytics-consent-v1';
  const lifetime = 180 * 24 * 60 * 60 * 1000;
  const eligible = source?.dataset.enabled === 'true' && location.origin === 'https://heic2png.site' && navigator.globalPrivacyControl !== true;
  const eventsEnabled = source?.dataset.events === 'true';
  let started = false, stopped = false, pageViewed = false;
  window['ga-disable-' + id] = true;

  function choice() {
    try {
      const saved = JSON.parse(localStorage.getItem(key) || 'null');
      return saved?.version === 1 && Number.isFinite(saved.expires) && saved.expires > Date.now() && saved.expires <= Date.now() + lifetime ? saved.value : 'denied';
    } catch { return 'denied'; }
  }
  function permitted() { return eligible && !stopped && choice() === 'granted'; }
  function status(message) {
    for (const button of document.querySelectorAll('[data-analytics-consent]')) {
      button.setAttribute('aria-pressed', String(button.dataset.analyticsConsent === choice()));
      if (button.dataset.analyticsConsent === 'granted') button.disabled = !eligible;
    }
    const el = document.getElementById('analytics-consent-status');
    if (el) el.textContent = message || (!eligible ? 'Analytics is disabled on this environment or by your browser privacy signal.' : choice() === 'granted' ? 'Optional analytics: allowed.' : 'Optional analytics: off.');
  }
  function pageFields() {
    // Use only server-rendered metadata, never location.search/hash or referrers.
    const canonical = document.querySelector('link[rel="canonical"]')?.href;
    let url = 'https://heic2png.site/404/';
    try {
      const parsed = new URL(canonical);
      if (parsed.origin === 'https://heic2png.site') url = parsed.origin + parsed.pathname;
    } catch { /* Unknown routes share the static 404 URL. */ }
    return {page_location: url, page_title: document.title, page_referrer: ''};
  }
  function pageView() {
    if (!started || !permitted() || pageViewed) return;
    pageViewed = true;
    window.gtag('event', 'page_view', {...pageFields(), send_to: id});
  }
  function start() {
    if (!permitted() || started) return;
    // Fail closed if a separate installation is introduced later.
    if (window.gtag || document.querySelector('script[src*="googletagmanager.com/"]')) {
      status('Analytics was not started because another Google tag is present.');
      return;
    }
    started = true;
    window['ga-disable-' + id] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    const denied = {analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied'};
    window.gtag('consent', 'default', denied);
    window.gtag('consent', 'update', {...denied, analytics_storage: 'granted'});
    window.gtag('set', 'ads_data_redaction', true);
    window.gtag('js', new Date());
    window.gtag('config', id, {
      ...pageFields(), send_page_view: false,
      allow_google_signals: false, allow_ad_personalization_signals: false,
      ignore_referrer: true, cookie_domain: 'heic2png.site', cookie_path: '/',
      cookie_expires: lifetime / 1000, cookie_update: false,
      cookie_flags: 'SameSite=Lax;Secure'
    });
    const tag = document.createElement('script');
    tag.id = 'heic-ga4-tag';
    tag.async = true;
    tag.referrerPolicy = 'no-referrer';
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    tag.onerror = () => status('Analytics could not load. Your converter is still available.');
    document.head.append(tag);
    pageView();
  }
  function stop() {
    // Google's documented opt-out flag also blocks already-loaded tags.
    window['ga-disable-' + id] = true;
    if (started) stopped = true;
    document.getElementById('heic-ga4-tag')?.remove();
    if (window.dataLayer) window.dataLayer.length = 0;
    for (const entry of (location.origin === 'https://heic2png.site' ? document.cookie : '').split(';')) {
      const name = entry.trim().split('=')[0];
      if (!/^_ga(?:_|$)/.test(name)) continue;
      for (const domain of ['', '; Domain=heic2png.site', '; Domain=.heic2png.site']) {
        document.cookie = name + '=; Max-Age=0; Path=/' + domain + '; SameSite=Lax; Secure';
      }
    }
    status();
  }
  document.addEventListener('click', event => {
    const button = event.target.closest?.('[data-analytics-consent]');
    if (!button) return;
    event.preventDefault();
    const value = button.dataset.analyticsConsent;
    if (value !== 'granted' && value !== 'denied') return;
    if (value === 'granted' && !eligible) { status(); return; }
    try { localStorage.setItem(key, JSON.stringify({version: 1, value, expires: Date.now() + lifetime})); }
    catch { stop(); status('Your browser could not save this choice. Analytics remains off.'); return; }
    if (value === 'denied') stop();
    else if (stopped) status('Choice saved. Analytics can resume on your next page load.');
    else { start(); status(); }
  });
  document.addEventListener('heic2png:analytics', event => {
    if (!started || !permitted() || !eventsEnabled) return;
    const {name, format, downloadType} = event.detail || {};
    if (!['conversion_success', 'conversion_failure', 'download_start'].includes(name) || !['PNG', 'JPG', 'AVIF'].includes(format)) return;
    const fields = {...pageFields(), output_format: format.toLowerCase(), send_to: id};
    if (name === 'download_start') {
      if (!['single', 'zip'].includes(downloadType)) return;
      fields.download_type = downloadType;
    }
    // Explicit allowlist: never spread event.detail or pass a File/error object.
    window.gtag('event', name, fields);
  });
  window.addEventListener('storage', event => {
    if (event.key !== key && event.key !== null) return;
    if (choice() !== 'granted') stop(); else start();
    status();
  });
  window.addEventListener('pageshow', event => {
    if (!permitted()) { stop(); return; }
    if (event.persisted) { pageViewed = false; pageView(); }
  });
  // Expiration/revocation must also stop Google's automatic engagement events.
  setInterval(() => { if (started && choice() !== 'granted') stop(); }, 60000);
  start();
  status();
})();
