/**
 * ARCHIVED: Original renderTerrainInteraction layout from HowToPlay.tsx
 * Backed up on 2026-02-17 before replacing with interactive TerrainIntelTool.
 *
 * This file preserves the 4-card terrain intel layout for reference.
 * It is NOT imported anywhere — purely archival.
 *
 * Original location: HowToPlay.tsx lines 428-829 (renderTerrainInteraction function)
 * Callsite: HowToPlay.tsx lines 1167-1213 (4x renderTerrainInteraction calls)
 */

/*
// ── renderTerrainInteraction function ──────────────────────────────────

const renderTerrainInteraction = (
    terrainName: string,
    terrainIcon: React.ReactNode,
    bgClass: string,
    textClass: string,
    borderClass: string,
    sanctuaryName: string,
    role: React.ReactNode = (
      <div className="flex items-center gap-1.5">
        <ShieldPlus size={10} className="fill-current" />
        <span>- UNIT.</span>
      </div>
    ),
  ) => {
    const activeUnitType = activeTerrainPreviews[terrainName] || PIECES.TANK;
    const details = UNIT_DETAILS[activeUnitType];

    const canTraverse = (tName: string, uDetails: any) => {
      const tIcons = uDetails.levelUp?.terrainIcons || [];
      const hasIcon = tIcons.some((icon: React.ReactElement) => {
        if (tName === "Mountains" && icon.key === "mt") return true;
        if (tName === "Forests" && icon.key === "tr") return true;
        if (tName === "Swamps" && icon.key === "wv") return true;
        if (tName === "Desert" && icon.key === "ds") return true;
        return false;
      });
      return hasIcon;
    };

    const isTraversable = canTraverse(terrainName, details);
    const isDesertTank =
      terrainName === "Desert" && activeUnitType === PIECES.TANK;

    const previewGridSize = 12;
    const centerRow = 6;
    const centerCol = 6;

    const isTerrainCell = (r: number) => Math.abs(r - centerRow) === 1;

    let validMoves: number[][] = [];
    let blockedMoves: number[][] = [];

    if (details) {
      const allIntendedMoves = [
        ...details.movePattern(centerRow, centerCol),
        ...(details.newMovePattern
          ? details.newMovePattern(centerRow, centerCol)
          : []),
      ];

      allIntendedMoves.forEach(([r, c]) => {
        const dr = r - centerRow;
        const dc = c - centerCol;
        const dist = Math.max(Math.abs(dr), Math.abs(dc));
        const steps = dist;
        const isLeap =
          Math.abs(dr) * Math.abs(dc) === 2 || // Knight jump
          (activeUnitType === PIECES.BOT && dist === 2); // Pawn jump

        let blocked = false;

        for (let i = 1; i <= steps; i++) {
          const stepR = centerRow + Math.round((dr / steps) * i);
          const inTerrain = isTerrainCell(stepR);
          const isLanding = i === steps;

          if (inTerrain) {
            if (terrainName === "Desert") {
              if (isLanding) {
                if (!isDesertTank) blocked = true;
              } else {
                if (!isLeap) blocked = true;
              }
            } else {
              if (!isTraversable && !isLeap) blocked = true;
              if (isLeap && isLanding && !isTraversable) blocked = true;
            }
          }

          if (blocked) break;
        }

        if (blocked) {
          blockedMoves.push([r, c]);
        } else {
          validMoves.push([r, c]);
        }
      });
    }

    const allUnitsList = [
      PIECES.COMMANDER,
      PIECES.BATTLEKNIGHT,
      PIECES.TANK,
      PIECES.SNIPER,
      PIECES.HORSEMAN,
      PIECES.BOT,
    ];

    const navigableUnits = allUnitsList.filter((uType) => {
      const uDetails = UNIT_DETAILS[uType];
      return (
        canTraverse(terrainName, uDetails) ||
        (terrainName === "Desert" && uType === PIECES.TANK)
      );
    });

    const blockedUnits = allUnitsList.filter(
      (uType) => !navigableUnits.includes(uType),
    );

    const renderUnitEquation = (uType: string, isCompatible: boolean) => {
      const u = INITIAL_ARMY.find((x) => x.type === uType);
      if (!u) return null;
      const isSelected = activeUnitType === uType;
      const Icon = u.lucide as React.ElementType;

      const unitColors = unitColorMap[uType] || {
        text: textClass,
        bg: bgClass,
        border: borderClass,
      };

      const activeClass = isSelected
        ? "bg-slate-800 text-white border-slate-700 dark:bg-white dark:text-slate-900 shadow-lg scale-110"
        : `${unitColors.text} ${unitColors.bg} ${unitColors.border} opacity-70 hover:opacity-100`;

      let tKey: any = null;
      if (terrainName === "Forests") tKey = TERRAIN_TYPES.TREES;
      else if (terrainName === "Swamps") tKey = TERRAIN_TYPES.PONDS;
      else if (terrainName === "Mountains") tKey = TERRAIN_TYPES.RUBBLE;
      else if (terrainName === "Desert") tKey = TERRAIN_TYPES.DESERT;
      const isProtected = tKey && isUnitProtected(uType, tKey);

      return (
        <div
          key={uType}
          className="flex items-center gap-3 group/eq cursor-pointer"
          onClick={() =>
            setActiveTerrainPreviews((prev) => ({
              ...prev,
              [terrainName]: uType,
            }))
          }
        >
          <div
            className={`p-2.5 rounded-xl border transition-all ${activeClass} ${isProtected ? "border-double border-4" : ""}`}
          >
            <Icon size={22} />
          </div>
          <span className={`text-xl font-black ${textClass} opacity-100`}>
            +
          </span>
          <div
            className={`p-2 rounded-lg border ${borderClass} ${bgClass} ${textClass} opacity-100 shadow-sm`}
          >
            {React.cloneElement(
              terrainIcon as React.ReactElement<{ className?: string }>,
              {
                className: "w-5 h-5",
              },
            )}
          </div>
          <Equal
            size={24}
            strokeWidth={4}
            className={`${textClass} opacity-100`}
          />
          {isCompatible ? (
            <ShieldPlus
              size={20}
              className="text-emerald-500 fill-emerald-500/20 transition-transform group-hover/eq:scale-125"
            />
          ) : (
            <X
              size={20}
              strokeWidth={4}
              className="text-red-500 transition-transform group-hover/eq:scale-125"
            />
          )}
        </div>
      );
    };

    return (
      <div
        className={`relative p-8 rounded-3xl border-4 ${cardBg} ${borderClass} flex flex-col gap-6 transition-all hover:shadow-lg overflow-hidden`}
      >
        <div className="flex flex-col gap-8">
          {/- Header Area -/}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div
              className={`w-20 h-20 rounded-2xl ${bgClass} ${textClass} flex items-center justify-center shadow-inner ${borderClass} shrink-0`}
            >
              {React.cloneElement(terrainIcon as React.ReactElement<any>, {
                className: "w-12 h-12",
              })}
            </div>

            <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left pt-1">
              <div className="flex items-center gap-4 mb-2">
                <h3
                  className={`text-5xl font-black uppercase tracking-tighter ${textColor}`}
                >
                  {terrainName}
                </h3>
                <div
                  className={`px-4 py-1.5 rounded-xl ${bgClass} ${textClass} text-[11px] font-black uppercase tracking-widest border border-white/5 flex items-center justify-center`}
                >
                  {role}
                </div>
              </div>
              <span
                className={`text-sm font-black uppercase tracking-[0.2em] ${textClass}`}
              >
                {sanctuaryName}
              </span>
            </div>
          </div>

          {/- Body Content -/}
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="flex-1 w-full">
              <div className="flex flex-row gap-x-12 w-full">
                {/- Navigable Column -/}
                <div className="flex-1 flex flex-col gap-4">
                  {navigableUnits.map((uType) =>
                    renderUnitEquation(uType, true),
                  )}
                </div>

                {/- Vertical Splitter -/}
                {blockedUnits.length > 0 && (
                  <div
                    className={`w-[2px] self-stretch ${darkMode ? "bg-white/10" : "bg-slate-200"} rounded-full opacity-50`}
                  />
                )}

                {/- Blocked Column -/}
                <div className="flex-1 flex flex-col gap-4">
                  {blockedUnits.map((uType) =>
                    renderUnitEquation(uType, false),
                  )}
                </div>
              </div>
            </div>

            <div
              className="shrink-0 flex flex-col gap-1 items-center sm:items-start"
              style={{ minWidth: "260px" }}
            >
              <span
                className={`text-[10px] font-black uppercase tracking-widest ${subtextColor} flex items-center gap-2`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${isTraversable || isDesertTank ? "bg-emerald-500" : "bg-red-500"}`}
                />
                Affected Move Set
              </span>
              <span
                className={`text-[9px] font-black uppercase tracking-widest ${textClass} opacity-30 flex items-center gap-1.5 ml-3.5`}
              >
                <div className="w-0.5 h-0.5 rounded-full bg-current animate-pulse" />
                Select unit to preview
              </span>

              {/- TERRAIN PREVIEW GRID (12x12) -/}
              <div className="bg-slate-100 dark:bg-white/5 rounded-2xl p-3 border border-slate-200 dark:border-white/5 w-fit shadow-inner">
                <div
                  className="grid gap-[1px] w-48 h-48 sm:w-64 sm:h-64"
                  style={{
                    gridTemplateColumns: `repeat(${previewGridSize}, 1fr)`,
                  }}
                >
                  {Array.from({
                    length: previewGridSize * previewGridSize,
                  }).map((_, i) => {
                    const r = Math.floor(i / previewGridSize);
                    const c = i % previewGridSize;
                    const isCenter = r === centerRow && c === centerCol;
                    const isMove = validMoves.some(
                      ([mr, mc]) => mr === r && mc === c,
                    );
                    const isBlocked = blockedMoves.some(
                      ([mr, mc]) => mr === r && mc === c,
                    );
                    const inTerrain = isTerrainCell(r);

                    const isEven = (r + c) % 2 === 0;
                    let cellBg = isEven
                      ? "bg-slate-100/60 dark:bg-white/10"
                      : "bg-slate-200/60 dark:bg-white/[0.04]";

                    if (inTerrain) {
                      if (terrainName === "Mountains")
                        cellBg = isEven ? "bg-stone-500/60" : "bg-stone-500/40";
                      else if (terrainName === "Forests")
                        cellBg = isEven
                          ? "bg-emerald-500/50"
                          : "bg-emerald-500/30";
                      else if (terrainName === "Swamps")
                        cellBg = isEven ? "bg-blue-500/50" : "bg-blue-500/30";
                      else if (terrainName === "Desert")
                        cellBg = isEven ? "bg-amber-500/50" : "bg-amber-500/30";
                    }

                    if (isCenter) {
                      let tKey: any = null;
                      if (terrainName === "Forests") tKey = TERRAIN_TYPES.TREES;
                      else if (terrainName === "Swamps")
                        tKey = TERRAIN_TYPES.PONDS;
                      else if (terrainName === "Mountains")
                        tKey = TERRAIN_TYPES.RUBBLE;
                      else if (terrainName === "Desert")
                        tKey = TERRAIN_TYPES.DESERT;

                      const isProtected =
                        tKey && isUnitProtected(activeUnitType, tKey);

                      return (
                        <div
                          key={i}
                          className={`aspect-square rounded-sm relative bg-slate-800 dark:bg-white z-20 flex items-center justify-center shadow-lg ${isProtected ? "border-double border-[3px] border-emerald-500/50" : ""}`}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-black" />
                        </div>
                      );
                    }

                    return (
                      <div
                        key={i}
                        className={`aspect-square rounded-sm relative flex items-center justify-center transition-all duration-300
                          ${
                            isMove
                              ? inTerrain
                                ? terrainName === "Mountains"
                                  ? "bg-stone-500 z-20 shadow-[0_0_15px_rgba(120,113,108,0.5)]"
                                  : terrainName === "Forests"
                                    ? "bg-emerald-500 z-20 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                                    : terrainName === "Swamps"
                                      ? "bg-blue-500 z-20 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                                      : "bg-amber-500 z-20 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                                : "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] z-20"
                              : isBlocked
                                ? inTerrain
                                  ? terrainName === "Mountains"
                                    ? "bg-stone-500 z-20 shadow-[0_0_15px_rgba(120,113,108,0.5)]"
                                    : terrainName === "Forests"
                                      ? "bg-emerald-500 z-20 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                                      : terrainName === "Swamps"
                                        ? "bg-blue-500 z-20 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                                        : "bg-amber-500 z-20 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                                  : "bg-red-950/40 z-10"
                                : cellBg
                          }
                        `}
                      >
                        {inTerrain && (
                          <div
                            className={`absolute inset-0 flex items-center justify-center ${isMove || isBlocked ? "opacity-60" : "opacity-40"} scale-[0.45] pointer-events-none`}
                          >
                            {terrainIcon}
                          </div>
                        )}

                        {isBlocked && (
                          <div
                            className={`${inTerrain ? "text-white" : "text-red-500/40"} z-20 scale-75`}
                          >
                            <X size={16} strokeWidth={3} />
                          </div>
                        )}

                        {isMove && inTerrain && (
                          <div className="text-white drop-shadow-md z-20 scale-75">
                            <ShieldPlus
                              size={16}
                              strokeWidth={3}
                              className="fill-white/20"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

// ── Callsite (inside the return JSX) ──────────────────────────────────

<div className="mb-12">
  {renderSectionTitle(
    "The Battlefield - Terrain Intel",
    <ShieldPlus size={24} />,
    true,
  )}
  <div className="grid grid-cols-1 gap-8">
    {renderTerrainInteraction(
      "Forests",
      <Trees />,
      "bg-emerald-500/10",
      "text-emerald-500",
      "border-emerald-500/40",
      "Botanic Sanctuary",
      "Ranger Base",
    )}

    {renderTerrainInteraction(
      "Swamps",
      <Waves />,
      "bg-blue-500/10",
      "text-blue-500",
      "border-blue-500/40",
      "Hallowed Sanctuary",
      "Rook Base",
    )}
    {renderTerrainInteraction(
      "Mountains",
      <Mountain />,
      "bg-stone-500/10",
      "text-stone-500",
      "border-stone-500/40",
      "Midnight Sanctuary",
      "Shadow Knight Base",
    )}
    {renderTerrainInteraction(
      "Desert",
      <DesertIcon className="w-8 h-8" />,
      "bg-amber-500/10",
      "text-amber-500",
      "border-amber-500/40",
      "Camp under the stars",
      "Rooks Only",
    )}
  </div>
</div>
*/
