import Image from "next/image";
import Link from "next/link";
import { formatLastUpdated } from "@/lib/formatting";

type HeaderProps = {
  lastUpdated: string;
  source: "api" | "fallback";
};

export function Header({ lastUpdated, source }: HeaderProps) {
  return (
    <header className="border-b border-[#305459]/12 bg-white">
      <div className="mx-auto flex max-w-5xl items-center px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-4">
          <Image
            src="/branding/semplor-logo.svg"
            alt="Semplor"
            width={1233}
            height={316}
            className="h-auto w-28 sm:w-32"
            priority
          />
          <span className="h-7 w-px bg-slate-200" />
          <span>
            <span className="block text-sm font-semibold text-[#305459]">
              World Cup Pool
            </span>
            <span className="hidden text-xs text-slate-400 sm:block">
              Internal competition
            </span>
          </span>
        </Link>

        <div className="ml-auto text-right text-xs text-slate-400">
          <span className="flex items-center justify-end gap-2 font-medium text-slate-600">
            <span
              className={`h-2 w-2 rounded-full ${
                source === "api" ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
            <span className="hidden sm:inline">
              {source === "api" ? "Live results" : "Demo results"}
            </span>
          </span>
          <span className="mt-0.5 hidden sm:block">
            Updated {formatLastUpdated(lastUpdated)}
          </span>
        </div>
      </div>
    </header>
  );
}
