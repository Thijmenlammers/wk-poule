import { getTeamFlagCode } from "@/lib/team-display";

type TeamFlagProps = {
  team: string | null;
  className?: string;
};

export function TeamFlag({ team, className = "" }: TeamFlagProps) {
  const code = getTeamFlagCode(team);

  return (
    <span
      className={`fi fi-${code} shrink-0 overflow-hidden rounded-[1px] ring-1 ring-black/10 ${className}`}
      role="img"
      aria-label={team ? `${team} flag` : "Unknown team flag"}
    />
  );
}
