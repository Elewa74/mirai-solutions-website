export function localeFromPath(pathname) {
  return pathname === "/ar" || pathname.startsWith("/ar/") ? "ar" : "en";
}

export function localizePath(pathname, locale) {
  const logical = pathname === "/ar" ? "/" : pathname.replace(/^\/ar(?=\/)/, "");
  if (locale === "en") return logical || "/";
  return logical === "/" ? "/ar" : `/ar${logical}`;
}
