"use client";

import { motion } from "framer-motion";
import { WeddingConfig } from "./types";

type Props = {
  config: WeddingConfig;
};

export const WeddingGift = ({ config }: Props) => (
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
        Your presence is the most beautiful gift. However, if you wish to share
        a token of love, you may send it via:
      </p>

      <p className="font-[var(--font-header)] text-[var(--accent)] mb-1">
        {config.bankName} — {config.accountNumber}
      </p>

      <p className="text-sm text-[var(--text)]/80 mb-4">
        A/n {config.accountName}
      </p>

      <button
        onClick={() => navigator.clipboard.writeText(config.accountNumber)}
        className="
          bg-[var(--accent)]
          text-[var(--bg)]
          px-5 py-2 rounded-full
          font-[var(--font-header)]
          transition-opacity
          hover:opacity-90
        "
      >
        Copy Account Number
      </button>

      <p className="text-xs text-[var(--text)]/60 mt-3">
        Thank you for your kindness and prayers 🕊️
      </p>
    </motion.div>
  </section>
);
