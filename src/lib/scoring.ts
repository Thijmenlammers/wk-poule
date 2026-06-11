import { teamNamesMatch } from "@/lib/team-normalization";

export type MatchScoreResult = {
  points: 0 | 1 | 3;
  category:
    | "exact"
    | "correct-outcome"
    | "incorrect"
    | "pending"
    | "missing";
  explanation: string;
};

function outcome(homeScore: number, awayScore: number) {
  if (homeScore > awayScore) return "home";
  if (homeScore < awayScore) return "away";
  return "draw";
}

export function calculateMatchPoints(
  predictedHome: number | null,
  predictedAway: number | null,
  actualHome: number | null,
  actualAway: number | null,
  matchStatus: string,
): MatchScoreResult {
  if (predictedHome === null || predictedAway === null) {
    return {
      points: 0,
      category: "missing",
      explanation: "0 points · No prediction",
    };
  }

  if (
    matchStatus !== "finished" ||
    actualHome === null ||
    actualAway === null
  ) {
    return {
      points: 0,
      category: "pending",
      explanation: "Pending · Match not finished",
    };
  }

  if (predictedHome === actualHome && predictedAway === actualAway) {
    return {
      points: 3,
      category: "exact",
      explanation: "3 points · Exact score",
    };
  }

  const predictedOutcome = outcome(predictedHome, predictedAway);
  const actualOutcome = outcome(actualHome, actualAway);

  if (predictedOutcome === actualOutcome) {
    const label =
      actualOutcome === "home"
        ? "home win"
        : actualOutcome === "away"
          ? "away win"
          : "draw";

    return {
      points: 1,
      category: "correct-outcome",
      explanation: `1 point · Correct ${label}`,
    };
  }

  return {
    points: 0,
    category: "incorrect",
    explanation: "0 points · Incorrect outcome",
  };
}

export function calculateChampionBonus(
  predictedChampion: string | null,
  actualChampion: string | null,
): {
  points: 0 | 10;
  status: "correct" | "incorrect" | "pending" | "missing";
} {
  if (!predictedChampion) {
    return { points: 0, status: "missing" };
  }

  if (!actualChampion) {
    return { points: 0, status: "pending" };
  }

  if (teamNamesMatch(predictedChampion, actualChampion)) {
    return { points: 10, status: "correct" };
  }

  return { points: 0, status: "incorrect" };
}
