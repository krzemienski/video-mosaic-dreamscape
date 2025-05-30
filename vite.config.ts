
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "es2020"
    },
  },
  build: {
    target: "es2020",
    rollupOptions: {
      // Ensure Rollup doesn't attempt to use unsupported features
      treeshake: {
        moduleSideEffects: true,
      },
      // Add explicit external dependencies if needed
      external: [],
    }
  }
}));
