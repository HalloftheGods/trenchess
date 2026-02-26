import React from "react";
import { GameStartOverlay } from "@/client/console/components";

interface StartScreenProps {
  isOnline?: boolean;
  isLocked?: boolean;
  onLockIn?: () => void;
  onStart?: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({
  isOnline = false,
  isLocked = false,
  onLockIn = () => console.log("Lock In clicked"),
  onStart = () => console.log("Start clicked"),
}) => {
  return (
    <GameStartOverlay
      isOnline={isOnline}
      isLocked={isLocked}
      onLockIn={onLockIn}
      onStart={onStart}
    />
  );
};

export default StartScreen;
