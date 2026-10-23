import {getCollection} from 'astro:content';
import {createSitemapEntries,renderSitemap} from '../lib/sitemap.mjs';
export async function GET() {
 return new Response(renderSitemap(createSitemapEntries(await getCollection('blog'))),{headers:{'Content-Type':'application/xml; charset=utf-8'}});
}
