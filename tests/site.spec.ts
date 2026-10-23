import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
import JSZip from 'jszip';
import {PNG} from 'pngjs';
const fixture='tests/fixtures/example.heic';
async function upload(page,files=fixture){await page.locator('#real-file-input').setInputFiles(files);await expect(page.locator('.file-row-item')).toHaveCount(Array.isArray(files)?files.length:1);}
async function convert(page){await page.locator('#btn-primary-convert').click();await expect(page.locator('#btn-primary-convert')).toBeEnabled({timeout:100000});await expect(page.locator('#converter-success-banner')).toBeVisible();}
async function download(page,selector){const event=page.waitForEvent('download');await page.locator(selector).click();return fs.readFile((await (await event).path())!);}
test('real HEIC to PNG preserves dimensions and creates valid PNG and ZIP',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));const posts=[];page.on('request',r=>{if(r.method()==='POST')posts.push(r.url());});
 await page.goto('/');await upload(page,[fixture,fixture]);await convert(page);
 const bytes=await download(page,'#btn-download-single');const image=PNG.sync.read(bytes);expect(image.width).toBe(1280);expect(image.height).toBe(854);
 expect(new Set(image.data).size).toBeGreaterThan(100);
 const archive=await JSZip.loadAsync(await download(page,'#btn-download-zip'));expect(Object.keys(archive.files)).toHaveLength(2);
 for(const f of Object.values(archive.files)){const png=PNG.sync.read(await f.async('nodebuffer'));expect(png.width).toBe(1280);expect(png.height).toBe(854);}
 expect(posts).toEqual([]);expect(errors).toEqual([]);
 await page.getByRole('button',{name:'Remove example.heic',exact:true}).first().click();await expect(page.locator('.file-row-item')).toHaveCount(1);
 await page.getByRole('button',{name:'Clear Files',exact:true}).click();await expect(page.locator('.file-row-item')).toHaveCount(0);
});
test('JPG quality changes actual output; resize uses actual source ratio',async({page})=>{
 await page.goto('/heic-to-jpg');await upload(page);
 await page.locator('#jpg-quality-slider').fill('40');await page.locator('#jpg-quality-slider').dispatchEvent('change');await convert(page);
 const low=await download(page,'#btn-download-single');expect(low.subarray(0,2).toString('hex')).toBe('ffd8');
 await page.locator('#jpg-quality-slider').fill('100');await page.locator('#jpg-quality-slider').dispatchEvent('change');await convert(page);
 const high=await download(page,'#btn-download-single');expect(high.length).toBeGreaterThan(low.length*1.5);
 await page.locator('#btn-toggle-advanced').click();await page.locator('#resize-mode-select').selectOption('scale-50');await convert(page);
 await expect(page.locator('.file-row-item')).toContainText('640 × 427 px');
});
test('HEIF rotation is applied once and portrait resolution is preserved',async({page})=>{
 await page.goto('/');await upload(page,'tests/fixtures/arrow.heic');await convert(page);
 const image=PNG.sync.read(await download(page,'#btn-download-single'));expect(image.width).toBe(3024);expect(image.height).toBe(4032);
 // Known upstream arrow points up. Its triangular head is wider than the lower shaft.
 const span=(fraction)=>{let min=image.width,max=0;const y=Math.round(image.height*fraction);for(let x=0;x<image.width;x++){const i=(y*image.width+x)*4;if(image.data[i]+image.data[i+1]+image.data[i+2]<210){min=Math.min(min,x);max=Math.max(max,x);}}return max-min;};
 expect(span(0.43)).toBeGreaterThan(image.width*0.65);expect(span(0.65)).toBeLessThan(image.width*0.55);
});
test('invalid, renamed, corrupt HEIC and retry errors are genuine',async({page})=>{
 await page.goto('/');
 await page.locator('#real-file-input').setInputFiles({name:'bad.pdf',mimeType:'application/pdf',buffer:Buffer.from('fake')});await expect(page.locator('#converter-error-banner')).toBeVisible();await expect(page.locator('.file-row-item')).toHaveCount(0);
 await page.locator('#real-file-input').setInputFiles({name:'renamed.heic',mimeType:'image/heic',buffer:Buffer.from('not heic')});await expect(page.locator('#converter-error-desc')).toContainText('does not contain');
 await page.locator('#real-file-input').setInputFiles({name:'corrupt.heic',mimeType:'image/heic',buffer:Buffer.from([0,0,0,24,...Buffer.from('ftypheic'),0,0,0,0,...Buffer.from('heicmif1')])});
 await page.locator('#btn-primary-convert').click();await expect(page.locator('.file-row-item')).toContainText('Unsupported HEIC Variant',{timeout:100000});
 await expect(page.locator('#btn-download-single')).toBeDisabled();await expect(page.locator('#converter-success-banner')).toBeHidden();
 await page.locator('#btn-primary-convert').click();await expect(page.locator('#btn-primary-convert')).toBeEnabled({timeout:100000});
});
test('drop queues files and clearing during conversion cancels stale results',async({page})=>{
 await page.goto('/');const bytes=await fs.readFile(fixture);
 const data=await page.evaluateHandle(({base64})=>{const d=new DataTransfer();d.items.add(new File([Uint8Array.from(atob(base64),c=>c.charCodeAt(0))],'dropped.heic',{type:'image/heic'}));return d;},{base64:bytes.toString('base64')});
 await page.locator('#upload-dropzone').dispatchEvent('drop',{dataTransfer:data});await expect(page.locator('.file-row-item')).toHaveCount(1);
 await page.locator('#btn-primary-convert').click();await page.getByRole('button',{name:'Clear Files',exact:true}).click();
 await expect(page.locator('.file-row-item')).toHaveCount(0);await expect(page.locator('#converter-success-banner')).toBeHidden();
 await upload(page);await convert(page);
});
test('static routes, SEO, sitemap and drafts',async({request,page})=>{
 const titles=new Set();
 for(const route of ['/','/heic-to-jpg','/heic-to-avif','/blog','/blog/how-to-convert-heic-to-png-on-windows-11','/about','/contact','/privacy','/terms']){
  const r=await request.get(route);expect(r.status()).toBe(200);const html=await r.text();expect(html).not.toContain('cdn.tailwindcss.com');
  await page.goto(route);await expect(page.locator('h1')).toHaveCount(1);titles.add(await page.title());
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://heic2png.site'+route);
  expect(JSON.parse(await page.locator('script[type="application/ld+json"]').textContent())).toHaveProperty('@graph');
 }
 expect(titles.size).toBe(9);expect((await request.get('/missing')).status()).toBe(404);expect((await request.get('/heic-to-avif')).status()).toBe(200);
 expect((await request.get('/blog/heic-vs-png-quality-file-size-compatibility')).status()).toBe(404);
 const sitemap=await (await request.get('/sitemap.xml')).text();expect(sitemap).toContain('/heic-to-avif');expect(sitemap).toContain('how-to-convert-heic-to-png-on-windows-11');expect((await request.get('/robots.txt')).status()).toBe(200);
});
test('blog filters, navigation, menus, FAQ and honest contact state',async({page})=>{
 await page.goto('/blog');await expect(page.locator('[data-blog-card]:visible')).toHaveCount(1);
 await page.locator('#blog-search-input').fill('does not exist');await expect(page.locator('#blog-no-results')).toBeVisible();
 await page.getByRole('button',{name:'Show All Guides',exact:true}).click();await page.getByRole('button',{name:'Image Formats',exact:true}).click();await expect(page.locator('#blog-no-results')).toBeVisible();
 await page.goto('/');await page.locator('[data-onclick="toggleFaq(2)"]').click();await expect(page.locator('#faq-body-2')).toBeVisible();
 await page.locator('#tools-dropdown-btn').click();await expect(page.locator('#tools-dropdown-menu')).toBeVisible();await page.keyboard.press('Escape');await expect(page.locator('#tools-dropdown-menu')).toBeHidden();
 await page.setViewportSize({width:375,height:800});await page.locator('#mobile-menu-btn').click();await expect(page.locator('#mobile-nav-drawer')).toBeVisible();
 await page.locator('#mobile-nav-drawer a[href="/heic-to-jpg"]').click();await expect(page).toHaveURL(/heic-to-jpg/);await page.reload();await expect(page.locator('#converter-hero-h1')).toHaveText('HEIC to JPG Converter');
 await page.goto('/contact');await page.locator('#contact-name').fill('Test');await page.locator('#contact-email').fill('test@example.com');await page.locator('#contact-message').fill('Question');await page.locator('button[type="submit"]').click();await expect(page.locator('#app-toast')).toContainText('Opening your email app');await expect(page.locator('#contact-error-box')).toBeHidden();
});
