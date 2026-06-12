import { AlertTriangle, Database } from "lucide-react";

type DataNoticeProps = {
  warning: string | null;
  source: "api" | "stale" | "unavailable";
};

export function DataNotice({ warning, source }: DataNoticeProps) {
  if (!warning && source === "api") return null;

  return (
    <div
      className="flex items-start gap-2 border-l-2 border-amber-500 bg-amber-50 px-3 py-2.5 text-sm text-amber-900"
    >
      {source === "unavailable" ? (
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      ) : (
        <Database className="mt-0.5 h-4 w-4 shrink-0" />
      )}
      <p>{warning ?? "Live results are currently not updating."}</p>
    </div>
  );
}
