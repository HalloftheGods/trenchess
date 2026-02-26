import type { RouteConfig } from "@/shared/types/route";
import type { GameStateHook, GameMode, GameState } from "@/shared/types";
import { ROUTES } from "@constants/routes";

const GameMmoLazy = ROUTES.GAME_MMO.component(
  () => import("@/client/console/mmo"),
);
const GameConsoleLazy = ROUTES.GAME_CONSOLE.component(
  () => import("@/client/console/game/index"),
);
const GameModeLazy = ROUTES.GAME_MODE.component(
  () => import("@/client/console/screens/GameScreen"),
);
const GamemasterLazy = ROUTES.GAMEMASTER.component(
  () => import("@/client/console/gamemaster"),
);
const GameLazy = ROUTES.GAME.component(
  () => import("@/client/console/screens/GameScreen"),
);
const GameDetailLazy = ROUTES.GAME_DETAIL.component(
  () => import("@/client/console/screens/GameScreen"),
);
const LibraryLazy = ROUTES.LIBRARY.component(
  () => import("@/client/console/components/hud/organisms/SeedLibrary"),
);

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
      ROUTES.GAME_MMO.define(<GameMmoLazy game={game} />),

      ROUTES.GAME_CONSOLE.define(<GameConsoleLazy game={game} />),

      {
        path: "/console/game",
        element: <GameModeLazy {...gameScreenProps} />,
      },

      ROUTES.GAME_MODE.define(<GameModeLazy {...gameScreenProps} />),

      ROUTES.GAMEMASTER.define(<GamemasterLazy game={game} />),

      ROUTES.GAME.define(<GameLazy {...gameScreenProps} />),

      ROUTES.GAME_DETAIL.define(<GameDetailLazy {...gameScreenProps} />),

      ROUTES.LIBRARY.define(
        <LibraryLazy
          onBack={handleBackToMenu}
          onLoadSeed={(seed: string) => initFromSeed(seed)}
          onEditInZen={(seed: string) => initFromSeed(seed, "zen-garden")}
          activeMode={mode}
        />,
      ),
    ],
  },
];
