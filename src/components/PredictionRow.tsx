import { MatchStatusBadge } from "@/components/MatchStatusBadge";
import { ScoreDisplay } from "@/components/ScoreDisplay";
import { TeamFlag } from "@/components/TeamFlag";
import { formatKickoffTime, formatMatchDate } from "@/lib/formatting";
import { calculateMatchPoints } from "@/lib/scoring";
import type { MatchPrediction, PoolMatchWithResult } from "@/types";

type PredictionRowProps = {
  match: PoolMatchWithResult;
  prediction?: MatchPrediction;
};

const categoryLabels = {
  exact: "Exact score",
  "correct-outcome": "Correct outcome",
  incorrect: "Incorrect",
  pending: "Not played",
  missing: "No prediction",
};

const categoryStyles = {
  exact: "text-emerald-700",
  "correct-outcome": "text-[#305459]",
  incorrect: "text-rose-600",
  pending: "text-slate-400",
  missing: "text-amber-700",
};

function TeamLine({
  team,
  distributor,
}: {
  team: string;
  distributor: string | null;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <TeamFlag team={team} className="text-sm" />
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-slate-800">
          {team}
        </span>
        {distributor && (
          <span className="block truncate text-[11px] text-slate-400">
            {distributor}
          </span>
        )}
      </span>
    </div>
  );
}

export function PredictionRow({ match, prediction }: PredictionRowProps) {
  const status = match.result?.status ?? "scheduled";
  const points = calculateMatchPoints(
    prediction?.predictedHomeScore ?? null,
    prediction?.predictedAwayScore ?? null,
    match.result?.homeScore ?? null,
    match.result?.awayScore ?? null,
    status,
  );
  const hasPrediction =
    prediction?.predictedHomeScore !== null &&
    prediction?.predictedHomeScore !== undefined &&
    prediction?.predictedAwayScore !== null &&
    prediction?.predictedAwayScore !== undefined;
  const hasScore =
    match.result?.homeScore !== null &&
    match.result?.homeScore !== undefined &&
    match.result?.awayScore !== null &&
    match.result?.awayScore !== undefined;
  const kickoffAt =
    match.result?.kickoffAt ?? `${match.date}T12:00:00Z`;

  return (
    <article className="grid min-w-0 grid-cols-3 gap-4 border-b border-slate-100 px-4 py-4 last:border-b-0 md:grid-cols-[100px_minmax(250px,1fr)_110px_150px_130px] md:items-center">
      <div className="col-span-3 flex items-center justify-between gap-3 md:col-span-1 md:block">
        <p className="text-sm text-slate-600">
          {formatMatchDate(kickoffAt, {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: undefined,
          })}
        </p>
        <div className="mt-1 md:block">
          <MatchStatusBadge status={status} />
        </div>
      </div>

      <div className="col-span-3 space-y-2 md:col-span-1">
        <TeamLine
          team={match.homeTeam}
          distributor={match.homeDistributor}
        />
        <TeamLine
          team={match.awayTeam}
          distributor={match.awayDistributor}
        />
      </div>

      <div>
        <p className="mb-1 text-[11px] text-slate-400 md:hidden">Prediction</p>
        {hasPrediction ? (
          <ScoreDisplay
            homeScore={prediction.predictedHomeScore}
            awayScore={prediction.predictedAwayScore}
            compact
          />
        ) : (
          <span className="text-sm text-amber-700">No prediction</span>
        )}
      </div>

      <div>
        <p className="mb-1 text-[11px] text-slate-400 md:hidden">Result</p>
        {hasScore ? (
          <ScoreDisplay
            homeScore={match.result?.homeScore ?? null}
            awayScore={match.result?.awayScore ?? null}
            compact
          />
        ) : (
          <span className="text-sm text-slate-500">
            {formatKickoffTime(kickoffAt)}
          </span>
        )}
      </div>

      <div className={categoryStyles[points.category]}>
        <p className="score-font text-sm font-medium">
          {points.category === "pending" ? "Pending" : `${points.points} pts`}
        </p>
        <p className="mt-0.5 text-xs">{categoryLabels[points.category]}</p>
      </div>
    </article>
  );
}
