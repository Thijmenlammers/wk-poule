import { poolMatches } from "@/data/pool-matches";
import type { MatchStatus, NormalizedMatchResult } from "@/types";

type FallbackState = {
  homeScore: number | null;
  awayScore: number | null;
  status: MatchStatus;
  kickoffTime: string;
};

const fallbackStates: FallbackState[] = [
  { homeScore: 2, awayScore: 0, status: "finished", kickoffTime: "19:00:00Z" },
  { homeScore: 1, awayScore: 1, status: "finished", kickoffTime: "22:00:00Z" },
  { homeScore: 1, awayScore: 2, status: "finished", kickoffTime: "19:00:00Z" },
  { homeScore: 2, awayScore: 1, status: "finished", kickoffTime: "22:00:00Z" },
  { homeScore: 3, awayScore: 0, status: "finished", kickoffTime: "16:00:00Z" },
  { homeScore: 2, awayScore: 0, status: "finished", kickoffTime: "22:00:00Z" },
  { homeScore: 1, awayScore: 1, status: "finished", kickoffTime: "19:00:00Z" },
  { homeScore: 3, awayScore: 1, status: "finished", kickoffTime: "16:00:00Z" },
  { homeScore: 0, awayScore: 2, status: "finished", kickoffTime: "19:00:00Z" },
  { homeScore: 2, awayScore: 2, status: "finished", kickoffTime: "22:00:00Z" },
  { homeScore: 1, awayScore: 0, status: "live", kickoffTime: "19:00:00Z" },
  { homeScore: null, awayScore: null, status: "scheduled", kickoffTime: "22:00:00Z" },
  { homeScore: null, awayScore: null, status: "scheduled", kickoffTime: "19:00:00Z" },
  { homeScore: null, awayScore: null, status: "scheduled", kickoffTime: "22:00:00Z" },
  { homeScore: null, awayScore: null, status: "scheduled", kickoffTime: "16:00:00Z" },
  { homeScore: null, awayScore: null, status: "scheduled", kickoffTime: "22:00:00Z" },
  { homeScore: null, awayScore: null, status: "scheduled", kickoffTime: "19:00:00Z" },
  { homeScore: null, awayScore: null, status: "scheduled", kickoffTime: "16:00:00Z" },
  { homeScore: null, awayScore: null, status: "scheduled", kickoffTime: "19:00:00Z" },
  { homeScore: null, awayScore: null, status: "scheduled", kickoffTime: "22:00:00Z" },
  { homeScore: null, awayScore: null, status: "scheduled", kickoffTime: "16:00:00Z" },
  { homeScore: null, awayScore: null, status: "scheduled", kickoffTime: "22:00:00Z" },
  { homeScore: null, awayScore: null, status: "scheduled", kickoffTime: "19:00:00Z" },
  { homeScore: null, awayScore: null, status: "scheduled", kickoffTime: "22:00:00Z" },
  { homeScore: null, awayScore: null, status: "scheduled", kickoffTime: "16:00:00Z" },
  { homeScore: null, awayScore: null, status: "scheduled", kickoffTime: "19:00:00Z" },
  { homeScore: null, awayScore: null, status: "scheduled", kickoffTime: "22:00:00Z" },
  { homeScore: null, awayScore: null, status: "scheduled", kickoffTime: "19:00:00Z" },
  { homeScore: null, awayScore: null, status: "scheduled", kickoffTime: "22:00:00Z" },
];

if (fallbackStates.length !== poolMatches.length) {
  throw new Error("Fallback result data must cover every pool match.");
}

export const fallbackResults: NormalizedMatchResult[] = poolMatches.map(
  (match, index) => ({
    externalMatchId: `demo-${String(index + 1).padStart(3, "0")}`,
    homeTeam: match.homeTeam,
    awayTeam: match.awayTeam,
    homeScore: fallbackStates[index].homeScore,
    awayScore: fallbackStates[index].awayScore,
    status: fallbackStates[index].status,
    kickoffAt: `${match.date}T${fallbackStates[index].kickoffTime}`,
  }),
);

export const fallbackTournamentWinner: string | null = null;
export const fallbackLastUpdated = "2026-06-18T19:42:00Z";
