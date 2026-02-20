import React from "react";
import { useLocation } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const routeNameMap: Record<string, string> = {
  play: "Play",
  learn: "The Prophecy",
  trench: "The Trench",
  chess: "The Chess",
  endgame: "The Endgame",
  lobby: "Lobby",
  couch: "Couch Mode",
  practice: "Practice",
};

interface BackButtonProps {
  onClick: () => void;
  /** Override the automatically derived label. Useful for internal view-state navigation. */
  label?: string;
  className?: string;
}

/**
 * A back button that automatically derives the destination page name from the
 * current route, keeping it in sync with the Breadcrumbs component.
 *
 * Pass `label` to override the auto-derived name (e.g., for sub-view navigation
 * within a single route, like MenuLobby's "menu → global → host" states).
 */
const BackButton: React.FC<BackButtonProps> = ({
  onClick,
  label,
  className = "",
}) => {
  const location = useLocation();

  // Derive the parent page name from the current path segments.
  // e.g. /play/lobby → parent segment is "play" → "Play"
  // e.g. /learn/chess → parent segment is "learn" → "How to Play"
  // e.g. /play → parent is root → "Menu"
  const pathnames = location.pathname.split("/").filter(Boolean);
  const parentSegment =
    pathnames.length >= 2 ? pathnames[pathnames.length - 2] : null;
  const derivedLabel = parentSegment
    ? (routeNameMap[parentSegment] ?? parentSegment)
    : "Menu";

  const backLabel = label ?? derivedLabel;

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 p-2 pl-1 pr-3 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer font-bold text-sm uppercase tracking-wider ${className}`}
      title={`Back to ${backLabel}`}
    >
      <ChevronLeft size={20} />
      <span>{backLabel}</span>
    </button>
  );
};

export default BackButton;
