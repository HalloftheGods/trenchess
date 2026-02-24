import React, { useMemo } from "react";
import { MmoLayout } from "../shared/components/templates/MmoLayout";
import GameBoard from "../shared/components/organisms/GameBoard";
import MmoActionBar from "../shared/components/organisms/MmoActionBar";
import GameStateDebug from "../shared/components/molecules/GameStateDebug";

import { useRouteContext } from "@/route.context";
import { useDeployment } from "@/client/game/shared/hooks/useDeployment";
import { INITIAL_ARMY, UNIT_POINTS } from "@/constants";
import { TERRAIN_TYPES, TERRAIN_INTEL } from "@/constants";
import { getPlayerCells } from "@/core/setup/setupLogic";
import { isUnitProtected } from "@/core/mechanics/gameLogic";
import { MAX_TERRAIN_PER_PLAYER } from "@/constants";
import { getServerUrl } from "@hooks/useMultiplayer";
import type { GameStateHook } from "@/shared/types";
import { GameStartOverlay, ReadyUpPanel } from "../shared/components";

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

  const sanctuaryBonuses = useMemo(() => {
    const bonuses: Record<string, number> = {
      red: 0,
      yellow: 0,
      green: 0,
      blue: 0,
    };

    if (!game.board || !game.terrain) return bonuses;

    for (let r = 0; r < game.board.length; r++) {
      for (let c = 0; c < (game.board[r]?.length || 0); c++) {
        const piece = game.board[r][c];
        if (piece) {
          const terrain = game.terrain[r]?.[c];
          if (terrain && isUnitProtected(piece.type, terrain)) {
            bonuses[piece.player] = (bonuses[piece.player] || 0) + 1;
          }
        }
      }
    }
    return bonuses;
  }, [game.board, game.terrain]);

  const teamPowerStats = useMemo(() => {
    const stats: Record<string, { current: number; max: number }> = {
      red: { current: 0, max: 0 },
      yellow: { current: 0, max: 0 },
      green: { current: 0, max: 0 },
      blue: { current: 0, max: 0 },
    };

    const initialTotalPower = INITIAL_ARMY.reduce(
      (sum, unit) => sum + unit.count * (UNIT_POINTS[unit.type] || 0),
      0,
    );

    game.activePlayers.forEach((pid) => {
      stats[pid].max = initialTotalPower;
      // Scan board for current units
      let currentMaterial = 0;
      for (let r = 0; r < game.board.length; r++) {
        for (let c = 0; c < (game.board[r]?.length || 0); c++) {
          const piece = game.board[r][c];
          if (piece && piece.player === pid) {
            currentMaterial += UNIT_POINTS[piece.type] || 0;
          }
        }
      }
      stats[pid].current = currentMaterial + sanctuaryBonuses[pid];
    });

    return stats;
  }, [game.board, game.activePlayers, sanctuaryBonuses]);

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
          isSheet={true}
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
          applyChiGarden={game.applyChiGarden}
          resetToOmega={game.resetToOmega}
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
                currentPower={teamPowerStats[pid].current}
                maxPower={teamPowerStats[pid].max}
                onResetTerrain={game.resetTerrain}
                onResetUnits={game.resetUnits}
                onForfeit={() => game.forfeit(pid)}
                onReady={() => game.ready(pid)}
                capturedPieces={game.capturedBy[pid]}
                desertedPieces={game.bgioState?.G.lostToDesert?.filter((p: any) => p.player === pid) || []}
                getIcon={game.getIcon}
                alignment="left"
                inCheck={game.inCheck && game.turn === pid}
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
                currentPower={teamPowerStats[pid].current}
                maxPower={teamPowerStats[pid].max}
                onResetTerrain={game.resetTerrain}
                onResetUnits={game.resetUnits}
                onForfeit={() => game.forfeit(pid)}
                onReady={() => game.ready(pid)}
                capturedPieces={game.capturedBy[pid]}
                desertedPieces={game.bgioState?.G.lostToDesert?.filter((p: any) => p.player === pid) || []}
                getIcon={game.getIcon}
                alignment="right"
                inCheck={game.inCheck && game.turn === pid}
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
