/**
 * Point d'entrée des pages sans scène 3D : accueil, pages d'offre et
 * politique de confidentialité.
 *
 * Ces pages n'embarquent pas Three.js : seulement les polices, le système de
 * design, l'en-tête, les animations au défilement (apparitions, compteurs,
 * ville illustrée, lignes de progression), la FAQ et le formulaire. Le texte
 * est intégralement dans le HTML, il reste lisible sans JavaScript.
 */

import "@fontsource-variable/fraunces";
import "@fontsource-variable/inter/wght.css";
import "@fontsource-variable/jetbrains-mono/wght.css";

import "./styles/main.css";

import { initialiserAnalytics } from "./ui/analytics.js";
import { initialiserEntete } from "./ui/header.js";
import { initialiserFaq } from "./ui/faq.js";
import { initialiserFormulaires } from "./ui/formulaire.js";
import { initialiserProgression } from "./ui/progression.js";
import { initialiserApparitions, initialiserCompteurs } from "./ui/reveal.js";
import { initialiserVille } from "./ui/ville.js";

document.documentElement.classList.remove("no-js");

initialiserEntete();
initialiserVille();
initialiserProgression();
initialiserApparitions();
initialiserCompteurs();
initialiserFaq();
initialiserFormulaires();
initialiserAnalytics();
