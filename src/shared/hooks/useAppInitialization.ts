import { useEffect, useState } from "react";
import { useLocation, useNavigate, matchPath } from "react-router-dom";
import { useGameState } from "./useGameState";
import { ROUTES } from "@constants/routes";
import { DEFAULT_SEEDS } from "@/core/setup/seeds";
import type { SeedItem, GameMode } from "@/shared/types";

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
    setGameState,
  } = game;

  const match = matchPath(ROUTES.GAME_DETAIL.path, location.pathname);
  const modeMatch = matchPath(ROUTES.GAME_MODE.path, location.pathname);
  const routeRoomId = match?.params.roomId;
  const routeMode = modeMatch?.params.mode as GameMode;

  // Handle Multiplayer joining from URL
  useEffect(() => {
    const isSpecialMode =
      routeRoomId === "mmo" ||
      routeRoomId === "gamemaster" ||
      routeRoomId === "board";
    const shouldJoin =
      routeRoomId && !isSpecialMode && multiplayer.roomId !== routeRoomId;

    if (shouldJoin) {
      console.log("App: Room ID detected in URL, joining:", routeRoomId);
      multiplayer.joinGame(routeRoomId);
    }
  }, [routeRoomId, multiplayer]);

  // Auto-start games for special routes
  useEffect(() => {
    const isGameRoute = location.pathname.startsWith(ROUTES.GAME.path);
    if (!isGameRoute) return;

    if (routeMode && gameState === "menu") {
      const urlParams = new URLSearchParams(window.location.search);
      const seed = urlParams.get("seed");
      if (seed) {
        initFromSeed(seed);
      } else {
        initGameWithPreset(routeMode, null);
      }
      setTimeout(() => startGame(), 100);
      return;
    }

    if (location.pathname === ROUTES.GAME_MMO.path) {
      if (gameState === "menu") {
        const urlParams = new URLSearchParams(window.location.search);
        const seed = urlParams.get("seed");
        if (seed) {
          initFromSeed(seed);
        } else {
          initGameWithPreset("2p-ns", null);
        }
        // Small delay to ensure state propagates before engine init
        setTimeout(() => startGame(), 100);
      }
      return;
    }

    const isZenOrMaster =
      location.pathname === ROUTES.ZEN.path ||
      location.pathname === ROUTES.GAMEMASTER.path;
    if (isZenOrMaster && gameState === "menu") {
      initGameWithPreset("4p", "zen-garden");
      setTimeout(() => startGame(), 100);
    }
  }, [
    gameState,
    location.pathname,
    initFromSeed,
    initGameWithPreset,
    startGame,
  ]);

  // Redirect from /game if no game is active
  useEffect(() => {
    const isBaseGameRoute = location.pathname === ROUTES.GAME.path;
    const isNotMmo = !location.pathname.startsWith(ROUTES.GAME_MMO.path);
    if (isBaseGameRoute && isNotMmo && gameState === "menu") {
      navigate(ROUTES.HOME.url);
    }
  }, [location.pathname, gameState, navigate]);

  // Seed Management
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
    setGameState("menu");
    navigate(ROUTES.HOME.url);
  };

  return {
    game,
    seeds,
    previewSeedIndex,
    setPreviewSeedIndex,
    handleBackToMenu,
  };
};
