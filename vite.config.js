import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig, loadEnv } from "vite";

const DOSSIER_PARTIELS = resolve(__dirname, "src/partials");

/**
 * Fragments HTML partagés entre les pages.
 *
 * Le site n'a pas de framework : sans ce plugin, l'en-tête, le pied de page et
 * le formulaire seraient recopiés dans chaque fichier et finiraient par
 * diverger. Une page écrit simplement :
 *
 *   <!-- @inclure entete page="accueil" extrait="#extrait" -->
 *
 * - `{{cle}}` dans un fragment est remplacé par l'attribut du même nom ;
 * - `page="x"` marque le lien `data-page="x"` comme page courante ;
 * - `%VITE_…%` reçoit la variable d'environnement correspondante.
 *
 * Un paramètre ou une variable manquant fait échouer le build plutôt que de
 * publier une page avec un trou.
 */
function inclusions(env) {
  const motif = /<!--\s*@inclure\s+([\w-]+)((?:\s+[\w-]+="[^"]*")*)\s*-->/g;

  return {
    name: "immocatch-inclusions",
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        return html.replace(motif, (_, nom, attributs) => {
          const params = Object.fromEntries(
            [...attributs.matchAll(/([\w-]+)="([^"]*)"/g)].map((m) => [m[1], m[2]]),
          );
          let contenu = readFileSync(resolve(DOSSIER_PARTIELS, `${nom}.html`), "utf-8");

          contenu = contenu.replace(/\{\{\s*([\w-]+)\s*\}\}/g, (_m, cle) => {
            if (!(cle in params)) {
              throw new Error(`Fragment « ${nom} » : paramètre « ${cle} » manquant.`);
            }
            return params[cle];
          });

          if (params.page) {
            contenu = contenu.replace(
              `data-page="${params.page}"`,
              `data-page="${params.page}" aria-current="page"`,
            );
          }

          return contenu.replace(/%(VITE_[A-Z0-9_]+)%/g, (_m, cle) => {
            if (!env[cle]) throw new Error(`Variable d'environnement ${cle} absente.`);
            return env[cle];
          });
        });
      },
    },
    // Un fragment modifié en développement : on recharge toute la page, les
    // fichiers HTML qui l'incluent n'étant pas suivis par le serveur.
    handleHotUpdate({ file, server }) {
      if (file.startsWith(DOSSIER_PARTIELS)) {
        server.ws.send({ type: "full-reload" });
        return [];
      }
    },
  };
}

/**
 * URLs sans barre finale en développement et en prévisualisation.
 *
 * Vercel sert `/campagne-vendeurs` directement (cleanUrls, trailingSlash à
 * false). Le serveur de Vite, lui, renvoyait la page d'accueil pour cette
 * adresse : on la réécrit vers le fichier de la page, pour que le
 * développement se comporte comme la production.
 */
function urlsPropres() {
  const reecrire = (req, _res, next) => {
    const [chemin, requete] = req.url.split("?");
    if (/^\/[\w-]+$/.test(chemin) && existsSync(resolve(__dirname, chemin.slice(1), "index.html"))) {
      req.url = `${chemin}/index.html${requete ? `?${requete}` : ""}`;
    }
    next();
  };
  return {
    name: "immocatch-urls-propres",
    configureServer(serveur) {
      serveur.middlewares.use(reecrire);
    },
    configurePreviewServer(serveur) {
      serveur.middlewares.use(reecrire);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, "VITE_");

  return {
    plugins: [inclusions(env), urlsPropres()],
    build: {
      target: "es2020",
      cssMinify: true,
      // Three.js est isolé dans son propre chunk : il n'est chargé que par la
      // scène 3D de /automatisations, elle-même importée dynamiquement. Les
      // autres pages ne le téléchargent jamais.
      rollupOptions: {
        // Site à plusieurs pages : chaque fichier HTML doit être déclaré ici,
        // sinon Vite ne le construit pas et la page est introuvable en
        // production. Le dossier donne l'URL, sans barre finale côté Vercel.
        input: {
          accueil: resolve(__dirname, "index.html"),
          campagne: resolve(__dirname, "campagne-vendeurs/index.html"),
          alertes: resolve(__dirname, "alertes-vendeurs/index.html"),
          automatisations: resolve(__dirname, "automatisations/index.html"),
          confidentialite: resolve(__dirname, "politique-de-confidentialite/index.html"),
        },
        output: {
          manualChunks(id) {
            if (id.includes("node_modules/three")) return "three";
          },
        },
      },
    },
    server: { port: 5173 },
  };
});
