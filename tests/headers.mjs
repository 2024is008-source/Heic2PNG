// Focused recheck after restoring native-button text alignment on real nav links.
import fs from 'node:fs/promises';
import {chromium} from 'playwright';
import {PNG} from 'pngjs';
import pixelmatch from 'pixelmatch';
const browser=await chromium.launch({channel:process.env.PLAYWRIGHT_CHANNEL||'chrome'}),results=[];
try{
 const page=await browser.newPage();
 for(const width of [1440,1024,768,390,375,320])for(const [route,path]of [['home','/'],['heic-to-jpg','/heic-to-jpg'],['blog','/blog'],['article','/blog/how-to-convert-heic-to-png-on-windows-11']]){
  await page.setViewportSize({width,height:1000});await page.goto('http://127.0.0.1:4876'+path);await page.evaluate(()=>document.fonts.ready);
  const b=PNG.sync.read(await page.locator('header').screenshot({path:`test-results/visual/${route}-${width}-header-final.png`}));
  const full=PNG.sync.read(await fs.readFile(`test-results/visual/${route}-${width}-original.png`));const a=new PNG({width:b.width,height:b.height});PNG.bitblt(full,a,0,0,a.width,a.height,0,0);
  results.push({route,width,differentPixels:pixelmatch(a.data,b.data,null,a.width,a.height,{threshold:0.1})});
 }
 console.log(JSON.stringify(results));
}finally{await browser.close();await fs.writeFile('test-results/visual/headers-final.json',JSON.stringify(results,null,2));}
