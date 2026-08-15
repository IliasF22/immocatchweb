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

## 12. Le ruban 3D est collé, la section est donc volontairement haute

La section « Flux en direct » utilise un canvas en `position: sticky` derrière
la conversation, et une superposition en grille (canvas et contenu dans la même
cellule) plutôt qu'une marge négative.

**Deux pièges rencontrés, tous deux fatals au collage :**

- `overflow: hidden` sur la section en fait un conteneur de défilement : le
  `sticky` s'y accroche au lieu de la fenêtre, et le canvas s'en va avec le
  reste. Il n'y a donc aucun `overflow` sur `.flux`.
- `margin-bottom: -100vh` (pour sortir le canvas du flux) écrase la plage de
  collage : l'élément n'a plus de course et se comporte presque comme statique.
  D'où la superposition en grille.

**Hauteur minimale** : un élément collé ne tient en place que sur
`hauteur du conteneur − sa propre hauteur`. Avec un canvas de `100vh` et une
section à peine plus haute qu'un écran, la course tombait à quelques centaines
de pixels et le ruban se décrochait au tiers de la lecture. D'où le
`min-height: 185vh` (155vh sur téléphone), les messages étant répartis dedans
par `justify-content: space-between` pour ne pas laisser de vide.

**Épaisseur du tube** : 0.17 sur grand écran, 0.085 en dessous de 700px, avec
une opacité réduite à 50 %. À pleine épaisseur, le ruban passait devant les
bulles sur téléphone et rendait la conversation pénible à lire. La géométrie
est refabriquée si l'on franchit ce seuil (rotation d'écran).

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

## Points à trancher

- **Durée de remboursement** : la copie fournie indiquait « 30 jours » dans les
  points de réassurance et « 27 jours » dans la FAQ. Le site affiche **30 jours**
  partout, valeur cohérente avec les versions précédentes. À confirmer.
- **Prix d'installation** : « à partir de 1 701 € », repris tel quel de la copie
  fournie (les versions précédentes indiquaient 1 800 €).
