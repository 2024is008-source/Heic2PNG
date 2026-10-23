import fs from 'node:fs/promises';
import {chromium} from 'playwright';
import {PNG} from 'pngjs';
import pixelmatch from 'pixelmatch';
const base='http://127.0.0.1:4876';
const out='test-results/visual';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:process.env.PLAYWRIGHT_CHANNEL||'chrome'});
const results=[];
const selectedRoute=process.argv[2];
const pages=[['home','/'],['heic-to-jpg','/heic-to-jpg'],['heic-to-avif','/heic-to-avif'],['blog','/blog'],['article','/blog/how-to-convert-heic-to-png-on-windows-11']].filter(([route])=>!selectedRoute||route===selectedRoute);
try{
 for(const width of [1440,1024,768,390,375,320])for(const [route,path] of pages){
  const context=await browser.newContext({viewport:{width,height:1000},deviceScaleFactor:1});
  await context.route('https://cdn.tailwindcss.com/3.4.17',r=>r.fulfill({path:'tests/fixtures/tailwind-cdn.js',contentType:'application/javascript'}));
  const fontCss=(await fs.readFile('public/fonts/fonts.css','utf8')).replaceAll('url(/fonts/','url('+base+'/fonts/');
  await context.route('https://fonts.googleapis.com/**',r=>r.fulfill({body:fontCss,contentType:'text/css'}));
  const original=await context.newPage(),production=await context.newPage();
  await original.goto(base+'/__original');
  await original.evaluate(route=>{
   window.navigateTo(route);window.setConverterStatePreset('empty');
   document.getElementById('design-inspector-bar').remove();
   document.querySelector('.state-pill').parentElement.parentElement.remove();
   document.querySelector('[onclick="loadSampleBatch()"]')?.remove();
   document.querySelector('[onclick="setBlogUIState(\'category\')"]')?.parentElement.remove();
   // Compare real editorial inventory: the other nine cards have no article bodies.
   window.sampleBlogArticles=window.sampleBlogArticles.slice(0,1);window.renderBlogCards();
  },route);
  await production.goto(base+path);
  await Promise.all([original.evaluate(()=>document.fonts.ready),production.evaluate(()=>document.fonts.ready)]);
  for(const p of [original,production])await p.addStyleTag({content:'*,*::before,*::after { transition:none !important; animation:none !important; caret-color:transparent !important; }'});
  const prefix=`${out}/${route}-${width}`;
  await original.screenshot({path:prefix+'-original.png',fullPage:true});
  await production.screenshot({path:prefix+'-production.png',fullPage:true});
  const a=PNG.sync.read(await fs.readFile(prefix+'-original.png')),b=PNG.sync.read(await fs.readFile(prefix+'-production.png'));
  const height=Math.max(a.height,b.height),canvasWidth=Math.max(a.width,b.width),aa=new PNG({width:canvasWidth,height}),bb=new PNG({width:canvasWidth,height}),diff=new PNG({width:canvasWidth,height});
  aa.data.fill(255);bb.data.fill(255);PNG.bitblt(a,aa,0,0,a.width,a.height,0,0);PNG.bitblt(b,bb,0,0,b.width,b.height,0,0);
  const pixels=pixelmatch(aa.data,bb.data,diff.data,canvasWidth,height,{threshold:0.1});await fs.writeFile(prefix+'-diff.png',PNG.sync.write(diff));
  const crops={};
  for(const [name,selector] of [['header','header'],['footer','footer'],...(['home','heic-to-jpg','heic-to-avif'].includes(route)?[['hero','#converter-hero-h1'],['dropzone','#upload-dropzone']]:[])]){
   const originalImage=PNG.sync.read(await original.locator(selector).screenshot());const productionImage=PNG.sync.read(await production.locator(selector).screenshot());
   if(originalImage.width===productionImage.width&&originalImage.height===productionImage.height)crops[name]={differentPixels:pixelmatch(originalImage.data,productionImage.data,null,originalImage.width,originalImage.height,{threshold:0.1}),width:originalImage.width,height:originalImage.height};
   else crops[name]={original:[originalImage.width,originalImage.height],production:[productionImage.width,productionImage.height]};
  }
  const record={route,width,originalHeight:a.height,productionHeight:b.height,differentPercent:Number((pixels/(width*height)*100).toFixed(3)),crops};
  results.push(record);console.log(JSON.stringify(record));await context.close();
 }
}finally{await browser.close();await fs.writeFile(out+'/'+(selectedRoute?selectedRoute+'-results.json':'results.json'),JSON.stringify(results,null,2));}
