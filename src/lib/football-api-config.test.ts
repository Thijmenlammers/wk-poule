import { describe, expect, it } from "vitest";
import {
  DEFAULT_FOOTBALL_API_URL,
  DEFAULT_FOOTBALL_COMPETITION_ID,
  getFootballApiConfiguration,
} from "@/lib/football-api-config";

describe("getFootballApiConfiguration", () => {
  it("only requires the deployment secret", () => {
    expect(
      getFootballApiConfiguration({
        FOOTBALL_API_KEY: "secret",
      }),
    ).toEqual({
      apiUrl: DEFAULT_FOOTBALL_API_URL,
      apiKey: "secret",
      competitionId: DEFAULT_FOOTBALL_COMPETITION_ID,
    });
  });

  it("treats a blank API key as missing", () => {
    expect(
      getFootballApiConfiguration({
        FOOTBALL_API_KEY: "  ",
      }).apiKey,
    ).toBeNull();
  });

  it("accepts optional endpoint and competition overrides", () => {
    expect(
      getFootballApiConfiguration({
        FOOTBALL_API_URL: "https://example.com/v4/",
        FOOTBALL_API_KEY: " secret ",
        FOOTBALL_COMPETITION_ID: " TEST ",
      }),
    ).toEqual({
      apiUrl: "https://example.com/v4",
      apiKey: "secret",
      competitionId: "TEST",
    });
  });
});
