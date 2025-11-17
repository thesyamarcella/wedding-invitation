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
      <div>
        <h3 className="font-[var(--font-header)] text-2xl text-[var(--accent)] mb-2">
          Thank you 💖
        </h3>
        <p className="text-[var(--text)]/85">
          We have received your RSVP. See you soon!
        </p>
      </div>
    );
  }

  return (
    <>
      <h3 className="font-[var(--font-header)] text-3xl text-[var(--accent)] mb-3">
        RSVP 💌
      </h3>

      <form onSubmit={onSubmit} className="flex flex-col gap-3 text-left">
        <div>
          <label className="block text-sm mb-1 text-[var(--text)]/80">
            Name
          </label>
          <input
            className="w-full border border-[var(--accent)]/40 rounded-lg bg-[var(--bg)] px-3 py-2 text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-[var(--text)]/80">
            Will you attend?
          </label>
          <select
            className="w-full border border-[var(--accent)]/40 rounded-lg bg-[var(--bg)] px-3 py-2 text-[var(--text)]"
            value={willAttend}
            onChange={(e) => setWillAttend(e.target.value as "yes" | "no")}
          >
            <option value="yes">Yes, I will attend 💒</option>
            <option value="no">Sorry, I can't attend 😢</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1 text-[var(--text)]/80">
            Message / Wishes
          </label>
          <textarea
            className="w-full border border-[var(--accent)]/40 rounded-lg bg-[var(--bg)] px-3 py-2 text-[var(--text)] min-h-[80px]"
            value={comment}
            placeholder="Write your wishes..."
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="mt-2 w-full bg-[var(--accent)] text-[var(--bg)] py-3 rounded-full font-[var(--font-header)] hover:opacity-90"
        >
          Send RSVP
        </button>
      </form>
    </>
  );
};
