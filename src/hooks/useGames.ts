import { useEffect, useMemo, useState } from "react";
import { useGameState } from "@/context/GameContext";

export type GameType = "slots" | "table" | "live" | "instant";
export interface Provider {
  id: string;
  name: string;
  logo?: string;
}
export interface Game {
  id: string;
  title: string;
  thumbnail: string;
  provider: Provider;
  type: GameType;
  slug: string;
  isNew?: boolean;
  tags?: string[];
}

interface GamesResponse {
  data: Game[];
  pagination: { page: number; pageSize: number; total: number; hasMore: boolean };
  meta: { providers: Provider[]; types: GameType[] };
}

function delay(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}

// Simple in-module cache to avoid duplicate fetches across multiple hook users
let cachedData: Game[] | null = null;
let cachedMeta: { providers: Provider[]; types: GameType[] } | null = null;
let inFlight: Promise<void> | null = null;

// TEMP: toggle to simulate an error for testing error UI (or use ?forceError=1)
// const FORCE_ERROR = true;
const FORCE_ERROR = false;

function shouldForceError(): boolean {
  try {
    const p = new URLSearchParams(window.location.search);
    return FORCE_ERROR || p.get("forceError") === "1";
  } catch {
    return FORCE_ERROR;
  }
}

function bustCache(): void {
  cachedData = null;
  cachedMeta = null;
  inFlight = null;
}

async function fetchGamesOnce(): Promise<void> {
  if (cachedData && cachedMeta) return;
  if (inFlight) return inFlight;
  inFlight = (async () => {
    if (shouldForceError()) {
      await delay(200);
      throw new Error("Simulated error");
    }
    const jitter = 400 + Math.floor(Math.random() * 2000);
    await delay(jitter);
    const res = await fetch("/api/mockGames.json");
    if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
    const json = (await res.json()) as GamesResponse;
    cachedData = json.data;
    cachedMeta = json.meta;
  })();
  return inFlight;
}

export function useGames() {
  const { state } = useGameState();
  const [data, setData] = useState<Game[] | null>(cachedData);
  const [meta, setMeta] = useState<{ providers: Provider[]; types: GameType[] } | null>(cachedMeta);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(!cachedData);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        await fetchGamesOnce();
        if (!cancelled) {
          setData(cachedData);
          setMeta(cachedMeta);
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e as Error);
          setLoading(false);
        }
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  async function refetch(options?: { ignoreCache?: boolean }): Promise<void> {
    const ignoreCache = !!options?.ignoreCache;
    // Clear previous error and optionally bust cache
    setError(null);
    setLoading(true);
    if (ignoreCache) bustCache();
    else {
      // If we still have cache but want a fresh network request, also bust
      bustCache();
    }
    try {
      await fetchGamesOnce();
      setData(cachedData);
      setMeta(cachedMeta);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    if (!data) return [] as Game[];
    const { search, providers, types, favoritesOnly } = state.filters;
    const s = search.trim().toLowerCase();
    return data.filter((g) => {
      if (favoritesOnly && !state.favorites[g.id]) return false;
      if (providers.length > 0 && !providers.includes(g.provider.id)) return false;
      if (types.length > 0 && !types.includes(g.type)) return false;
      if (s && !(g.title.toLowerCase().includes(s) || g.provider.name.toLowerCase().includes(s)))
        return false;
      return true;
    });
  }, [data, state.filters, state.favorites]);

  const derivedMeta = useMemo(() => {
    if (meta) return meta;
    const providersSet = new Map<string, Provider>();
    const typesSet = new Set<GameType>();
    for (const g of data ?? []) {
      providersSet.set(g.provider.id, g.provider);
      typesSet.add(g.type);
    }
    return {
      providers: Array.from(providersSet.values()),
      types: Array.from(typesSet.values()),
    };
  }, [meta, data]);

  return { data: filtered, loading, error, meta: derivedMeta, refetch };
}

export default useGames;
