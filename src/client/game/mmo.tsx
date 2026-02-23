import React from "react";
import { MmoLayout } from "./components/templates/MmoLayout";
import GameBoard from "./components/organisms/GameBoard";
import MmoActionBar from "./components/organisms/MmoActionBar";
import GameStateDebug from "./components/molecules/GameStateDebug";

import { useRouteContext } from "@/route.context";
import { useDeployment } from "@hooks/useDeployment";
import { INITIAL_ARMY } from "@/core/data/unitDetails";
import { TERRAIN_TYPES, TERRAIN_INTEL } from "@/core/data/terrainDetails";
import { getPlayerCells } from "@/core/setup/setupLogic";
import { MAX_TERRAIN_PER_PLAYER } from "@/core/constants/terrain.constants";
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

const isPlayerFullyPlaced = (
  pid: string,
  terrain: TerrainType[][],
  inventory: Record<string, PieceType[]>,
  mode: GameMode,
  activePlayers: string[],
): boolean => {
  const unitsRemaining = (inventory[pid] || []).length;
  if (unitsRemaining > 0) return false;

  const myCells = getPlayerCells(pid, mode);
  const pMaxPlacement =
    activePlayers.length === 2
      ? MAX_TERRAIN_PER_PLAYER.TWO_PLAYER
      : MAX_TERRAIN_PER_PLAYER.FOUR_PLAYER;

  let terrainCount = 0;
  for (const [r, c] of myCells) {
    if (terrain[r] && terrain[r][c] !== TERRAIN_TYPES.FLAT) terrainCount++;
  }

  return terrainCount >= pMaxPlacement;
};

const MmoView: React.FC<MmoViewProps> = ({ game }) => {
  const ctx = useRouteContext();
  const darkMode = ctx.darkMode;
  const pieceStyle = ctx.pieceStyle;
  const toggleTheme = ctx.toggleTheme ?? (() => {});
  const togglePieceStyle = ctx.togglePieceStyle ?? (() => {});

  const isOnline = !!game.multiplayer.roomId;

  // Local: show overlay when ALL players have placed everything
  // Online: show overlay when THIS player has placed everything
  const myPlayerId = isOnline ? game.localPlayerName : null;

  const isAllPlacedLocally =
    !isOnline &&
    game.activePlayers.length > 0 &&
    game.activePlayers.every((p: string) =>
      isPlayerFullyPlaced(
        p,
        game.terrain,
        game.inventory,
        game.mode,
        game.activePlayers,
      ),
    );

  const isMyPlayerPlaced =
    isOnline &&
    !!myPlayerId &&
    isPlayerFullyPlaced(
      myPlayerId,
      game.terrain,
      game.inventory,
      game.mode,
      game.activePlayers,
    );

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

            const pUnitsPlaced = 16 - (game.inventory[pid] || []).length;

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

            const pUnitsPlaced = 16 - (game.inventory[pid] || []).length;

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
