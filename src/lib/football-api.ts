import "server-only";

import { cache } from "react";
import { unstable_cache } from "next/cache";
import {
  fallbackLastUpdated,
  fallbackResults,
  fallbackTournamentWinner,
} from "@/data/fallback-results";
import { poolMatches } from "@/data/pool-matches";
import {
  DEFAULT_FOOTBALL_API_URL,
  DEFAULT_FOOTBALL_COMPETITION_ID,
  getFootballApiConfiguration,
} from "@/lib/football-api-config";
import type {
  FootballDataSnapshot,
  MatchStatus,
  NormalizedMatchResult,
} from "@/types";

export interface FootballDataProvider {
  getMatches(): Promise<NormalizedMatchResult[]>;
  getTournamentWinner(): Promise<string | null>;
}

type ApiEnvelope = {
  data: unknown;
  fetchedAt: string;
};

type FootballDataOrgTeam = {
  name?: string;
  shortName?: string;
};

type FootballDataOrgMatch = {
  id?: string | number;
  utcDate?: string;
  status?: string;
  homeTeam?: FootballDataOrgTeam;
  awayTeam?: FootballDataOrgTeam;
  season?: {
    winner?: FootballDataOrgTeam | null;
  };
  score?: {
    fullTime?: {
      home?: number | null;
      away?: number | null;
    };
  };
};

type FootballDataOrgMatchesResponse = {
  matches?: FootballDataOrgMatch[];
};

async function requestFootballData(
  url: string,
  apiKey: string,
): Promise<ApiEnvelope> {
  const response = await fetch(url, {
    headers: {
      "X-Auth-Token": apiKey,
      Accept: "application/json",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    throw new Error(`Football API request failed with ${response.status}.`);
  }

  return {
    data: (await response.json()) as unknown,
    fetchedAt: new Date().toISOString(),
  };
}

function isPoolMatchDay() {
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Amsterdam",
  }).format(new Date());

  return poolMatches.some((match) => match.date === today);
}

function normalizeStatus(status?: string): MatchStatus {
  switch (status) {
    case "IN_PLAY":
    case "PAUSED":
    case "LIVE":
      return "live";
    case "FINISHED":
      return "finished";
    case "POSTPONED":
    case "SUSPENDED":
      return "postponed";
    case "CANCELLED":
      return "cancelled";
    default:
      return "scheduled";
  }
}

function teamName(team?: FootballDataOrgTeam) {
  return team?.shortName ?? team?.name ?? "";
}

function buildMatchesUrl(apiUrl: string, competitionId: string) {
  return `${apiUrl}/competitions/${encodeURIComponent(competitionId)}/matches`;
}

class FootballDataOrgProvider implements FootballDataProvider {
  lastUpdated: string | null = null;
  private responsePromise: Promise<ApiEnvelope> | null = null;

  constructor(
    private readonly matchesUrl: string,
    private readonly apiKey: string,
  ) {}

  private async getMatchesResponse() {
    this.responsePromise ??= requestFootballData(this.matchesUrl, this.apiKey);
    const response = await this.responsePromise;
    this.lastUpdated = response.fetchedAt;
    return response;
  }

  async getMatches(): Promise<NormalizedMatchResult[]> {
    const response = await this.getMatchesResponse();
    const payload = response.data as FootballDataOrgMatchesResponse;

    if (!Array.isArray(payload.matches)) {
      throw new Error("Football API returned an unexpected matches payload.");
    }

    return payload.matches
      .filter(
        (match) =>
          match.id !== undefined &&
          Boolean(match.utcDate) &&
          Boolean(teamName(match.homeTeam)) &&
          Boolean(teamName(match.awayTeam)),
      )
      .map((match) => ({
        externalMatchId: String(match.id),
        homeTeam: teamName(match.homeTeam),
        awayTeam: teamName(match.awayTeam),
        homeScore: match.score?.fullTime?.home ?? null,
        awayScore: match.score?.fullTime?.away ?? null,
        status: normalizeStatus(match.status),
        kickoffAt: match.utcDate as string,
      }));
  }

  async getTournamentWinner(): Promise<string | null> {
    const response = await this.getMatchesResponse();
    const payload = response.data as FootballDataOrgMatchesResponse;
    const winner = payload.matches?.find((match) => match.season?.winner)
      ?.season?.winner;

    return (
      winner?.shortName ?? winner?.name ?? null
    );
  }
}

async function loadFootballData(): Promise<FootballDataSnapshot> {
  const configuration = getFootballApiConfiguration();

  if (!configuration.apiKey) {
    return {
      matches: fallbackResults,
      tournamentWinner: fallbackTournamentWinner,
      lastUpdated: fallbackLastUpdated,
      source: "fallback",
      warning:
        "Live results are not configured. Add FOOTBALL_API_KEY to the deployment environment.",
    };
  }

  try {
    const provider = new FootballDataOrgProvider(
      buildMatchesUrl(configuration.apiUrl, configuration.competitionId),
      configuration.apiKey,
    );
    const [matches, tournamentWinner] = await Promise.all([
      provider.getMatches(),
      provider.getTournamentWinner(),
    ]);

    return {
      matches,
      tournamentWinner,
      lastUpdated: provider.lastUpdated ?? new Date().toISOString(),
      source: "api",
      warning: null,
    };
  } catch (error) {
    console.error("Unable to load football data:", error);

    return {
      matches: fallbackResults,
      tournamentWinner: fallbackTournamentWinner,
      lastUpdated: fallbackLastUpdated,
      source: "fallback",
      warning:
        "Live results are temporarily unavailable. Showing the latest saved data.",
    };
  }
}

const getLiveFootballData = unstable_cache(
  loadFootballData,
  [
    "football-data-snapshot-live",
    process.env.FOOTBALL_API_URL ?? DEFAULT_FOOTBALL_API_URL,
    process.env.FOOTBALL_COMPETITION_ID ?? DEFAULT_FOOTBALL_COMPETITION_ID,
  ],
  { revalidate: 60 },
);

const getStandardFootballData = unstable_cache(
  loadFootballData,
  [
    "football-data-snapshot-standard",
    process.env.FOOTBALL_API_URL ?? DEFAULT_FOOTBALL_API_URL,
    process.env.FOOTBALL_COMPETITION_ID ?? DEFAULT_FOOTBALL_COMPETITION_ID,
  ],
  { revalidate: 1800 },
);

export const getFootballData = cache(async () =>
  isPoolMatchDay() ? getLiveFootballData() : getStandardFootballData(),
);
