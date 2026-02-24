import BoardCell from "@/client/game/shared/components/organisms/BoardCell";
import VictoryOverlay from "@/client/game/shared/components/atoms/VictoryOverlay";
import { CheckAlert } from "@/client/game/shared/components/atoms/CheckAlert";
import { EyeOff } from "lucide-react";
import { PLAYER_CONFIGS } from "@/constants";
import type {
  BoardPiece,
  TerrainType,
  GameState,
  ArmyUnit,
  PieceType,
  TrenchessState,
} from "@/shared/types/game";

interface GameBoardProps {
  board: (BoardPiece | null)[][];
  terrain: TerrainType[][];
  mode: string;
  gameState: GameState;
  turn: string;
  pieceStyle: string;
  selectedCell: [number, number] | null;
  hoveredCell: [number, number] | null;
  validMoves: number[][];
  previewMoves: number[][];
  placementPiece: PieceType | null;
  placementTerrain: TerrainType | null;
  setupMode: string;
  winner: string | null;
  winnerReason?: string | null;
  inCheck: boolean;
  lastMove: TrenchessState["lastMove"];
  getIcon: (
    unit: ArmyUnit,
    className?: string,
    size?: number | string,
    filled?: boolean,
  ) => React.ReactNode;
  getPlayerDisplayName: (pid: string) => string;
  handleCellClick: (r: number, c: number) => void;
  handleCellHover: (r: number, c: number) => void;
  setHoveredCell: (cell: [number, number] | null) => void;
  setPreviewMoves: (moves: number[][]) => void;
  setGameState: (state: "menu") => void;
  isFlipped: boolean;
  localPlayerName?: string;
}

const GameBoard: React.FC<GameBoardProps> = ({
  board,
  terrain,
  mode,
  gameState,
  turn,
  pieceStyle,
  selectedCell,
  hoveredCell,
  validMoves,
  previewMoves,
  placementPiece,
  placementTerrain,
  setupMode,
  winner,
  winnerReason,
  inCheck,
  lastMove,
  getIcon,
  getPlayerDisplayName,
  handleCellClick,
  handleCellHover,
  setHoveredCell,
  setPreviewMoves,
  setGameState,
  isFlipped,
  localPlayerName,
}) => {
  const perspectiveTurn = localPlayerName || turn;
  // Compute fog overlay regions for opponent territories during setup
  const fogRegions: {
    top: string;
    left: string;
    width: string;
    height: string;
    label: string;
  }[] = [];
  if (gameState === "setup") {
    if (mode === "2p-ns") {
      // Fog the half that ISN'T the current player's
      if (perspectiveTurn === "red") {
        fogRegions.push({
          top: "50%",
          left: "0",
          width: "100%",
          height: "50%",
          label: "Opponent Territory",
        });
      } else {
        fogRegions.push({
          top: "0",
          left: "0",
          width: "100%",
          height: "50%",
          label: "Opponent Territory",
        });
      }
    } else if (mode === "2p-ew") {
      if (perspectiveTurn === "green") {
        fogRegions.push({
          top: "0",
          left: "50%",
          width: "50%",
          height: "100%",
          label: "Opponent Territory",
        });
      } else {
        fogRegions.push({
          top: "0",
          left: "0",
          width: "50%",
          height: "100%",
          label: "Opponent Territory",
        });
      }
    } else {
      // 4-player: fog all 3 opponent quadrants
      const quadrants = [
        { player: "red", top: "0", left: "0" },
        { player: "yellow", top: "0", left: "50%" },
        { player: "green", top: "50%", left: "0" },
        { player: "blue", top: "50%", left: "50%" },
      ];
      quadrants.forEach((q) => {
        if (q.player !== perspectiveTurn) {
          const cfg = PLAYER_CONFIGS[q.player];
          fogRegions.push({
            top: q.top,
            left: q.left,
            width: "50%",
            height: "50%",
            label: cfg?.name || "Opponent",
          });
        }
      });
    }
  }

  // Guard against uninitialized state (similar to DeploymentPanel)
  if (!board || !board.length || !terrain || !terrain.length) {
    return null;
  }

  // Helper: determine if a specific cell is in opponent territory during setup
  const isCellFogged = (r: number, c: number): boolean => {
    if (gameState !== "setup") return false;
    if (mode === "2p-ns") {
      return perspectiveTurn === "red" ? r >= 6 : r < 6;
    } else if (mode === "2p-ew") {
      if (perspectiveTurn === "green") return c >= 6;
      if (perspectiveTurn === "yellow") return c < 6;
    } else {
      let isMyArea = false;
      if (perspectiveTurn === "red") isMyArea = r < 6 && c < 6;
      if (perspectiveTurn === "yellow") isMyArea = r < 6 && c >= 6;
      if (perspectiveTurn === "green") isMyArea = r >= 6 && c < 6;
      if (perspectiveTurn === "blue") isMyArea = r >= 6 && c >= 6;
      return !isMyArea;
    }
    return false;
  };

  return (
    <div className="xl:col-span-6 flex flex-col items-center order-1 xl:order-2">
      <div className="relative w-full aspect-square max-w-[900px]">
        <div className="absolute -inset-20 bg-gradient-to-tr from-red-600/10 via-transparent to-green-600/10 blur-[120px] pointer-events-none" />

        <div
          onMouseLeave={() => {
            setHoveredCell(null);
            setPreviewMoves([]);
          }}
          className="relative w-full h-full grid grid-cols-12 bg-slate-200 dark:bg-slate-900 border-[8px] border-slate-300 dark:border-slate-950 rounded-2xl overflow-hidden shadow-2xl transition-transform duration-700 ease-in-out"
          style={{ transform: isFlipped ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          {board.flatMap((row, r) =>
            row.map((_, c) => (
              <BoardCell
                key={`${r}-${c}`}
                r={r}
                c={c}
                piece={board[r][c]}
                terrainType={terrain[r][c]}
                mode={mode}
                gameState={gameState}
                turn={perspectiveTurn}
                pieceStyle={pieceStyle}
                selectedCell={selectedCell}
                hoveredCell={hoveredCell}
                validMoves={validMoves}
                previewMoves={previewMoves}
                placementPiece={placementPiece}
                placementTerrain={placementTerrain}
                setupMode={setupMode}
                fogged={isCellFogged(r, c)}
                inCheck={inCheck}
                lastMove={lastMove}
                getIcon={getIcon}
                handleCellClick={handleCellClick}
                handleCellHover={handleCellHover}
                isFlipped={isFlipped}
              />
            )),
          )}

          {/* Fog of War overlays */}
          {fogRegions.map((fog, i) => (
            <div
              key={i}
              className="absolute z-50 flex flex-col items-center justify-center bg-slate-200/90 dark:bg-slate-950/75 pointer-events-none"
              style={{
                top: fog.top,
                left: fog.left,
                width: fog.width,
                height: fog.height,
              }}
            >
              <EyeOff className="w-12 h-12 text-slate-600 mb-3" />
              <span className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em]">
                Classified
              </span>
            </div>
          ))}
        </div>

        {/* Tactical Status Alerts */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-8 z-[60] w-full max-w-[300px] pointer-events-none">
          <CheckAlert inCheck={inCheck && gameState === "play"} />
        </div>

        {gameState === "finished" && winner && (
          <VictoryOverlay
            winner={winner}
            reason={winnerReason || undefined}
            localPlayerName={localPlayerName}
            board={board}
            getPlayerDisplayName={getPlayerDisplayName}
            setGameState={setGameState}
          />
        )}
      </div>
    </div>
  );
};

export default GameBoard;
