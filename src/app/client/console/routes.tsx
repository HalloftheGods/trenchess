import { getPath } from "@/app/router/router";
import type { RouteConfig } from "@tc.types";

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
      { path: getPath("console.mmo"), element: <GameMmoScreen /> },
      { path: getPath("console.game"), element: <GameConsoleScreen /> },
      { path: "/console/game", element: <GameModeScreen /> },
      { path: getPath("console.mode"), element: <GameModeScreen /> },
      { path: getPath("console.gamemaster"), element: <GamemasterScreen /> },
      { path: getPath("console.index"), element: <GameScreen /> },
      { path: getPath("console.detail"), element: <GameScreen /> },
      { path: getPath("console.library"), element: <LibraryScreen /> },
    ],
  },
];
