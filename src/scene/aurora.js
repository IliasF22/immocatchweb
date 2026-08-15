import {
  Color,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from "three";

/**
 * Aurore : nappes de lumière qui dérivent derrière la conversation.
 *
 * Un seul quad plein écran et un fragment shader — aucune géométrie, un seul
 * appel de rendu. Trois foyers lumineux se déplacent lentement sur des
 * trajectoires indépendantes, et le domaine est légèrement déformé pour que
 * les nappes ondulent au lieu de simplement glisser.
 *
 * La teinte suit le récit : plutôt verte au début de la section (la voix),
 * plutôt ambre à la fin (la donnée rangée).
 */

const vertexShader = /* glsl */ `
  void main() {
    // Quad déjà en coordonnées écran : rien à projeter.
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform vec2 uResolution;
  uniform float uTemps;
  uniform float uProgres;
  uniform vec3 uLampe;
  uniform vec3 uAmbre;

  /** Foyer lumineux à bords très doux (gaussienne, pas de coupure nette). */
  float halo(vec2 p, vec2 centre, float rayon) {
    float d = length(p - centre) / rayon;
    return exp(-d * d * 1.7);
  }

  void main() {
    // Repère centré, normalisé sur la hauteur : le rendu ne s'étire pas
    // quand la fenêtre change de proportions.
    vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;

    float t = uTemps * 0.075;

    // Déformation lente du domaine : donne l'ondulation d'une aurore.
    vec2 q = uv;
    q.x += sin(uv.y * 1.3 + t * 1.7) * 0.20;
    q.y += cos(uv.x * 1.1 - t * 1.3) * 0.16;

    vec2 c1 = vec2(sin(t * 0.90) * 0.55 - 0.30, cos(t * 0.70) * 0.34 + 0.16);
    vec2 c2 = vec2(cos(t * 0.60) * 0.62 + 0.34, sin(t * 1.10) * 0.30 - 0.18);
    vec2 c3 = vec2(sin(t * 1.30 + 2.0) * 0.40, cos(t * 0.50 + 1.0) * 0.46);

    float a = halo(q, c1, 0.66);
    float b = halo(q, c2, 0.74);
    float c = halo(q, c3, 0.52);

    // La voix cède la place à la donnée à mesure qu'on descend la section.
    vec3 chaud = mix(uLampe, uAmbre, clamp(uProgres, 0.0, 1.0));
    vec3 froid = mix(uAmbre, uLampe, clamp(uProgres, 0.0, 1.0));

    vec3 couleur = chaud * a * 0.95 + froid * b * 0.85 + uLampe * c * 0.30;
    float intensite = a * 0.95 + b * 0.85 + c * 0.30;

    // Tramage : sans lui, de larges dégradés sombres se découpent en bandes
    // visibles sur la plupart des écrans.
    float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
    couleur += (grain - 0.5) * 0.014;

    gl_FragColor = vec4(couleur, clamp(intensite, 0.0, 1.0) * 0.5);
  }
`;

export function initialiserAurore(canvas, { surPret } = {}) {
  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false, // aucun bord franc à lisser : inutile ici
    powerPreference: "high-performance",
  });

  if (!renderer.getContext()) throw new Error("WebGL indisponible");
  renderer.setClearAlpha(0);

  // Le rendu n'est fait que de dégradés très doux : le calculer à la densité
  // réelle de l'écran coûterait quatre fois plus de pixels pour un résultat
  // indiscernable. On reste à 1 et on laisse le navigateur agrandir.
  renderer.setPixelRatio(1);

  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const materiau = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      uResolution: { value: new Vector2(1, 1) },
      uTemps: { value: 0 },
      uProgres: { value: 0 },
      uLampe: { value: new Color("#A8E8B0") },
      uAmbre: { value: new Color("#F4B266") },
    },
  });

  const quad = new Mesh(new PlaneGeometry(2, 2), materiau);
  quad.frustumCulled = false;
  scene.add(quad);

  function redimensionner() {
    const l = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    renderer.setSize(l, h, false);
    materiau.uniforms.uResolution.value.set(
      canvas.width || l,
      canvas.height || h,
    );
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

    progresActuel += (progresCible - progresActuel) * 0.05;
    materiau.uniforms.uProgres.value = progresActuel;
    materiau.uniforms.uTemps.value = (maintenant - debut) / 1000;

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
    /** 0 = haut de la section (vert dominant), 1 = bas (ambre dominant). */
    viserProgres(valeur) {
      progresCible = Math.min(1, Math.max(0, valeur));
    },
    detruire() {
      arreter();
      observateurVue.disconnect();
      observateurTaille.disconnect();
      document.removeEventListener("visibilitychange", surVisibilite);
      quad.geometry.dispose();
      materiau.dispose();
      renderer.dispose();
    },
  };
}
