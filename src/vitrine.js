/**
 * Point d'entrée des pages sans scène 3D : accueil, pages d'offre et
 * politique de confidentialité.
 *
 * Ces pages n'embarquent ni Three.js ni le tracé du flux : seulement les
 * polices, le système de design, l'en-tête, les apparitions au défilement et
 * le formulaire. Le texte est intégralement dans le HTML, il reste lisible
 * sans JavaScript.
 */

import "@fontsource-variable/fraunces";
import "@fontsource-variable/inter/wght.css";
import "@fontsource-variable/jetbrains-mono/wght.css";

import "./styles/main.css";

import { initialiserAnalytics } from "./ui/analytics.js";
import { initialiserEntete } from "./ui/header.js";
import { initialiserFormulaires } from "./ui/formulaire.js";
import { initialiserApparitions } from "./ui/reveal.js";

document.documentElement.classList.remove("no-js");

initialiserEntete();
initialiserApparitions();
initialiserFormulaires();
initialiserAnalytics();
