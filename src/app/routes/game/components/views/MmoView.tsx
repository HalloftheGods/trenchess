import React from "react";
import { MmoLayout } from "../templates/MmoLayout";
import GameBoard from "../organisms/GameBoard";
import MmoActionBar from "../organisms/MmoActionBar";
import GameStateDebug from "../molecules/GameStateDebug";
import { useRouteContext } from "@/app/context/RouteContext";
import { useDeployment } from "@hooks/useDeployment";
import { INITIAL_ARMY } from "@engineConfigs/unitDetails";
import { TERRAIN_TYPES, TERRAIN_INTEL } from "@engineConfigs/terrainDetails";
import type { useGameState } from "@hooks/useGameState";

interface MmoViewProps {
  game: ReturnType<typeof useGameState>;
}

/**
 * MmoView — the MMO pregame layout.
 * Renders a centered board with the MMO sticky top action bar,
 * fully wired for pregame setup (placement, inventory, terrain).
 */
const MmoView: React.FC<MmoViewProps> = ({ game }) => {
  const ctx = useRouteContext();
  const darkMode = ctx.darkMode;
  const pieceStyle = ctx.pieceStyle;
  const toggleTheme = ctx.toggleTheme ?? (() => {});
  const togglePieceStyle = ctx.togglePieceStyle ?? (() => {});

  const { placedCount, maxPlacement } = useDeployment({
    mode: game.mode,
    gameState: game.gameState,
    terrain: game.terrain,
    setTerrain: game.setTerrain,
    board: game.board,
    setBoard: game.setBoard,
    activePlayers: game.activePlayers,
    turn: game.turn,
    localPlayerName: game.localPlayerName,
    layoutName: game.layoutName,
    setInventory: game.setInventory,
  });

  // Build inventory count maps for debug panel
  const inventoryCounts: Record<string, number> = {};
  INITIAL_ARMY.forEach((unit) => {
    inventoryCounts[unit.type] = (
      game.inventory[game.turn]?.filter((u: string) => u === unit.type) || []
    ).length;
  });

  const terrainInventoryCounts: Record<string, number> = {};
  [
    TERRAIN_TYPES.TREES,
    TERRAIN_TYPES.PONDS,
    TERRAIN_TYPES.RUBBLE,
    TERRAIN_TYPES.DESERT,
  ].forEach((tType) => {
    const label = TERRAIN_INTEL[tType]?.label || tType;
    terrainInventoryCounts[label] = (
      game.terrainInventory[game.turn]?.filter((u: string) => u === tType) || []
    ).length;
  });

  return (
    <MmoLayout
      debugPanel={
        <GameStateDebug
          gameState={game.gameState}
          mode={game.mode}
          turn={game.turn}
          setupMode={game.setupMode}
          activePlayers={game.activePlayers}
          placementPiece={game.placementPiece}
          placementTerrain={game.placementTerrain}
          isFlipped={game.isFlipped}
          getPlayerDisplayName={game.getPlayerDisplayName}
          inventoryCounts={inventoryCounts}
          terrainInventoryCounts={terrainInventoryCounts}
          placedCount={placedCount}
          maxPlacement={maxPlacement}
        />
      }
      gameBoard={
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
      }
      actionBar={
        <MmoActionBar
          darkMode={darkMode}
          pieceStyle={pieceStyle}
          toggleTheme={toggleTheme}
          togglePieceStyle={togglePieceStyle}
          getIcon={game.getIcon}
          turn={game.turn}
          inventory={game.inventory}
          terrainInventory={game.terrainInventory}
          placementPiece={game.placementPiece}
          placementTerrain={game.placementTerrain}
          setPlacementPiece={game.setPlacementPiece}
          setPlacementTerrain={game.setPlacementTerrain}
          setSetupMode={game.setSetupMode}
          placedCount={placedCount}
          maxPlacement={maxPlacement}
          randomizeTerrain={game.randomizeTerrain}
          randomizeUnits={game.randomizeUnits}
          resetTerrain={game.resetTerrain}
          resetUnits={game.resetUnits}
          setClassicalFormation={game.setClassicalFormation}
          generateElementalTerrain={game.generateElementalTerrain}
        />
      }
    />
  );
};

export default MmoView;
