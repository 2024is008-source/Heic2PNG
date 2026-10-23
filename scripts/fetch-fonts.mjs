import fs from 'node:fs/promises';
const css=await fs.readFile('tests/fixtures/google-fonts.css','utf8');
await fs.mkdir('public/fonts',{recursive:true});
let local=css;
for(const block of css.matchAll(/@font-face\s*\{([^}]+)\}/g)){
 const family=block[1].match(/font-family: '([^']+)'/)[1].replaceAll(' ','-');
 const weight=block[1].match(/font-weight: (\d+)/)[1];
 const url=block[1].match(/url\(([^)]+)\)/)[1];
 const filename=family+'-'+weight+'.ttf';
 const result=await fetch(url);if(!result.ok)throw new Error('Font download failed: '+result.status);
 await fs.writeFile('public/fonts/'+filename,Buffer.from(await result.arrayBuffer()));
 local=local.replace(url,'/fonts/'+filename);
}
await fs.writeFile('public/fonts/fonts.css',local);
console.log('Downloaded exact approved font families and weights for local hosting.');
