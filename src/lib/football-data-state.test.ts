import { describe, expect, it } from "vitest";
import {
  applySnapshotFreshness,
  createUnavailableSnapshot,
  FOOTBALL_DATA_REVALIDATE_SECONDS,
} from "@/lib/football-data-state";
import type { FootballDataSnapshot } from "@/types";

const fetchedAt = "2026-06-12T12:00:00.000Z";

const snapshot: FootballDataSnapshot = {
  matches: [
    {
      externalMatchId: "123",
      homeTeam: "Mexico",
      awayTeam: "South Africa",
      homeScore: 2,
      awayScore: 0,
      status: "finished",
      kickoffAt: "2026-06-11T19:00:00.000Z",
    },
  ],
  tournamentWinner: null,
  lastUpdated: fetchedAt,
  source: "api",
  warning: null,
};

describe("football data state", () => {
  it("keeps a recently fetched snapshot live", () => {
    const now =
      new Date(fetchedAt).getTime() +
      (FOOTBALL_DATA_REVALIDATE_SECONDS - 1) * 1000;

    expect(applySnapshotFreshness(snapshot, now)).toEqual(snapshot);
  });

  it("marks old data stale without changing its results", () => {
    const now =
      new Date(fetchedAt).getTime() +
      (FOOTBALL_DATA_REVALIDATE_SECONDS + 1) * 1000;
    const staleSnapshot = applySnapshotFreshness(snapshot, now);

    expect(staleSnapshot.source).toBe("stale");
    expect(staleSnapshot.warning).toContain("currently not updating");
    expect(staleSnapshot.matches).toEqual(snapshot.matches);
    expect(staleSnapshot.lastUpdated).toBe(snapshot.lastUpdated);
  });

  it("never invents results when no saved API response exists", () => {
    const unavailable = createUnavailableSnapshot(
      "Live results are unavailable.",
    );

    expect(unavailable.matches).toEqual([]);
    expect(unavailable.tournamentWinner).toBeNull();
    expect(unavailable.lastUpdated).toBeNull();
    expect(unavailable.source).toBe("unavailable");
  });
});
