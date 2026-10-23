import {test,expect} from '@playwright/test';
import {parseHTML} from 'linkedom';
import {canonicalPageUrl} from '../src/lib/urls.mjs';

test('canonical identity ignores query/hash and consolidates index/host aliases',()=>{
 for(const input of ['/blog','/blog/','/blog/index.html','/blog/?q=PNG#results','https://www.heic2png.site/blog?utm_source=test'])
  expect(canonicalPageUrl(input)).toBe('https://heic2png.site/blog/');
 for(const input of ['/','/index.html','/?utm_source=test#top'])expect(canonicalPageUrl(input)).toBe('https://heic2png.site/');
});

test('every sitemap URL has a unique self-canonical and legacy/query URLs retain its identity',async({request})=>{
 const xml=await (await request.get('/sitemap.xml')).text();const urls=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
 expect(urls).toHaveLength(18);expect(new Set(urls).size).toBe(18);const titles=new Set(),descriptions=new Set();
 for(const url of urls){
  const u=new URL(url);expect(u.origin).toBe('https://heic2png.site');expect(u.pathname.endsWith('/')).toBe(true);expect(u.search).toBe('');
  for(const path of new Set([u.pathname,u.pathname==='/'?'/index.html':u.pathname.slice(0,-1),u.pathname+'index.html',u.pathname+'?utm_source=audit&q=PNG'])){
   const r=await request.get(path);expect(r.status(),path).toBe(200);const d=parseHTML(await r.text()).document;
   expect(d.querySelectorAll('link[rel="canonical"]').length,path).toBe(1);expect(d.querySelector('link[rel="canonical"]')!.getAttribute('href')).toBe(url);
   expect(d.querySelector('meta[property="og:url"]')!.getAttribute('content')).toBe(url);
   expect(d.querySelector('meta[name="robots"]')?.getAttribute('content')||'').not.toContain('noindex');
   if(path===u.pathname){titles.add(d.querySelector('title')!.textContent);descriptions.add(d.querySelector('meta[name="description"]')!.getAttribute('content'));}
  }
 }
 expect(titles.size).toBe(18);expect(descriptions.size).toBe(18);
 for(const path of ['/canonical-audit-missing/','/blog/what-is-a-heic-file-beginners-guide/','/blog/heic-vs-avif-whats-the-difference/','/blog/how-to-convert-multiple-heic-photos-at-once/']){
  const r=await request.get(path);expect(r.status()).toBe(404);expect(await r.text()).toContain('noindex,follow');
 }
});
