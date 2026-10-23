/// <reference path="../../node_modules/@jsquash/avif/emscripten-types.d.ts" />
import createEncoder from '@jsquash/avif/codec/enc/avif_enc.js';
import {defaultOptions} from '@jsquash/avif/meta.js';
import wasmUrl from '@jsquash/avif/codec/enc/avif_enc.wasm?url';

export type AvifChroma = '420'|'444'|'lossless';
// Use the package's single-thread codec explicitly. It needs no SharedArrayBuffer,
// cross-origin isolation, extra pthread scripts, or changes to other hosted sites.
const encoder = createEncoder({noInitialRun:true,locateFile:()=>wasmUrl});

export async function encodeAvif(image:ImageData,quality:number,chroma:AvifChroma):Promise<Blob> {
 if(!['420','444','lossless'].includes(chroma))throw new Error('Unsupported AVIF chroma setting.');
 if(!Number.isFinite(quality)||quality<40||quality>95)throw new Error('AVIF quality must be between 40 and 95.');
 const lossless=chroma==='lossless';
 const module=await encoder;
 const options={
  ...defaultOptions,bitDepth:8,speed:8,
  quality:lossless?100:quality,
  qualityAlpha:lossless?-1:100,
  subsample:chroma==='420'?1:3,
  lossless,
 };
 const output=module.encode(new Uint8Array(image.data.buffer,image.data.byteOffset,image.data.byteLength),image.width,image.height,options);
 if(!output?.byteLength)throw new Error('AVIF encoding failed. Try a smaller image.');
 const bytes=new Uint8Array(output);
 const header=new TextDecoder('latin1').decode(bytes.subarray(0,64));
 if(header.slice(4,8)!=='ftyp'||!header.includes('avif'))throw new Error('Encoder did not produce a valid AVIF container.');
 return new Blob([bytes.buffer],{type:'image/avif'});
}
