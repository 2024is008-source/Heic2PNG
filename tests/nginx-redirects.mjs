// Real Nginx, loopback only. NGINX_BIN must name a local disposable binary.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawn,spawnSync} from 'node:child_process';
import http from 'node:http';
import https from 'node:https';
const bin=process.env.NGINX_BIN;
if(!bin)throw new Error('Set NGINX_BIN to a disposable Nginx binary; never target a running service.');
const root=path.resolve(process.env.HEIC_TEST_DIST||'dist'),dir=path.resolve('.astro/nginx-redirect-test');
fs.mkdirSync(dir,{recursive:true});fs.mkdirSync(dir+'/logs',{recursive:true});
fs.mkdirSync(dir+'/temp',{recursive:true});
const slash=s=>s.replaceAll('\\','/');
const openssl=process.env.OPENSSL_BIN||'openssl';
let result=spawnSync(openssl,['req','-x509','-newkey','rsa:2048','-nodes','-keyout',dir+'/key.pem','-out',dir+'/cert.pem','-days','1','-subj','/CN=heic2png.site'],{encoding:'utf8',windowsHide:true});
assert.equal(result.status,0,result.stderr);
const acme=dir+'/acme';fs.mkdirSync(acme+'/.well-known/acme-challenge',{recursive:true});fs.writeFileSync(acme+'/.well-known/acme-challenge/probe','acme-ok');
const quote=s=>'"'+slash(s)+'"';
let config=fs.readFileSync('deploy/heic2png.canonical.conf.example','utf8')
 .replaceAll('listen 80;','listen 127.0.0.1:18080;').replaceAll('listen 443 ssl;','listen 127.0.0.1:18443 ssl;')
 .replace(/^\s*listen \[::\].*;\r?\n/gm,'')
 .replaceAll('/var/www/heic2png.site/current',quote(root)).replaceAll('/var/www/heic2png.site/acme',quote(acme))
 .replaceAll('/etc/letsencrypt/live/heic2png.site/fullchain.pem',quote(dir+'/cert.pem')).replaceAll('/etc/letsencrypt/live/heic2png.site/privkey.pem',quote(dir+'/key.pem'))
 .replaceAll('/var/log/nginx/heic2png.access.log',quote(dir+'/logs/access.log')).replaceAll('/var/log/nginx/heic2png.error.log',quote(dir+'/logs/error.log'));
const mime=process.env.NGINX_MIME||path.join(path.dirname(bin),'conf/mime.types');
config='pid '+quote(dir+'/nginx.pid')+';\nerror_log '+quote(dir+'/logs/master.log')+';\nevents {}\nhttp { include '+quote(mime)+';\n'+config+'\n}\n';
fs.writeFileSync(dir+'/nginx.conf',config);
const args=['-p',slash(dir)+'/', '-c',slash(dir+'/nginx.conf')];
result=spawnSync(bin,[...args,'-t'],{encoding:'utf8',windowsHide:true});assert.equal(result.status,0,result.stderr);
const child=spawn(bin,[...args,'-g','daemon off;'],{stdio:'ignore',windowsHide:true});
const checks=[];
async function get(host,url,tls=true){
 return new Promise((resolve,reject)=>{
  const request=(tls?https:http).get({hostname:'127.0.0.1',port:tls?18443:18080,path:url,headers:{Host:host},servername:host,rejectUnauthorized:false},r=>{const chunks=[];r.on('data',d=>chunks.push(d));r.on('end',()=>resolve({status:r.statusCode,location:r.headers.location,type:r.headers['content-type'],body:Buffer.concat(chunks).toString()}));});
  request.setTimeout(5000,()=>request.destroy(new Error('Nginx response timeout')));request.on('error',reject);
 });
}
async function check(host,url,status,location,tls=true){const r=await get(host,url,tls);assert.equal(r.status,status,host+url);if(location)assert.equal(r.location,location,host+url);checks.push({host,url,tls,status:r.status,location:r.location,type:r.type});return r;}
try{
 for(let i=0;;i++){try{await get('heic2png.site','/');break;}catch(e){if(i===40)throw e;await new Promise(r=>setTimeout(r,100));}}
 const urls=[...fs.readFileSync(root+'/sitemap.xml','utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
 for(const canonical of urls){
  const p=new URL(canonical).pathname;
  await check('heic2png.site',p,200);
  await check('heic2png.site',p+'index.html?x=1&y=two',301,canonical+'?x=1&y=two');
  if(p!=='/')await check('heic2png.site',p.slice(0,-1)+'?x=1&y=two',301,canonical+'?x=1&y=two');
  await check('www.heic2png.site',p+'?x=1',301,canonical+'?x=1');
 }
 for(const host of ['heic2png.site','www.heic2png.site'])await check(host,'/?q=one',301,'https://heic2png.site/?q=one',false);
 for(const p of ['/missing','/missing/','/missing/index.html','/blog/what-is-a-heic-file-beginners-guide/','/blog/heic-vs-avif-whats-the-difference/','/blog/how-to-convert-multiple-heic-photos-at-once/'])await check('heic2png.site',p,404);
 for(const p of ['/sitemap.xml','/robots.txt','/favicon.ico','/favicon.svg','/site.webmanifest','/fonts/fonts.css','/fonts/Inter-400.woff2'])await check('heic2png.site',p,200);
 for(const f of fs.readdirSync(root+'/_astro').filter(f=>/\.wasm$|\.js$|\.css$/.test(f)))await check('heic2png.site','/_astro/'+f,200);
 for(const host of ['heic2png.site','www.heic2png.site'])await check(host,'/.well-known/acme-challenge/probe',200,undefined,false);
 for(const p of ['/.env','/.git/config','/.git/index.html'])await check('heic2png.site',p,403);
 let host='www.heic2png.site',p='/heic-to-jpg/index.html?query=kept',tls=false;const seen=new Set();let hops=0;
 for(;;){const key=host+p+tls;assert.ok(!seen.has(key),'Redirect loop');seen.add(key);const r=await get(host,p,tls);if(r.status===200)break;assert.equal(r.status,301);assert.ok(++hops<=2,'Too many redirects');const u=new URL(r.location);host=u.host;p=u.pathname+u.search;tls=true;}
 fs.writeFileSync('.astro/nginx-redirect-results.json',JSON.stringify({passed:true,version:spawnSync(bin,['-v'],{encoding:'utf8'}).stderr.trim(),checks,hops},null,2));
 console.log(JSON.stringify({passed:true,checks:checks.length,hops,configTest:result.stderr.trim()}));
}finally{
 spawnSync(bin,[...args,'-s','quit'],{windowsHide:true});
 await new Promise(resolve=>{if(child.exitCode!==null)return resolve();const timer=setTimeout(()=>{child.kill();resolve();},3000);child.once('exit',()=>{clearTimeout(timer);resolve();});});
}
