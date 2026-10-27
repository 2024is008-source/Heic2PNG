import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';

for(const width of [390,1440])for(const route of ['/','/heic-to-jpg/','/heic-to-avif/']){
 test(`accepted uploads focus the selected photos at ${width}px on ${route}`,async({page})=>{
  await page.setViewportSize({width,height:900});await page.goto(route);
  const section=page.locator('#file-list-section');
  for(const files of ['tests/fixtures/example.heic',['tests/fixtures/example.heic','tests/fixtures/example.heic']]){
   await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
   await page.locator('#real-file-input').setInputFiles(files);
   await expect(section).toBeFocused();
   await expect.poll(()=>section.evaluate(el=>{
    const top=el.getBoundingClientRect().top,header=document.querySelector('header')!.getBoundingClientRect().bottom;
    return top>=header&&top<header+30;
   })).toBe(true);
  }
  await expect(page.locator('.file-row-item')).toHaveCount(3);
  await expect(page.locator('#btn-primary-convert')).toBeEnabled();
 });
}

test('drop uploads focus the queue; rejected selections do not move focus or scroll',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 const dropzone=page.locator('#upload-dropzone');await dropzone.focus();
 await page.locator('#real-file-input').setInputFiles({name:'invalid.txt',mimeType:'text/plain',buffer:Buffer.from('invalid')});
 await expect(page.locator('#converter-error-banner')).toBeVisible();await expect(dropzone).toBeFocused();
 await expect(page.locator('#file-list-section')).toBeHidden();
 const bytes=[...await fs.readFile('tests/fixtures/example.heic')];
 await page.evaluate(bytes=>{
  const dataTransfer=new DataTransfer();dataTransfer.items.add(new File([new Uint8Array(bytes)],'example.heic',{type:'image/heic'}));
  document.getElementById('upload-dropzone')!.dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer}));
 },bytes);
 await expect(page.locator('#file-list-section')).toBeFocused();await expect(page.locator('.file-row-item')).toHaveCount(1);
});
