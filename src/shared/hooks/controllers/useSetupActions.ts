import { useCallback } from "react";
import { analytics } from "@/shared/utilities/analytics";
import { PHASES } from "@constants/game";
import type {
  SetupActions,
  GameCore,
  GameMode,
  TerrainType,
  PieceType,
  BgioClient,
} from "@tc.types";
import { getPlayersForMode } from "@/app/core/setup/territory";

/**
 * useSetupActions — Authoritative setup maneuvers.
 * Strictly delegates all actions to boardgame.io moves.
 */
export function useSetupActions(
  core: GameCore,
  setPlacementPiece: React.Dispatch<React.SetStateAction<PieceType | null>>,
  setPlacementTerrain: React.Dispatch<React.SetStateAction<TerrainType | null>>,
  setPreviewMoves: React.Dispatch<React.SetStateAction<number[][]>>,
  bgioClientRef?: React.RefObject<BgioClient | undefined>,
  _authoritativeBoard?: unknown,
  _authoritativeTerrain?: unknown,
): SetupActions {
  const { turnState } = core;
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
      client.moves.setPhase(PHASES.MAIN);
      client.moves.resetToOmega();

      setPlacementPiece(null);
      setPlacementTerrain(null);
    },
    [getClient, setPlacementPiece, setPlacementTerrain],
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

      if (core.mode !== selectedMode) {
        client.moves.setMode(selectedMode);
      }

      if (preset === "quick" || preset === "alpha") {
        client.moves.setPhase(PHASES.MAIN);
        client.moves.randomizeUnits();
        client.moves.randomizeTerrain();
        getPlayersForMode(selectedMode).forEach((pid) =>
          client.moves.ready(pid),
        );
      } else if (preset === "classic" || preset === "pi") {
        client.moves.setPhase(PHASES.MAIN);
        client.moves.setClassicalFormation();
        getPlayersForMode(selectedMode).forEach((pid) =>
          client.moves.ready(pid),
        );
      } else if (preset === "terrainiffic" || preset === "chi") {
        client.moves.setPhase(PHASES.MAIN);
        client.moves.applyChiGarden();
        getPlayersForMode(selectedMode).forEach((pid) =>
          client.moves.ready(pid),
        );
      } else if (preset === "omega" || preset === "custom") {
        client.moves.setPhase(PHASES.MAIN);
        client.moves.resetToOmega();
      } else if (preset === "zen-garden") {
        client.moves.patchG({ isGamemaster: true });
        client.moves.setPhase(PHASES.GAMEMASTER);
        client.moves.resetToOmega();
      } else {
        client.moves.setPhase(PHASES.MAIN);
      }

      setPlacementPiece(null);
      setPlacementTerrain(null);
      analytics.trackEvent("Setup", "Init Preset", preset || "custom");
    },
    [
      getClient,
      setPlayerTypes,
      setPlacementPiece,
      setPlacementTerrain,
      core.mode,
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
    },
    [getClient],
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
