export const siteOrigin='https://heic2png.site';

// Page identity is independent of filters, tracking parameters, fragments and
// directory index aliases. Use only for HTML pages, not asset/endpoint URLs.
export function canonicalPagePath(input='/') {
 const pathname=new URL(input,siteOrigin).pathname.replace(/\/index\.html$/,'/');
 const route=pathname.replace(/\/+$/,'');
 return route?route+'/':'/';
}

export function canonicalPageUrl(input='/') {
 return new URL(canonicalPagePath(input),siteOrigin).href;
}
