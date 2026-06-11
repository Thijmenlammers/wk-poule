import "server-only";

import { cache } from "react";
import { unstable_cache } from "next/cache";
import {
  fallbackLastUpdated,
  fallbackResults,
  fallbackTournamentWinner,
} from "@/data/fallback-results";
import { poolMatches } from "@/data/pool-matches";
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

async function requestFootballData(url: string): Promise<ApiEnvelope> {
  const apiKey = process.env.FOOTBALL_API_KEY;
  if (!apiKey) {
    throw new Error("FOOTBALL_API_KEY is not configured.");
  }

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

function buildMatchesUrl() {
  const apiUrl = process.env.FOOTBALL_API_URL?.replace(/\/$/, "");
  const competitionId = process.env.FOOTBALL_COMPETITION_ID;

  if (!apiUrl || !competitionId) {
    throw new Error("Football API URL and competition ID are not configured.");
  }

  return `${apiUrl}/competitions/${encodeURIComponent(competitionId)}/matches`;
}

class FootballDataOrgProvider implements FootballDataProvider {
  lastUpdated: string | null = null;
  private responsePromise: Promise<ApiEnvelope> | null = null;

  private async getMatchesResponse() {
    this.responsePromise ??= requestFootballData(buildMatchesUrl());
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

function hasApiConfiguration() {
  return Boolean(
    process.env.FOOTBALL_API_URL &&
      process.env.FOOTBALL_API_KEY &&
      process.env.FOOTBALL_COMPETITION_ID,
  );
}

async function loadFootballData(): Promise<FootballDataSnapshot> {
  if (!hasApiConfiguration()) {
    return {
      matches: fallbackResults,
      tournamentWinner: fallbackTournamentWinner,
      lastUpdated: fallbackLastUpdated,
      source: "fallback",
      warning: null,
    };
  }

  try {
    const provider = new FootballDataOrgProvider();
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
    process.env.FOOTBALL_API_URL ?? "fallback",
    process.env.FOOTBALL_COMPETITION_ID ?? "none",
  ],
  { revalidate: 60 },
);

const getStandardFootballData = unstable_cache(
  loadFootballData,
  [
    "football-data-snapshot-standard",
    process.env.FOOTBALL_API_URL ?? "fallback",
    process.env.FOOTBALL_COMPETITION_ID ?? "none",
  ],
  { revalidate: 1800 },
);

export const getFootballData = cache(async () =>
  isPoolMatchDay() ? getLiveFootballData() : getStandardFootballData(),
);
