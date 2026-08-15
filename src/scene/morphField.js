import {
  BoxGeometry,
  Color,
  DoubleSide,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  Mesh,
  ShaderMaterial,
} from "three";

import { fragmentShader, vertexShader } from "./shaders.js";

const COLONNES = 62;
const PILE = 30; // hauteur maximale d'une colonne, en cubes
const NOMBRE = COLONNES * PILE;

/** Générateur pseudo-aléatoire déterministe : le rendu est le même à chaque visite. */
function rng(graine) {
  let e = graine >>> 0;
  return () => {
    e = (e * 1664525 + 1013904223) >>> 0;
    return e / 4294967296;
  };
}

/**
 * Segments composant la fiche structurée : un cadre, un titre, un sous-titre,
 * un filet, quatre lignes « libellé + valeur », et une barre de validation.
 * Chaque segment reçoit un nombre de cubes proportionnel à sa longueur.
 */
function segmentsFiche() {
  const L = -2.2;
  const R = 2.2;
  const H = 2.5;
  const gauche = -1.75;

  const ligne = (x1, y1, x2, y2) => ({ x1, y1, x2, y2 });

  const cadre = [
    ligne(L, H, R, H),
    ligne(L, -H, R, -H),
    ligne(L, -H, L, H),
    ligne(R, -H, R, H),
  ];

  const contenu = [
    ligne(gauche, 1.95, 0.5, 1.95), // titre
    ligne(gauche, 1.55, -0.4, 1.55), // sous-titre
    ligne(gauche, 1.15, 1.75, 1.15), // filet
    // quatre champs : libellé court à gauche, valeur de longueur variable
    ligne(gauche, 0.6, -0.85, 0.6),
    ligne(-0.5, 0.6, 0.95, 0.6),
    ligne(gauche, 0.1, -0.85, 0.1),
    ligne(-0.5, 0.1, 1.45, 0.1),
    ligne(gauche, -0.4, -0.85, -0.4),
    ligne(-0.5, -0.4, 0.55, -0.4),
    ligne(gauche, -0.9, -0.85, -0.9),
    ligne(-0.5, -0.9, 1.6, -0.9),
    ligne(gauche, -1.6, 1.75, -1.6), // barre de validation
  ];

  return [...cadre, ...contenu];
}

function pointsFiche(nombre) {
  const segments = segmentsFiche();
  const longueurs = segments.map((s) => Math.hypot(s.x2 - s.x1, s.y2 - s.y1));
  const total = longueurs.reduce((a, b) => a + b, 0);

  const alea = rng(20260802);
  const points = [];

  segments.forEach((s, i) => {
    const part = Math.max(2, Math.round((longueurs[i] / total) * nombre));
    for (let k = 0; k < part; k += 1) {
      const t = part === 1 ? 0.5 : k / (part - 1);
      points.push([
        s.x1 + (s.x2 - s.x1) * t,
        s.y1 + (s.y2 - s.y1) * t,
        (alea() - 0.5) * 0.06,
      ]);
    }
  });

  // Ajustement à l'effectif exact : on complète ou on tronque.
  while (points.length < nombre) points.push(points[points.length % points.length]);
  points.length = nombre;

  // Mélange déterministe : sans lui, des cubes voisins dans l'onde
  // atterrissent côte à côte et la transition paraît rigide.
  for (let i = points.length - 1; i > 0; i -= 1) {
    const j = Math.floor(alea() * (i + 1));
    [points[i], points[j]] = [points[j], points[i]];
  }

  return points;
}

export function creerChampMorphique() {
  const base = new BoxGeometry(1, 1, 1);

  const geometrie = new InstancedBufferGeometry();
  geometrie.index = base.index;
  geometrie.setAttribute("position", base.attributes.position);
  geometrie.setAttribute("normal", base.attributes.normal);
  geometrie.instanceCount = NOMBRE;

  const carte = new Float32Array(NOMBRE * 3);
  const col = new Float32Array(NOMBRE);
  const row = new Float32Array(NOMBRE);
  const delai = new Float32Array(NOMBRE);
  const graine = new Float32Array(NOMBRE);

  const cibles = pointsFiche(NOMBRE);
  const alea = rng(4242);

  let i = 0;
  for (let c = 0; c < COLONNES; c += 1) {
    for (let r = 0; r < PILE; r += 1) {
      const cible = cibles[i];
      carte[i * 3] = cible[0];
      carte[i * 3 + 1] = cible[1];
      carte[i * 3 + 2] = cible[2];

      col[i] = c;
      row[i] = r - (PILE - 1) / 2;

      // La fiche se remplit de la gauche vers la droite.
      delai[i] = (cible[0] + 2.3) / 4.6;
      graine[i] = alea();

      i += 1;
    }
  }

  geometrie.setAttribute("aCard", new InstancedBufferAttribute(carte, 3));
  geometrie.setAttribute("aCol", new InstancedBufferAttribute(col, 1));
  geometrie.setAttribute("aRow", new InstancedBufferAttribute(row, 1));
  geometrie.setAttribute("aDelai", new InstancedBufferAttribute(delai, 1));
  geometrie.setAttribute("aGraine", new InstancedBufferAttribute(graine, 1));

  const materiau = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    side: DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uMorph: { value: 0 },
      uPile: { value: PILE / 2 },
      uSouffle: { value: 1 },
      uLampe: { value: new Color("#A8E8B0") },
      uAmbre: { value: new Color("#F4B266") },
      uOs: { value: new Color("#E8E1D3") },
    },
  });

  const maillage = new Mesh(geometrie, materiau);
  maillage.frustumCulled = false;

  return {
    maillage,
    uniforms: materiau.uniforms,
    liberer() {
      geometrie.dispose();
      base.dispose();
      materiau.dispose();
    },
  };
}
