import {test,expect,type Page} from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
const origin='https://heic2png.site', key='heic2png-analytics-consent-v1', id='G-W3XNRQR60H';
const csp="default-src 'self'; script-src 'self' 'wasm-unsafe-eval' https://www.googletagmanager.com; worker-src 'self' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https://www.googletagmanager.com https://*.google-analytics.com; font-src 'self'; connect-src 'self' https://www.googletagmanager.com https://*.google-analytics.com https://*.google.com; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'none'";
// Production bytes under the production origin. Google is stubbed, never contacted.
async function production(page:Page,{enabled=true,policy='required',delay=0,blocked=false,headStatus=200}:{enabled?:boolean;policy?:string|null;delay?:number;blocked?:boolean;headStatus?:number}={}) {
 const requests:string[]=[], heads:string[]=[];
 await page.context().route('https://www.googletagmanager.com/**',async route=>{
  requests.push(route.request().url());if(blocked)return route.abort();
  await route.fulfill({contentType:'application/javascript',body:`window.__gaCalls=[];window.__automaticViews=[];const record=entry=>{const c=Array.from(entry);window.__gaCalls.push(c);if(c[0]==='config'&&c[2]?.send_page_view!==false)window.__automaticViews.push(c[2]);};window.dataLayer.forEach(record);const push=window.dataLayer.push.bind(window.dataLayer);window.dataLayer.push=function(entry){record(entry);return push(entry);};`});
 });
 await page.context().route('https://*.google-analytics.com/**',route=>route.abort());
 await page.context().route(origin+'/**',async route=>{
  const url=new URL(route.request().url());
  if(route.request().method()==='HEAD'){
   heads.push(route.request().url());if(delay)await new Promise(r=>setTimeout(r,delay));
   return route.fulfill({status:headStatus,headers:policy?{'X-Analytics-Consent':policy}:{},body:''}).catch(()=>{});
  }
  let target=path.join('dist',decodeURIComponent(url.pathname)),status=200;
  try{if((await fs.stat(target)).isDirectory())target=path.join(target,'index.html');}catch{target='dist/404.html';status=404;}
  const headers={'content-security-policy':csp,'content-type':({'.html':'text/html','.js':'application/javascript','.css':'text/css','.wasm':'application/wasm','.woff2':'font/woff2','.webp':'image/webp','.png':'image/png','.ico':'image/x-icon','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'}[path.extname(target)]||'application/octet-stream')};
  let body=await fs.readFile(target);
  if(headers['content-type']==='text/html')body=Buffer.from(body.toString().replace(/data-enabled="(?:true|false)"/,`data-enabled="${enabled}"`));
  await route.fulfill({status,headers,body}).catch(()=>{});
 });
 return {requests,heads};
}
async function calls(page:Page){return page.evaluate(()=>(window as any).__gaCalls||[]);}
async function oneView(page:Page){await expect.poll(()=>page.evaluate(()=>(window as any).__automaticViews?.length||0)).toBe(1);}
async function accept(page:Page){await expect(page.locator('#analytics-choices')).toBeVisible();await page.locator('[data-analytics-consent="granted"]').click();await oneView(page);}
async function noPopup(page:Page){await expect(page.locator('#analytics-consent,[role="dialog"],[role="alertdialog"]')).toHaveCount(0);}

