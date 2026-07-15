// ImmoCatch — Landing Page (One-Page)
// Design : B2B local, institutionnel, aplats de couleurs solides.
// Aucun dégradé, aucun halo, aucun néon. Slate-900 + Blanc + Orange #FF6B00.

import { Logo } from "@/components/Logo";

const PHONE_DISPLAY = "+33 6 15 88 97 44";
const PHONE_HREF = "tel:+33615889744";
const EMAIL = "ilias@immocatch.fr";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900 text-slate-100">
      {/* ============================= HEADER ============================= */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5" aria-label="ImmoCatch — accueil">
            <Logo className="h-9 w-9" houseClassName="text-white" />
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
            <span className="hidden sm:inline">Appeler le </span>
            {PHONE_DISPLAY}
          </a>
        </div>
      </header>

      {/* ============================== HERO ============================== */}
      <section className="border-b border-slate-800">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:py-28">
          <p className="text-sm font-bold uppercase tracking-widest text-[#FF6B00]">
            Assistant IA WhatsApp pour agences immobilières indépendantes
          </p>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
            Ne perdez plus aucun mandat le soir et le week-end.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300 sm:text-xl">
            60% des leads immobiliers sont perdus faute de réactivité. Notre
            assistant IA WhatsApp qualifie vos prospects 24h/24, 7j/7 et planifie
            vos visites en moins de 60 secondes.
          </p>

          <div className="mt-10">
            <a
              href="#demo"
              className="inline-block rounded-md bg-[#FF6B00] px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-[#e65f00]"
            >
              Voir la démo en 90s
            </a>
          </div>

          {/* Chiffres clés */}
          <dl className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { value: "< 60s", label: "pour qualifier un prospect" },
              { value: "24/7", label: "disponibilité, même la nuit" },
              { value: "48h", label: "pour être opérationnel" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-md border border-slate-800 bg-slate-800 p-5"
              >
                <dt className="text-3xl font-extrabold text-[#FF6B00]">
                  {stat.value}
                </dt>
                <dd className="mt-1 text-sm text-slate-300">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ==================== BANDE D'IMPACT (PROBLÈME) ==================== */}
      <section className="bg-[#FF6B00]">
        <div className="mx-auto max-w-4xl px-5 py-12 text-center">
          <p className="text-xl font-bold leading-relaxed text-white sm:text-2xl">
            Un lead qui n&apos;obtient pas de réponse dans l&apos;heure appelle
            l&apos;agence d&apos;à côté. Chaque prospect ignoré, c&apos;est un
            mandat pour votre concurrent.
          </p>
        </div>
      </section>

      {/* ==================== COMMENT ÇA MARCHE ==================== */}
      <section className="border-b border-slate-800">
        <div className="mx-auto max-w-5xl px-5 py-20 sm:py-24">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Comment ça marche
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-slate-300">
            Trois étapes, entièrement automatiques. Vous ne touchez à rien.
          </p>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Le lead arrive",
                text: "Un prospect vous contacte via Leboncoin, votre site ou une annonce. L'IA répond instantanément sur WhatsApp, à toute heure.",
              },
              {
                step: "02",
                title: "L'IA qualifie",
                text: "Budget, apport, projet, délai : l'assistant pose les bonnes questions et trie les prospects sérieux des simples curieux.",
              },
              {
                step: "03",
                title: "La visite est planifiée",
                text: "Le rendez-vous est calé dans votre agenda et la fiche prospect qualifiée atterrit directement dans votre CRM.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-md border border-slate-800 bg-slate-800 p-7"
              >
                <span className="text-2xl font-extrabold text-[#FF6B00]">
                  {item.step}
                </span>
                <h3 className="mt-3 text-xl font-bold text-white">
                  {item.title}
                </h3>
                <p className="mt-3 leading-relaxed text-slate-300">
                  {item.text}
                </p>
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
            Découvrez comment notre IA qualifie le budget, l&apos;apport et
            planifie la visite d&apos;un lead Leboncoin pendant que vous dormez.
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
              [Insérer capture d&apos;écran de conversation WhatsApp réelle]
            </div>
            <div className="flex min-h-[180px] items-center justify-center rounded-md border-2 border-dashed border-slate-700 bg-slate-800 p-6 text-center text-sm font-medium text-slate-400">
              [Insérer capture d&apos;écran tableur CRM de l&apos;agence]
            </div>
          </div>
        </div>
      </section>

      {/* ================= TRANSPARENCE & CONFIANCE ================= */}
      <section className="border-b border-slate-800 bg-white text-slate-900">
        <div className="mx-auto max-w-4xl px-5 py-20 sm:py-24">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Un interlocuteur unique, pas une plateforme anonyme
          </h2>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-700">
            Je m&apos;appelle Ilias. Basé à Cergy, j&apos;aide personnellement les
            agences immobilières indépendantes à automatiser leur premier contact
            client. Pas de plateforme américaine complexe, pas de support anonyme.
            Vous avez mon numéro direct, je m&apos;occupe de tout le setup
            technique en 48 heures pour votre agence.
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
                  {PHONE_DISPLAY}
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

      {/* ==================== OFFRE & SÉCURITÉ ==================== */}
      <section className="border-b border-slate-800">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:py-24">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Zéro risque. Résultats garantis.
          </h2>

          <div className="mx-auto mt-8 max-w-2xl rounded-md border border-slate-700 bg-slate-800 p-8">
            <p className="text-lg leading-relaxed text-slate-200">
              <span className="font-bold text-[#FF6B00]">Offre de lancement :</span>{" "}
              <span className="font-bold text-white">900€ de setup</span>{" "}
              <span className="text-slate-400 line-through">(au lieu de 1800€)</span>{" "}
              + <span className="font-bold text-white">250€/mois sans engagement</span>.
              Garantie satisfait ou remboursé sous 30 jours.
            </p>

            <a
              href={PHONE_HREF}
              className="mt-8 inline-block rounded-md bg-[#FF6B00] px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-[#e65f00]"
            >
              Réserver mon setup en 48h
            </a>
          </div>
        </div>
      </section>

      {/* ============================= FOOTER ============================= */}
      <footer className="bg-slate-900">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2.5">
              <Logo className="h-8 w-8" houseClassName="text-white" />
              <span className="text-lg font-bold">
                <span className="text-white">Immo</span>
                <span className="text-[#FF6B00]">Catch</span>
              </span>
            </div>

            <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-semibold text-slate-300">
              <a href={PHONE_HREF} className="transition-colors hover:text-[#FF6B00]">
                {PHONE_DISPLAY}
              </a>
              <a href={`mailto:${EMAIL}`} className="transition-colors hover:text-[#FF6B00]">
                {EMAIL}
              </a>
              <a href="#demo" className="transition-colors hover:text-[#FF6B00]">
                Voir la démo
              </a>
            </nav>
          </div>

          <p className="mt-8 border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
            ImmoCatch © 2026 — Service édité par IFGlobal SASU. Tél. {PHONE_DISPLAY}{" "}
            · {EMAIL}
          </p>
        </div>
      </footer>
    </main>
  );
}
