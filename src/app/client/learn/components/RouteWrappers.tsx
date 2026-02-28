import { lazy, createElement } from "react";
import { useParams } from "react-router-dom";
import type { TerrainType } from "@tc.types";

const TrenchDetailLazy = lazy(() => import("../trench/detail"));
const ChessDetailLazy = lazy(() => import("../chess/detail"));

export const TrenchGuideWrapper = (props: { onBack?: () => void }) => {
  const { terrain } = useParams();

  return createElement(TrenchDetailLazy, {
    ...props,
    initialTerrain: terrain as TerrainType,
    onBack: props.onBack || (() => {}),
  });
};

export const ChessGuideWrapper = (props: { onBack?: () => void }) => {
  const { unitType } = useParams();

  return createElement(ChessDetailLazy, {
    ...props,
    initialUnit: unitType,
    onBack: props.onBack || (() => {}),
  });
};
