import {canonicalPageUrl} from './urls.mjs';
import {pagePaths} from './page-routes.mjs';

export function escapeXml(value) {
 return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
}

function contentDay(value) {
 if(value===undefined||value===null)return undefined;
 const date=new Date(value);
 if(Number.isNaN(date.valueOf()))throw new Error('Invalid sitemap content date.');
 const day=date.toISOString().slice(0,10);
 if(typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&day!==value)throw new Error('Invalid sitemap calendar day.');
 return day;
}

export function articleLastmod(data) {
 const published=contentDay(data.published),updated=contentDay(data.updated);
 if(published&&updated&&updated<published)throw new Error('Sitemap update precedes publication.');
 // These are editorial dates, never filesystem timestamps or the build clock.
 return updated||published;
}

export function createSitemapEntries(articles) {
 const entries=pagePaths.map(path=>({loc:canonicalPageUrl(path)}));
 for(const {data} of articles.filter(entry=>!entry.data.draft&&!entry.data.noindex).sort((a,b)=>a.data.slug.localeCompare(b.data.slug))) {
  entries.push({loc:canonicalPageUrl('/blog/'+data.slug),lastmod:articleLastmod(data)});
 }
 const unique=new Map();
 for(const entry of entries){
  const previous=unique.get(entry.loc);
  if(!previous||(entry.lastmod||'')>(previous.lastmod||''))unique.set(entry.loc,entry);
 }
 return [...unique.values()];
}

export function renderSitemap(entries) {
 return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+
  entries.map(entry=>'  <url>\n    <loc>'+escapeXml(entry.loc)+'</loc>'+ (entry.lastmod?'\n    <lastmod>'+escapeXml(entry.lastmod)+'</lastmod>':'')+'\n  </url>').join('\n')+
  '\n</urlset>\n';
}
