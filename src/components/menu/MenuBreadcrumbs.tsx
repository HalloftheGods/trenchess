import React from "react";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";
import { useMenuContext } from "./MenuContext";
import {
  DualToneNS,
  DualToneEW,
  QuadTone,
  AllianceTone,
  DualToneSwords,
} from "../MenuIcons";

const MenuBreadcrumbs: React.FC = () => {
  const navigate = useNavigate();
  const {
    playMode,
    playerCount,
    selectedBoard,
    selectedPreset,
    onStartGame,
    playerConfig,
    multiplayer,
  } = useMenuContext();

  const getPlayModeIcon = () => {
    if (playMode === "online") return <GlobeLock size={18} />;
    if (playMode === "local" || playMode === "practice")
      return <Sofa size={18} />;
    return null;
  };

  const getPlayerCountIcon = () => {
    switch (playerCount) {
      case 1:
        return <Bot size={18} />;
      case 2:
        return <User size={18} />;
      case 3:
        return <Users size={18} />;
      case 4:
        return <UserPlus size={18} />;
      default:
        return <Users size={18} />;
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
        return null;
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
        return null;
    }
  };

  const items = [
    {
      icon: getPlayModeIcon(),
      label: "Mode",
      color: (playMode === "online" ? "blue" : "red") as any,
      path: "/play",
      value: playMode,
    },
    ...(playMode === "online"
      ? [
          {
            icon: <Key size={18} />,
            label: `Lobby: ${multiplayer?.roomId?.toUpperCase() || "CODE"}`,
            color: "blue" as any,
            path: "/play/lobby",
            value: multiplayer?.roomId,
          },
        ]
      : []),
    {
      icon: getPlayerCountIcon(),
      label: playerCount
        ? `${playerCount} Player${playerCount > 1 ? "s" : ""}`
        : "Players",
      color: (playerCount === 1
        ? "red"
        : playerCount === 2
          ? "blue"
          : playerCount === 3
            ? "emerald"
            : playerCount === 4
              ? "amber"
              : "blue") as any,
      path: playMode === "online" ? "/play/lobby" : "/play/local",
      value: playerCount,
    },
    {
      icon: getBoardIcon(),
      label: "Field",
      color: (selectedBoard === "2p-ns"
        ? "red"
        : selectedBoard === "2v2"
          ? "slate"
          : "emerald") as any,
      path: "/play/setup?step=1",
      value: selectedBoard,
    },
    {
      icon: getSetupIcon(),
      label: "Laws",
      color: (selectedPreset === "classic"
        ? "amber"
        : selectedPreset === "quick"
          ? "blue"
          : selectedPreset === "terrainiffic"
            ? "emerald"
            : "red") as any,
      path: "/play/setup?step=2",
      value: selectedPreset,
    },
  ].filter((item) => item.icon !== null);

  // isComplete means every selected value is present
  const isComplete = items.every(
    (item) => item.value !== null && item.value !== undefined,
  );

  const handleStart = () => {
    // Only trigger game start if clicking the swords/equal section OR the container background
    // if it's the container, let's just make sure it's complete.
    // If they click an icon, it should navigate instead.
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

  return (
    <div className="flex items-center gap-2 mt-4 animate-in fade-in slide-in-from-top-2 duration-500">
      <div
        className={`
          flex items-center gap-1.5 p-1.5 px-3 rounded-full
          bg-slate-100/50 dark:bg-slate-900/40 backdrop-blur-md
          border border-slate-200/50 dark:border-white/5 shadow-inner
          transition-all
        `}
        title={isComplete ? "COMMENCE BATTLE" : "Your current configuration"}
      >
        {items.map((item, idx) => (
          <React.Fragment key={idx}>
            <div
              className={`
                flex items-center justify-center p-1.5 rounded-xl
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
            </div>
            {idx < items.length - 1 && (
              <div className="text-slate-400 dark:text-slate-600 font-black text-xs mx-0.5">
                +
              </div>
            )}
          </React.Fragment>
        ))}

        {isComplete && (
          <>
            <div className="text-slate-400 dark:text-slate-600 font-black text-xs mx-1">
              =
            </div>
            <div
              className="flex items-center justify-center p-1.5 rounded-xl bg-slate-500/10 text-slate-500 border border-slate-500/20 shadow-sm cursor-pointer hover:scale-110 hover:bg-brand-blue/20 transition-all group/swords"
              onClick={handleStart}
              title="COMMENCE BATTLE"
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

export default MenuBreadcrumbs;
