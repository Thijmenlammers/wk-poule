const teamAliases: Record<string, string[]> = {
  "south korea": [
    "korea republic",
    "republic of korea",
    "korea",
    "zuid korea",
  ],
  czechia: ["czech republic", "tsjechie"],
  turkey: ["turkiye", "turkije"],
  "united states": ["usa", "us", "united states of america", "verenigde staten"],
  "dr congo": [
    "democratic republic of the congo",
    "congo dr",
    "drc",
    "democratische republiek congo",
  ],
  "cape verde": ["cabo verde", "kaapverdie"],
  "saudi arabia": ["saudi-arabia", "saoedi arabie"],
  netherlands: ["the netherlands", "nederland", "holland"],
  belgium: ["belgie"],
  germany: ["duitsland"],
  england: ["engeland"],
  spain: ["spanje"],
  france: ["frankrijk"],
  portugal: [],
  mexico: [],
  "south africa": ["zuid afrika"],
  australia: ["australie"],
  japan: [],
  egypt: ["egypte"],
  senegal: [],
  uzbekistan: ["oezbekistan"],
  colombia: ["colombie"],
  croatia: ["kroatie"],
  paraguay: [],
  sweden: ["zweden"],
  iran: [],
  iraq: ["irak"],
  ghana: [],
  tunisia: ["Tunesie"],
  "new zealand": ["nieuw zeeland"],
  uruguay: [],
  norway: ["noorwegen"],
  panama: [],
  brazil: ["brazilie"],
  argentina: [],
};

function simplifyTeamName(teamName: string) {
  return teamName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\b(national|football|soccer|team|fc)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const canonicalByAlias = new Map<string, string>();

for (const [canonicalName, aliases] of Object.entries(teamAliases)) {
  canonicalByAlias.set(simplifyTeamName(canonicalName), canonicalName);
  for (const alias of aliases) {
    canonicalByAlias.set(simplifyTeamName(alias), canonicalName);
  }
}

export function normalizeTeamName(teamName: string) {
  const simplified = simplifyTeamName(teamName);
  return canonicalByAlias.get(simplified) ?? simplified;
}

export function teamNamesMatch(first: string, second: string) {
  return normalizeTeamName(first) === normalizeTeamName(second);
}
