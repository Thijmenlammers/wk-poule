import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-5xl items-center px-4 py-16 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm font-medium text-[#e1592a]">404</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">
          Participant not found
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          This person is not part of the current pool.
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex border border-[#305459] px-4 py-2 text-sm font-medium text-[#305459]"
        >
          Back to leaderboard
        </Link>
      </div>
    </main>
  );
}
