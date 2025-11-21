"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
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

// Types
import { Rsvp, WeddingConfig, TimeLeft } from "../components/types";

// Components
import { LoopingVideoSection } from "../components/LoopingVideoSection";
import { EnvelopeOverlay } from "../components/EnvelopeOverlay";
import { HeroSection } from "../components/HeroSection";
import { OurStory } from "../components/OurStory";
import { ScheduleSection } from "../components/ScheduleSection";
import { LocationSection } from "../components/LocationSection";
import { RsvpForm } from "../components/RsvpForm";
import { WeddingGift } from "../components/WeddingGift";
import { GuestWishes } from "../components/GuestWishes";
import { OpeningOverlay } from "../components/OpeningOverlay";

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
  heroImageUrl: "/hero.jpg",
  videos: {},
  musicUrl: "/music.m4a",
  bankName: "Bank",
  accountNumber: "1234567890",
  accountName: "Account Name",
  bankName2: "",
  accountNumber2: "",
  accountName2: "",
};

export default function InvitePage() {
  const router = useRouter();
  const { guest } = useParams();
  const guestSlug = String(guest);

  const [config, setConfig] = useState<WeddingConfig>(DEFAULT_CONFIG);
  const [configLoading, setConfigLoading] = useState(true);

  const [guestName, setGuestName] = useState<string>("");
  const [isFamily, setIsFamily] = useState<boolean>(false); // NEW: Track if guest is family
  const [guestLoading, setGuestLoading] = useState(true);

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

  // Scroll animations
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

  // INTRO VIDEO STATE
  const [introDone, setIntroDone] = useState(false);
  const [introFade, setIntroFade] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const showBtnTimer = setTimeout(() => setShowButton(true), 3000); // 3s
    const endTimer = setTimeout(() => {
      setIntroFade(true);
      setTimeout(() => {
        setIntroDone(true);
        // AUTO-PLAY SOUND AFTER INTRO VIDEO
        autoPlaySound();
      }, 800); // fade duration
    }, 7000); // 7s total

    return () => {
      clearTimeout(showBtnTimer);
      clearTimeout(endTimer);
    };
  }, []);

  // NEW: Auto-play sound function
  const autoPlaySound = () => {
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
            v += 0.04;
            audio.volume = v;
          } else clearInterval(fade);
        }, 130);
      })
      .catch((err) => {
        console.log("Auto-play blocked by browser:", err);
        setIsPlaying(false);
      });
  };

  // 1. LOAD GUEST
  useEffect(() => {
    async function loadGuest() {
      const ref = doc(db, "guests", guestSlug);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        router.push("/not-found");
        return;
      }
      const guestData = snap.data();
      setGuestName(guestData.name);
      setIsFamily(guestData.isFamily || false); // NEW: Get isFamily flag
      setGuestLoading(false);
    }
    loadGuest();
  }, [guestSlug, router]);

  // 2. LOAD CONFIG
  useEffect(() => {
    async function loadConfig() {
      const ref = doc(db, "config", "wedding");
      const snap = await getDoc(ref);

      if (snap.exists()) setConfig(snap.data() as WeddingConfig);
      setConfigLoading(false);
    }
    loadConfig();
  }, []);

  // 3. COUNTDOWN
  useEffect(() => {
    const target = new Date(config.weddingDate).getTime();

    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) return;

      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [config.weddingDate]);

  // 4. LOAD RSVPS
  useEffect(() => {
    const q = query(
      collection(db, "rsvp", guestSlug, "responses"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setRsvps(snap.docs.map((d) => d.data() as Rsvp));
    });

    return () => unsub();
  }, [guestSlug]);

  // 5. PLAY MUSIC WHEN OPENING INVITATION (kept for manual open if needed)
  const handleOpenInvitation = () => {
    setOpened(true);
    setShowEnvelope(true);

    const audio = audioRef.current;
    if (!audio) return;

    setIsPlaying(true);
    audio.volume = 0;

    audio.play().then(() => {
      let v = 0;
      const fade = setInterval(() => {
        if (v < 0.8) {
          v += 0.04;
          audio.volume = v;
        } else clearInterval(fade);
      }, 130);
    });
  };

  // Toggle Music
  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // 6. SUBMIT RSVP
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName) return;

    try {
      await addDoc(collection(db, "rsvp", guestSlug, "responses"), {
        name: guestName,
        willAttend,
        comment,
        createdAt: serverTimestamp(),
      });
      setSent(true);
    } catch (err) {
      console.error(err);
    }
  };

  const countdownFinished =
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0;

  if (guestLoading || configLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="text-center text-[var(--text)]">
          Loading invitation...
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center bg-[var(--bg)] overflow-hidden">
      {/* 🎥 INTRO VIDEO WITH FADE OUT */}
      {!introDone && (
        <motion.div
          animate={{ opacity: introFade ? 0 : 1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center"
        >
          <video
            src="/invitation.mp4"
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />

          {showButton && (
            <button
              onClick={() => {
                setIntroFade(true);
                setTimeout(() => {
                  setIntroDone(true);
                  autoPlaySound(); // Also auto-play when button clicked
                }, 800);
              }}
              className="
                absolute bottom-10
                bg-white/90 text-black 
                px-8 py-4 rounded-full 
                font-[var(--font-header)]
                shadow-lg
                hover:opacity-90
                transition
                text-center
              "
            >
              <span className="block">
                Dear <span className="capitalize">{guestName}</span>,
              </span>
              <span className="block">we are delighted to invite you</span>
              <span className="block mb-1">to our wedding day.</span>
            </button>
          )}
        </motion.div>
      )}

      {/* MUSIC TOGGLE */}
      <button
        onClick={toggleMusic}
        className="fixed bottom-4 right-4 z-40 bg-[var(--accent)] text-[var(--bg)] px-5 py-2 rounded-full shadow-lg"
      >
        {isPlaying ? "Pause Music" : "Play Music"}
      </button>

      <EnvelopeOverlay show={showEnvelope} videoUrl={config.videos.envelope} />

      <HeroSection
        prefilledName={guestName}
        heroY={heroY}
        dustParticles={dustParticles}
        timeLeft={timeLeft}
        countdownFinished={countdownFinished}
        config={config}
      />

      {config.videos.video1 && (
        <LoopingVideoSection src={config.videos.video1} />
      )}

      {config.videos.video2 && (
        <LoopingVideoSection src={config.videos.video2} />
      )}

      <OurStory storyText={config.storyText} />

      {config.videos.video3 && (
        <LoopingVideoSection src={config.videos.video3} />
      )}

      <LocationSection config={config} />

      {/* RSVP Box */}
      <section
        className="
          bg-[color-mix(in_srgb,var(--bg)_92%,white)]
          border border-[var(--accent)]/25
          rounded-2xl 
          shadow-[0_0_14px_rgba(180,180,159,0.15)]
          backdrop-blur-sm
          w-[90%] max-w-lg 
          mt-16 mb-10 
          p-6 
          text-center
        "
      >
        <RsvpForm
          name={guestName}
          setName={setGuestName} // NEW - allows editing
          willAttend={willAttend}
          setWillAttend={setWillAttend}
          comment={comment}
          setComment={setComment}
          onSubmit={handleSubmit}
          sent={sent}
        />
      </section>

      {/* WEDDING GIFT - Only show if guest is NOT family */}
      {!isFamily && <WeddingGift config={config} />}

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
