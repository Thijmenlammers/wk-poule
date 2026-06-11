export const DEFAULT_FOOTBALL_API_URL =
  "https://api.football-data.org/v4";
export const DEFAULT_FOOTBALL_COMPETITION_ID = "WC";

type FootballApiEnvironment = {
  FOOTBALL_API_URL?: string;
  FOOTBALL_API_KEY?: string;
  FOOTBALL_COMPETITION_ID?: string;
};

export function getFootballApiConfiguration(
  environment: FootballApiEnvironment = process.env as FootballApiEnvironment,
) {
  const apiUrl =
    environment.FOOTBALL_API_URL?.trim().replace(/\/$/, "") ||
    DEFAULT_FOOTBALL_API_URL;
  const competitionId =
    environment.FOOTBALL_COMPETITION_ID?.trim() ||
    DEFAULT_FOOTBALL_COMPETITION_ID;
  const apiKey = environment.FOOTBALL_API_KEY?.trim() || null;

  return {
    apiUrl,
    apiKey,
    competitionId,
  };
}
