"use client";

import { motion } from "framer-motion";
import { TimeLeft } from "./types";

type Props = {
  timeLeft: TimeLeft;
  countdownFinished: boolean;
};

const TIME_KEYS = ["days", "hours", "minutes"] as const;

export const CountdownBlock = ({ timeLeft, countdownFinished }: Props) => {
  return (
    <motion.div
      className="mt-8 px-6 py-4 rounded-xl border border-[var(--accent)]/40 bg-[color-mix(in_srgb,var(--bg)_70%,black)] backdrop-blur-sm inline-block shadow-[0_0_20px_rgba(180,180,159,0.15)] relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),transparent_60%)] opacity-20 mix-blend-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 2 }}
      />

      <p className="relative font-[var(--font-header)] text-[10px] tracking-[0.3em] text-[var(--accent)] text-center mb-2 uppercase">
        {countdownFinished
          ? "Today is our wedding day 💒"
          : "Countdown to our day"}
      </p>

      {!countdownFinished && (
        <div className="relative flex gap-5 justify-center">
          {TIME_KEYS.map((key) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="text-center min-w-[60px]"
            >
              <p className="font-[var(--font-header)] text-3xl text-[var(--text)] leading-none">
                {timeLeft[key].toString().padStart(2, "0")}
              </p>
              <p className="uppercase text-[var(--accent)] text-[10px] tracking-[0.2em] mt-1">
                {key}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
