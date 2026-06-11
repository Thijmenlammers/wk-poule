import type {
  NormalizedMatchResult,
  PoolMatch,
  PoolMatchWithResult,
} from "@/types";
import { teamNamesMatch } from "@/lib/team-normalization";

export function mapPoolMatchesToResults(
  matches: readonly PoolMatch[],
  results: NormalizedMatchResult[],
): PoolMatchWithResult[] {
  return matches.map((match) => {
    const idMatch = match.externalMatchId
      ? results.find(
          (result) => result.externalMatchId === match.externalMatchId,
        )
      : null;

    const fallbackMatch =
      idMatch ??
      results.find(
        (result) =>
          result.kickoffAt.slice(0, 10) === match.date &&
          teamNamesMatch(result.homeTeam, match.homeTeam) &&
          teamNamesMatch(result.awayTeam, match.awayTeam),
      ) ??
      null;

    return { ...match, result: fallbackMatch };
  });
}
