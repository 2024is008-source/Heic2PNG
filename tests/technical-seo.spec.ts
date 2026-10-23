import {test,expect} from '@playwright/test';

test('indexable pages retain crawlable metadata and responsive content with JavaScript disabled',async({browser,request})=>{
 const xml=await (await request.get('/sitemap.xml')).text();
 const urls=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:375,height:900}});
 const page=await context.newPage();
 try{
  for(const canonical of urls){
   const response=await page.goto(new URL(canonical).pathname);expect(response!.status()).toBe(200);
   await expect(page.locator('html')).toHaveAttribute('lang','en');
   await expect(page.locator('meta[name="viewport"]')).toHaveAttribute('content','width=device-width, initial-scale=1.0');
   await expect(page.locator('h1')).toHaveCount(1);await expect(page.locator('h1')).toBeVisible();
   await expect(page.locator('main')).toBeVisible();
   await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href',canonical);
   expect(await page.locator('meta[name="description"]').getAttribute('content')).toBeTruthy();
   expect(await page.locator('title').textContent()).toBeTruthy();
   const robots=page.locator('meta[name="robots"]');
   expect(await robots.count()?await robots.getAttribute('content'):'').not.toContain('noindex');
   const width=await page.evaluate(()=>({viewport:innerWidth,content:document.documentElement.scrollWidth}));
   expect(width.content,canonical).toBeLessThanOrEqual(width.viewport);
  }
 }finally{await context.close();}
});

test('search and disclosure controls expose accurate accessible names, relationships and Escape state',async({page})=>{
 await page.goto('/blog/');await expect(page.locator('#blog-search-input')).toHaveAccessibleName('Search published HEIC guides');
 await page.setViewportSize({width:1280,height:900});
 const tools=page.locator('#tools-dropdown-btn');await expect(tools).toHaveAttribute('aria-controls','tools-dropdown-menu');
 await tools.click();await expect(tools).toHaveAttribute('aria-expanded','true');await page.keyboard.press('Escape');
 await expect(tools).toHaveAttribute('aria-expanded','false');await expect(page.locator('#tools-dropdown-menu')).toBeHidden();
 await page.setViewportSize({width:375,height:900});
 const mobile=page.locator('#mobile-menu-btn');await expect(mobile).toHaveAttribute('aria-controls','mobile-nav-drawer');
 await mobile.click();await expect(mobile).toHaveAttribute('aria-expanded','true');await page.keyboard.press('Escape');
 await expect(mobile).toHaveAttribute('aria-expanded','false');await expect(page.locator('#mobile-nav-drawer')).toBeHidden();
 await page.goto('/');await expect(page.locator('#real-file-input')).toHaveAttribute('aria-label','Choose HEIC or HEIF image files');
 for(let i=1;i<=10;i++){
  const button=page.locator('[data-onclick="toggleFaq('+i+')"]'),panel=page.locator('#faq-body-'+i);
  await expect(button).toHaveAttribute('aria-controls','faq-body-'+i);
  await expect(button).toHaveAttribute('aria-expanded',String(await panel.isVisible()));
 }
 const faq=page.locator('[data-onclick="toggleFaq(4)"]');await faq.click();await expect(faq).toHaveAttribute('aria-expanded','true');
 await faq.click();await expect(faq).toHaveAttribute('aria-expanded','false');
});
