/**
 * Point d'entrée.
 *
 * Ordre volontaire : le contenu et l'interface d'abord, la scène 3D ensuite,
 * en import dynamique. Three.js n'est donc jamais sur le chemin critique — si
 * le chunk tarde, échoue ou n'est pas souhaité (animations réduites, absence
 * de WebGL), la page reste complète et l'image de repli prend la place.
 */

// Fraunces complet : la citation utilise sa vraie italique.
// Inter et JetBrains Mono se limitent à l'axe de graisse (aucune italique
// dans la maquette), ce qui évite d'embarquer les fichiers inutiles.
import "@fontsource-variable/fraunces";
import "@fontsource-variable/inter/wght.css";
import "@fontsource-variable/jetbrains-mono/wght.css";

import "./styles/main.css";

import { initialiserAnalytics } from "./ui/analytics.js";
import { initialiserEntete } from "./ui/header.js";
import { initialiserFaq } from "./ui/faq.js";
import { initialiserApparitions, initialiserCompteurs } from "./ui/reveal.js";
import { initialiserTimeline } from "./timeline/index.js";

document.documentElement.classList.remove("no-js");

initialiserEntete();
initialiserFaq();
initialiserApparitions();
initialiserCompteurs();
initialiserAnalytics();

function afficherRepli() {
  const canvas = document.querySelector("#scene-canvas");
  const repli = document.querySelector("#scene-repli");
  // L'image de repli porte déjà ses propres légendes, et « Aperçu en direct »
  // serait faux devant une image fixe : on masque celles du DOM.
  const legende = document.querySelector(".scene__legende");
  if (canvas) canvas.hidden = true;
  if (repli) repli.hidden = false;
  if (legende) legende.hidden = true;
}

async function demarrerScene() {
  const canvas = document.querySelector("#scene-canvas");
  if (!canvas) return;

  const reduites = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduites) {
    afficherRepli();
    return;
  }

  try {
    const { initialiserScene } = await import("./scene/index.js");
    let timeline;
    const scene = initialiserScene(canvas, {
      surEtat: (etat) => timeline?.refleter(etat),
    });
    timeline = initialiserTimeline({ scene });
  } catch (erreur) {
    // Pas de WebGL, pilote défaillant, chunk indisponible : on retombe sur
    // l'image plutôt que de laisser un cadre vide.
    console.warn("Scène 3D indisponible, repli sur l'image.", erreur);
    afficherRepli();
  }
}

// La scène attend que la page soit peinte : le hero textuel s'affiche en premier.
if (document.readyState === "complete") demarrerScene();
else window.addEventListener("load", demarrerScene, { once: true });
