import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// =====================================
// ALPHA LAN — Vite Configuration
// =====================================
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true, // allows LAN access (important for local network use)
    port: 5173,
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://localhost:5000", // backend server
        changeOrigin: true,
        secure: false,
      },
      "/socket.io": {
        target: "http://localhost:5000",
        ws: true,
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  css: {
    preprocessorOptions: {
      css: {
        charset: false,
      },
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify("1.0.0"),
  },
});
