import {defineConfig} from 'vite';
import {resolve} from 'node:path';
export default defineConfig({base:process.env.BASE_PATH||'/',build:{rollupOptions:{input:{main:resolve('index.html'),packageExample:resolve('packages/aquadeck-skin/examples/index.html')}}}});
