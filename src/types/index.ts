export type MatchStatus =
  | "scheduled"
  | "live"
  | "finished"
  | "postponed"
  | "cancelled";

export interface PoolMatch {
  id: string;
  externalMatchId: string | null;
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeDistributor: string | null;
  awayDistributor: string | null;
}

export interface MatchPrediction {
  matchId: string;
  predictedHomeScore: number | null;
  predictedAwayScore: number | null;
}

export interface Participant {
  id: string;
  name: string;
  predictedChampion: string | null;
  predictions: MatchPrediction[];
}

export interface NormalizedMatchResult {
  externalMatchId: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  status: MatchStatus;
  kickoffAt: string;
}

export interface PoolMatchWithResult extends PoolMatch {
  result: NormalizedMatchResult | null;
}

export interface FootballDataSnapshot {
  matches: NormalizedMatchResult[];
  tournamentWinner: string | null;
  lastUpdated: string;
  source: "api" | "fallback";
  warning: string | null;
}

export interface LeaderboardEntry {
  participant: Participant;
  position: number;
  matchPoints: number;
  championBonus: 0 | 10;
  totalPoints: number;
  exactScores: number;
  correctOutcomes: number;
  incorrectPredictions: number;
  pendingMatches: number;
  missingPredictions: number;
}
