# Semplor World Cup Pool

Read-only Next.js application for the internal Semplor World Cup 2026 prediction competition. The homepage is a focused leaderboard. Selecting a participant opens their 29 match predictions and points breakdown.

## Run locally

Requirements: Node.js 20 or newer and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful checks:

```bash
npm test
npm run lint
npm run build
```

Without API credentials the application intentionally uses the bundled demo results.

## Prediction data

All manually entered participant data lives in:

```text
src/data/participants.ts
```

The file contains the 16 participants digitized from
`WK2026_predictions_digitized.xlsx`. Each participant has:

```ts
{
  id: "unique-stable-id",
  name: "First name",
  predictedChampion: "Spain",
  predictions: [
    {
      matchId: "mexico-south-africa",
      predictedHomeScore: 2,
      predictedAwayScore: 0,
    },
  ],
}
```

Each imported participant has all 29 predictions and a tournament winner pick.
The workbook's reviewed score interpretations are preserved exactly. Names that
the source marks as uncertain are also kept as digitized, including the question
mark in `Eric Toerina?`.

For future incomplete forms, set an unreadable score to `null` or omit the
prediction. Set `predictedChampion` to `null` when no champion was selected.
Missing data displays as `No prediction` and always earns 0 points.

The selected fixtures and distributor references live in:

```text
src/data/pool-matches.ts
```

## Football API

The server-side provider in `src/lib/football-api.ts` targets [football-data.org API v4](https://www.football-data.org/documentation/quickstart). Create `.env.local`:

```env
FOOTBALL_API_URL=https://api.football-data.org/v4
FOOTBALL_API_KEY=your_server_only_token
FOOTBALL_COMPETITION_ID=WC
```

The token is only read by server code and must never use a `NEXT_PUBLIC_` prefix. The provider loads:

- `/competitions/{competitionId}/matches` for fixtures, status, live/full-time scores, kick-off times, and the season winner

The matches and winner state share one upstream request. API responses are normalized to the application types and cached server-side. On selected pool match days data revalidates every 60 seconds. Outside match days it revalidates every 30 minutes. Routes render on demand, so builds do not consume API quota, and there is no browser polling.

### External match IDs

The 29 selected matches are linked to verified 2026 football-data.org fixture IDs in `src/data/pool-matches.ts`:

```ts
{
  id: "mexico-south-africa",
  externalMatchId: "537327",
  // ...
}
```

An external ID always wins. This matters because several dates printed on the physical score sheet differ from the official fixture dates. If an ID is removed, `src/lib/match-mapping.ts` falls back to home team, away team, and match date.

`src/lib/team-normalization.ts` maps common English, Dutch, and API aliases such as `Czech Republic`/`Czechia`, `Türkiye`/`Turkey`, `USA`/`United States`, and `Korea Republic`/`South Korea`. English names remain canonical inside the application.

## Fallback results

`src/data/fallback-results.ts` contains a development snapshot with finished, live, and upcoming matches. It keeps the site usable when:

- API credentials have not been configured
- the provider is temporarily unavailable
- the API rate limit is reached

When a configured API fails, the UI displays: `Live results are temporarily unavailable. Showing the latest saved data.`

Replace the fallback scores and timestamp with a newer saved snapshot before production if offline continuity is important.

## Scoring

Scoring is calculated in `src/lib/scoring.ts`; totals are never stored.

- Exact score: 3 points
- Correct home win, draw, or away win with a different score: 1 point
- Incorrect outcome: 0 points
- Missing or unfinished match: 0 points
- Correct tournament winner, after officially confirmed: 10 points

Leaderboard ties are ordered by total points, exact scores, correct outcomes, then participant name. Automated coverage is in `src/lib/scoring.test.ts`.

## Branding

The official horizontal logo is stored locally at:

```text
public/branding/semplor-logo.svg
```

It was downloaded from the current Semplor website asset at `semplor.com/wp-content/uploads/2024/04/logo_horizonal_default-1.svg`. To replace it, overwrite the local file with an approved official asset while preserving its original colors, proportions, and SVG view box.

## Deploy

Vercel is the simplest deployment target:

1. Import the repository into Vercel.
2. Add the three football API environment variables to the project.
3. Deploy with the standard Next.js build command, `npm run build`.

Any Node.js host that supports Next.js can also run:

```bash
npm run build
npm start
```

Keep API credentials in the host's server-side environment settings, not in the repository.
