import { describe, expect, it } from "vitest";
import { poolMatches } from "@/data/pool-matches";
import { mapPoolMatchesToResults } from "@/lib/match-mapping";
import type { NormalizedMatchResult, PoolMatch } from "@/types";

describe("mapPoolMatchesToResults", () => {
  it("prefers a stable external ID when the fixture date differs", () => {
    const poolMatch: PoolMatch = {
      id: "south-korea-czechia",
      externalMatchId: "537328",
      date: "2026-06-11",
      homeTeam: "South Korea",
      awayTeam: "Czechia",
      homeDistributor: null,
      awayDistributor: null,
    };
    const apiMatch: NormalizedMatchResult = {
      externalMatchId: "537328",
      homeTeam: "Korea Republic",
      awayTeam: "Czechia",
      homeScore: null,
      awayScore: null,
      status: "scheduled",
      kickoffAt: "2026-06-12T19:00:00Z",
    };

    expect(mapPoolMatchesToResults([poolMatch], [apiMatch])[0].result).toEqual(
      apiMatch,
    );
  });

  it("has a unique external ID for every selected match", () => {
    const externalIds = poolMatches.map((match) => match.externalMatchId);

    expect(externalIds).not.toContain(null);
    expect(new Set(externalIds).size).toBe(poolMatches.length);
  });
});
