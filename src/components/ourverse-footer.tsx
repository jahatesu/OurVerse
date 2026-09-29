"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { EdgeCloud, EdgeHorizon } from "./home-edge-art";
import "./ourverse-footer.css";

type OurVerseFooterProps = {
  onHeart: () => void;
  onDev?: () => void;
};

export function OurVerseFooter({ onHeart, onDev }: OurVerseFooterProps) {
  const footerRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer || reducedMotion) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        footer.classList.add("is-visible");
        observer.disconnect();
      },
      { threshold: 0.08, rootMargin: "60px" },
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <footer ref={footerRef} className="ourverse-footer" aria-label="At the edge of OurVerse">
      <div className="ourverse-footer-stars" aria-hidden="true">
        {Array.from({ length: 11 }, (_, index) => <i key={index} />)}
      </div>
      <div className="ourverse-footer-cloud ourverse-footer-cloud-left" aria-hidden="true"><EdgeCloud variant={1} /></div>
      <div className="ourverse-footer-cloud ourverse-footer-cloud-right" aria-hidden="true"><EdgeCloud /></div>
      <div className="ourverse-footer-horizon"><EdgeHorizon quiet /></div>
      <div className="ourverse-footer-copy">
        <p>in every universe, i&apos;m inlove with you</p>
        <span>made with love, from Janna <button type="button" onClick={onHeart} aria-label="A little heart">♡</button></span>
      </div>
      {process.env.NODE_ENV === "development" && onDev && (
        <button type="button" className="ourverse-footer-dev" onClick={onDev}>Janna Mode ✦</button>
      )}
    </footer>
  );
}
