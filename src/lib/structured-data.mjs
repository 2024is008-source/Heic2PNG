import {canonicalPagePath,canonicalPageUrl,siteOrigin} from './urls.mjs';

// The collection records publication days, not verified publication times.
function publicationDay(value) {
 const date=new Date(value);
 if(Number.isNaN(date.valueOf()))throw new Error('Invalid article schema date.');
 return date.toISOString().slice(0,10);
}

export function createStructuredData({path,title,description,entry,noindex=false}) {
 const pagePath=canonicalPagePath(path);
 if(noindex||pagePath==='/404/'||entry?.data.draft)return null;
 const canonical=canonicalPageUrl(pagePath),home=canonicalPageUrl('/');
 const publisherId=home+'#organization',websiteId=home+'#website',pageId=canonical+'#webpage';
 const page={
  '@type':'WebPage','@id':pageId,url:canonical,name:title,description,inLanguage:'en',
  isPartOf:{'@id':websiteId},publisher:{'@id':publisherId}
 };
 // Stable IDs identify the same site/publisher across documents. Each entity is
 // defined once per graph; the page and its main entity refer to those IDs.
 const graph=[
  {'@type':'Organization','@id':publisherId,name:'HEIC2PNG',url:home,logo:new URL('/brand/heic2png-logo.png',siteOrigin).href},
  {'@type':'WebSite','@id':websiteId,name:'HEIC2PNG',url:home,inLanguage:'en',publisher:{'@id':publisherId}},
  page
 ];
 // SoftwareApplication is semantically plausible for the converters, but the
 // site has no genuine reviews/ratings required for Google's app rich result.
 // Describe those pages with WebPage instead of publishing ineligible markup.
 if(entry) {
  const articleId=canonical+'#article',breadcrumbId=canonical+'#breadcrumb';
  const datePublished=publicationDay(entry.data.published);
  const dateModified=publicationDay(entry.data.updated||entry.data.published);
  if(dateModified<datePublished)throw new Error('Article update precedes publication: '+canonical);
  page.mainEntity={'@id':articleId};page.breadcrumb={'@id':breadcrumbId};
  graph.push({
   '@type':'BlogPosting','@id':articleId,url:canonical,headline:entry.data.title,description,inLanguage:'en',
   datePublished,dateModified,author:{'@type':'Organization',name:entry.data.author},
   publisher:{'@id':publisherId},mainEntityOfPage:canonical,
   ...(entry.data.image?{image:new URL(entry.data.image,siteOrigin).href}:{})
  });
  // The category chip points back to the same blog archive, not a separate
  // indexable parent. Represent the actual Home > Blog > article hierarchy.
  graph.push({
   '@type':'BreadcrumbList','@id':breadcrumbId,itemListElement:[
    {'@type':'ListItem',position:1,name:'Home',item:home},
    {'@type':'ListItem',position:2,name:'Blog',item:canonicalPageUrl('/blog/')},
    {'@type':'ListItem',position:3,name:entry.data.title,item:canonical}
   ]
  });
 }
 return {'@context':'https://schema.org','@graph':graph};
}

export function serializeStructuredData(schema) {
 return JSON.stringify(schema).replace(/</g,'\\u003c');
}
