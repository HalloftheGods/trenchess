import { useState, useEffect, useRef } from "react";
import type { TrenchGameState } from "@/types/game";
import type { Ctx } from "boardgame.io";
import type { BgioSync, BgioClient } from "@/types";

export function useBgioSync(
  bgioClientRef: React.MutableRefObject<BgioClient | undefined>,
  setBgioState: React.Dispatch<
    React.SetStateAction<{ G: TrenchGameState; ctx: Ctx } | null>
  >,
): BgioSync {
  const [synced, setSynced] = useState(false);
  const unsubscribeRef = useRef<() => void>(undefined);

  useEffect(() => {
    const bgioClient = bgioClientRef.current;
    if (!bgioClient) return;

    unsubscribeRef.current = bgioClient.subscribe(
      (state: { G: TrenchGameState; ctx: Ctx } | null) => {
        if (!state) return;
        setBgioState(state);
        setSynced(true);
      },
    );

    return () => {
      if (unsubscribeRef.current) unsubscribeRef.current();
    };
  }, [bgioClientRef, setBgioState]);

  return { synced };
}
