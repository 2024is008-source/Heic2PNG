import {test,expect, type Page} from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

const origin='https://heic2png.site';
const key='heic2png-analytics-consent-v1';
const id='G-W3XNRQR60H';
const googleCsp="default-src 'self'; script-src 'self' 'wasm-unsafe-eval' https://www.googletagmanager.com; worker-src 'self' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https://www.googletagmanager.com https://*.google-analytics.com; font-src 'self'; connect-src 'self' https://www.googletagmanager.com https://*.google-analytics.com https://*.google.com; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'none'";

// Serve local production bytes under the production origin. Intercept ALL Google
// requests; never contact the real property. Only this fixture opens the release gate.
async function production(page:Page,{enabled=true,events=true,blocked=false,csp=googleCsp}={}) {
  const requests:string[]=[];
  await page.context().route('https://www.googletagmanager.com/**',async route=>{
    requests.push(route.request().url());
    if(blocked)return route.abort();
    await route.fulfill({contentType:'application/javascript',body:`window.__gaCalls=[];const record=entry=>window.__gaCalls.push(Array.from(entry));window.dataLayer.forEach(record);const push=window.dataLayer.push.bind(window.dataLayer);window.dataLayer.push=function(entry){record(entry);return push(entry);};`});
  });
  await page.context().route('https://*.google-analytics.com/**',route=>route.abort());
  await page.context().route(origin+'/**',async route=>{
    const url=new URL(route.request().url());
    let target=path.join('dist',decodeURIComponent(url.pathname));let status=200;
    try{if((await fs.stat(target)).isDirectory())target=path.join(target,'index.html');}catch{target='dist/404.html';status=404;}
    const headers={'content-security-policy':csp,'content-type':({'.html':'text/html','.js':'application/javascript','.css':'text/css','.wasm':'application/wasm','.woff2':'font/woff2','.webp':'image/webp','.png':'image/png','.ico':'image/x-icon','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'}[path.extname(target)]||'application/octet-stream')};
    let body=await fs.readFile(target);
    if(headers['content-type']?.includes('text/html'))body=Buffer.from(body.toString().replace(/(<script[^>]*src="\/analytics\.js"[^>]*data-enabled=")false("[^>]*data-events=")false/,`$1${enabled}$2${events}`));
    await route.fulfill({status,headers,body}).catch(()=>{});
  });
  return requests;
}
async function calls(page:Page){return page.evaluate(()=>(window as any).__gaCalls||[]);}
async function event(page:Page,detail:object){await page.evaluate(detail=>document.dispatchEvent(new CustomEvent('heic2png:analytics',{detail})),detail);}
async function allow(page:Page){await page.locator('[data-analytics-consent="granted"]').click();await expect.poll(async()=> (await calls(page)).filter(c=>c[0]==='event'&&c[1]==='page_view').length).toBe(1);}

test('no tag, cookies or event backlog before opt-in; one sanitized page view after repeated opt-in',async({page})=>{
  const requests=await production(page);
  await page.goto(origin+'/privacy/?email=PRIVATE_TEST#PRIVATE_TEST');
  await event(page,{name:'conversion_success',format:'PNG',filename:'PRIVATE_TEST.heic'});
  expect(requests).toEqual([]);expect(await page.evaluate(()=>Boolean((window as any).dataLayer))).toBe(false);
  expect(await page.context().cookies()).toEqual([]);
  await allow(page);await page.locator('[data-analytics-consent="granted"]').click();
  const sent=await calls(page);expect(requests).toHaveLength(1);
  expect(sent.filter(c=>c[0]==='config')).toHaveLength(1);
  expect(sent.filter(c=>c[0]==='event')).toHaveLength(1);
  expect(sent.find(c=>c[0]==='config')[2]).toMatchObject({send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,page_location:origin+'/privacy/',page_referrer:''});
  expect(sent.find(c=>c[0]==='consent'&&c[1]==='update')[2]).toEqual({analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
  expect(JSON.stringify(sent)).not.toContain('PRIVATE_TEST');
  // Running the local bootstrap twice does not add another Google installation.
  await page.evaluate(()=>{const script=document.createElement('script');script.src='/analytics.js';script.dataset.enabled='true';document.head.append(script);});
  await expect(page.locator('#heic-ga4-tag')).toHaveCount(1);
  expect(requests).toHaveLength(1);
});

test('remembered consent gives exactly one page view per static navigation; optional events are allowlisted',async({page})=>{
  await production(page);await page.goto(origin+'/privacy/');await allow(page);
  await page.goto(origin+'/heic-to-jpg/?q=PRIVATE_TEST#PRIVATE_TEST');
  await expect.poll(async()=>(await calls(page)).filter(c=>c[0]==='event'&&c[1]==='page_view').length).toBe(1);
  await event(page,{name:'conversion_success',format:'JPG',filename:'PRIVATE_TEST.heic',exif:{gps:'PRIVATE_TEST'},path:'C:/PRIVATE_TEST',image:'PRIVATE_TEST'});
  await event(page,{name:'conversion_failure',format:'AVIF',error:'PRIVATE_TEST'});
  await event(page,{name:'download_start',format:'PNG',downloadType:'zip',filename:'PRIVATE_TEST.zip'});
  await event(page,{name:'conversion_success',format:'PRIVATE_TEST'});
  await event(page,{name:'arbitrary_event',format:'PNG'});
  const sent=(await calls(page)).filter(c=>c[0]==='event');
  expect(sent.map(c=>c[1])).toEqual(['page_view','conversion_success','conversion_failure','download_start']);
  expect(sent[1][2]).toEqual({page_location:origin+'/heic-to-jpg/',page_title:await page.title(),page_referrer:'',output_format:'jpg',send_to:id});
  expect(sent[3][2].download_type).toBe('zip');expect(JSON.stringify(await calls(page))).not.toContain('PRIVATE_TEST');
  await page.reload();await expect.poll(async()=>(await calls(page)).filter(c=>c[0]==='event').length).toBe(1);
});

test('optional events can be switched off independently of page views',async({page})=>{
  await production(page,{events:false});await page.goto(origin+'/privacy/');await allow(page);
  await event(page,{name:'conversion_success',format:'PNG'});
  expect((await calls(page)).filter(c=>c[0]==='event')).toHaveLength(1);
});

test('withdrawal deletes GA cookies and stops collection without reloading; cross-tab revocation works',async({page,context})=>{
  await production(page);await page.goto(origin+'/privacy/');await allow(page);
  await context.addCookies([{name:'_ga',value:'test',domain:'heic2png.site',path:'/',secure:true},{name:'_ga_W3XNRQR60H',value:'test',domain:'.heic2png.site',path:'/',secure:true}]);
  const second=await context.newPage();await production(second);await second.goto(origin+'/heic-to-avif/');
  await expect.poll(async()=>(await calls(second)).length).toBeGreaterThan(0);
  await second.evaluate(()=>(window as any).__sameDocument='preserved');
  await page.locator('[data-analytics-consent="denied"]').click();
  await expect.poll(()=>second.evaluate(()=>(window as any)['ga-disable-G-W3XNRQR60H'])).toBe(true);
  expect((await context.cookies()).filter(c=>c.name.startsWith('_ga'))).toEqual([]);
  expect(await second.evaluate(()=>(window as any).__sameDocument)).toBe('preserved');
  const previous=await calls(page);await event(page,{name:'conversion_success',format:'PNG'});expect(await calls(page)).toEqual(previous);
  await page.locator('[data-analytics-consent="granted"]').click();
  await expect(page.locator('#analytics-consent-status')).toContainText('next page load');
  await page.reload();await expect.poll(async()=>(await calls(page)).filter(c=>c[0]==='event').length).toBe(1);
  await second.close();
});

test('storage errors, expired consent and Global Privacy Control fail closed',async({browser})=>{
  for(const scenario of ['blocked','expired','invalid','gpc']){
    const context=await browser.newContext();const page=await context.newPage();const requests=await production(page);
    await page.addInitScript(({scenario,key})=>{
      if(scenario==='blocked')Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked');}});
      else localStorage.setItem(key,scenario==='invalid'?'not json':JSON.stringify({version:1,value:'granted',expires:Date.now()+(scenario==='expired'?-1000:86400000)}));
      if(scenario==='gpc')Object.defineProperty(navigator,'globalPrivacyControl',{value:true});
    },{scenario,key});
    await page.goto(origin+'/privacy/');expect(requests).toEqual([]);expect(await page.locator('#heic-ga4-tag').count()).toBe(0);
    if(scenario==='blocked'){await page.locator('[data-analytics-consent="granted"]').click();await expect(page.locator('#analytics-consent-status')).toContainText('could not save');expect(requests).toEqual([]);}
    if(scenario==='gpc')await expect(page.locator('[data-analytics-consent="granted"]')).toBeDisabled();
    await context.close();
  }
});

test('localhost and production release gate remain off even with saved consent',async({page})=>{
  await page.addInitScript(({key})=>localStorage.setItem(key,JSON.stringify({version:1,value:'granted',expires:Date.now()+86400000})),{key});
  await page.goto('/privacy/');await expect(page.locator('[data-analytics-consent="granted"]')).toBeDisabled();await expect(page.locator('#heic-ga4-tag')).toHaveCount(0);
  const requests=await production(page,{enabled:false});await page.goto(origin+'/privacy/');expect(requests).toEqual([]);await expect(page.locator('#heic-ga4-tag')).toHaveCount(0);
});

test('blocked Google script leaves consent controls and converter available',async({page})=>{
  await production(page,{blocked:true});await page.goto(origin+'/privacy/');await page.locator('[data-analytics-consent="granted"]').click();
  await expect(page.locator('#analytics-consent-status')).toContainText('could not load');
  await page.goto(origin+'/');await expect(page.locator('#upload-dropzone')).toBeVisible();
  await page.locator('#real-file-input').setInputFiles('tests/fixtures/example.heic');await expect(page.locator('.file-row-item')).toHaveCount(1);
});

test('real PNG JPG AVIF conversion, single downloads, ZIP and failure hooks exclude file data',async({page})=>{
  test.setTimeout(240000);
  const errors:string[]=[];const external:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  page.on('request',r=>{if(!r.url().startsWith(origin)&&!r.url().startsWith('https://www.googletagmanager.com/'))external.push(r.url());});
  await production(page);await page.goto(origin+'/privacy/');await allow(page);
  for(const [path,format]of [['/','png'],['/heic-to-jpg/','jpg'],['/heic-to-avif/','avif']]){
    await page.goto(origin+path);
    await page.locator('#real-file-input').setInputFiles(['tests/fixtures/example.heic','tests/fixtures/example.heic']);
    await page.locator('#btn-primary-convert').click();await expect(page.locator('#btn-primary-convert')).toBeEnabled({timeout:180000});await expect(page.locator('#converter-success-banner')).toBeVisible();
    for(const selector of ['#btn-download-single','#btn-download-zip']){
      const downloading=page.waitForEvent('download');await page.locator(selector).click();const download=await downloading;
      expect((await fs.stat((await download.path())!)).size).toBeGreaterThan(100);
    }
    const events=(await calls(page)).filter(c=>c[0]==='event'&&c[1]!=='page_view');
    expect(events.map(c=>c[1])).toEqual(['conversion_success','conversion_success','download_start','download_start']);
    expect(events.map(c=>c[2].output_format)).toEqual([format,format,format,format]);
    expect(JSON.stringify(await calls(page))).not.toContain('example.heic');
  }
  await page.getByRole('button',{name:'Clear Files',exact:true}).click();
  await page.locator('#real-file-input').setInputFiles({name:'PRIVATE_FAILURE.heic',mimeType:'image/heic',buffer:Buffer.from([0,0,0,24,...Buffer.from('ftypheic'),0,0,0,0,...Buffer.from('heicmif1')])});
  await page.locator('#btn-primary-convert').click();await expect(page.locator('#btn-primary-convert')).toBeEnabled({timeout:100000});
  expect((await calls(page)).filter(c=>c[0]==='event'&&c[1]==='conversion_failure')).toHaveLength(1);
  expect(JSON.stringify(await calls(page))).not.toContain('PRIVATE_FAILURE');expect(errors).toEqual([]);expect(external).toEqual([]);
});
