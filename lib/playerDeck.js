import playersDeck from "@/players_deck.json";
import bowlersDeckRaw from "@/bowlers_deck.json";

const NORMALIZED_STAT_KEYS = [
  "strike_rate_normalized",
  "boundary_rate_normalized",
  "consistency_normalized",
  "economy_normalized",
  "dot_ball_percentage_normalized",
  "impact_score"
];
const RAW_STAT_KEYS = [
  "strike_rate_raw", 
  "boundary_rate_raw", 
  "consistency_raw",
  "economy_raw",
  "dot_ball_percentage_raw"
];

function normalizeStat(value) {
  if (typeof value !== "number" || Number.isNaN(value) || !Number.isFinite(value)) {
    return null;
  }

  return Math.min(100, Math.max(0, value));
}

function sanitizePlayer(player) {
  if (!player || typeof player !== "object") {
    return null;
  }

  const displayName =
    typeof player.display_name === "string" && player.display_name.trim()
      ? player.display_name.trim()
      : typeof player.name === "string" && player.name.trim()
        ? player.name.trim()
        : "";

  if (!displayName) {
    return null;
  }

  const normalizedStats = {};
  const rawStats = {};

  for (const statKey of NORMALIZED_STAT_KEYS) {
    if (!player.hasOwnProperty(statKey)) {
      continue;
    }
    const statValue = normalizeStat(player[statKey]);

    if (statValue === null) {
      return null;
    }
    normalizedStats[statKey] = statValue;
  }

  for (const statKey of RAW_STAT_KEYS) {
    if (!player.hasOwnProperty(statKey)) {
      continue;
    }
    const rawValue = player[statKey];

    if (typeof rawValue !== "number" || Number.isNaN(rawValue) || !Number.isFinite(rawValue)) {
      return null;
    }
    rawStats[statKey] = rawValue;
  }

  return {
    raw_name: player.name,
    display_name: displayName,
    name: displayName,
    strike_rate: normalizedStats.strike_rate_normalized,
    boundary_rate: normalizedStats.boundary_rate_normalized,
    consistency: normalizedStats.consistency_normalized,
    economy: normalizedStats.economy_normalized,
    dot_ball_percentage: normalizedStats.dot_ball_percentage_normalized,
    impact_score: normalizedStats.impact_score,
    ...normalizedStats,
    ...rawStats
  };
}

export const realPlayersDeck = playersDeck.map(sanitizePlayer).filter(Boolean);
export const realBowlersDeck = bowlersDeckRaw.map(sanitizePlayer).filter(Boolean);
