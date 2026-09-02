import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    watch: {
      ignored: ['**/.chrome-smoke-profile*/**', '**/dist/**']
    }
  }
});
