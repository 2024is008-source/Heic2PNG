import {test,expect} from '@playwright/test';

test('uploaded HEIC thumbnails decode before conversion on every tool and survive settings changes',async({page})=>{
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
 for(const route of ['/','/heic-to-jpg/','/heic-to-avif/']){
  await page.goto(route);
  await page.locator('#real-file-input').setInputFiles(['tests/fixtures/example.heic','tests/fixtures/arrow.heic']);
  const rows=page.locator('.file-row-item');await expect(rows).toHaveCount(2);
  // A safe placeholder must be an intact image while the HEIC worker starts.
  await expect.poll(()=>rows.first().locator('img').evaluate((image:HTMLImageElement)=>image.complete&&image.naturalWidth>0)).toBe(true);
  for(const row of await rows.all()){
   await expect(row.locator('img')).toHaveAttribute('src',/^blob:/,{timeout:60000});
   const size=await row.locator('img').evaluate(async(image:HTMLImageElement)=>{await image.decode();return [image.naturalWidth,image.naturalHeight];});
   expect(Math.max(...size)).toBeLessThanOrEqual(160);expect(Math.min(...size)).toBeGreaterThan(0);
   await expect(row).toContainText('Queued for');
   await expect(row).not.toContainText('Dimensions available after decoding');
  }
  const portrait=await rows.nth(1).locator('img').evaluate((image:HTMLImageElement)=>image.naturalHeight>image.naturalWidth);expect(portrait).toBe(true);
  await expect(page.locator('#btn-download-single')).toBeDisabled();
  const src=await rows.first().locator('img').getAttribute('src');
  await page.locator('#btn-toggle-advanced').click();await page.locator('#resize-mode-select').selectOption('scale-50');
  await expect(rows.first().locator('img')).toHaveAttribute('src',src!);
  await page.getByRole('button',{name:'Remove example.heic',exact:true}).click();await expect(rows).toHaveCount(1);
  await page.getByRole('button',{name:'Clear Files',exact:true}).click();await expect(rows).toHaveCount(0);
 }
 expect(errors).toEqual([]);
});

test('clearing an in-flight preview cannot restore removed rows and files can be uploaded again',async({page})=>{
 await page.goto('/');
 await page.locator('#real-file-input').setInputFiles('tests/fixtures/arrow.heic');
 await expect(page.locator('.file-row-item')).toHaveCount(1);
 await page.getByRole('button',{name:'Clear Files',exact:true}).click();
 await page.locator('#real-file-input').setInputFiles('tests/fixtures/example.heic');
 await expect(page.locator('.file-row-item')).toHaveCount(1);
 await expect(page.locator('.file-row-item img')).toHaveAttribute('src',/^blob:/,{timeout:60000});
 await expect(page.locator('.file-row-item')).toContainText('example.heic');
});
