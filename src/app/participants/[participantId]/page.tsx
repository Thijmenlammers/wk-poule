import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ChampionPredictionCard } from "@/components/ChampionPredictionCard";
import { DataNotice } from "@/components/DataNotice";
import { ParticipantSummary } from "@/components/ParticipantSummary";
import { PredictionList } from "@/components/PredictionList";
import { participants } from "@/data/participants";
import { poolMatches } from "@/data/pool-matches";
import { getFootballData } from "@/lib/football-api";
import { calculateLeaderboard } from "@/lib/leaderboard";
import { mapPoolMatchesToResults } from "@/lib/match-mapping";

type ParticipantPageProps = {
  params: Promise<{ participantId: string }>;
};

export async function generateMetadata({
  params,
}: ParticipantPageProps): Promise<Metadata> {
  const { participantId } = await params;
  const participant = participants.find((item) => item.id === participantId);

  return {
    title: participant?.name ?? "Participant",
  };
}

export default async function ParticipantPage({
  params,
}: ParticipantPageProps) {
  const { participantId } = await params;
  const participant = participants.find((item) => item.id === participantId);

  if (!participant) {
    notFound();
  }

  const footballData = await getFootballData();
  const matches = mapPoolMatchesToResults(poolMatches, footballData.matches);
  const leaderboard = calculateLeaderboard(
    participants,
    matches,
    footballData.tournamentWinner,
  );
  const entry = leaderboard.find(
    (item) => item.participant.id === participant.id,
  );

  if (!entry) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="space-y-7">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-[#e1592a]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to leaderboard
        </Link>

        <ParticipantSummary entry={entry} />
        <DataNotice
          warning={footballData.warning}
          source={footballData.source}
        />
        <ChampionPredictionCard
          predictedChampion={participant.predictedChampion}
          actualChampion={footballData.tournamentWinner}
        />
        <PredictionList
          matches={matches}
          predictions={participant.predictions}
        />
      </div>
    </main>
  );
}
