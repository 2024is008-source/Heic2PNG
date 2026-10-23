import {test,expect} from '@playwright/test';

test('font definitions are inline and common glyphs use compressed font subsets',async({page})=>{
 const requests:string[]=[];page.on('request',r=>requests.push(r.url()));
 await page.goto('/');await page.evaluate(()=>document.fonts.ready);
 expect(requests.some(url=>url.includes('/fonts/fonts.css'))).toBe(false);
 const fonts=requests.filter(url=>url.endsWith('.woff2'));
 expect(fonts.length).toBeGreaterThan(0);
 expect(fonts.every(url=>/-latin\.[a-f0-9]+\.woff2$/.test(url))).toBe(true);
 expect(requests.some(url=>url.endsWith('.ttf'))).toBe(false);
 const metrics=await page.evaluate(async()=>{
  const reference=new FontFace('Inter Original','url(/fonts/Inter-400.woff2)');await reference.load();document.fonts.add(reference);
  const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d')!;
  const results=[];
  for(const text of ['HEIC to PNG Converter — café → .heic × 50','Ελληνικά Привет']){
   await document.fonts.load('16px Inter',text);
   ctx.font='16px "Inter Original"';const original=ctx.measureText(text).width;
   ctx.font='16px Inter';results.push({original,subset:ctx.measureText(text).width});
  }
  return results;
 });
 for(const metric of metrics)expect(metric.subset).toBeCloseTo(metric.original,4);
});

test('theme and logo references use fingerprinted assets and switch without a white backing',async({page,request})=>{
 await page.goto('/');
 const source=await page.locator('script[src*="/theme."]').getAttribute('src');
 expect(source).toMatch(/^\/_astro\/theme\.[\w-]+\.js$/);
 for(const image of await page.locator('.site-logo image').all()){
  const href=await image.getAttribute('href');expect(href).toMatch(/^\/_astro\/heic2png-logo-(?:light|dark)\.[\w-]+\.webp$/);
  expect((await request.get(href!)).status()).toBe(200);
 }
 await page.locator('#theme-toggle').click();
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 expect(await page.locator('header .site-logo').evaluate(el=>getComputedStyle(el).backgroundColor)).toBe('rgba(0, 0, 0, 0)');
});
