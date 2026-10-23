// Web-sized transparent wordmarks for the shared header and footer.
// Keep the original artwork and the generated dark master for future exports.
import fs from 'node:fs';
import sharp from 'sharp';

fs.mkdirSync('public/brand',{recursive:true});
for(const [theme,source] of [
  ['light','public/brand/heic2png-logo.png'],
  ['dark','src/assets/brand/heic2png-logo-dark.png'],
]) {
  const output=`public/brand/heic2png-logo-${theme}.webp`;
  await sharp(source)
    .extract({left:117,top:197,width:1953,height:353})
    .resize({width:600})
    .webp({quality:90,alphaQuality:100,effort:6,smartSubsample:true})
    .toFile(output);
  const metadata=await sharp(output).metadata();
  if(!metadata.hasAlpha)throw new Error(`${theme} logo lost transparency`);
  console.log(`${output}: ${metadata.width}×${metadata.height}, ${fs.statSync(output).size} bytes`);
}
