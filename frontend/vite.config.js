/* eslint-env node */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@api": path.resolve(__dirname, "src/api"),
      "@shared": path.resolve(__dirname, "src/components/shared"),
      "@rewards": path.resolve(__dirname, "src/components/rewards"),
      "@user": path.resolve(__dirname, "src/components/user"),
    },
  },
  define: {
    "process.env.VITE_API_URL": JSON.stringify(
      process.env.VITE_API_URL || "http://localhost:3000",
    ),
  },
});
