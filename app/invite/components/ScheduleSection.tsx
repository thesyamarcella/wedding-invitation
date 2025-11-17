"use client";

import { motion } from "framer-motion";
import { WeddingConfig } from "./types";

type EventCardProps = {
  title: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  delay: number;
};

const EventCard = ({
  title,
  date,
  time,
  venue,
  address,
  delay,
}: EventCardProps) => (
  <motion.div
    className="bg-[color-mix(in_srgb,var(--bg)_80%,black)] border border-[var(--accent)]/40 rounded-2xl p-5 shadow-lg"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay }}
  >
    <p className="font-[var(--font-header)] text-sm tracking-[0.25em] uppercase text-[var(--accent)] mb-2">
      {title}
    </p>
    <p className="font-[var(--font-body)] text-[var(--text)] mb-1">{date}</p>
    <p className="font-[var(--font-body)] text-[var(--text)] mb-3">{time}</p>
    <p className="font-[var(--font-header)] text-[var(--accent)] mb-1">
      {venue}
    </p>
    <p className="text-xs text-[var(--text)]/80">{address}</p>
  </motion.div>
);

type Props = {
  config: WeddingConfig;
};

export const ScheduleSection = ({ config }: Props) => (
  <section className="w-full py-12 px-6 bg-[color-mix(in_srgb,var(--bg)_65%,black)]">
    <div className="max-w-3xl mx-auto">
      <motion.h2
        className="font-[var(--font-header)] text-3xl text-[var(--accent)] mb-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        Wedding Schedule
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-6">
        <EventCard
          title="Akad Nikah"
          date={config.displayDate}
          time={config.akadTime}
          venue={config.venueName}
          address={config.venueAddress}
          delay={0}
        />
        <EventCard
          title="Resepsi"
          date={config.displayDate}
          time={config.receptionTime}
          venue={config.venueName}
          address={config.venueAddress}
          delay={0.15}
        />
      </div>
    </div>
  </section>
);
