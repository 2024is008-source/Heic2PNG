import {test,expect} from '@playwright/test';
import {parseHTML} from 'linkedom';

test('converter headings follow the page intent without unsupported comparison claims',async({request})=>{
 const pages=[['/','PNG','content-home-png'],['/heic-to-jpg','JPG','content-heic-to-jpg'],['/heic-to-avif','AVIF','content-heic-to-avif']];
 for(const [route,format,contentId] of pages){
  const response=await request.get(route);expect(response.status()).toBe(200);
  const d=parseHTML(await response.text()).document;
  expect([...d.querySelectorAll('h1')].map(e=>e.textContent!.trim())).toEqual(['HEIC to '+format+' Converter']);
  const headings=[...d.querySelectorAll('main h1,main h2,main h3')];let previous=0;
  for(const heading of headings){const level=Number(heading.localName.slice(1));expect(level,heading.textContent!).toBeLessThanOrEqual(previous+1);previous=level;}
  expect(headings.some(e=>e.localName==='h2'&&e.textContent!.includes('How to Convert HEIC to '+format))).toBe(true);
  const content=d.getElementById(contentId)!.textContent!;
  expect(content).not.toMatch(/70–80%|~94%|Visually Lossless Photography|Archival Master|8–13 MB|100% of devices|universally expect|in seconds/);
  expect(content).toContain('8-bit RGB');expect(content).toContain('EXIF');
  for(const id of ['converter-error-title','success-banner-title'])expect(d.getElementById(id)!.localName).toBe('p');
 }
});

test('FAQ headings keep existing toggle hooks without FAQ rich-result markup',async({page})=>{
 await page.goto('/');
 const buttons=page.locator('h3 > button[data-onclick^="toggleFaq"]');await expect(buttons).toHaveCount(10);
 const graph=JSON.parse(await page.locator('script[type="application/ld+json"]').textContent())['@graph'];
 expect(graph.some(e=>e['@type']==='FAQPage')).toBe(false);
 for(let i=0;i<10;i++){
  expect((await buttons.nth(i).locator('span').first().textContent())!.trim().length).toBeGreaterThan(10);
  expect((await page.locator('#faq-body-'+(i+1)).textContent())!.trim().length).toBeGreaterThan(30);
 }
 await page.locator('[data-onclick="toggleFaq(4)"]').click();await expect(page.locator('#faq-body-4')).toBeVisible();
 await page.locator('[data-onclick="toggleFaq(4)"]').click();await expect(page.locator('#faq-body-4')).toBeHidden();
});
