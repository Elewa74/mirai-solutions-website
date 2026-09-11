// Theme policy. "light": the brand's light look is the default for everyone and the device
// setting is ignored until the visitor toggles (their choice is then remembered).
// "system": follow the device's light/dark setting until the visitor toggles.
export const DEFAULT_THEME_MODE = "light";

export function resolveTheme(stored, prefersDark, mode = DEFAULT_THEME_MODE) {
  if (stored === "light" || stored === "dark") return stored;
  if (mode === "system") return prefersDark ? "dark" : "light";
  return "light";
}

export function nextTheme(current) {
  return current === "dark" ? "light" : "dark";
}
