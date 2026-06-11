type ScoreDisplayProps = {
  homeScore: number | null;
  awayScore: number | null;
  compact?: boolean;
};

export function ScoreDisplay({
  homeScore,
  awayScore,
  compact = false,
}: ScoreDisplayProps) {
  return (
    <span
      className={`score-font inline-flex items-center gap-1.5 font-medium text-slate-900 ${
        compact ? "text-base" : "text-xl"
      }`}
    >
      <span>{homeScore ?? "-"}</span>
      <span className="text-slate-300">-</span>
      <span>{awayScore ?? "-"}</span>
    </span>
  );
}
