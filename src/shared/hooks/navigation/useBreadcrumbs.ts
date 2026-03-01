import { useLocation } from "react-router-dom";
import { APP_ROUTES } from "@/app/router/routes";
import type { AppRoute } from "@/app/router/helpers";

export interface BreadcrumbItem {
  label: string;
  path: string;
  isLast: boolean;
}

const isParamSegment = (segment: string) => segment.startsWith(":");

const segmentMatches = (routeSegment: string, urlSegment: string) =>
  isParamSegment(routeSegment) || routeSegment === urlSegment;

const findMatchingChild = (children: AppRoute[], urlSegment: string) =>
  children.find((child) => {
    if (child.index) return false;
    if (!child.path) return false;
    const firstSegment = child.path.split("/")[0];
    return segmentMatches(firstSegment, urlSegment);
  });

const collectTrail = (
  nodes: AppRoute[],
  segments: string[],
  basePath: string,
): BreadcrumbItem[] => {
  if (segments.length === 0) return [];

  const current = segments[0];
  const matched = findMatchingChild(nodes, current);

  if (!matched || !matched.path) return [];

  const pathParts = matched.path.split("/");
  const consumed = pathParts.length;
  const absolutePath = `${basePath}/${pathParts
    .map((part, idx) => (isParamSegment(part) ? segments[idx] : part))
    .join("/")}`;

  const trail: BreadcrumbItem[] = [];

  const matchedViaParam = isParamSegment(pathParts[0]);
  const capitalizeSegment = (segment: string) =>
    segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

  const label =
    matched.name ?? (matchedViaParam ? capitalizeSegment(current) : null);

  if (label) {
    trail.push({ label, path: absolutePath, isLast: false });
  }

  const deeperSegments = segments.slice(consumed);
  const hasChildren = !!matched.children?.length;
  const hasRemainingSegments = deeperSegments.length > 0;

  if (hasChildren && hasRemainingSegments) {
    const nested = collectTrail(
      matched.children!,
      deeperSegments,
      absolutePath,
    );
    trail.push(...nested);
  }

  return trail;
};

export const useBreadcrumbs = (): BreadcrumbItem[] => {
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return [];

  const rootRoute = APP_ROUTES[0];
  const layoutChildren = rootRoute?.children ?? [];

  let trailSource: AppRoute[] = [];
  let remainingSegments = segments;
  const prefixTrail: BreadcrumbItem[] = [];

  for (const layout of layoutChildren) {
    const layoutSegment = layout.path ?? "";
    const layoutHasChildren = !!layout.children?.length;
    const isTopLevel = layoutSegment === "" && layoutHasChildren;
    const isMatchingGroup = layoutSegment === segments[0] && layoutHasChildren;

    if (isTopLevel) {
      trailSource = layout.children!;
      break;
    }

    if (isMatchingGroup) {
      trailSource = layout.children!;
      remainingSegments = segments.slice(1);

      if (layout.name) {
        prefixTrail.push({
          label: layout.name,
          path: `/${layoutSegment}`,
          isLast: false,
        });
      }
      break;
    }
  }

  const consumedLayoutSegment = segments[0] !== remainingSegments[0];
  const basePath = consumedLayoutSegment ? `/${segments[0]}` : "";

  const trail = [
    ...prefixTrail,
    ...collectTrail(trailSource, remainingSegments, basePath),
  ];

  if (trail.length === 0) return [];

  const lastIndex = trail.length - 1;
  return trail.map((crumb, idx) => ({
    ...crumb,
    isLast: idx === lastIndex,
  }));
};
