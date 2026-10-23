// Consent choices stay inline on the Privacy Policy, never in a popup.
export function updatePrivacyPolicy(document) {
  const section = document.getElementById('view-privacy');
  if (!section) return;
  const blocks = [...section.querySelectorAll('h2')].map(h => ({heading: h, paragraph: h.nextElementSibling}));
  section.querySelector('.border-b p').textContent = 'Updated: October 24, 2026 • Domain: https://heic2png.site/';
  blocks[1].paragraph.textContent = 'Our hosting provider and Cloudflare may process IP addresses, requested URLs and other technical request data to deliver and protect this website. Selected images are processed locally in your browser. Log retention depends on the hosting and Cloudflare configuration.';
  blocks[2].heading.textContent = '3. Google Analytics';
  blocks[2].paragraph.innerHTML = 'We use Google Analytics to understand visits and traffic sources. When enabled, it uses cookies and sends technical browsing data, referring website domains and filtered campaign labels to Google. It starts automatically only where our configured policy permits; otherwise it waits for your consent. We do not send selected images, filenames, EXIF, local file paths or conversion errors. Google Ads features and Google signals are disabled. Read <a class="text-[#4F46E5] font-semibold underline" href="https://policies.google.com/privacy" rel="noopener noreferrer" target="_blank">Google’s Privacy Policy</a>.';
  blocks[3].heading.textContent = '4. Cookies & Privacy Choices';
  blocks[3].heading.id = 'analytics-preferences';
  blocks[3].paragraph.textContent = 'Use the controls below to accept, reject or withdraw analytics at any time. Every page links here through “Privacy choices” in the footer. Rejection and Global Privacy Control keep analytics off. Acceptance and Analytics cookies last up to 180 days; rejection stays saved until changed or browser storage is cleared. Withdrawal stops future collection and clears accessible Analytics cookies, but cannot recall data already sent. Conversion settings are held in page memory; local storage remembers your theme and analytics choice. All converters work without analytics.';
  const controls = document.createElement('div');
  controls.id = 'analytics-choices';
  controls.className = 'privacy-choices';
  controls.setAttribute('role', 'group');
  controls.setAttribute('aria-labelledby', 'analytics-preferences');
  controls.innerHTML = '<p id="analytics-consent-status" role="status" aria-live="polite">Analytics stays off where prior consent is required until you choose Accept analytics.</p><div class="privacy-choices-actions"><button type="button" data-analytics-consent="granted" disabled>Accept analytics</button><button type="button" data-analytics-consent="denied" disabled>Reject analytics</button></div><noscript>JavaScript is required to change your saved analytics choice. Analytics does not run while JavaScript is disabled.</noscript>';
  blocks[3].paragraph.after(controls);
}
