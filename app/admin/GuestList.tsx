"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  setDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

function slugify(v: string) {
  return v.trim().toLowerCase().replace(/\s+/g, "-");
}

export default function GuestList() {
  const [guests, setGuests] = useState<any[]>([]);
  const [newName, setNewName] = useState("");
  const [isFamily, setIsFamily] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "guests"), (snap) => {
      const list = snap.docs.map((d) => ({
        id: d.id, // slug
        ...d.data(),
      }));
      setGuests(list);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handleAdd = async () => {
    if (!newName.trim()) return;

    const slug = slugify(newName);

    // SAVE DOCUMENT WITH ID = SLUG (IMPORTANT)
    await setDoc(doc(db, "guests", slug), {
      name: newName,
      slug,
      isFamily,
      createdAt: new Date(),
    });

    setNewName("");
    setIsFamily(false);
  };

  const handleDelete = async (slug: string) => {
    await deleteDoc(doc(db, "guests", slug));
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-8">
      <h2 className="text-xl font-semibold text-purple-600 mb-4">
        📋 Guest List
      </h2>

      {/* Add Guest */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Guest name (Ex: John Doe / Keluarga Yusuf)"
          className="flex-1 px-4 py-2 border rounded-lg"
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isFamily}
            onChange={(e) => setIsFamily(e.target.checked)}
          />
          <span>+ Family</span>
        </label>

        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg"
        >
          Add
        </button>
      </div>

      {/* Guest List Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-purple-50 border-b">
              <th className="p-2">Name</th>
              <th className="p-2">Slug</th>
              <th className="p-2">Family?</th>
              <th className="p-2">Invite Link</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {guests.map((g) => (
              <tr key={g.id} className="border-b">
                <td className="p-2">{g.name}</td>
                <td className="p-2">{g.slug}</td>
                <td className="p-2">{g.isFamily ? "👨‍👩‍👧 Family" : "Single"}</td>
                <td className="p-2">
                  <a
                    className="text-blue-600 underline"
                    href={`/invite/${g.slug}`}
                    target="_blank"
                  >
                    /invite/{g.slug}
                  </a>
                </td>
                <td className="p-2">
                  <button
                    onClick={() => handleDelete(g.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
