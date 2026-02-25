import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/App.routes";
import type { GameMode, SeedItem, GameStateHook } from "@/shared/types";
import type { useGameState } from "./useGameState";

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

  const {
    multiplayer,
    darkMode,
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

  return useMemo(() => {
    const isOnline = !!multiplayer?.roomId;
    const playMode = isOnline
      ? "online"
      : location.pathname.includes("/play/local")
        ? "local"
        : "practice";

    return {
      darkMode,
      multiplayer,
      pieceStyle,
      getIcon,
      toggleTheme,
      togglePieceStyle,
      onTutorial: () => {
        setGameState("tutorial");
        navigate(ROUTES.TUTORIAL);
      },
      onLogoClick: () => {
        setGameState("menu");
        navigate(ROUTES.HOME);
      },
      onZenGarden: () => {
        initGameWithPreset("4p", "zen-garden");
        startGame();
        navigate(ROUTES.GAMEMASTER);
      },
      onGamemaster: () => {
        initGameWithPreset("4p", "zen-garden");
        startGame();
        navigate(ROUTES.GAMEMASTER);
      },
      onStartGame: (
        startGameMode: GameMode,
        preset: string | null,
        playerTypesConfig: Record<string, "human" | "computer">,
        seed?: string,
      ) => {
        initGameWithPreset(
          startGameMode,
          preset,
          playerTypesConfig,
          seed || "",
        );
        startGame();
        const target = multiplayer?.roomId
          ? `${ROUTES.GAME}/${multiplayer.roomId}`
          : ROUTES.GAME_MMO;
        navigate(target);
      },
      onCtwGuide: () => navigate(ROUTES.LEARN_ENDGAME_WORLD),
      onChessGuide: () => navigate(ROUTES.LEARN_CHESS),
      onTrenchGuide: (t?: string) =>
        navigate(t ? `${ROUTES.LEARN_TRENCH}/${t}` : ROUTES.LEARN_TRENCH),
      onOpenLibrary: () => navigate(ROUTES.LIBRARY),
      selectedBoard: mode,
      setSelectedBoard: (m: GameMode | null) => m && setMode(m),
      selectedPreset,
      setSelectedPreset: (
        p:
          | "classic"
          | "quick"
          | "terrainiffic"
          | "custom"
          | "zen-garden"
          | null,
      ) => setSelectedPreset(p),
      playerConfig: playerTypes,
      activePlayers,
      playMode,
      playerCount: activePlayers.length,
      previewConfig: { mode },
      seeds,
      previewSeedIndex,
      setPreviewSeedIndex,
    };
  }, [
    multiplayer,
    location.pathname,
    darkMode,
    pieceStyle,
    getIcon,
    toggleTheme,
    togglePieceStyle,
    setGameState,
    navigate,
    initGameWithPreset,
    startGame,
    mode,
    setMode,
    selectedPreset,
    setSelectedPreset,
    playerTypes,
    activePlayers,
    seeds,
    previewSeedIndex,
    setPreviewSeedIndex,
  ]);
};
