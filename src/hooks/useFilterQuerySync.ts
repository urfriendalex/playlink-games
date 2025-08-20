import { useEffect, useMemo, useRef } from "react";
import { useGameState } from "@/context/GameContext";
import { useLocation, useNavigate } from "react-router-dom";

function parseBool(value: string | null): boolean {
  return value === "true" || value === "1";
}

function splitCsv(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

export function useFilterQuerySync() {
  const { state, dispatch } = useGameState();
  const navigate = useNavigate();
  const location = useLocation();
  const hydratedRef = useRef(false);
  const debounceRef = useRef<number | null>(null);

  // Hydrate from URL on first mount
  useEffect(() => {
    if (hydratedRef.current) return;
    const params = new URLSearchParams(location.search);
    const search = params.get("search") ?? "";
    const providers = splitCsv(params.get("providers"));
    const types = splitCsv(params.get("types")) as Array<"slots" | "table" | "live" | "instant">;
    const favoritesOnly = parseBool(params.get("favorites"));

    const next = {
      search,
      providers,
      types,
      favoritesOnly,
    } as const;

    const curr = state.filters;
    const isDifferent =
      curr.search !== next.search ||
      curr.favoritesOnly !== next.favoritesOnly ||
      curr.providers.join(",") !== next.providers.join(",") ||
      curr.types.join(",") !== next.types.join(",");

    if (isDifferent) {
      dispatch({ type: "SET_FILTERS", payload: next });
    }
    hydratedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Push updates to URL when filters change (debounced)
  useEffect(() => {
    if (!hydratedRef.current) return; // wait until hydration

    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      const params = new URLSearchParams();
      if (state.filters.search.trim()) params.set("search", state.filters.search.trim());
      if (state.filters.providers.length)
        params.set("providers", state.filters.providers.join(","));
      if (state.filters.types.length) params.set("types", state.filters.types.join(","));
      if (state.filters.favoritesOnly) params.set("favorites", "true");

      const nextSearch = params.toString();
      const currentSearch = new URLSearchParams(location.search).toString();
      if (nextSearch === currentSearch) return; // no-op to avoid redundant renders

      navigate({ pathname: location.pathname, search: nextSearch }, { replace: false });
    }, 250);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [state.filters, navigate, location.pathname, location.search]);
}

export default useFilterQuerySync;
