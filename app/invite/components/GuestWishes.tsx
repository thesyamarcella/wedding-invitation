"use client";

import { motion } from "framer-motion";
import { Rsvp } from "./types";
import { useState } from "react";

type Props = {
  rsvps: Rsvp[];
};

export const GuestWishes = ({ rsvps }: Props) => {
  const [filter, setFilter] = useState<"all" | "yes" | "no">("all");

  // Filter RSVPs based on attendance
  const filteredRsvps = rsvps.filter((r) => {
    if (filter === "all") return true;
    return r.willAttend === filter;
  });

  // Count attendance
  const attendingCount = rsvps.filter((r) => r.willAttend === "yes").length;
  const notAttendingCount = rsvps.filter((r) => r.willAttend === "no").length;

  return (
    <section className="w-full max-w-lg mb-20 px-4">
      <h3 className="font-[var(--font-header)] text-3xl text-[var(--accent)] mb-2 text-center">
        Guest Wishes ❤︎
      </h3>

      {rsvps.length > 0 && (
        <p className="text-center text-[var(--text)]/60 text-sm mb-4">
          {attendingCount} attending • {notAttendingCount} unable to attend
        </p>
      )}

      {/* Filter Buttons */}
      {rsvps.length > 0 && (
        <div className="flex gap-2 justify-center mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`
              px-4 py-2 rounded-full text-sm font-[var(--font-header)] transition
              ${
                filter === "all"
                  ? "bg-[var(--accent)] text-[var(--bg)] shadow-md"
                  : "bg-[color-mix(in_srgb,var(--bg)_90%,white)] text-[var(--text)]/70 hover:text-[var(--text)]"
              }
            `}
          >
            All ({rsvps.length})
          </button>
          <button
            onClick={() => setFilter("yes")}
            className={`
              px-4 py-2 rounded-full text-sm font-[var(--font-header)] transition
              ${
                filter === "yes"
                  ? "bg-[var(--accent)] text-[var(--bg)] shadow-md"
                  : "bg-[color-mix(in_srgb,var(--bg)_90%,white)] text-[var(--text)]/70 hover:text-[var(--text)]"
              }
            `}
          >
            Attending ({attendingCount})
          </button>
          <button
            onClick={() => setFilter("no")}
            className={`
              px-4 py-2 rounded-full text-sm font-[var(--font-header)] transition
              ${
                filter === "no"
                  ? "bg-[var(--accent)] text-[var(--bg)] shadow-md"
                  : "bg-[color-mix(in_srgb,var(--bg)_90%,white)] text-[var(--text)]/70 hover:text-[var(--text)]"
              }
            `}
          >
            Unable ({notAttendingCount})
          </button>
        </div>
      )}

      {/* Wishes List */}
      <div className="flex flex-col gap-3">
        {filteredRsvps.length === 0 && filter === "all" && (
          <div className="text-center py-12">
            <p className="text-[var(--text)]/50 text-lg mb-2">No wishes yet</p>
            <p className="text-[var(--text)]/40 text-sm">
              Be the first to share your wishes 💝
            </p>
          </div>
        )}

        {filteredRsvps.length === 0 && filter !== "all" && (
          <div className="text-center py-8">
            <p className="text-[var(--text)]/50">
              No {filter === "yes" ? "attending" : "unable to attend"} responses
              yet
            </p>
          </div>
        )}

        {filteredRsvps.map((r, i) => (
          <motion.div
            key={`${r.name}-${i}`}
            className={`
              relative
              border rounded-xl p-4 shadow-sm
              transition-all duration-300
              hover:shadow-md
              ${
                r.willAttend === "yes"
                  ? "bg-[color-mix(in_srgb,var(--bg)_85%,var(--accent)_15%)] border-[var(--accent)]/40"
                  : "bg-[color-mix(in_srgb,var(--bg)_90%,white)] border-[var(--accent)]/25"
              }
            `}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
          >
            {/* Decorative quote mark */}
            {r.comment && (
              <div className="absolute top-3 right-3 text-[var(--accent)]/20 text-4xl font-serif leading-none">
                "
              </div>
            )}

            <div className="flex items-start justify-between mb-2">
              <p className="font-[var(--font-header)] text-[var(--text)] text-lg">
                {r.name}
              </p>
              <span
                className={`
                  px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2
                  ${
                    r.willAttend === "yes"
                      ? "bg-[var(--accent)]/20 text-[var(--accent)]"
                      : "bg-[var(--text)]/10 text-[var(--text)]/60"
                  }
                `}
              >
                {r.willAttend === "yes" ? "✓ Attending" : "✗ Unable"}
              </span>
            </div>

            {r.comment && (
              <p className="text-sm text-[var(--text)]/85 leading-relaxed italic relative z-10">
                {r.comment}
              </p>
            )}

            {!r.comment && (
              <p className="text-xs text-[var(--text)]/50 italic">No message</p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Bottom decoration */}
      {rsvps.length > 0 && (
        <div className="mt-8 text-center">
          <div className="inline-block px-4 py-2 bg-[color-mix(in_srgb,var(--bg)_90%,white)] border border-[var(--accent)]/20 rounded-full">
            <p className="text-xs text-[var(--text)]/60">
              {rsvps.length} {rsvps.length === 1 ? "wish" : "wishes"} shared
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
