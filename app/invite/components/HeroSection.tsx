"use client";

import { motion, MotionValue } from "framer-motion";
import Lottie from "lottie-react";
import floralAnimation from "@/public/lottie/floral.json";
import { TimeLeft, WeddingConfig } from "./types";
import { CountdownBlock } from "./CountdownBlock";

type Props = {
  prefilledName: string;
  heroY: MotionValue<number>;
  dustParticles: Array<{
    id: number;
    top: string;
    left: string;
    delay: string;
  }>;
  timeLeft: TimeLeft;
  countdownFinished: boolean;
  config: WeddingConfig;
};

export const HeroSection = ({
  prefilledName,
  heroY,
  dustParticles,
  timeLeft,
  countdownFinished,
  config,
}: Props) => {
  return (
    <section className="relative w-full h-[100vh] overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${config.heroImageUrl}')`, y: heroY }}
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 7 }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,0,0,0.3),transparent_60%),linear-gradient(to_bottom,rgba(0,0,0,0.7),rgba(0,0,0,0.4))]" />

      {dustParticles.map((p) => (
        <div
          key={p.id}
          className="dust"
          style={{ top: p.top, left: p.left, animationDelay: p.delay }}
        />
      ))}

      <div className="absolute bottom-10 left-6 w-28 opacity-80">
        <Lottie animationData={floralAnimation} loop autoplay />
      </div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <motion.h1
          className="font-[var(--font-script)] text-[var(--text)] text-5xl md:text-6xl drop-shadow-xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          {config.groomName} &amp; {config.brideName}
        </motion.h1>

        <motion.p
          className="mt-3 font-[var(--font-header)] text-lg md:text-xl text-[var(--accent)] tracking-[0.25em] uppercase drop-shadow"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          {config.displayDate} · {config.city}
        </motion.p>

        <motion.p
          className="mt-4 font-[var(--font-body)] text-[var(--text)]/85 drop-shadow max-w-xl"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          Dear {prefilledName}, your presence is the most precious gift to us.
        </motion.p>

        <CountdownBlock
          timeLeft={timeLeft}
          countdownFinished={countdownFinished}
        />

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[var(--text)]/60 text-xs tracking-[0.3em] uppercase"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
        >
          <span className="block mb-1">Scroll</span>
          <span className="block animate-bounce">˅</span>
        </motion.div>
      </div>
    </section>
  );
};
