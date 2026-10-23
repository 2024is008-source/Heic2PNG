import {test,expect} from '@playwright/test';
import fs from 'node:fs';
import {parseHTML} from 'linkedom';
import {createStructuredData,serializeStructuredData} from '../src/lib/structured-data.mjs';

test('all indexable pages have one connected, factual JSON-LD graph aligned with canonical content',async({request})=>{
 const xml=await (await request.get('/sitemap.xml')).text();
 const urls=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
 expect(urls).toHaveLength(18);let articleCount=0;
 for(const canonical of urls){
  const path=new URL(canonical).pathname;
  const response=await request.get(path);expect(response.status()).toBe(200);
  const d=parseHTML(await response.text()).document;
  const blocks=d.querySelectorAll('script[type="application/ld+json"]');expect(blocks.length,canonical).toBe(1);
  const schema=JSON.parse(blocks[0].textContent!);expect(schema['@context']).toBe('https://schema.org');
  const graph=schema['@graph'],ids=graph.map(n=>n['@id']);expect(new Set(ids).size).toBe(ids.length);
  expect(graph.filter(n=>n['@type']==='WebPage')).toHaveLength(1);
  expect(graph.filter(n=>n['@type']==='WebSite')).toHaveLength(1);
  expect(graph.filter(n=>n['@type']==='Organization')).toHaveLength(1);
  const byId=new Map(graph.map(n=>[n['@id'],n]));
  const check=node=>{
   if(!node||typeof node!=='object')return;
   for(const [key,value] of Object.entries(node)){
    expect(['review','aggregateRating','ratingValue','ratingCount','downloadCount','interactionStatistic','price','priceCurrency','legalName','foundingDate','numberOfEmployees','address','telephone','sameAs']).not.toContain(key);
    if(key==='@type')expect(['FAQPage','SoftwareApplication','Offer','Review','AggregateRating','Person']).not.toContain(value);
    if(key==='@id')expect(byId.has(value)).toBe(true);
    if(key==='url'||key==='item'||key==='mainEntityOfPage'){
     const u=new URL(value as string);expect(u.origin).toBe('https://heic2png.site');expect(u.search).toBe('');expect(u.pathname.endsWith('/')).toBe(true);
    }
    if(Array.isArray(value))value.forEach(check);else if(value&&typeof value==='object')check(value);
   }
  };graph.forEach(check);
  const page=graph.find(n=>n['@type']==='WebPage');expect(page.url).toBe(canonical);
  expect(page.name).toBe(d.querySelector('title')!.textContent);
  expect(page.description).toBe(d.querySelector('meta[name="description"]')!.getAttribute('content'));
  expect(page.isPartOf['@id']).toBe('https://heic2png.site/#website');
  const org=graph.find(n=>n['@type']==='Organization');expect(org.name).toBe('HEIC2PNG');
  expect(org.logo).toBe('https://heic2png.site/brand/heic2png-logo.png');
  const post=graph.find(n=>n['@type']==='BlogPosting'),crumb=graph.find(n=>n['@type']==='BreadcrumbList');
  if(post){
   articleCount++;expect(post.url).toBe(canonical);expect(post.mainEntityOfPage).toBe(canonical);
   expect(post.headline).toBe(d.querySelector('h1')!.textContent!.trim());expect(page.mainEntity['@id']).toBe(post['@id']);
   const source=fs.readFileSync('src/content/blog/'+path.split('/')[2]+'.md','utf8');
   const field=name=>JSON.parse(source.match(new RegExp('^'+name+': (.*)$','m'))![1]);
   expect(post.datePublished).toBe(field('published'));expect(post.dateModified).toBe(field('updated'));
   expect(post.dateModified>=post.datePublished).toBe(true);expect(post.author).toEqual({'@type':'Organization',name:field('author')});
   expect(d.querySelector('article .border-y')!.textContent).toContain(post.author.name);
   expect(post.image).toBeUndefined(); // Current articles have inline diagrams, no source image URL.
   expect(crumb.itemListElement.map(item=>item.item)).toEqual(['https://heic2png.site/','https://heic2png.site/blog/',canonical]);
   expect(crumb.itemListElement.map(item=>item.position)).toEqual([1,2,3]);
   expect(crumb.itemListElement.every(item=>item.name.length>0)).toBe(true);expect(page.breadcrumb['@id']).toBe(crumb['@id']);
   expect(d.querySelector('nav[aria-label="Breadcrumb"]')!.textContent).toContain('Blog');
  }else expect(crumb).toBeUndefined();
 }
 expect(articleCount).toBe(10);
 const logo=fs.readFileSync('public/brand/heic2png-logo.png');expect(logo.readUInt32BE(16)).toBeGreaterThanOrEqual(112);expect(logo.readUInt32BE(20)).toBeGreaterThanOrEqual(112);
 for(const path of ['/missing-schema-audit/','/blog/heic-vs-avif-whats-the-difference/']){
  const r=await request.get(path);expect(r.status()).toBe(404);const d=parseHTML(await r.text()).document;
  expect(d.querySelectorAll('script[type="application/ld+json"]').length).toBe(0);expect(d.querySelector('meta[name="robots"]')!.getAttribute('content')).toContain('noindex');
 }
});

test('schema ignores aliases, escapes script boundaries and does not manufacture publication times',()=>{
 const title='A title </script><script>alert(1)</script>';
 const schema=createStructuredData({path:'/heic-to-jpg/index.html?utm_source=test#top',title,description:'A description'});
 const serialized=serializeStructuredData(schema);expect(serialized).not.toContain('</script>');
 expect(JSON.parse(serialized)['@graph'].find(n=>n['@type']==='WebPage').name).toBe(title);
 expect(schema!['@graph'].find(n=>n['@type']==='WebPage').url).toBe('https://heic2png.site/heic-to-jpg/');
 expect(createStructuredData({path:'/404',title,description:'Missing',noindex:true})).toBeNull();
 expect(createStructuredData({path:'/blog/draft/',title,description:'Draft',entry:{data:{draft:true}}})).toBeNull();
 const entry={data:{title:'Existing post',author:'Existing team',published:new Date('2026-10-14'),updated:new Date('2026-10-23')}};
 const post=createStructuredData({path:'/blog/existing/',title,description:'Existing content',entry})!['@graph'].find(n=>n['@type']==='BlogPosting');
 expect(post.datePublished).toBe('2026-10-14');expect(post.dateModified).toBe('2026-10-23');
 expect(()=>createStructuredData({path:'/blog/existing/',title,description:'Existing content',entry:{data:{...entry.data,updated:new Date('2026-10-01')}}})).toThrow('precedes publication');
});
