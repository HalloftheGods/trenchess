import React from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { getPath } from "@/app/router/router";
import { buildRoute } from "@/shared/utilities/routes";

type BreadcrumbColor = "red" | "blue" | "emerald" | "amber" | "slate";

const ICON_SIZE = 42;

export const RouteBreadcrumbs: React.FC = () => {
  const navigate = useNavigate();
  const { playMode: urlMode, players: urlPlayers } = useParams<{
    playMode: string;
    players: string;
    step?: string;
  }>();

  const {
    playMode,
    playerCount,
    selectedBoard,
    selectedPreset,
    onStartGame,
    playerConfig,
    multiplayer,
  } = useRouteContext();

  const isSelectionPage =
    location.pathname === getPath("play.index") ||
    location.pathname === getPath("play.local");

  const effectivePlayerCount =
    urlPlayers && location.pathname.includes("/setup")
      ? parseInt(urlPlayers, 10)
      : isSelectionPage
        ? null
        : playerCount;

  const effectivePlayMode =
    urlMode === "online" || urlMode === "multiplayer"
      ? "online"
      : urlMode === "practice" || urlMode === "couch"
        ? "local"
        : isSelectionPage
          ? null
          : playMode;

  const getPlayModeIcon = () => {
    if (effectivePlayMode === "online") return <GlobeLock size={ICON_SIZE} />;
    if (effectivePlayMode === "local" || effectivePlayMode === "practice")
      return <Sofa size={ICON_SIZE} />;
    return <Sofa size={ICON_SIZE} className="opacity-40" />;
  };

  const getPlayerCountIcon = () => {
    switch (effectivePlayerCount) {
      case 1:
        return <Bot size={ICON_SIZE} />;
      case 2:
        return <User size={ICON_SIZE} />;
      case 3:
        return <Users size={ICON_SIZE} />;
      case 4:
        return <UserPlus size={ICON_SIZE} />;
      default:
        return <Bot size={ICON_SIZE} className="opacity-40" />;
    }
  };

  const getBoardIcon = () => {
    switch (selectedBoard) {
      case "2p-ns":
        return <DualToneNS size={ICON_SIZE} />;
      case "2p-ew":
        return <DualToneEW size={ICON_SIZE} />;
      case "4p":
        return <QuadTone size={ICON_SIZE} />;
      case "2v2":
        return <AllianceTone size={ICON_SIZE} />;
      default:
        return <LayoutGrid size={ICON_SIZE} className="opacity-40" />;
    }
  };

  const getSetupIcon = () => {
    switch (selectedPreset) {
      case "classic":
        return <Pizza size={ICON_SIZE} />;
      case "terrainiffic":
        return <Shell size={ICON_SIZE} />;
      case "quick":
        return <Dices size={ICON_SIZE} />;
      case "custom":
        return <Eye size={ICON_SIZE} />;
      default:
        return <Omega size={ICON_SIZE} className="opacity-40" />;
    }
  };

  const currentPlayModeParam =
    urlMode ||
    (effectivePlayMode === "online"
      ? "multiplayer"
      : effectivePlayerCount === 1
        ? "practice"
        : "couch");
  const currentPlayersParam =
    urlPlayers || effectivePlayerCount?.toString() || "";

  const items = [
    {
      icon: getPlayModeIcon(),
      label: effectivePlayMode ? "Mode" : "Select Mode",
      color: (effectivePlayMode === "online"
        ? "blue"
        : effectivePlayMode
          ? "red"
          : "slate") as BreadcrumbColor,
      path: getPath("play.index"),
      value: effectivePlayMode,
    },
    ...(effectivePlayMode === "online"
      ? [
          {
            icon: <Key size={ICON_SIZE} />,
            label: `Lobby: ${multiplayer?.roomId?.toUpperCase() || "CODE"}`,
            color: (multiplayer?.roomId ? "blue" : "slate") as BreadcrumbColor,
            path: getPath("play.lobby"),
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
      path:
        effectivePlayMode === "online"
          ? getPath("play.lobby")
          : getPath("play.local"),
      value: effectivePlayerCount,
      badge:
        effectivePlayerCount !== null && effectivePlayerCount > 0
          ? effectivePlayerCount
          : undefined,
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
      path: buildRoute(getPath("play.setup"), {
        playMode: currentPlayModeParam,
        players: currentPlayersParam,
        step: "1",
      }),
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
      path: buildRoute(getPath("play.setup"), {
        playMode: currentPlayModeParam,
        players: currentPlayersParam,
        step: "2",
      }),
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
      navigate(`/console/${multiplayer.roomId}`);
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
          flex items-center gap-2 p-2 px-4 rounded-full
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
                relative group/item flex items-center justify-center p-2.5 rounded-2xl
                ${item.color === "red" ? "bg-brand-red/10 text-brand-red border-brand-red/20" : ""}
                ${item.color === "blue" ? "bg-brand-blue/10 text-brand-blue border-brand-blue/20" : ""}
                ${item.color === "emerald" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : ""}
                ${item.color === "amber" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : ""}
                ${item.color === "slate" ? "bg-slate-500/10 text-slate-500 border-slate-500/20" : ""}
                border shadow-sm transition-all hover:scale-110 cursor-pointer hover:bg-white/20 dark:hover:bg-white/10
              `}
              onClick={(e) => {
                e.stopPropagation();
                navigate(item.path);
              }}
            >
              {item.icon}

              {/* Sexy Tooltip */}
              <div className="absolute -bottom-10 px-3 py-1.5 bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-lg text-[10px] font-black tracking-widest text-white whitespace-nowrap opacity-0 group-hover/item:opacity-100 group-hover/item:-bottom-12 transition-all pointer-events-none z-50 shadow-2xl flex flex-col items-center gap-0.5">
                <span className="opacity-50 text-[8px] uppercase">
                  {item.label}
                </span>
                <span className="text-white">
                  {String(item.value || "Not Set").toUpperCase()}
                </span>
              </div>

              {item.badge !== undefined && (
                <div className="absolute -top-2 -right-2 w-[18px] h-[18px] rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                  {item.badge}
                </div>
              )}
            </div>
            {idx < items.length - 1 && (
              <div className="text-slate-400 dark:text-slate-600 font-black text-lg mx-1">
                +
              </div>
            )}
          </React.Fragment>
        ))}

        {canStart && (
          <>
            <div className="text-slate-400 dark:text-slate-600 font-black text-lg mx-2">
              =
            </div>
            <div
              className="relative group/swords flex items-center justify-center p-2.5 rounded-2xl bg-slate-500/10 text-slate-500 border border-slate-500/20 shadow-sm cursor-pointer hover:scale-110 hover:bg-brand-blue/20 transition-all"
              onClick={handleStart}
            >
              <DualToneSwords
                size={ICON_SIZE}
                className="group-hover/swords:rotate-12 transition-transform"
              />

              {/* Sexy Tooltip for Swords */}
              <div className="absolute -bottom-10 px-3 py-1.5 bg-brand-blue/90 backdrop-blur-md border border-white/20 rounded-lg text-[10px] font-black tracking-widest text-white whitespace-nowrap opacity-0 group-hover/swords:opacity-100 group-hover/swords:-bottom-12 transition-all pointer-events-none z-50 shadow-2xl">
                {multiplayer?.roomId ? "RESUME BATTLE" : "COMMENCE BATTLE"}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RouteBreadcrumbs;
