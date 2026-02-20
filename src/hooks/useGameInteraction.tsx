import { useState, useCallback } from "react";
import { getValidMoves as getValidMovesUtil } from "../utils/gameLogic";
import { getPlayerCells } from "../utils/setupLogic";
import type { useGameCore } from "./useGameCore";
import type { PieceType, TerrainType, BoardPiece } from "../types";
import {
  BOARD_SIZE,
  TERRAIN_TYPES,
  PIECES,
  MAX_TERRAIN_PER_PLAYER,
} from "../constants";
import { canPlaceUnit } from "../utils/setupLogic";

type GameCore = ReturnType<typeof useGameCore>;

export function useGameInteraction(
  core: GameCore,
  onMoveExecuted?: (move: {
    from: [number, number];
    to: [number, number];
  }) => void,
) {
  const {
    gameState,
    mode,
    turn,
    setTurn,
    board,
    setBoard,
    terrain,
    setTerrain,
    inventory,
    setInventory,
    terrainInventory,
    setTerrainInventory,
    activePlayers,
    setActivePlayers,
    setWinner,
    setCapturedBy,
    setupMode,
  } = core;

  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(
    null,
  );
  const [hoveredCell, setHoveredCell] = useState<[number, number] | null>(null);
  const [validMoves, setValidMoves] = useState<number[][]>([]);
  const [previewMoves, setPreviewMoves] = useState<number[][]>([]);

  // Placement State (UI state for setup)
  const [placementPiece, setPlacementPiece] = useState<PieceType | null>(null);
  const [placementTerrain, setPlacementTerrain] = useState<TerrainType | null>(
    null,
  );

  // --- Valid Moves Wrapper ---
  const getValidMoves = useCallback(
    (
      r: number,
      c: number,
      piece: BoardPiece,
      player: string,
      depth = 0,
    ): number[][] => {
      return getValidMovesUtil(
        r,
        c,
        piece,
        player,
        board,
        terrain,
        mode,
        depth,
      );
    },
    [board, terrain, mode],
  );

  // --- Cell Hover (setup preview) ---
  const handleCellHover = (r: number, c: number, overrideTurn?: string) => {
    const startTurn = overrideTurn || turn;

    // Zen Garden Mode Hover Logic
    if (gameState === "zen-garden") {
      // Allow global hover for placement, but check validity

      if (placementPiece === ("TRASH" as any)) {
        if (board[r][c]) setHoveredCell([r, c]);
        else setHoveredCell(null);
        return;
      }

      if (placementTerrain === TERRAIN_TYPES.FLAT) {
        if (terrain[r][c] !== TERRAIN_TYPES.FLAT) setHoveredCell([r, c]);
        else setHoveredCell(null);
        return;
      }

      if (placementPiece) {
        // Enforce inventory limit for hover
        const availableCount = (inventory[startTurn] || []).filter(
          (p) => p === placementPiece,
        ).length;
        if (availableCount <= 0) {
          setHoveredCell(null);
          setPreviewMoves([]);
          return;
        }

        if (!board[r][c]) {
          const targetTerrain = terrain[r][c];

          if (canPlaceUnit(placementPiece, targetTerrain)) {
            setHoveredCell([r, c]);
            const moves = getValidMoves(
              r,
              c,
              { type: placementPiece, player: startTurn },
              startTurn,
            );
            setPreviewMoves(moves);
          } else {
            setHoveredCell(null);
            setPreviewMoves([]);
          }
        } else {
          setHoveredCell(null);
          setPreviewMoves([]);
        }
        return;
      }

      if (placementTerrain) {
        if (!board[r][c]) {
          // Check placement limit for the TARGET ZONE
          const getOwnerOfCell = (tr: number, tc: number) => {
            // simplified logic from getPlayerCells inverse
            if (mode === "2p-ns") return tr < 6 ? "player1" : "player4";
            if (mode === "2p-ew") return tc < 6 ? "player3" : "player2";
            // 4p / 2v2
            if (tr < 6 && tc < 6) return "player1";
            if (tr < 6 && tc >= 6) return "player2";
            if (tr >= 6 && tc < 6) return "player3";
            return "player4";
          };

          const targetOwner = getOwnerOfCell(r, c);

          // Count terrain for that owner
          const ownerCells = getPlayerCells(targetOwner, mode);
          // Recalculate limit
          const maxPlacement =
            activePlayers.length === 2
              ? MAX_TERRAIN_PER_PLAYER.TWO_PLAYER
              : MAX_TERRAIN_PER_PLAYER.FOUR_PLAYER;
          let currentPlaced = 0;
          for (const [pr, pc] of ownerCells) {
            if (terrain[pr][pc] !== TERRAIN_TYPES.FLAT) currentPlaced++;
          }

          if (currentPlaced >= maxPlacement) {
            setHoveredCell(null);
          } else {
            setHoveredCell([r, c]);
          }
        } else {
          setHoveredCell(null);
        }
        return;
      }
      return;
    }

    if (gameState !== "setup" || !placementPiece) {
      setHoveredCell(null);
      setPreviewMoves([]);
      return;
    }

    let isMyArea = false;
    if (mode === "2p-ns") {
      isMyArea = startTurn === "player1" ? r < 6 : r >= 6;
    } else if (mode === "2p-ew") {
      if (startTurn === "player3") isMyArea = c < 6;
      if (startTurn === "player2") isMyArea = c >= 6;
    } else {
      if (startTurn === "player1") isMyArea = r < 6 && c < 6;
      if (startTurn === "player2") isMyArea = r < 6 && c >= 6;
      if (startTurn === "player3") isMyArea = r >= 6 && c < 6;
      if (startTurn === "player4") isMyArea = r >= 6 && c >= 6;
    }

    if (!isMyArea) {
      setHoveredCell(null);
      setPreviewMoves([]);
      return;
    }

    if (board[r][c]) {
      setHoveredCell(null);
      setPreviewMoves([]);
      return;
    }

    const targetTerrain = terrain[r][c];
    let canPlace = true;

    // Check constraints (copied from previous logic)

    if (placementPiece === PIECES.TANK && targetTerrain === TERRAIN_TYPES.TREES)
      canPlace = false;

    if (
      placementPiece === PIECES.HORSEMAN &&
      targetTerrain === TERRAIN_TYPES.TREES
    )
      canPlace = false;

    if (
      placementPiece === PIECES.HORSEMAN &&
      targetTerrain === TERRAIN_TYPES.PONDS
    )
      canPlace = false;

    if (
      placementPiece === PIECES.SNIPER &&
      targetTerrain === TERRAIN_TYPES.PONDS
    )
      canPlace = false;

    if (
      placementPiece === PIECES.TANK &&
      targetTerrain === TERRAIN_TYPES.RUBBLE
    )
      canPlace = false;

    if (
      placementPiece === PIECES.SNIPER &&
      targetTerrain === TERRAIN_TYPES.RUBBLE
    )
      canPlace = false;

    if (canPlace) {
      setHoveredCell([r, c]);
      const moves = getValidMoves(
        r,
        c,
        { type: placementPiece, player: startTurn },
        startTurn,
      );
      setPreviewMoves(moves);
    } else {
      setHoveredCell(null);
      setPreviewMoves([]);
    }
  };

  // --- Move Execution Core ---
  const executeMove = useCallback(
    (
      fromR: number,
      fromC: number,
      toR: number,
      toC: number,
      isAiMove = false,
    ) => {
      const newBoard = board.map((row) => [...row]);
      const captor = turn;
      const captured = newBoard[toR][toC];
      const movingPiece = newBoard[fromR][fromC];

      if (!movingPiece) return; // Should not happen

      newBoard[toR][toC] = movingPiece;
      newBoard[fromR][fromC] = null;

      // --- Pawn Promotion Logic ---
      if (movingPiece.type === PIECES.BOT) {
        let promoted = false;

        // 2P North-South: P1 (Red) -> Row 11, P4 (Blue) -> Row 0
        if (mode === "2p-ns") {
          if (turn === "player1" && toR === BOARD_SIZE - 1) promoted = true;
          if (turn === "player4" && toR === 0) promoted = true;
        }
        // 2P East-West: P3 (Green) -> Col 11, P2 (Yellow) -> Col 0
        else if (mode === "2p-ew") {
          if (turn === "player3" && toC === BOARD_SIZE - 1) promoted = true;
          if (turn === "player2" && toC === 0) promoted = true;
        }
        // 4P / 2v2:
        // P1 (NW) -> R=11 or C=11
        // P2 (NE) -> R=11 or C=0
        // P3 (SW) -> R=0 or C=11
        // P4 (SE) -> R=0 or C=0
        else {
          if (
            turn === "player1" &&
            (toR === BOARD_SIZE - 1 || toC === BOARD_SIZE - 1)
          )
            promoted = true;
          if (turn === "player2" && (toR === BOARD_SIZE - 1 || toC === 0))
            promoted = true;
          if (turn === "player3" && (toR === 0 || toC === BOARD_SIZE - 1))
            promoted = true;
          if (turn === "player4" && (toR === 0 || toC === 0)) promoted = true;
        }

        if (promoted) {
          newBoard[toR][toC] = {
            ...movingPiece,
            type: PIECES.BATTLEKNIGHT as PieceType,
          };
        }
      }

      if (captured) {
        setCapturedBy((prev) => ({
          ...prev,
          [captor]: [...(prev[captor] || []), captured],
        }));
      }

      // Army Transfer Logic (Commander Captured)
      if (captured?.type === PIECES.COMMANDER) {
        const victim = captured.player;
        const remainingPlayers = activePlayers.filter((p) => p !== victim);

        // Transfer all victim's units to captor
        for (let row = 0; row < BOARD_SIZE; row++) {
          for (let col = 0; col < BOARD_SIZE; col++) {
            if (newBoard[row][col]?.player === victim) {
              newBoard[row][col]!.player = captor;
            }
          }
        }

        // Check Win Condition (Last Player Standing)
        if (remainingPlayers.length === 1) {
          setWinner(captor);
        }
        setActivePlayers(remainingPlayers);
      }

      // Desert Rule: Eliminate any piece belonging to the current player
      // that is standing on a DESERT tile, EXCEPT the piece that just moved.
      for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
          const p = newBoard[r][c];
          if (
            p &&
            p.player === turn &&
            terrain[r][c] === TERRAIN_TYPES.DESERT
          ) {
            if (r !== toR || c !== toC) {
              // Piece was left on the desert!
              if (p.type === PIECES.COMMANDER) {
                const victim = p.player;
                const remainingPlayers = activePlayers.filter(
                  (ap) => ap !== victim,
                );
                // The environment claims the army
                for (let row = 0; row < BOARD_SIZE; row++) {
                  for (let col = 0; col < BOARD_SIZE; col++) {
                    if (newBoard[row][col]?.player === victim) {
                      newBoard[row][col] = null;
                    }
                  }
                }
                if (remainingPlayers.length === 1) {
                  setWinner(remainingPlayers[0]);
                }
                setActivePlayers(remainingPlayers);
              } else {
                newBoard[r][c] = null;
              }
            }
          }
        }
      }

      setBoard(newBoard);

      // If human moved, clear selection. If AI moved, we assume caller handles UI or it doesn't matter.
      setSelectedCell(null);
      setValidMoves([]);

      // Next Turn
      const nextIdx = (activePlayers.indexOf(turn) + 1) % activePlayers.length;
      setTurn(activePlayers[nextIdx]);

      if (!isAiMove && onMoveExecuted) {
        onMoveExecuted({ from: [fromR, fromC], to: [toR, toC] });
      }
    },
    [
      board,
      terrain,
      turn,
      activePlayers,
      setBoard,
      setCapturedBy,
      setWinner,
      setActivePlayers,
      setTurn,
      setSelectedCell,
      setValidMoves,
      onMoveExecuted,
    ],
  );

  // --- Cell Click ---
  const handleCellClick = (r: number, c: number, overrideTurn?: string) => {
    const startTurn = overrideTurn || turn;

    // Zen Garden Mode Click Logic
    if (gameState === "zen-garden") {
      // Allow global placement, NO checking isMyArea first for everything

      if (placementPiece === ("TRASH" as any)) {
        // Remove unit
        if (board[r][c]) {
          const removedPiece = board[r][c]!;
          const newBoard = board.map((row) => [...row]);
          newBoard[r][c] = null;
          setBoard(newBoard);

          // Return to inventory
          setInventory((prev) => ({
            ...prev,
            [removedPiece.player]: [
              ...(prev[removedPiece.player] || []),
              removedPiece.type,
            ],
          }));
        }
        return;
      }

      if (placementTerrain === TERRAIN_TYPES.FLAT) {
        // Remove terrain (Eraser) - Though eraser button is gone, this logic can stay or be removed.
        // Keeping it doesn't hurt if we ever re-enable eraser or hit this state somehow.
        if (terrain[r][c] !== TERRAIN_TYPES.FLAT) {
          const newTerrain = terrain.map((row) => [...row]);
          newTerrain[r][c] = TERRAIN_TYPES.FLAT as TerrainType;
          setTerrain(newTerrain);
        }
        return;
      }

      if (placementTerrain) {
        if (!board[r][c]) {
          // Toggle off if clicking same terrain
          if (terrain[r][c] === placementTerrain) {
            const newTerrain = terrain.map((row) => [...row]);
            newTerrain[r][c] = TERRAIN_TYPES.FLAT as TerrainType;
            setTerrain(newTerrain);
            return;
          }

          // Check placement limit
          // CALCULATE OWNER OF TARGET CELL
          const getOwnerOfCell = (tr: number, tc: number) => {
            // simplified logic from getPlayerCells inverse
            if (mode === "2p-ns") return tr < 6 ? "player1" : "player4";
            if (mode === "2p-ew") return tc < 6 ? "player3" : "player2";
            // 4p / 2v2
            if (tr < 6 && tc < 6) return "player1";
            if (tr < 6 && tc >= 6) return "player2";
            if (tr >= 6 && tc < 6) return "player3";
            return "player4";
          };
          const targetOwner = getOwnerOfCell(r, c);
          const ownerCells = getPlayerCells(targetOwner, mode);

          const maxPlacement =
            activePlayers.length === 2
              ? MAX_TERRAIN_PER_PLAYER.TWO_PLAYER
              : MAX_TERRAIN_PER_PLAYER.FOUR_PLAYER;
          let currentPlaced = 0;
          for (const [pr, pc] of ownerCells) {
            if (terrain[pr][pc] !== TERRAIN_TYPES.FLAT) currentPlaced++;
          }
          // If toggling from one terrain to another, limit doesn't increase, so it's fine.
          // But if placing new, check limit.
          if (
            terrain[r][c] === TERRAIN_TYPES.FLAT &&
            currentPlaced >= maxPlacement
          )
            return;

          const newTerrain = terrain.map((row) => [...row]);
          newTerrain[r][c] = placementTerrain;
          setTerrain(newTerrain);
        }
        return;
      }

      if (placementPiece) {
        const availableCount = (inventory[startTurn] || []).filter(
          (p) => p === placementPiece,
        ).length;

        // Toggle off if clicking same piece
        if (
          board[r][c] &&
          board[r][c]?.type === placementPiece &&
          board[r][c]?.player === startTurn
        ) {
          const newBoard = board.map((row) => [...row]);
          newBoard[r][c] = null;
          setBoard(newBoard);

          // Return to inventory
          setInventory((prev) => ({
            ...prev,
            [startTurn]: [...(prev[startTurn] || []), placementPiece],
          }));
          return;
        }

        if (!board[r][c]) {
          if (
            availableCount > 0 &&
            canPlaceUnit(placementPiece, terrain[r][c])
          ) {
            const newBoard = board.map((row) => [...row]);
            newBoard[r][c] = { type: placementPiece, player: startTurn };
            setBoard(newBoard);

            // Remove from inventory
            setInventory((prev) => {
              const newInv = { ...prev };
              const idx = (newInv[startTurn] || []).indexOf(placementPiece);
              if (idx !== -1) {
                const newList = [...newInv[startTurn]];
                newList.splice(idx, 1);
                newInv[startTurn] = newList;
              }
              return newInv;
            });

            // Check if we need to clear placementPiece if no more left
            if (availableCount - 1 === 0) {
              setPlacementPiece(null);
            }
          }
        }
        return;
      }

      // If clicking existing piece with nothing selected -> Remove it
      if (board[r][c]) {
        // Only allow removing (picking up) valid pieces?
        // In Zen, we can probably pick up anyone's?
        // But let's restrict to owner for inventory sync simplicity?
        // Or just add to that player's inventory.
        const removedPiece = board[r][c]!;

        const newBoard = board.map((row) => [...row]);
        newBoard[r][c] = null;
        setBoard(newBoard);

        setInventory((prev) => ({
          ...prev,
          [removedPiece.player]: [
            ...(prev[removedPiece.player] || []),
            removedPiece.type,
          ],
        }));
      }
      return;
    }

    if (gameState === "setup") {
      let isMyArea = false;
      if (mode === "2p-ns") {
        isMyArea = startTurn === "player1" ? r < 6 : r >= 6;
      } else if (mode === "2p-ew") {
        if (startTurn === "player3") isMyArea = c < 6;
        if (startTurn === "player2") isMyArea = c >= 6;
      } else {
        if (startTurn === "player1") isMyArea = r < 6 && c < 6;
        if (startTurn === "player2") isMyArea = r < 6 && c >= 6;
        if (startTurn === "player3") isMyArea = r >= 6 && c < 6;
        if (startTurn === "player4") isMyArea = r >= 6 && c >= 6;
      }

      if (!isMyArea) return;

      if (setupMode === "terrain") {
        const currentTerrain = terrain[r][c];
        if (currentTerrain !== TERRAIN_TYPES.FLAT) {
          const newTerrain = terrain.map((row) => [...row]);
          newTerrain[r][c] = TERRAIN_TYPES.FLAT as TerrainType;
          setTerrain(newTerrain);
          setTerrainInventory((prev) => ({
            ...prev,
            [startTurn]: [...(prev[startTurn] || []), currentTerrain],
          }));
        } else if (placementTerrain && !board[r][c]) {
          // Check placement limit
          const maxPlacement =
            activePlayers.length === 2
              ? MAX_TERRAIN_PER_PLAYER.TWO_PLAYER
              : MAX_TERRAIN_PER_PLAYER.FOUR_PLAYER;
          const myCells = getPlayerCells(startTurn, mode);
          let currentPlaced = 0;
          for (const [pr, pc] of myCells) {
            if (terrain[pr][pc] !== TERRAIN_TYPES.FLAT) currentPlaced++;
          }

          if (currentPlaced >= maxPlacement) {
            // Limit reached
            return;
          }

          const tInv = { ...terrainInventory };
          const idx = (tInv[startTurn] || []).indexOf(placementTerrain);
          if (idx === -1) return;
          tInv[startTurn].splice(idx, 1);
          const newTerrain = terrain.map((row) => [...row]);
          newTerrain[r][c] = placementTerrain;
          setTerrain(newTerrain);
          setTerrainInventory(tInv);
          const remaining = tInv[startTurn].filter(
            (t) => t === placementTerrain,
          ).length;
          if (remaining === 0) setPlacementTerrain(null);
        }
        return;
      }

      if (placementPiece) {
        if (board[r][c]) return;

        const targetTerrain = terrain[r][c];
        // Reuse validation logic if possible or copy
        // ... (Logic same as hover)
        if (
          placementPiece === PIECES.TANK &&
          targetTerrain === TERRAIN_TYPES.TREES
        )
          return;
        if (
          placementPiece === PIECES.HORSEMAN &&
          targetTerrain === TERRAIN_TYPES.TREES
        )
          return;
        if (
          placementPiece === PIECES.HORSEMAN &&
          targetTerrain === TERRAIN_TYPES.PONDS
        )
          return;
        if (
          placementPiece === PIECES.SNIPER &&
          targetTerrain === TERRAIN_TYPES.PONDS
        )
          return;
        if (
          placementPiece === PIECES.TANK &&
          targetTerrain === TERRAIN_TYPES.RUBBLE
        )
          return;
        if (
          placementPiece === PIECES.SNIPER &&
          targetTerrain === TERRAIN_TYPES.RUBBLE
        )
          return;

        const newBoard = [...board.map((row) => [...row])];
        newBoard[r][c] = { type: placementPiece, player: startTurn };
        setBoard(newBoard);
        setPreviewMoves([]);
        const newInv = { ...inventory };
        const idx = newInv[startTurn].indexOf(placementPiece);
        newInv[startTurn].splice(idx, 1);
        setInventory(newInv);
        const remaining = newInv[startTurn].filter(
          (u) => u === placementPiece,
        ).length;
        if (remaining === 0) setPlacementPiece(null);
      } else if (board[r][c] && board[r][c]!.player === startTurn) {
        const piece = board[r][c]!.type;
        const newBoard = [...board.map((row) => [...row])];
        newBoard[r][c] = null;
        setBoard(newBoard);
        setPreviewMoves([]);
        setInventory((prev) => ({
          ...prev,
          [startTurn]: [...(prev[startTurn] || []), piece],
        }));
      }
      return;
    }

    if (selectedCell) {
      const [sr, sc] = selectedCell;
      if (validMoves.some(([vr, vc]) => vr === r && vc === c)) {
        executeMove(sr, sc, r, c);
      } else {
        setSelectedCell(null);
        setValidMoves([]);
      }
    } else {
      const piece = board[r][c];
      // Only allow selection if it's YOUR turn (no concurrent play yet)
      // Play mode always enforces 'turn'
      if (piece && piece.player === turn) {
        setSelectedCell([r, c]);
        setValidMoves(getValidMoves(r, c, piece, turn));
      }
    }
  };

  return {
    selectedCell,
    setSelectedCell,
    hoveredCell,
    setHoveredCell,
    validMoves,
    setValidMoves,
    previewMoves,
    setPreviewMoves,
    placementPiece,
    setPlacementPiece,
    placementTerrain,
    setPlacementTerrain,
    handleCellHover,
    handleCellClick,
    executeMove,
  };
}
