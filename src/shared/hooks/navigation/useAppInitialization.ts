import { useEffect, useState } from "react";
import { useLocation, useNavigate, matchPath } from "react-router-dom";
import { useGameState } from "../engine/useGameState";
import { ROUTES } from "@/app/routes";
import { DEFAULT_SEEDS } from "@/app/core/setup/seeds";
import { PHASES } from "@constants/game";
import type { SeedItem, GameMode } from "@tc.types";

export const useAppInitialization = () => {
  const game = useGameState();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    gameState,
    multiplayer,
    initFromSeed,
    initGameWithPreset,
    startGame,
    setPhase,
  } = game;

  const match = matchPath(ROUTES.game.detail, location.pathname);
  const modeMatch = matchPath(ROUTES.game.mode, location.pathname);
  const routeRoomId = match?.params.roomId;
  const routeMode = modeMatch?.params.mode as GameMode;

  useEffect(() => {
    const isSpecialMode =
      routeRoomId === "mmo" ||
      routeRoomId === PHASES.GAMEMASTER ||
      routeRoomId === "board";
    const shouldJoin =
      routeRoomId && !isSpecialMode && multiplayer.roomId !== routeRoomId;

    if (shouldJoin) {
      multiplayer.joinGame(routeRoomId);
    }
  }, [routeRoomId, multiplayer]);

  useEffect(() => {
    const isGameRoute = location.pathname.startsWith(ROUTES.game.index);
    if (!isGameRoute) return;

    if (routeMode && gameState === PHASES.GAMEMASTER) {
      const urlParams = new URLSearchParams(window.location.search);
      const seed = urlParams.get("seed");
      if (seed) initFromSeed(seed);
      else initGameWithPreset(routeMode, null);
      setTimeout(() => startGame(), 100);
      return;
    }

    if (location.pathname === ROUTES.game.mmo) {
      if (gameState === PHASES.MENU) {
        const urlParams = new URLSearchParams(window.location.search);
        const seed = urlParams.get("seed");
        if (seed) initFromSeed(seed);
        else initGameWithPreset("2p-ns", null);
        setTimeout(() => startGame(), 100);
      }
      return;
    }

    const isZenOrMaster =
      location.pathname === ROUTES.zen ||
      location.pathname === ROUTES.console.gamemaster;
    if (isZenOrMaster && gameState === PHASES.MENU) {
      initGameWithPreset("4p", "zen-garden");
      setTimeout(() => startGame(), 100);
    }
  }, [
    gameState,
    location.pathname,
    initFromSeed,
    initGameWithPreset,
    startGame,
    routeMode,
  ]);

  useEffect(() => {
    const isBaseGameRoute = location.pathname === ROUTES.game.index;
    const isNotMmo = !location.pathname.startsWith(ROUTES.game.mmo);
    if (isBaseGameRoute && isNotMmo && gameState === PHASES.MENU) {
      navigate(ROUTES.home);
    }
  }, [location.pathname, gameState, navigate]);

  const [seeds] = useState<SeedItem[]>(() => {
    const stored = localStorage.getItem("trenchess_seeds");
    let loadedSeeds: SeedItem[] = [];
    if (stored) {
      try {
        loadedSeeds = JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse seeds from localStorage", e);
      }
    }
    return [...loadedSeeds.reverse(), ...DEFAULT_SEEDS];
  });
  const [previewSeedIndex, setPreviewSeedIndex] = useState(0);

  const handleBackToMenu = () => {
    setPhase(PHASES.GAMEMASTER);
    navigate(ROUTES.home);
  };

  return {
    game,
    seeds,
    previewSeedIndex,
    setPreviewSeedIndex,
    handleBackToMenu,
  };
};
