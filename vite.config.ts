import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  base: "/trenchess/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@engine": path.resolve(__dirname, "./src/engine"),
      "@shared": path.resolve(__dirname, "./src/shared"),
      "@logic": path.resolve(__dirname, "./src/engine/logic"),
      "@ai": path.resolve(__dirname, "./src/engine/ai"),
      "@setup": path.resolve(__dirname, "./src/engine/setup"),
      "@engineConfigs": path.resolve(__dirname, "./src/engine/configs"),
      "@engineTypes": path.resolve(__dirname, "./src/engine/types"),
      "@bionics": path.resolve(__dirname, "./src/shared/bionics"),
      "@atoms": path.resolve(__dirname, "./src/shared/components/atoms"),
      "@molecules": path.resolve(
        __dirname,
        "./src/shared/components/molecules",
      ),
      "@organisms": path.resolve(
        __dirname,
        "./src/shared/components/organisms",
      ),
      "@templates": path.resolve(
        __dirname,
        "./src/shared/components/templates",
      ),
      "@hooks": path.resolve(__dirname, "./src/shared/hooks"),
      "@utils": path.resolve(__dirname, "./src/shared/utils"),
      "@assets": path.resolve(__dirname, "./src/shared/assets"),

      "@game": path.resolve(__dirname, "./src/client/game"),
      "@constants": path.resolve(__dirname, "./src/constants"),
      "@client": path.resolve(__dirname, "./src/client"),
    },
  },
  server: {
    host: true,
    headers: {
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin",
    },
    allowedHosts: ["battle-chess.loca.lt", "trenchess.loca.lt"],
  },
});