test('no popup or tracking in required regions; inline opt-in configures one automatic view',async({page})=>{
 const {requests}=await production(page);await page.goto(origin+'/?email=PRIVATE_TEST#PRIVATE_TEST');await noPopup(page);
 await expect(page.locator('#analytics-choices')).toHaveCount(0);expect(requests).toEqual([]);expect(await page.evaluate(()=>Boolean((window as any).dataLayer))).toBe(false);expect(await page.context().cookies()).toEqual([]);
 await page.getByRole('link',{name:'Privacy choices',exact:true}).click();await expect(page).toHaveURL(origin+'/privacy/#analytics-preferences');await noPopup(page);
 await accept(page);await page.locator('[data-analytics-consent="granted"]').click();await oneView(page);
 const sent=await calls(page);expect(sent.filter(c=>c[0]==='config')).toHaveLength(1);expect(sent.filter(c=>c[0]==='event')).toEqual([]);
 expect(sent.find(c=>c[0]==='config')[2]).toMatchObject({page_location:origin+'/privacy/',allow_google_signals:false,allow_ad_personalization_signals:false});
 expect(sent.find(c=>c[0]==='config')[2]).not.toHaveProperty('send_page_view');expect(sent.find(c=>c[0]==='config')[2]).not.toHaveProperty('ignore_referrer');
 expect(sent.find(c=>c[0]==='consent')[2]).toEqual({analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
 expect(JSON.stringify(sent)).not.toContain('PRIVATE_TEST');expect(requests).toHaveLength(1);
 await page.evaluate(()=>{const s=document.createElement('script');s.src='/analytics.js';s.dataset.enabled='true';document.head.append(s);});await expect(page.locator('#heic-ga4-tag')).toHaveCount(1);expect(requests).toHaveLength(1);
 await page.goto(origin+'/heic-to-jpg/');await oneView(page);await noPopup(page);await page.reload();await oneView(page);
});

test('eligible visitors track automatically without a popup, policy visit or stored acceptance',async({page})=>{
 const {requests,heads}=await production(page,{policy:'not-required'});await page.goto(origin+'/?utm_source=newsletter&utm_medium=email&utm_campaign=autumn-2026&email=PRIVATE_TEST#PRIVATE_TEST');
 await oneView(page);await noPopup(page);expect(requests).toHaveLength(1);expect(heads).toEqual([origin+'/']);expect(await page.evaluate(key=>localStorage.getItem(key),key)).toBeNull();
 expect((await calls(page)).find(c=>c[0]==='config')[2].page_location).toBe(origin+'/?utm_source=newsletter&utm_medium=email&utm_campaign=autumn-2026');
 expect(JSON.stringify(await calls(page))).not.toContain('PRIVATE_TEST');
 await page.getByRole('link',{name:'Privacy choices',exact:true}).click();await oneView(page);await page.locator('[data-analytics-consent="denied"]').click();await page.reload();
 await expect(page.locator('#heic-ga4-tag')).toHaveCount(0);expect(heads).toHaveLength(2);
});

test('search, social and referral origins and safe campaign attribution are preserved',async({browser})=>{
 for(const referrer of ['https://www.google.com/search?q=PRIVATE_TEST','https://www.bing.com/search?q=PRIVATE_TEST','https://www.facebook.com/PRIVATE_TEST','https://example.org/PRIVATE_TEST?email=PRIVATE_TEST']){
  const context=await browser.newContext();const page=await context.newPage();await production(page,{policy:'not-required'});
  await page.goto(origin+'/?utm_source=google&utm_medium=organic&utm_campaign=2026-launch&utm_id=12345&utm_content=hero&utm_term=heic-to-png&email=PRIVATE_TEST',{referer:referrer});await oneView(page);
  const config=(await calls(page)).find(c=>c[0]==='config')[2];expect(config.page_referrer).toBe(new URL(referrer).origin+'/');expect(config.page_location).toContain('utm_term=heic-to-png');expect(config.page_location).toContain('utm_id=12345');expect(config.page_location).toContain('utm_campaign=2026-launch');expect(JSON.stringify(config)).not.toContain('PRIVATE_TEST');await noPopup(page);await context.close();
 }
});

test('direct visits remain direct and unsafe campaign values stay excluded',async({page})=>{
 await production(page,{policy:'not-required'});await page.goto(origin+'/?utm_source=person%40example.com&utm_campaign=PRIVATE_TEST.heic&utm_term=C%3A%2FPRIVATE_TEST&utm_content=phone1234567890&utm_medium=social');await oneView(page);
 const config=(await calls(page)).find(c=>c[0]==='config')[2];expect(config.page_referrer).toBe('');expect(config.page_location).toBe(origin+'/?utm_medium=social');expect(JSON.stringify(config)).not.toContain('PRIVATE_TEST');
});

test('unknown or unavailable policy keeps analytics off without interrupting conversion pages',async({browser})=>{
 for(const options of [{policy:null},{policy:'unknown'},{policy:'not-required',headStatus:503},{policy:'not-required',delay:3000}]){
  const context=await browser.newContext();const page=await context.newPage();const {requests,heads}=await production(page,options);
  await page.goto(origin+'/?consent=not-required');await expect.poll(()=>heads.length).toBe(1);await page.waitForTimeout(options.delay?2200:100);
  await noPopup(page);await expect(page.locator('#upload-dropzone')).toBeVisible();expect(requests).toEqual([]);expect(await page.context().cookies()).toEqual([]);
  await expect(page.getByRole('link',{name:'Privacy choices',exact:true})).toHaveAttribute('href','/privacy/#analytics-preferences');await context.close();
 }
});

test('saved opt-outs, expiry, corrupt records, unavailable storage and GPC are respected',async({browser})=>{
 for(const scenario of ['denied','old-denied','expired','invalid','null','blocked','gpc']){
  const context=await browser.newContext();const page=await context.newPage();const {requests,heads}=await production(page,{policy:'not-required'});
  await page.addInitScript(({scenario,key})=>{
   if(scenario==='gpc')Object.defineProperty(navigator,'globalPrivacyControl',{value:true});
   else if(scenario==='blocked')Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked');}});
   else localStorage.setItem(key,scenario==='invalid'?'invalid':scenario==='null'?'null':JSON.stringify({version:1,value:scenario==='expired'?'granted':'denied',expires:Date.now()+(scenario==='denied'?86400000:-86400000)}));
  },{scenario,key});
  await page.goto(origin+'/');await noPopup(page);expect(requests).toEqual([]);expect(heads).toEqual([]);
  await page.getByRole('link',{name:'Privacy choices',exact:true}).click();await expect(page.locator('#analytics-choices')).toBeVisible();expect(requests).toEqual([]);
  if(scenario==='blocked'){
   await page.locator('[data-analytics-consent="granted"]').click();await expect(page.locator('#analytics-consent-status')).toContainText('could not save');expect(requests).toEqual([]);
   await page.locator('[data-analytics-consent="denied"]').click();await expect(page.locator('#analytics-consent-status')).toContainText('remains off');
  }
  if(scenario==='gpc')await expect(page.locator('[data-analytics-consent="granted"]')).toBeDisabled();await context.close();
 }
});

test('inline rejection during policy resolution cannot be overwritten by an automatic decision',async({page})=>{
 const {requests}=await production(page,{policy:'not-required',delay:700});await page.goto(origin+'/privacy/');await page.locator('[data-analytics-consent="denied"]').click();await page.waitForTimeout(850);
 expect(requests).toEqual([]);await noPopup(page);expect(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)!).value,key)).toBe('denied');
});

