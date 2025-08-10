import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/", // 👈 Muy importante para que en producción sirva los assets correctamente
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    https: {
      key: "consher-privateKey.key",
      cert: "consher.crt",
    },
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});
