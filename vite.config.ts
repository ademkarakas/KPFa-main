import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    server: {
      port: 3001,
      host: "0.0.0.0",
    },
    plugins: [react()],
    define: {
      "process.env.API_KEY": JSON.stringify(env.GEMINI_API_KEY),
      "process.env.GEMINI_API_KEY": JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
    build: {
      // Bundle size warning limit (default: 500KB)
      chunkSizeWarningLimit: 600, // 600KB for admin chunks

      rollupOptions: {
        output: {
          // Manual chunk splitting for better code splitting
          manualChunks: (id) => {
            // Admin panel in separate chunk
            if (id.includes("pages/admin")) {
              return "admin";
            }

            // Vendor libraries in separate chunks
            if (id.includes("node_modules")) {
              if (id.includes("react") || id.includes("react-dom")) {
                return "react-vendor";
              }
              if (id.includes("lucide-react")) {
                return "icons-vendor";
              }
              if (id.includes("i18next") || id.includes("react-i18next")) {
                return "i18n-vendor";
              }
              return "vendor";
            }
          },
        },
      },

      // Source maps for production debugging (optional)
      sourcemap: false,

      // Minification settings
      minify: "esbuild",
      target: "es2015",
    },
  };
});
