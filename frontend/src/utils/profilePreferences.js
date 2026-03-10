const PROFILE_STORAGE_PREFIX = "scms.profile.";

export const AVATAR_PRESETS = [
  {
    id: "campus",
    label: "Campus Crest",
    description: "Geometric system mark with a sharper operations feel.",
    styleKey: "identicon",
    backgrounds: ["14b8a6", "0f766e", "0f172a"],
    radius: 24,
    scale: 88,
  },
  {
    id: "adventurer",
    label: "Adventurer",
    description: "Character-style portrait with a hand-drawn look.",
    styleKey: "adventurer",
    backgrounds: ["dbeafe", "cffafe", "dcfce7"],
    radius: 24,
    scale: 90,
  },
  {
    id: "avataaars",
    label: "Studio Portrait",
    description: "Clean illustrated face with a more product-polished look.",
    styleKey: "avataaars",
    backgrounds: ["f5f3ff", "dbeafe", "fef3c7"],
    radius: 24,
    scale: 92,
  },
  {
    id: "bottts",
    label: "Bottts",
    description: "Machine-inspired avatar with playful synthetic detail.",
    styleKey: "bottts",
    backgrounds: ["e0f2fe", "ede9fe", "ccfbf1"],
    radius: 24,
    scale: 90,
  },
  {
    id: "lorelei",
    label: "Lorelei",
    description: "Soft portrait model with a more editorial feel.",
    styleKey: "lorelei",
    backgrounds: ["fce7f3", "dcfce7", "fae8ff"],
    radius: 24,
    scale: 92,
  },
  {
    id: "pixel",
    label: "Pixel",
    description: "Retro 8-bit portrait for a more playful identity.",
    styleKey: "pixel",
    backgrounds: ["fde68a", "fed7aa", "dbeafe"],
    radius: 24,
    scale: 84,
  },
  {
    id: "shapes",
    label: "Shapes",
    description: "Abstract modular mark for a more minimal identity.",
    styleKey: "shapes",
    backgrounds: ["e2e8f0", "dbeafe", "ddd6fe"],
    radius: 24,
    scale: 84,
  },
];

const AVATAR_PRESET_ALIASES = {
  aurora: "lorelei",
  sunrise: "avataaars",
  violet: "bottts",
  slate: "shapes",
  amber: "pixel",
  zen: "lorelei",
  fjord: "adventurer",
};

const defaultPrefs = {
  avatarType: "preset",
  avatarPreset: "campus",
  avatarImage: "",
};

const keyFor = (username) => `${PROFILE_STORAGE_PREFIX}${(username || "guest").toLowerCase()}`;
const hasPreset = (presetId) => AVATAR_PRESETS.some((preset) => preset.id === presetId);

export const normalizeAvatarPreset = (presetId) => {
  if (hasPreset(presetId)) return presetId;
  const alias = AVATAR_PRESET_ALIASES[presetId];
  return hasPreset(alias) ? alias : defaultPrefs.avatarPreset;
};

export const loadProfilePreferences = (username) => {
  if (!username) return defaultPrefs;
  try {
    const raw = localStorage.getItem(keyFor(username));
    if (!raw) return defaultPrefs;
    const parsed = JSON.parse(raw);
    return {
      avatarType: parsed.avatarType === "upload" ? "upload" : "preset",
      avatarPreset: normalizeAvatarPreset(parsed.avatarPreset),
      avatarImage: typeof parsed.avatarImage === "string" ? parsed.avatarImage : "",
    };
  } catch {
    return defaultPrefs;
  }
};

export const saveProfilePreferences = (username, prefs) => {
  if (!username) return;
  const payload = {
    avatarType: prefs?.avatarType === "upload" ? "upload" : "preset",
    avatarPreset: normalizeAvatarPreset(prefs?.avatarPreset),
    avatarImage: typeof prefs?.avatarImage === "string" ? prefs.avatarImage : "",
  };
  try {
    localStorage.setItem(keyFor(username), JSON.stringify(payload));
  } catch {
    // ignore storage limitations
  }
};

export const resolveAvatarPreset = (presetId) =>
  AVATAR_PRESETS.find((preset) => preset.id === normalizeAvatarPreset(presetId)) || AVATAR_PRESETS[0];
