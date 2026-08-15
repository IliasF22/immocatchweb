# Choix techniques

Ce document explique pourquoi le site est construit ainsi. Il s'adresse à la
personne qui reprendra le code.

---

## 1. Le contenu vit dans le HTML, pas dans le JavaScript

Toute la copie est écrite en clair dans `index.html`. Aucune section n'est
générée par script.

**Pourquoi** : c'est une page de vente. Elle doit être indexable, lisible si un
script échoue, et surtout relisible par une personne non technique qui veut
corriger une phrase. Générer les sections depuis un tableau JavaScript aurait
raccourci le fichier, mais aurait rendu chaque correction dépendante du code.

**Conséquence** : `index.html` est long. C'est assumé.

---

## 2. Three.js est chargé après le reste, en import dynamique

`main.js` initialise l'interface, puis importe `scene/index.js` seulement une
fois la page peinte (`window.load`). Three.js est isolé dans son propre chunk
via `manualChunks`.

**Pourquoi** : Three.js pèse ~114 ko compressés, soit l'essentiel du poids du
site. Le placer sur le chemin critique aurait retardé l'affichage du titre et
des boutons — précisément ce qui convertit. Ici, le hero textuel s'affiche
immédiatement et la scène arrive ensuite.

**Conséquence** : la scène apparaît avec un court délai sur connexion lente.
C'est un compromis volontaire en faveur du contenu.

---

## 3. La scène 3D n'est jamais un point de rupture

Trois situations la remplacent par `hero-fallback.svg` :

- `prefers-reduced-motion: reduce` est actif ;
- WebGL est indisponible (pilote, navigateur ancien, machine virtuelle) ;
- le chunk Three.js échoue à se charger.

Le `try/catch` autour de l'import couvre les trois cas.

**Pourquoi un SVG plutôt qu'une capture JPEG** : le repli pèse 2,9 ko au lieu
de ~60 ko, reste net sur écran haute densité, et se modifie au clavier. Il
reprend le même langage visuel : onde vocale verte à gauche, fiche ambre à
droite, coche de validation.

---

## 4. La scène s'arrête dès qu'on ne la regarde plus

Un `IntersectionObserver` sur le canvas et un écouteur `visibilitychange`
arrêtent la boucle `requestAnimationFrame`.

**Pourquoi** : la cible lit le site sur téléphone, souvent entre deux visites.
Faire tourner un rendu WebGL pendant que le visiteur lit la FAQ, c'est vider sa
batterie pour rien.

---

## 5. Le morph est calculé dans le shader, pas en JavaScript

Chaque cube porte sa position cible dans la fiche (`aCard`), sa colonne, sa
rangée et un délai. Le vertex shader calcule l'amplitude de l'onde à partir du
temps, puis interpole vers la fiche selon un uniforme `uMorph` unique.

**Pourquoi** : ~1 860 cubes animés depuis le CPU imposeraient de reconstruire
une matrice par instance à chaque image. Ici, le CPU ne met à jour que trois
nombres par image ; le GPU fait le reste. C'est ce qui tient les 60 images par
seconde sur mobile.

**Conséquence** : la logique d'animation est en GLSL, moins familière. Les
paramètres réglables sont documentés dans le README.

---

## 6. Un éclairage écrit à la main plutôt que le système de lumières

Le fragment shader calcule une lumière clé et un remplissage avec deux produits
scalaires, au lieu d'utiliser `MeshStandardMaterial` et les lumières de
Three.js.

**Pourquoi** : un `ShaderMaterial` brut évite d'embarquer le système
d'éclairage complet, et donne un rendu graphique volontairement plat, cohérent
avec le reste de la maquette.

---

## 7. Le contenu est visible d'abord, masqué ensuite

Les éléments `[data-reveal]` sont opaques dans le HTML. C'est la classe `no-js`,
retirée par JavaScript au démarrage, qui autorise le masquage.

**Pourquoi** : l'ordre inverse (masqué par défaut, révélé par script) rend la
page blanche si le script échoue. Ici, le pire cas est une page sans animation,
pas une page vide.

Même principe pour les compteurs : la valeur finale est écrite dans le HTML.
Sans animation possible, on la laisse telle quelle — afficher « 0 € » sur une
page de vente serait pire que pas d'effet du tout.

---

## 8. L'accordéon FAQ n'utilise pas `<details>`

Il repose sur des boutons, `aria-expanded`, et une transition
`grid-template-rows: 0fr → 1fr`.

**Pourquoi** : `<details>` ne s'anime pas de façon fiable entre navigateurs. La
technique `0fr → 1fr` anime une hauteur automatique sans mesurer quoi que ce
soit en JavaScript. Les attributs ARIA suivent l'état réel du panneau.

---

## 9. Polices auto-hébergées via `@fontsource`

Fraunces, Inter et JetBrains Mono sont installées en dépendances et servies
depuis le domaine.

**Pourquoi** : appeler Google Fonts transmet l'adresse IP des visiteurs à un
tiers, ce qui a valu des condamnations en Europe. Pour un site français qui
promet « votre base reste votre base », c'est incohérent. L'auto-hébergement
supprime aussi une connexion réseau au chargement.

Inter et JetBrains Mono ne chargent que l'axe de graisse (`wght.css`) : la
maquette n'utilise pas d'italique pour ces deux familles. Fraunces est chargée
entièrement, sa vraie italique servant à la citation.

---

## 10. Le numéro de téléphone n'est jamais écrit en clair

Les liens pointent vers `tel:` mais affichent « Ligne directe ».

**Pourquoi** : décision du client, pour limiter la collecte automatisée. Le
numéro reste accessible en un geste sur mobile.

---

## 11. La conversation de la section « Preuve en direct » est une version nettoyée

