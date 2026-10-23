// Transform output only: preserve editorial Markdown and existing table styling.
export function enhanceArticleMarkup(html) {
 if(!html.includes('id="view-blog-article"'))return html;
 return html
    .replace('class="rounded-xl bg-white border border-[#E2E8F0] p-3 flex items-center justify-between text-xs"','class="rounded-xl bg-white border border-[#E2E8F0] p-3 flex items-center justify-between text-xs illustration-queue-row"')
    .replace(/<div class="([^"]*\boverflow-hidden\b[^"]*)">(\s*<table\b)/g,
     (_,classes,table)=>'<div class="'+classes+' article-table-scroll" tabindex="0" role="region" aria-label="Comparison table; scroll horizontally to see all columns">'+table);
}
