import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
const widths=[320,360,375,390,414,430,768,1024,1440];
const tools=['/','/heic-to-jpg/','/heic-to-avif/'];
const longName='20261004_101629_camera_photo_with_a_very_long_filename_0123456789_abcdefghijklmnopqrstuvwxyz.heic';

test('published pages fit all requested mobile/tablet/desktop viewports and wide tables remain keyboard accessible',async({page,request})=>{
 test.setTimeout(240000);
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 const sitemap=await (await request.get('/sitemap.xml')).text();const routes=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
 for(const width of widths){
  await page.setViewportSize({width,height:900});
  for(const route of routes){
   await page.goto(route);await page.evaluate(()=>document.fonts.ready);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth),route+' at '+width).toBeLessThanOrEqual(width);
   for(const table of await page.locator('main table').all()){
    const wrapper=table.locator('..');expect(await wrapper.evaluate(e=>getComputedStyle(e).overflowX)).toBe('auto');
    await expect(wrapper).toHaveAttribute('tabindex','0');await expect(wrapper).toHaveAttribute('role','region');
    if(await wrapper.evaluate(e=>e.scrollWidth>e.clientWidth)){
     if(width===320){
      await wrapper.scrollIntoViewIfNeeded();await wrapper.focus();await expect(wrapper).toBeFocused();
      await page.keyboard.press('ArrowRight');await expect.poll(()=>wrapper.evaluate(e=>e.scrollLeft),{message:route+' at '+width+'px table should scroll'}).toBeGreaterThan(0);
     }
     const last=await wrapper.evaluate(e=>{e.scrollLeft=e.scrollWidth;const c=e.querySelector('tr')?.lastElementChild;return c?c.getBoundingClientRect().right<=e.getBoundingClientRect().right+1:true;});expect(last).toBe(true);
    }
   }
  }
 }
 expect(errors).toEqual([]);
});

