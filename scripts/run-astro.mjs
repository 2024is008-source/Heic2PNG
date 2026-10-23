import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
// Keep framework telemetry disabled consistently in local and CI builds.
const result=spawnSync(process.execPath,[fileURLToPath(new URL('../node_modules/astro/bin/astro.mjs',import.meta.url)),...process.argv.slice(2)],{stdio:'inherit',env:{...process.env,ASTRO_TELEMETRY_DISABLED:'1'}});
process.exit(result.status??1);
