import type { RouteConfig } from "@tc.types";
import type { GameStateHook, GameMode, GameState } from "@tc.types";
import { PHASES } from "@constants/game";
import { ROUTES } from "@/app/routes";
import {
  GameMmoScreen,
  GameConsoleScreen,
  GameModeScreen,
  GamemasterScreen,
  GameScreen,
  LibraryScreen,
} from "./screens";

import ConsoleView from "./index";

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
      { path: ROUTES.game.mmo, element: <GameMmoScreen game={game} /> },

      {
        path: ROUTES.game.console,
        element: <GameConsoleScreen game={game} />,
      },

      {
        path: "/console/game",
        element: <GameModeScreen {...gameScreenProps} />,
      },

      {
        path: ROUTES.game.mode,
        element: <GameModeScreen {...gameScreenProps} />,
      },

      {
        path: ROUTES.game.gamemaster,
        element: <GamemasterScreen game={game} />,
      },

      {
        path: ROUTES.game.index,
        element: <GameScreen {...gameScreenProps} />,
      },

      {
        path: ROUTES.game.detail,
        element: <GameScreen {...gameScreenProps} />,
      },

      {
        path: ROUTES.game.library,
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
