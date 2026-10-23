import fs from 'node:fs';
// Preserve embedded approved HTML as a single uninterrupted Markdown HTML block.
// Blank lines followed by indentation would otherwise become fenced-looking code.
for(const file of fs.readdirSync('src/content/blog').filter(f=>f.endsWith('.md'))){
 let source=fs.readFileSync('src/content/blog/'+file,'utf8');
 const boundary=source.indexOf('\n---',4)+4;
 const head=source.slice(0,boundary), body=source.slice(boundary);
 if(!body.includes('<section'))continue;
 const paths={home:'/',blog:'/blog','heic-to-jpg':'/heic-to-jpg','heic-to-avif':'/heic-to-avif'};
 let content=body.replace(/<button\b([^>]*?)onclick="navigateTo\('([^']+)'\)[^"]*"([^>]*)>([\s\S]*?)<\/button>/g,(all,a,route,b,inner)=>paths[route]?`<a ${a.replace(/type="button"/,'')}href="${paths[route]}"${b}>${inner}</a>`:all.replace(/onclick="[^"]*"/,'disabled title="AVIF encoding is not available yet"'));
 content=content.replace(/<button\b([^>]*?)disabled title="AVIF encoding is not available yet"([^>]*)>([\s\S]*?)<\/button>/g,(all,a,b,inner)=>`<a ${a.replace(/type="button"/,'')}href="/heic-to-avif"${b}>${inner}</a>`);
 content=content.replace(/onclick="openSampleArticle\([^)]+\)"/g,'disabled title="Guide not yet published"');
 // Unsupported color promises and undocumented device testing must not be presented as verified.
 content=content.replace('All tutorials are verified on actual Windows 11, macOS, iOS, and Android devices without synthetic benchmarks.','This guide describes common workflows. Availability of Windows Photos export options depends on the installed version and codecs.');
 content=content.replace('Written &amp; Tested by the HEIC2PNG Editorial Team','Written by the HEIC2PNG Editorial Team');
 content=content.replace('Tested on Windows 11 (24H2) &amp; iOS 18','Windows 11 &amp; iPhone workflow');
 content=content.replace('Display P3 mapped to sRGB','8-bit RGB output');
 content=content.replace(/(?<![\w-])on(click|input|change|submit|dragover|dragleave|drop)="/g,'data-on$1="').replace(/data-(?:data-)+(on\w+)=/g,'data-$1=');
 content=content.replace(/<a\b([^>]*href="\/(?:blog|heic-to-jpg)?"[^>]*)class="([^"\n]+)"/g,(all,attrs,classes)=>{
   const tokens=[...new Set(classes.split(/\s+/).filter(Boolean))];
   if(!tokens.some(t=>['inline-flex','flex','block','inline-block'].includes(t)))tokens.push('inline-block');
   if(!tokens.some(t=>['text-left','text-right','text-center'].includes(t)))tokens.push('text-center');
   return `<a ${attrs}class="${tokens.join(' ')}"`;
 });
 fs.writeFileSync('src/content/blog/'+file,head+'\n\n'+content.trim().replace(/\n\s*\n/g,'\n')+'\n');
}
