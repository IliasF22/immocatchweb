/**
 * Point d'entrée des pages légales.
 *
 * Ces pages n'ont ni scène 3D, ni animation au défilement, ni compteur :
 * elles n'embarquent donc que les polices et le système de design. Le texte
 * est intégralement dans le HTML, il reste lisible sans JavaScript.
 */

import "@fontsource-variable/fraunces";
import "@fontsource-variable/inter/wght.css";
import "@fontsource-variable/jetbrains-mono/wght.css";

import "./styles/main.css";

document.documentElement.classList.remove("no-js");
