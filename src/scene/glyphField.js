import {
  BoxGeometry,
  Color,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  Mesh,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from "three";

import { DEMI_HAUTEUR, construireGlyphes } from "./glyphs.js";

/**
 * Glyphes du parcours, en cubes qui s'assemblent.
 *
 * Chaque étape de la conversation a son objet : micro, fiche, acheteurs,
 * coche, enveloppe. Les cubes tombent depuis le haut, dispersés, et se posent
 * en formation quand le message correspondant entre à l'écran.
 *
 * Un maillage par glyphe plutôt qu'un seul pour l'ensemble : cela évite
 * d'indexer dynamiquement un tableau d'uniformes dans le shader (mal supporté
 * en GLSL ES 1.00) et laisse chaque glyphe avoir sa propre progression et sa
 * propre teinte, pour cinq appels de rendu seulement.
 */

const vertexShader = /* glsl */ `
  uniform float uAvancement;
  uniform float uTemps;
  uniform float uTaille;

  attribute vec3 aDepart;
  attribute vec3 aCible;
  attribute float aDelai;
  attribute float aGraine;

  varying vec3 vNormale;
  varying float vAvance;

  void main() {
    // Chaque cube part avec son propre retard : la formation se remplit
    // progressivement au lieu d'apparaître d'un bloc.
    float a = clamp((uAvancement - aDelai * 0.45) / 0.55, 0.0, 1.0);
    a = 1.0 - pow(1.0 - a, 3.0);

    vec3 cible = aCible;
    // Respiration discrète une fois la formation en place.
    cible.z += sin(uTemps * 1.1 + aGraine * 6.283) * 0.03 * a;

    vec3 centre = mix(aDepart, cible, a);

    // Les cubes grossissent en arrivant : ils semblent se condenser.
    float taille = mix(0.3, 1.0, a) * uTaille;

    vNormale = normalMatrix * normal;
    vAvance = a;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position * taille + centre, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform vec3 uTeinte;
  uniform vec3 uOs;

  varying vec3 vNormale;
  varying float vAvance;

  void main() {
    if (vAvance < 0.02) discard;

    vec3 n = normalize(vNormale);
    vec3 cle = normalize(vec3(0.4, 0.8, 0.6));
    vec3 remplissage = normalize(vec3(-0.5, -0.2, 0.4));

    float diff = 0.4 + 0.6 * max(dot(n, cle), 0.0);
    diff += 0.12 * max(dot(n, remplissage), 0.0);

    // Blanc os en vol, teinte de l'étape une fois posé.
    vec3 couleur = mix(uOs, uTeinte, smoothstep(0.3, 1.0, vAvance));

    gl_FragColor = vec4(couleur * diff, vAvance * 0.95);
  }
`;

/** Teinte par étape : vert pour ce qui vient de l'agent, ambre pour la donnée. */
const TEINTES = {
  micro: "#A8E8B0",
  fiche: "#F4B266",
  acheteurs: "#F4B266",
  coche: "#A8E8B0",
  enveloppe: "#F4B266",
};

function alea(graine) {
  let e = graine >>> 0;
  return () => {
    e = (e * 1664525 + 1013904223) >>> 0;
    return e / 4294967296;
  };
}

export function initialiserGlyphes(canvas, { surPret } = {}) {
  const renderer = new WebGLRenderer({
    canvas,
    antialias: window.devicePixelRatio < 2,
    alpha: true,
    powerPreference: "high-performance",
  });

  if (!renderer.getContext()) throw new Error("WebGL indisponible");
  renderer.setClearAlpha(0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(46, 1, 0.1, 100);
  camera.position.set(0, 0, 11);

  const base = new BoxGeometry(1, 1, 1);
  const rnd = alea(20260809);

  const unites = construireGlyphes().map((glyphe) => {
    const nombre = glyphe.points.length;

    const cible = new Float32Array(nombre * 3);
    const depart = new Float32Array(nombre * 3);
    const delai = new Float32Array(nombre);
    const graine = new Float32Array(nombre);

    glyphe.points.forEach((p, i) => {
      cible[i * 3] = p[0];
      cible[i * 3 + 1] = p[1];
      cible[i * 3 + 2] = p[2];

      // Départ : au-dessus et dispersé. Les cubes descendent en se rangeant,
      // ce qui se lit comme un assemblage plutôt qu'un simple fondu.
      depart[i * 3] = p[0] + (rnd() - 0.5) * 1.7;
      depart[i * 3 + 1] = p[1] + 1.6 + rnd() * 1.5;
      depart[i * 3 + 2] = p[2] + (rnd() - 0.5) * 1.5;

      // Les rangées du haut se posent en premier.
      const hauteurRelative = (p[1] + DEMI_HAUTEUR) / (DEMI_HAUTEUR * 2);
      delai[i] = rnd() * 0.35 + (1 - hauteurRelative) * 0.5;
      graine[i] = rnd();
    });

    const geometrie = new InstancedBufferGeometry();
    geometrie.index = base.index;
    geometrie.setAttribute("position", base.attributes.position);
    geometrie.setAttribute("normal", base.attributes.normal);
    geometrie.instanceCount = nombre;
    geometrie.setAttribute("aCible", new InstancedBufferAttribute(cible, 3));
    geometrie.setAttribute("aDepart", new InstancedBufferAttribute(depart, 3));
    geometrie.setAttribute("aDelai", new InstancedBufferAttribute(delai, 1));
    geometrie.setAttribute("aGraine", new InstancedBufferAttribute(graine, 1));

    const materiau = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uAvancement: { value: 0 },
        uTemps: { value: 0 },
        uTaille: { value: 0.085 },
        uTeinte: { value: new Color(TEINTES[glyphe.nom] || "#E8E1D3") },
        uOs: { value: new Color("#E8E1D3") },
      },
    });

    const maillage = new Mesh(geometrie, materiau);
    maillage.frustumCulled = false;
    maillage.visible = false;
    scene.add(maillage);

    return { nom: glyphe.nom, maillage, materiau, geometrie, avancementCible: 0 };
  });

  // --------------------------- dimensionnement --------------------------
  let demiHauteur = 1;
  let demiLargeur = 1;

  function redimensionner() {
    const l = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, l < 700 ? 1.75 : 2));
    renderer.setSize(l, h, false);
    camera.aspect = l / h;
    camera.updateProjectionMatrix();

    // Dimensions du plan z = 0 vues par la caméra : sert à convertir une
    // position à l'écran en position dans la scène.
    demiHauteur = camera.position.z * Math.tan((camera.fov * Math.PI) / 360);
    demiLargeur = demiHauteur * camera.aspect;

    // Glyphes plus discrets sur écran étroit, où ils croisent le texte.
    const echelle = l < 700 ? 0.72 : 1;
    unites.forEach((u) => u.maillage.scale.setScalar(echelle));
  }

  const observateurTaille = new ResizeObserver(redimensionner);
  observateurTaille.observe(canvas);
  redimensionner();

  // ------------------------------ boucle --------------------------------
  let idFrame = 0;
  let visible = false;
  let annonce = false;
  const debut = performance.now();

  function boucle(maintenant) {
    idFrame = requestAnimationFrame(boucle);
    const t = (maintenant - debut) / 1000;

    unites.forEach((u) => {
      const actuel = u.materiau.uniforms.uAvancement.value;
      u.materiau.uniforms.uAvancement.value = actuel + (u.avancementCible - actuel) * 0.06;
      u.materiau.uniforms.uTemps.value = t;
    });

    renderer.render(scene, camera);

    if (!annonce) {
      annonce = true;
      surPret?.();
    }
  }

  function demarrer() {
    if (idFrame) return;
    idFrame = requestAnimationFrame(boucle);
  }

  function arreter() {
    cancelAnimationFrame(idFrame);
    idFrame = 0;
  }

  const observateurVue = new IntersectionObserver(
    ([entree]) => {
      visible = entree.isIntersecting;
      if (visible && document.visibilityState === "visible") demarrer();
      else arreter();
    },
    { threshold: 0 },
  );
  observateurVue.observe(canvas);

  function surVisibilite() {
    if (document.visibilityState === "visible" && visible) demarrer();
    else arreter();
  }
  document.addEventListener("visibilitychange", surVisibilite);

  return {
    /**
     * Place un glyphe en face de son message.
     * `xNdc` et `yNdc` sont dans [-1, 1], repère écran (y vers le haut).
     */
    placer(index, xNdc, yNdc, dansLeCadre) {
      const u = unites[index];
      if (!u) return;
      u.maillage.visible = dansLeCadre;
      u.maillage.position.set(xNdc * demiLargeur, yNdc * demiHauteur, 0);
    },
    /** Lance (ou annule) l'assemblage d'un glyphe. */
    assembler(index, actif) {
      const u = unites[index];
      if (u) u.avancementCible = actif ? 1 : 0;
    },
    detruire() {
      arreter();
      observateurVue.disconnect();
      observateurTaille.disconnect();
      document.removeEventListener("visibilitychange", surVisibilite);
      unites.forEach((u) => {
        u.geometrie.dispose();
        u.materiau.dispose();
      });
      base.dispose();
      renderer.dispose();
    },
  };
}
