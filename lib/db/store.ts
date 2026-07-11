/**
 * Central local app store.
 * All screens should read/write through this module (or useAppDb).
 * Swap storage.ts later for Supabase/Neon without changing call sites.
 */

import { APP_STATE_KEY, APP_STATE_VERSION, type AppState } from "./types";
import { getJSON, setJSON, removeKey } from "./storage";
import { buildDemoState, buildEmptyState } from "./seed";

type Listener = () => void;

const listeners = new Set<Listener>();
let memory: AppState | null = null;
let hydrated = false;

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify() {
  listeners.forEach((l) => {
    try {
      l();
    } catch {
      /* ignore subscriber errors */
    }
  });
}

function persist(state: AppState) {
  memory = state;
  setJSON(APP_STATE_KEY, state);
  notify();
}

function isBrowser() {
  return typeof window !== "undefined";
}

/** Load state: memory → localStorage → empty fresh user (not demo). */
export function getState(): AppState {
  if (memory) return memory;

  if (!isBrowser()) {
    return buildEmptyState();
  }

  const stored = getJSON<AppState>(APP_STATE_KEY);
  if (stored?.version === APP_STATE_VERSION && stored.user) {
    memory = stored;
    hydrated = true;
    return memory;
  }

  memory = buildEmptyState();
  setJSON(APP_STATE_KEY, memory);
  hydrated = true;
  return memory;
}

export function isHydrated() {
  return hydrated || !isBrowser();
}

export function setState(next: AppState | ((prev: AppState) => AppState)): AppState {
  const prev = getState();
  const resolved = typeof next === "function" ? next(prev) : next;
  persist({ ...resolved, version: APP_STATE_VERSION });
  return memory!;
}

export function updateState(patch: Partial<AppState>): AppState {
  return setState((prev) => ({ ...prev, ...patch }));
}

export function resetToDemo(): AppState {
  const state = buildDemoState();
  persist(state);
  return state;
}

export function resetToEmpty(): AppState {
  const state = buildEmptyState();
  persist(state);
  return state;
}

export function clearAppData(): void {
  memory = null;
  hydrated = false;
  removeKey(APP_STATE_KEY);
  notify();
}

/** Ensure client has hydrated from localStorage (call once in a provider). */
export function hydrateFromStorage(): AppState {
  memory = null;
  return getState();
}
