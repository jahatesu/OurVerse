"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { LockKeyhole, KeyRound, Heart } from "lucide-react";
import { relationship } from "@/data/relationship";
import { vaultContent } from "@/data/secrets";
import { SectionHeading, Modal } from "./ui";
import { useUniverse } from "./provider";
export function Vault() {
  const { progress, update, unlock } = useUniverse();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [opening, setOpening] = useState(false);
  function enter() {
    if (password.trim() === relationship.vaultPassword) {
      setOpening(true);
      unlock("secret");
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
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (step >= 2) return;
    const timer = setTimeout(() => setStep((s) => s + 1), 3500);
    return () => clearTimeout(timer);
  }, [step]);
  return (
    <Modal title="One more thing…" onClose={onClose}>
      <div className="ending">
        <motion.div
          key={step}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          {step < 2 ? (
            <>
              <span className="ending-star">✦</span>
              <h2>{step === 0 ? "Josh…" : "There’s one more thing."}</h2>
              <button
                className="text-button"
                onClick={() => setStep((s) => s + 1)}
              >
                Keep going ♡
              </button>
            </>
          ) : (
            <>
              <Heart size={36} />
              <p>{relationship.finalLetter}</p>
              <div className="ending-stars">✧ · ♡ · ✦ · ♡ · ✧</div>
            </>
          )}
        </motion.div>
      </div>
    </Modal>
  );
}
