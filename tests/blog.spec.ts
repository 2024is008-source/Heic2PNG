import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
import {parseHTML} from 'linkedom';

async function collection(){
 const names=await fs.readdir('src/content/blog');
 return Promise.all(names.filter(n=>n.endsWith('.md')).map(async name=>{
  const source=await fs.readFile('src/content/blog/'+name,'utf8');
  const match=source.match(/^---\r?\n([\s\S]*?)\r?\n---/)!;
  const data=Object.fromEntries(match[1].split(/\r?\n/).map(line=>{
   const colon=line.indexOf(':');return [line.slice(0,colon),JSON.parse(line.slice(colon+1).trim())];
  }));
  return {name,data,source};
 }));
}

test('published blog collection has matching metadata, real content, TOCs and source links',async({request})=>{
 const entries=await collection();const published=entries.filter(e=>!e.data.draft);
 expect(published).toHaveLength(10);expect(entries.filter(e=>e.data.draft)).toHaveLength(3);
 expect(new Set(entries.map(e=>e.data.slug)).size).toBe(entries.length);
 const titles=new Set(),descriptions=new Set();
 const schemaKeys=['title','slug','description','category','author','published','updated','draft','readTime','accent','badgeText','image','related'];
 for(const {name,data} of published){
  expect(name).toBe(data.slug+'.md');expect(Object.keys(data).every(k=>schemaKeys.includes(k))).toBe(true);
  const route='/blog/'+data.slug;const response=await request.get(route);expect(response.status(),route).toBe(200);
  const {document:d}=parseHTML(await response.text());
  expect(d.querySelectorAll('h1').length,route).toBe(1);
  expect(d.querySelector('h1')!.textContent!.trim()).toBe(data.title);
  expect(d.querySelector('title')!.textContent).toBe(data.title+' | HEIC2PNG');
  const expectedDescription=data.slug==='how-to-convert-heic-to-png-on-windows-11'
   ? 'Convert HEIC to PNG on Windows 11 with browser tools and compatible Photos exports. Learn codec requirements, batch options and how to check the result.'
   : data.description;
  expect(d.querySelector('meta[name="description"]')!.getAttribute('content')).toBe(expectedDescription);
  expect(d.querySelector('link[rel="canonical"]')!.getAttribute('href')).toBe('https://heic2png.site'+route+'/');
  expect(d.querySelector('meta[property="og:type"]')!.getAttribute('content')).toBe('article');
  titles.add(data.title);descriptions.add(data.description);
  const graph=JSON.parse(d.querySelector('script[type="application/ld+json"]')!.textContent!)['@graph'];
  const article=graph.find(e=>e['@type']==='BlogPosting');expect(article.headline).toBe(data.title);
  expect(article.datePublished).toBe(data.published);
  expect(article.dateModified).toBe(data.updated||data.published);
  expect(article.mainEntityOfPage).toBe('https://heic2png.site'+route+'/');
  expect(article.author.name).toBe(data.author);
  expect(d.querySelector('article .border-y')!.textContent).toContain('By the HEIC2PNG Editorial Team');
  const toc=[...d.querySelectorAll('.mobile-toc-collapsible a, aside nav a')];
  const headings=[...d.querySelectorAll('article [id^="art-sec-"] h2')];
  expect(toc.length).toBe(headings.length*2);
  for(const a of toc)expect(d.getElementById(a.getAttribute('href')!.slice(1)),route).not.toBeNull();
  expect(d.querySelectorAll('article .ad-placeholder-block').length).toBe(3);
  expect(d.body.getAttribute('data-show-ad-areas')).toBe('false');
  expect(d.querySelector('aside > div:last-child button[disabled]')).toBeNull();
  if(data.published==='2026-10-23'){
   const body=d.querySelector('article .space-y-8')!;
   const text=(body.innerHTML.replace(/<[^>]+>/g,' ').replace(/\s+/g,' '));
   expect(text.split(' ').length,route).toBeGreaterThan(850);
   expect(body.querySelectorAll('a[href^="https://"]').length).toBeGreaterThan(1);
   expect(d.querySelector('article [role="img"]')!.getAttribute('aria-label')!.length).toBeGreaterThan(50);
   const related=[...d.querySelectorAll('aside > div:last-child a')].map(a=>a.getAttribute('href')!.replace('/blog/','').replace(/\/$/,''));
   expect(related).toEqual(data.related);expect(related).not.toContain(data.slug);
  }
 }
 expect(titles.size).toBe(10);expect(descriptions.size).toBe(10);
});

