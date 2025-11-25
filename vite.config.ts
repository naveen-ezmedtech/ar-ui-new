import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
    
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
    
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
        // Prevent overly aggressive tree-shaking
        pure_funcs: [],
      },
      mangle: {
        // Preserve function names for components
        keep_classnames: true,
        keep_fnames: true,
      },
    },
  },
})