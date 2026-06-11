"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-5xl items-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="border-l-2 border-[#e1592a] pl-5">
        <h1 className="text-2xl font-semibold text-slate-900">
          The leaderboard could not be loaded.
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Try the request again. Saved results remain available as a fallback.
        </p>
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="mt-5 border border-[#305459] px-4 py-2 text-sm font-medium text-[#305459] transition hover:bg-[#305459] hover:text-white"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
