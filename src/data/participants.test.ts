import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { participants } from "@/data/participants";
import { poolMatches } from "@/data/pool-matches";

const WORKBOOK_DATA_SHA256 =
  "28b17f8680c9241017be3d0239bd906369c862b3554f2447ce9f61246fc99b75";

function getPrediction(participantId: string, matchIndex: number) {
  const participant = participants.find(({ id }) => id === participantId);

  if (!participant) {
    throw new Error(`Unknown participant: ${participantId}`);
  }

  return participant.predictions[matchIndex - 1];
}

describe("digitized participant data", () => {
  it("contains one complete scorecard for each workbook participant", () => {
    expect(participants).toHaveLength(16);
    expect(new Set(participants.map(({ id }) => id)).size).toBe(16);

    const expectedMatchIds = poolMatches.map(({ id }) => id);

    for (const participant of participants) {
      expect(participant.predictions.map(({ matchId }) => matchId)).toEqual(
        expectedMatchIds,
      );

      for (const prediction of participant.predictions) {
        expect(prediction.predictedHomeScore).toBeTypeOf("number");
        expect(prediction.predictedAwayScore).toBeTypeOf("number");
        expect(prediction.predictedHomeScore).toBeGreaterThanOrEqual(0);
        expect(prediction.predictedAwayScore).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it("matches the complete digitized workbook dataset", () => {
    const canonicalData = participants
      .map((participant) => {
        const scores = participant.predictions
          .map(
            ({ predictedHomeScore, predictedAwayScore }) =>
              `${predictedHomeScore}-${predictedAwayScore}`,
          )
          .join(",");

        return [
          participant.id.toUpperCase(),
          participant.name,
          participant.predictedChampion,
          scores,
        ].join("|");
      })
      .join("\n");

    const checksum = createHash("sha256").update(canonicalData).digest("hex");

    expect(checksum).toBe(WORKBOOK_DATA_SHA256);
  });

  it("preserves the overwritten scores accepted during review", () => {
    expect(getPrediction("p10", 3)).toMatchObject({
      predictedHomeScore: 0,
      predictedAwayScore: 1,
    });
    expect(getPrediction("p11", 21)).toMatchObject({
      predictedHomeScore: 0,
      predictedAwayScore: 2,
    });
    expect(getPrediction("p11", 22)).toMatchObject({
      predictedHomeScore: 1,
      predictedAwayScore: 1,
    });
    expect(getPrediction("p11", 23)).toMatchObject({
      predictedHomeScore: 3,
      predictedAwayScore: 4,
    });
  });
});
