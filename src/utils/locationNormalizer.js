/**
 * locationNormalizer.js
 *
 * Utility for normalizing Indian city/state names before sending to the API.
 * Supports:
 *  - Exact match (case-insensitive, trimmed)
 *  - Collapsed-space match  (e.g. "andhrapradesh" → "Andhra Pradesh")
 *  - Alias / alternate spelling table  (e.g. "bangalore" → "Karnataka")
 *  - Levenshtein distance ≤ 2 for typo tolerance
 */

/* ─────────────────────────────────────────────────────────────
   CANONICAL STATE LIST
   Each entry: { canonical: "Display Name", aliases: [...] }
   ───────────────────────────────────────────────────────────── */
const INDIAN_STATES = [
  { canonical: "Andhra Pradesh",        aliases: ["andhrapradesh", "ap", "andhra"] },
  { canonical: "Arunachal Pradesh",     aliases: ["arunachalpradesh", "arunachal"] },
  { canonical: "Assam",                 aliases: ["as"] },
  { canonical: "Bihar",                 aliases: ["bh"] },
  { canonical: "Chhattisgarh",          aliases: ["chattisgarh", "chhatisgarh", "cg"] },
  { canonical: "Goa",                   aliases: [] },
  { canonical: "Gujarat",               aliases: ["gj"] },
  { canonical: "Haryana",               aliases: ["hr"] },
  { canonical: "Himachal Pradesh",      aliases: ["himachalpradesh", "hp", "himachal"] },
  { canonical: "Jharkhand",             aliases: ["jh"] },
  { canonical: "Karnataka",             aliases: ["ka", "karnataka", "bangalore state", "bengaluru state"] },
  { canonical: "Kerala",                aliases: ["kl"] },
  { canonical: "Madhya Pradesh",        aliases: ["madhyapradesh", "mp", "madhya"] },
  { canonical: "Maharashtra",           aliases: ["mh", "maharastra", "maharashtra"] },
  { canonical: "Manipur",               aliases: ["mn"] },
  { canonical: "Meghalaya",             aliases: ["ml"] },
  { canonical: "Mizoram",               aliases: ["mz"] },
  { canonical: "Nagaland",              aliases: ["nl"] },
  { canonical: "Odisha",                aliases: ["orissa", "od"] },
  { canonical: "Punjab",                aliases: ["pb"] },
  { canonical: "Rajasthan",             aliases: ["rj", "rajsthan"] },
  { canonical: "Sikkim",                aliases: ["sk"] },
  { canonical: "Tamil Nadu",            aliases: ["tamilnadu", "tn", "tamil", "tamilnadu state"] },
  { canonical: "Telangana",             aliases: ["ts", "telengana", "telangana state"] },
  { canonical: "Tripura",               aliases: ["tr"] },
  { canonical: "Uttar Pradesh",         aliases: ["uttarpradesh", "up", "uttar"] },
  { canonical: "Uttarakhand",           aliases: ["uttaranchal", "uk"] },
  { canonical: "West Bengal",           aliases: ["westbengal", "wb", "bengal"] },

  /* Union Territories */
  { canonical: "Andaman and Nicobar Islands", aliases: ["andaman", "nicobar", "andamannicobar"] },
  { canonical: "Chandigarh",            aliases: ["chd"] },
  { canonical: "Dadra and Nagar Haveli and Daman and Diu", aliases: ["dadra", "damananddiu", "daman", "diu"] },
  { canonical: "Delhi",                 aliases: ["new delhi", "ncr", "nct", "dl"] },
  { canonical: "Jammu and Kashmir",     aliases: ["jammukashmir", "jk", "jammu", "kashmir"] },
  { canonical: "Ladakh",                aliases: ["la"] },
  { canonical: "Lakshadweep",           aliases: ["ld"] },
  { canonical: "Puducherry",            aliases: ["pondicherry", "pondi", "py"] },
];

/* ─────────────────────────────────────────────────────────────
   CITY ALIAS TABLE
   Maps commonly confused city spellings to a canonical name.
   ───────────────────────────────────────────────────────────── */
const CITY_ALIASES = {
  bangalore:  "Bengaluru",
  bangaluru:  "Bengaluru",
  bengalore:  "Bengaluru",
  bombay:     "Mumbai",
  madras:     "Chennai",
  calcutta:   "Kolkata",
  puna:       "Pune",
  poona:      "Pune",
  benaras:    "Varanasi",
  benares:    "Varanasi",
  allahabad:  "Prayagraj",
  vizag:      "Visakhapatnam",
  waltair:    "Visakhapatnam",
  hyd:        "Hyderabad",
  hydrabad:   "Hyderabad",
  hyderbad:   "Hyderabad",
  secunderabad: "Hyderabad",
  dilli:      "Delhi",
};

/* ─────────────────────────────────────────────────────────────
   LEVENSHTEIN DISTANCE
   ───────────────────────────────────────────────────────────── */
function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

/* ─────────────────────────────────────────────────────────────
   normalizeState(input) → canonical string | null
   ───────────────────────────────────────────────────────────── */
export function normalizeState(input) {
  if (!input || typeof input !== "string") return null;

  const trimmed = input.trim();
  if (!trimmed) return null;

  const lower = trimmed.toLowerCase();
  // Collapse all whitespace/hyphens for collapsed-match
  const collapsed = lower.replace(/[\s\-]+/g, "");

  for (const entry of INDIAN_STATES) {
    const canonicalLower    = entry.canonical.toLowerCase();
    const canonicalCollapsed = canonicalLower.replace(/[\s\-]+/g, "");

    // 1. Exact match
    if (lower === canonicalLower) return entry.canonical;

    // 2. Collapsed-space match
    if (collapsed === canonicalCollapsed) return entry.canonical;

    // 3. Alias match
    if (entry.aliases.some((alias) => alias === lower || alias === collapsed)) {
      return entry.canonical;
    }

    // 4. Levenshtein on collapsed strings (threshold: ≤ 2 edits)
    if (levenshtein(collapsed, canonicalCollapsed) <= 2) {
      return entry.canonical;
    }

    // 5. Levenshtein on aliases (threshold: ≤ 1 edit for short aliases)
    for (const alias of entry.aliases) {
      if (levenshtein(collapsed, alias.replace(/[\s\-]+/g, "")) <= 1) {
        return entry.canonical;
      }
    }
  }

  // No match — return title-cased original so we don't drop the value entirely
  return toTitleCase(trimmed);
}

/* ─────────────────────────────────────────────────────────────
   normalizeCity(input) → cleaned string | null
   ───────────────────────────────────────────────────────────── */
export function normalizeCity(input) {
  if (!input || typeof input !== "string") return null;

  const trimmed = input.trim();
  if (!trimmed) return null;

  const lower = trimmed.toLowerCase();

  // Check alias table first
  if (CITY_ALIASES[lower]) return CITY_ALIASES[lower];

  // Check partial alias match (e.g. "hyd" prefix)
  for (const [alias, canonical] of Object.entries(CITY_ALIASES)) {
    if (alias.startsWith(lower) && lower.length >= 3) {
      return canonical;
    }
  }

  // Default: title-case + trim
  return toTitleCase(trimmed);
}

/* ─────────────────────────────────────────────────────────────
   HELPER: title-case each word
   ───────────────────────────────────────────────────────────── */
function toTitleCase(str) {
  return str
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
