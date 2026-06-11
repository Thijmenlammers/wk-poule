import { DataNotice } from "@/components/DataNotice";
import { Leaderboard } from "@/components/Leaderboard";
import { participants } from "@/data/participants";
import { poolMatches } from "@/data/pool-matches";
import { formatLastUpdated } from "@/lib/formatting";
import { getFootballData } from "@/lib/football-api";
import { calculateLeaderboard } from "@/lib/leaderboard";
import { mapPoolMatchesToResults } from "@/lib/match-mapping";

export default async function HomePage() {
  const footballData = await getFootballData();
  const matches = mapPoolMatchesToResults(poolMatches, footballData.matches);
  const leaderboard = calculateLeaderboard(
    participants,
    matches,
    footballData.tournamentWinner,
  );
  const completedMatches = matches.filter(
    (match) => match.result?.status === "finished",
  ).length;
  const liveMatches = matches.filter(
    (match) => match.result?.status === "live",
  ).length;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <section className="mb-7 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[#e1592a]">
            Semplor World Cup Pool 2026
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Leaderboard
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Select a participant to view their 29 predictions.
          </p>
        </div>

        <dl className="flex gap-7 text-sm">
          <div>
            <dt className="text-slate-400">Participants</dt>
            <dd className="mt-1 font-medium text-slate-800">
              {participants.length}
            </dd>
          </div>
          <div>
            <dt className="text-slate-400">Matches</dt>
            <dd className="mt-1 font-medium text-slate-800">
              {completedMatches}/{matches.length} finished
              {liveMatches > 0 ? `, ${liveMatches} live` : ""}
            </dd>
          </div>
          <div className="hidden md:block">
            <dt className="text-slate-400">Updated</dt>
            <dd className="mt-1 font-medium text-slate-800">
              {formatLastUpdated(footballData.lastUpdated)}
            </dd>
          </div>
        </dl>
      </section>

      <div className="mb-5">
        <DataNotice
          warning={footballData.warning}
          source={footballData.source}
        />
      </div>

      <Leaderboard entries={leaderboard} />

      <p className="mt-4 text-xs text-slate-400">
        Scoring: 3 points for an exact score, 1 for the correct outcome, and 10
        for the tournament winner.
      </p>
    </main>
  );
}
