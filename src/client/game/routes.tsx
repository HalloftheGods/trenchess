import type { RouteConfig } from "@/shared/types/route";
import type { GameStateHook, GameMode, GameState } from "@/shared/types";
import { ROUTES } from "@constants/routes";

const GameMmoLazy = ROUTES.GAME_MMO.component(() => import("@/client/game/mmo"));
const GameModeLazy = ROUTES.GAME_MODE.component(() => import("@/client/game/index"));
const GamemasterLazy = ROUTES.GAMEMASTER.component(() => import("@/client/game/gamemaster/index"));
const GameLazy = ROUTES.GAME.component(() => import("@/client/game/index"));
const GameDetailLazy = ROUTES.GAME_DETAIL.component(() => import("@/client/game/index"));
const LibraryLazy = ROUTES.LIBRARY.component(() => import("@/client/game/shared/components/organisms/SeedLibrary"));

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
  ROUTES.GAME_MMO.define(<GameMmoLazy game={game} />),
  
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
    />
  ),
];
