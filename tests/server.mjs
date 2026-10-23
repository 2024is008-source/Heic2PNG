import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(process.env.HEIC_TEST_DIST||'dist');
http.createServer((req,res)=>{
 const url=new URL(req.url,'http://localhost');let pathname=decodeURIComponent(url.pathname);
 const special={'/__original':path.resolve('heic_to_png_converter_free_private_online_iphone_photo_converter_heic2png_site.html'),'/__tailwind':path.resolve('tests/fixtures/tailwind-cdn.js')};
 let target=special[pathname]||path.resolve(root,'.'+pathname);
 if(!target.startsWith(root)&&!special[pathname]){res.writeHead(403).end();return;}
 if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,'index.html');
 let status=200;if(!fs.existsSync(target)){status=404;target=path.join(root,'404.html');}
 const headers={'X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin'};
 if(!special[pathname])headers['Content-Security-Policy']="default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; worker-src 'self' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'none'";
 const ext=path.extname(target);res.writeHead(status,{...headers,'Content-Type':({'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.xml':'application/xml','.txt':'text/plain','.wasm':'application/wasm','.ttf':'font/ttf','.woff2':'font/woff2','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.ico':'image/x-icon','.webmanifest':'application/manifest+json'})[ext]||'application/octet-stream'});
 fs.createReadStream(target).pipe(res);
}).listen(4876,'127.0.0.1',()=>console.log('Static verification server on http://127.0.0.1:4876'));
