import {defineMiddleware} from 'astro:middleware';
import {enhanceArticleMarkup} from './lib/article-markup.mjs';

// Render-time correction: never rewrite the Markdown files during a build.
export const onRequest=defineMiddleware(async(_,next)=>{
 const response=await next();
 if(!response.headers.get('content-type')?.includes('text/html'))return response;
 const html=await response.text();
 const headers=new Headers(response.headers);headers.delete('content-length');
 return new Response(enhanceArticleMarkup(html),{status:response.status,statusText:response.statusText,headers});
});