test('privacy-page withdrawal reaches other tabs and clears cookies without changing their selected files',async({page,context})=>{
 await production(page,{policy:'not-required'});await page.goto(origin+'/');await oneView(page);await page.locator('#real-file-input').setInputFiles('tests/fixtures/example.heic');
 const privacy=await context.newPage();await privacy.goto(origin+'/privacy/');await oneView(privacy);
 await context.addCookies([{name:'_ga',value:'test',domain:'heic2png.site',path:'/',secure:true},{name:'_ga_W3XNRQR60H',value:'test',domain:'.heic2png.site',path:'/',secure:true}]);
 await privacy.locator('[data-analytics-consent="denied"]').click();await expect.poll(()=>page.evaluate(()=>(window as any)['ga-disable-G-W3XNRQR60H'])).toBe(true);
 expect((await context.cookies()).filter(c=>c.name.startsWith('_ga'))).toEqual([]);await expect(page.locator('.file-row-item')).toHaveCount(1);
 await privacy.locator('[data-analytics-consent="granted"]').click();await expect(privacy.locator('#analytics-consent-status')).toContainText('next page load');await privacy.reload();await oneView(privacy);await privacy.close();
});

test('local development and disabled production never load Google',async({page})=>{
 await page.addInitScript(({key})=>localStorage.setItem(key,JSON.stringify({version:1,value:'granted',expires:Date.now()+86400000})),{key});
 await page.goto('/privacy/');await expect(page.locator('#heic-ga4-tag')).toHaveCount(0);await expect(page.locator('[data-analytics-consent="granted"]')).toBeDisabled();
 const {requests,heads}=await production(page,{enabled:false,policy:'not-required'});await page.goto(origin+'/privacy/');expect(requests).toEqual([]);expect(heads).toEqual([]);await noPopup(page);
});

test('inline controls are accessible in both themes; footer is an ordinary keyboard-operated link',async({page})=>{
 await production(page);await page.setViewportSize({width:320,height:700});await page.goto(origin+'/blog/');
 const link=page.getByRole('link',{name:'Privacy choices',exact:true});await expect(link).not.toHaveAttribute('aria-expanded',/.+/);await link.focus();await page.keyboard.press('Enter');await expect(page).toHaveURL(origin+'/privacy/#analytics-preferences');
 await noPopup(page);const controls=page.locator('#analytics-choices');await expect(controls).toBeVisible();expect(await controls.evaluate(e=>getComputedStyle(e).position)).toBe('static');
 for(const dark of [false,true]){
  if(dark)await page.locator('#theme-toggle').click();
  const buttons=await page.locator('.privacy-choices-actions button').evaluateAll(els=>els.map(el=>{const s=getComputedStyle(el),b=el.getBoundingClientRect();return {background:s.backgroundColor,color:s.color,font:s.font,border:s.border,height:b.height};}));expect(buttons[0]).toEqual(buttons[1]);expect(buttons[0].height).toBeGreaterThanOrEqual(44);expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
 }
 await page.locator('[data-analytics-consent="granted"]').focus();await page.keyboard.press('Space');await oneView(page);
 await page.screenshot({path:'test-results/privacy-choices-inline-mobile.png',fullPage:true});
});

