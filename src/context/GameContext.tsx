import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";

type GameType = "slots" | "table" | "live" | "instant";

export interface FiltersState {
  search: string;
  providers: string[];
  types: GameType[];
  favoritesOnly: boolean;
}

export interface GameState {
  filters: FiltersState;
  favorites: Record<string, boolean>;
}

type Action =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "TOGGLE_PROVIDER"; payload: string }
  | { type: "TOGGLE_TYPE"; payload: GameType }
  | { type: "CLEAR_FILTERS" }
  | { type: "TOGGLE_FAVORITE"; payload: string }
  | { type: "SET_FAVORITE"; payload: { id: string; value: boolean } }
  | { type: "TOGGLE_FAVORITES_ONLY" }
  | { type: "SET_FILTERS"; payload: FiltersState };

const FAVORITES_KEY = "pl-favorites";

const initialState: GameState = {
  filters: {
    search: "",
    providers: [],
    types: [],
    favoritesOnly: false,
  },
  favorites: {},
};

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, filters: { ...state.filters, search: action.payload } };
    case "TOGGLE_PROVIDER": {
      const exists = state.filters.providers.includes(action.payload);
      const providers = exists
        ? state.filters.providers.filter((id) => id !== action.payload)
        : [...state.filters.providers, action.payload];
      return { ...state, filters: { ...state.filters, providers } };
    }
    case "TOGGLE_TYPE": {
      const exists = state.filters.types.includes(action.payload);
      const types = exists
        ? state.filters.types.filter((t) => t !== action.payload)
        : [...state.filters.types, action.payload];
      return { ...state, filters: { ...state.filters, types } };
    }
    case "CLEAR_FILTERS":
      return { ...state, filters: initialState.filters };
    case "TOGGLE_FAVORITE": {
      const id = action.payload;
      const current = !!state.favorites[id];
      return { ...state, favorites: { ...state.favorites, [id]: !current } };
    }
    case "SET_FAVORITE": {
      const { id, value } = action.payload;
      return { ...state, favorites: { ...state.favorites, [id]: value } };
    }
    case "TOGGLE_FAVORITES_ONLY":
      return {
        ...state,
        filters: { ...state.filters, favoritesOnly: !state.filters.favoritesOnly },
      };
    case "SET_FILTERS":
      return { ...state, filters: action.payload };
    default:
      return state;
  }
}

function readLocalStorage<T>(key: string, validate: (raw: unknown) => T | null): T | null {
  try {
    const str = localStorage.getItem(key);
    if (!str) return null;
    const raw = JSON.parse(str) as unknown;
    return validate(raw);
  } catch {
    return null;
  }
}

function writeLocalStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage errors
  }
}

function validateFavorites(raw: unknown): Record<string, boolean> | null {
  if (!raw || typeof raw !== "object") return null;
  const out: Record<string, boolean> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof k === "string" && typeof v === "boolean") out[k] = v;
  }
  return out;
}

function initWithStorage(state: GameState): GameState {
  if (typeof window === "undefined") return state;
  const storedFavs = readLocalStorage<Record<string, boolean>>(FAVORITES_KEY, validateFavorites);
  return storedFavs ? { ...state, favorites: { ...state.favorites, ...storedFavs } } : state;
}

interface GameContextShape {
  state: GameState;
  dispatch: React.Dispatch<Action>;
}

const GameContext = createContext<GameContextShape | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState, initWithStorage);

  useEffect(() => {
    writeLocalStorage(FAVORITES_KEY, state.favorites);
  }, [state.favorites]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGameState(): GameContextShape {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGameState must be used within GameProvider");
  return ctx;
}
