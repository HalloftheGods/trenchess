export type RouteParams = Record<string, string | number | undefined>;

/**
 * Replaces parameters in a path string with provided values.
 * e.g. buildRoute("/user/:id", { id: 123 }) -> "/user/123"
 */
export const buildRoute = (path: string, params: RouteParams): string => {
  let url = path;
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    url = url.replace(`:${key}`, String(value));
  }
  return url;
};
