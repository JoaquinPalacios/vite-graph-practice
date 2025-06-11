import path from "path";
import tailwindcssPlugin from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/profiles/swellnet/modules/custom/swellnet_location_forecast_v2/js/dist/",
  plugins: [react(), tailwindcssPlugin()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    manifest: true,
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
