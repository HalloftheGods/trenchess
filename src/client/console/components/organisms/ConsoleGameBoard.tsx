import React from "react";
import GameBoard from "./GameBoard";
import type { GameStateHook } from "@/shared/types";

interface ConsoleGameBoardProps {
  game: GameStateHook;
}

export const ConsoleGameBoard: React.FC<ConsoleGameBoardProps> = ({ game }) => {
  return (
    <GameBoard
      board={game.board}
      terrain={game.terrain}
      mode={game.mode}
      gameState={game.gameState}
      turn={game.turn}
      pieceStyle={game.pieceStyle}
      selectedCell={game.selectedCell}
      hoveredCell={game.hoveredCell}
      validMoves={game.validMoves}
      previewMoves={game.previewMoves}
      placementPiece={game.placementPiece}
      placementTerrain={game.placementTerrain}
      setupMode={game.setupMode}
      winner={game.winner}
      winnerReason={game.winnerReason}
      inCheck={game.inCheck}
      lastMove={game.lastMove}
      getIcon={game.getIcon}
      getPlayerDisplayName={game.getPlayerDisplayName}
      handleCellClick={(r, c) => game.handleCellClick(r, c)}
      handleCellHover={(r, c) => game.handleCellHover(r, c)}
      setHoveredCell={game.setHoveredCell}
      setPreviewMoves={game.setPreviewMoves}
      setGameState={game.setGameState}
      isFlipped={game.isFlipped}
      localPlayerName={game.localPlayerName}
    />
  );
};