test('all blog internal links resolve and sitemap excludes remaining drafts',async({request})=>{
 const entries=await collection();const published=entries.filter(e=>!e.data.draft);
 const cache=new Map<string,Document>();
 const sitemap=await (await request.get('/sitemap.xml')).text();
 for(const e of entries){
  const route='/blog/'+e.data.slug;
  if(e.data.draft){expect(sitemap).not.toContain(route);expect((await request.get(route)).status()).toBe(404);continue;}
  expect(sitemap).toContain('https://heic2png.site'+route);
  const response=await request.get(route);cache.set(route,parseHTML(await response.text()).document);
 }
 const references=published.flatMap(e=>[...cache.get('/blog/'+e.data.slug)!.querySelectorAll('#view-blog-article a[href]')].map(a=>({from:e.data.slug,href:a.getAttribute('href')!})));
 for(const {from,href} of references){
  if(!href.startsWith('/')&&!href.startsWith('#'))continue;
  const url=new URL(href,'https://heic2png.site/blog/'+from);const path=url.pathname;
  if(!cache.has(path)){const response=await request.get(path);expect(response.status(),from+' → '+href).toBe(200);cache.set(path,parseHTML(await response.text()).document);}
  if(url.hash)expect(cache.get(path)!.getElementById(decodeURIComponent(url.hash.slice(1))),from+' → '+href).not.toBeNull();
 }
});

test('blog pagination, each category, search and guide navigation use the published collection',async({page})=>{
 const entries=(await collection()).filter(e=>!e.data.draft);
 await page.goto('/blog');
 await expect(page.locator('[data-blog-card]')).toHaveCount(10);
 await expect(page.locator('[data-blog-card]:visible')).toHaveCount(6);
 await page.locator('#page-btn-2').click();await expect(page.locator('[data-blog-card]:visible')).toHaveCount(4);
 await expect(page.locator('#blog-showing-count')).toContainText('7–10');
 const categories=[...new Set(entries.map(e=>e.data.category))];
 for(const category of categories){
  await page.getByRole('button',{name:category,exact:true}).click();
  const matches=entries.filter(e=>e.data.category===category);
  await expect(page.locator('[data-blog-card]:visible')).toHaveCount(matches.length);
  for(const slug of matches.map(e=>e.data.slug))await expect(page.locator('[data-blog-card]:visible a[href="/blog/'+slug+'"]')).not.toHaveCount(0);
 }
 for(const entry of entries){
  await page.getByRole('button',{name:/All Guides \(10\)/,exact:true}).click();
  await page.locator('#blog-search-input').fill(entry.data.title);
  await expect(page.locator('[data-blog-card]:visible')).toHaveCount(1);
  const card=page.locator('[data-blog-card]:visible');
  await expect(card.locator('a').first()).toHaveAttribute('href','/blog/'+entry.data.slug);
 }
 await page.locator('[data-blog-card]:visible a').first().click();
 await expect(page.locator('h1')).toHaveText(entries[entries.length-1].data.title);
});

test('new articles keep the approved responsive article structure',async({page})=>{
 for(const width of [1280,375]){
  await page.setViewportSize({width,height:900});
  for(const slug of ['how-to-convert-heic-to-png-on-mac','heic-to-jpg-vs-png-which-format-should-you-choose']){
   await page.goto('/blog/'+slug);
   const dimensions=await page.evaluate(()=>({viewport:innerWidth,content:document.documentElement.scrollWidth}));
   expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
   await expect(page.locator('article')).toHaveClass(/lg:col-span-8/);
   await expect(page.locator('article')).toHaveClass(/max-w-\[740px\]/);
   if(width===375){await expect(page.locator('.mobile-toc-collapsible')).toBeVisible();await page.locator('.mobile-toc-collapsible summary').click();await page.locator('.mobile-toc-collapsible a').last().click();await expect(page).toHaveURL(/#art-sec-/);}
  }
 }
});
