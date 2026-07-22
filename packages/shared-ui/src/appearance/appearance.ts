type MediaQueryListLike = {
  matches: boolean;
};

type MatchMediaHost = {
  matchMedia?: (query: string) => MediaQueryListLike;
};

export function prefersDarkMode() {
  const host = globalThis as typeof globalThis & MatchMediaHost;

  if (typeof host.matchMedia !== "function") {
    return false;
  }

  return host.matchMedia("(prefers-color-scheme: dark)").matches;
}
