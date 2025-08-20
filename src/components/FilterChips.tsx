import { useMemo } from "react";
import { useGameState } from "@/context/GameContext";
import useGames, { type GameType } from "@/hooks/useGames";
import s from "./FilterChips.module.scss";
import cx from "clsx";

function useHasActiveFilters() {
  const { state } = useGameState();
  return (
    state.filters.search.trim().length > 0 ||
    state.filters.providers.length > 0 ||
    state.filters.types.length > 0 ||
    state.filters.favoritesOnly
  );
}

export default function FilterChips() {
  const { state, dispatch } = useGameState();
  const { meta, loading, data, error } = useGames();

  const providerChips = useMemo(() => meta.providers, [meta.providers]);
  const typeChips = useMemo(() => meta.types, [meta.types]);
  const hasActive = useHasActiveFilters();
  const hasAnyResults = (data?.length ?? 0) > 0;
  const favDisabled = !!error || (loading && !hasAnyResults);

  function onKeyToggle(e: React.KeyboardEvent, onToggle: () => void) {
    if (loading) return;
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      onToggle();
    }
  }

  return (
    <div className={s.toolbar} aria-label="Filters toolbar">
      <span className={s.groupLabel} id="providers-label">
        Providers:
      </span>
      {providerChips.map((p) => {
        const active = state.filters.providers.includes(p.id);
        return (
          <button
            key={p.id}
            type="button"
            className={cx(
              "focus-ring",
              s.chip,
              { [s.chipActive]: active },
              loading && "opacity-60 cursor-not-allowed",
            )}
            aria-pressed={active}
            aria-labelledby={`providers-label`}
            disabled={loading}
            onKeyDown={(e) =>
              onKeyToggle(e, () => dispatch({ type: "TOGGLE_PROVIDER", payload: p.id }))
            }
            onClick={() => !loading && dispatch({ type: "TOGGLE_PROVIDER", payload: p.id })}
          >
            {p.name}
          </button>
        );
      })}

      <span className={s.groupLabel} id="types-label">
        Types:
      </span>
      {typeChips.map((t) => {
        const active = state.filters.types.includes(t as GameType);
        return (
          <button
            key={t}
            type="button"
            className={cx(
              "focus-ring",
              s.chip,
              { [s.chipActive]: active },
              loading && "opacity-60 cursor-not-allowed",
            )}
            aria-pressed={active}
            aria-labelledby={`types-label`}
            disabled={loading}
            onKeyDown={(e) =>
              onKeyToggle(e, () => dispatch({ type: "TOGGLE_TYPE", payload: t as GameType }))
            }
            onClick={() => !loading && dispatch({ type: "TOGGLE_TYPE", payload: t as GameType })}
          >
            {t}
          </button>
        );
      })}

      <span className="sr-only" id="favorites-label">
        Favorites only
      </span>
      <button
        type="button"
        className={cx(
          "focus-ring",
          s.chip,
          s.favChip,
          { [s.chipActive]: state.filters.favoritesOnly },
          // Only show disabled styling if truly disabled (no results while loading)
          favDisabled && "opacity-60 cursor-not-allowed",
        )}
        aria-pressed={state.filters.favoritesOnly}
        aria-labelledby="favorites-label"
        // Keep enabled when there are results, even during loading; disable on error
        disabled={favDisabled}
        onKeyDown={(e) => {
          if (favDisabled) return;
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            dispatch({ type: "TOGGLE_FAVORITES_ONLY" });
          }
        }}
        onClick={() => {
          if (!favDisabled) dispatch({ type: "TOGGLE_FAVORITES_ONLY" });
        }}
      >
        <span aria-hidden="true" className={s.icon}>
          ★
        </span>
        <span>Favorites</span>
      </button>

      {hasActive && (
        <button
          type="button"
          className={cx("focus-ring", s.clearBtn, loading && "opacity-60 cursor-not-allowed")}
          disabled={loading}
          onClick={() => !loading && dispatch({ type: "CLEAR_FILTERS" })}
        >
          Clear all
        </button>
      )}
    </div>
  );
}
