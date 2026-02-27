import { useMemo, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@constants/routes";
import { PHASES } from "@constants/game";
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
  const [previewConfig, setPreviewConfig] = useState<PreviewConfig>({
    mode: game.mode || null,
  });
  const [, setHoveredTerrain] = useState<string | null>(null);
  const [terrainSeed, setTerrainSeed] = useState<number | undefined>(undefined);
  const [backAction, setBackAction] = useState<{
    label?: string;
    onClick: () => void;
  } | null>(null);

  const {
    darkMode,
    multiplayer,
    pieceStyle,
    getIcon,
    toggleTheme,
    togglePieceStyle,
    initGameWithPreset,
    startGame,
    selectedPreset,
    setSelectedPreset,
    playerTypes,
    setPlayerTypes,
    activePlayers,
    activeMode,
    setPhase, // Now we extract this
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
    setPhase(PHASES.GENESIS);
    navigate(ROUTES.TUTORIAL.url);
  }, [setPhase, navigate]);

  const onLogoClick = useCallback(() => {
    setPhase(PHASES.GENESIS);
    navigate(ROUTES.HOME.url);
  }, [setPhase, navigate]);

  const onZenGarden = useCallback(() => {
    setIsStarting(true);
    navigate(ROUTES.GAME_CONSOLE.build({ style: "zen" }));
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
      initGameWithPreset(activeMode || "4p", "zen-garden");
      startGame();
      setTimeout(() => setIsStarting(false), 500);
    }, 1000);
  }, [navigate, initGameWithPreset, startGame, activeMode]);

  const onStartGame = useCallback(
    (
      startGameMode: GameMode,
      preset: string | null,
      playerTypesConfig: Record<string, "human" | "computer">,
      seed?: string,
      isMercenary?: boolean,
    ) => {
      setIsStarting(true);

      let style = "mmo";
      if (preset === "custom") style = "omega";
      else if (preset === "classic") style = "pi";
      else if (preset === "quick") style = "alpha";
      else if (preset === "terrainiffic") style = "chi";
      else if (preset) style = preset;

      const target = multiplayer?.roomId
        ? ROUTES.GAME_DETAIL.build({ roomId: multiplayer.roomId })
        : ROUTES.GAME_CONSOLE.build({ style });

      navigate(target);

      setTimeout(() => {
        initGameWithPreset(
          startGameMode,
          preset,
          playerTypesConfig,
          seed || "",
          isMercenary,
        );
        startGame();
        setTimeout(() => setIsStarting(false), 500);
      }, 1000);
    },
    [multiplayer, navigate, initGameWithPreset, startGame],
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

  const [selectedBoard, setSelectedBoardState] = useState<GameMode | null>(
    game.mode || null,
  );

  const setSelectedBoard = useCallback((mode: GameMode | null) => {
    setSelectedBoardState(mode);
  }, []);

  const actions = useMemo(
    () => ({
      setHoveredMenu,
      toggleTheme,
      togglePieceStyle,
      onTutorial,
      onLogoClick,
      onZenGarden,
      onGamemaster,
      setPlayerTypes,
      onStartGame,
      onCtwGuide,
      onChessGuide,
      onTrenchGuide,
      onOpenLibrary,
      setSelectedBoard,
      setSelectedPreset,
      setPreviewConfig,
      setHoveredTerrain,
      setPreviewSeedIndex,
      setTerrainSeed,
      setBackAction,
    }),
    [
      toggleTheme,
      togglePieceStyle,
      onTutorial,
      onLogoClick,
      onZenGarden,
      onGamemaster,
      setPlayerTypes,
      onStartGame,
      onCtwGuide,
      onChessGuide,
      onTrenchGuide,
      onOpenLibrary,
      setSelectedBoard,
      setSelectedPreset,
      setPreviewConfig,
      setPreviewSeedIndex,
    ],
  );

  return useMemo(
    () => ({
      ...actions,
      hoveredMenu,
      darkMode,
      multiplayer,
      pieceStyle,
      getIcon: getIconWrapper,
      isStarting,
      selectedBoard: selectedBoard || activeMode,
      selectedPreset,
      playerConfig: playerTypes,
      activePlayers,
      playMode,
      playerCount: activePlayers.length,
      previewConfig,
      seeds,
      previewSeedIndex,
      terrainSeed,
      backAction,
    }),
    [
      actions,
      hoveredMenu,
      darkMode,
      multiplayer,
      pieceStyle,
      getIconWrapper,
      isStarting,
      selectedBoard,
      activeMode,
      selectedPreset,
      playerTypes,
      activePlayers,
      playMode,
      previewConfig,
      seeds,
      previewSeedIndex,
      terrainSeed,
      backAction,
    ],
  );
};
