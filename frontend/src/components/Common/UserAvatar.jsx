import { useMemo } from "react";
import { createAvatar } from "@dicebear/core";
import * as adventurerNeutral from "@dicebear/adventurer-neutral";
import * as avataaarsNeutral from "@dicebear/avataaars-neutral";
import * as botttsNeutral from "@dicebear/bottts-neutral";
import * as identicon from "@dicebear/identicon";
import * as loreleiNeutral from "@dicebear/lorelei-neutral";
import * as pixelArtNeutral from "@dicebear/pixel-art-neutral";
import * as shapes from "@dicebear/shapes";
import { resolveAvatarPreset } from "../../utils/profilePreferences";

const initialFor = (fullName, username) => {
  const source = `${fullName || ""}`.trim() || `${username || ""}`.trim() || "U";
  return source.charAt(0).toUpperCase();
};

const avatarStyles = {
  adventurer: adventurerNeutral,
  avataaars: avataaarsNeutral,
  bottts: botttsNeutral,
  campus: identicon,
  identicon,
  lorelei: loreleiNeutral,
  pixel: pixelArtNeutral,
  shapes,
};

const seedFor = (fullName, username, presetId) =>
  [fullName?.trim(), username?.trim(), presetId].filter(Boolean).join("|") || "guest";

export const UserAvatar = ({
  fullName,
  username,
  avatarType = "preset",
  avatarPreset = "campus",
  avatarImage = "",
  size = 34,
  className = "",
}) => {
  const initial = initialFor(fullName, username);
  const preset = resolveAvatarPreset(avatarPreset);
  const generatedAvatar = useMemo(() => {
    try {
      const style = avatarStyles[preset.styleKey] || avatarStyles.campus;
      return createAvatar(style, {
        seed: seedFor(fullName, username, preset.id),
        size: Math.max(size * 4, 96),
        radius: preset.radius ?? 24,
        scale: preset.scale ?? 90,
        backgroundColor: preset.backgrounds,
      }).toDataUri();
    } catch {
      return "";
    }
  }, [fullName, preset.backgrounds, preset.id, preset.radius, preset.scale, preset.styleKey, size, username]);

  if (avatarType === "upload" && avatarImage) {
    return (
      <span
        className={`relative inline-flex shrink-0 overflow-hidden rounded-xl border border-white/25 bg-slate-100 dark:border-slate-700 dark:bg-slate-800 ${className}`}
        style={{ width: size, height: size }}
      >
        <img src={avatarImage} alt={`${fullName || username || "User"} avatar`} className="h-full w-full object-cover" />
      </span>
    );
  }

  if (generatedAvatar) {
    return (
      <span
        className={`relative inline-flex shrink-0 overflow-hidden rounded-xl border border-white/25 bg-slate-100 shadow-sm dark:border-slate-700 dark:bg-slate-800 ${className}`}
        style={{ width: size, height: size }}
      >
        <img
          src={generatedAvatar}
          alt={`${fullName || username || "User"} avatar`}
          className="h-full w-full rounded-[inherit] object-cover"
        />
      </span>
    );
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-campus-500 to-campus-700 text-white shadow-sm shadow-campus-500/30 ${className}`}
      style={{ width: size, height: size, fontSize: Math.max(12, Math.round(size * 0.42)) }}
      aria-hidden="true"
    >
      <span className="font-bold leading-none">{initial}</span>
    </span>
  );
};
