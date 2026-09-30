"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { EdgeCloud, EdgeHorizon } from "./home-edge-art";
import "./ourverse-footer.css";

type OurVerseFooterProps = {
  onHeart: () => void;
  onDev?: () => void;
};

const denseStars = [
  { left: 4, top: 11, size: 2, opacity: 0.5, delay: -1.2, duration: 7 },
  { left: 9, top: 26, size: 1.5, opacity: 0.34, delay: -4.4, duration: 9 },
  { left: 14, top: 7, size: 2.5, opacity: 0.62, delay: -2.6, duration: 8 },
  { left: 18, top: 33, size: 1.5, opacity: 0.3, delay: -6.1, duration: 11 },
  { left: 22, top: 17, size: 2, opacity: 0.46, delay: -3.3, duration: 7.5 },
  { left: 27, top: 5, size: 1.5, opacity: 0.36, delay: -7.8, duration: 10 },
  { left: 31, top: 24, size: 2.5, opacity: 0.58, delay: -1.8, duration: 8.5 },
  { left: 35, top: 13, size: 1.5, opacity: 0.32, delay: -5.5, duration: 12 },
  { left: 39, top: 30, size: 2, opacity: 0.44, delay: -2.2, duration: 7.2 },
  { left: 43, top: 9, size: 1.5, opacity: 0.3, delay: -8.4, duration: 11.5 },
  { left: 47, top: 21, size: 2, opacity: 0.4, delay: -3.9, duration: 9.2 },
  { left: 51, top: 6, size: 2.5, opacity: 0.55, delay: -1.5, duration: 7.8 },
  { left: 55, top: 28, size: 1.5, opacity: 0.33, delay: -6.7, duration: 10.5 },
  { left: 59, top: 15, size: 2, opacity: 0.47, delay: -2.9, duration: 8.1 },
  { left: 63, top: 4, size: 1.5, opacity: 0.35, delay: -7.2, duration: 12.5 },
  { left: 67, top: 25, size: 2.5, opacity: 0.6, delay: -1.1, duration: 7.4 },
  { left: 71, top: 12, size: 1.5, opacity: 0.3, delay: -5.1, duration: 11 },
  { left: 75, top: 31, size: 2, opacity: 0.42, delay: -3.4, duration: 8.8 },
  { left: 79, top: 8, size: 1.5, opacity: 0.36, delay: -6.2, duration: 9.6 },
  { left: 83, top: 20, size: 2.5, opacity: 0.54, delay: -2.4, duration: 7.6 },
  { left: 87, top: 34, size: 1.5, opacity: 0.31, delay: -8.1, duration: 12.2 },
  { left: 91, top: 14, size: 2, opacity: 0.45, delay: -1.6, duration: 8.4 },
  { left: 95, top: 27, size: 1.5, opacity: 0.34, delay: -4.9, duration: 10.8 },
  { left: 7, top: 52, size: 1.5, opacity: 0.26, delay: -3.1, duration: 13 },
  { left: 16, top: 61, size: 2, opacity: 0.3, delay: -6.8, duration: 11.5 },
  { left: 26, top: 44, size: 1.5, opacity: 0.24, delay: -2.7, duration: 14 },
  { left: 74, top: 48, size: 1.5, opacity: 0.25, delay: -5.9, duration: 12.8 },
  { left: 84, top: 58, size: 2, opacity: 0.29, delay: -1.4, duration: 11.2 },
  { left: 93, top: 46, size: 1.5, opacity: 0.24, delay: -7.6, duration: 13.4 },
];

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
      <div className="ourverse-footer-nebula" aria-hidden="true"><i /><i /><i /></div>
      <div className="ourverse-footer-constellations" aria-hidden="true">
        <svg viewBox="0 0 1920 490" fill="none" preserveAspectRatio="xMidYMin meet">
          <g className="ourverse-footer-constellation">
            <path d="M400 152 342 104 302 72 322 44 364 48 400 82 436 48 478 44 498 72 458 104Z" />
            <circle cx="400" cy="152" r="2.4" /><circle cx="342" cy="104" r="1.8" /><circle cx="302" cy="72" r="2.1" />
            <circle cx="322" cy="44" r="1.7" /><circle cx="364" cy="48" r="2" /><circle cx="400" cy="82" r="1.6" />
            <circle cx="436" cy="48" r="2.2" /><circle cx="478" cy="44" r="1.7" /><circle cx="498" cy="72" r="2" />
            <circle cx="458" cy="104" r="1.8" />
            <path className="ourverse-footer-sparkle" d="M400 138 403 147 412 150 403 153 400 162 397 153 388 150 397 147Z" />
          </g>
          <g className="ourverse-footer-constellation faint">
            <path d="M1408 128 1449 96 1497 116 1521 82 1568 104" />
            <circle cx="1408" cy="128" r="1.8" /><circle cx="1449" cy="96" r="2.2" /><circle cx="1497" cy="116" r="1.6" />
            <circle cx="1521" cy="82" r="2" /><circle cx="1568" cy="104" r="1.7" />
            <path d="M1449 96 1462 58 1503 44" />
            <circle cx="1462" cy="58" r="1.5" /><circle cx="1503" cy="44" r="1.8" />
          </g>
          <g className="ourverse-footer-dust">
            {[[268, 150], [286, 162], [252, 168], [520, 108], [536, 122], [1244, 74], [1262, 88], [1280, 68], [660, 46], [680, 58], [1150, 40]].map(([x, y], index) => (
              <circle key={index} cx={x} cy={y} r={index % 3 === 0 ? 1.5 : 1} />
            ))}
          </g>
        </svg>
      </div>
      <div className="ourverse-footer-stars-dense" aria-hidden="true">
        {denseStars.map((star, index) => (
          <i key={index} style={{ left: `${star.left}%`, top: `${star.top}%`, width: star.size, height: star.size, opacity: star.opacity, animationDelay: `${star.delay}s`, animationDuration: `${star.duration}s` }} />
        ))}
      </div>
      <div className="ourverse-footer-meteors" aria-hidden="true"><i /><i /><i /></div>
      <div className="ourverse-footer-aurora" aria-hidden="true" />
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
