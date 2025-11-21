"use client";

type Props = {
  name: string;
  setName: (name: string) => void;
  willAttend: "yes" | "no";
  setWillAttend: (attend: "yes" | "no") => void;
  comment: string;
  setComment: (comment: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  sent: boolean;
};

export const RsvpForm = ({
  name,
  setName,
  willAttend,
  setWillAttend,
  comment,
  setComment,
  onSubmit,
  sent,
}: Props) => {
  if (sent) {
    return (
      <div className="text-center">
        <h3 className="font-[var(--font-header)] text-2xl text-[var(--accent)] mb-2">
          Thank you 💖
        </h3>
        <p className="text-[var(--text)]/85">
          We have received your RSVP. See you soon!
        </p>
      </div>
    );
  }

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    onSubmit(e as any);
  };

  return (
    <>
      <h3 className="font-[var(--font-header)] text-3xl text-[var(--accent)] mb-3 text-center">
        RSVP 💌
      </h3>

      <div className="flex flex-col gap-4 text-left">
        {/* Editable Name Field */}
        <div>
          <label className="block text-sm mb-1 text-[var(--text)]/75">
            Your Name
          </label>
          <input
            className="
              w-full border border-[var(--accent)]/30 
              rounded-lg 
              bg-[color-mix(in_srgb,var(--bg)_90%,white)]
              px-3 py-2 
              text-[var(--text)] 
              focus:border-[var(--accent)]
              focus:ring-2 focus:ring-[var(--accent)]/20
              focus:outline-none
            "
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
          <p className="text-xs text-[var(--text)]/50 mt-1">
            you can submit your own RSVP with your name
          </p>
        </div>

        {/* Will Attend */}
        <div>
          <label className="block text-sm mb-2 text-[var(--text)]/75">
            Will you attend?
          </label>

          <div className="flex gap-3">
            {/* YES */}
            <button
              type="button"
              onClick={() => setWillAttend("yes")}
              className={`
                flex-1 py-3 rounded-lg font-[var(--font-header)] border transition
                ${
                  willAttend === "yes"
                    ? "bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)] shadow-[0_0_10px_rgba(120,136,113,0.25)]"
                    : "bg-[color-mix(in_srgb,var(--bg)_95%,white)] text-[var(--text)] border-[var(--accent)]/30"
                }
              `}
            >
              Yes ☻
            </button>

            {/* NO */}
            <button
              type="button"
              onClick={() => setWillAttend("no")}
              className={`
                flex-1 py-3 rounded-lg font-[var(--font-header)] border transition
                ${
                  willAttend === "no"
                    ? "bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)] shadow-[0_0_10px_rgba(120,136,113,0.25)]"
                    : "bg-[color-mix(in_srgb,var(--bg)_95%,white)] text-[var(--text)] border-[var(--accent)]/30"
                }
              `}
            >
              No ☹
            </button>
          </div>
        </div>

        {/* Wishes */}
        <div>
          <label className="block text-sm mb-1 text-[var(--text)]/75">
            Message / Wishes
          </label>
          <textarea
            className="
              w-full border border-[var(--accent)]/30 rounded-lg
              bg-[color-mix(in_srgb,var(--bg)_90%,white)]
              px-3 py-2 text-[var(--text)]
              min-h-[80px]
              focus:border-[var(--accent)]
              focus:ring-2 focus:ring-[var(--accent)]/20
              focus:outline-none
            "
            value={comment}
            placeholder="Write your wishes..."
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="
            mt-2 w-full 
            bg-[var(--accent)] 
            text-[var(--bg)] 
            py-3 rounded-full 
            font-[var(--font-header)] 
            shadow-[0_0_12px_rgba(120,136,113,0.25)]
            hover:opacity-90
            transition
          "
        >
          Send RSVP
        </button>
      </div>
    </>
  );
};
