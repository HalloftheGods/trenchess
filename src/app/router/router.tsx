import { createBrowserRouter } from "react-router-dom";
import { APP_ROUTES } from "./tree";
import { buildRouterMetadata, type RoutesObject } from "./helpers";

/**
 * Automatically derive navigation paths and name mapping from the tree.
 */
const metadata = buildRouterMetadata(APP_ROUTES);

export const ROUTES: RoutesObject = metadata.routes as RoutesObject;
export const ROUTE_NAME_MAP = metadata.nameMap;

/**
 * Main Router Instance
 */
export const router = createBrowserRouter(APP_ROUTES);

/**
 * Helper to support navigate({ name: 'home' }) logic
 */
export const getPath = (id: string) => {
  const parts = id.split(".");
  let current = ROUTES;
  for (const part of parts) {
    current = current[part];
    if (!current) return "/";
  }
  return typeof current === "string" ? current : current.index || "/";
};
