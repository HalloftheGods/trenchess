import { useLocation, useParams } from "react-router-dom";
import { ROUTE_NAME_MAP } from "@constants/routes";

export interface BreadcrumbItem {
  label: string;
  path: string;
  isLast: boolean;
}

const SEGMENT_NAME_MAP: Record<string, string> = {
  play: "Battle",
  local: "Gathering",
  lobby: "Lobby",
  setup: "Setup",
  learn: "Academy",
  trench: "The Trench",
  chess: "The Chess",
  chessmen: "Chessmen",
  endgame: "The Endgame",
  math: "Mathematics",
  manual: "Manual",
  scoreboard: "Leaderboard",
  rules: "Rulebook",
  tutorial: "Training",
  stats: "Hall of Fame",
};

/**
 * A hook to systematically generate breadcrumbs based on the current route.
 * It leverages ROUTE_NAME_MAP for static routes and custom logic for dynamic segments.
 */
export const useBreadcrumbs = () => {
  const location = useLocation();
  const params = useParams();

  const pathnames = location.pathname.split("/").filter(Boolean);

  const breadcrumbs: BreadcrumbItem[] = pathnames.reduce(
    (acc, segment, index) => {
      // Skip internal/technical segments
      const isNumeric = !isNaN(Number(segment));
      const isInternal = ["players", "step", "board"].includes(segment);
      if (isNumeric || isInternal) return acc;

      const path = "/" + pathnames.slice(0, index + 1).join("/");

      // 1. Try exact route match from ROUTE_NAME_MAP
      let label = ROUTE_NAME_MAP[path];

      // 2. Try segment mapping
      if (!label) {
        label = SEGMENT_NAME_MAP[segment.toLowerCase()];
      }

      // 3. Handle dynamic segments/params
      if (!label) {
        // Check if it's a known param
        const paramValue = Object.values(params).find((p) => p === segment);
        if (paramValue) {
          // Special case for unitTypes or terrainTypes if we want to pretty-print them
          label =
            segment.charAt(0).toUpperCase() +
            segment.slice(1).replace(/-/g, " ");
        }
      }

      // 4. Fallback to capitalized segment
      if (!label) {
        label = segment.charAt(0).toUpperCase() + segment.slice(1);
      }

      acc.push({
        label,
        path,
        isLast: index === pathnames.length - 1,
      });

      return acc;
    },
    [] as BreadcrumbItem[],
  );

  // Special case: if we are in setup, we might want to append board/preset if they exist
  // but usually those are handled by the RouteBreadcrumbs molecule below the header.

  return breadcrumbs;
};
