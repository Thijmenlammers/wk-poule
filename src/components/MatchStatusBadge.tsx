import type { MatchStatus } from "@/types";

type MatchStatusBadgeProps = {
  status: MatchStatus;
};

const styles: Record<MatchStatus, string> = {
  scheduled: "text-slate-400",
  live: "text-red-600",
  finished: "text-emerald-700",
  postponed: "text-amber-700",
  cancelled: "text-slate-500",
};

export function MatchStatusBadge({ status }: MatchStatusBadgeProps) {
  const dotStyle =
    status === "live"
      ? "animate-pulse bg-red-500"
      : status === "finished"
        ? "bg-emerald-600"
        : "bg-slate-300";

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium capitalize ${styles[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotStyle}`} />
      {status === "scheduled" ? "Upcoming" : status}
    </span>
  );
}
