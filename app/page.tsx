// ImmoCatch — Landing Page (One-Page)
// Positionnement : assistant IA BACK-OFFICE à usage interne pour l'agent immobilier.
// Dictée vocale -> fiche structurée -> rapprochement acheteurs, TOUJOURS avec
// validation humaine (aucun prospect contacté à la place de l'agent).
// Design : B2B local, aplats de couleurs solides. Slate-900 + Blanc + Orange #FF6B00.

import { Logo } from "@/components/Logo";

// Le numéro n'est jamais affiché en clair : il n'est révélé qu'au clic
// (le dialer s'ouvre via le lien tel:). On expose donc uniquement le href.
const PHONE_HREF = "tel:+33615889744";
const EMAIL = "ilias@immocatch.fr";

// Variantes de titre H1 (même esprit "temps gagné / retour au terrain") :
//   A. "Vos heures de saisie et de rapprochement redeviennent des heures de visite."  (retenu)
//   B. "Reprenez les heures que le CRM vous vole chaque jour."
//   C. "La saisie et le rapprochement, faits pour vous. Vous, sur le terrain."

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900 text-slate-100">
      {/* ============================= HEADER ============================= */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5" aria-label="ImmoCatch — accueil">
            <Logo className="h-9 w-9" />
            <span className="text-xl font-bold tracking-tight">
              <span className="text-white">Immo</span>
              <span className="text-[#FF6B00]">Catch</span>
            </span>
          </a>

          {/* CTA header : appel direct */}
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
            Dictez une note vocale après un appel ou une visite : ImmoCatch la
            transcrit en fiche complète et fait remonter automatiquement, à chaque
            nouveau mandat, les acheteurs de votre base qui collent au bien. Jamais
            un prospect n&apos;est contacté à votre place — vous gardez la main,
            vous validez, vous décidez.
          </p>

          <div className="mt-10">
            <a
              href="#demo"
              className="inline-block rounded-md bg-[#FF6B00] px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-[#e65f00]"
            >
              Voir la démo en 90s
            </a>
          </div>

          {/* Piliers */}
          <dl className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { value: "Vous dictez", label: "une note vocale sur Telegram" },
              { value: "L'IA structure", label: "la fiche contact / bien dans votre base" },
              { value: "Vous validez", label: "chaque message avant tout envoi" },
            ].map((pillar) => (
              <div
                key={pillar.value}
                className="rounded-md border border-slate-800 bg-slate-800 p-5 text-left"
              >
                <dt className="text-lg font-extrabold text-[#FF6B00]">
                  {pillar.value}
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
            Vous êtes payé à la commission. Pourtant, une partie de vos journées
            part dans des tâches chronophages qui ne génèrent aucun business.
          </p>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "La saisie fastidieuse dans le CRM",
                text: "Après chaque appel et chaque visite, il faut ressaisir les informations à la main. C'est long, répétitif, et ça finit souvent à plus tard… ou jamais.",
              },
              {
                title: "Des fiches incomplètes",
                text: "Faute de temps, les fiches contacts et biens restent à moitié remplies. Les critères d'un acheteur, son budget, son apport : autant d'informations perdues.",
              },
              {
                title: "Le rapprochement « fait de tête »",
                text: "Relier les bons acheteurs à un nouveau mandat repose sur votre mémoire. « Il y a largement de quoi occuper une personne à temps plein » sur la qualification et le ciblage.",
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

      {/* ==================== CITATION (TÉMOIGNAGE-STYLE) ==================== */}
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

      {/* ==================== COMMENT ÇA MARCHE ==================== */}
      <section className="border-b border-slate-800">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Comment ça marche
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-slate-300">
            Quatre étapes. Vous parlez, l&apos;assistant fait le reste — et vous
            reprenez la main au bon moment.
          </p>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "01",
                title: "Dictée vocale",
                text: "Après un appel ou une visite, vous dictez une note vocale sur Telegram. Aucune saisie, aucune application à ouvrir.",
              },
              {
                step: "02",
                title: "Fiche structurée automatiquement",
                text: "L'assistant transcrit et range tout seul les informations dans la fiche contact ou bien : budget, apport, critères, projet.",
              },
              {
                step: "03",
                title: "Rapprochement instantané",
                text: "À chaque nouveau mandat, la base ressort automatiquement les acheteurs compatibles, avec des brouillons de message prêts à partir.",
              },
              {
                step: "04",
                title: "Vous décidez et contactez",
                text: "Vous relisez, vous ajustez, vous validez. Rien n'est jamais envoyé à un prospect sans votre feu vert.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-md border border-slate-800 bg-slate-800 p-7"
              >
                <span className="text-2xl font-extrabold text-[#FF6B00]">
                  {item.step}
                </span>
                <h3 className="mt-3 text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-slate-300">{item.text}</p>
              </div>
            ))}
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
            Découvrez comment une note vocale dictée après un appel devient une
            fiche complète, et comment un nouveau mandat fait remonter
            instantanément les bons acheteurs de votre base.
          </p>

          {/* Lecteur vidéo — placeholder élégant */}
          <div className="mx-auto max-w-3xl overflow-hidden rounded-md border border-slate-700 bg-slate-800">
            <div className="relative flex aspect-video items-center justify-center bg-slate-800">
              <button
                type="button"
                aria-label="Lire la vidéo de démonstration"
                className="flex h-20 w-20 items-center justify-center rounded-md bg-[#FF6B00] transition-colors hover:bg-[#e65f00]"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="white"
                  className="ml-1 h-8 w-8"
                  aria-hidden="true"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
              <span className="absolute bottom-4 left-4 rounded-md bg-slate-900 px-3 py-1 text-xs font-semibold text-slate-300">
                Démo — 1:30
              </span>
            </div>
          </div>

          {/* Zones images à insérer (captures réelles) */}
          <div className="mx-auto mt-6 grid max-w-3xl gap-6 sm:grid-cols-2">
            <div className="flex min-h-[180px] items-center justify-center rounded-md border-2 border-dashed border-slate-700 bg-slate-800 p-6 text-center text-sm font-medium text-slate-400">
              [Insérer capture : note vocale Telegram transformée en fiche]
            </div>
            <div className="flex min-h-[180px] items-center justify-center rounded-md border-2 border-dashed border-slate-700 bg-slate-800 p-6 text-center text-sm font-medium text-slate-400">
              [Insérer capture : liste d&apos;acheteurs compatibles générée pour un nouveau mandat]
            </div>
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
            Vous démarrez avec l&apos;essentiel, vous ajoutez les modules dont
            votre agence a besoin.
          </p>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Module Fiches",
                benefit: "Une note vocale dictée sur Telegram suffit : votre fiche contact ou bien est complète, propre et à jour, sans une minute de saisie.",
                soon: false,
              },
              {
                name: "Module Rapprochement",
                benefit: "À chaque nouveau mandat, la liste des acheteurs compatibles de votre base sort toute seule, avec des brouillons de message prêts à envoyer sur Telegram.",
                soon: false,
              },
              {
                name: "Module Relances",
                benefit: "Un suivi intelligent de vos contacts dans la durée, avec rappels et relances sur Telegram : vous ne laissez plus refroidir un acheteur chaud.",
                soon: false,
              },
              {
                name: "Module Accueil",
                benefit: "Pré-qualification des leads entrants, pensée pour les indépendants débordés qui ne peuvent pas tout traiter en direct. S'appuie sur WhatsApp (à venir).",
                soon: true,
              },
              {
                name: "Module Photos",
                benefit: "Extraction des caractéristiques « coup de cœur » d'un bien à partir de photos : moulures, cheminée, luminosité…",
                soon: true,
              },
            ].map((mod) => (
              <div
                key={mod.name}
                className="flex flex-col rounded-md border border-slate-800 bg-slate-800 p-7"
              >
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-white">{mod.name}</h3>
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
              <span className="font-bold text-white">1 800 € d&apos;installation</span>{" "}
              + <span className="font-bold text-white">250 €/mois</span>.
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Les autres modules se discutent selon votre agence.
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

      {/* ==================== GARANTIE ==================== */}
      <section className="border-b border-slate-800">
        <div className="mx-auto max-w-4xl px-5 py-16 text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Zéro risque pour votre agence
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-300">
            Satisfait ou remboursé sous 30 jours sur l&apos;installation.
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
            Je m&apos;appelle Ilias. Basé dans le Val-d&apos;Oise, j&apos;aide
            personnellement toutes les agences immobilières à se débarrasser de la
            saisie et du rapprochement manuels. Pas de plateforme américaine
            complexe, pas de support anonyme. Vous avez une ligne directe, je
            m&apos;occupe de tout le setup technique pour votre agence.
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

      {/* ============================= FOOTER ============================= */}
      <footer className="bg-slate-900">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2.5">
              <Logo className="h-8 w-8" />
              <span className="text-lg font-bold">
                <span className="text-white">Immo</span>
                <span className="text-[#FF6B00]">Catch</span>
              </span>
            </div>

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
              ImmoCatch © 2026 — Service édité par IFGlobal SASU, SASU au capital
              de [montant] €.
            </p>
            <p className="mt-1">
              SIREN [000 000 000] · RCS [Ville] · Siège social : [adresse complète],
              [code postal] [Ville] (Val-d&apos;Oise).
            </p>
            <p className="mt-1">
              Directeur de la publication : Ilias [Nom]. Contact : {EMAIL}.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