test('long-name upload rows keep thumbnails, metadata and tap targets usable on every converter',async({page})=>{
 const buffer=await fs.readFile('tests/fixtures/example.heic');
 for(const route of tools){
  await page.goto(route);await page.locator('#real-file-input').setInputFiles({name:longName,mimeType:'image/heic',buffer});
  const row=page.locator('.file-row-item');await expect(row.locator('img')).toHaveAttribute('src',/^blob:/,{timeout:60000});
  for(const width of widths){
   await page.setViewportSize({width,height:900});await expect(row.locator('.file-input-name')).toHaveAttribute('title',longName);
   const boxes=await row.evaluate(e=>{
    const rect=(x:Element)=>{const r=x.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom};};
    return {row:rect(e),info:rect(e.querySelector('.file-row-info')!),image:rect(e.querySelector('img')!),actions:rect(e.querySelector('.file-row-actions')!),buttons:[...e.querySelectorAll('button')].map(rect),name:rect(e.querySelector('.file-input-name')!)};
   });
   expect(boxes.name.width).toBeGreaterThan(width<768?30:80);expect(boxes.image.width).toBeGreaterThanOrEqual(width<768?40:56);
   for(const button of boxes.buttons.filter(b=>b.width>0)){expect(button.right).toBeLessThanOrEqual(boxes.row.right);expect(button.x).toBeGreaterThanOrEqual(boxes.row.x);}
   if(width<768){
    expect(boxes.actions.x).toBeGreaterThanOrEqual(boxes.info.right);expect(boxes.name.height).toBeLessThan(30);expect(boxes.row.height).toBeLessThanOrEqual(80);
    for(const button of boxes.buttons.filter(b=>b.width>0)){expect(button.height).toBeGreaterThanOrEqual(44);expect(button.width).toBeGreaterThanOrEqual(44);}
    for(const tab of await page.locator('.converter-format-tabs [role="tab"]').all())expect((await tab.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    for(const control of await page.locator('.converter-action-bar button,#btn-toggle-advanced').all())expect((await control.boundingBox())!.height).toBeGreaterThanOrEqual(44);
   }
   expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
  await page.getByRole('button',{name:'Remove '+longName,exact:true}).click();await expect(row).toHaveCount(0);
 }
});

test('mobile quality and advanced settings remain operable, with visible values and contained error messages',async({page})=>{
 for(const route of ['/heic-to-jpg/','/heic-to-avif/']){
  await page.setViewportSize({width:320,height:900});await page.goto(route);await page.locator('#btn-toggle-advanced').click();
  const slider=page.locator(route.includes('jpg')?'#jpg-quality-slider':'#avif-quality-slider');expect((await slider.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  await slider.focus();await page.keyboard.press('ArrowRight');expect(await slider.inputValue()).toBe(route.includes('jpg')?'86':'79');
  await expect(page.locator(route.includes('jpg')?'#jpg-quality-value-badge':'#avif-quality-badge')).toContainText(route.includes('jpg')?'86':'79');
  await page.locator('#resize-mode-select').selectOption('custom');await page.locator('#input-width-px').fill('640');await page.locator('#input-width-px').dispatchEvent('input');
  for(const id of ['#resize-mode-select','#input-width-px','#input-height-px'])expect((await page.locator(id).boundingBox())!.height).toBeGreaterThanOrEqual(44);
  if(route.includes('avif')){await page.locator('#avif-subsampling').selectOption('lossless');await expect(slider).toBeDisabled();await page.locator('#avif-subsampling').selectOption('444');await expect(slider).toBeEnabled();}
  await page.locator('#real-file-input').setInputFiles({name:longName+'.pdf',mimeType:'application/pdf',buffer:Buffer.from('invalid')});
  await expect(page.locator('#converter-error-banner')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
 }
});

test('mobile footer targets, text enlargement and reduced-motion behavior remain accessible',async({page})=>{
 await page.setViewportSize({width:320,height:900});await page.goto('/');
 await page.evaluate(()=>document.fonts.ready);
 for(const link of await page.locator('footer li a').all()){const box=await link.boundingBox();expect(box!.height).toBeGreaterThanOrEqual(44);expect(box!.width).toBeGreaterThanOrEqual(44);}
 await page.emulateMedia({reducedMotion:'reduce'});expect(await page.locator('html').evaluate(e=>getComputedStyle(e).scrollBehavior)).toBe('auto');
 await page.addStyleTag({content:'html{font-size:200% !important}'});
 await page.evaluate(()=>document.fonts.ready);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
 await page.setViewportSize({width:640,height:450});await page.goto('/heic-to-avif/');expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(640);
});

test('compact mobile batch shows real previews, queued/converting states and working row controls',async({page})=>{
 test.setTimeout(120000);await page.setViewportSize({width:390,height:844});await page.goto('/heic-to-avif/');
 await page.locator('#real-file-input').setInputFiles(Array(6).fill('tests/fixtures/example.heic'));
 const rows=page.locator('.file-row-item');await expect(rows).toHaveCount(6);
 await expect.poll(()=>rows.locator('img').evaluateAll(imgs=>imgs.every(img=>(img as HTMLImageElement).naturalWidth>0&&img.getAttribute('src')?.startsWith('blob:'))),{timeout:60000}).toBe(true);
 await expect(page.locator('.file-list-heading')).toHaveText('Selected photos (6) files');
 for(const row of await rows.all()){await expect(row.locator('.file-mobile-status')).toHaveText('Ready');expect((await row.boundingBox())!.height).toBeLessThanOrEqual(80);}
 await page.locator('#file-list-section').screenshot({path:'test-results/mobile-queue-ready.png'});
 // Delay actual worker startup so the real busy/queued UI can be inspected reliably.
 await page.route('**/*converter.worker*',async route=>{await new Promise(resolve=>setTimeout(resolve,800));await route.continue();});
 await page.locator('#btn-primary-convert').click();
 await expect(rows.first().locator('.file-mobile-status')).toContainText('Converting');await expect(rows.nth(1).locator('.file-mobile-status')).toHaveText('Queued');
 await expect(rows.first().getByRole('progressbar')).toHaveCount(1);await expect(rows.first().getByRole('progressbar')).not.toHaveAttribute('aria-valuenow',/.+/);
 await page.locator('#file-list-section').screenshot({path:'test-results/mobile-queue-converting.png'});
 await rows.last().getByRole('button',{name:'Remove example.heic',exact:true}).click();await expect(rows).toHaveCount(5);
 await expect(page.locator('#btn-primary-convert')).toBeEnabled({timeout:100000});await expect(page.locator('#converter-success-banner')).toBeVisible();
 const downloading=page.waitForEvent('download');await rows.first().getByRole('button',{name:'Download AVIF for example.heic',exact:true}).click();expect((await downloading).suggestedFilename()).toBe('example.avif');
 await page.getByRole('button',{name:'Clear All',exact:true}).click();await expect(rows).toHaveCount(0);
});

test('mobile output defaults form a contained grid with a full-width advanced toggle',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const route of tools){
  await page.goto(route);
  for(const width of [320,390,767]){
   await page.setViewportSize({width,height:900});await page.evaluate(()=>document.fonts.ready);await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   const summary=page.locator('.converter-settings-summary'), format=await page.locator('#settings-summary-format').boundingBox(),button=await page.locator('#btn-toggle-advanced').boundingBox();
   await expect(page.locator('#settings-summary-res')).toBeHidden();await expect(page.locator('#settings-summary-quality')).toBeHidden();
   const heading=await summary.locator('> div > span:first-child').boundingBox();expect(format!.y).toBeGreaterThanOrEqual(heading!.y+heading!.height);expect(Math.abs(format!.width-button!.width)).toBeLessThan(1);
   expect(button!.y).toBeGreaterThanOrEqual(format!.y+format!.height);expect(button!.height).toBeGreaterThanOrEqual(44);
   expect(Math.abs(format!.x-button!.x)).toBeLessThan(1);expect((await summary.boundingBox())!.height).toBeLessThanOrEqual(180);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
   if(width===390)await summary.screenshot({path:'test-results/mobile-output-defaults-'+(route.includes('avif')?'avif':route.includes('jpg')?'jpg':'png')+'.png'});
  }
  await page.locator('#btn-toggle-advanced').click();await expect(page.locator('#btn-toggle-advanced')).toHaveAttribute('aria-expanded','true');await expect(page.locator('#advanced-settings-panel')).toBeVisible();
 }
});
