import { defineConfig } from 'vite'
import { resolve } from 'path'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'manifest.json',
          dest: '.'
        },
        {
          src: 'icons',
          dest: '.'
        }
      ]
    })
  ],
  build: {
    outDir: 'dist',
    minify: 'terser',
    terserOptions: {
      mangle: {
        keep_fnames: true
      }
    },
    rollupOptions: {
      input: {
        'popup.html': resolve(__dirname, 'src/popup/index.html'),
        'popup.js': resolve(__dirname, 'src/popup/popup.ts'),
        content: resolve(__dirname, 'src/content/content.ts'),
        'content.css': resolve(__dirname, 'src/content/content.css'),
        background: resolve(__dirname, 'src/background/background.ts'),
        injected: resolve(__dirname, 'src/injected/injected.ts')
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === 'popup.js' ? 'popup.js' : '[name].js';
        },
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
