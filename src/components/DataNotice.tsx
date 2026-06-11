import { AlertTriangle, Database } from "lucide-react";

type DataNoticeProps = {
  warning: string | null;
  source: "api" | "fallback";
};

export function DataNotice({ warning, source }: DataNoticeProps) {
  if (!warning && source !== "fallback") return null;

  return (
    <div
      className={`flex items-start gap-2 border-l-2 px-3 py-2.5 text-sm ${
        warning
          ? "border-amber-500 bg-amber-50 text-amber-900"
          : "border-[#e1592a] bg-white text-slate-600"
      }`}
    >
      {warning ? (
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      ) : (
        <Database className="mt-0.5 h-4 w-4 shrink-0 text-[#e1592a]" />
      )}
      <p>
        {warning ??
          "Using the saved demo result set. Participant predictions remain unchanged."}
      </p>
    </div>
  );
}
