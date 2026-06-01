import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite is used only for the local demo/dev harness (src/App.tsx).
// The publishable library is built with `tsc -p tsconfig.lib.json` so that the
// platform-specific files (primitives/index.native.tsx) are preserved for
// Metro / React Native consumers rather than bundled into one web build.
export default defineConfig({
  plugins: [react()],
});
