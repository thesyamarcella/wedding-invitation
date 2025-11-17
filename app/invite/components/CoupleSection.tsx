"use client";

import { motion } from "framer-motion";
import { WeddingConfig } from "./types";
import Image from "next/image";

type Props = {
  config: WeddingConfig;
};

export const CoupleSection = ({ config }: Props) => {
  return (
    <section className="w-full py-16 px-6 bg-[color-mix(in_srgb,var(--bg)_70%,black)]">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          className="font-[var(--font-header)] text-3xl text-[var(--accent)] mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          The groom & bride
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* bride Section */}
          <motion.div
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6 overflow-hidden">
              <img
                src="/brides.png"
                alt={config.brideName}
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="font-[var(--font-script)] text-3xl md:text-4xl text-[var(--text)] mb-2">
              {config.brideName}
            </h3>

            {config.brideFullName && (
              <p className="font-[var(--font-header)] text-[var(--accent)] text-sm tracking-wide mb-3">
                {config.brideFullName}
              </p>
            )}

            {config.brideParents && (
              <p className="text-[var(--text)]/70 text-sm max-w-xs leading-relaxed">
                putri pertama dari {config.brideParents}
              </p>
            )}
          </motion.div>

          {/* Divider with Heart */}
          <motion.div
            className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-4xl text-[var(--accent)]">𖹭</div>
          </motion.div>

          {/* groom Section */}
          <motion.div
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6 overflow-hidden">
              <img
                src="/grooms.png"
                alt={config.groomName}
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="font-[var(--font-script)] text-3xl md:text-4xl text-[var(--text)] mb-2">
              {config.groomName}
            </h3>

            {config.groomFullName && (
              <p className="font-[var(--font-header)] text-[var(--accent)] text-sm tracking-wide mb-3">
                {config.groomFullName}
              </p>
            )}

            {config.groomParents && (
              <p className="text-[var(--text)]/70 text-sm max-w-xs leading-relaxed">
                putra pertama dari {config.groomParents}
              </p>
            )}
          </motion.div>
        </div>

        {/* Mobile Heart Divider */}
        <motion.div
          className="flex md:hidden items-center justify-center mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="text-4xl text-[var(--accent)]">𖹭</div>
        </motion.div>
      </div>
    </section>
  );
};
