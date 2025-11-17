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
      {/* Background Image */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${config.heroImageUrl}')`, y: heroY }}
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 7 }}
      />

      {/* Lighter, softer overlay */}
      <div
        className="absolute inset-0 
        bg-[radial-gradient(circle_at_top,_rgba(0,0,0,0.1),transparent_70%),linear-gradient(to_bottom,rgba(255,255,255,0.15),rgba(255,255,255,0.05))]"
      />

      {/* Dust particles */}
      {dustParticles.map((p) => (
        <div
          key={p.id}
          className="dust"
          style={{ top: p.top, left: p.left, animationDelay: p.delay }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        {/* Names */}
        <motion.h1
          className="font-[var(--font-script)] text-[var(--text)] text-5xl md:text-6xl drop-shadow-sm"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          {config.groomName} &amp; {config.brideName}
        </motion.h1>

        {/* Date + City */}
        <motion.p
          className="mt-3 font-[var(--font-header)] text-lg md:text-xl text-[var(--accent)] tracking-[0.25em] uppercase drop-shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          {config.displayDate} · {config.city}
        </motion.p>

        {/* Greeting */}
        <motion.p
          className="mt-4 font-[var(--font-body)] text-[var(--text)]/85 drop-shadow-sm max-w-xl"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          Dear {prefilledName}, your presence is the most precious gift to us.
        </motion.p>

        {/* Countdown */}
        <CountdownBlock
          timeLeft={timeLeft}
          countdownFinished={countdownFinished}
        />

        {/* Scroll Indicator */}
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
