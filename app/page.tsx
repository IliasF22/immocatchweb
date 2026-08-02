// ImmoCatch — Landing Page (One-Page)
// Positionnement : assistant IA BACK-OFFICE à usage interne pour l'agent immobilier.
// Note vocale WhatsApp -> fiche structurée -> rapprochement acheteurs, TOUJOURS
// avec validation humaine (aucun prospect contacté à la place de l'agent).
// Design : B2B local, aplats de couleurs solides. Slate-900 + Blanc + Orange #FF6B00.

import fs from "node:fs";
import path from "node:path";

import { CountUp } from "@/components/CountUp";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

/* ─────────────────────────── VIDÉO DE DÉMO ───────────────────────────
 * OÙ METTRE LA VIDÉO : déposer le fichier dans le dossier `public/`, à la
 * racine du projet, en le nommant `demo.mp4` (ou .webm / .mov).
 * Image d'aperçu optionnelle : `public/demo-poster.jpg`.
 * Le lecteur s'affiche alors tout seul — aucune ligne de code à modifier.
 *
 * Si la vidéo est plutôt hébergée sur YouTube ou Vimeo, laisser `public/`
 * vide et coller ici l'URL d'intégration (bouton Partager > Intégrer) :
 *   YouTube → "https://www.youtube.com/embed/IDENTIFIANT"
 *   Vimeo   → "https://player.vimeo.com/video/IDENTIFIANT"
 * ------------------------------------------------------------------- */
const DEMO_EMBED_URL = "";

// Détection au moment du build : pas de configuration à maintenir à la main.
const PUBLIC_DIR = path.join(process.cwd(), "public");
const DEMO_FILE =
  ["demo.mp4", "demo.webm", "demo.mov"].find((name) =>
    fs.existsSync(path.join(PUBLIC_DIR, name)),
  ) ?? null;
const DEMO_POSTER = fs.existsSync(path.join(PUBLIC_DIR, "demo-poster.jpg"))
  ? "/demo-poster.jpg"
  : undefined;

// Le numéro n'est jamais affiché en clair : il n'est révélé qu'au clic
// (le dialer s'ouvre via le lien tel:). On expose donc uniquement le href.
const PHONE_HREF = "tel:+33615889744";
const EMAIL = "ilias@immocatch.fr";

// Le glyphe WhatsApp utilise le vert officiel #25D366, écrit en dur dans les
// classes (Tailwind ne génère pas les classes construites dynamiquement).

