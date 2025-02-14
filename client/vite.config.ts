import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
// import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react(),
      // tailwindcss()
    ],
    build: {
      outDir: './build',
      manifest: true,
    },
    server: {
      port: parseInt(env.VITE_PORT) || 3000,
    },
  };
});

