import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "es2020",
    cssMinify: true,
    // Three.js est isolé dans son propre chunk : il n'est chargé que par la
    // scène 3D, elle-même importée dynamiquement. Le contenu de la page reste
    // donc lisible même si ce chunk n'arrive jamais.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/three")) return "three";
        },
      },
    },
  },
  server: { port: 5173 },
});
