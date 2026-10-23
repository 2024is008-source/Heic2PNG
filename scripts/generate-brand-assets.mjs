// Deterministic derivatives of the owner-approved artwork; no new logo design.
import fs from 'node:fs';
import sharp from 'sharp';
const source='public/brand/heic2png-logo.png';
// The original square gradient mark is at the left of the supplied wordmark.
const mark=await sharp(source).extract({left:117,top:197,width:369,height:353}).resize(512,512,{fit:'contain',background:'#00000000'}).png().toBuffer();
fs.mkdirSync('public/icons',{recursive:true});
const ico=[];
for(const size of [16,32,48,180,192,512]){
 const buffer=await sharp(mark).resize(size,size).png({compressionLevel:9}).toBuffer();
 const file=size===180?'public/apple-touch-icon.png':size<=32?'public/favicon-'+size+'x'+size+'.png':'public/icons/icon-'+size+'.png';
 fs.writeFileSync(file,buffer);if(size<=48)ico.push({size,buffer});
}
const header=Buffer.alloc(6+16*ico.length);header.writeUInt16LE(1,2);header.writeUInt16LE(ico.length,4);let offset=header.length;
for(const [i,{size,buffer}]of ico.entries()){
 const p=6+16*i;header[p]=size;header[p+1]=size;header.writeUInt16LE(1,p+4);header.writeUInt16LE(32,p+6);header.writeUInt32LE(buffer.length,p+8);header.writeUInt32LE(offset,p+12);offset+=buffer.length;
}
fs.writeFileSync('public/favicon.ico',Buffer.concat([header,...ico.map(i=>i.buffer)]));
// SVG wraps only the actual approved raster mark; it does not invent vector art.
const svgMark=await sharp(mark).resize(64).png({compressionLevel:9}).toBuffer();
fs.writeFileSync('public/favicon.svg','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><image width="192" height="192" href="data:image/png;base64,'+svgMark.toString('base64')+'"/></svg>\n');
fs.writeFileSync('public/site.webmanifest',JSON.stringify({name:'HEIC2PNG',short_name:'HEIC2PNG',start_url:'/',display:'browser',background_color:'#F8FAFC',theme_color:'#4F46E5',icons:[192,512].map(size=>({src:'/icons/icon-'+size+'.png',sizes:size+'x'+size,type:'image/png',purpose:'any'}))},null,2)+'\n');
await sharp(source).webp({lossless:true,effort:6}).toFile('public/brand/heic2png-logo.lossless.webp');
const logo=await sharp(source).extract({left:117,top:197,width:1953,height:353}).resize(1080,196,{fit:'contain',background:'#00000000'}).png().toBuffer();
await sharp({create:{width:1200,height:630,channels:4,background:'#F8FAFC'}}).composite([{input:logo,left:60,top:217}]).webp({quality:95}).toFile('public/brand/social-preview.webp');
// Visible decoded pixels must match; fully transparent RGB is not visible.
const a=await sharp(source).ensureAlpha().raw().toBuffer(),b=await sharp('public/brand/heic2png-logo.lossless.webp').ensureAlpha().raw().toBuffer();
for(let i=0;i<a.length;i+=4)if(a[i+3]!==b[i+3]||(a[i+3]&&a.subarray(i,i+3).compare(b.subarray(i,i+3))!==0))throw new Error('Logo pixels changed');
console.log('Generated approved-brand icons, manifest, social preview and lossless logo.');
await import('./generate-logo-variants.mjs');
