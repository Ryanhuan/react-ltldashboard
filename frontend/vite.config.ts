import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [legacy(), react({
    babel: {
      plugins: [
        [
          'babel-plugin-styled-components',
          {
            displayName: true,
            fileName: false
          }
        ]
      ]
    }
  })],
  resolve: {
    alias: {
      // for TypeScript path alias import like : @/x/y/z
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      '@/components': fileURLToPath(new URL("./src/components", import.meta.url)),
      '@/pages': fileURLToPath(new URL("./src/pages", import.meta.url)),
      '@/assets': fileURLToPath(new URL("./src/assets", import.meta.url)),
      '@/contexts': fileURLToPath(new URL("./src/contexts", import.meta.url)),
      '@/css': fileURLToPath(new URL("./src/css", import.meta.url)),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        secure: false,
        rewrite: path => path.replace(/^\/api/, ""),
      },
    },
  }
});
