import type { LeaderboardEntry } from "@/types";

type ParticipantSummaryProps = {
  entry: LeaderboardEntry;
};

export function ParticipantSummary({ entry }: ParticipantSummaryProps) {
  const stats = [
    { label: "Match points", value: entry.matchPoints },
    { label: "Winner bonus", value: entry.championBonus },
    { label: "Exact scores", value: entry.exactScores },
    { label: "Correct outcomes", value: entry.correctOutcomes },
  ];

  return (
    <section>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-6 border-b border-slate-200 pb-7">
        <div className="min-w-0">
          <p className="text-sm text-slate-500">Rank {entry.position}</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {entry.participant.name}
          </h1>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-slate-400">
            Total points
          </p>
          <p className="score-font mt-1 text-4xl font-semibold text-[#305459]">
            {entry.totalPoints}
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-2 border-b border-slate-200 sm:grid-cols-4">
        {stats.map(({ label, value }) => (
          <div
            key={label}
            className="py-4 sm:border-r sm:border-slate-200 sm:px-4 sm:first:pl-0 sm:last:border-r-0"
          >
            <dt className="text-xs text-slate-400">{label}</dt>
            <dd className="score-font mt-1 text-lg font-medium text-slate-800">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
