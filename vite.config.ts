import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

const workspaceRoot = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: 'chakra-ui3-datepicker', replacement: resolve(workspaceRoot, 'src/index.ts') },
      { find: 'chakra-ui3-datepicker/', replacement: resolve(workspaceRoot, 'src/') },
    ],
  },
});
