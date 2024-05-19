import { fileURLToPath, URL } from "node:url";

import unocss from "@unocss/vite";
import vue from "@vitejs/plugin-vue";
import { presetUno } from "unocss";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    unocss(
      {
        presets: [presetUno()],
      },
    ),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ""),
        ws: true,
      },
    },
  },
});
