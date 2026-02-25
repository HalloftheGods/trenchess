import { useMemo, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@constants/routes";
import type {
  GameMode,
  SeedItem,
  GameStateHook,
  ArmyUnit,
  RouteContextType,
  PreviewConfig,
} from "@/shared/types";

interface UseRouteContextValueProps {
  game: GameStateHook;
  seeds: SeedItem[];
  previewSeedIndex: number;
  setPreviewSeedIndex: (index: number) => void;
}

export const useRouteContextValue = ({
  game,
  seeds,
  previewSeedIndex,
  setPreviewSeedIndex,
}: UseRouteContextValueProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isStarting, setIsStarting] = useState(false);

  // Additional UI states managed by context
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [previewConfig, setPreviewConfig] = useState<PreviewConfig>({ mode: game.mode });
  const [, setHoveredTerrain] = useState<string | null>(null);
  const [terrainSeed, setTerrainSeed] = useState<number | undefined>(undefined);
  const [backAction, setBackAction] = useState<{ label?: string; onClick: () => void } | null>(null);

  const {
    darkMode,
    multiplayer,
    pieceStyle,
    getIcon,
    toggleTheme,
    togglePieceStyle,
    setGameState,
    initGameWithPreset,
    startGame,
    mode,
    setMode,
    selectedPreset,
    setSelectedPreset,
    playerTypes,
    setPlayerTypes,
    activePlayers,
  } = game;

  const getIconWrapper: RouteContextType["getIcon"] = useCallback(
    (
      unit: ArmyUnit,
      className?: string,
      size?: number | string,
      filled?: boolean,
    ) => {
      return getIcon(unit, className, size, filled);
    },
    [getIcon],
  );

  const isOnline = !!multiplayer?.roomId;
  const playMode = isOnline
    ? "online"
    : location.pathname.includes("/play/local")
      ? "local"
      : "practice";

  const onTutorial = useCallback(() => {
    setGameState("tutorial");
    navigate(ROUTES.TUTORIAL.url);
  }, [setGameState, navigate]);

  const onLogoClick = useCallback(() => {
    setGameState("menu");
    navigate(ROUTES.HOME.url);
  }, [setGameState, navigate]);

  const onZenGarden = useCallback(() => {
    setIsStarting(true);
    navigate(ROUTES.GAMEMASTER.url);
    setTimeout(() => {
      initGameWithPreset("4p", "zen-garden");
      startGame();
      setTimeout(() => setIsStarting(false), 500);
    }, 1000);
  }, [navigate, initGameWithPreset, startGame]);

  const onGamemaster = useCallback(() => {
    setIsStarting(true);
    navigate(ROUTES.GAMEMASTER.url);
    setTimeout(() => {
      initGameWithPreset("4p", "zen-garden");
      startGame();
      setTimeout(() => setIsStarting(false), 500);
    }, 1000);
  }, [navigate, initGameWithPreset, startGame]);

  const onStartGame = useCallback(
    (
      startGameMode: GameMode,
      preset: string | null,
      playerTypesConfig: Record<string, "human" | "computer">,
      seed?: string,
    ) => {
      setIsStarting(true);

      const target = multiplayer?.roomId
        ? ROUTES.GAME_DETAIL.build({ roomId: multiplayer.roomId })
        : ROUTES.GAME_MODE.build({ mode: startGameMode });

      setMode(startGameMode);
      setGameState("setup");
      navigate(target);

      setTimeout(() => {
        initGameWithPreset(
          startGameMode,
          preset,
          playerTypesConfig,
          seed || "",
        );
        startGame();
        setTimeout(() => setIsStarting(false), 500);
      }, 1000);
    },
    [
      multiplayer,
      setMode,
      setGameState,
      navigate,
      initGameWithPreset,
      startGame,
    ],
  );

  const onCtwGuide = useCallback(
    () => navigate(ROUTES.LEARN_ENDGAME_WORLD.url),
    [navigate],
  );
  const onChessGuide = useCallback(
    () => navigate(ROUTES.LEARN_CHESS.url),
    [navigate],
  );
  const onTrenchGuide = useCallback(
    (t?: string) =>
      navigate(
        t
          ? ROUTES.LEARN_TRENCH_DETAIL.build({ terrain: t })
          : ROUTES.LEARN_TRENCH.url,
      ),
    [navigate],
  );
  const onOpenLibrary = useCallback(
    () => navigate(ROUTES.LIBRARY.url),
    [navigate],
  );

  const setSelectedBoard = useCallback(
    (m: GameMode | null) => m && setMode(m),
    [setMode],
  );

  return useMemo(
    () => ({
      hoveredMenu,
      setHoveredMenu,
      darkMode,
      multiplayer,
      pieceStyle,
      getIcon: getIconWrapper,
      toggleTheme,
      togglePieceStyle,
      onTutorial,
      onLogoClick,
      onZenGarden,
      onGamemaster,
      setPlayerTypes,
      onStartGame,
      isStarting,
      onCtwGuide,
      onChessGuide,
      onTrenchGuide,
      onOpenLibrary,
      selectedBoard: mode,
      setSelectedBoard,
      selectedPreset,
      setSelectedPreset,
      playerConfig: playerTypes,
      activePlayers,
      playMode,
      playerCount: activePlayers.length,
      previewConfig,
      setPreviewConfig,
      setHoveredTerrain: setHoveredTerrain,
      seeds,
      previewSeedIndex,
      setPreviewSeedIndex,
      terrainSeed,
      setTerrainSeed,
      backAction,
      setBackAction,
    }),
    [
      hoveredMenu,
      darkMode,
      multiplayer,
      pieceStyle,
      getIconWrapper,
      toggleTheme,
      togglePieceStyle,
      onTutorial,
      onLogoClick,
      onZenGarden,
      onGamemaster,
      setPlayerTypes,
      onStartGame,
      isStarting,
      onCtwGuide,
      onChessGuide,
      onTrenchGuide,
      onOpenLibrary,
      mode,
      setSelectedBoard,
      selectedPreset,
      setSelectedPreset,
      playerTypes,
      activePlayers,
      playMode,
      previewConfig,
      seeds,
      previewSeedIndex,
      setPreviewSeedIndex,
      terrainSeed,
      backAction,
    ],
  );
};
