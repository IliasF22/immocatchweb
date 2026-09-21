import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "es2020",
    cssMinify: true,
    // Three.js est isolé dans son propre chunk : il n'est chargé que par la
    // scène 3D, elle-même importée dynamiquement. Le contenu de la page reste
    // donc lisible même si ce chunk n'arrive jamais.
    rollupOptions: {
      // Site à plusieurs pages : chaque fichier HTML doit être déclaré ici,
      // sinon Vite ne construit que index.html et la page est introuvable en
      // production. Le dossier donne l'URL : /politique-de-confidentialite/
      input: {
        accueil: resolve(__dirname, "index.html"),
        confidentialite: resolve(
          __dirname,
          "politique-de-confidentialite/index.html",
        ),
      },
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/three")) return "three";
        },
      },
    },
  },
  server: { port: 5173 },
});
