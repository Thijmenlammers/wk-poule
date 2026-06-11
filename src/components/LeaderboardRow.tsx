import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { LeaderboardEntry } from "@/types";

type LeaderboardRowProps = {
  entry: LeaderboardEntry;
};

export function LeaderboardRow({ entry }: LeaderboardRowProps) {
  return (
    <Link
      href={`/participants/${entry.participant.id}`}
      className={`group grid grid-cols-[64px_minmax(210px,1fr)_repeat(5,minmax(78px,0.55fr))_36px] items-center border-b border-slate-100 px-5 py-4 transition last:border-b-0 hover:bg-[#f7faf8] ${
        entry.position === 1 ? "border-l-2 border-l-[#305459]" : ""
      }`}
    >
      <span className="text-sm font-semibold text-slate-500">
        {entry.position}
      </span>
      <div>
        <p className="font-semibold text-slate-900">{entry.participant.name}</p>
        <p className="mt-0.5 text-xs text-slate-400">
          Winner: {entry.participant.predictedChampion ?? "No prediction"}
        </p>
      </div>
      <p className="text-center text-sm text-slate-600">
        {entry.exactScores}
      </p>
      <p className="text-center text-sm text-slate-600">
        {entry.correctOutcomes}
      </p>
      <p className="text-center text-sm text-slate-600">{entry.matchPoints}</p>
      <p className="text-center text-sm text-slate-600">
        {entry.championBonus}
      </p>
      <p className="score-font text-right text-lg font-semibold text-[#305459]">
        {entry.totalPoints}
      </p>
      <ChevronRight className="ml-auto h-4 w-4 text-slate-300 transition group-hover:text-[#e1592a]" />
    </Link>
  );
}
