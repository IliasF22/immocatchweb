# ImmoCatch — site officiel

Landing page une page pour ImmoCatch, l'assistant IA back-office des agences
immobilières : l'agent dicte un vocal WhatsApp en sortant de visite, la fiche
se structure toute seule et les acheteurs compatibles remontent à chaque
nouveau mandat.

**Stack** : Vite + JavaScript natif + Three.js. Ni framework d'interface, ni
bibliothèque d'animation.

---

## Démarrer

```bash
npm install
npm run dev        # http://localhost:5173
```

## Construire

```bash
npm run build      # génère dist/
npm run preview    # sert dist/ localement
```

## Arborescence

```
index.html              tout le contenu éditorial (une seule page)
src/
  main.js               point d'entrée : interface d'abord, 3D ensuite
  styles/main.css       système de design (variables, composants)
  scene/
    index.js            renderer, caméra, boucle, mise en pause
    morphField.js       géométrie instanciée + positions cibles de la fiche
    shaders.js          shaders du morph onde → fiche
    ribbon.js           ruban 3D de la section "Flux en direct"
  timeline/index.js     synchronise la scène avec le stepper du hero
  ui/
    header.js           filet de l'en-tête, CTA collant mobile
    faq.js              accordéon accessible
    reveal.js           apparitions au défilement + compteurs
    flux.js             conversation pleine largeur + pilotage du ruban 3D
    analytics.js        événements Plausible
public/
  demo.mp4              vidéo de démonstration
  demo-poster.jpg       vignette de la vidéo
  hero-fallback.svg     repli statique de la scène 3D
  robots.txt sitemap.xml
vercel.json             en-têtes de cache et de sécurité
DECISIONS.md            choix techniques et leurs raisons
```

## Modifier le contenu

Tout le texte visible est dans `index.html`, en clair. Aucun contenu n'est
généré par JavaScript : on peut relire et corriger la page sans toucher au
code.

## Remplacer la vidéo

Déposer le nouveau fichier dans `public/demo.mp4`, et sa vignette dans
`public/demo-poster.jpg`. Aucune autre modification n'est nécessaire.

## Régler la scène 3D

| Réglage | Où | Effet |
| --- | --- | --- |
| Densité de cubes | `COLONNES` et `PILE` dans `scene/morphField.js` | Finesse de l'onde et de la fiche |
| Rythme d'alternance | `CYCLE_MS` dans `scene/index.js` | Durée de chaque état |
| Mise en page de la fiche | `segmentsFiche()` dans `scene/morphField.js` | Lignes composant la fiche |
| Couleurs | uniformes `uLampe`, `uAmbre`, `uOs` | Teintes du morph |

## Analytics

Plausible uniquement, sans cookie ni donnée personnelle. Trois événements :

| Événement | Déclencheur |
| --- | --- |
| `cta_click` | Clic sur un appel à l'action (propriété `position`) |
| `scroll_to_pricing` | Le bloc tarif entre dans l'écran |
| `demo_view` | La vidéo de démonstration est lancée |

Le domaine suivi est déclaré dans `index.html` (`data-domain`).

## Déploiement

Le dépôt est prêt pour Vercel : framework `vite`, sortie `dist`. Les en-têtes
de cache et de sécurité sont dans `vercel.json`. Penser à faire pointer le
domaine `immocatch.fr` sur le projet.

## Accessibilité et sobriété

- Le contenu est lisible sans JavaScript : aucune animation ne masque
  définitivement du texte.
- `prefers-reduced-motion` coupe les apparitions, les compteurs et la scène 3D,
  remplacée par `hero-fallback.svg`.
- La scène cesse tout calcul quand elle sort de l'écran ou que l'onglet passe
  en arrière-plan.
- Polices auto-hébergées : aucune requête vers un service tiers au chargement.
