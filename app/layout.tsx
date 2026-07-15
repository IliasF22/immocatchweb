import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ImmoCatch — Assistant IA WhatsApp pour agences immobilières du Val-d'Oise",
  description:
    "60% des leads immobiliers sont perdus faute de réactivité. ImmoCatch qualifie vos prospects 24h/24 sur WhatsApp et planifie vos visites en moins de 60 secondes. Basé à Cergy (95).",
  openGraph: {
    title: "ImmoCatch — Ne perdez plus aucun mandat le soir et le week-end",
    description:
      "Assistant IA WhatsApp qui qualifie vos prospects 24h/24, 7j/7 et planifie vos visites automatiquement. Solution locale pour les agences indépendantes du Val-d'Oise.",
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