Le vrai échange transmis montrait l'assistant demander trois fois de suite des
précisions sur « Larache » avant de comprendre. Utilisé tel quel, il aurait
montré l'IA en échec sur la page de vente elle-même.

**Choix retenu**, validé avec le client : un scénario qui reprend le ton et les
emojis réels du produit, mais qui réussit du premier coup et illustre le cycle
complet — dictée, fiche structurée, rapprochement, validation humaine avant
tout envoi. Le vrai transcript reste disponible si le client préfère
l'authenticité à la démonstration lisse.

---

## 12. Une aurore en fond, les messages se condensent

Section « Flux en direct » : des nappes de lumière dérivent lentement derrière
la conversation, pendant que chaque message se forme en se condensant — les
mots arrivent dispersés et flous, puis se rassemblent à leur place.

**Deux fonds ont été écartés avant celui-ci.** Un ruban 3D qui serpentait
derrière les bulles : lisible, mais il ressemblait à un tuyau et ne racontait
rien. Puis des glyphes en cubes posés à côté des messages : ils détournaient
le regard de ce qu'il fallait lire. L'aurore assume d'être purement
atmosphérique — c'est une lumière, pas un objet, donc elle ne rivalise pas
avec le texte.

**Un seul quad plein écran et un fragment shader** : aucune géométrie, un seul
appel de rendu. Trois foyers gaussiens se déplacent sur des trajectoires
indépendantes, et le domaine est légèrement déformé pour que les nappes
ondulent au lieu de glisser en bloc.

**Rendu à `pixelRatio` 1**, même sur écran haute densité. L'image n'est faite
que de dégradés très doux : la calculer à la densité réelle coûterait quatre
fois plus de pixels pour un résultat indiscernable une fois agrandi.

**Tramage obligatoire** : un large dégradé sombre se découpe en bandes
visibles sur la plupart des écrans. Un grain d'amplitude 0,014 ajouté dans le
shader suffit à les casser.

**La teinte suit le récit** : plutôt verte en haut de section (la voix), plutôt
ambre en bas (la donnée rangée), pilotée par la progression du défilement.

**Comment le texte est découpé** : `ui/flux.js` parcourt les nœuds de texte de
chaque bulle et enveloppe les mots dans des spans, en conservant les
séparateurs. Le texte reste sélectionnable, lisible par un lecteur d'écran, et
le retour à la ligne se fait toujours entre les mots. Sans JavaScript ou avec
animations réduites, aucun découpage n'a lieu et le texte est servi net.

**Le message vocal n'a pas de mots** : ce sont les barres de son onde qui se
dressent une à une, avec le même principe de retard échelonné.

**Hauteur de section** : le canvas est collé (`sticky`) et ne tient en place
que sur `hauteur du conteneur − sa propre hauteur`, d'où le `min-height: 185vh`
(155vh sur téléphone). Deux pièges rencontrés, tous deux fatals au collage :
`overflow: hidden` sur la section en fait un conteneur de défilement et le
canvas s'en va avec le reste ; `margin-bottom: -100vh` écrase la course
disponible. D'où la superposition en grille, sans `overflow`.

---

## 13. Le premier calcul au défilement attend le chargement des polices

`ui/flux.js` (auparavant `ui/phone.js`) pilote la révélation des bulles à partir de
`getBoundingClientRect()`. Les polices `@fontsource` utilisent
`font-display: swap` : une police de secours s'affiche d'abord, puis la
vraie police la remplace, ce qui déplace la mise en page après coup.

**Bug rencontré** : un premier calcul lancé avant ce remplacement mesurait une
hauteur de page erronée, marquait à tort toutes les bulles comme « déjà vues »
— marquage volontairement permanent pour ne jamais faire disparaître un
message déjà lu — et le téléphone démarrait avec la conversation entière
visible au lieu de se révéler au défilement.

**Correction** : le premier calcul attend `document.fonts.ready` (avec repli
si l'API est absente), puis deux `requestAnimationFrame` pour laisser le
navigateur terminer la mise en page avant de mesurer quoi que ce soit.

---

## Points tranchés

- **Prix d'installation** : 1 800 €, confirmé par le client (une version de la
  copie indiquait 1 701 €).
- **Durée de remboursement** : 30 jours partout, confirmé par le client (une
  version de la copie indiquait 27 jours dans la FAQ).
- **Lien Calendly** : `https://calendly.com/ilias-frej-pro/30min`, fourni par
  le client, utilisé sur tous les appels à l'action.

---

## 14. Le bouton collant suit l'avancement, il ne demande pas tout de suite

Sur mobile, la barre fixe propose d'abord « Voir la démo en 2 min », puis
bascule sur « Parler à Ilias » une fois la section de démonstration dépassée.

**Pourquoi** : demander un rendez-vous à quelqu'un qui n'a encore rien vu du
produit, c'est griller la seule occasion de le convaincre. L'ordre suit le
parcours réel : on montre, puis on propose.

Les deux boutons existent dans le HTML ; celui qui ne correspond pas à l'étape
est retiré du flux (`display: none`), donc ni cliquable ni annoncé par un
lecteur d'écran.

**Visibilité** : la barre apparaît après 75 % du premier écran, d'après la
position de défilement. Elle se basait auparavant sur la visibilité du hero,
règle devenue fausse depuis que la section de démonstration passe avant lui :
en haut de page le hero n'est pas à l'écran, et la barre s'affichait aussitôt.

---

## 15. « Me contacter », pas « Nous contacter »

Toute la page parle à la première personne : « Je m'appelle Ilias », « vous
avez une ligne directe », « un interlocuteur unique, pas une plateforme
anonyme ». Un « Nous contacter » au milieu contredisait la promesse.
