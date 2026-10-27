import {test,expect} from '@playwright/test';
import fs from 'node:fs';
import sharp from 'sharp';

test('approved-brand icons, manifest and social metadata load with correct dimensions and MIME',async({request,page})=>{
 for(const [file,width]of [['favicon-16x16.png',16],['favicon-32x32.png',32],['apple-touch-icon.png',180],['icons/icon-192.png',192],['icons/icon-512.png',512]] as const){
  const response=await request.get('/'+file);expect(response.status()).toBe(200);expect(response.headers()['content-type']).toContain('image/png');
  const metadata=await sharp(await response.body()).metadata();expect(metadata.width).toBe(width);expect(metadata.height).toBe(width);expect(metadata.hasAlpha).toBe(true);
 }
 const ico=await request.get('/favicon.ico');expect(ico.status()).toBe(200);expect(ico.headers()['content-type']).toContain('image/x-icon');
 const bytes=await ico.body();expect(bytes.readUInt16LE(2)).toBe(1);expect(bytes.readUInt16LE(4)).toBe(3);expect([bytes[6],bytes[22],bytes[38]]).toEqual([16,32,48]);
 const svg=await request.get('/favicon.svg');expect(svg.status()).toBe(200);expect(svg.headers()['content-type']).toContain('image/svg+xml');
 const manifestResponse=await request.get('/site.webmanifest');expect(manifestResponse.headers()['content-type']).toContain('application/manifest+json');
 const manifest=await manifestResponse.json();expect(manifest.name).toBe('HEIC2PNG');expect(manifest.display).toBe('browser');expect(manifest.icons.map(i=>i.sizes)).toEqual(['192x192','512x512']);
 const xml=await (await request.get('/sitemap.xml')).text();
 for(const [,url]of xml.matchAll(/<loc>([^<]+)<\/loc>/g)){
  await page.goto(new URL(url).pathname);
  await expect(page.locator('link[rel="manifest"]')).toHaveCount(1);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content','https://heic2png.site/brand/social-preview.webp');
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute('content','1200');
  await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute('content','630');
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute('content',/HEIC2PNG/);
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content','summary_large_image');
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content','https://heic2png.site/brand/social-preview.webp');
 }
 const social=await request.get('/brand/social-preview.webp');expect(social.status()).toBe(200);expect(await sharp(await social.body()).metadata()).toMatchObject({width:1200,height:630});
});

test('article tables are keyboard-scrollable and known narrow layouts no longer overflow',async({page})=>{
 for(const width of [320,375,390,640,768,1024,1440])for(const route of ['/blog/how-to-convert-heic-to-png-on-windows-11/','/blog/heic-to-jpg-vs-png-which-format-should-you-choose/']){
  await page.setViewportSize({width,height:900});await page.goto(route);await page.evaluate(()=>document.fonts.ready);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  const wrapper=page.locator('.article-table-scroll');await expect(wrapper).toHaveCount(1);await expect(wrapper).toHaveAttribute('tabindex','0');await expect(wrapper).toHaveAttribute('role','region');
  expect(await wrapper.evaluate(e=>getComputedStyle(e).overflowX)).toBe('auto');
  if(await wrapper.evaluate(e=>e.scrollWidth>e.clientWidth)){
   await wrapper.focus();await page.keyboard.press('ArrowRight');
   await expect.poll(()=>wrapper.evaluate(e=>e.scrollLeft)).toBeGreaterThan(0);
  }
 }
 // 640 CSS px models a 1280px desktop viewport at 200% browser zoom.
 await page.setViewportSize({width:640,height:450});await page.goto('/blog/how-to-convert-heic-to-png-on-windows-11/');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(640);
});

test('support fallback works without JavaScript and unsupported testing/template claims are removed',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();
 try{
  await page.goto('/contact/');await expect(page.getByRole('link',{name:'backbencherz@gmail.com',exact:true})).toHaveAttribute('href','mailto:backbencherz@gmail.com');
  await page.goto('/about/');await expect(page.locator('main')).not.toContainText('OS-tested');await expect(page.getByRole('heading',{name:'Practical Format Guides'})).toBeVisible();
  await page.goto('/terms/');await expect(page.locator('main')).not.toContainText('Document Template');
  await page.goto('/privacy/');await expect(page.locator('main')).toContainText('held in page memory');
 }finally{await context.close();}
});

test('WOFF2 uses the same families and logo optimization preserves visible pixels',async({page})=>{
 const source=await sharp('public/brand/heic2png-logo.png').ensureAlpha().raw().toBuffer();
 const compressed=await sharp('public/brand/heic2png-logo.lossless.webp').ensureAlpha().raw().toBuffer();expect(source.length).toBe(compressed.length);
 let changed=0;for(let i=0;i<source.length;i+=4)if(source[i+3]!==compressed[i+3]||(source[i+3]&&(source[i]!==compressed[i]||source[i+1]!==compressed[i+1]||source[i+2]!==compressed[i+2])))changed++;
 expect(changed).toBe(0);expect(fs.statSync('public/brand/heic2png-logo.lossless.webp').size).toBeLessThan(fs.statSync('public/brand/heic2png-logo.png').size);
 const resources:string[]=[];page.on('request',r=>resources.push(r.url()));await page.goto('/');await page.evaluate(()=>document.fonts.ready);
 expect(resources.filter(u=>u.endsWith('.ttf'))).toHaveLength(0);expect(resources.filter(u=>u.endsWith('.woff2')).length).toBeGreaterThan(0);
 expect(await page.locator('body').evaluate(e=>getComputedStyle(e).fontFamily)).toContain('Inter');
});

test('keyboard upload works and converter errors expose an alert live region',async({page})=>{
 await page.goto('/');
 const dropzone=page.locator('#upload-dropzone');await dropzone.focus();await expect(dropzone).toBeFocused();
 const chooser=page.waitForEvent('filechooser');await dropzone.press('Enter');
 await (await chooser).setFiles({name:'invalid.pdf',mimeType:'application/pdf',buffer:Buffer.from('invalid')});
 await expect(page.locator('#converter-error-banner')).toHaveAttribute('role','alert');await expect(page.locator('#converter-error-banner')).toBeVisible();
 await expect(page.locator('#converter-success-banner')).toHaveAttribute('role','status');await expect(page.locator('#app-toast')).toHaveAttribute('role','status');
});
