import {getCollection} from 'astro:content';
export async function GET() {
 const entries=(await getCollection('blog')).filter(e=>!e.data.draft);
 const urls=['/','/heic-to-jpg','/heic-to-avif','/blog','/about','/contact','/privacy','/terms',...entries.map(e=>'/blog/'+e.data.slug)];
 return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+urls.map(path=>'<url><loc>https://heic2png.site'+path+'</loc></url>').join('')+'</urlset>',{headers:{'Content-Type':'application/xml'}});
}
