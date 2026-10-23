import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
function inventory(root,exclude=[]){return Object.fromEntries(fs.readdirSync(root,{recursive:true}).filter(p=>!exclude.some(e=>p.replaceAll('\\','/').startsWith(e))&&fs.statSync(path.join(root,p)).isFile()).sort().map(p=>[p,hash(fs.readFileSync(path.join(root,p)))]));}
test('two production builds do not mutate source and produce identical artifacts',{timeout:180000},()=>{
 const input=()=>Object.fromEntries(['src','public','scripts'].map(dir=>[dir,inventory(dir,dir==='src'?['generated/']:[])]));
 const before=input(),status=()=>spawnSync('git',['status','--short'],{encoding:'utf8'}).stdout;
 const beforeStatus=status();let first;
 for(let i=0;i<2;i++){
  const result=spawnSync(process.execPath,['scripts/prepare-client.mjs'],{encoding:'utf8'});assert.equal(result.status,0,result.stderr);
  const tailwind=spawnSync(process.execPath,['node_modules/tailwindcss/lib/cli.js','-c','tailwind.config.cjs','-i','src/styles/input.css','-o','src/generated/styles.css','--minify'],{encoding:'utf8'});assert.equal(tailwind.status,0,tailwind.stderr);
  const build=spawnSync(process.execPath,['scripts/run-astro.mjs','build'],{encoding:'utf8',timeout:60000});assert.equal(build.status,0,build.stdout+build.stderr);
  assert.deepEqual(input(),before,'Build changed source files');assert.equal(status(),beforeStatus,'Build changed Git status');
  const output=inventory('dist');if(first)assert.deepEqual(output,first,'Build output is not reproducible');else first=output;
 }
 fs.mkdirSync('.astro',{recursive:true});fs.writeFileSync('.astro/build-reproducibility-results.json',JSON.stringify({passed:true,builds:2,files:Object.keys(first).length,sourceUnchanged:true,gitStatusUnchanged:true},null,2));
});
