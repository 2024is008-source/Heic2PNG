// Apply the saved choice before paint; keep theme handling separate from conversion.
(() => {
  const key = 'heic2png-theme';
  const root = document.documentElement;
  function apply(theme) {
    const dark = theme === 'dark';
    root.dataset.theme = dark ? 'dark' : 'light';
    const button = document.getElementById('theme-toggle');
    if (button) {
      const label = dark ? 'Switch to light mode' : 'Switch to dark mode';
      button.setAttribute('aria-label', label);
      button.setAttribute('title', label);
      button.setAttribute('aria-pressed', String(dark));
    }
  }
  let saved = 'light';
  try { saved = localStorage.getItem(key) || 'light'; } catch { /* Storage can be unavailable. */ }
  apply(saved);
  document.addEventListener('DOMContentLoaded', () => apply(root.dataset.theme));
  document.addEventListener('click', event => {
    if (!event.target.closest?.('#theme-toggle')) return;
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    apply(next);
    try { localStorage.setItem(key, next); } catch { /* The current page still switches. */ }
  });
  window.addEventListener('storage', event => {
    if (event.key === key || event.key === null) apply(event.newValue);
  });
})();
