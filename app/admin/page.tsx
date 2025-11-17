"use client";

import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import GuestList from "./GuestList";

type WeddingConfig = {
  groomName: string;
  brideName: string;
  groomFullName?: string;
  brideFullName?: string;
  groomParents?: string;
  brideParents?: string;
  weddingDate: string;
  displayDate: string;
  akadTime: string;
  receptionTime: string;
  city: string;
  venueName: string;
  venueAddress: string;
  mapsUrl: string;
  mapsEmbedUrl: string;
  storyText: string;
  heroImageUrl: string;
  videos: {
    envelope?: string;
    video1?: string;
    video2?: string;
    video3?: string;
  };
  musicUrl: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
};

const defaultConfig: WeddingConfig = {
  groomName: "Lana",
  brideName: "Thesya",
  groomFullName: "M. Maulana Yusuf, S.T.",
  brideFullName: "Thesya Marcella, S.Kom.",
  groomParents: "Bapak Ir. Mulyana, M.Si. & Ibu Nonong Sri Widayati, S.Pd.",
  brideParents: "Bapak Mardiyansyah & Ibu Ella Nurlaela",
  weddingDate: "2025-11-30T10:00:00",
  displayDate: "Sunday, 30 November 2025",
  akadTime: "10.00 – 11.00 WIB",
  receptionTime: "11.00 – 14.00 WIB",
  city: "Bogor",
  venueName: "Balai Prajurit Gedung Serbaguna Sukasari",
  venueAddress: "RT.01/RW.03, Lawanggintung, Kec. Bogor Sel., Kota Bogor",
  mapsUrl: "https://maps.app.goo.gl/PU22MGNMpTYNkT4a6",
  mapsEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.611716650205!2d106.798!3d-6.318!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sBalai%20Prajurit%20Sukasari!5e0!3m2!1sen!2sid!4v1700000000000",
  storyText:
    "From friendship to forever, our journey has been filled with laughter, growth, and countless memories. As we begin this new chapter, we are grateful to share it with family and friends who have supported us along the way.",
  heroImageUrl: "/canva-bg.jpg",
  videos: {
    envelope: "/envelope.mp4",
    video1: "/surrah.mp4",
    video2: "/thesya-lana.mp4",
    video3: "/date.mp4",
  },
  musicUrl: "/music.m4a",
  bankName: "BCA",
  accountNumber: "7370463888",
  accountName: "Thesya Marcella",
};

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Login form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Config form
  const [config, setConfig] = useState<WeddingConfig>(defaultConfig);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        fetchConfig();
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchConfig = async () => {
    try {
      const docRef = doc(db, "config", "wedding");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setConfig(docSnap.data() as WeddingConfig);
      }
    } catch (error) {
      console.error("Error fetching config:", error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      setLoginError(error.message || "Failed to login");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const docRef = doc(db, "config", "wedding");
      await setDoc(docRef, config);
      setMessage("✅ Configuration saved successfully!");

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error saving config:", error);
      setMessage("❌ Error saving configuration");
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (field: string, value: any) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const updateVideoConfig = (field: string, value: string) => {
    setConfig((prev) => ({
      ...prev,
      videos: { ...prev.videos, [field]: value },
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Wedding Admin 💒
          </h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            {loginError && <p className="text-red-500 text-sm">{loginError}</p>}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Wedding Configuration ⚙️
            </h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>

          {message && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
              {message}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-8">
            {/* Couple Information */}
            <section className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4 text-purple-600">
                👫 Couple Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Groom Name (Short)
                  </label>
                  <input
                    type="text"
                    value={config.groomName}
                    onChange={(e) => updateConfig("groomName", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bride Name (Short)
                  </label>
                  <input
                    type="text"
                    value={config.brideName}
                    onChange={(e) => updateConfig("brideName", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Groom Full Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={config.groomFullName || ""}
                    onChange={(e) =>
                      updateConfig("groomFullName", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bride Full Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={config.brideFullName || ""}
                    onChange={(e) =>
                      updateConfig("brideFullName", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Groom Parents (Optional)
                  </label>
                  <input
                    type="text"
                    value={config.groomParents || ""}
                    onChange={(e) =>
                      updateConfig("groomParents", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Son of Mr. & Mrs. ..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bride Parents (Optional)
                  </label>
                  <input
                    type="text"
                    value={config.brideParents || ""}
                    onChange={(e) =>
                      updateConfig("brideParents", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Daughter of Mr. & Mrs. ..."
                  />
                </div>
              </div>
            </section>

            {/* Date & Time */}
            <section className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4 text-purple-600">
                📅 Date & Time
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Wedding Date & Time (ISO Format)
                  </label>
                  <input
                    type="datetime-local"
                    value={config.weddingDate.slice(0, 16)}
                    onChange={(e) =>
                      updateConfig("weddingDate", e.target.value + ":00")
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Used for countdown timer
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Date
                  </label>
                  <input
                    type="text"
                    value={config.displayDate}
                    onChange={(e) =>
                      updateConfig("displayDate", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Sunday, 30 November 2025"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Akad Time
                  </label>
                  <input
                    type="text"
                    value={config.akadTime}
                    onChange={(e) => updateConfig("akadTime", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="10.00 – 11.00 WIB"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reception Time
                  </label>
                  <input
                    type="text"
                    value={config.receptionTime}
                    onChange={(e) =>
                      updateConfig("receptionTime", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="11.00 – 14.00 WIB"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={config.city}
                    onChange={(e) => updateConfig("city", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              </div>
            </section>

            {/* Venue */}
            <section className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4 text-purple-600">
                📍 Venue Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Venue Name
                  </label>
                  <input
                    type="text"
                    value={config.venueName}
                    onChange={(e) => updateConfig("venueName", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Venue Address
                  </label>
                  <input
                    type="text"
                    value={config.venueAddress}
                    onChange={(e) =>
                      updateConfig("venueAddress", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Google Maps URL
                  </label>
                  <input
                    type="url"
                    value={config.mapsUrl}
                    onChange={(e) => updateConfig("mapsUrl", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="https://maps.app.goo.gl/..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Google Maps Embed URL
                  </label>
                  <input
                    type="url"
                    value={config.mapsEmbedUrl}
                    onChange={(e) =>
                      updateConfig("mapsEmbedUrl", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="https://www.google.com/maps/embed?pb=..."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Get from Google Maps → Share → Embed a map
                  </p>
                </div>
              </div>
            </section>

            {/* Story */}
            <section className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4 text-purple-600">
                💝 Your Story
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Story Text
                </label>
                <textarea
                  value={config.storyText}
                  onChange={(e) => updateConfig("storyText", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg min-h-[120px]"
                  required
                />
              </div>
            </section>

            {/* Media URLs */}
            <section className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4 text-purple-600">
                🎬 Media URLs
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hero Background Image URL
                  </label>
                  <input
                    type="text"
                    value={config.heroImageUrl}
                    onChange={(e) =>
                      updateConfig("heroImageUrl", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="/canva-bg.jpg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Envelope Video URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={config.videos.envelope || ""}
                    onChange={(e) =>
                      updateVideoConfig("envelope", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="/envelope.mp4"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Video 1 URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={config.videos.video1 || ""}
                    onChange={(e) =>
                      updateVideoConfig("video1", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="/surrah.mp4"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Video 2 URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={config.videos.video2 || ""}
                    onChange={(e) =>
                      updateVideoConfig("video2", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="/thesya-lana.mp4"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Video 3 URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={config.videos.video3 || ""}
                    onChange={(e) =>
                      updateVideoConfig("video3", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="/date.mp4"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Music URL
                  </label>
                  <input
                    type="text"
                    value={config.musicUrl}
                    onChange={(e) => updateConfig("musicUrl", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="/music.m4a"
                    required
                  />
                </div>
              </div>
            </section>

            {/* Bank Account */}
            <section className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4 text-purple-600">
                🎁 Wedding Gift Account
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={config.bankName}
                    onChange={(e) => updateConfig("bankName", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={config.accountNumber}
                    onChange={(e) =>
                      updateConfig("accountNumber", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Name
                  </label>
                  <input
                    type="text"
                    value={config.accountName}
                    onChange={(e) =>
                      updateConfig("accountName", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={config.bankName}
                    onChange={(e) => updateConfig("bankName", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={config.accountNumber}
                    onChange={(e) =>
                      updateConfig("accountNumber2", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Name
                  </label>
                  <input
                    type="text"
                    value={config.accountName}
                    onChange={(e) =>
                      updateConfig("accountName2", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              </div>
            </section>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition disabled:opacity-50"
              >
                {saving ? "Saving..." : "💾 Save Configuration"}
              </button>
            </div>
          </form>
          <GuestList />
        </div>
      </div>
    </div>
  );
}
