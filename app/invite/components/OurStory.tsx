"use client";

import { motion } from "framer-motion";

type Props = {
  storyText: string;
};

export const OurStory = ({ storyText }: Props) => (
  <section className="max-w-2xl text-center py-16 px-6">
    <motion.h2
      className="font-[var(--font-header)] text-3xl text-[var(--accent)] mb-4"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      Our Story
    </motion.h2>
    <motion.p
      className="text-[var(--text)]/85 leading-relaxed"
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {storyText}
    </motion.p>
  </section>
);
