import generouted from '@generouted/react-router/plugin'
import react from '@vitejs/plugin-react-swc'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, normalizePath } from 'vite'
import svgr from 'vite-plugin-svgr'
import i18nResource from './vite-plugins/i18n-resource'
import UnoCSS from 'unocss/vite'
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url);
const pdfjsDistPath = path.dirname(require.resolve('pdfjs-dist/package.json'));
const cMapsDir = normalizePath(path.join(pdfjsDistPath, 'cmaps'));
const standardFontsDir = normalizePath(path.join(pdfjsDistPath, 'standard_fonts'));

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  plugins: [
    UnoCSS(),
    react(),
    svgr({ svgrOptions: {} }),
    generouted(),
    i18nResource({ entry: './src/i18n/locales' }),
    viteStaticCopy({ targets: [{src: cMapsDir, dest: '' }, { src: standardFontsDir, dest: ''}] })
  ],

  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
    preprocessorOptions: {
      less: {}
    }
  },

  server: {
    proxy: {
      '/api': {
        target: 'https://xiangjiandao.rivtower.cc',
        // target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        // rewrite: path => path.replace(/^\/api/, ''),
      },
      '/post': {
        target: 'https://xiangjiandao.rivtower.cc',
        // target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        // rewrite: path => path.replace(/^\/api/, ''),
      }
    }
  }
  // server: {
  //   port: 5000,
  // }

})
