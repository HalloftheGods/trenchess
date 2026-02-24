import React from "react";
import { MmoLayout } from "./components/templates/MmoLayout";
import GameBoard from "./components/organisms/GameBoard";
import MmoActionBar from "./components/organisms/MmoActionBar";
import GameStateDebug from "./components/molecules/GameStateDebug";

import { useRouteContext } from "@/route.context";
import { useDeployment } from "@hooks/useDeployment";
import { INITIAL_ARMY } from "@/constants";
import { TERRAIN_TYPES, TERRAIN_INTEL } from "@/constants";
import { getPlayerCells } from "@/core/setup/setupLogic";
import { MAX_TERRAIN_PER_PLAYER } from "@/constants";
import { getServerUrl } from "@hooks/useMultiplayer";
import type {
  GameStateHook,
  GameMode,
  TerrainType,
  PieceType,
} from "@/shared/types";
import { GameStartOverlay, ReadyUpPanel } from "./components";

interface MmoViewProps {
  game: GameStateHook;
}

const MmoView: React.FC<MmoViewProps> = ({ game }) => {
  const ctx = useRouteContext();
  const darkMode = ctx.darkMode;
  const pieceStyle = ctx.pieceStyle;
  const toggleTheme = ctx.toggleTheme ?? (() => {});
  const togglePieceStyle = ctx.togglePieceStyle ?? (() => {});

  const isOnline = !!game.multiplayer.roomId;
  const perspectivePlayerId = isOnline ? game.localPlayerName : game.turn;

  // Local: show overlay when ALL players have placed everything
  // Online: show overlay when THIS player has placed everything
  const myPlayerId = isOnline ? game.localPlayerName : null;

  const isAllPlacedLocally = !isOnline && game.isAllPlaced;

  const isMyPlayerPlaced =
    isOnline && !!myPlayerId && game.isPlayerReady(myPlayerId);

  const isMyPlayerLocked =
    isOnline && !!myPlayerId && !!game.readyPlayers[myPlayerId];

  const showOverlay =
    game.gameState === "setup" && (isAllPlacedLocally || isMyPlayerPlaced);

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

  const inventoryCounts: Record<string, number> = {};
  const updateUnitCounts = (unit: ArmyUnit) => {
    const unitType = unit.type;
    const playerInventory = game.inventory[perspectivePlayerId] || [];
    const count = playerInventory.filter((type: string) => type === unitType).length;
    inventoryCounts[unitType] = count;
  };
  INITIAL_ARMY.forEach(updateUnitCounts);

  const terrainInventoryCounts: Record<string, number> = {};
  const terrainTypesToCount = [
    TERRAIN_TYPES.TREES,
    TERRAIN_TYPES.PONDS,
    TERRAIN_TYPES.RUBBLE,
    TERRAIN_TYPES.DESERT,
  ];

  const updateTerrainCounts = (terrainType: TerrainType) => {
    const label = TERRAIN_INTEL[terrainType]?.label || terrainType;
    const playerTerrainInventory = game.terrainInventory[perspectivePlayerId] || [];
    const count = playerTerrainInventory.filter((type: string) => type === terrainType).length;
    terrainInventoryCounts[label] = count;
  };
  terrainTypesToCount.forEach(updateTerrainCounts);

  return (
    <MmoLayout
      darkMode={darkMode}
      onLogoClick={ctx.onLogoClick}
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
          onlineInfo={
            isOnline
              ? {
                  roomId: game.multiplayer.roomId,
                  playerIndex: game.multiplayer.playerIndex,
                  isHost: game.multiplayer.isHost,
                  isConnected: game.multiplayer.isConnected,
                  players: game.multiplayer.players,
                  serverUrl: getServerUrl(),
                }
              : undefined
          }
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
          gameState={game.gameState}
          darkMode={darkMode}
          pieceStyle={pieceStyle}
          toggleTheme={toggleTheme}
          togglePieceStyle={togglePieceStyle}
          getIcon={game.getIcon}
          turn={game.turn}
          activePlayers={game.activePlayers}
          inventory={game.inventory}
          placementPiece={game.placementPiece}
          placementTerrain={game.placementTerrain}
          setPlacementPiece={game.setPlacementPiece}
          setPlacementTerrain={game.setPlacementTerrain}
          setSetupMode={game.setSetupMode}
          placedCount={placedCount}
          maxPlacement={maxPlacement}
          randomizeTerrain={game.randomizeTerrain}
          randomizeUnits={game.randomizeUnits}
          setClassicalFormation={game.setClassicalFormation}
          generateElementalTerrain={game.generateElementalTerrain}
        />
      }
      leftPanel={
        <div className="flex flex-col justify-between h-full">
          {["red", "green"].map((expectedPid: string) => {
            const pid = game.activePlayers.includes(expectedPid)
              ? expectedPid
              : undefined;
            if (!pid)
              return <div key={`empty-${expectedPid}`} className="flex-1" />;

            const myCells = getPlayerCells(pid, game.mode);
            let pPlacedCount = 0;
            for (const [r, c] of myCells) {
              if (game.terrain[r] && game.terrain[r][c] !== TERRAIN_TYPES.FLAT)
                pPlacedCount++;
            }

            const pMaxPlacement =
              game.activePlayers.length === 2
                ? MAX_TERRAIN_PER_PLAYER.TWO_PLAYER
                : MAX_TERRAIN_PER_PLAYER.FOUR_PLAYER;

            const totalUnitCount = INITIAL_ARMY.reduce(
              (sum, unit) => sum + unit.count,
              0,
            );
            const pUnitsPlaced =
              totalUnitCount - (game.inventory[pid] || []).length;

            return (
              <ReadyUpPanel
                key={pid}
                gameState={game.gameState}
                playerID={pid}
                isReady={game.readyPlayers[pid]}
                playerType={game.playerTypes[pid] || "human"}
                setPlayerType={(type) =>
                  game.setPlayerTypes(
                    (prev: Record<string, "human" | "computer">) => ({
                      ...prev,
                      [pid]: type,
                    }),
                  )
                }
                isOnline={isOnline}
                isLocalTurn={game.turn === pid}
                onSelect={() => game.setTurn(pid)}
                placedCount={pPlacedCount}
                maxPlacement={pMaxPlacement}
                unitsPlaced={pUnitsPlaced}
                maxUnits={totalUnitCount}
                onResetTerrain={game.resetTerrain}
                onResetUnits={game.resetUnits}
              />
            );
          })}
        </div>
      }
      rightPanel={
        <div className="flex flex-col justify-between h-full">
          {["yellow", "blue"].map((expectedPid: string) => {
            const pid = game.activePlayers.includes(expectedPid)
              ? expectedPid
              : undefined;
            if (!pid)
              return <div key={`empty-${expectedPid}`} className="flex-1" />;

            const myCells = getPlayerCells(pid, game.mode);
            let pPlacedCount = 0;
            for (const [r, c] of myCells) {
              if (game.terrain[r] && game.terrain[r][c] !== TERRAIN_TYPES.FLAT)
                pPlacedCount++;
            }

            const pMaxPlacement =
              game.activePlayers.length === 2
                ? MAX_TERRAIN_PER_PLAYER.TWO_PLAYER
                : MAX_TERRAIN_PER_PLAYER.FOUR_PLAYER;

            const totalUnitCount = INITIAL_ARMY.reduce(
              (sum, unit) => sum + unit.count,
              0,
            );
            const pUnitsPlaced =
              totalUnitCount - (game.inventory[pid] || []).length;

            return (
              <ReadyUpPanel
                key={pid}
                gameState={game.gameState}
                playerID={pid}
                isReady={game.readyPlayers[pid]}
                playerType={game.playerTypes[pid] || "human"}
                setPlayerType={(type) =>
                  game.setPlayerTypes(
                    (prev: Record<string, "human" | "computer">) => ({
                      ...prev,
                      [pid]: type,
                    }),
                  )
                }
                isOnline={isOnline}
                isLocalTurn={game.turn === pid}
                onSelect={() => game.setTurn(pid)}
                placedCount={pPlacedCount}
                maxPlacement={pMaxPlacement}
                unitsPlaced={pUnitsPlaced}
                maxUnits={totalUnitCount}
                onResetTerrain={game.resetTerrain}
                onResetUnits={game.resetUnits}
              />
            );
          })}
        </div>
      }
    >
      {showOverlay && (
        <GameStartOverlay
          isOnline={isOnline}
          isLocked={isOnline ? isMyPlayerLocked : false}
          onLockIn={() => game.ready()}
          onStart={() => {
            game.ready();
            game.startGame();
          }}
        />
      )}
    </MmoLayout>
  );
};

export default MmoView;
