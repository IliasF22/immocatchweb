import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ImmoCatch — Assistant IA back-office pour agences immobilières",
  description:
    "Dictez une note vocale sur WhatsApp : ImmoCatch la transforme en fiche complète et fait remonter automatiquement les acheteurs de votre base à chaque nouveau mandat. Vous gardez toujours la main.",
  openGraph: {
    title:
      "ImmoCatch — Vos heures de saisie et de rapprochement redeviennent des heures de visite",
    description:
      "Assistant IA à usage interne : note vocale WhatsApp → fiche structurée → rapprochement automatique des acheteurs, avec validation humaine. Pour les agences immobilières indépendantes.",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-slate-900 text-slate-100 antialiased">{children}</body>
    </html>
  );
}
