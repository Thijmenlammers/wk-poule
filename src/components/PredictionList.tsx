import { PredictionRow } from "@/components/PredictionRow";
import type { MatchPrediction, PoolMatchWithResult } from "@/types";

type PredictionListProps = {
  matches: PoolMatchWithResult[];
  predictions: MatchPrediction[];
};

export function PredictionList({
  matches,
  predictions,
}: PredictionListProps) {
  const predictionByMatch = new Map(
    predictions.map((prediction) => [prediction.matchId, prediction]),
  );

  return (
    <section aria-labelledby="predictions-title">
      <div className="mb-4 flex min-w-0 items-end justify-between gap-4">
        <h2
          id="predictions-title"
          className="text-xl font-semibold text-slate-900"
        >
          Predictions
        </h2>
        <p className="shrink-0 text-sm text-slate-400">
          {matches.length} matches
        </p>
      </div>

      <div className="min-w-0 overflow-hidden border border-slate-200 bg-white">
        <div className="hidden grid-cols-[100px_minmax(250px,1fr)_110px_150px_130px] border-b border-slate-200 bg-[#f7f8f7] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500 md:grid">
          <span>Date</span>
          <span>Match</span>
          <span>Prediction</span>
          <span>Result</span>
          <span>Points</span>
        </div>

        {matches.map((match) => (
          <PredictionRow
            key={match.id}
            match={match}
            prediction={predictionByMatch.get(match.id)}
          />
        ))}
      </div>
    </section>
  );
}
