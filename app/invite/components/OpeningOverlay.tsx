"use client";

import { motion } from "framer-motion";
import { WeddingConfig } from "./types";

type Props = {
  opened: boolean;
  prefilledName: string;
  onOpen: () => void;
  config: WeddingConfig;
};

export const OpeningOverlay = ({
  opened,
  prefilledName,
  onOpen,
  config,
}: Props) => {
  if (opened) return null;

  return (
    <div
      className="
        fixed inset-0 
        bg-[rgba(255,255,255,0.4)]
        backdrop-blur-md 
        z-50 flex items-center justify-center
      "
    >
      <motion.div
        className="
          bg-[color-mix(in_srgb,var(--bg)_92%,white)]
          border border-[var(--accent)]/30 
          rounded-3xl 
          px-10 py-12 
          text-center 
          shadow-[0_0_18px_rgba(180,180,159,0.18)]
          backdrop-blur-sm
          max-w-md w-[90%]
        "
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <p className="font-[var(--font-header)] tracking-[0.3em] text-xs uppercase text-[var(--accent)] mb-3">
          Wedding Invitation
        </p>

        <h1 className="font-[var(--font-script)] text-4xl text-[var(--text)] mb-2 drop-shadow-sm">
          {config.groomName} &amp; {config.brideName}
        </h1>

        <p className="text-[var(--text)]/80 mb-6">
          Dear <span className="capitalize">{prefilledName}</span>, we are
          delighted to invite you to our wedding day.
        </p>

        <button
          onClick={onOpen}
          className="
            w-full 
            bg-[var(--accent)] 
            text-[var(--bg)] 
            py-3 
            rounded-full 
            font-[var(--font-header)] 
            shadow-[0_0_10px_rgba(120,136,113,0.25)]
            hover:opacity-90
            transition
          "
        >
          Open Invitation
        </button>
      </motion.div>
    </div>
  );
};
