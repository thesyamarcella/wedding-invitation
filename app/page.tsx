"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // optional: redirect or show landing screen
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <h1 className="text-xl text-gray-200">
        Welcome to Thesya & Lana Wedding Invitation 💐
        <br />
        Please open your personal link 🌿
      </h1>
    </main>
  );
}
