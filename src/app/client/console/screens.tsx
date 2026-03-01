import { lazy } from "react";

export const GameMmoScreen = lazy(() => import("@/app/client/console/mmo"));
export const GameConsoleScreen = lazy(
  () => import("@/app/client/console/game/index"),
);
export const GameModeScreen = lazy(
  () => import("@/app/core/screens/GameScreen"),
);
export const GamemasterScreen = lazy(
  () => import("@/app/client/console/gamemaster"),
);
export const GameScreen = lazy(() => import("@/app/core/screens/GameScreen"));
export const LibraryScreen = lazy(
  () => import("@/app/core/components/hud/organisms/SeedLibrary"),
);
