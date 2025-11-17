"use client";

import { motion } from "framer-motion";
import { Rsvp } from "./types";

type Props = {
  rsvps: Rsvp[];
};

export const GuestWishes = ({ rsvps }: Props) => (
  <section className="w-full max-w-lg mb-20 px-4">
    <h3 className="font-[var(--font-header)] text-3xl text-[var(--accent)] mb-4 text-center">
      Guest Wishes 💬
    </h3>

    <div className="flex flex-col gap-3">
      {rsvps.length === 0 && (
        <p className="text-center text-[var(--text)]/50">
          No wishes yet — be the first 💕
        </p>
      )}

      {rsvps.map((r, i) => (
        <motion.div
          key={i}
          className="bg-[color-mix(in_srgb,var(--bg)_80%,black)] border border-[var(--accent)]/30 p-3 rounded-lg shadow"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <p className="font-[var(--font-header)] text-[var(--text)]">
            {r.name}
          </p>
          <p className="text-xs text-[var(--accent)] mb-1">
            {r.willAttend === "yes" ? "Will attend 💖" : "Unable to attend 💔"}
          </p>
          {r.comment && (
            <p className="text-sm text-[var(--text)]/90">{r.comment}</p>
          )}
        </motion.div>
      ))}
    </div>
  </section>
);
