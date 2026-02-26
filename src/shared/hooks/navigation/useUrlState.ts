import { useCallback, useMemo } from "react";

export function useUrlState() {
  const getParam = useCallback((key: string) => {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
  }, []);

  const updateParams = useCallback((updates: Record<string, string | null>) => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    let changed = false;
    
    Object.entries(updates).forEach(([key, value]) => {
      const current = url.searchParams.get(key);
      if (value === null) {
        if (url.searchParams.has(key)) {
          url.searchParams.delete(key);
          changed = true;
        }
      } else if (current !== value) {
        url.searchParams.set(key, value);
        changed = true;
      }
    });

    if (changed) {
      window.history.pushState({}, "", url.toString());
    }
  }, []);

  const seed = useMemo(() => getParam("seed"), [getParam]);
  const view = useMemo(() => getParam("v"), [getParam]);

  return { seed, view, updateParams, getParam };
}
