"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState, useMemo } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";

// Import types
import { Rsvp, WeddingConfig, TimeLeft } from "../components/types";

// Import components
import { LoopingVideoSection } from "../components/LoopingVideoSection";
import { EnvelopeOverlay } from "../components/EnvelopeOverlay";
import { HeroSection } from "../components/HeroSection";
import { OurStory } from "../components/OurStory";
import { CoupleSection } from "../components/CoupleSection";
import { ScheduleSection } from "../components/ScheduleSection";
import { LocationSection } from "../components/LocationSection";
import { RsvpForm } from "../components/RsvpForm";
import { WeddingGift } from "../components/WeddingGift";
import { GuestWishes } from "../components/GuestWishes";
import { OpeningOverlay } from "../components/OpeningOverlay";

// Default config fallback
const DEFAULT_CONFIG: WeddingConfig = {
  groomName: "Groom",
  brideName: "Bride",
  weddingDate: "2025-12-31T10:00:00",
  displayDate: "31 December 2025",
  akadTime: "10.00 – 11.00 WIB",
  receptionTime: "11.00 – 14.00 WIB",
  city: "City",
  venueName: "Venue Name",
  venueAddress: "Venue Address",
  mapsUrl: "https://maps.google.com",
  mapsEmbedUrl: "https://www.google.com/maps/embed",
  storyText: "Our love story...",
  heroImageUrl: "/canva-bg.jpg",
  videos: {},
  musicUrl: "/music.mp3",
  bankName: "Bank",
  accountNumber: "1234567890",
  accountName: "Account Name",
};

export default function InvitePage() {
  const { guest } = useParams();
  const decodedSlug = decodeURIComponent(String(guest || ""));
  const prefilledName = decodedSlug.replace(/-/g, " ");

  // State
  const [config, setConfig] = useState<WeddingConfig>(DEFAULT_CONFIG);
  const [configLoading, setConfigLoading] = useState(true);
  const [name, setName] = useState(prefilledName);
  const [willAttend, setWillAttend] = useState<"yes" | "no">("yes");
  const [comment, setComment] = useState("");
  const [sent, setSent] = useState(false);
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [opened, setOpened] = useState(false);
  const [showEnvelope, setShowEnvelope] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Use window scroll instead of ref for better hydration
  const { scrollYProgress } = useScroll();

  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -80]);

  const dustParticles = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        top: `${30 + Math.random() * 40}%`,
        left: `${35 + Math.random() * 30}%`,
        delay: `${Math.random() * 4}s`,
      })),
    []
  );

  // Fetch config from Firestore
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const docRef = doc(db, "config", "wedding");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setConfig(docSnap.data() as WeddingConfig);
        }
      } catch (error) {
        console.error("Error fetching config:", error);
      } finally {
        setConfigLoading(false);
      }
    };

    fetchConfig();
  }, []);

  // Countdown timer
  useEffect(() => {
    const target = new Date(config.weddingDate).getTime();

    const tick = () => {
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [config.weddingDate]);

  // Fetch RSVPs
  useEffect(() => {
    const q = query(collection(db, "rsvp"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((doc) => doc.data() as Rsvp);
      setRsvps(data);
    });
    return () => unsub();
  }, []);

  const handleOpenInvitation = () => {
    setOpened(true);
    setShowEnvelope(true);

    const audio = audioRef.current;
    if (!audio) return;

    setIsPlaying(true);
    audio.volume = 0;

    audio
      .play()
      .then(() => {
        let v = 0;
        const fade = setInterval(() => {
          if (v < 0.8) {
            v += 0.05;
            audio.volume = v;
          } else clearInterval(fade);
        }, 150);
      })
      .catch(() => {});
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await addDoc(collection(db, "rsvp"), {
        name,
        willAttend,
        comment,
        createdAt: serverTimestamp(),
      });
      setSent(true);
    } catch (err) {
      console.error("Error submitting RSVP:", err);
    }
  };

  const countdownFinished =
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0;

  if (configLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[var(--accent)]/30 border-t-[var(--accent)] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[var(--text)]">Loading invitation...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center overflow-hidden bg-[var(--bg)]">
      <button
        onClick={toggleMusic}
        className="fixed bottom-4 right-4 z-40 bg-[var(--accent)]/90 text-[var(--bg)] px-5 py-2 rounded-full font-[var(--font-header)] shadow-lg hover:opacity-90"
      >
        {isPlaying ? "Pause Music" : "Play Music"}
      </button>

      <OpeningOverlay
        opened={opened}
        prefilledName={prefilledName}
        onOpen={handleOpenInvitation}
        config={config}
      />

      <EnvelopeOverlay show={showEnvelope} videoUrl={config.videos.envelope} />

      <HeroSection
        prefilledName={prefilledName}
        heroY={heroY}
        dustParticles={dustParticles}
        timeLeft={timeLeft}
        countdownFinished={countdownFinished}
        config={config}
      />

      {config.videos.video1 && (
        <LoopingVideoSection src={config.videos.video1} />
      )}

      <CoupleSection config={config} />

      {config.videos.video3 && (
        <LoopingVideoSection src={config.videos.video3} />
      )}

      <OurStory storyText={config.storyText} />
      <ScheduleSection config={config} />
      <LocationSection config={config} />

      <section className="bg-[color-mix(in_srgb,var(--bg)_75%,black)] border border-[var(--accent)]/35 rounded-2xl shadow-xl w-[90%] max-w-lg mt-16 mb-10 p-6 text-center">
        <RsvpForm
          name={name}
          setName={setName}
          willAttend={willAttend}
          setWillAttend={setWillAttend}
          comment={comment}
          setComment={setComment}
          onSubmit={handleSubmit}
          sent={sent}
        />
      </section>

      <WeddingGift config={config} />
      <GuestWishes rsvps={rsvps} />

      <audio ref={audioRef} loop>
        <source src={config.musicUrl} type="audio/mpeg" />
      </audio>

      <footer className="pb-6 text-[var(--text)]/50 text-xs text-center">
        © 2025 {config.groomName} &amp; {config.brideName} Wedding
      </footer>
    </main>
  );
}
