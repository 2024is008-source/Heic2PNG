import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import {siteOrigin} from './src/lib/urls.mjs';
export default defineConfig({ site: siteOrigin, trailingSlash: 'always', output: 'static', integrations:[mdx()], build: { format: 'directory' }, vite:{worker:{format:'es'}} });
