import { useEffect, useState } from "react";

export default function useMediaQuery(query: string): boolean {
  const getMatch = (): boolean =>
    typeof window !== "undefined" && typeof window.matchMedia !== "undefined"
      ? window.matchMedia(query).matches
      : false;

  const [matches, setMatches] = useState<boolean>(getMatch);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia === "undefined") return;
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    mql.addEventListener?.("change", onChange);
    // Ensure state is synced at mount
    setMatches(mql.matches);
    return () => mql.removeEventListener?.("change", onChange);
  }, [query]);

  return matches;
}
