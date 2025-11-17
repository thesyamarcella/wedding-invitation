"use client";

import { motion } from "framer-motion";
import { WeddingConfig } from "./types";

type Props = {
  config: WeddingConfig;
};

export const LocationSection = ({ config }: Props) => {
  return (
    <section className="w-full py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          className="font-[var(--font-header)] text-3xl text-[var(--accent)] mb-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          Location
        </motion.h2>

        <motion.p
          className="text-[var(--text)]/80 text-center mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          {config.venueName} · {config.city}
        </motion.p>

        <div className="bg-[color-mix(in_srgb,var(--bg)_80%,black)] border border-[var(--accent)]/30 rounded-2xl overflow-hidden shadow-lg">
          <div className="aspect-[4/3] w-full">
            <iframe
              src={config.mapsEmbedUrl}
              loading="lazy"
              className="w-full h-full border-0"
            />
          </div>

          <div className="p-4 text-center">
            <a
              href={config.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[var(--accent)] text-[var(--bg)] px-5 py-2 rounded-full font-[var(--font-header)] text-sm hover:opacity-90"
            >
              Open in Google Maps
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
