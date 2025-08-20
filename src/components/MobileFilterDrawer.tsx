import { useEffect, useMemo, useRef } from "react";
import { useGameState } from "@/context/GameContext";
import useGames, { type GameType } from "@/hooks/useGames";
import s from "./MobileFilterDrawer.module.scss";
import chips from "./FilterChips.module.scss";
import cx from "clsx";

export interface MobileFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  labelledById: string;
}

export default function MobileFilterDrawer({
  open,
  onClose,
  labelledById,
}: MobileFilterDrawerProps) {
  const { state, dispatch } = useGameState();
  const { meta, loading, data, error } = useGames();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const firstFocusRef = useRef<HTMLButtonElement | null>(null);

  // Basic focus trap and ESC close
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const focusTarget = firstFocusRef.current;
    focusTarget?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        prev?.focus();
      }
      if (e.key === "Tab" && rootRef.current) {
        const focusable = rootRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const list = Array.from(focusable).filter((el) => !el.hasAttribute("disabled"));
        if (list.length === 0) return;
        const first = list[0];
        const last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const providerChips = useMemo(() => meta.providers, [meta.providers]);
  const typeChips = useMemo(() => meta.types, [meta.types]);

  if (!open) return null;

  function onKeyToggle(e: React.KeyboardEvent, onToggle: () => void) {
    if (loading) return;
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      onToggle();
    }
  }

  return (
    <div className="md:hidden">
      <div className={s.overlay} aria-hidden onClick={onClose} />
      <div
        className={s.drawer}
        ref={rootRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledById}
      >
        <div className={s.header}>
          <h2 id={labelledById} className="text-base font-semibold">
            Filters
          </h2>
          <button className="btn focus-ring" onClick={onClose} ref={firstFocusRef}>
            Close
          </button>
        </div>

        <section className={s.section} aria-labelledby="providers-m">
          <h3 id="providers-m" className="text-sm text-[color:var(--pl-color-text-muted)] mb-1">
            Providers
          </h3>
          <div className={s.list}>
            {providerChips.map((p) => {
              const active = state.filters.providers.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  className={cx(
                    "focus-ring",
                    chips.chip,
                    { [chips.chipActive]: active },
                    loading && "opacity-60 cursor-not-allowed",
                  )}
                  aria-pressed={active}
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
          </div>
        </section>

        <section className={s.section} aria-labelledby="types-m">
          <h3 id="types-m" className="text-sm text-[color:var(--pl-color-text-muted)] mb-1">
            Types
          </h3>
          <div className={s.list}>
            {typeChips.map((t) => {
              const active = state.filters.types.includes(t as GameType);
              return (
                <button
                  key={t}
                  type="button"
                  className={cx(
                    "focus-ring",
                    chips.chip,
                    { [chips.chipActive]: active },
                    loading && "opacity-60 cursor-not-allowed",
                  )}
                  aria-pressed={active}
                  disabled={loading}
                  onKeyDown={(e) =>
                    onKeyToggle(e, () => dispatch({ type: "TOGGLE_TYPE", payload: t as GameType }))
                  }
                  onClick={() =>
                    !loading && dispatch({ type: "TOGGLE_TYPE", payload: t as GameType })
                  }
                >
                  {t}
                </button>
              );
            })}
          </div>
        </section>

        <div className={s.section}>
          <button
            type="button"
            className={cx(
              "focus-ring",
              chips.chip,
              chips.favChip,
              { [chips.chipActive]: state.filters.favoritesOnly },
              // Only show disabled styling if truly disabled (no results while loading)
              (!!error || (loading && (data?.length ?? 0) === 0)) &&
                "opacity-60 cursor-not-allowed",
            )}
            aria-pressed={state.filters.favoritesOnly}
            // Keep enabled when there are results, even during loading; disable on error
            disabled={!!error || (loading && (data?.length ?? 0) === 0)}
            onKeyDown={(e) => {
              const favDisabled = !!error || (loading && (data?.length ?? 0) === 0);
              if (favDisabled) return;
              if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                dispatch({ type: "TOGGLE_FAVORITES_ONLY" });
              }
            }}
            onClick={() => {
              const favDisabled = !!error || (loading && (data?.length ?? 0) === 0);
              if (!favDisabled) dispatch({ type: "TOGGLE_FAVORITES_ONLY" });
            }}
          >
            <span aria-hidden="true" className={chips.icon}>
              ★
            </span>
            <span>Favorites only</span>
          </button>
        </div>

        <div className={s.actions}>
          <button
            className="btn focus-ring"
            onClick={() => dispatch({ type: "CLEAR_FILTERS" })}
            disabled={loading}
          >
            Clear all
          </button>
          <button className="btn focus-ring" onClick={onClose} disabled={loading}>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
