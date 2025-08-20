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

export function useGames() {
  const { state } = useGameState();
  const [data, setData] = useState<Game[] | null>(null);
  const [meta, setMeta] = useState<{ providers: Provider[]; types: GameType[] } | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      try {
        const jitter = 400 + Math.floor(Math.random() * 2000);
        await delay(jitter);
        const res = await fetch("/api/mockGames.json");
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        const json = (await res.json()) as GamesResponse;
        if (!cancelled) {
          setData(json.data);
          setMeta(json.meta);
        }
      } catch (e) {
        if (!cancelled) setError(e as Error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, []);

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

  return { data: filtered, loading, error, meta: derivedMeta, refetch: () => location.reload() };
}

export default useGames;
