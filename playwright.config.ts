import {defineConfig} from '@playwright/test';
export default defineConfig({
 testDir:'./tests', testMatch:'**/*.spec.ts', timeout:120000, workers:1,
 use:{baseURL:'http://127.0.0.1:4876',headless:true,channel:process.env.PLAYWRIGHT_CHANNEL||'chrome'},
 webServer:{command:'node tests/server.mjs',url:'http://127.0.0.1:4876',reuseExistingServer:true},
 reporter:[['list'],['html',{open:'never'}]]
});
