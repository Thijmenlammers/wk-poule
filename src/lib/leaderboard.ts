import type {
  LeaderboardEntry,
  Participant,
  PoolMatchWithResult,
} from "@/types";
import {
  calculateChampionBonus,
  calculateMatchPoints,
} from "@/lib/scoring";

export function calculateLeaderboard(
  participants: Participant[],
  matches: PoolMatchWithResult[],
  actualChampion: string | null,
): LeaderboardEntry[] {
  const entries = participants.map((participant) => {
    const predictions = new Map(
      participant.predictions.map((prediction) => [
        prediction.matchId,
        prediction,
      ]),
    );

    let matchPoints = 0;
    let exactScores = 0;
    let correctOutcomes = 0;
    let incorrectPredictions = 0;
    let pendingMatches = 0;
    let missingPredictions = 0;

    for (const match of matches) {
      const prediction = predictions.get(match.id);
      const score = calculateMatchPoints(
        prediction?.predictedHomeScore ?? null,
        prediction?.predictedAwayScore ?? null,
        match.result?.homeScore ?? null,
        match.result?.awayScore ?? null,
        match.result?.status ?? "scheduled",
      );

      matchPoints += score.points;

      if (score.category === "exact") exactScores += 1;
      if (score.category === "correct-outcome") correctOutcomes += 1;
      if (score.category === "incorrect") incorrectPredictions += 1;
      if (score.category === "pending") pendingMatches += 1;
      if (score.category === "missing") missingPredictions += 1;
    }

    const championBonus = calculateChampionBonus(
      participant.predictedChampion,
      actualChampion,
    ).points;

    return {
      participant,
      position: 0,
      matchPoints,
      championBonus,
      totalPoints: matchPoints + championBonus,
      exactScores,
      correctOutcomes,
      incorrectPredictions,
      pendingMatches,
      missingPredictions,
    };
  });

  entries.sort(
    (first, second) =>
      second.totalPoints - first.totalPoints ||
      second.exactScores - first.exactScores ||
      second.correctOutcomes - first.correctOutcomes ||
      first.participant.name.localeCompare(second.participant.name),
  );

  return entries.map((entry, index) => ({
    ...entry,
    position: index + 1,
  }));
}
