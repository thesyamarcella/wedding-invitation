"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  setDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { Copy, Check, Users, UserCheck, UserX, Calendar } from "lucide-react";

function slugify(v: string) {
  return v.trim().toLowerCase().replace(/\s+/g, "-");
}

type Guest = {
  id: string;
  name: string;
  slug: string;
  isFamily?: boolean;
  createdAt: any;
};

type GuestResponse = {
  name: string;
  willAttend: "yes" | "no";
  comment: string;
  createdAt: any;
};

export default function GuestList() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [responses, setResponses] = useState<{
    [key: string]: GuestResponse[];
  }>({});
  const [newName, setNewName] = useState("");
  const [isFamily, setIsFamily] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [expandedGuest, setExpandedGuest] = useState<string | null>(null);

  useEffect(() => {
    // Fetch guests sorted by createdAt descending (newest first)
    const guestsRef = collection(db, "guests");
    const q = query(guestsRef, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, async (snap) => {
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Guest[];

      setGuests(list);

      // Fetch RSVP responses for each guest
      const responsesData: { [key: string]: GuestResponse[] } = {};

      for (const guest of list) {
        try {
          const responsesRef = collection(db, "rsvp", guest.slug, "responses");
          const responsesSnap = await getDocs(responsesRef);
          responsesData[guest.slug] = responsesSnap.docs.map(
            (doc) => doc.data() as GuestResponse
          );
        } catch (error) {
          responsesData[guest.slug] = [];
        }
      }

      setResponses(responsesData);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handleAdd = async () => {
    if (!newName.trim()) return;

    const slug = slugify(newName);

    await setDoc(doc(db, "guests", slug), {
      name: newName,
      slug,
      isFamily,
      createdAt: serverTimestamp(),
    });

    setNewName("");
    setIsFamily(false);
  };

  const handleDelete = async (slug: string) => {
    if (
      !confirm(
        `Delete guest "${slug}"? This will also delete their RSVP responses.`
      )
    ) {
      return;
    }
    await deleteDoc(doc(db, "guests", slug));
  };

  const copyInviteLink = (slug: string) => {
    const link = `${window.location.origin}/invite/${slug}`;
    navigator.clipboard.writeText(link);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const getAttendanceStats = () => {
    let totalResponses = 0;
    let attending = 0;
    let notAttending = 0;
    let noResponse = 0;

    guests.forEach((guest) => {
      const guestResponses = responses[guest.slug] || [];
      if (guestResponses.length === 0) {
        noResponse++;
      } else {
        guestResponses.forEach((response) => {
          totalResponses++;
          if (response.willAttend === "yes") attending++;
          else notAttending++;
        });
      }
    });

    return {
      totalGuests: guests.length,
      totalResponses,
      attending,
      notAttending,
      noResponse,
    };
  };

  const stats = getAttendanceStats();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
      <h2 className="text-2xl font-bold text-purple-600 mb-6">
        📋 Guest Management
      </h2>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2 text-purple-600 mb-2">
            <Users size={20} />
            <span className="text-sm font-medium">Invited</span>
          </div>
          <div className="text-3xl font-bold text-purple-700">
            {stats.totalGuests}
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Users size={20} />
            <span className="text-sm font-medium">Total RSVPs</span>
          </div>
          <div className="text-3xl font-bold text-blue-700">
            {stats.totalResponses}
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <UserCheck size={20} />
            <span className="text-sm font-medium">Attending</span>
          </div>
          <div className="text-3xl font-bold text-green-700">
            {stats.attending}
          </div>
        </div>

        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <UserX size={20} />
            <span className="text-sm font-medium">Not Attending</span>
          </div>
          <div className="text-3xl font-bold text-red-700">
            {stats.notAttending}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <Calendar size={20} />
            <span className="text-sm font-medium">No Response</span>
          </div>
          <div className="text-3xl font-bold text-gray-700">
            {stats.noResponse}
          </div>
        </div>
      </div>

      {/* Add Guest Form */}
      <div className="bg-purple-50 rounded-lg p-4 mb-6 border border-purple-200">
        <h3 className="font-semibold text-purple-700 mb-3">➕ Add New Guest</h3>
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Guest name (Ex: John Doe / Keluarga Yusuf)"
            className="flex-1 px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />

          <label className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-purple-300 cursor-pointer hover:bg-purple-50">
            <input
              type="checkbox"
              checked={isFamily}
              onChange={(e) => setIsFamily(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium">Family (Hide Gift)</span>
          </label>

          <button
            onClick={handleAdd}
            disabled={!newName.trim()}
            className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition"
          >
            Add Guest
          </button>
        </div>
      </div>

      {/* Guest List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          <p className="mt-2 text-gray-600">Loading guests...</p>
        </div>
      ) : guests.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <Users size={48} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600 font-medium">No guests yet</p>
          <p className="text-sm text-gray-500">Add your first guest above</p>
        </div>
      ) : (
        <div className="space-y-3">
          {guests.map((guest) => {
            const guestResponses = responses[guest.slug] || [];
            const hasResponded = guestResponses.length > 0;
            const isExpanded = expandedGuest === guest.slug;

            return (
              <div
                key={guest.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition"
              >
                {/* Guest Header */}
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {guest.name}
                        </h3>
                        {guest.isFamily && (
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                            👨‍👩‍👧 Family
                          </span>
                        )}
                        {hasResponded && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                            ✓ Responded ({guestResponses.length})
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        Slug:{" "}
                        <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                          {guest.slug}
                        </code>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyInviteLink(guest.slug)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
                      >
                        {copiedSlug === guest.slug ? (
                          <>
                            <Check size={14} />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            Copy Link
                          </>
                        )}
                      </button>

                      {hasResponded && (
                        <button
                          onClick={() =>
                            setExpandedGuest(isExpanded ? null : guest.slug)
                          }
                          className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
                        >
                          {isExpanded ? "Hide" : "Show"} Responses
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(guest.slug)}
                        className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Response Summary */}
                  {!hasResponded ? (
                    <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <p className="text-sm text-gray-600">
                        ⏳ No response yet
                      </p>
                    </div>
                  ) : (
                    <div className="mt-3 flex gap-2">
                      {guestResponses.filter((r) => r.willAttend === "yes")
                        .length > 0 && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          {
                            guestResponses.filter((r) => r.willAttend === "yes")
                              .length
                          }{" "}
                          Attending
                        </span>
                      )}
                      {guestResponses.filter((r) => r.willAttend === "no")
                        .length > 0 && (
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                          {
                            guestResponses.filter((r) => r.willAttend === "no")
                              .length
                          }{" "}
                          Not Attending
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Expanded Responses */}
                {isExpanded && hasResponded && (
                  <div className="border-t border-gray-200 bg-gray-50 p-4">
                    <h4 className="font-semibold text-gray-700 mb-3 text-sm">
                      RSVP Responses:
                    </h4>
                    <div className="space-y-2">
                      {guestResponses.map((response, idx) => (
                        <div
                          key={idx}
                          className={`border rounded-lg p-3 ${
                            response.willAttend === "yes"
                              ? "bg-green-50 border-green-200"
                              : "bg-red-50 border-red-200"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-800 text-sm">
                              {response.name}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                response.willAttend === "yes"
                                  ? "bg-green-200 text-green-800"
                                  : "bg-red-200 text-red-800"
                              }`}
                            >
                              {response.willAttend === "yes"
                                ? "✓ Attending"
                                : "✗ Not Attending"}
                            </span>
                          </div>
                          {response.comment && (
                            <p className="text-sm text-gray-600 italic">
                              💬 "{response.comment}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
