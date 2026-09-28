# ImmoCatch, site officiel

Promesse principale : trouver des vendeurs aux agences immobilières avant
leurs concurrents. Deux offres (campagne vendeurs ciblée, alertes vendeurs
hebdomadaires) et, en offre secondaire, l'assistant WhatsApp présenté sur
`/automatisations`.

| URL | Fichier | Script |
| --- | --- | --- |
| `/` | `index.html` | `src/vitrine.js` |
| `/campagne-vendeurs` | `campagne-vendeurs/index.html` | `src/vitrine.js` |
| `/alertes-vendeurs` | `alertes-vendeurs/index.html` | `src/vitrine.js` |
| `/automatisations` | `automatisations/index.html` | `src/main.js` (3D, flux, démo) |
| `/politique-de-confidentialite` | `politique-de-confidentialite/index.html` | `src/vitrine.js` |

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
index.html              accueil
campagne-vendeurs/      page d'offre
alertes-vendeurs/       page d'offre
automatisations/        ancienne page d'accueil, contenu intégral
politique-de-confidentialite/
.env                    adresse publique du webhook du formulaire
src/
  vitrine.js            point d'entrée des pages sans 3D
  main.js               point d'entrée de /automatisations : interface, puis 3D
  partials/             en-tête, pied de page, formulaire (un seul exemplaire)
  styles/main.css       système de design (variables, composants)
  scene/
    index.js            renderer, caméra, boucle, mise en pause
    morphField.js       géométrie instanciée + positions cibles de la fiche
    shaders.js          shaders du morph onde → fiche
  timeline/index.js     synchronise la scène avec le stepper du hero
  ui/
    header.js           filet de l'en-tête, CTA collant mobile
    faq.js              accordéon accessible
    chapitres.js        repères cliquables de la vidéo de démonstration
    reveal.js           apparitions au défilement + compteurs
    flux.js             tracé du flux, particule, activation des messages
    formulaire.js       envoi du formulaire « Extrait gratuit » au webhook n8n
    analytics.js        événements Plausible
public/
  demo.mp4              vidéo de démonstration
  demo-poster.jpg       vignette de la vidéo
  hero-fallback.svg     repli statique de la scène 3D
  favicon.ico           icône d'onglet (16, 32 et 48 px)
  apple-touch-icon.png  icône d'écran d'accueil iOS (180 px)
  robots.txt sitemap.xml
scripts/generer-icones.py  régénère les deux icônes depuis le monogramme
vercel.json             en-têtes de cache et de sécurité
DECISIONS.md            choix techniques et leurs raisons
```

## Modifier le contenu

Tout le texte visible est dans les fichiers HTML, en clair. Aucun contenu
n'est généré par JavaScript : on peut relire et corriger une page sans
toucher au code.

L'en-tête, le pied de page et le formulaire existent en un seul exemplaire,
dans `src/partials/`. Une page les appelle par un commentaire, remplacé au
build par un petit plugin de `vite.config.js` :

```html
<!-- @inclure entete page="campagne" extrait="#extrait" -->
<!-- @inclure formulaire-extrait -->
<!-- @inclure pied -->
```

Pour ajouter une page : créer `nom-de-page/index.html` et le déclarer dans
`rollupOptions.input` de `vite.config.js`, sinon elle n'est pas construite.

## Formulaire « Extrait gratuit »

Envoi en JSON vers l'adresse de `VITE_EXTRAIT_WEBHOOK_URL` (fichier `.env`).
Champs envoyés : `agence`, `nom`, `ville`, `telephone`, `email`,
`consentement`, `page`, `envoye_le`. Sans JavaScript, le formulaire est envoyé
classiquement à la même adresse.

Le webhook n8n doit accepter les requêtes venant de `https://immocatch.fr`
(en-têtes CORS), sinon l'envoi échoue en production.

## Remplacer la vidéo

Déposer le nouveau fichier dans `public/demo.mp4`, et sa vignette dans
`public/demo-poster.jpg`. Aucune autre modification n'est nécessaire.

Les repères de chapitres sont dans `index.html`, section `#demo` : chaque
bouton porte son instant en secondes dans `data-seconde`, et son affichage
(`00:18`) juste à côté. Les deux doivent rester cohérents — le premier pilote
la lecture, le second est ce que lit le visiteur.

## Régler la scène 3D

| Réglage | Où | Effet |
| --- | --- | --- |
| Densité de cubes | `COLONNES` et `PILE` dans `scene/morphField.js` | Finesse de l'onde et de la fiche |
| Rythme d'alternance | `CYCLE_MS` dans `scene/index.js` | Durée de chaque état |
| Mise en page de la fiche | `segmentsFiche()` dans `scene/morphField.js` | Lignes composant la fiche |
| Couleurs | uniformes `uLampe`, `uAmbre`, `uOs` | Teintes du morph |

## Analytics

Plausible uniquement, sans cookie ni donnée personnelle. Quatre événements :

| Événement | Déclencheur |
| --- | --- |
| `cta_click` | Clic sur un appel à l'action (propriété `position`) |
| `scroll_to_pricing` | Le bloc tarif entre dans l'écran |
| `demo_view` | La vidéo de démonstration est lancée |
| `extrait_demande` | Le formulaire « Extrait gratuit » est envoyé (propriété `page`) |

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

## Refaire les icônes

```bash
python3 scripts/generer-icones.py
```

Les deux fichiers sortent du même tracé, ils ne peuvent donc pas diverger.
