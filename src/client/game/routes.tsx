import { lazy } from "react";
import type { RouteConfig } from "@/App.routes.tsx";
import type { GameStateHook, GameMode } from "@/shared/types";

export const GAME_PATHS = {
  GAME: "/game",
  GAME_MMO: "/game/mmo",
  GAME_DETAIL: "/game/:roomId",
  GAMEMASTER: "/game/gamemaster",
  LIBRARY: "/library",
} as const;

export const GameLazyRoutes = {
  screen: lazy(() => import("@/client/game/index")),
  mmo: lazy(() => import("@/client/game/mmo")),
  gamemaster: lazy(() => import("@/client/game/gamemaster/index")),
  library: lazy(
    () => import("@/client/game/shared/components/organisms/SeedLibrary"),
  ),
};

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
  initFromSeed: (seed: string, targetState?: string | null) => boolean,
): RouteConfig[] => [
  { path: GAME_PATHS.GAME_MMO, element: <GameLazyRoutes.mmo game={game} /> },
  {
    path: GAME_PATHS.GAMEMASTER,
    element: <GameLazyRoutes.gamemaster game={game} />,
  },
  {
    path: GAME_PATHS.GAME,
    element: <GameLazyRoutes.screen {...gameScreenProps} />,
  },
  {
    path: GAME_PATHS.GAME_DETAIL,
    element: <GameLazyRoutes.screen {...gameScreenProps} />,
  },
  {
    path: GAME_PATHS.LIBRARY,
    element: (
      <GameLazyRoutes.library
        onBack={handleBackToMenu}
        onLoadSeed={(seed) => initFromSeed(seed)}
        onEditInZen={(seed) => initFromSeed(seed, "zen-garden")}
        activeMode={mode}
      />
    ),
  },
];
