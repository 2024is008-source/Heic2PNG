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
   expect(boxes.name.width).toBeGreaterThan(80);expect(boxes.image.width).toBeGreaterThanOrEqual(56);
   for(const button of boxes.buttons){expect(button.right).toBeLessThanOrEqual(boxes.row.right);expect(button.x).toBeGreaterThanOrEqual(boxes.row.x);}
   if(width<768){
    expect(boxes.actions.y).toBeGreaterThanOrEqual(boxes.info.bottom);expect(boxes.name.height).toBeLessThan(30);
    for(const button of boxes.buttons){expect(button.height).toBeGreaterThanOrEqual(44);expect(button.width).toBeGreaterThanOrEqual(44);}
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
