import tailwindcssPlugin from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/modules/custom/swellnet_location_forecast_v2/js/dist/",
  plugins: [react(), tailwindcssPlugin()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    manifest: true, // Critical for BigPipe asset loading

    rollupOptions: {
      // Multiple entry points for BigPipe progressive loading
      // Order optimized for performance - critical content loads first
      input: {
        // 🚀 PRIORITY 1: Main application shell - loads first
        main: path.resolve(__dirname, "src/main.tsx"),

        // 📊 PRIORITY 2: Visible chart components - load early
        charts: path.resolve(__dirname, "src/entries/charts.tsx"),

        // 🌤️ PRIORITY 3: Weather/tide widgets - visible content
        weather: path.resolve(__dirname, "src/entries/weather.tsx"),
        tides: path.resolve(__dirname, "src/entries/tides.tsx"),

        // 🎯 PRIORITY 4: Heavy D3 components - load LAST (hidden by default)
        advanced: path.resolve(__dirname, "src/entries/advanced.tsx"),

        // 🔒 PRIORITY 5: Conditional overlays - load when needed
        subscription: path.resolve(__dirname, "src/entries/subscription.tsx"),

        // 📋 PRIORITY 6: Content components - load with data
        "surf-report": path.resolve(__dirname, "src/entries/surf-report.tsx"),
      },

      output: {
        // Organized file naming for better caching
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",

        // Enhanced chunking strategy for BigPipe
        manualChunks: (id) => {
          // Core React dependencies - shared across all entries
          if (id.includes("node_modules")) {
            if (id.includes("react") && !id.includes("recharts")) {
              return "react-core";
            }

            // Chart libraries - only load when needed
            if (id.includes("recharts")) {
              return "recharts-lib";
            }

            if (id.includes("d3")) {
              return "d3-lib";
            }

            // Date/time utilities - commonly used
            if (id.includes("date-fns") || id.includes("moment")) {
              return "date-utils";
            }

            // API and utility libraries
            if (id.includes("axios") || id.includes("fetch")) {
              return "api-utils";
            }

            // Other vendor dependencies
            return "vendors";
          }

          // BigPipe base entry - shared across entries
          if (id.includes("src/lib/bigpipe-entry")) {
            return "bigpipe-base";
          }

          // Group internal utilities by functionality
          if (id.includes("src/lib/")) {
            return "app-utils";
          }

          if (id.includes("src/types/")) {
            return "type-definitions";
          }

          // Component chunking for better caching
          if (id.includes("src/components/SwellChart")) {
            return "swell-chart";
          }

          if (id.includes("src/components/WeatherChart")) {
            return "weather-chart";
          }

          if (id.includes("src/components/TideChart")) {
            return "tide-chart";
          }

          if (id.includes("src/components/AdvanceD3Chart")) {
            return "advanced-chart";
          }

          if (id.includes("src/components/SurfReport")) {
            return "surf-report";
          }
        },
      },
    },

    // Increased limit for chart libraries (recharts + D3 are legitimately large)
    chunkSizeWarningLimit: 1000, // Increased from 600 to 1MB

    // Enable source maps for debugging BigPipe issues
    sourcemap: process.env.NODE_ENV === "development",

    // Optimize for modern browsers (better tree shaking)
    target: "es2020",

    // Better compression for production
    minify: "esbuild",

    // Generate CSS code splitting
    cssCodeSplit: true,
  },

  // Development optimizations
  server: {
    // Enable HMR for faster development
    hmr: true,
  },

  // Dependency optimization for faster dev builds
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "recharts",
      // Pre-optimize commonly used libraries
    ],
    exclude: [
      // Exclude large libraries that might not be needed immediately
      "d3",
    ],
  },
});
