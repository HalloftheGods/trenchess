import type { RouteConfig } from "@tc.types";
import { ROUTES } from "@/app/router/router";
import {
  GameMmoScreen,
  GameConsoleScreen,
  GameModeScreen,
  GamemasterScreen,
  GameScreen,
  LibraryScreen,
} from "./screens";

import ConsoleView from "./index";

export const getConsoleRoutes = (): RouteConfig[] => [
  {
    element: <ConsoleView />,
    children: [
      { path: ROUTES.console.mmo, element: <GameMmoScreen /> },
      { path: ROUTES.console.game, element: <GameConsoleScreen /> },
      { path: "/console/game", element: <GameModeScreen /> },
      { path: ROUTES.console.mode, element: <GameModeScreen /> },
      { path: ROUTES.console.gamemaster, element: <GamemasterScreen /> },
      { path: ROUTES.console.index, element: <GameScreen /> },
      { path: ROUTES.console.detail, element: <GameScreen /> },
      { path: ROUTES.console.library, element: <LibraryScreen /> },
    ],
  },
];
