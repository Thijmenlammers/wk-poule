import type { LeaderboardEntry } from "@/types";
import { LeaderboardCard } from "@/components/LeaderboardCard";
import { LeaderboardRow } from "@/components/LeaderboardRow";

type LeaderboardProps = {
  entries: LeaderboardEntry[];
};

export function Leaderboard({ entries }: LeaderboardProps) {
  return (
    <section
      aria-labelledby="leaderboard-title"
      className="overflow-hidden border border-slate-200 bg-white"
    >
      <h2 id="leaderboard-title" className="sr-only">
        Leaderboard
      </h2>
      <div className="hidden lg:block">
        <div className="grid grid-cols-[64px_minmax(210px,1fr)_repeat(5,minmax(78px,0.55fr))_36px] border-b border-slate-200 bg-[#f7f8f7] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
          <span>Rank</span>
          <span>Participant</span>
          <span className="text-center">Exact</span>
          <span className="text-center">Correct</span>
          <span className="text-center">Match pts</span>
          <span className="text-center">Bonus</span>
          <span className="text-right">Points</span>
          <span />
        </div>
        <div>
          {entries.map((entry) => (
            <LeaderboardRow key={entry.participant.id} entry={entry} />
          ))}
        </div>
      </div>

      <div className="divide-y divide-slate-200 lg:hidden">
        {entries.map((entry) => (
          <LeaderboardCard key={entry.participant.id} entry={entry} />
        ))}
      </div>
    </section>
  );
}
