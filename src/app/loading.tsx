export default function Loading() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="h-8 w-48 animate-pulse bg-slate-200" />
      <div className="mt-3 h-4 w-72 animate-pulse bg-slate-200" />
      <div className="mt-8 overflow-hidden border border-slate-200 bg-white">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-16 animate-pulse border-b border-slate-100 last:border-b-0"
          />
        ))}
      </div>
    </main>
  );
}
