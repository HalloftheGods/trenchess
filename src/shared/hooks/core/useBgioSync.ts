import { useState, useEffect, useRef } from "react";
import type { TrenchessState } from "@/shared/types/game";
import type { Ctx } from "boardgame.io";
import type { BgioSync, BgioClient } from "@/shared/types";

export function useBgioSync(
  bgioClientRef: React.MutableRefObject<BgioClient | undefined>,
  setBgioState: React.Dispatch<
    React.SetStateAction<{ G: TrenchessState; ctx: Ctx } | null>
  >,
): BgioSync {
  const [synced, setSynced] = useState(false);
  const unsubscribeRef = useRef<() => void>(undefined);

  useEffect(() => {
    const bgioClient = bgioClientRef.current;
    if (!bgioClient) return;

    unsubscribeRef.current = bgioClient.subscribe(
      (state: { G: TrenchessState; ctx: Ctx } | null) => {
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
