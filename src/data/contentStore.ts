import { useSyncExternalStore } from "react";
import { Content, projects, musicTracks } from "./mockData";

const listeners = new Set<() => void>();
let userContent: Content[] = [];

const emit = () => listeners.forEach((l) => l());

export const addContent = (c: Content) => {
  userContent = [c, ...userContent];
  emit();
};

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

const baseAll: Content[] = [...projects, ...musicTracks];

let cachedSnapshot: Content[] = baseAll;
let cachedUserRef: Content[] = userContent;

const getSnapshot = (): Content[] => {
  if (cachedUserRef !== userContent) {
    cachedUserRef = userContent;
    cachedSnapshot = [...userContent, ...baseAll];
  }
  return cachedSnapshot;
};

export const useAllContent = (): Content[] =>
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
