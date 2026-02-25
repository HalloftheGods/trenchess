import { ROUTES } from "@constants/routes";
import type { RouteConfig } from "@/shared/types/route";

const PLAY_ROUTES: RouteConfig[] = [
  ROUTES.PLAY.lazy(() => import("./play")),
  ROUTES.PLAY_LOCAL.lazy(() => import("./local")),
  ROUTES.PLAY_LOBBY.lazy(() => import("./lobby")),
  ROUTES.PLAY_SETUP.lazy(() => import("./setup")),
];

export default PLAY_ROUTES;
