import React, { useMemo } from "react";
import { SpectatorLayout } from "../shared/components/templates/SpectatorLayout";
import Header from "@/shared/components/organisms/Header";
import GameBoard from "@/client/game/shared/components/organisms/GameBoard";
import Shoutbox from "@/client/game/shared/components/organisms/Shoutbox";
import GameStateDebug from "../shared/components/molecules/GameStateDebug";
import type { useGameState } from "@hooks/useGameState";
import { INITIAL_ARMY, TERRAIN_TYPES, TERRAIN_INTEL } from "@constants";

interface SpectatorViewProps {
  game: ReturnType<typeof useGameState>;
  onMenuClick: () => void;
  onHowToPlayClick: () => void;
  onLibraryClick: () => void;
}

/**
 * Spectator view: read-only game observation with chat.
 * No deployment controls — spectators watch the action unfold.
 */
const SpectatorView: React.FC<SpectatorViewProps> = ({
  game,
  onMenuClick,
  onHowToPlayClick,
  onLibraryClick,
}) => {
  const perspectivePlayerId = game.turn;

  const inventoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    const playerInventory = game.inventory[perspectivePlayerId] || [];
    INITIAL_ARMY.forEach((unit) => {
      counts[unit.type] = playerInventory.filter(
        (type: string) => type === unit.type,
      ).length;
    });
    return counts;
  }, [game.inventory, perspectivePlayerId]);

  const terrainInventoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    const terrainTypesToCount = [
      TERRAIN_TYPES.TREES,
      TERRAIN_TYPES.PONDS,
      TERRAIN_TYPES.RUBBLE,
      TERRAIN_TYPES.DESERT,
    ];
    const playerTerrainInventory =
      game.terrainInventory[perspectivePlayerId] || [];
    terrainTypesToCount.forEach((terrainType) => {
      const label =
        (TERRAIN_INTEL[terrainType]?.label as string) || terrainType;
      counts[label] = playerTerrainInventory.filter(
        (type: string) => type === terrainType,
      ).length;
    });
    return counts;
  }, [game.terrainInventory, perspectivePlayerId]);

  return (
    <SpectatorLayout
      header={
        <Header
          onMenuClick={onMenuClick}
          onHowToPlayClick={onHowToPlayClick}
          onLibraryClick={onLibraryClick}
          isFlipped={game.isFlipped}
          setIsFlipped={(v) => {
            game.setIsFlipped(v);
            if (game.autoFlip) game.setAutoFlip(false);
          }}
          gameState={game.gameState}
          gameMode={game.mode}
          turn={game.turn}
          activePlayers={game.activePlayers}
          darkMode={game.darkMode}
          pieceStyle={game.pieceStyle}
          toggleTheme={game.toggleTheme}
          togglePieceStyle={game.togglePieceStyle}
          onZenGarden={() => game.setGameState("zen-garden")}
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
          selectedCell={null}
          hoveredCell={null}
          validMoves={[]}
          previewMoves={[]}
          placementPiece={null}
          placementTerrain={null}
          setupMode={game.setupMode}
          winner={game.winner}
          winnerReason={game.winnerReason}
          inCheck={game.inCheck}
          lastMove={game.lastMove}
          getIcon={game.getIcon}
          getPlayerDisplayName={game.getPlayerDisplayName}
          handleCellClick={() => {}}
          handleCellHover={() => {}}
          setHoveredCell={() => {}}
          setPreviewMoves={() => {}}
          setGameState={game.setGameState}
          isFlipped={game.isFlipped}
          localPlayerName={game.localPlayerName}
        />
      }
      shoutbox={
        <Shoutbox multiplayer={game.multiplayer} darkMode={game.darkMode} />
      }
      debugPanel={
        <GameStateDebug
          gameState={game.gameState}
          mode={game.mode}
          turn={game.turn}
          setupMode={game.setupMode}
          activePlayers={game.activePlayers}
          placementPiece={null}
          placementTerrain={null}
          isFlipped={game.isFlipped}
          getPlayerDisplayName={game.getPlayerDisplayName}
          inventoryCounts={inventoryCounts}
          terrainInventoryCounts={terrainInventoryCounts}
          placedCount={0}
          maxPlacement={0}
          setGameState={game.setGameState}
          setMode={game.setMode}
          setTurn={game.setTurn}
          setSetupMode={game.setSetupMode}
          readyPlayers={game.readyPlayers}
          setReadyPlayers={game.setReadyPlayers}
          playerTypes={game.playerTypes}
          setPlayerTypes={game.setPlayerTypes}
          localPlayerName={game.localPlayerName}
          setLocalPlayerName={game.setLocalPlayerName}
          setActivePlayers={game.setActivePlayers}
          showBgDebug={game.showBgDebug}
          setShowBgDebug={game.setShowBgDebug}
          bgioState={game.bgioState}
          isSheet={true}
        />
      }
    />
  );
};

export default SpectatorView;
