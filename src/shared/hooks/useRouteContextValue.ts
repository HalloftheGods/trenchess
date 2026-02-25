import { useMemo, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import type {
  GameMode,
  SeedItem,
  GameStateHook,
  ArmyUnit,
  RouteContextType,
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
    navigate(ROUTES.TUTORIAL);
  }, [setGameState, navigate]);

  const onLogoClick = useCallback(() => {
    setGameState("menu");
    navigate(ROUTES.HOME);
  }, [setGameState, navigate]);

  const onZenGarden = useCallback(() => {
    setIsStarting(true);
    navigate(ROUTES.GAMEMASTER);
    setTimeout(() => {
      initGameWithPreset("4p", "zen-garden");
      startGame();
      setTimeout(() => setIsStarting(false), 500);
    }, 1000);
  }, [navigate, initGameWithPreset, startGame]);

  const onGamemaster = useCallback(() => {
    setIsStarting(true);
    navigate(ROUTES.GAMEMASTER);
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

      // Navigate immediately to the game route, where the LoadingScreen will be shown
      const target = multiplayer?.roomId
        ? `${ROUTES.GAME}/${multiplayer.roomId}`
        : ROUTES.GAME_MMO;

      // Set board mode first to ensure preview is correct if needed
      setMode(startGameMode);

      // We use a longer timeout to ensure the LoadingScreen is visible
      // and the navigation has stabilized before the heavy lifting happens
      navigate(target);

      setTimeout(() => {
        initGameWithPreset(
          startGameMode,
          preset,
          playerTypesConfig,
          seed || "",
        );
        startGame();

        // We keep isStarting true for a bit longer to cover engine init
        setTimeout(() => {
          setIsStarting(false);
        }, 500);
      }, 1000);
    },
    [multiplayer, setMode, navigate, initGameWithPreset, startGame],
  );

  const onCtwGuide = useCallback(
    () => navigate(ROUTES.LEARN_ENDGAME_WORLD),
    [navigate],
  );
  const onChessGuide = useCallback(
    () => navigate(ROUTES.LEARN_CHESS),
    [navigate],
  );
  const onTrenchGuide = useCallback(
    (t?: string) =>
      navigate(t ? `${ROUTES.LEARN_TRENCH}/${t}` : ROUTES.LEARN_TRENCH),
    [navigate],
  );
  const onOpenLibrary = useCallback(() => navigate(ROUTES.LIBRARY), [navigate]);

  const setSelectedBoard = useCallback(
    (m: GameMode | null) => m && setMode(m),
    [setMode],
  );

  return useMemo(
    () => ({
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
      previewConfig: { mode },
      seeds,
      previewSeedIndex,
      setPreviewSeedIndex,
    }),
    [
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
      seeds,
      previewSeedIndex,
      setPreviewSeedIndex,
    ],
  );
};
