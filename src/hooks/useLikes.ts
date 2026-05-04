import { useSyncExternalStore, useCallback } from "react";

const STORAGE_KEY = "vetra.likes";

const load = (): Set<string> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
};

let liked: Set<string> = load();
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

const persist = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...liked]));
  } catch {
    /* ignore */
  }
};

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

const getSnapshot = () => liked;

export const useLikes = () => {
  const set = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const toggleLike = useCallback((id: string) => {
    const next = new Set(liked);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    liked = next;
    persist();
    emit();
  }, []);

  const isLiked = useCallback((id: string) => set.has(id), [set]);

  const likeDelta = useCallback((id: string, baseLiked = false) => {
    const has = set.has(id);
    if (has && !baseLiked) return 1;
    if (!has && baseLiked) return -1;
    return 0;
  }, [set]);

  return { isLiked, toggleLike, likeDelta };
};
