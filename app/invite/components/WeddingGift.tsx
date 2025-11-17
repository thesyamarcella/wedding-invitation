"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { WeddingConfig } from "./types";

type Props = {
  config: WeddingConfig;
};

export const WeddingGift = ({ config }: Props) => {
  const [toast, setToast] = useState<string | null>(null);

  const copy = (value: string, label: string) => {
    navigator.clipboard.writeText(value);
    setToast(`${label} copied!`);
    setTimeout(() => setToast(null), 2000);
  };

  return (
    <section className="w-full max-w-lg mb-20 px-4 mx-auto">
      <motion.h3
        className="font-[var(--font-header)] text-3xl text-[var(--accent)] mb-4 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        Wedding Gift 🎁
      </motion.h3>

      <motion.div
        className="
          bg-[color-mix(in_srgb,var(--bg)_92%,white)]
          border border-[var(--accent)]/30
          rounded-2xl p-5 
          shadow-[0_0_14px_rgba(180,180,159,0.12)]
          backdrop-blur-sm
          text-center
        "
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <p className="text-sm text-[var(--text)]/85 mb-4">
          Your presence is the most beautiful gift. However, if you wish to
          share a token of love, you may send it via:
        </p>

        {/* Bank 1 */}
        <p className="font-[var(--font-header)] text-[var(--accent)] mb-1">
          {config.bankName2} — {config.accountNumber}
        </p>
        <p className="text-sm text-[var(--text)]/80 mb-3">
          A/n {config.accountName}
        </p>

        <button
          onClick={() => copy(config.accountNumber, config.bankName2)}
          className="
            bg-[var(--accent)]
            text-[var(--bg)]
            px-3 py-1.5 rounded-full
            text-xs
            font-[var(--font-header)]
            transition-opacity
            hover:opacity-90
          "
        >
          Copy
        </button>

        <hr className="h-px my-7 bg-[#d0d0d0]/70 border-0" />

        {/* Bank 2 */}
        <p className="font-[var(--font-header)] text-[var(--accent)] mb-1">
          {config.bankName} — {config.accountNumber2}
        </p>
        <p className="text-sm text-[var(--text)]/80 mb-3">
          A/n {config.accountName2}
        </p>

        <button
          onClick={() => copy(config.accountNumber2, config.bankName)}
          className="
            bg-[var(--accent)]
            text-[var(--bg)]
            px-3 py-1.5 rounded-full
            text-xs
            font-[var(--font-header)]
            transition-opacity
            hover:opacity-90
          "
        >
          Copy
        </button>

        <p className="text-xs text-[var(--text)]/60 mt-3">
          Thank you for your kindness and prayers 🕊️
        </p>
      </motion.div>

      {/* 🌟 Toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="
            fixed bottom-6 left-1/2 -translate-x-1/2 
            bg-black/80 text-white 
            text-sm px-4 py-2 
            rounded-full 
            shadow-lg 
            z-50
          "
        >
          {toast}
        </motion.div>
      )}
    </section>
  );
};
