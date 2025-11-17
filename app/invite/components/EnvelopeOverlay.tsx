"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

type Props = {
  show: boolean;
  videoUrl?: string;
};

export const EnvelopeOverlay = ({ show, videoUrl }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !show) return;

    const handleTimeUpdate = () => {
      if (video.currentTime >= 3) {
        video.currentTime = 0;
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, [show]);

  if (!show || !videoUrl) return null;

  return (
    <motion.div
      className="w-full relative z-20"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        autoPlay
        muted
        playsInline
        loop
        className="w-full max-w-4xl mx-auto block"
      />
    </motion.div>
  );
};
