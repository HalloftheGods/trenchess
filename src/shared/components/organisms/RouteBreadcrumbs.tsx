import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Sofa,
  GlobeLock,
  Bot,
  User,
  Users,
  UserPlus,
  Pizza,
  Shell,
  Dices,
  Eye,
  Key,
  LayoutGrid,
  Omega,
} from "lucide-react";
import { useRouteContext } from "@context";
import {
  DualToneNS,
  DualToneEW,
  QuadTone,
  AllianceTone,
  DualToneSwords,
} from "../atoms/RouteIcons";

type BreadcrumbColor = "red" | "blue" | "emerald" | "amber" | "slate";

export const RouteBreadcrumbs: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    playMode,
    playerCount,
    selectedBoard,
    selectedPreset,
    onStartGame,
    playerConfig,
    multiplayer,
  } = useRouteContext();

  const urlPlayers = searchParams.get("players");
  const urlMode = searchParams.get("mode");

  // We should prefer URL params if we are in the setup flow,
  // but if we are generally navigating around, we should rely on playerCount
  // unless we're actually setting it.  The issue is clicking "1 Player" pushes ?mode=practice&players=1.
  // Then the user clicks "Change Field" and it goes to /play/setup?step=1.
  // Wait, if they click the player breadcrumb it goes to `/play/local` which drops all URL params, so it loses `effectivePlayerCount`.
  // Actually, wait, let's just make it only use the global `playerCount` variable from context.

  // Let's check what `useRouteContext` actually returns when we start the game.
  // Oh, wait, the router might not immediately update `playerCount` when clicking from local play.
  // Actually, wait over in `RouteBreadcrumbs` it was using just `playerCount` originally, and the user said:
  // "ok its weird when i click it when in single play with only 1, it switches to 2 and updates the config to two players? it should have stayed one until i chose a new item"
  // Hmm. When they click the 1 player card, it navigates to `/play/setup?mode=practice&players=1`.
  // However, the `App.tsx` router wrapper doesn't parse that URL parameter and update `game.activePlayers`!
  // It just sets the route. So `game.activePlayers.length` is still the default (which is 2).
  // Therefore `playerCount` is 2.
  // And with my previous change, `urlPlayers` would force it to 1 initially... but when clicking the breadcrumb to go back to `/play/local`, it drops params -> 2.
  const effectivePlayerCount =
    urlPlayers &&
    location.pathname.includes("/setup") &&
    searchParams.get("step") === null
      ? parseInt(urlPlayers, 10)
      : playerCount;
  const effectivePlayMode =
    urlMode === "online"
      ? "online"
      : (urlMode === "practice" || urlMode === "couch") &&
          searchParams.get("step") === null
        ? "local"
        : playMode;

  const getPlayModeIcon = () => {
    if (effectivePlayMode === "online") return <GlobeLock size={18} />;
    if (effectivePlayMode === "local" || effectivePlayMode === "practice")
      return <Sofa size={18} />;
    return <Sofa size={18} className="opacity-40" />;
  };

  const getPlayerCountIcon = () => {
    switch (effectivePlayerCount) {
      case 1:
        return <Bot size={18} />;
      case 2:
        return <User size={18} />;
      case 3:
        return <Users size={18} />;
      case 4:
        return <UserPlus size={18} />;
      default:
        return <Bot size={18} className="opacity-40" />;
    }
  };

  const getBoardIcon = () => {
    switch (selectedBoard) {
      case "2p-ns":
        return <DualToneNS size={18} />;
      case "2p-ew":
        return <DualToneEW size={18} />;
      case "4p":
        return <QuadTone size={18} />;
      case "2v2":
        return <AllianceTone size={18} />;
      default:
        return <LayoutGrid size={18} className="opacity-40" />;
    }
  };

  const getSetupIcon = () => {
    switch (selectedPreset) {
      case "classic":
        return <Pizza size={18} />;
      case "terrainiffic":
        return <Shell size={18} />;
      case "quick":
        return <Dices size={18} />;
      case "custom":
        return <Eye size={18} />;
      default:
        return <Omega size={18} className="opacity-40" />;
    }
  };

  const items = [
    {
      icon: getPlayModeIcon(),
      label: effectivePlayMode ? "Mode" : "Select Mode",
      color: (effectivePlayMode === "online"
        ? "blue"
        : effectivePlayMode
          ? "red"
          : "slate") as BreadcrumbColor,
      path: "/play",
      value: effectivePlayMode,
    },
    ...(effectivePlayMode === "online"
      ? [
          {
            icon: <Key size={18} />,
            label: `Lobby: ${multiplayer?.roomId?.toUpperCase() || "CODE"}`,
            color: (multiplayer?.roomId ? "blue" : "slate") as BreadcrumbColor,
            path: "/play/lobby",
            value: multiplayer?.roomId,
          },
        ]
      : []),
    {
      icon: getPlayerCountIcon(),
      label: effectivePlayerCount
        ? `${effectivePlayerCount} Player${effectivePlayerCount > 1 ? "s" : ""}`
        : "Add Players",
      color: (effectivePlayerCount === 1
        ? "red"
        : effectivePlayerCount === 2
          ? "blue"
          : effectivePlayerCount === 3
            ? "emerald"
            : effectivePlayerCount === 4
              ? "amber"
              : "slate") as BreadcrumbColor,
      path: effectivePlayMode === "online" ? "/play/lobby" : "/play/local",
      value: effectivePlayerCount,
      badge: effectivePlayerCount > 0 ? effectivePlayerCount : undefined,
    },
    {
      icon: getBoardIcon(),
      label: selectedBoard ? "Field" : "Choose Field",
      color: (selectedBoard === "2p-ns"
        ? "red"
        : selectedBoard === "2v2"
          ? "slate"
          : selectedBoard
            ? "emerald"
            : "slate") as BreadcrumbColor,
      path: "/play/setup?step=1",
      value: selectedBoard,
    },
    {
      icon: getSetupIcon(),
      label: selectedPreset ? "Laws" : "Pick Laws",
      color: (selectedPreset === "classic"
        ? "amber"
        : selectedPreset === "quick"
          ? "blue"
          : selectedPreset === "terrainiffic"
            ? "emerald"
            : selectedPreset
              ? "red"
              : "slate") as BreadcrumbColor,
      path: "/play/setup?step=2",
      value: selectedPreset,
    },
  ];

  // isComplete means every selected value is present
  const isComplete = items.every(
    (item) => item.value !== null && item.value !== undefined,
  );

  const handleStart = () => {
    // Only trigger game start if clicking the swords/equal section OR the container background
    // if it's the container, let's just make sure it's complete.
    // If they click an icon, it should navigate instead.
    if (multiplayer?.roomId) {
      navigate(`/game/${multiplayer.roomId}`);
      return;
    }
    if (isComplete && selectedBoard && selectedPreset) {
      onStartGame(selectedBoard, selectedPreset, playerConfig);
    }
  };

  if (items.length === 0)
    return (
      <div className="h-8 flex font-black uppercase tracking-[0.25em] text-[10px] items-center text-slate-500/50">
        "Select your path"
      </div>
    );

  const canStart = isComplete || !!multiplayer?.roomId;

  return (
    <div className="flex items-center gap-2 mt-4 animate-in fade-in slide-in-from-top-2 duration-500">
      <div
        className={`
          flex items-center gap-1.5 p-1.5 px-3 rounded-full
          bg-slate-100/50 dark:bg-slate-900/40 backdrop-blur-md
          border border-slate-200/50 dark:border-white/5 shadow-inner
          transition-all
        `}
        title={
          canStart
            ? multiplayer?.roomId
              ? "RESUME BATTLE"
              : "COMMENCE BATTLE"
            : "Your current configuration"
        }
      >
        {items.map((item, idx) => (
          <React.Fragment key={idx}>
            <div
              className={`
                relative flex items-center justify-center p-1.5 rounded-xl
                ${item.color === "red" ? "bg-brand-red/10 text-brand-red border-brand-red/20" : ""}
                ${item.color === "blue" ? "bg-brand-blue/10 text-brand-blue border-brand-blue/20" : ""}
                ${item.color === "emerald" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : ""}
                ${item.color === "amber" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : ""}
                ${item.color === "slate" ? "bg-slate-500/10 text-slate-500 border-slate-500/20" : ""}
                border shadow-sm transition-all hover:scale-110 cursor-pointer hover:bg-white/20 dark:hover:bg-white/10
              `}
              title={`Change ${item.label}`}
              onClick={(e) => {
                e.stopPropagation();
                navigate(item.path);
              }}
            >
              {item.icon}
              {item.badge !== undefined && (
                <div className="absolute -top-1.5 -right-1.5 w-[14px] h-[14px] rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-[9px] font-bold text-white shadow-sm">
                  {item.badge}
                </div>
              )}
            </div>
            {idx < items.length - 1 && (
              <div className="text-slate-400 dark:text-slate-600 font-black text-xs mx-0.5">
                +
              </div>
            )}
          </React.Fragment>
        ))}

        {canStart && (
          <>
            <div className="text-slate-400 dark:text-slate-600 font-black text-xs mx-1">
              =
            </div>
            <div
              className="flex items-center justify-center p-1.5 rounded-xl bg-slate-500/10 text-slate-500 border border-slate-500/20 shadow-sm cursor-pointer hover:scale-110 hover:bg-brand-blue/20 transition-all group/swords"
              onClick={handleStart}
              title={multiplayer?.roomId ? "RESUME BATTLE" : "COMMENCE BATTLE"}
            >
              <DualToneSwords
                size={18}
                className="group-hover/swords:rotate-12 transition-transform"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RouteBreadcrumbs;
