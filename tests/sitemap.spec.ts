import {test,expect} from '@playwright/test';
import {createSitemapEntries,renderSitemap,articleLastmod,escapeXml} from '../src/lib/sitemap.mjs';

test('sitemap helpers discover eligible articles, deduplicate canonicals and use only editorial dates',()=>{
 const article=(slug:string,extra={})=>({data:{slug,published:'2025-04-02',...extra}});
 const entries=createSitemapEntries([
  article('new-published-guide',{updated:'2025-05-03'}),article('publication-only'),
  article('draft-guide',{draft:true}),article('noindex-guide',{noindex:true}),
  article('new-published-guide/'),article('undated',{published:undefined})
 ]);
 expect(entries).toHaveLength(11);expect(new Set(entries.map(e=>e.loc)).size).toBe(11);
 expect(entries.find(e=>e.loc.endsWith('/new-published-guide/'))!.lastmod).toBe('2025-05-03');
 expect(entries.find(e=>e.loc.endsWith('/publication-only/'))!.lastmod).toBe('2025-04-02');
 expect(entries.find(e=>e.loc.endsWith('/undated/'))!.lastmod).toBeUndefined();
 expect(entries.some(e=>/draft-guide|noindex-guide/.test(e.loc))).toBe(false);
 expect(entries.slice(0,8).every(e=>e.lastmod===undefined)).toBe(true);
 expect(articleLastmod({published:new Date('2025-04-02'),updated:new Date('2025-05-03')})).toBe('2025-05-03');
 expect(()=>articleLastmod({updated:'invalid'})).toThrow();
 expect(()=>articleLastmod({published:'2025-02-30'})).toThrow();
 expect(()=>articleLastmod({published:'2025-05-03',updated:'2025-04-02'})).toThrow();
 expect(escapeXml('&<>"\'')).toBe('&amp;&lt;&gt;&quot;&apos;');
 expect(renderSitemap([{loc:'https://heic2png.site/blog/a&b/'}])).toContain('a&amp;b/');
});

test('generated XML, robots, indexability and canonical/article lastmod agreement are valid',async({request,page})=>{
 const response=await request.get('/sitemap.xml');expect(response.status()).toBe(200);
 expect(response.headers()['content-type']).toMatch(/^application\/xml/);
 const xml=await response.text();expect(xml).toMatch(/^<\?xml version="1.0" encoding="UTF-8"\?>/);
 expect(xml).not.toMatch(/<(?:priority|changefreq)>/);
 await page.goto('/');
 const parsed=await page.evaluate(xml=>{
  const doc=new DOMParser().parseFromString(xml,'application/xml');
  return {errors:doc.querySelectorAll('parsererror').length,root:doc.documentElement.localName,namespace:doc.documentElement.namespaceURI,
   entries:[...doc.querySelectorAll('url')].map(e=>({loc:e.querySelector('loc')?.textContent,lastmod:e.querySelector('lastmod')?.textContent}))};
 },xml);
 expect(parsed.errors).toBe(0);expect(parsed.root).toBe('urlset');expect(parsed.namespace).toBe('http://www.sitemaps.org/schemas/sitemap/0.9');
 expect(parsed.entries).toHaveLength(18);expect(new Set(parsed.entries.map(e=>e.loc)).size).toBe(18);
 expect(parsed.entries.filter(e=>e.loc==='https://heic2png.site/')).toHaveLength(1);
 for(const entry of parsed.entries){
  const url=new URL(entry.loc!);expect(url.origin).toBe('https://heic2png.site');expect(url.search).toBe('');expect(url.hash).toBe('');expect(url.pathname.endsWith('/')).toBe(true);
  expect(url.pathname).not.toMatch(/404|index\.html|_astro|\.(?:js|wasm|css|png)$/);
  const response=await request.get(url.pathname);expect(response.status()).toBe(200);
  await page.goto(url.pathname);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href',entry.loc!);
  const robots=page.locator('meta[name="robots"]');if(await robots.count())expect(await robots.getAttribute('content')).not.toMatch(/noindex/i);
  expect(response.headers()['x-robots-tag']||'').not.toMatch(/noindex/i);
  if(url.pathname.startsWith('/blog/')&&url.pathname!=='/blog/'){
   const schema=JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
   expect(entry.lastmod).toBe(schema['@graph'].find(e=>e['@type']==='BlogPosting').dateModified);
  }else expect(entry.lastmod).toBeUndefined();
 }
 for(const slug of ['what-is-a-heic-file-beginners-guide','heic-vs-avif-whats-the-difference','how-to-convert-multiple-heic-photos-at-once'])expect(xml).not.toContain('/blog/'+slug+'/');
 const robots=await request.get('/robots.txt');expect(robots.status()).toBe(200);
 const text=await robots.text();expect(text).toContain('Sitemap: https://heic2png.site/sitemap.xml');expect(text).toMatch(/Allow:\s*\//);expect(text).not.toMatch(/Disallow:\s*\S/);
});
