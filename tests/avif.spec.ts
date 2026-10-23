import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
import JSZip from 'jszip';
const fixture='tests/fixtures/example.heic';
async function upload(page,files=fixture){await page.locator('#real-file-input').setInputFiles(files);await expect(page.locator('.file-row-item')).toHaveCount(Array.isArray(files)?files.length:1);}
async function convert(page){await page.locator('#btn-primary-convert').click();await expect(page.locator('#btn-primary-convert')).toBeEnabled({timeout:290000});await expect(page.locator('#converter-success-banner')).toBeVisible();}
async function download(page,selector='#btn-download-single'){
 const event=page.waitForEvent('download');await page.locator(selector).click();const file=await event;
 return {name:file.suggestedFilename(),bytes:await fs.readFile((await file.path())!)};
}
async function decode(page,bytes:Buffer){
 return page.evaluate(async base64=>{
  const bytes=Uint8Array.from(atob(base64),x=>x.charCodeAt(0));
  const image=await createImageBitmap(new Blob([bytes]));
  const canvas=new OffscreenCanvas(image.width,image.height),ctx=canvas.getContext('2d')!;ctx.drawImage(image,0,0);
  const pixels=ctx.getImageData(0,0,image.width,image.height).data;
  const hash=[...new Uint8Array(await crypto.subtle.digest('SHA-256',pixels))].map(x=>x.toString(16).padStart(2,'0')).join('');
  const result={width:image.width,height:image.height,hash};image.close();return result;
 },bytes.toString('base64'));
}
function assertAvif(bytes:Buffer){expect(bytes.toString('latin1',4,8)).toBe('ftyp');expect(bytes.toString('latin1',8,64)).toContain('avif');}
function chroma(bytes:Buffer){const index=bytes.indexOf('av1C');expect(index).toBeGreaterThan(0);return(bytes[index+6]>>2)&3;}

test('AVIF default encoding, batch ZIP, quality and chroma controls produce real files',async({page})=>{
 test.setTimeout(300000);
 const errors:string[]=[],posts:string[]=[],cspErrors:string[]=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.method()==='POST')posts.push(r.url());});
 page.on('console',m=>{if(/Content Security Policy|unsafe-eval|WebAssembly.*refused/i.test(m.text()))cspErrors.push(m.text());});
 await page.goto('/heic-to-avif');await expect(page.locator('#avif-quality-slider')).toHaveValue('78');
 await expect(page.locator('#tab-fmt-avif')).toHaveAttribute('aria-selected','true');
 await upload(page,[fixture,fixture]);await convert(page);
 const first=await download(page);expect(first.name).toBe('example.avif');assertAvif(first.bytes);expect(chroma(first.bytes)).toBe(3);
 expect(await decode(page,first.bytes)).toMatchObject({width:1280,height:854});
 const zip=await JSZip.loadAsync((await download(page,'#btn-download-zip')).bytes);expect(Object.keys(zip.files)).toEqual(['example.avif','example (2).avif']);
 for(const item of Object.values(zip.files)){const bytes=await item.async('nodebuffer');assertAvif(bytes);expect(await decode(page,bytes)).toMatchObject({width:1280,height:854});}
 await page.getByRole('button',{name:'Clear Files',exact:true}).click();await upload(page);
 await page.locator('#avif-quality-slider').fill('40');await page.locator('#avif-quality-slider').dispatchEvent('change');await convert(page);const low=await download(page);
 await page.locator('#avif-quality-slider').fill('95');await page.locator('#avif-quality-slider').dispatchEvent('change');await expect(page.locator('#btn-download-single')).toBeDisabled();await convert(page);const high=await download(page);
 expect(high.bytes.length).toBeGreaterThan(low.bytes.length);expect((await decode(page,high.bytes)).hash).not.toBe((await decode(page,low.bytes)).hash);
 await page.locator('#avif-subsampling').selectOption('444');await convert(page);const fullChroma=await download(page);expect(chroma(fullChroma.bytes)).toBe(0);expect(await decode(page,fullChroma.bytes)).toMatchObject({width:1280,height:854});
 expect(errors).toEqual([]);expect(cspErrors).toEqual([]);expect(posts).toEqual([]);
});

test('AVIF lossless matches decoded PNG pixels and uses the original aspect ratio',async({page})=>{
 test.setTimeout(300000);
 await page.goto('/');await upload(page);await page.locator('#btn-toggle-advanced').click();await page.locator('#resize-mode-select').selectOption('scale-50');await convert(page);
 const reference=await decode(page,(await download(page)).bytes);
 await page.goto('/heic-to-avif');await upload(page);await page.locator('#btn-toggle-advanced').click();await page.locator('#resize-mode-select').selectOption('scale-50');await page.locator('#avif-subsampling').selectOption('lossless');
 await expect(page.locator('#avif-quality-slider')).toBeDisabled();await expect(page.locator('#settings-summary-quality')).toContainText('Lossless');
 await convert(page);const lossless=await download(page);assertAvif(lossless.bytes);expect(chroma(lossless.bytes)).toBe(0);expect(await decode(page,lossless.bytes)).toEqual(reference);
 await page.locator('#avif-subsampling').selectOption('420');await expect(page.locator('#avif-quality-slider')).toBeEnabled();await expect(page.locator('#btn-download-single')).toBeDisabled();
});

test('AVIF portrait rotation, cancellation, errors, navigation and refresh',async({page})=>{
 test.setTimeout(300000);
 await page.goto('/');await page.locator('#tab-fmt-avif').click();await expect(page).toHaveURL(/heic-to-avif/);await page.reload();await expect(page.locator('#converter-hero-h1')).toHaveText('HEIC to AVIF Converter');
 await upload(page,'tests/fixtures/arrow.heic');await page.locator('#btn-toggle-advanced').click();await page.locator('#resize-mode-select').selectOption('custom');await page.locator('#input-width-px').fill('378');await page.locator('#input-width-px').dispatchEvent('change');await convert(page);
 const portrait=await decode(page,(await download(page)).bytes);expect(portrait).toMatchObject({width:378,height:504});
 await page.getByRole('button',{name:'Clear Files',exact:true}).click();await upload(page);await page.locator('#btn-primary-convert').click();await page.getByRole('button',{name:'Clear Files',exact:true}).click();await expect(page.locator('.file-row-item')).toHaveCount(0);await expect(page.locator('#converter-success-banner')).toBeHidden();
 await page.locator('#real-file-input').setInputFiles({name:'bad.heic',mimeType:'image/heic',buffer:Buffer.from('not a heic')});await expect(page.locator('#converter-error-banner')).toBeVisible();await expect(page.locator('#btn-download-single')).toBeDisabled();
});
