import type { FootballDataSnapshot } from "@/types";

export const FOOTBALL_DATA_REVALIDATE_SECONDS = 300;

const NOT_UPDATING_WARNING =
  "Live results are currently not updating. Showing the latest successfully fetched data.";

export function applySnapshotFreshness(
  snapshot: FootballDataSnapshot,
  now = Date.now(),
): FootballDataSnapshot {
  if (!snapshot.lastUpdated) {
    return snapshot;
  }

  const age = now - new Date(snapshot.lastUpdated).getTime();
  const staleAfter = FOOTBALL_DATA_REVALIDATE_SECONDS * 1000;

  if (!Number.isFinite(age) || age <= staleAfter) {
    return snapshot;
  }

  return {
    ...snapshot,
    source: "stale",
    warning: NOT_UPDATING_WARNING,
  };
}

export function createUnavailableSnapshot(
  warning: string,
): FootballDataSnapshot {
  return {
    matches: [],
    tournamentWinner: null,
    lastUpdated: null,
    source: "unavailable",
    warning,
  };
}
