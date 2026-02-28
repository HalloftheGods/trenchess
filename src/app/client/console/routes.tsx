import type { RouteConfig } from "@tc.types";
import type { GameStateHook, GameMode, GameState } from "@tc.types";
import { PHASES } from "@constants/game";
import {
  GameMmoScreen,
  GameConsoleScreen,
  GameModeScreen,
  GamemasterScreen,
  GameScreen,
  LibraryScreen,
} from "./screens";

import ConsoleView from "./index";
import CONSOLE_ROUTES from "./constants";

export const getGameRoutes = (
  game: GameStateHook,
  gameScreenProps: {
    game: GameStateHook;
    onMenuClick: () => void;
    onHowToPlayClick: () => void;
    onLibraryClick: () => void;
  },
  handleBackToMenu: () => void,
  mode: GameMode,
  initFromSeed: (seed: string, targetState?: GameState) => boolean,
): RouteConfig[] => [
  {
    element: <ConsoleView game={game} />,
    children: [
      { path: CONSOLE_ROUTES.mmo, element: <GameMmoScreen game={game} /> },

      {
        path: CONSOLE_ROUTES.console,
        element: <GameConsoleScreen game={game} />,
      },

      {
        path: "/console/game",
        element: <GameModeScreen {...gameScreenProps} />,
      },

      {
        path: CONSOLE_ROUTES.mode,
        element: <GameModeScreen {...gameScreenProps} />,
      },

      {
        path: CONSOLE_ROUTES.gamemaster,
        element: <GamemasterScreen game={game} />,
      },

      {
        path: CONSOLE_ROUTES.index,
        element: <GameScreen {...gameScreenProps} />,
      },

      {
        path: CONSOLE_ROUTES.detail,
        element: <GameScreen {...gameScreenProps} />,
      },

      {
        path: CONSOLE_ROUTES.library,
        element: (
          <LibraryScreen
            onBack={handleBackToMenu}
            onLoadSeed={(seed: string) => initFromSeed(seed)}
            onEditInZen={(seed: string) =>
              initFromSeed(seed, PHASES.ZEN_GARDEN)
            }
            activeMode={mode}
          />
        ),
      },
    ],
  },
];
