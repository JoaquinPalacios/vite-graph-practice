import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("recharts")) {
              return "recharts";
            }
            if (id.includes("react")) {
              return "react-vendor";
            }
            return "vendors";
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
