import React from "react";
import { useNavigate } from "react-router-dom";
import { useRouteContext } from "@context";
import { MenuScreen } from "./MenuScreen";

export const HomeView: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode, setHoveredMenu, setTerrainSeed, onZenGarden } =
    useRouteContext();

  const handleSetTerrainSeed = React.useCallback(() => {
    setTerrainSeed(Math.random());
  }, [setTerrainSeed]);

  return (
    <MenuScreen
      darkMode={darkMode}
      onNavigate={navigate}
      onHoverMenu={setHoveredMenu}
      onSetTerrainSeed={handleSetTerrainSeed}
      onZenGarden={onZenGarden}
    />
  );
};

export default HomeView;
