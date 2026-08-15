/**
 * Définition des cinq glyphes du parcours, en « pixels » 3D.
 *
 * Chaque glyphe est une grille de caractères : c'est lisible et modifiable
 * sans outil, et chaque caractère allumé devient un cube dans la scène. La
 * profondeur (axe Z) vient du caractère lui-même, ce qui évite de modéliser
 * quoi que ce soit.
 *
 *   #  cube au premier plan
 *   +  cube légèrement en retrait
 *   (espace) rien
 *
 * Attention : tout caractère absent de PROFONDEUR est un vide. N'utiliser que
 * l'espace pour le fond — un point ou un tiret décoratif deviendrait un cube
 * et le glyphe se rendrait en rectangle plein.
 */

const MICRO = [
  "   ####   ",
  "  ######  ",
  "  ######  ",
  "  ######  ",
  "  ######  ",
  "  ######  ",
  " +      + ",
  " ++    ++ ",
  "  ++++++  ",
  "    ##    ",
  "   ####   ",
];

const FICHE = [
  "##########",
  "#        #",
  "# ###### #",
  "#        #",
  "# ###### #",
  "#        #",
  "# ####   #",
  "#        #",
  "# ###### #",
  "#        #",
  "##########",
];

const ACHETEURS = [
  "          ",
  "##  ######",
  "##  ######",
  "          ",
  "##  ######",
  "##  ######",
  "          ",
  "##  ######",
  "##  ######",
  "          ",
  "          ",
];

const COCHE = [
  "          ",
  "        ++",
  "       ###",
  "      ### ",
  "     ###  ",
  "+    ###  ",
  "##  ###   ",
  "### ##    ",
  " #####    ",
  "  ###     ",
  "   +      ",
];

const ENVELOPPE = [
  "          ",
  "##########",
  "#        #",
  "# ##  ## #",
  "#  ####  #",
  "#   ##   #",
  "#        #",
  "#        #",
  "#        #",
  "##########",
  "          ",
];

/** Profondeur associée à chaque caractère, en unités de grille. */
const PROFONDEUR = { "#": 0.55, "+": 0.1 };

/** Écart entre deux cubes voisins, en unités du monde. */
const PAS = 0.19;

/** Convertit une grille en positions de cubes centrées sur zéro. */
function pointsDepuisGrille(grille) {
  const lignes = grille.length;
  const colonnes = grille[0].length;
  const points = [];

  for (let y = 0; y < lignes; y += 1) {
    for (let x = 0; x < colonnes; x += 1) {
      const c = grille[y][x];
      if (!(c in PROFONDEUR)) continue;
      points.push([
        (x - (colonnes - 1) / 2) * PAS,
        ((lignes - 1) / 2 - y) * PAS,
        PROFONDEUR[c] * PAS,
      ]);
    }
  }

  return points;
}

/** Demi-hauteur d'un glyphe, utilisée pour échelonner les retards. */
export const DEMI_HAUTEUR = (11 - 1) / 2 * PAS;

/** Les cinq étapes, dans l'ordre de la conversation. */
export const GLYPHES = [
  { nom: "micro", grille: MICRO },
  { nom: "fiche", grille: FICHE },
  { nom: "acheteurs", grille: ACHETEURS },
  { nom: "coche", grille: COCHE },
  { nom: "enveloppe", grille: ENVELOPPE },
];

export function construireGlyphes() {
  return GLYPHES.map((g) => ({
    nom: g.nom,
    points: pointsDepuisGrille(g.grille),
  }));
}
