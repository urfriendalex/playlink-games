import useGames from "@/hooks/useGames";
import { useGameState } from "@/context/GameContext";
import CardSkeleton from "@/components/CardSkeleton";
import GameCard from "@/components/GameCard";
import FilterChips from "@/components/FilterChips";
import s from "./GamesPage.module.scss";
import useFilterQuerySync from "@/hooks/useFilterQuerySync";
import FilterChipsSkeleton from "@/components/FilterChipsSkeleton";
import GridSizeSwitch from "@/components/GridSizeSwitch";
import { useEffect, useState } from "react";
import useMediaQuery from "@/hooks/useMediaQuery";
import SearchBar from "@/components/SearchBar";

const GRID_KEY = "pl-grid-cols";

export default function GamesPage() {
  const { data, loading, error, refetch } = useGames();
  const { state } = useGameState();
  useFilterQuerySync();

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [cols, setCols] = useState<1 | 2 | 3 | 4>(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem(GRID_KEY) : null;
    if (raw === "1" || raw === "2" || raw === "3" || raw === "4")
      return Number(raw) as 1 | 2 | 3 | 4;
    return 3;
  });

  // Adjust selection when crossing breakpoints
  useEffect(() => {
    if (isDesktop) {
      if (cols < 2) setCols(3);
    } else {
      if (cols > 2) setCols(2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesktop]);

  useEffect(() => {
    try {
      localStorage.setItem(GRID_KEY, String(cols));
    } catch {}
  }, [cols]);

  const gridClass = `${s.grid} ${cols === 1 ? s.cols1 : cols === 2 ? s.cols2 : cols === 3 ? s.cols3 : s.cols4}`;

  const countText = loading
    ? "Loading…"
    : `Showing ${data.length} ${data.length === 1 ? "game" : "games"}`;

  return (
    <div className="space-y-4">
      {/* Search + count row */}
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <SearchBar />
        </div>
        <p className={s.count} aria-live="polite">
          {countText}
        </p>
      </div>

      {/* Desktop controls */}
      <div className="hidden md:flex items-center justify-between">
        {loading ? <FilterChipsSkeleton /> : <FilterChips />}
        <GridSizeSwitch
          value={cols}
          onChange={setCols}
          disabled={loading || !!error}
          options={[2, 3, 4]}
        />
      </div>

      {/* Mobile controls */}
      <div className="flex md:hidden items-center justify-end">
        <GridSizeSwitch
          value={cols}
          onChange={setCols}
          disabled={loading || !!error}
          options={[1, 2]}
        />
      </div>

      {error && (
        <div className="card p-4 flex flex-row items-center justify-between gap-4">
          <p className="text-sm">Something went wrong.</p>
          <button className="btn focus-ring" onClick={refetch} aria-label="Retry fetching games">
            Retry
          </button>
        </div>
      )}

      {loading && (
        <div className={gridClass}>
          {Array.from({ length: 8 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && !error && data.length === 0 && (
        <div className="card p-6">
          <p className="text-sm text-[color:var(--pl-color-text-muted)]">
            No games match your search.
          </p>
        </div>
      )}

      {!loading && !error && data.length > 0 && (
        <div className={gridClass}>
          {data.map((g) => (
            <GameCard key={g.id} game={g} />
          ))}
        </div>
      )}
    </div>
  );
}
