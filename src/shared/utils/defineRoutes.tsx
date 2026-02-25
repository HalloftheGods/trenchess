import { createElement, lazy } from "react";
import type { RouteConfig } from "@/shared/types";

type RouteComponent = React.ComponentType<Record<string, never>>;

/**
 * Defines routes mapping literal paths directly to React components.
 * If a route is a string, it is automatically lazy-loaded as a component
 * at "@/client/[basePath]/[route].tsx".
 */
const defineRoutes = (
  basePath: string,
  routes: (string | RouteConfig)[],
): RouteConfig[] => {
  return routes.map((route) => {
    if (typeof route === "string") {
      const path = `${basePath}/${route}`;
      return {
        path,
        element: createElement(lazyRoute(path)),
      };
    }
    return route;
  });
};

const modules = import.meta.glob("../../client/**/*.tsx");

/**
 * A wrapper for React.lazy that leverages Vite's static analysis.
 * Pass a path relative to `src/client/`, e.g., `lazyRoute('debug/start')`
 * Note: Omit the .tsx extension!
 */
const lazyRoute = (path: string): RouteComponent => {
  const fullPath = `../../client/${path}.tsx`;
  const importer = modules[fullPath];

  if (!importer) {
    throw new Error(`Route component not found: ${fullPath}`);
  }

  return lazy(importer as any);
};

export { defineRoutes, lazyRoute };