function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-bold tracking-tight ${className}`}>
      <span className="text-white">Immo</span>
      <span className="text-[#FF6B00]">Catch</span>
    </span>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900 pb-20 text-slate-100 sm:pb-0">
      {/* ============================= HEADER ============================= */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <a href="#" aria-label="ImmoCatch — accueil">
            <Wordmark className="text-xl" />
          </a>

          <a
            href={PHONE_HREF}
            className="rounded-md bg-[#FF6B00] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#e65f00]"
          >
            Nous contacter
          </a>
        </div>
      </header>

      {/* ============================== HERO ============================== */}
      <section className="border-b border-slate-800">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:py-28">
          <p className="text-sm font-bold uppercase tracking-widest text-[#FF6B00]">
            Solution IA pour agences immobilières indépendantes
          </p>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
            Vos heures de saisie et de rapprochement redeviennent des heures de
            visite.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300 sm:text-xl">
            Vous dictez un vocal. La fiche se remplit toute seule. À chaque
            mandat, les bons acheteurs de votre base remontent automatiquement.
          </p>

          {/* Canal : WhatsApp */}
          <div className="mt-6 inline-flex items-center gap-2 rounded-md border border-slate-700 bg-slate-800 px-4 py-2">
            <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
            <span className="text-sm font-semibold text-slate-200">
              Tout se passe sur WhatsApp
            </span>
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#demo"
              className="w-full rounded-md bg-[#FF6B00] px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-[#e65f00] sm:w-auto"
            >
              Voir la démo en 2 min
            </a>
            <a
              href={PHONE_HREF}
              className="w-full rounded-md border border-slate-600 px-8 py-4 text-lg font-bold text-slate-100 transition-colors hover:border-[#FF6B00] hover:text-[#FF6B00] sm:w-auto"
            >
              Parler à Ilias — 15 min
            </a>
          </div>

          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-semibold text-slate-400">
            <li>Sans engagement</li>
            <li className="text-slate-700">·</li>
            <li>Vous gardez votre CRM</li>
            <li className="text-slate-700">·</li>
            <li>Remboursé sous 30 jours</li>
          </ul>

          {/* Piliers */}
          <dl className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { value: "Vous dictez", label: "un vocal en sortant de visite", wa: true },
              { value: "L'IA structure", label: "la fiche, complète et rangée", wa: false },
              { value: "Vous validez", label: "avant le moindre envoi", wa: false },
            ].map((pillar) => (
              <div
                key={pillar.value}
                className="rounded-md border border-slate-800 bg-slate-800 p-5 text-left"
              >
                <dt className="flex items-center gap-2 text-lg font-extrabold text-[#FF6B00]">
                  {pillar.value}
                  {pillar.wa && (
                    <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                  )}
                </dt>
                <dd className="mt-1 text-sm text-slate-300">{pillar.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ==================== LE PROBLÈME ==================== */}
      <section className="border-b border-slate-800">
        <div className="mx-auto max-w-5xl px-5 py-20 sm:py-24">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Le problème
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-slate-300">
            Vous êtes payé à la commission. Vos journées, elles, partent ailleurs.
          </p>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "La saisie dans le CRM",
                text: "Après chaque appel, tout est à ressaisir à la main. Ça finit à plus tard… ou jamais.",
              },
              {
                title: "Des fiches incomplètes",
                text: "Budget, apport, critères : faute de temps, la moitié des informations ne sont jamais notées.",
              },
              {
                title: "Le rapprochement « de tête »",
                text: "Un acheteur croisé il y a six mois ? Personne ne s'en souvient le jour où le bien rentre.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-md border border-slate-800 bg-slate-800 p-7"
              >
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-slate-300">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CITATION ==================== */}
      <section className="bg-[#FF6B00]">
        <div className="mx-auto max-w-4xl px-5 py-12 text-center">
          <p className="text-xl font-bold leading-relaxed text-white sm:text-2xl">
            « Il y a largement de quoi occuper une personne à temps plein » — rien
            que pour qualifier les contacts et cibler les bons acheteurs.
          </p>
          <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-white/80">
            Un agent immobilier indépendant
          </p>
        </div>
      </section>

      {/* ==================== LE VRAI COÛT (ANCRAGE + COMPTEURS) ==================== */}
      <section className="border-b border-slate-800">
        <div className="mx-auto max-w-5xl px-5 py-20 sm:py-24">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Ce travail, quelqu&apos;un le fait déjà
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-slate-300">
            C&apos;est vous, le soir. Vous avez trois options.
          </p>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {/* Option 1 */}
            <div className="rounded-md border border-slate-800 bg-slate-800 p-7">
              <h3 className="text-lg font-bold text-white">Vous continuez seul</h3>
              <p className="mt-4 whitespace-nowrap text-4xl font-extrabold lg:text-5xl text-slate-400">
                <CountUp to={165} suffix={"\u00A0h"} />
              </p>
              <p className="mt-1 text-sm text-slate-400">par an, soit 5 semaines</p>
              <p className="mt-4 leading-relaxed text-slate-300">
                45 minutes de saisie par jour. Cinq semaines à taper au lieu de
                vendre.
              </p>
            </div>

            {/* Option 2 */}
            <div className="rounded-md border border-slate-800 bg-slate-800 p-7">
              <h3 className="text-lg font-bold text-white">Vous embauchez</h3>
              <p className="mt-4 whitespace-nowrap text-4xl font-extrabold lg:text-5xl text-slate-400">
                <CountUp to={2000} prefix="~" suffix={"\u00A0€"} />
              </p>
              <p className="mt-1 text-sm text-slate-400">par mois, chargé</p>
              <p className="mt-4 leading-relaxed text-slate-300">
                À recruter, à former, à remplacer en congés. Et présent seulement
                aux heures de bureau.
              </p>
            </div>

            {/* Option 3 — ImmoCatch */}
            <div className="rounded-md border-2 border-[#FF6B00] bg-slate-800 p-7">
              <h3 className="text-lg font-bold text-[#FF6B00]">
                Vous déléguez à ImmoCatch
              </h3>
              <p className="mt-4 whitespace-nowrap text-4xl font-extrabold lg:text-5xl text-white">
                <CountUp to={250} suffix={"\u00A0€"} />
              </p>
              <p className="mt-1 text-sm text-slate-400">par mois, sans engagement</p>
              <p className="mt-4 leading-relaxed text-slate-300">
                Jour et nuit, sans contrat de travail. La fiche est écrite avant
                que vous rentriez à l&apos;agence.
              </p>
            </div>
          </div>

          <p className="mx-auto mt-10 max-w-3xl rounded-md border border-slate-700 bg-slate-800 p-6 text-center text-lg leading-relaxed text-slate-200">
            Soit{" "}
            <span className="font-bold text-white">
              <CountUp to={3000} suffix={"\u00A0€"} />
            </span>{" "}
            sur l&apos;année. Un seul mandat rattrapé dans votre base, et
            c&apos;est remboursé.
          </p>
        </div>
      </section>

      {/* ==================== COMMENT ÇA MARCHE ==================== */}
      <section className="border-b border-slate-800">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Comment ça marche
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-slate-300">
            Vous parlez, l&apos;assistant fait le reste.
          </p>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "01",
                title: "Vous dictez",
                text: "Un vocal sur WhatsApp, comme à un collègue. Rien à installer, rien à apprendre.",
                wa: true,
              },
              {
                step: "02",
                title: "La fiche se remplit",
                text: "Budget, apport, critères, délai : tout est transcrit et rangé automatiquement.",
                wa: false,
              },
              {
                step: "03",
                title: "Les acheteurs remontent",
                text: "Nouveau mandat ? La liste des acheteurs compatibles sort seule, brouillons inclus.",
                wa: false,
              },
              {
                step: "04",
                title: "Vous validez",
                text: "Vous relisez, vous corrigez, vous envoyez. Jamais sans votre feu vert.",
                wa: false,
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-md border border-slate-800 bg-slate-800 p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-extrabold text-[#FF6B00]">
                    {item.step}
                  </span>
                  {item.wa && (
                    <WhatsAppIcon className="h-6 w-6 text-[#25D366]" />
                  )}
                </div>
                <h3 className="mt-3 text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-slate-300">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== AVANT / APRÈS ==================== */}
      <section className="border-b border-slate-800">
        <div className="mx-auto max-w-5xl px-5 py-20 sm:py-24">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Un mardi, 18h30. Vous rentrez de deux visites.
          </h2>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {/* Avant */}
            <div className="rounded-md border border-slate-800 bg-slate-800 p-8">
              <p className="text-sm font-bold uppercase tracking-widest text-slate-400">
                Sans ImmoCatch
              </p>
              <ul className="mt-6 space-y-4 text-slate-300">
                {[
                  "Trois mots sur un carnet. Vous saisirez demain.",
                  "Demain, deux rendez-vous tombent. La fiche reste vide.",
                  "Jeudi, un mandat rentre. Vous cherchez de mémoire.",
                  "Vous rappelez les trois acheteurs dont vous vous souvenez. Les onze autres dorment dans la base.",
                ].map((line) => (
                  <li key={line} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" />
                    <span className="leading-relaxed">{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Après */}
            <div className="rounded-md border-2 border-[#FF6B00] bg-slate-800 p-8">
              <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#FF6B00]">
                Avec ImmoCatch
                <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
              </p>
              <ul className="mt-6 space-y-4 text-slate-300">
                {[
                  "Dans la voiture, 40 secondes de vocal.",
                  "En arrivant, la fiche est complète.",
                  "Jeudi, le mandat rentre. La liste arrive toute seule.",
                  "Vous corrigez deux mots, vous envoyez. Quatorze acheteurs touchés en dix minutes.",
                ].map((line) => (
                  <li key={line} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF6B00]" />
                    <span className="leading-relaxed">{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ========================= PREUVE / DÉMO ========================= */}
      <section id="demo" className="border-b border-slate-800 scroll-mt-20">
        <div className="mx-auto max-w-4xl px-5 py-20 sm:py-24">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Voyez-le en action
          </h2>
          <p className="mx-auto mt-4 mb-10 max-w-2xl text-center text-lg leading-relaxed text-slate-300">
            Un vocal dicté après un appel devient une fiche complète. Un mandat
            fait remonter les bons acheteurs.
          </p>

          {/* Lecteur : fichier déposé dans public/, sinon hébergeur externe,
              sinon placeholder (voir la configuration en haut du fichier). */}
          <div className="mx-auto max-w-3xl overflow-hidden rounded-md border border-slate-700 bg-slate-800">
            {DEMO_FILE ? (
              <video
                className="aspect-video w-full bg-slate-800"
                controls
                playsInline
                preload="metadata"
                poster={DEMO_POSTER}
                src={`/${DEMO_FILE}`}
              >
                Votre navigateur ne peut pas lire cette vidéo.
              </video>
            ) : DEMO_EMBED_URL ? (
              <iframe
                className="aspect-video w-full"
                src={DEMO_EMBED_URL}
                title="Démo ImmoCatch"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="relative flex aspect-video items-center justify-center bg-slate-800">
                <div className="flex h-20 w-20 items-center justify-center rounded-md bg-[#FF6B00]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="white"
                    className="ml-1 h-8 w-8"
                    aria-hidden="true"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <span className="absolute bottom-4 left-4 rounded-md bg-slate-900 px-3 py-1 text-xs font-semibold text-slate-300">
                  Démo en préparation
                </span>
              </div>
            )}
          </div>

          {!DEMO_FILE && !DEMO_EMBED_URL && (
            <p className="mx-auto mt-6 max-w-2xl text-center text-slate-300">
              La vidéo arrive. En attendant, je vous la fais en direct sur votre
              propre cas.
            </p>
          )}
          <div className="mt-6 text-center">
            <a
              href={PHONE_HREF}
              className="inline-block rounded-md bg-[#FF6B00] px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-[#e65f00]"
            >
              Voir une démo en direct
            </a>
          </div>
        </div>
      </section>

      {/* ==================== NOS MODULES ==================== */}
      <section className="border-b border-slate-800">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Nos modules
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-slate-300">
            Vous démarrez avec l&apos;essentiel, vous ajoutez le reste au besoin.
          </p>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Module Fiches",
                benefit: "Un vocal suffit : la fiche est complète, propre et à jour.",
                soon: false,
                wa: true,
              },
              {
                name: "Module Rapprochement",
                benefit: "Nouveau mandat, acheteurs compatibles et brouillons prêts à envoyer.",
                soon: false,
                wa: true,
              },
              {
                name: "Module Relances",
                benefit: "Rappels au bon moment : vous ne laissez plus refroidir un acheteur chaud.",
                soon: false,
                wa: true,
              },
              {
                name: "Module Accueil",
                benefit: "Pré-qualification des leads entrants, pour les indépendants débordés.",
                soon: true,
                wa: true,
              },
              {
                name: "Module Photos",
                benefit: "Les caractéristiques « coup de cœur » extraites des photos : moulures, cheminée, luminosité.",
                soon: true,
                wa: false,
              },
            ].map((mod) => (
              <div
                key={mod.name}
                className="flex flex-col rounded-md border border-slate-800 bg-slate-800 p-7"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-bold text-white">{mod.name}</h3>
                  {mod.wa && (
                    <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                  )}
                  {mod.soon && (
                    <span className="rounded-md border border-[#FF6B00] px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-[#FF6B00]">
                      À venir
                    </span>
                  )}
                </div>
                <p className="mt-3 leading-relaxed text-slate-300">{mod.benefit}</p>
              </div>
            ))}
          </div>

          {/* Tarif : Pack Essentiel uniquement */}
          <div className="mx-auto mt-12 max-w-2xl rounded-md border border-slate-700 bg-slate-800 p-8 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-[#FF6B00]">
              Pack Essentiel
            </p>
            <p className="mt-3 text-xl font-bold text-white">
              Fiches + Rapprochement
            </p>
            <p className="mt-3 text-lg text-slate-200">
              À partir de{" "}
              <span className="font-bold text-white">
                <CountUp to={1800} suffix={"\u00A0€"} />
              </span>{" "}
              d&apos;installation +{" "}
              <span className="font-bold text-white">250 €/mois</span>.
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Installation : paramétrage, reprise de votre base et prise en main.
            </p>
            <a
              href={PHONE_HREF}
              className="mt-8 inline-block rounded-md bg-[#FF6B00] px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-[#e65f00]"
            >
              En parler de vive voix
            </a>
          </div>
        </div>
      </section>

      {/* ==================== OBJECTIONS ==================== */}
      <section className="border-b border-slate-800">
        <div className="mx-auto max-w-5xl px-5 py-20 sm:py-24">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Ce qui ne changera pas
          </h2>

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {[
              {
                title: "Vous ne changez pas de CRM",
                text: "ImmoCatch nourrit votre organisation actuelle. Vous gardez vos outils et vos habitudes.",
              },
              {
                title: "L'IA ne parle jamais à vos clients",
                text: "Elle prépare, vous décidez. Aucun message ne part sans votre validation.",
              },
              {
                title: "Aucune compétence technique",
                text: "Si vous savez envoyer un vocal sur WhatsApp, vous savez l'utiliser.",
              },
              {
                title: "Votre base reste votre base",
                text: "Jamais revendue, jamais partagée. Exportable, et vous arrêtez quand vous voulez.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-md border border-slate-800 bg-slate-800 p-7"
              >
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-slate-300">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== INSTALLATION ==================== */}
      <section className="border-b border-slate-800">
        <div className="mx-auto max-w-5xl px-5 py-20 sm:py-24">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Opérationnel en{" "}
            <span className="text-[#FF6B00]">
              <CountUp to={48} suffix={"\u00A0h"} />
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-slate-300">
            Rien à installer, rien à configurer. Je m&apos;occupe de tout.
          </p>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                step: "Jour 0",
                title: "On se parle 30 minutes",
                text: "Vous me montrez comment vous travaillez et ce qui vous prend le plus de temps.",
              },
              {
                step: "Jour 1",
                title: "Je paramètre tout",
                text: "Mise en place, reprise de votre base, adaptation aux champs qui comptent pour vous.",
              },
              {
                step: "Jour 2",
                title: "Vous dictez votre premier vocal",
                text: "Prise en main en quelques minutes. Ensuite, vous n'avez plus qu'à parler.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-md border border-slate-800 bg-slate-800 p-7"
              >
                <span className="text-sm font-bold uppercase tracking-widest text-[#FF6B00]">
                  {item.step}
                </span>
                <h3 className="mt-3 text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-slate-300">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FAQ ==================== */}
      <section className="border-b border-slate-800">
        <div className="mx-auto max-w-3xl px-5 py-20 sm:py-24">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Les questions qu&apos;on me pose
          </h2>

          <div className="mt-12 space-y-4">
            {[
              {
                q: "Je dois abandonner mon CRM ?",
                a: "Non. ImmoCatch s'ajoute à votre organisation, il ne la remplace pas. Je paramètre l'assistant pour qu'il alimente votre base existante.",
              },
              {
                q: "L'IA va contacter mes clients toute seule ?",
                a: "Jamais. Elle prépare les fiches, les listes et les brouillons ; vous gardez la main sur chaque envoi.",
              },
              {
                q: "Je ne suis pas à l'aise avec la technologie.",
                a: "Vous envoyez un vocal sur WhatsApp, comme à un collègue. C'est tout. Le reste, c'est moi qui l'installe.",
              },
              {
                q: "Combien de temps avant d'être opérationnel ?",
                a: "48 heures après notre premier échange, paramétrage et reprise de base compris.",
              },
              {
                q: "Et si ça ne me convient pas ?",
                a: "Remboursé sous 30 jours sur l'installation, abonnement sans engagement. Vous partez avec vos données.",
              },
              {
                q: "Ça marche si je suis seul ?",
                a: "C'est le cas le plus fréquent — et celui où le gain est le plus net, puisque personne ne fait la saisie à votre place.",
              },
            ].map((item) => (
              <details
                key={item.q}
                className="group rounded-md border border-slate-800 bg-slate-800 p-6"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold text-white">
                  {item.q}
                  <span className="shrink-0 text-2xl font-extrabold text-[#FF6B00] group-open:hidden">
                    +
                  </span>
                  <span className="hidden shrink-0 text-2xl font-extrabold text-[#FF6B00] group-open:block">
                    −
                  </span>
                </summary>
                <p className="mt-4 leading-relaxed text-slate-300">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== GARANTIE ==================== */}
      <section className="border-b border-slate-800">
        <div className="mx-auto max-w-4xl px-5 py-16 text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Zéro risque pour votre agence
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-300">
            Remboursé sous{" "}
            <span className="font-bold text-white">
              <CountUp to={30} suffix={"\u00A0jours"} />
            </span>{" "}
            sur l&apos;installation. Abonnement sans engagement.
          </p>
        </div>
      </section>

      {/* ================= TRANSPARENCE & CONFIANCE ================= */}
      <section className="border-b border-slate-800 bg-white text-slate-900">
        <div className="mx-auto max-w-4xl px-5 py-20 sm:py-24">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Un interlocuteur unique, pas une plateforme anonyme
          </h2>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-700">
            Je m&apos;appelle Ilias, je suis basé dans le Val-d&apos;Oise. Pas de
            plateforme américaine, pas de support anonyme : vous avez une ligne
            directe, et je m&apos;occupe de tout le setup technique.
          </p>

          {/* Contact direct */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <a
              href={PHONE_HREF}
              className="flex items-center gap-4 rounded-md border border-slate-200 bg-slate-50 p-5 transition-colors hover:border-[#FF6B00]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[#FF6B00]">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </span>
              <span>
                <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Téléphone direct
                </span>
                <span className="block text-lg font-bold text-slate-900">
                  Appeler directement
                </span>
              </span>
            </a>

            <a
              href={`mailto:${EMAIL}`}
              className="flex items-center gap-4 rounded-md border border-slate-200 bg-slate-50 p-5 transition-colors hover:border-[#FF6B00]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[#FF6B00]">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-10 6L2 7" />
                </svg>
              </span>
              <span>
                <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Email
                </span>
                <span className="block text-lg font-bold text-slate-900">
                  {EMAIL}
                </span>
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* ==================== CTA FINAL ==================== */}
      <section className="bg-[#FF6B00]">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Combien de mandats dorment dans votre base ?
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/90">
            Quinze minutes au téléphone suffisent pour le savoir.
          </p>
          <a
            href={PHONE_HREF}
            className="mt-8 inline-block rounded-md bg-slate-900 px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-slate-800"
          >
            Parler à Ilias — 15 min
          </a>
        </div>
      </section>

      {/* ============================= FOOTER ============================= */}
      <footer className="bg-slate-900">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <Wordmark className="text-lg" />

            <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-semibold text-slate-300">
              <a href={PHONE_HREF} className="transition-colors hover:text-[#FF6B00]">
                Nous appeler
              </a>
              <a href={`mailto:${EMAIL}`} className="transition-colors hover:text-[#FF6B00]">
                {EMAIL}
              </a>
              <a href="#demo" className="transition-colors hover:text-[#FF6B00]">
                Voir la démo
              </a>
            </nav>
          </div>

          {/* Mentions légales — remplacer les placeholders par les vraies informations */}
          <div className="mt-8 border-t border-slate-800 pt-6 text-center text-xs leading-relaxed text-slate-500">
            <p>
              ImmoCatch © 2026 — Service édité par IFGlobal, SASU (société par
              actions simplifiée unipersonnelle).
            </p>
            <p className="mt-1">
              SIREN 991 793 712 · SIRET (siège) 991 793 712 00019 · TVA
              intracommunautaire FR44991793712.
            </p>
            <p className="mt-1">
              991 793 712 R.C.S. Pontoise — inscrite au greffe de Pontoise le
              26/09/2025. Inscrite au RNE.
            </p>
            <p className="mt-1">
              Siège social : [adresse complète], [code postal] [Ville].
            </p>
            <p className="mt-1">
              Directeur de la publication : Ilias Frej. Contact : {EMAIL}.
            </p>
          </div>
        </div>
      </footer>

      {/* ============ CTA COLLANT — MOBILE UNIQUEMENT ============ */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-800 bg-slate-900 p-3 sm:hidden">
        <a
          href={PHONE_HREF}
          className="block rounded-md bg-[#FF6B00] px-6 py-3.5 text-center text-base font-bold text-white"
        >
          Parler à Ilias — 15 min
        </a>
      </div>
    </main>
  );
}
