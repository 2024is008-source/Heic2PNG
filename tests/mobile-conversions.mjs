// Touch-enabled Chromium smoke test; not a physical iOS/Android certification.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import JSZip from 'jszip';
const browser=await chromium.launch({channel:process.env.PLAYWRIGHT_CHANNEL||'chrome'}),results=[];
try{
 const context=await browser.newContext({viewport:{width:375,height:900},isMobile:true,hasTouch:true});
 const page=await context.newPage(),errors=[],posts=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.method()==='POST')posts.push(r.url());});
 for(const [route,extension]of [['/','png'],['/heic-to-jpg/','jpg'],['/heic-to-avif/','avif']]){
  await page.goto('http://127.0.0.1:4876'+route);
  const chooser=page.waitForEvent('filechooser');await page.getByRole('button',{name:'Choose HEIC Files',exact:true}).tap();
  await (await chooser).setFiles(['tests/fixtures/example.heic','tests/fixtures/example.heic']);
  await page.waitForFunction(()=>document.querySelectorAll('.file-row-item').length===2);
  await page.locator('#btn-primary-convert').tap();await page.locator('#converter-success-banner').waitFor({state:'visible',timeout:180000});
  const download=page.waitForEvent('download');await page.locator('#btn-download-zip').tap();
  const zip=await JSZip.loadAsync(await fs.readFile(await (await download).path()));const names=Object.keys(zip.files);assert.equal(names.length,2);assert.equal(new Set(names).size,2);
  for(const name of names){
   assert.ok(name.endsWith('.'+extension));const bytes=await zip.files[name].async('nodebuffer');
   const dimensions=await page.evaluate(async base64=>{const image=await createImageBitmap(new Blob([Uint8Array.from(atob(base64),c=>c.charCodeAt(0))]));const size=[image.width,image.height];image.close();return size;},bytes.toString('base64'));
   assert.deepEqual(dimensions,[1280,854]);
  }
  await page.getByRole('button',{name:'Clear Files',exact:true}).tap();assert.equal(await page.locator('.file-row-item').count(),0);
  results.push({route,extension,names,width:1280,height:854,touchUploadConvertZipClear:true});
 }
 assert.deepEqual(errors,[]);assert.deepEqual(posts,[]);
 await fs.mkdir('.astro',{recursive:true});await fs.writeFile('.astro/mobile-conversion-results.json',JSON.stringify({passed:true,results,errors,posts},null,2));console.log(JSON.stringify({passed:true,results,errors,posts}));
}finally{await browser.close();}
