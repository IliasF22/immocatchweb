/**
 * Shaders du champ morphique.
 *
 * Chaque cube connaît deux positions : sa place dans l'onde vocale (calculée
 * à la volée à partir de sa colonne et du temps) et sa place dans la fiche
 * structurée (attribut `aCard`). L'uniforme `uMorph` fait passer de l'une à
 * l'autre, avec un décalage par cube pour que la réorganisation se lise comme
 * un rangement progressif plutôt que comme un basculement d'un bloc.
 */

export const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uMorph;
  uniform float uPile;
  uniform float uSouffle;

  attribute vec3 aCard;
  attribute float aCol;
  attribute float aRow;
  attribute float aDelai;
  attribute float aGraine;

  varying vec3 vNormale;
  varying float vMorph;
  varying float vGraine;
  varying float vPresence;

  void main() {
    // ---------- état 1 : l'onde vocale ----------
    // Amplitude de la colonne : superposition de trois sinus, ce qui donne
    // un signal irrégulier crédible sans coût de bruit procédural.
    float amp =
        0.30
      + 0.30 * sin(aCol * 0.42 + uTime * 2.10)
      + 0.20 * sin(aCol * 0.17 - uTime * 1.30)
      + 0.13 * sin(aCol * 0.91 + uTime * 3.40);
    amp = clamp(amp * uSouffle, 0.05, 1.0);

    float hauteur = amp * uPile;
    // Un cube n'existe dans l'onde que s'il est sous la crête de sa colonne.
    float presence = 1.0 - smoothstep(hauteur - 0.9, hauteur + 0.9, abs(aRow));

    vec3 posOnde = vec3(
      aCol * 0.118 - 3.48,
      aRow * 0.118,
      sin(aCol * 0.31 + uTime * 0.6) * 0.10
    );

    // ---------- transition ----------
    // Chaque cube démarre son voyage à un instant différent (aDelai).
    float m = clamp((uMorph - aDelai * 0.38) / 0.62, 0.0, 1.0);
    m = m * m * (3.0 - 2.0 * m);

    // Léger arc pendant le trajet : les cubes ne glissent pas à plat.
    float arc = sin(m * 3.14159) * (0.35 + aGraine * 0.5);

    vec3 cible = mix(posOnde, aCard, m);
    cible.z += arc * (0.6 - aGraine * 0.3);

    // Hors de l'onde, le cube est invisible ; il reprend sa taille en
    // rejoignant la fiche.
    float taille = mix(presence, 1.0, m);

    vec3 place = position * (0.049 * taille) + cible;

    vNormale = normalMatrix * normal;
    vMorph = m;
    vGraine = aGraine;
    vPresence = taille;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(place, 1.0);
  }
`;

export const fragmentShader = /* glsl */ `
  precision highp float;

  uniform vec3 uLampe;
  uniform vec3 uAmbre;
  uniform vec3 uOs;

  varying vec3 vNormale;
  varying float vMorph;
  varying float vGraine;
  varying float vPresence;

  void main() {
    // Éclairage simplifié : une lumière clé et un remplissage froid, calculés
    // directement ici pour éviter d'embarquer le système de lumières complet.
    vec3 n = normalize(vNormale);
    vec3 cle = normalize(vec3(0.45, 0.80, 0.62));
    vec3 remplissage = normalize(vec3(-0.5, -0.2, 0.4));

    float diff = 0.42 + 0.58 * max(dot(n, cle), 0.0);
    diff += 0.14 * max(dot(n, remplissage), 0.0);

    // Vert lampe pour la voix, ambre pour la donnée rangée.
    vec3 teinte = mix(uLampe, uAmbre, vMorph);
    // Quelques cubes virent vers l'os : la fiche n'est pas monochrome.
    teinte = mix(teinte, uOs, step(0.72, vGraine) * vMorph * 0.75);

    if (vPresence < 0.04) discard;

    gl_FragColor = vec4(teinte * diff, 1.0);
  }
`;
