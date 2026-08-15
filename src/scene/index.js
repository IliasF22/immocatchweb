import { PerspectiveCamera, Scene, WebGLRenderer } from "three";

import { creerChampMorphique } from "./morphField.js";

const CYCLE_MS = 3800; // temps passé sur chaque état en lecture automatique

/**
 * Monte la scène 3D du hero et renvoie une petite API de pilotage.
 * Lève une erreur si WebGL n'est pas disponible : l'appelant bascule alors
 * sur l'image de repli.
 */
export function initialiserScene(canvas, { surEtat } = {}) {
  const renderer = new WebGLRenderer({
    canvas,
    antialias: window.devicePixelRatio < 2,
    alpha: true,
    powerPreference: "high-performance",
  });

  if (!renderer.getContext()) throw new Error("WebGL indisponible");

  renderer.setClearAlpha(0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0, 8.4);

  const champ = creerChampMorphique();
  scene.add(champ.maillage);

  // ------------------------------ état ---------------------------------
  let morphCible = 0;
  let morphActuel = 0;
  let etatAnnonce = -1;
  let autoActif = true;
  let dernierBascule = performance.now();

  const souris = { x: 0, y: 0 };
  const sourisLisse = { x: 0, y: 0 };

  // --------------------------- dimensionnement --------------------------
  function redimensionner() {
    const l = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    const ratio = Math.min(window.devicePixelRatio || 1, l < 700 ? 1.75 : 2);

    renderer.setPixelRatio(ratio);
    renderer.setSize(l, h, false);
    camera.aspect = l / h;
    // Sur les cadres étroits, on recule pour que la fiche entre entièrement.
    camera.position.z = camera.aspect < 1 ? 9.6 : 8.4;
    camera.updateProjectionMatrix();
  }

  const observateurTaille = new ResizeObserver(redimensionner);
  observateurTaille.observe(canvas);
  redimensionner();

  // ------------------------------ boucle --------------------------------
  let idFrame = 0;
  let visible = true;
  let horlogeDebut = performance.now();

  function boucle(maintenant) {
    idFrame = requestAnimationFrame(boucle);

    if (autoActif && maintenant - dernierBascule > CYCLE_MS) {
      morphCible = morphCible > 0.5 ? 0 : 1;
      dernierBascule = maintenant;
    }

    // Approche exponentielle : indépendante du nombre d'images par seconde.
    morphActuel += (morphCible - morphActuel) * 0.055;

    const u = champ.uniforms;
    u.uTime.value = (maintenant - horlogeDebut) / 1000;
    u.uMorph.value = morphActuel;
    // L'onde s'apaise à mesure que la fiche se forme.
    u.uSouffle.value = 1 - morphActuel * 0.75;

    sourisLisse.x += (souris.x - sourisLisse.x) * 0.06;
    sourisLisse.y += (souris.y - sourisLisse.y) * 0.06;
    champ.maillage.rotation.y = sourisLisse.x * 0.28;
    champ.maillage.rotation.x = -sourisLisse.y * 0.2;

    // Notification d'état pour le stepper du hero.
    const etat = morphActuel < 0.28 ? 0 : morphActuel < 0.78 ? 1 : 2;
    if (etat !== etatAnnonce) {
      etatAnnonce = etat;
      surEtat?.(etat);
    }

    renderer.render(scene, camera);
  }

  function demarrer() {
    if (idFrame) return;
    horlogeDebut = performance.now() - (champ.uniforms.uTime.value || 0) * 1000;
    dernierBascule = performance.now();
    idFrame = requestAnimationFrame(boucle);
  }

  function arreter() {
    cancelAnimationFrame(idFrame);
    idFrame = 0;
  }

  // On ne calcule rien quand la scène est hors de l'écran ou l'onglet caché :
  // c'est ce qui préserve la batterie sur mobile.
  const observateurVue = new IntersectionObserver(
    ([entree]) => {
      visible = entree.isIntersecting;
      if (visible && document.visibilityState === "visible") demarrer();
      else arreter();
    },
    { threshold: 0.01 },
  );
  observateurVue.observe(canvas);

  function surVisibilite() {
    if (document.visibilityState === "visible" && visible) demarrer();
    else arreter();
  }
  document.addEventListener("visibilitychange", surVisibilite);

  // ---------------------------- interactions ----------------------------
  function surSouris(e) {
    const r = canvas.getBoundingClientRect();
    souris.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    souris.y = ((e.clientY - r.top) / r.height) * 2 - 1;
  }

  function surSortie() {
    souris.x = 0;
    souris.y = 0;
  }

  function surClic() {
    autoActif = false;
    morphCible = morphCible > 0.5 ? 0 : 1;
  }

  canvas.addEventListener("pointermove", surSouris, { passive: true });
  canvas.addEventListener("pointerleave", surSortie, { passive: true });
  canvas.addEventListener("click", surClic);

  return {
    /** Force un état : 0 = onde, 1 = fiche. Coupe la lecture automatique. */
    viser(valeur) {
      autoActif = false;
      morphCible = valeur;
    },
    /** Relance l'alternance automatique. */
    reprendreAuto() {
      autoActif = true;
      dernierBascule = performance.now();
    },
    detruire() {
      arreter();
      observateurVue.disconnect();
      observateurTaille.disconnect();
      document.removeEventListener("visibilitychange", surVisibilite);
      canvas.removeEventListener("pointermove", surSouris);
      canvas.removeEventListener("pointerleave", surSortie);
      canvas.removeEventListener("click", surClic);
      champ.liberer();
      renderer.dispose();
    },
  };
}
