export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center text-center bg-[var(--bg)]">
      <div>
        <h1 className="text-5xl font-[var(--font-script)] text-[var(--accent)]">
          Guest Not Found
        </h1>
        <p className="mt-4 text-[var(--text)]/70">
          Sorry, this invitation link is not registered.
        </p>
      </div>
    </main>
  );
}
