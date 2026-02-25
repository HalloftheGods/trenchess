import { useParams } from "react-router-dom";
import { ROUTES } from "@constants/routes";
import type { TerrainType } from "@/shared/types";
import { createElement } from "react";

const TrenchDetailLazy = ROUTES.LEARN_TRENCH_DETAIL.component(() => import("../trench/detail"));
const ChessDetailLazy = ROUTES.LEARN_CHESSMEN_DETAIL.component(() => import("../chess/detail"));

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
