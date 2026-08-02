"use client";

import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Titre dont les mots montent un par un derrière un masque, en cascade,
 * quand il entre dans l'écran.
 *
 * Mêmes garde-fous que <CountUp /> et <Reveal /> : le rendu serveur affiche
 * le titre en clair (lisible sans JavaScript et pour les moteurs de
 * recherche), et l'animation est désactivée si le visiteur a demandé des
 * animations réduites. Les mots restent séparés par de vraies espaces afin
 * que le titre continue de passer à la ligne normalement sur mobile.
 */
export function RevealText({
  text,
  as: Tag = "h2",
  className = "",
  step = 55,
}: {
  text: string;
  as?: "h1" | "h2" | "p";
  className?: string;
  step?: number;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [shown, setShown] = useState(true);

  useIsoLayoutEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setShown(false);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        setShown(true);
      },
      { threshold: 0, rootMargin: "0px 0px -60px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const words = text.split(" ");

  return (
    <Tag ref={ref} className={className}>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          {/* Le masque : padding compensé par une marge négative pour ne pas
              rogner les jambages (j, p, g) ni décaler la mise en page. */}
          <span className="inline-block overflow-hidden pb-[0.14em] align-bottom -mb-[0.14em]">
            <span
              className="inline-block transition-transform duration-700 ease-out"
              style={{
                transitionDelay: shown ? `${i * step}ms` : undefined,
                transform: shown ? "translateY(0)" : "translateY(115%)",
              }}
            >
              {word}
            </span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </Tag>
  );
}
