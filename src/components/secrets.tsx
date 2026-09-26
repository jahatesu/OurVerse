"use client";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { LockKeyhole, KeyRound, Heart } from "lucide-react";
import { relationship } from "@/data/relationship";
import { vaultContent } from "@/data/secrets";
import { SectionHeading, Modal } from "./ui";
import { useUniverse } from "./provider";
import { Couple } from "./characters";
import { endingLines } from "@/data/expansion";
import { Constellation } from "./galaxy";
import { settings } from "@/config/settings";
export function Vault() {
  const { progress, update, unlock, discover } = useUniverse();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [opening, setOpening] = useState(false);
  function enter() {
    if (password.trim() === relationship.vaultPassword) {
      setOpening(true);
      unlock("secret");
      unlock("vault");
      discover("vault");
    } else setError("Not quite, my love. Think back to our beginning.");
  }
  return (
    <>
      <SectionHeading
        eyebrow="SOME THINGS ARE JUST FOR US"
        title="The Secret Vault"
        description="You found a quiet little corner of our universe."
      />
      {progress.vault ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="vault-content"
        >
          <div className="vault-welcome">
            <KeyRound size={34} />
            <h2>You’ve always had the key. ♡</h2>
          </div>
          {vaultContent.map((item) => (
            <article key={item.title}>
              <span>✧</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </motion.div>
      ) : (
        <section className="vault-lock">
          <motion.div
            className="vault-lock-icon"
            animate={
              opening
                ? {
                    rotate: [0, -15, 15, 0],
                    scale: [1, 1.4, 0],
                    opacity: [1, 1, 0],
                  }
                : {}
            }
            transition={{ duration: 1.2 }}
            onAnimationComplete={() => {
              if (opening) {
                update((p) => ({ ...p, vault: true }));
                setOpening(false);
              }
            }}
          >
            <LockKeyhole size={45} />
          </motion.div>
          <h2>A little secret. A familiar key.</h2>
          <p>{relationship.vaultHint}</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              enter();
            }}
          >
            <label htmlFor="vault-password" className="sr-only">
              Secret vault password
            </label>
            <input
              id="vault-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Our little secret…"
              maxLength={100}
              autoComplete="off"
              disabled={opening}
            />
            <button className="primary-button" disabled={!password || opening}>
              {opening ? "Opening our universe…" : "Unlock the vault"}{" "}
              <KeyRound size={16} />
            </button>
          </form>
          <p role="status" className="form-error">
            {error}
          </p>
          <small>
            A playful easter egg, not a secure place for sensitive content.
          </small>
        </section>
      )}
    </>
  );
}
export function Ending({ onClose }: { onClose: () => void }) {
  const { update } = useUniverse();
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (step >= endingLines.length || reduced) return;
    const timer = setTimeout(() => setStep((s) => s + 1), 3500);
    return () => clearTimeout(timer);
  }, [step, reduced]);
  useEffect(() => {
    if (step >= endingLines.length) update((p) => ({ ...p, endingSeen: true }));
  }, [step, update]);
  return (
    <Modal title="One more thing…" onClose={onClose}>
      <div className={`ending cinematic-ending ending-step-${step}`}>
        <svg
          className="reunion-landscape"
          viewBox="0 0 1000 650"
          preserveAspectRatio="xMidYMax slice"
          aria-hidden="true"
        >
          <circle cx="770" cy="120" r="35" fill="#d6cfcc" opacity=".5" />
          <circle cx="785" cy="109" r="34" fill="#0b1020" />
          <path
            d="M0 440Q140 315 290 440T570 410T1000 400V650H0Z"
            fill="#22253a"
          />
          <path d="M0 520Q220 380 450 505T1000 460V650H0Z" fill="#151c2e" />
          <path d="M0 575Q480 475 1000 565V650H0Z" fill="#0d1423" />
          <path
            d="M100 595Q500 520 900 585"
            stroke="#cbb4ca"
            strokeOpacity=".13"
            fill="none"
          />
          <g fill="#e4d4ba" opacity=".6">
            <circle cx="150" cy="155" r="1.5" />
            <circle cx="340" cy="78" r="2" />
            <circle cx="590" cy="185" r="1" />
            <circle cx="880" cy="265" r="1.5" />
            <circle cx="85" cy="305" r="1" />
          </g>
        </svg>
        <Constellation
          full
          illuminated={Math.min(
            settings.constellationTarget,
            Math.ceil((step * settings.constellationTarget) / 5),
          )}
        />
        <Couple scene={step < 6 ? "walk" : step < 9 ? "hug" : "sit"} />
        <motion.div
          key={step}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          {step < endingLines.length ? (
            <>
              <span className="ending-star">✦</span>
              <h2>{endingLines[step]}</h2>
              <button
                className="text-button"
                onClick={() => {
                  setStep((s) => s + 1);
                  if (step === endingLines.length - 1)
                    update((p) => ({ ...p, endingSeen: true }));
                }}
              >
                Keep going ♡
              </button>
            </>
          ) : (
            <>
              <Heart size={36} />
              <h2>OURVERSE</h2>
              <p>Janna ♡ Josh</p>
              <p className="handwritten">to be continued…</p>
              <details>
                <summary>Keep this letter</summary>
                <p>{relationship.finalLetter}</p>
              </details>
              <div className="ending-stars">✧ · ♡ · ✦ · ♡ · ✧</div>
            </>
          )}
        </motion.div>
      </div>
    </Modal>
  );
}
