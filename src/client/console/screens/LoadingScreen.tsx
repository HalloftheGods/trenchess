import React from "react";
import { LoadingScreen as LoadingScreenAtom } from "@/shared/components/atoms/LoadingScreen";

const LoadingScreen: React.FC = () => {
  return (
    <LoadingScreenAtom 
      message="Forging the Battlefield..."
      submessage="Preparing the board for your arrival."
    />
  );
};

export default LoadingScreen;
