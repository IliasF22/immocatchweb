import {
  CatmullRomCurve3,
  Color,
  Mesh,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  TubeGeometry,
  Vector3,
  WebGLRenderer,
} from "three";

/**
 * Ruban 3D de la section « Flux en direct ».
 *
 * Un tube suit une courbe qui serpente en diagonale derrière la conversation.
 * Il se dessine au fil du défilement : le vert lampe (la voix) vire à l'ambre
 * (la donnée rangée) à mesure qu'il progresse, avec une crête lumineuse à
 * l'endroit exact où il est en train de se tracer.
 *
 * Le tracé n'est pas un décor gratuit : il matérialise le trajet « je parle →
 * c'est structuré » sur toute la hauteur de la section.
 */

const vertexShader = /* glsl */ `
  uniform float uTemps;
  uniform float uProgres;

  varying vec2 vUv;
  varying vec3 vNormale;

  void main() {
    vUv = uv;
    vNormale = normalMatrix * normal;

    vec3 place = position;
    // Respiration lente : le ruban n'est jamais parfaitement figé.
    place.z += sin(uv.x * 9.0 + uTemps * 0.9) * 0.14;
    place.y += cos(uv.x * 6.0 - uTemps * 0.7) * 0.08;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(place, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uProgres;
  uniform vec3 uLampe;
  uniform vec3 uAmbre;
  uniform vec3 uOs;

  varying vec2 vUv;
  varying vec3 vNormale;

  void main() {
    // Le ruban n'existe que jusqu'au point atteint par le défilement.
    if (vUv.x > uProgres) discard;

    vec3 n = normalize(vNormale);
    vec3 cle = normalize(vec3(0.35, 0.75, 0.55));
    float diff = 0.35 + 0.65 * max(dot(n, cle), 0.0);

    // La voix (vert) devient donnée (ambre) le long du trajet.
    vec3 teinte = mix(uLampe, uAmbre, smoothstep(0.05, 0.85, vUv.x));

    // Crête lumineuse à l'endroit où le tracé avance.
    float crete = smoothstep(0.045, 0.0, uProgres - vUv.x);
    teinte = mix(teinte, uOs, crete * 0.75);

    // Léger fondu à l'amorce, pour que le ruban n'apparaisse pas coupé net.
    float amorce = smoothstep(0.0, 0.06, vUv.x);

    gl_FragColor = vec4(teinte * diff, amorce * 0.92);
  }
`;

export function initialiserRuban(canvas, { surPret } = {}) {
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

  // Courbe en S, parcourue de haut en bas : la conversation la longe.
  const courbe = new CatmullRomCurve3([
    new Vector3(-5.6, 4.6, -1.6),
    new Vector3(-1.6, 3.1, 0.9),
    new Vector3(2.9, 1.6, -0.8),
    new Vector3(-0.6, -0.2, 1.2),
    new Vector3(-3.9, -1.9, -0.6),
    new Vector3(0.7, -3.4, 0.8),
    new Vector3(5.2, -4.8, -1.4),
  ]);

  // Le tube est plus fin sur écran étroit : à pleine épaisseur, il passait
  // devant les bulles et gênait franchement la lecture sur téléphone.
  const rayonPour = (largeur) => (largeur < 700 ? 0.085 : 0.17);

  let profil = window.innerWidth < 700 ? "etroit" : "large";
  let geometrie = new TubeGeometry(courbe, 340, rayonPour(window.innerWidth), 18, false);

  const materiau = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    uniforms: {
      uTemps: { value: 0 },
      uProgres: { value: 0 },
      uLampe: { value: new Color("#A8E8B0") },
      uAmbre: { value: new Color("#F4B266") },
      uOs: { value: new Color("#E8E1D3") },
    },
  });

  const ruban = new Mesh(geometrie, materiau);
  scene.add(ruban);

  // --------------------------- dimensionnement --------------------------
  function redimensionner() {
    const l = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, l < 700 ? 1.75 : 2));
    renderer.setSize(l, h, false);
    camera.aspect = l / h;
    // Sur écran étroit, on recule pour garder tout le ruban dans le cadre.
    camera.position.z = camera.aspect < 0.9 ? 15 : 11;
    camera.updateProjectionMatrix();

    // Changement de profil (rotation d'un téléphone, fenêtre redimensionnée) :
    // on refabrique le tube à la bonne épaisseur plutôt que de garder celle
    // décidée au chargement.
    const nouveauProfil = window.innerWidth < 700 ? "etroit" : "large";
    if (nouveauProfil !== profil) {
      profil = nouveauProfil;
      const ancienne = geometrie;
      geometrie = new TubeGeometry(courbe, 340, rayonPour(window.innerWidth), 18, false);
      ruban.geometry = geometrie;
      ancienne.dispose();
    }
  }

  const observateurTaille = new ResizeObserver(redimensionner);
  observateurTaille.observe(canvas);
  redimensionner();

  // ------------------------------ boucle --------------------------------
  let progresCible = 0;
  let progresActuel = 0;
  let idFrame = 0;
  let visible = false;
  let annonce = false;
  const debut = performance.now();

  function boucle(maintenant) {
    idFrame = requestAnimationFrame(boucle);

    progresActuel += (progresCible - progresActuel) * 0.08;
    materiau.uniforms.uProgres.value = progresActuel;
    materiau.uniforms.uTemps.value = (maintenant - debut) / 1000;

    // Le ruban remonte à mesure qu'il se trace, de sorte que la crête reste
    // dans le champ : l'ensemble accompagne le défilement de la conversation
    // au lieu de rester figé derrière elle.
    // La courbe descend de y = +4.6 à y = -4.8 : la pointe se trouve donc
    // vers 4.6 - 9.4 * progrès, et on compense ce trajet. Le coefficient 0.82
    // laisse volontairement filer un peu la pointe vers le bas, ce qui garde
    // une partie du tracé déjà posé visible à l'écran.
    ruban.position.y = (9.4 * progresActuel - 4.6) * 0.82;

    // Dérive très lente : donne du relief sans distraire de la lecture.
    ruban.rotation.z = Math.sin(materiau.uniforms.uTemps.value * 0.12) * 0.04;

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

  // Aucun calcul quand la section est hors de l'écran ou l'onglet en fond.
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
    /** 0 = rien de tracé, 1 = ruban complet. */
    viserProgres(valeur) {
      progresCible = Math.min(1, Math.max(0, valeur));
    },
    detruire() {
      arreter();
      observateurVue.disconnect();
      observateurTaille.disconnect();
      document.removeEventListener("visibilitychange", surVisibilite);
      geometrie.dispose();
      materiau.dispose();
      renderer.dispose();
    },
  };
}
