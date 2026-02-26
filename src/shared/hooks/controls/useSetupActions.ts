import { useCallback } from "react";
import { analytics } from "@/shared/utils/analytics";
import type {
  SetupActions,
  GameCore,
  GameMode,
  TerrainType,
  PieceType,
  BgioClient,
} from "@/shared/types";

/**
 * useSetupActions — Authoritative setup maneuvers.
 * Strictly delegates all actions to boardgame.io moves.
 */
export function useSetupActions(
  core: GameCore,
  setPlacementPiece: React.Dispatch<React.SetStateAction<PieceType | null>>,
  setPlacementTerrain: React.Dispatch<React.SetStateAction<TerrainType | null>>,
  setPreviewMoves: React.Dispatch<React.SetStateAction<number[][]>>,
  bgioClientRef?: React.MutableRefObject<BgioClient | undefined>,
  _authoritativeBoard?: unknown,
  _authoritativeTerrain?: unknown,
): SetupActions {
  const { configState, turnState } = core;
  const { setMode, setGameState } = configState;
  const { setPlayerTypes } = turnState;

  const getClient = useCallback(() => {
    const client = bgioClientRef?.current;
    if (!client) console.warn("useSetupActions: bgioClient is not available");
    return client;
  }, [bgioClientRef]);

  const initGame = useCallback(
    (selectedMode: GameMode) => {
      const client = getClient();
      if (!client) return;

      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.delete("seed");
        window.history.pushState({}, "", url.toString());
      }

      client.moves.setMode(selectedMode);
      client.moves.resetToOmega();

      setMode(selectedMode);
      setGameState("setup");
      setPlacementPiece(null);
      setPlacementTerrain(null);
    },
    [getClient, setMode, setGameState, setPlacementPiece, setPlacementTerrain],
  );

  const initGameWithPreset = useCallback(
    (
      selectedMode: GameMode,
      preset: string | null,
      newPlayerTypes?: Record<string, "human" | "computer">,
      _seed?: string,
      _isMercenary?: boolean,
    ) => {
      const client = getClient();
      if (!client) return;

      if (newPlayerTypes) {
        setPlayerTypes((prev) => ({ ...prev, ...newPlayerTypes }));
      }

      client.moves.setMode(selectedMode);

      if (preset === "quick") {
        client.moves.randomizeTerrain();
        client.moves.randomizeUnits();
        setGameState("setup");
      } else if (preset === "classic") {
        client.moves.setClassicalFormation();
        setGameState("setup");
      } else if (preset === "terrainiffic") {
        client.moves.applyChiGarden();
        setGameState("setup");
      } else if (preset === "zen-garden") {
        client.moves.patchG({ isGamemaster: true });
        client.moves.resetToOmega();
        setGameState("gamemaster");
      } else {
        setGameState("setup");
      }

      setMode(selectedMode);
      setPlacementPiece(null);
      setPlacementTerrain(null);
      analytics.trackEvent("Setup", "Init Preset", preset || "custom");
    },
    [
      getClient,
      setPlayerTypes,
      setGameState,
      setMode,
      setPlacementPiece,
      setPlacementTerrain,
    ],
  );

  const randomizeTerrain = useCallback(() => {
    const client = getClient();
    if (client) client.moves.randomizeTerrain();
    setPlacementTerrain(null);
  }, [getClient, setPlacementTerrain]);

  const generateElementalTerrain = useCallback(() => {
    const client = getClient();
    if (client) client.moves.applyChiGarden();
    setPlacementTerrain(null);
  }, [getClient, setPlacementTerrain]);

  const randomizeUnits = useCallback(() => {
    const client = getClient();
    if (client) client.moves.randomizeUnits();
    setPlacementPiece(null);
    setPreviewMoves([]);
  }, [getClient, setPlacementPiece, setPreviewMoves]);

  const setClassicalFormation = useCallback(() => {
    const client = getClient();
    if (client) client.moves.setClassicalFormation();
    setPlacementPiece(null);
    setPreviewMoves([]);
  }, [getClient, setPlacementPiece, setPreviewMoves]);

  const applyChiGarden = useCallback(() => {
    const client = getClient();
    if (client) client.moves.applyChiGarden();
    setPlacementPiece(null);
    setPlacementTerrain(null);
    setPreviewMoves([]);
  }, [getClient, setPlacementPiece, setPlacementTerrain, setPreviewMoves]);

  const resetToOmega = useCallback(() => {
    const client = getClient();
    if (client) client.moves.resetToOmega();
    setPlacementPiece(null);
    setPlacementTerrain(null);
    setPreviewMoves([]);
  }, [getClient, setPlacementPiece, setPlacementTerrain, setPreviewMoves]);

  const resetTerrain = useCallback(() => {
    const client = getClient();
    if (client) client.moves.resetTerrain();
    setPlacementTerrain(null);
  }, [getClient, setPlacementTerrain]);

  const resetUnits = useCallback(() => {
    const client = getClient();
    if (client) client.moves.resetUnits();
    setPlacementPiece(null);
  }, [getClient, setPlacementPiece]);

  const mirrorBoard = useCallback(() => {
    const client = getClient();
    if (client) client.moves.mirrorBoard();
  }, [getClient]);

  const setModeAction = useCallback(
    (newMode: GameMode) => {
      const client = getClient();
      if (client) client.moves.setMode(newMode);
      setMode(newMode);
    },
    [getClient, setMode],
  );

  return {
    initGame,
    initGameWithPreset,
    randomizeTerrain,
    generateElementalTerrain,
    randomizeUnits,
    setClassicalFormation,
    applyChiGarden,
    resetToOmega,
    mirrorBoard,
    resetTerrain,
    resetUnits,
    setMode: setModeAction,
  };
}
