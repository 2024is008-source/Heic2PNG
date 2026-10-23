import fs from 'node:fs/promises';
import {chromium} from 'playwright';
import {PNG} from 'pngjs';
import pixelmatch from 'pixelmatch';
const base='http://127.0.0.1:4876',out='test-results/states';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:process.env.PLAYWRIGHT_CHANNEL||'chrome'});
const context=await browser.newContext({viewport:{width:1440,height:1000}});
const css=(await fs.readFile('public/fonts/fonts.css','utf8')).replaceAll('url(/fonts/','url('+base+'/fonts/');
await context.route('https://fonts.googleapis.com/**',r=>r.fulfill({body:css,contentType:'text/css'}));
await context.route('https://cdn.tailwindcss.com/3.4.17',r=>r.fulfill({path:'tests/fixtures/tailwind-cdn.js',contentType:'application/javascript'}));
const production=await context.newPage(),original=await context.newPage(),results=[];
async function compare(name,width,selector){
 const a=PNG.sync.read(await original.locator(selector).screenshot({path:`${out}/${name}-${width}-original.png`}));
 const b=PNG.sync.read(await production.locator(selector).screenshot({path:`${out}/${name}-${width}-production.png`}));
 const value=a.width===b.width&&a.height===b.height?{differentPixels:pixelmatch(a.data,b.data,null,a.width,a.height,{threshold:0.1})}:{original:[a.width,a.height],production:[b.width,b.height]};
 results.push({name,width,...value});console.log(JSON.stringify(results.at(-1)));
}
try{
 await production.goto(base);await original.goto(base+'/__original');
 for(const page of [original,production])await page.addStyleTag({content:'*,*::before,*::after { transition:none !important; animation:none !important; }'});
 await Promise.all([production.evaluate(()=>document.fonts.ready),original.evaluate(()=>document.fonts.ready)]);
 await original.evaluate(()=>{document.getElementById('design-inspector-bar').remove();document.querySelector('.state-pill').parentElement.parentElement.remove();document.querySelector('[onclick="loadSampleBatch()"]')?.remove();});
 const bytes=(await fs.stat('tests/fixtures/example.heic')).size;
 await production.locator('#real-file-input').setInputFiles('tests/fixtures/example.heic');
 await production.locator('.file-row-item').waitFor();
 const preview=await production.locator('.file-row-item img').getAttribute('src');
 await original.evaluate(({bytes,preview})=>{window.fileQueue=[{id:'real-test',name:'example.heic',inputSizeMB:bytes/1024/1024,dimensions:'Dimensions available after decoding',colorSpace:'Not inspected',status:'queued',progress:0,errorMessage:''}];window.getThumbnailSvgDataUri=()=>preview;window.renderFileQueue();},{bytes,preview});
 for(const width of [1440,1024,768,390,375,320]){for(const page of [original,production])await page.setViewportSize({width,height:1000});await compare('queued',width,'.file-row-item');}
 await production.locator('#btn-primary-convert').click();
 await production.waitForFunction(()=>!document.getElementById('btn-primary-convert').disabled);
 const completedPreview=await production.locator('.file-row-item img').getAttribute('src');
 const status=await production.locator('.file-row-actions > span').first().textContent();
 await original.evaluate(({preview,size})=>{Object.assign(window.fileQueue[0],{status:'completed',progress:100,dimensions:'1280 × 854 px',colorSpace:'8-bit RGB'});window.getThumbnailSvgDataUri=()=>preview;window.calculateEstimatedOutputSize=()=>size;window.renderFileQueue();},{preview:completedPreview,size:status.replace('Completed → ','')});
 await production.locator('#btn-toggle-advanced').click();await original.evaluate(()=>window.toggleAdvancedSettings());
 for(const width of [1440,1024,768,390,375,320]){for(const page of [original,production])await page.setViewportSize({width,height:1000});await compare('completed',width,'.file-row-item');await compare('advanced',width,'#advanced-settings-panel');}
 for(const width of [390,375,320]){for(const page of [original,production])await page.setViewportSize({width,height:1000});await production.locator('#mobile-menu-btn').click();await original.evaluate(()=>window.toggleMobileMenu());await compare('mobile-menu',width,'#mobile-nav-drawer');await production.keyboard.press('Escape');await original.evaluate(()=>window.closeMobileMenu());}
}finally{await browser.close();await fs.writeFile(out+'/results.json',JSON.stringify(results,null,2));}
