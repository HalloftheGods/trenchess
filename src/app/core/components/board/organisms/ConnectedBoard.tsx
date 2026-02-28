import React from "react";
import { GameBoard } from "../templates/GameBoard";
import { PHASES } from "@constants/game";
import type { GameStateHook } from "@tc.types";
import type { BoardProps } from "@tc.types/game/ux/BoardProps";

interface ConnectedBoardProps {
  game: GameStateHook;
}

export const ConnectedBoard: React.FC<ConnectedBoardProps> = ({ game }) => {
  const isGM = game.gameState === PHASES.GAMEMASTER;

  const {
    isFlipped,
    localPlayerName,
    pieceStyle,
    board,
    terrain,
    mode,
    gameState,
    turn,
    winner,
    winnerReason,
    inCheck,
    lastMove,
    selectedCell,
    hoveredCell,
    validMoves,
    previewMoves,
    placementPiece,
    placementTerrain,
    setupMode,
    getIcon,
    getPlayerDisplayName,
    handleCellClick,
    handleCellHover,
    handleZenGardenClick,
    handleZenGardenHover,
    setHoveredCell,
    setPreviewMoves,
    setGameState,
  } = game;

  const boardProps: BoardProps = {
    identity: {
      isFlipped,
      localPlayerName,
      pieceStyle,
    },
    geometry: {
      board,
      terrain,
    },
    tactical: {
      mode,
      gameState,
      turn,
      winner,
      winnerReason,
      inCheck,
      lastMove,
    },
    selection: {
      selectedCell,
      hoveredCell,
      validMoves,
      previewMoves,
    },
    placement: {
      placementPiece,
      placementTerrain,
      setupMode,
    },
    callbacks: {
      getIcon,
      getPlayerDisplayName,
      handleCellClick: (r, c) =>
        isGM ? handleZenGardenClick(r, c) : handleCellClick(r, c),
      handleCellHover: (r, c) =>
        isGM ? handleZenGardenHover(r, c) : handleCellHover(r, c),
      setHoveredCell,
      setPreviewMoves,
      setGameState,
    },
  };

  return <GameBoard {...boardProps} />;
};
