import { useMemo } from "react";
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
}: UseRouteContextValueProps): Partial<RouteContextType> => {
  const navigate = useNavigate();
  const location = useLocation();

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

  const getIconWrapper: RouteContextType["getIcon"] = (
    unit: ArmyUnit,
    className?: string,
    size?: number | string,
    filled?: boolean,
  ) => {
    return getIcon(unit, className, size, filled);
  };

  const isOnline = !!multiplayer?.roomId;
  const playMode = isOnline
    ? "online"
    : location.pathname.includes("/play/local")
      ? "local"
      : "practice";

  const onTutorial = () => {
    setGameState("tutorial");
    navigate(ROUTES.TUTORIAL);
  };

  const onLogoClick = () => {
    setGameState("menu");
    navigate(ROUTES.HOME);
  };

  const onZenGarden = () => {
    initGameWithPreset("4p", "zen-garden");
    startGame();
    navigate(ROUTES.GAMEMASTER);
  };

  const onGamemaster = () => {
    initGameWithPreset("4p", "zen-garden");
    startGame();
    navigate(ROUTES.GAMEMASTER);
  };

  const onStartGame = (
    startGameMode: GameMode,
    preset: string | null,
    playerTypesConfig: Record<string, "human" | "computer">,
    seed?: string,
  ) => {
    initGameWithPreset(startGameMode, preset, playerTypesConfig, seed || "");
    startGame();
    const target = multiplayer?.roomId
      ? `${ROUTES.GAME}/${multiplayer.roomId}`
      : ROUTES.GAME_MMO;
    navigate(target);
  };

  const onCtwGuide = () => navigate(ROUTES.LEARN_ENDGAME_WORLD);
  const onChessGuide = () => navigate(ROUTES.LEARN_CHESS);
  const onTrenchGuide = (t?: string) =>
    navigate(t ? `${ROUTES.LEARN_TRENCH}/${t}` : ROUTES.LEARN_TRENCH);
  const onOpenLibrary = () => navigate(ROUTES.LIBRARY);

  const setSelectedBoard = (m: GameMode | null) => m && setMode(m);

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
      onCtwGuide,
      onChessGuide,
      onTrenchGuide,
      onOpenLibrary,
      mode,
      selectedPreset,
      playerTypes,
      activePlayers,
      playMode,
      seeds,
      previewSeedIndex,
      setPreviewSeedIndex,
    ],
  );
};
