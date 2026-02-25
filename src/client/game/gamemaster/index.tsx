import React, { useMemo } from "react";
import { GamemasterLayout } from "../shared/components/templates/GamemasterLayout";
import GameBoard from "../shared/components/organisms/GameBoard";
import MmoActionBar from "../shared/components/organisms/MmoActionBar";
import { ReadyUpPanel } from "../shared/components/molecules/ReadyUpPanel";
import { useRouteContext } from "@context";
import { useDeployment } from "@/client/game/shared/hooks/useDeployment";
import { INITIAL_ARMY, UNIT_POINTS, MAX_TERRAIN_PER_PLAYER } from "@/constants";
import { TERRAIN_TYPES } from "@/constants";
import { getPlayerCells } from "@/core/setup/setupLogic";
import { isUnitProtected } from "@/core/mechanics/gameLogic";
import type { GameStateHook, BoardPiece } from "@/shared/types";

interface GamemasterViewProps {
  game: GameStateHook;
}

const GamemasterView: React.FC<GamemasterViewProps> = ({ game }) => {
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

  const handleNextCommander = () => {
    const currentIndex = game.activePlayers.indexOf(game.turn);
    const nextIndex = (currentIndex + 1) % game.activePlayers.length;
    game.setTurn(game.activePlayers[nextIndex]);
  };

  const handleFinishDeployment = () => {
    game.finishGamemaster();
  };

  const renderSidePanel = (
    sidePlayers: string[],
    alignment: "left" | "right",
  ) => (
    <div className="flex flex-col gap-4">
      {sidePlayers.map((expectedPid) => {
        const pid = game.activePlayers.includes(expectedPid)
          ? expectedPid
          : undefined;
        if (!pid)
          return (
            <div key={`empty-${expectedPid}`} className="h-40 invisible" />
          );

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
            isOnline={false}
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
            desertedPieces={
              game.bgioState?.G.lostToDesert?.filter(
                (p: BoardPiece) => p.player === pid,
              ) || []
            }
            getIcon={game.getIcon}
            alignment={alignment}
            onNextCommander={handleNextCommander}
            onFinishDeployment={handleFinishDeployment}
          />
        );
      })}
    </div>
  );

  return (
    <GamemasterLayout
      darkMode={darkMode}
      onLogoClick={ctx.onLogoClick}
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
          handleCellClick={(r, c) => game.handleZenGardenClick(r, c)}
          handleCellHover={(r, c) => game.handleZenGardenHover(r, c)}
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
          perspective={game.isFlipped ? "south" : "north"}
          onPerspectiveChange={(v) => game.setIsFlipped(v === "south")}
          side={game.turn === "red" || game.turn === "green" ? "red" : "blue"}
          onSideChange={(v) => game.setTurn(v)}
          mode={game.mode}
          setMode={game.setMode}
        />
      }
      leftPanel={renderSidePanel(["red", "green"], "left")}
      rightPanel={renderSidePanel(["yellow", "blue"], "right")}
    />
  );
};

export default GamemasterView;
