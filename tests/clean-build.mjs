import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
const repo=process.cwd(),parent=path.resolve('.astro');fs.mkdirSync(parent,{recursive:true});
const dir=fs.mkdtempSync(path.join(parent,'clean-build-'));
const npm=process.env.npm_execpath;assert.ok(npm,'Run using npm run test:clean-build');
try{
 for(const file of ['src','public','scripts','tests','package.json','package-lock.json','astro.config.mjs','tailwind.config.cjs','tsconfig.json','tsconfig.worker.json','heic_to_png_converter_free_private_online_iphone_photo_converter_heic2png_site.html'])fs.cpSync(path.join(repo,file),path.join(dir,file),{recursive:true});
 // No Git repository and no generated files are required in a fresh checkout.
 fs.rmSync(path.join(dir,'src/generated'),{recursive:true,force:true});
 const results=[];
 for(const args of [['ci'],['run','build'],['run','check'],['run','build'],['run','validate:release']]){
  const r=spawnSync(process.execPath,[npm,...args],{cwd:dir,encoding:'utf8',timeout:180000,windowsHide:true});
  results.push({command:'npm '+args.join(' '),exitCode:r.status});
  assert.equal(r.status,0,(r.stdout+'\n'+r.stderr).slice(-6000));
 }
 fs.writeFileSync('.astro/clean-build-results.json',JSON.stringify({passed:true,results},null,2));console.log(JSON.stringify({passed:true,results}));
}finally{
 assert.equal(path.dirname(path.resolve(dir)),parent);assert.ok(path.basename(dir).startsWith('clean-build-'));
 fs.rmSync(dir,{recursive:true,force:true});
}
