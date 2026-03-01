import { lazy, createElement } from "react";
import { useParams } from "react-router-dom";
import type { TerrainType } from "@tc.types";

const TrenchDetailLazy = lazy(() => import("../trench/detail"));
const ChessDetailLazy = lazy(() => import("../chess/detail"));

export const TrenchGuideWrapper = () => {
  const { terrain } = useParams();

  return createElement(TrenchDetailLazy, {
    initialTerrain: terrain as TerrainType,
  });
};

export const ChessGuideWrapper = () => {
  const { unitType } = useParams();

  return createElement(ChessDetailLazy, {
    initialUnit: unitType,
  });
};
