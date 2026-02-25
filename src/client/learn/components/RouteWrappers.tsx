import { useParams } from "react-router-dom";
import { LazyRoutes } from "@/App.routes";
import type { TerrainType } from "@/shared/types";

export const TrenchGuideWrapper = (props: { onBack?: () => void }) => {
  const { terrain } = useParams();
  return (
    <LazyRoutes.learn.trench.detail
      {...props}
      initialTerrain={terrain as TerrainType}
      onBack={props.onBack || (() => {})}
    />
  );
};

export const ChessGuideWrapper = (props: { onBack?: () => void }) => {
  const { unitType } = useParams();
  return (
    <LazyRoutes.learn.chess.detail
      {...props}
      initialUnit={unitType}
      onBack={props.onBack || (() => {})}
    />
  );
};
