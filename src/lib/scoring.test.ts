import { describe, expect, it } from "vitest";
import {
  calculateChampionBonus,
  calculateMatchPoints,
} from "@/lib/scoring";

describe("calculateMatchPoints", () => {
  it.each([
    ["exact home win", 2, 1, 2, 1],
    ["exact away win", 0, 2, 0, 2],
    ["exact draw", 1, 1, 1, 1],
  ])("%s awards 3 points", (_label, ph, pa, ah, aa) => {
    expect(calculateMatchPoints(ph, pa, ah, aa, "finished")).toMatchObject({
      points: 3,
      category: "exact",
    });
  });

  it.each([
    ["home winner", 2, 0, 3, 1, "1 point · Correct home win"],
    ["away winner", 0, 1, 1, 3, "1 point · Correct away win"],
    ["draw", 1, 1, 2, 2, "1 point · Correct draw"],
  ])(
    "correct %s with wrong score awards 1 point",
    (_label, ph, pa, ah, aa, explanation) => {
      expect(calculateMatchPoints(ph, pa, ah, aa, "finished")).toEqual({
        points: 1,
        category: "correct-outcome",
        explanation,
      });
    },
  );

  it("awards 0 for an incorrect outcome", () => {
    expect(calculateMatchPoints(2, 0, 1, 1, "finished")).toMatchObject({
      points: 0,
      category: "incorrect",
    });
  });

  it.each(["scheduled", "live"])(
    "keeps a %s match pending",
    (matchStatus) => {
      expect(calculateMatchPoints(2, 0, 1, 0, matchStatus)).toMatchObject({
        points: 0,
        category: "pending",
      });
    },
  );

  it("keeps a match with a missing actual score pending", () => {
    expect(calculateMatchPoints(2, 0, null, 0, "finished")).toMatchObject({
      points: 0,
      category: "pending",
    });
  });

  it("marks a missing participant prediction", () => {
    expect(calculateMatchPoints(null, null, 2, 0, "finished")).toEqual({
      points: 0,
      category: "missing",
      explanation: "0 points · No prediction",
    });
  });
});

describe("calculateChampionBonus", () => {
  it("awards 10 points for the correct champion", () => {
    expect(calculateChampionBonus("Netherlands", "Nederland")).toEqual({
      points: 10,
      status: "correct",
    });
  });

  it("awards 0 points for an incorrect champion", () => {
    expect(calculateChampionBonus("Spain", "France")).toEqual({
      points: 0,
      status: "incorrect",
    });
  });

  it("keeps the bonus pending while the champion is unknown", () => {
    expect(calculateChampionBonus("Spain", null)).toEqual({
      points: 0,
      status: "pending",
    });
  });

  it("supports a missing champion prediction", () => {
    expect(calculateChampionBonus(null, "Spain")).toEqual({
      points: 0,
      status: "missing",
    });
  });
});
