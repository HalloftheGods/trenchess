import type { RouteObject } from "react-router-dom";

export type AppRoute = RouteObject & {
  id?: string;
  name?: string;
  children?: AppRoute[];
};

export interface RoutesObject {
  [key: string]: string | RoutesObject;
}

/**
 * Metadata generated from the routes array
 */
export interface RouterMetadata {
  routes: RoutesObject; // Nested paths object (e.g. ROUTES.play.local)
  nameMap: Record<string, string>; // Path to Name map
}

/**
 * Builds the navigation object and name map from the routes array.
 */
export function buildRouterMetadata(
  routes: AppRoute[],
  basePath = "",
): RouterMetadata {
  const result: RouterMetadata = {
    routes: {},
    nameMap: {},
  };

  function traverse(nodes: AppRoute[], currentPath: string) {
    nodes.forEach((node) => {
      // Calculate absolute path
      // Handle index routes (path is empty or undefined)
      let absolutePath = currentPath;
      if (node.path && node.path !== "/") {
        absolutePath = `${currentPath}/${node.path}`.replace(/\/+/g, "/");
      } else if (node.path === "/") {
        absolutePath = "/";
      }

      // If it's an index route, the path is the parent path
      const effectivePath = absolutePath || "/";

      // Add to name map
      if (node.name) {
        result.nameMap[effectivePath] = node.name;
      }

      // Add to ROUTES object using dot-notated ID
      if (node.id) {
        const parts = node.id.split(".");
        let current = result.routes;
        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];
          if (i === parts.length - 1) {
            // Leaf node: set the path
            // If it already exists (as a container), use 'index' or just merge
            const existing = current[part];
            if (existing && typeof existing === "object") {
              (existing as RoutesObject).index = effectivePath;
            } else {
              current[part] = effectivePath;
            }
          } else {
            // Container node
            let next = current[part];
            if (!next || typeof next !== "object") {
              next = {};
              current[part] = next;
            }
            current = next as RoutesObject;
          }
        }
      }

      // Traverse children
      if (node.children) {
        traverse(node.children, absolutePath);
      }
    });
  }

  traverse(routes, basePath);
  return result;
}

/**
 * Helper to get path by ID dynamically
 */
export function getPathById(routes: RoutesObject, id: string): string {
  const parts = id.split(".");
  let current: string | RoutesObject | undefined = routes;
  for (const part of parts) {
    if (typeof current === "object" && current !== null) {
      current = current[part];
    } else {
      return "/";
    }
  }

  if (typeof current === "string") {
    return current;
  }

  if (typeof current === "object" && current !== null) {
    const index = current.index;
    if (typeof index === "string") {
      return index;
    }
  }

  return "/";
}
