// Read-only artifact check. Never deploys or follows a host redirect.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {parseHTML} from 'linkedom';
const root=path.resolve(process.argv[2]||'dist');
const urls=[...fs.readFileSync(root+'/sitemap.xml','utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
assert.ok(urls.length>=8);assert.equal(new Set(urls).size,urls.length);
for(const url of urls){const u=new URL(url);assert.equal(u.origin,'https://heic2png.site');assert.ok(u.pathname.endsWith('/'));assert.equal(u.search,'');
 const d=parseHTML(fs.readFileSync(path.join(root,u.pathname,'index.html'),'utf8')).document;
 assert.equal(d.querySelectorAll('link[rel="canonical"]').length,1);assert.equal(d.querySelector('link[rel="canonical"]').getAttribute('href'),url);
 assert.ok(!/noindex/i.test(d.querySelector('meta[name="robots"]')?.getAttribute('content')||''));assert.equal(d.querySelectorAll('h1').length,1);
 const analytics=[...d.querySelectorAll('script[src]')].filter(s=>/(?:^|\/)analytics(?:\.[^/]+)?\.js$/.test(s.getAttribute('src')));
 assert.equal(analytics.length,1,'Expected one external analytics initializer: '+url);
 assert.ok(['true','false'].includes(analytics[0].getAttribute('data-enabled')));
 assert.ok(!analytics[0].hasAttribute('data-auto-countries')&&!analytics[0].hasAttribute('data-events'));
 assert.equal(d.querySelectorAll('script[src*="googletagmanager.com"]').length,0,'Google must be inserted only after permission');
 for(const e of d.querySelectorAll('script[src],link[rel="stylesheet"],link[rel="icon"],link[rel="manifest"],image[href]')){const src=e.getAttribute('src')||e.getAttribute('href');if(src.startsWith('/'))assert.ok(fs.existsSync(path.join(root,src)),src);}
}
assert.ok(fs.readFileSync(root+'/robots.txt','utf8').includes('Sitemap: https://heic2png.site/sitemap.xml'));
assert.ok(fs.readFileSync(root+'/404.html','utf8').includes('noindex,follow'));
for(const f of ['favicon.ico','favicon.svg','apple-touch-icon.png','site.webmanifest','brand/social-preview.webp'])assert.ok(fs.existsSync(root+'/'+f));
for(const f of fs.readdirSync(root,{recursive:true})){const p=f.replaceAll('\\','/');assert.ok(!/(^|\/)(\.git|\.env(?:\.|$)|node_modules)(\/|$)/.test(p),'Private artifact: '+p);}
assert.ok(fs.readdirSync(root+'/_astro').some(f=>f.includes('converter.worker-')));assert.ok(fs.readdirSync(root+'/_astro').some(f=>f.endsWith('.wasm')));
console.log('Validated '+urls.length+' canonical pages, error rules, icons and converter artifacts in '+root);
