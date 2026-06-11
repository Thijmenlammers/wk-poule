import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { LeaderboardEntry } from "@/types";

type LeaderboardCardProps = {
  entry: LeaderboardEntry;
};

export function LeaderboardCard({ entry }: LeaderboardCardProps) {
  return (
    <Link
      href={`/participants/${entry.participant.id}`}
      className={`block px-4 py-4 transition hover:bg-[#f7faf8] ${
        entry.position === 1 ? "border-l-2 border-l-[#305459]" : ""
      }`}
    >
      <div className="grid grid-cols-[28px_minmax(0,1fr)_auto_16px] items-center gap-3">
        <span className="w-7 shrink-0 text-sm font-semibold text-slate-500">
          {entry.position}
        </span>
        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-900">
            {entry.participant.name}
          </p>
          <p className="truncate text-xs text-slate-400">
            Winner:{" "}
            {entry.participant.predictedChampion ?? "No champion prediction"}
          </p>
        </div>
        <p className="score-font text-xl font-semibold text-[#305459]">
          {entry.totalPoints}
        </p>
        <ChevronRight className="h-4 w-4 text-slate-300" />
      </div>
      <p className="ml-10 mt-2 text-xs text-slate-400">
        {entry.exactScores} exact · {entry.correctOutcomes} correct outcomes ·{" "}
        {entry.matchPoints} match points
      </p>
    </Link>
  );
}
