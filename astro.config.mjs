import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
export default defineConfig({ site: 'https://heic2png.site', output: 'static', integrations:[mdx()], build: { format: 'directory' }, vite:{worker:{format:'es'}} });
