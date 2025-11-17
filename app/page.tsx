"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

function slugify(v: string) {
  return v.trim().toLowerCase().replace(/\s+/g, "-");
}

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !showVideo) return;

    const handleTimeUpdate = () => {
      // Loop when video reaches 7 seconds
      if (video.currentTime >= 7) {
        video.currentTime = 0;
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, [showVideo]);

  const openInvite = () => {
    if (!name.trim()) {
      alert("Please enter your name 😊");
      return;
    }

    // Show video first
    setShowVideo(true);

    // Navigate after 7 seconds (video length)
    setTimeout(() => {
      router.push(`/invite/${encodeURIComponent(slugify(name))}`);
    }, 7000);
  };

  return (
    <main className="min-h-screen flex items-center justify-center relative px-6 overflow-hidden bg-[var(--bg)]">
      {/* Video Overlay */}
      {showVideo && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <video
            ref={videoRef}
            src="/invitation.mp4"
            autoPlay
            muted
            playsInline
            loop
            className="w-full h-full object-cover"
          />
        </motion.div>
      )}

      {/* bg gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),transparent_60%),_radial-gradient(circle_at_bottom,_rgba(0,0,0,0.45),transparent_65%)]" />

      {/* faint title svg */}
      <motion.img
        alt="Lana & Thesya"
        className="absolute top-10 w-[85%] max-w-2xl opacity-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 0.2, y: 0 }}
        transition={{ duration: 2 }}
      />

      {/* main card */}
      <motion.div
        className="relative z-10 max-w-lg w-full bg-[color-mix(in_srgb,var(--bg)_70%,black)] backdrop-blur-md border border-[var(--accent)]/30 rounded-3xl p-10 text-center shadow-2xl"
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <p className="font-[var(--font-header)] tracking-[0.35em] text-xs uppercase text-[var(--accent)] mb-3">
          Wedding Invitation
        </p>

        <h1 className="font-[var(--font-script)] text-5xl text-[var(--text)] mb-2">
          Lana &amp; Thesya
        </h1>

        <p className="font-[var(--font-body)] text-[var(--text)]/80 mb-2">
          Sunday, 30 November 2025 · Bogor
        </p>

        <p className="font-[var(--font-body)] text-sm text-[var(--accent)]/90 mb-8">
          Please enter your name to open your personalized invitation.
        </p>

        <input
          type="text"
          placeholder="Your full name"
          className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--accent)]/40 text-[var(--text)] placeholder:text-[var(--text)]/40 focus:outline-none focus:border-[var(--accent)]"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && openInvite()}
        />

        <button
          onClick={openInvite}
          className="w-full mt-6 bg-[var(--accent)] text-[var(--bg)] py-3 rounded-full font-[var(--font-header)] tracking-wide hover:opacity-90 transition glow"
        >
          Open Invitation
        </button>

        <p className="mt-5 text-xs text-[var(--text)]/50">
          You can also share direct links like{" "}
          <span className="font-[var(--font-header)]">/invite/john-doe</span> or{" "}
          <span className="font-[var(--font-header)]">
            /invite/keluarga-lana
          </span>{" "}
          🌿
        </p>
      </motion.div>
    </main>
  );
}
