"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  delay?: number;
};

export const LoopingVideoSection = ({ src, delay = 0 }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasPlayed, setHasPlayed] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Set video duration to 3 seconds by controlling playback
    video.playbackRate = video.duration > 0 ? video.duration / 1.5 : 1;

    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (!video || hasPlayed) return;

      // Video is in viewport when scroll progress is between 0.2 and 0.8
      const isInView = latest > 0.2 && latest < 0.8;

      if (isInView && video.paused) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else if (!isInView && !video.paused) {
        video.pause();
      }
    });

    const handleEnded = () => {
      setHasPlayed(true);
      // Keep video at the last frame
      video.currentTime = video.duration;
    };

    video.addEventListener("ended", handleEnded);

    return () => {
      unsubscribe();
      video.removeEventListener("ended", handleEnded);
    };
  }, [scrollYProgress, hasPlayed]);

  if (!src) return null;

  return (
    <section ref={sectionRef} className="w-full flex justify-center">
      <motion.video
        ref={videoRef}
        src={src}
        muted
        playsInline
        className="w-full max-w-4xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay }}
      />
    </section>
  );
};
