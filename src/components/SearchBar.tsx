import { useEffect, useMemo, useRef, useState } from "react";
import { useGameState } from "@/context/GameContext";

export default function SearchBar() {
  const { state, dispatch } = useGameState();
  const [value, setValue] = useState<string>(state.filters.search);
  const labelId = useRef<string>(`search-${Math.random().toString(36).slice(2)}`).current;

  const debounced = useMemo(() => {
    let handle: number | undefined;
    return (next: string) => {
      if (handle) window.clearTimeout(handle);
      handle = window.setTimeout(() => {
        dispatch({ type: "SET_SEARCH", payload: next });
      }, 250);
    };
  }, [dispatch]);

  useEffect(() => {
    debounced(value);
  }, [value, debounced]);

  return (
    <div className="relative">
      <label id={labelId} className="visually-hidden">
        Search games
      </label>
      <input
        aria-labelledby={labelId}
        type="search"
        className="focus-ring rounded-md border border-[color:var(--pl-color-border)] bg-[color:var(--pl-color-surface)] px-3 py-2 text-sm"
        placeholder="Search games"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
