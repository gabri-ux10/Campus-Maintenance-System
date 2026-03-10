import { useSyncExternalStore } from "react";

export function useMediaQuery(query) {
  const subscribe = (onStoreChange) => {
    if (typeof window === "undefined") {
      return () => {};
    }

    const mediaQuery = window.matchMedia(query);
    mediaQuery.addEventListener("change", onStoreChange);
    return () => mediaQuery.removeEventListener("change", onStoreChange);
  };

  const getSnapshot = () => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.matchMedia(query).matches;
  };

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
