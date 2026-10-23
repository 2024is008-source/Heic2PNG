// One-time extraction. The approved HTML remains untouched and is the design source.
import fs from 'node:fs';
import vm from 'node:vm';
import { parseHTML } from 'linkedom';
const source = fs.readFileSync('heic_to_png_converter_free_private_online_iphone_photo_converter_heic2png_site.html', 'utf8');
const { document } = parseHTML(source);
for (const dir of ['src/design','src/scripts','src/content/blog']) fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync('src/styles/approved.css', document.querySelector('style').textContent);
const config = source.match(/tailwind.config = ([\s\S]*?)\n  <\/script>/)[1];
fs.writeFileSync('tailwind.config.cjs', 'module.exports = ' + config.trim() + ';\nmodule.exports.content = ["./src/**/*.{astro,html,js,ts,md,mdx}", "./heic_to_png_converter_free_private_online_iphone_photo_converter_heic2png_site.html"];\n');
const js = [...document.querySelectorAll('script')].at(-1).textContent;
const names = ['renderFileQueue','switchToolFormat','updateJpgQuality','toggleAdvancedSettings','handleResizeModeChange','handleDimensionInput','toggleToolsDropdown','closeToolsDropdown','toggleMobileMenu','closeMobileMenu','toggleFaq','showToast'];
let helpers = 'var currentFormat = "PNG", jpgQuality = 85, avifQuality = 78, toastTimeout = null;\n';
for (const name of names) {
  const start = js.indexOf('    function ' + name + '(');
  let end = js.indexOf('\n    function ',start+5);
  if (end < 0) end = js.indexOf('    // Close dropdown',start);
  let code = js.slice(start,end).replace(/\n    \/\/ ={10,}[\s\S]*$/,'');
  helpers += code + '\n';
}
// Store only actual UI helpers; conversion and demo state functions are excluded.
fs.writeFileSync('src/design/helpers.js', helpers);
const dataset = js.match(/var sampleBlogArticles = ([\s\S]*?);\s*var currentBlogCategory/)[1];
const articles = vm.runInNewContext(dataset);
fs.writeFileSync('src/design/article-catalog.json',JSON.stringify(articles,null,2));
const article = document.getElementById('view-blog-article');
article.classList.remove('hidden');
const first = articles[0];
fs.writeFileSync('src/content/blog/'+first.slug+'.md', '---\n'+Object.entries({title:first.title,slug:first.slug,description:first.summary,category:first.category,author:'HEIC2PNG Editorial Team',published:'2026-10-14',updated:'2026-10-21',draft:false,readTime:first.readTime,accent:first.accent,badgeText:first.badgeText}).map(([k,v])=>k+': '+JSON.stringify(v)).join('\n')+'\n---\n\n'+article.outerHTML+'\n');
// Missing article bodies remain explicitly unpublished, rather than reusing the Windows article.
for (const item of articles.slice(1)) fs.writeFileSync('src/content/blog/'+item.slug+'.md', '---\n'+Object.entries({title:item.title,slug:item.slug,description:item.summary,category:item.category,author:'HEIC2PNG Editorial Team',published:'2026-10-14',draft:true,readTime:item.readTime,accent:item.accent,badgeText:item.badgeText}).map(([k,v])=>k+': '+JSON.stringify(v)).join('\n')+'\n---\n\n<!-- Original prototype supplied a card only. Add reviewed article content before publishing. -->\n');
console.log('Extracted approved styles, UI helpers, one complete article and nine unpublished card drafts.');