test('blocked Google script leaves privacy choices and converters functional',async({page})=>{
 await production(page,{blocked:true});await page.goto(origin+'/privacy/');await page.locator('[data-analytics-consent="granted"]').click();await expect(page.locator('#analytics-consent-status')).toContainText('could not load');
 await page.goto(origin+'/');await noPopup(page);await page.locator('#real-file-input').setInputFiles('tests/fixtures/example.heic');await expect(page.locator('.file-row-item')).toHaveCount(1);
});
test('real PNG JPG AVIF batch conversions, single/ZIP downloads and errors send no custom file data',async({page})=>{
 test.setTimeout(240000);const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await production(page,{policy:'not-required'});
 for(const [url,format]of [['/','png'],['/heic-to-jpg/','jpg'],['/heic-to-avif/','avif']]){
  await page.goto(origin+url);await oneView(page);
  await page.locator('#real-file-input').setInputFiles(['tests/fixtures/example.heic','tests/fixtures/example.heic']);
  await page.locator('#btn-primary-convert').click();await expect(page.locator('#btn-primary-convert')).toBeEnabled({timeout:180000});await expect(page.locator('#converter-success-banner')).toBeVisible();
  for(const selector of ['#btn-download-single','#btn-download-zip']){
   const downloading=page.waitForEvent('download');await page.locator(selector).click();const download=await downloading,bytes=await fs.readFile((await download.path())!);expect(bytes.length).toBeGreaterThan(100);
   if(selector.endsWith('zip'))expect(bytes.subarray(0,2).toString()).toBe('PK');
   else if(format==='png')expect(bytes.subarray(1,4).toString()).toBe('PNG');
   else if(format==='jpg')expect([...bytes.subarray(0,2)]).toEqual([255,216]);
   else expect(bytes.subarray(4,12).toString()).toBe('ftypavif');
  }
  expect((await calls(page)).filter(c=>c[0]==='event')).toEqual([]);expect(JSON.stringify(await calls(page))).not.toContain('example.heic');
 }
 await page.getByRole('button',{name:'Clear Files',exact:true}).click();
 await page.locator('#real-file-input').setInputFiles({name:'PRIVATE_FAILURE.heic',mimeType:'image/heic',buffer:Buffer.from([0,0,0,24,...Buffer.from('ftypheic'),0,0,0,0,...Buffer.from('heicmif1')])});
 await page.locator('#btn-primary-convert').click();await expect(page.locator('#btn-primary-convert')).toBeEnabled({timeout:100000});await expect(page.locator('#converter-error-banner')).toBeVisible();
 expect(JSON.stringify(await calls(page))).not.toContain('PRIVATE_FAILURE');expect(errors).toEqual([]);
});

// The policy is not encoded in URLs or browser locale; these cannot grant consent.
test('BFCache rechecks permission without manual views; a newly enabled GPC stops an active tag',async({page})=>{
 await production(page,{policy:'not-required'});await page.goto(origin+'/');await oneView(page);
 await page.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true})));
 await oneView(page);expect((await calls(page)).filter(c=>c[0]==='config')).toHaveLength(1);
 await page.evaluate(()=>{Object.defineProperty(navigator,'globalPrivacyControl',{value:true});window.dispatchEvent(new Event('focus'));});
 expect(await page.evaluate(()=>(window as any)['ga-disable-G-W3XNRQR60H'])).toBe(true);
 await expect(page.locator('#heic-ga4-tag')).toHaveCount(0);
 const updates=(await calls(page)).filter(c=>c[0]==='consent'&&c[1]==='update').length;
 await page.evaluate(()=>window.dispatchEvent(new Event('focus')));
 expect((await calls(page)).filter(c=>c[0]==='consent'&&c[1]==='update')).toHaveLength(updates);
});

test('a rejected choice still blocks this document if storage reads work but saving fails',async({page})=>{
 const {requests}=await production(page,{policy:'not-required',delay:700});
 await page.addInitScript(()=>{Storage.prototype.setItem=function(){throw new Error('read-only preferences');};});
 await page.goto(origin+'/privacy/');await page.locator('[data-analytics-consent="denied"]').click();await expect(page.locator('#analytics-consent-status')).toContainText('could not save');await page.waitForTimeout(850);
 expect(requests).toEqual([]);await expect(page.locator('#heic-ga4-tag')).toHaveCount(0);
});
