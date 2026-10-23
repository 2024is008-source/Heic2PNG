/// <reference lib="webworker" />
import { heicTo } from 'heic-to/csp';
type Settings = {format:'PNG'|'JPG'|'AVIF'; quality:number; avifChroma:'420'|'444'|'lossless'; mode:string; width:number; height:number; aspect:boolean; axis:'w'|'h'};
// Inspect declared image sizes before the decoder allocates pixel buffers.
async function preflight(file:File) {
 let boxes=0;
 async function visit(start:number,end:number,depth:number):Promise<void> {
  if(depth>8)throw new Error('HEIF container nesting is too complex.');
  for(let offset=start;offset+8<=end;) {
   if(++boxes>4096)throw new Error('HEIF container has too many properties.');
   const raw=await file.slice(offset,offset+24).arrayBuffer();const view=new DataView(raw);
   let size=view.getUint32(0),header=8;
   const type=String.fromCharCode(...new Uint8Array(raw,4,4));
   if(size===1){if(raw.byteLength<16)throw new Error('Truncated HEIF box.');size=Number(view.getBigUint64(8));header=16;}
   if(size===0)size=end-offset;
   if(size<header||!Number.isSafeInteger(size)||offset+size>end)throw new Error('Invalid or truncated HEIF container.');
   if(type==='ispe'){
    const data=new DataView(await file.slice(offset+header,offset+header+12).arrayBuffer());
    if(data.byteLength<12)throw new Error('Missing image dimensions.');
    const w=data.getUint32(4),h=data.getUint32(8);
    if(!w||!h||w*h>60_000_000)throw new Error('Image exceeds the 60 megapixel memory limit or has invalid dimensions.');
   }
   if(['meta','iprp','ipco'].includes(type))await visit(offset+header+(type==='meta'?4:0),offset+size,depth+1);
   offset+=size;
  }
 }
 await visit(0,file.size,0);
}
self.onmessage = async ({data}:{data:{file:File; settings:Settings}}) => {
 let bitmap:ImageBitmap|undefined, canvas:OffscreenCanvas|undefined;
 try {
  await preflight(data.file);
  bitmap=await heicTo({blob:data.file,type:'bitmap'});
  const {width:originalWidth,height:originalHeight}=bitmap;
  if(originalWidth*originalHeight>60_000_000)throw new Error('Image exceeds the 60 megapixel memory limit.');
  let width=originalWidth,height=originalHeight;
  const s=data.settings;
  if(s.mode==='scale-50'){width=Math.max(1,Math.round(width/2));height=Math.max(1,Math.round(height/2));}
  if(s.mode==='web-1920'){const scale=Math.min(1,1920/width);width=Math.max(1,Math.round(width*scale));height=Math.max(1,Math.round(height*scale));}
  if(s.mode==='custom'){
   const valid=(n:number)=>Number.isInteger(n)&&n>=1&&n<=16384;
   if(s.aspect?!valid(s.axis==='h'?s.height:s.width):!valid(s.width)||!valid(s.height))throw new Error('Enter whole-number dimensions between 1 and 16384 pixels.');
   width=s.width;height=s.height;
   if(s.aspect){if(s.axis==='h')width=Math.max(1,Math.round(height*originalWidth/originalHeight));else height=Math.max(1,Math.round(width*originalHeight/originalWidth));}
  }
  if(width*height>60_000_000)throw new Error('Output exceeds the 60 megapixel memory limit.');
  canvas=new OffscreenCanvas(width,height);
  const ctx=canvas.getContext('2d',{colorSpace:'srgb'});
  if(!ctx)throw new Error('Canvas is unavailable in this browser.');
  if(s.format==='JPG'){ctx.fillStyle='#ffffff';ctx.fillRect(0,0,width,height);}
  ctx.drawImage(bitmap,0,0,width,height);
  const type=s.format==='AVIF'?'image/avif':s.format==='JPG'?'image/jpeg':'image/png';
  let blob:Blob;
  if(s.format==='AVIF'){
   const {encodeAvif}=await import('./avif-encoder');
   blob=await encodeAvif(ctx.getImageData(0,0,width,height),s.quality,s.avifChroma);
  }else blob=await canvas.convertToBlob({type,quality:s.quality/100});
  if(blob.type!==type)throw new Error('This browser cannot encode the requested format.');
  const scale=Math.min(1,160/width,120/height);
  const preview=new OffscreenCanvas(Math.max(1,Math.round(width*scale)),Math.max(1,Math.round(height*scale)));
  preview.getContext('2d')!.drawImage(canvas,0,0,preview.width,preview.height);
  const thumbnail=await preview.convertToBlob({type:'image/png'});
  self.postMessage({blob,thumbnail,width,height,originalWidth,originalHeight});
 }catch(error){self.postMessage({error:error instanceof Error?error.message:String(error)});}
 finally{bitmap?.close();if(canvas){canvas.width=1;canvas.height=1;}}
};
