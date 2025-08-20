import useGames from "@/hooks/useGames";
import { useGameState } from "@/context/GameContext";
import CardSkeleton from "@/components/CardSkeleton";
import GameCard from "@/components/GameCard";
import FilterChips from "@/components/FilterChips";
import s from "./GamesPage.module.scss";

export default function GamesPage() {
  const { data, loading, error, refetch } = useGames();
  const { state } = useGameState();

  return (
    <div className="space-y-4">
      <p className={s.count} aria-live="polite">
        {loading ? "Loading…" : `${data.length} result${data.length === 1 ? "" : "s"}`}
      </p>

      <div className="hidden md:block">
        <FilterChips />
      </div>

      {error && (
        <div className="card p-4">
          <p className="mb-2">Something went wrong.</p>
          <button className="btn focus-ring" onClick={refetch}>Retry</button>
        </div>
      )}

      {loading && (
        <div className={s.grid}>
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
        <div className={s.grid}>
          {data.map((g) => (
            <GameCard key={g.id} game={g} />
          ))}
        </div>
      )}
    </div>
  );
}
