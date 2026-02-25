import { ROUTES } from "@constants/routes";
import type { RouteConfig } from "@/shared/types/route";

const PlayLazy = ROUTES.PLAY.component(() => import("./play"));
const PlayLocalLazy = ROUTES.PLAY_LOCAL.component(() => import("./local"));
const PlayLobbyLazy = ROUTES.PLAY_LOBBY.component(() => import("./lobby"));
const PlaySetupLazy = ROUTES.PLAY_SETUP.component(() => import("./setup"));

const PLAY_ROUTES: RouteConfig[] = [
  ROUTES.PLAY.define(<PlayLazy />),
  ROUTES.PLAY_LOCAL.define(<PlayLocalLazy />),
  ROUTES.PLAY_LOBBY.define(<PlayLobbyLazy />),
  ROUTES.PLAY_SETUP.define(<PlaySetupLazy />),
];

export default PLAY_ROUTES;
