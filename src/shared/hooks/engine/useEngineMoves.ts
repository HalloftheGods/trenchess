import type { GameMode, TrenchessState, BgioClient } from "@tc.types";

export function useEngineMoves(
  clientRef: React.RefObject<BgioClient | undefined>,
) {
  return {
    setPhase: (p: string) => clientRef.current?.moves.setPhase(p),
    setMode: (m: GameMode) => clientRef.current?.moves.setMode(m),
    patchG: (p: Partial<TrenchessState>) => clientRef.current?.moves.patchG(p),
    authorizeMasterProtocol: () =>
      clientRef.current?.moves.authorizeMasterProtocol(),
    ready: (pid?: string) => clientRef.current?.moves.ready(pid),
    finishGamemaster: () => clientRef.current?.moves.finishGamemaster(),
    setTurn: (pid: string) => clientRef.current?.moves.setTurn(pid),
    setActiveScreen: (screenId: string | undefined) =>
      clientRef.current?.moves.setActiveScreen(screenId),
    forfeit: (pid?: string) => clientRef.current?.moves.forfeit(pid),
    toggleReady: () => clientRef.current?.moves.ready(),
  };
}
