/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss()],
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./__tests__/setup.ts",
    server: {
      deps: {
        inline: ["@exodus/bytes", "html-encoding-sniffer"],
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@engine": path.resolve(__dirname, "./src/app/core"),
      "@shared": path.resolve(__dirname, "./src/shared"),
      "@logic": path.resolve(__dirname, "./src/app/core/mechanics"),
      "@ai": path.resolve(__dirname, "./src/app/core/bot"),
      "@setup": path.resolve(__dirname, "./src/app/core/setup"),
      "@mechanics": path.resolve(__dirname, "./src/app/core/mechanics"),
      "@primitives": path.resolve(__dirname, "./src/app/core/primitives"),
      "@blueprints": path.resolve(__dirname, "./src/app/core/blueprints"),
      "@seeds": path.resolve(__dirname, "./src/app/core/setup/seeds"),
      "@tc.types": path.resolve(__dirname, "types"),
      "@bionics": path.resolve(__dirname, "./src/shared/components"),
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
      "@controllers": path.resolve(__dirname, "./src/shared/hooks/controllers"),
      "@hooks": path.resolve(__dirname, "./src/shared/hooks"),
      "@context": path.resolve(__dirname, "./src/shared/context"),
      "@utils": path.resolve(__dirname, "./src/shared/utilities"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@game": path.resolve(__dirname, "./src/app/client/console"),
      "@gameHooks": path.resolve(
        __dirname,
        "./src/app/client/console/shared/hooks",
      ),
      "@gameUtils": path.resolve(
        __dirname,
        "./src/app/client/console/shared/utils",
      ),
      "@constants": path.resolve(__dirname, "./constants"),
      "@client": path.resolve(__dirname, "./src/app/client"),
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
