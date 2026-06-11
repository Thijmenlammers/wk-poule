import { calculateChampionBonus } from "@/lib/scoring";
import { TeamFlag } from "@/components/TeamFlag";

type ChampionPredictionCardProps = {
  predictedChampion: string | null;
  actualChampion: string | null;
};

export function ChampionPredictionCard({
  predictedChampion,
  actualChampion,
}: ChampionPredictionCardProps) {
  const bonus = calculateChampionBonus(predictedChampion, actualChampion);
  const statusText = {
    correct: "Champion confirmed",
    incorrect: `Actual champion: ${actualChampion}`,
    pending: "Bonus pending until the winner is known",
    missing: "No champion selected",
  }[bonus.status];

  return (
    <section className="flex items-center gap-4 border border-slate-200 bg-white px-4 py-4 sm:px-5">
      <TeamFlag team={predictedChampion} className="text-2xl" />
      <div className="min-w-0">
        <p className="text-xs text-slate-400">Predicted winner</p>
        <h2 className="mt-0.5 font-semibold text-slate-900">
          {predictedChampion ?? "No prediction"}
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">{statusText}</p>
      </div>
      <span className="score-font ml-auto shrink-0 text-sm font-medium text-[#305459]">
        +{bonus.points} pts
      </span>
    </section>
  );
}
