import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {parseHTML} from 'linkedom';

test('isolated Astro builds add published articles and remove drafts/noindex entries without touching real content',{timeout:180000},()=>{
 const repo=process.cwd(),parent=path.resolve(repo,'.astro');fs.mkdirSync(parent,{recursive:true});
 const fixture=fs.mkdtempSync(path.join(parent,'sitemap-fixture-'));
 const slug='sitemap-build-fixture-only',loc='https://heic2png.site/blog/'+slug+'/';
 const source=path.join(fixture,'src/content/blog',slug+'.md');
 const writeArticle=(flags)=>fs.writeFileSync(source,`---\ntitle: Sitemap build fixture\nslug: ${slug}\ndescription: Temporary isolated build fixture\ncategory: Tutorials\nauthor: HEIC2PNG Editorial Team\npublished: "2025-01-02"\nupdated: "2025-02-03"\nreadTime: 1 min read\naccent: from-indigo-600 to-blue-600\nbadgeText: Fixture\n${flags}\n---\n<h1>Sitemap build fixture</h1>\n<p>Only exists in this isolated test workspace.</p>\n`);
 const build=()=>{
  const result=spawnSync(process.execPath,[path.join(repo,'node_modules/astro/bin/astro.mjs'),'build'],{cwd:fixture,env:{...process.env,ASTRO_TELEMETRY_DISABLED:'1'},encoding:'utf8',timeout:55000});
  assert.equal(result.status,0,(result.stdout+'\n'+result.stderr).slice(-7000));
  return fs.readFileSync(path.join(fixture,'dist/sitemap.xml'),'utf8');
 };
 try{
  for(const name of ['src','public','astro.config.mjs','tsconfig.json','tsconfig.worker.json','package.json','heic_to_png_converter_free_private_online_iphone_photo_converter_heic2png_site.html'])fs.cpSync(path.join(repo,name),path.join(fixture,name),{recursive:true});
  writeArticle('draft: false');let xml=build();
  assert.equal([...xml.matchAll(/<loc>/g)].length,19);assert.ok(xml.includes('<loc>'+loc+'</loc>'));assert.match(xml,new RegExp(slug+'/</loc>\\s*<lastmod>2025-02-03</lastmod>'));
  let document=parseHTML(fs.readFileSync(path.join(fixture,'dist/blog',slug,'index.html'),'utf8')).document;
  assert.equal(document.querySelector('link[rel="canonical"]').getAttribute('href'),loc);
  writeArticle('draft: true');xml=build();assert.equal([...xml.matchAll(/<loc>/g)].length,18);assert.ok(!xml.includes(slug));
  assert.ok(!fs.existsSync(path.join(fixture,'dist/blog',slug,'index.html')));
  writeArticle('draft: false\nnoindex: true');xml=build();assert.equal([...xml.matchAll(/<loc>/g)].length,18);assert.ok(!xml.includes(slug));
  document=parseHTML(fs.readFileSync(path.join(fixture,'dist/blog',slug,'index.html'),'utf8')).document;
  assert.equal(document.querySelector('meta[name="robots"]').getAttribute('content'),'noindex,follow');
  assert.equal(document.querySelectorAll('script[type="application/ld+json"]').length,0);
  assert.ok(!fs.existsSync(path.join(repo,'src/content/blog',slug+'.md')));
 }finally{
  // Never recursively remove anything except the exact temporary child we made.
  assert.equal(path.dirname(path.resolve(fixture)),parent);assert.ok(path.basename(fixture).startsWith('sitemap-fixture-'));
  fs.rmSync(fixture,{recursive:true,force:true});
 }
});
