import vm from 'node:vm';
import { parseHTML } from 'linkedom';
import original from '../../heic_to_png_converter_free_private_online_iphone_photo_converter_heic2png_site.html?raw';
import helpers from '../design/helpers.js?raw';
import {improveConverterContent} from './converter-content.mjs';
import {updatePrivacyPolicy} from './privacy.mjs';
import logoLightUrl from '../../public/brand/heic2png-logo-light.webp?url&no-inline';
import logoDarkUrl from '../../public/brand/heic2png-logo-dark.webp?url&no-inline';
export const articlePath = '/blog/how-to-convert-heic-to-png-on-windows-11';
export const routes = {home:'/', 'heic-to-png':'/', 'heic-to-jpg':'/heic-to-jpg','heic-to-avif':'/heic-to-avif',blog:'/blog',article:articlePath,about:'/about',contact:'/contact',privacy:'/privacy',terms:'/terms','404':'/404'};
const views = {'/':['view-converter-shell','content-home-png'],'/heic-to-jpg':['view-converter-shell','content-heic-to-jpg'],'/heic-to-avif':['view-converter-shell','content-heic-to-avif'],'/blog':['view-blog-index'],'/about':['view-about'],'/contact':['view-contact'],'/privacy':['view-privacy'],'/terms':['view-terms'],'/404':['view-404'],[articlePath]:['view-blog-article']};
const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function wireNavigation(document) {
  for (const el of document.querySelectorAll('[onclick]')) {
    const code = el.getAttribute('onclick');
    const match = code.match(/navigateTo\('([^']+)'\)/);
    if (!match) continue;
    const target = routes[match[1]];
    if (!target) {
      el.remove();
      continue;
    }
    const anchor = document.createElement('a');
    for (const attr of el.attributes) if (!['onclick','type','href'].includes(attr.name)) anchor.setAttribute(attr.name,attr.value);
    if(el.localName==='button') {
      if(!/(?:^|\s)(?:inline-flex|flex|block|inline-block)(?:\s|$)/.test(anchor.className))anchor.classList.add('inline-block');
      if(!/(?:^|\s)text-(?:left|right|center)(?:\s|$)/.test(anchor.className))anchor.classList.add('text-center');
    }
    const category = code.match(/filterBlogCategory\('([^']+)'\)/);
    anchor.setAttribute('href',target+(category?'?category='+encodeURIComponent(category[1]):''));
    anchor.innerHTML = el.innerHTML;
    if(/^h[1-6]$/.test(el.localName)) {el.removeAttribute('onclick');anchor.className='';el.replaceChildren(anchor);}
    else el.replaceWith(anchor);
  }
  for(const el of document.querySelectorAll('[onclick^="openSampleArticle"]')) {
    const id = Number(el.getAttribute('onclick').match(/\d+/)[0]);
    el.removeAttribute('onclick');
    // Only article 1 has a supplied body. Keep related-guide design as unpublished text.
    if(id!==1) { el.setAttribute('disabled',''); el.title='Guide not yet published'; }
  }
}
export function blogCard(entry,index) {
 const item=entry.data;
 return `<article data-blog-card data-category="${esc(item.category)}" data-search="${esc(item.title+' '+item.description+' '+item.category)}" class="bg-white rounded-2xl border border-[#E2E8F0] shadow-soft hover:shadow-card hover:border-indigo-300 transition-soft overflow-hidden flex flex-col justify-between cursor-pointer group"><a href="/blog/${esc(item.slug)}" class="flex flex-col justify-between h-full"><div><div class="h-36 bg-gradient-to-br ${esc(item.accent)} p-5 flex flex-col justify-between text-white relative overflow-hidden"><div class="flex items-center justify-between text-[11px] font-mono opacity-90"><span>GUIDE #${index+1}</span><span class="px-2 py-0.5 rounded bg-white/15 font-bold">${esc(item.badgeText)}</span></div><div class="font-extrabold text-sm tracking-tight leading-snug">${esc(item.title)}</div></div><div class="p-5"><div class="flex items-center justify-between text-xs mb-2.5"><span class="px-2.5 py-0.5 rounded-full bg-indigo-50 text-[#4F46E5] font-bold">${esc(item.category)}</span><span class="text-[#64748B]">${esc(item.readTime)}</span></div><h3 class="text-base font-bold text-[#0F172A] group-hover:text-[#4F46E5] transition-soft leading-snug mb-2">${esc(item.title)}</h3><p class="text-xs sm:text-sm text-[#64748B] leading-relaxed">${esc(item.description)}</p></div></div><div class="px-5 py-3.5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between text-xs"><span class="text-[#64748B]">${new Date(item.published).toLocaleDateString('en-US',{month:'short',day:'2-digit',year:'numeric',timeZone:'UTC'})}</span><span class="font-bold text-[#4F46E5] group-hover:translate-x-0.5 transition-transform">Read Guide →</span></div></a></article>`;
}
export function renderDesign(path, entries=[], {contactEmail='backbencherz@gmail.com'}={}) {
 const {document}=parseHTML(original);
 const active=views[path]||['view-blog-article'];
 // Cropped, compressed theme variants retain the existing branding row sizes.
 const logo=(width,height)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 1953 353" preserveAspectRatio="xMinYMid meet" role="img" aria-label="HEIC2PNG.site" class="site-logo shrink-0"><image class="logo-light" href="${logoLightUrl}" width="1953" height="353" /><image class="logo-dark" href="${logoDarkUrl}" width="1953" height="353" /></svg>`;
 document.querySelector('header a[aria-label="HEIC2PNG Home"]').innerHTML=logo(176.65625,36);
 // Replace the trust badge with an accessible, compact theme control.
 const headerActions=document.getElementById('mobile-menu-btn').parentElement;
 headerActions.querySelector('.desktop-nav-only').remove();
 headerActions.classList.add('shrink-0');
 headerActions.insertAdjacentHTML('afterbegin',`<button type="button" id="theme-toggle" class="theme-toggle" aria-label="Switch to dark mode" aria-pressed="false" title="Switch to dark mode"><svg class="theme-icon-moon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.9 13a9 9 0 0 1-9.9-9.9A9 9 0 1 0 20.9 13Z" /></svg><svg class="theme-icon-sun" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></svg></button>`);
 const headerNav=document.querySelector('header nav');
 headerNav.classList.replace('md:flex','lg:flex');
 headerNav.classList.add('ml-auto');
 document.getElementById('mobile-menu-btn').classList.replace('md:hidden','lg:hidden');
 headerActions.parentElement.classList.replace('gap-4','gap-3');
 document.querySelector('footer .responsive-grid-4 > div > div').innerHTML=logo(145,32);
 // Remove only developer controls and sample loaders.
 document.getElementById('design-inspector-bar').remove();
 document.querySelector('.state-pill').parentElement.parentElement.remove();
 document.querySelector('[onclick="loadSampleBatch()"]')?.remove();
 document.querySelector('[onclick="setBlogUIState(\'category\')"]')?.parentElement.remove();
 document.querySelector('[onclick="setContactFormState(\'default\')"]')?.parentElement.remove();
 if(path==='/'||path==='/heic-to-jpg'||path==='/heic-to-avif') {
   const context={document,renderFileQueue(){},updateSeoBar(){},currentFormat:'PNG',jpgQuality:85,avifQuality:78};
   vm.createContext(context); vm.runInContext(helpers,context); context.renderFileQueue=()=>{};
   const format=path==='/'?'PNG':path==='/heic-to-jpg'?'JPG':'AVIF';
   context.switchToolFormat(format);
   for(const name of ['PNG','JPG','AVIF'])document.getElementById('tab-fmt-'+name.toLowerCase()).setAttribute('aria-selected',String(name===format));
   document.getElementById('file-list-section').classList.add('hidden');
   document.getElementById('file-count-label').textContent='0';
   document.getElementById('batch-summary-pill').textContent='Total input: 0 MB';
   const input=document.getElementById('real-file-input'); input.setAttribute('accept','.heic,.heif,image/heic,image/heif'); input.setAttribute('aria-label','Choose HEIC or HEIF image files');
   const dz=document.getElementById('upload-dropzone'); dz.setAttribute('tabindex','0'); dz.setAttribute('role','button');
   document.getElementById('avif-subsampling').setAttribute('onchange','handleAvifModeChange(this.value)');
   document.querySelector('label[for="avif-quality-slider"]').textContent='AVIF Target Quality';
   document.getElementById('avif-quality-slider').nextElementSibling.textContent='Applies to the local AV1 encoder. Lossless mode uses full quality.';
   for(const [selector,label] of [['option[value="original"]','Keep original resolution'],['option[value="scale-50"]','Scale to 50%'],['option[value="web-1920"]','Fit maximum width 1920 px']]) document.querySelector(selector).textContent=label;
   for(const id of ['chk-strip-exif','chk-color-srgb']) { const e=document.getElementById(id); e.setAttribute('disabled',''); e.setAttribute('title',id==='chk-strip-exif'?'Metadata is always removed; retaining EXIF is not supported.':'8-bit RGB output only; source ICC/HDR color management is not supported.'); }
   document.getElementById('chk-color-srgb').removeAttribute('checked');
   document.getElementById('chk-color-srgb').nextElementSibling.firstElementChild.textContent='8-bit RGB output (ICC/HDR mapping unavailable)';
   document.getElementById('chk-color-srgb').nextElementSibling.lastElementChild.textContent='Wide-gamut source colors may differ; keep your original HEIC for archival use.';
   document.getElementById('chk-aspect-ratio').nextElementSibling.textContent='Maintain original aspect ratio';
   for(const id of ['input-width-px','input-height-px']) {document.getElementById(id).setAttribute('value','');document.getElementById(id).setAttribute('placeholder','Original');}
   document.getElementById('png-transparency-note').querySelector('div').innerHTML='<strong>PNG Transparency & Alpha Channel Handling:</strong> Output uses the decoded primary image. Auxiliary alpha, depth, HDR and Live Photo layers are not guaranteed to be preserved. Keep your original file.';
   document.getElementById('success-banner-title').textContent='Conversion completed';
   document.getElementById('success-banner-subtitle').textContent='Processed locally in your browser';
   document.getElementById('btn-zip-banner-text').textContent='Download All as ZIP';
   improveConverterContent(document,format);
   const tabs=document.querySelector('[role="tablist"]');
   tabs.classList.add('converter-format-tabs');
   tabs.parentElement.classList.add('converter-card-header');
   tabs.nextElementSibling.classList.add('converter-format-indicators');
   tabs.parentElement.parentElement.classList.add('converter-card');
   dz.parentElement.classList.add('converter-card-body');
   const fileToolbar=document.getElementById('file-list-section').firstElementChild;
   fileToolbar.classList.add('file-list-toolbar');fileToolbar.firstElementChild.classList.add('file-list-summary');
   const queueHeading=document.getElementById('file-count-label').parentElement;queueHeading.classList.add('file-list-heading');
   queueHeading.innerHTML='<span class="file-list-desktop-label">Selected photos (</span><span id="file-count-label">0</span><span class="file-list-desktop-label">)</span><span class="file-list-mobile-label"> files</span>';
   document.getElementById('settings-summary-format').parentElement.parentElement.classList.add('converter-settings-summary');
 }
 for(const el of document.querySelectorAll('main > section, main > div')) {
   if(active.includes(el.id)) el.classList.remove('hidden'); else el.remove();
 }
 if(path==='/blog') {
   document.getElementById('blog-search-input').setAttribute('aria-label','Search published HEIC guides');
   const featured=entries.find(entry=>'/blog/'+entry.data.slug===articlePath);
   if(featured) {
     const title=document.querySelector('#view-blog-index h2');
     title.textContent=featured.data.title;
     title.parentElement.querySelector('p').textContent=featured.data.description;
     title.previousElementSibling.querySelector('span:last-child').textContent='• '+featured.data.readTime;
     const illustration=title.parentElement.parentElement.previousElementSibling;
     const labels=new Map([
       ['iOS 18','Apple photo'],['HEVC Container','HEIF container'],
       ['Lossless Decode','PNG export'],['24-Bit sRGB','8-bit RGB copy'],
       ['Tested on Windows 11 23H2 & 24H2','Source-reviewed instructions'],
       ['Browser, Photos App & Batch Methods','Browser export & Photos options']
     ]);
     for(const element of illustration.querySelectorAll('div,span')) {
       if(!element.children.length&&labels.has(element.textContent))element.textContent=labels.get(element.textContent);
     }
   }
   document.getElementById('blog-articles-grid').innerHTML=entries.map(blogCard).join('');
   for(const el of document.querySelectorAll('[data-cat-chip="ALL"]')) el.textContent=`All Guides (${entries.length})`;
   document.getElementById('blog-showing-count').textContent=entries.length?'1–'+Math.min(6,entries.length):'0';
   document.querySelector('#blog-pagination strong:last-of-type').textContent=String(entries.length);
   const b=document.getElementById('page-btn-2'); b.textContent='2'; b.disabled=entries.length<=6;
   document.querySelector('[onclick="setBlogUIState(\'all\')"]').textContent='Show All Guides';
   const p=document.querySelector('#blog-no-results p'); p.innerHTML=p.innerHTML.replace('all 10 format guides','all published guides');
 }
 if(path==='/contact') {
   document.getElementById('contact-form').removeAttribute('novalidate');
   for(const id of ['contact-name','contact-email','contact-message']) document.getElementById(id).setAttribute('required','');
   document.getElementById('contact-success-box').remove();
   if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)){
    const note=[...document.querySelectorAll('#view-contact strong')].find(p=>p.textContent==='Privacy Note:')?.parentElement;
    if(note){const link=document.createElement('a');link.href='mailto:'+contactEmail;link.textContent=contactEmail;link.className='underline';note.append(' The form opens your email app. You can also email ',link,'.');}
   }
 }
 if(path==='/about')for(const el of document.querySelectorAll('#view-about h2, #view-about h3, #view-about p')){
  if(el.textContent==='Tested Format Guides')el.textContent='Practical Format Guides';
  if(el.textContent.includes('OS-tested tutorials'))el.textContent='Alongside our free conversion tools, our guides explain HEIC formats and common Windows, macOS and iPhone workflows. Available features depend on your device, browser and application version.';
 }
 if(path==='/terms')for(const el of document.querySelectorAll('#view-terms span'))if(el.textContent.trim()==='Document Template')el.textContent='Legal';
 if(path==='/privacy')updatePrivacyPolicy(document);
 wireNavigation(document);
 const privacyLink=document.querySelector('footer a[href="/privacy"]');
 if(privacyLink){
   const item=document.createElement('li');
   item.innerHTML='<a href="/privacy/#analytics-preferences" data-analytics-settings aria-controls="analytics-consent" aria-expanded="false">Privacy choices</a>';
   privacyLink.closest('ul').append(item);
 }
 for(const span of document.querySelectorAll('#content-home-png span')){
  if(span.textContent.trim()==='Download ZIP'||span.classList.contains('text-slate-300'))span.parentElement.classList.add('mobile-wrap-illustration');
 }
 for(const table of document.querySelectorAll('main table')){
  const wrapper=table.parentElement;
  if(wrapper.classList.contains('overflow-x-auto')){
   wrapper.classList.add('mobile-table-scroll');wrapper.setAttribute('tabindex','0');wrapper.setAttribute('role','region');
   wrapper.setAttribute('aria-label','Comparison table; scroll horizontally to see all columns');
  }
 }
 for(const [id,role]of [['converter-error-banner','alert'],['contact-error-box','alert'],['converter-success-banner','status'],['app-toast','status']]){
  const el=document.getElementById(id);if(el){el.setAttribute('role',role);el.setAttribute('aria-atomic','true');}
 }
 for(const [buttonId,panelId] of [['tools-dropdown-btn','tools-dropdown-menu'],['mobile-menu-btn','mobile-nav-drawer']]) {
   const button=document.getElementById(buttonId),panel=document.getElementById(panelId);
   button.setAttribute('aria-controls',panelId);
   button.setAttribute('aria-expanded',String(!panel.classList.contains('hidden')));
 }
 if(path==='/')for(let i=1;i<=10;i++) {
   const panel=document.getElementById('faq-body-'+i),button=panel.previousElementSibling.querySelector('button');
   button.setAttribute('aria-controls',panel.id);
   button.setAttribute('aria-expanded',String(!panel.classList.contains('hidden')));
 }
 document.querySelector('footer a[href="/404"]')?.remove();
 for(const el of document.querySelectorAll('*'))for(const attr of [...el.attributes])if(/^on[a-z]+$/.test(attr.name)) {el.setAttribute('data-'+attr.name,attr.value);el.removeAttribute(attr.name);}
 for(const e of document.querySelectorAll('.nav-link')) {
   const href=e.getAttribute('href'); const selected=path.startsWith('/blog')?href==='/blog':href===path&&e.dataset.nav!=='heic-to-png';
   e.className=selected?'nav-link px-3.5 py-2 rounded-lg text-sm font-semibold text-[#4F46E5] bg-indigo-50/80 transition-soft':'nav-link px-3.5 py-2 rounded-lg text-sm font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100/70 transition-soft';
   e.classList.add('inline-block','text-center');
   if(selected)e.setAttribute('aria-current','page');
 }
 for(const e of document.querySelectorAll('script'))e.remove();
 // The page head is generated semantically by Astro.
 let body=document.body.innerHTML;
 const corrections=[
  ['Verified client-side WebAssembly &amp; HTML5 Canvas pipeline','Client-side JavaScript decoding &amp; HTML5 Canvas pipeline'],
  ['Our converter maps Apple Display P3 colors cleanly to standard sRGB so skin tones and skies look accurate across every monitor and browser.','Output is 8-bit RGB. Source ICC profiles and HDR are not preserved; wide-gamut colors may differ. Keep your original HEIC.'],
  ['maps Display P3 wide-gamut colors cleanly to sRGB, and lets you strip GPS metadata when privacy is paramount.','produces 8-bit RGB output and always removes camera/GPS EXIF metadata. Source ICC profiles and HDR are not preserved.'],
  ['If your original HEIC file already contains an alpha transparency channel (such as a cutout sticker exported from iOS), the transparent background is preserved in the resulting PNG. Regular camera photos do not have transparent backgrounds and will remain solid.','The decoded primary image is converted. Auxiliary alpha, depth and cutout layers are not guaranteed to survive decoding. Regular camera photos remain opaque; keep the original HEIC for layered or archival work.'],
  ['Delivers compact file sizes and high dynamic range support for modern browsers.','Delivers compact file sizes with quality and chroma controls for modern browsers.'],
  ['client-side JavaScript, WebAssembly, and HTML5 Canvas APIs','client-side JavaScript and HTML5 Canvas APIs'],
  ['client-side WebAssembly and HTML5 Canvas APIs','client-side JavaScript and HTML5 Canvas APIs']
 ];
 for(const [from,to]of corrections)body=body.replaceAll(from,to);
 const corrected=parseHTML('<html><body>'+body+'</body></html>').document;
 const faqs=path==='/'?[...corrected.querySelectorAll('[id^="faq-body-"]')].map(el=>({'@type':'Question',name:el.previousElementSibling.querySelector('span').textContent,acceptedAnswer:{'@type':'Answer',text:el.textContent.trim()}})):[];
 return {body, bodyClass:document.body.className,faqs};
}
export function prepareArticle(html) {
 const {document}=parseHTML('<html><body>'+html+'</body></html>'); wireNavigation(document); return document.body.innerHTML;
}
