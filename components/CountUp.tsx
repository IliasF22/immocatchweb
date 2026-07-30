"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

// useLayoutEffect côté client, useEffect côté serveur (évite le warning SSR).
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Chiffre qui s'incrémente quand il entre dans l'écran.
 *
 * Le rendu serveur affiche directement la valeur finale (bon pour le SEO et
 * pour les visiteurs sans JavaScript) ; côté client, la valeur est remise à 0
 * avant le premier affichage, puis animée à l'entrée dans le viewport.
 * L'animation est désactivée si le visiteur préfère les animations réduites.
 */
export function CountUp({
  to,
  prefix = "",
  suffix = "",
  duration = 1600,
  className = "",
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(to);
  const started = useRef(false);

  // Remise à zéro avant le premier paint : aucun scintillement visible.
  // On ne remet à zéro que si l'animation pourra effectivement se jouer, sinon
  // le chiffre resterait bloqué sur 0 (un prix affiché « 0 € » serait pire que
  // pas d'animation du tout).
  useIsoLayoutEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setValue(0);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started.current) return;
        started.current = true;
        observer.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          // easing "out cubic" : rapide au début, ralentit à l'arrivée
          const eased = 1 - Math.pow(1 - progress, 3);
          setValue(Math.round(to * eased));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toLocaleString("fr-FR")}
      {suffix}
    </span>
  );
}
