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
    <main className="min-h-screen bg-slate-900 pb-20 text-slate-100 sm:pb-0">
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
            Dictez une note vocale sur WhatsApp après un appel ou une visite :
            ImmoCatch la transforme en fiche complète et fait remonter
            automatiquement, à chaque nouveau mandat, les acheteurs de votre base
            qui collent au bien. Jamais un prospect n&apos;est contacté à votre
            place — vous validez, vous décidez.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#demo"
              className="w-full rounded-md bg-[#FF6B00] px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-[#e65f00] sm:w-auto"
            >
              Voir la démo en 90s
            </a>
            <a
              href={PHONE_HREF}
              className="w-full rounded-md border border-slate-600 px-8 py-4 text-lg font-bold text-slate-100 transition-colors hover:border-[#FF6B00] hover:text-[#FF6B00] sm:w-auto"
            >
              Parler à Ilias — 15 min
            </a>
          </div>

          {/* Réassurance immédiate */}
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
              { value: "Vous dictez", label: "une note vocale sur WhatsApp, en sortant de visite" },
              { value: "L'IA structure", label: "la fiche contact / bien, complète et rangée" },
              { value: "Vous validez", label: "chaque message avant le moindre envoi" },
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
                text: "Relier les bons acheteurs à un nouveau mandat repose sur votre mémoire. Un acheteur rencontré il y a six mois, personne ne s'en souvient le jour où le bien rentre.",
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

      {/* ==================== LE VRAI COÛT (ANCRAGE) ==================== */}
      <section className="border-b border-slate-800">
        <div className="mx-auto max-w-5xl px-5 py-20 sm:py-24">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Ce travail, aujourd&apos;hui, quelqu&apos;un le fait déjà
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-slate-300">
            C&apos;est vous, le soir. Vous avez trois options — une seule ne vous
            coûte ni vos soirées, ni un salaire.
          </p>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {/* Option 1 */}
            <div className="rounded-md border border-slate-800 bg-slate-800 p-7">
              <h3 className="text-lg font-bold text-white">Vous continuez seul</h3>
              <p className="mt-4 text-3xl font-extrabold text-slate-400">
                ~5 semaines
              </p>
              <p className="mt-1 text-sm text-slate-400">de travail par an</p>
              <p className="mt-4 leading-relaxed text-slate-300">
                45 minutes de saisie par jour, c&apos;est près de 165 heures sur
                l&apos;année. Presque cinq semaines de travail passées à taper au
                lieu de vendre.
              </p>
            </div>

            {/* Option 2 */}
            <div className="rounded-md border border-slate-800 bg-slate-800 p-7">
              <h3 className="text-lg font-bold text-white">Vous embauchez</h3>
              <p className="mt-4 text-3xl font-extrabold text-slate-400">
                ~2 000 €
              </p>
              <p className="mt-1 text-sm text-slate-400">par mois, chargé</p>
              <p className="mt-4 leading-relaxed text-slate-300">
                Un mi-temps ou un temps plein administratif. À recruter, à former,
                à remplacer pendant les congés — et présent seulement aux heures
                de bureau.
              </p>
            </div>

            {/* Option 3 — ImmoCatch */}
            <div className="rounded-md border-2 border-[#FF6B00] bg-slate-800 p-7">
              <h3 className="text-lg font-bold text-[#FF6B00]">
                Vous déléguez à ImmoCatch
              </h3>
              <p className="mt-4 text-3xl font-extrabold text-white">250 €</p>
              <p className="mt-1 text-sm text-slate-400">par mois, sans engagement</p>
              <p className="mt-4 leading-relaxed text-slate-300">
                Opérationnel jour et nuit, sans contrat de travail. Vous dictez en
                sortant de visite, la fiche est déjà écrite avant que vous
                rentriez à l&apos;agence.
              </p>
            </div>
          </div>

          <p className="mx-auto mt-10 max-w-3xl rounded-md border border-slate-700 bg-slate-800 p-6 text-center text-lg leading-relaxed text-slate-200">
            250 €/mois, c&apos;est <span className="font-bold text-white">3 000 € sur l&apos;année</span>.
            Regardez le montant de votre dernière commission : il suffit d&apos;un
            seul mandat rattrapé dans votre base pour que l&apos;année soit
            remboursée.
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
                text: "Après un appel ou une visite, vous dictez une note vocale sur WhatsApp. Comme un message à un collègue : aucune saisie, aucune nouvelle application à apprendre.",
              },
              {
                step: "02",
                title: "Fiche structurée automatiquement",
                text: "L'assistant transcrit et range tout seul les informations dans la fiche contact ou bien : budget, apport, critères, projet, délai.",
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

      {/* ==================== AVANT / APRÈS (SCÉNARIO CONCRET) ==================== */}
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
                  "Vous notez trois mots sur un carnet, en vous disant que vous saisirez tout demain.",
                  "Demain, deux nouveaux rendez-vous tombent. La fiche reste vide.",
                  "Un mandat rentre jeudi. Vous cherchez dans votre tête qui pourrait être intéressé.",
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
              <p className="text-sm font-bold uppercase tracking-widest text-[#FF6B00]">
                Avec ImmoCatch
              </p>
              <ul className="mt-6 space-y-4 text-slate-300">
                {[
                  "Dans la voiture, vous dictez 40 secondes de vocal sur WhatsApp.",
                  "En arrivant, la fiche est complète : budget, apport, critères, niveau de motivation.",
                  "Jeudi, le mandat rentre. La liste des acheteurs compatibles arrive toute seule.",
                  "Vous relisez les brouillons, vous corrigez deux mots, vous envoyez. Quatorze acheteurs touchés en dix minutes.",
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
            Découvrez comment une note vocale dictée après un appel devient une
            fiche complète, et comment un nouveau mandat fait remonter
            instantanément les bons acheteurs de votre base.
          </p>

          {/*
            Lecteur vidéo — placeholder en attendant la démo.
            Pour brancher la vraie vidéo, remplacer tout le bloc ci-dessous par :

            <div className="aspect-video">
              <iframe
                className="h-full w-full"
                src="https://www.youtube.com/embed/VIDEO_ID"
                title="Démo ImmoCatch"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>

            …ou, pour un fichier hébergé dans /public :
            <video className="w-full" controls poster="/demo-poster.jpg" src="/demo.mp4" />
          */}
          <div className="mx-auto max-w-3xl overflow-hidden rounded-md border border-slate-700 bg-slate-800">
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
          </div>

          <p className="mx-auto mt-6 max-w-2xl text-center text-slate-300">
            La vidéo arrive. En attendant, je vous la fais en direct sur votre
            propre cas, en 15 minutes au téléphone.
          </p>
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
            Vous démarrez avec l&apos;essentiel, vous ajoutez les modules dont
            votre agence a besoin.
          </p>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Module Fiches",
                benefit: "Une note vocale dictée sur WhatsApp suffit : votre fiche contact ou bien est complète, propre et à jour, sans une minute de saisie.",
                soon: false,
              },
              {
                name: "Module Rapprochement",
                benefit: "À chaque nouveau mandat, la liste des acheteurs compatibles de votre base sort toute seule, avec des brouillons de message prêts à envoyer.",
                soon: false,
              },
              {
                name: "Module Relances",
                benefit: "Un suivi intelligent de vos contacts dans la durée, avec rappels sur WhatsApp : vous ne laissez plus refroidir un acheteur chaud.",
                soon: false,
              },
              {
                name: "Module Accueil",
                benefit: "Pré-qualification des leads entrants sur WhatsApp, pensée pour les indépendants débordés qui ne peuvent pas tout traiter en direct.",
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
              Installation : paramétrage sur mesure, reprise de votre base
              existante et prise en main. Les autres modules se discutent selon
              votre agence.
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

      {/* ==================== OBJECTIONS / RÉASSURANCE ==================== */}
      <section className="border-b border-slate-800">
        <div className="mx-auto max-w-5xl px-5 py-20 sm:py-24">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Ce qui ne changera pas dans votre agence
          </h2>

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {[
              {
                title: "Vous ne changez pas de CRM",
                text: "ImmoCatch vient nourrir votre organisation actuelle. Vous gardez vos outils, vos habitudes et vos données.",
              },
              {
                title: "L'IA ne parle jamais à vos clients",
                text: "Elle prépare, vous décidez. Aucun message ne part sans votre validation : votre relation client reste la vôtre.",
              },
              {
                title: "Aucune compétence technique",
                text: "Si vous savez envoyer un vocal sur WhatsApp, vous savez utiliser ImmoCatch. Il n'y a rien d'autre à apprendre.",
              },
              {
                title: "Votre base reste votre base",
                text: "Vos données ne sont ni revendues, ni partagées avec d'autres agences. Vous pouvez les exporter, et tout arrêter quand vous voulez.",
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
            Opérationnel en 48 heures
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-slate-300">
            Vous n&apos;avez rien à installer, rien à configurer. Je m&apos;occupe
            de tout.
          </p>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                step: "Jour 0",
                title: "On se parle 30 minutes",
                text: "Vous me montrez comment vous travaillez aujourd'hui, et ce qui vous prend le plus de temps.",
              },
              {
                step: "Jour 1",
                title: "Je paramètre tout",
                text: "Mise en place de l'assistant, reprise de votre base existante, adaptation aux champs qui comptent pour vous.",
              },
              {
                step: "Jour 2",
                title: "Vous dictez votre premier vocal",
                text: "Prise en main en quelques minutes. À partir de là, vous n'avez plus qu'à parler.",
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
                q: "Est-ce que je dois abandonner mon CRM actuel ?",
                a: "Non. ImmoCatch s'ajoute à votre organisation, il ne la remplace pas. On regarde ensemble comment vous travaillez, et je paramètre l'assistant pour qu'il alimente votre base existante.",
              },
              {
                q: "Est-ce que l'IA va contacter mes clients toute seule ?",
                a: "Jamais. C'est le principe même de l'outil : il prépare le travail (fiches, listes d'acheteurs, brouillons de messages) et vous gardez la main sur chaque envoi. Votre relation client ne se délègue pas.",
              },
              {
                q: "Je ne suis pas à l'aise avec la technologie, c'est compliqué ?",
                a: "Vous envoyez un message vocal sur WhatsApp, exactement comme à un collègue. C'est tout ce que vous avez à faire. Le reste se passe en coulisses, et c'est moi qui l'installe.",
              },
              {
                q: "Combien de temps avant d'être opérationnel ?",
                a: "48 heures après notre premier échange. Vous n'avez rien à installer : je m'occupe du paramétrage et de la reprise de votre base.",
              },
              {
                q: "Et si ça ne me convient pas ?",
                a: "Vous êtes remboursé sous 30 jours sur l'installation, et l'abonnement mensuel est sans engagement. Vous arrêtez quand vous voulez, en gardant vos données.",
              },
              {
                q: "Ça fonctionne si je suis agent indépendant, tout seul ?",
                a: "C'est même le cas le plus fréquent. Quand on est seul, personne ne fait la saisie à votre place : c'est là que le gain de temps est le plus net. L'outil fonctionne aussi pour une équipe.",
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
            Satisfait ou remboursé sous 30 jours sur l&apos;installation.
            Abonnement mensuel sans engagement.
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

      {/* ==================== CTA FINAL ==================== */}
      <section className="bg-[#FF6B00]">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Combien de mandats dorment dans votre base ?
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/90">
            Quinze minutes au téléphone suffisent pour le savoir. Sans engagement,
            et sans jargon technique.
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
