import React, { useMemo } from "react";
import { ShieldPlus } from "lucide-react";
import InteractiveGuide, {
  type Slide,
} from "@/app/routes/shared/components/templates/InteractiveGuide";
import { TERRAIN_DETAILS } from "@engineConfigs/terrainDetails";
import type { PieceType } from "@engineTypes/game";

// Shared Route Components
import { UnitChip } from "@/app/routes/shared/components/molecules/UnitChip";
import { SanctuaryBadgeList } from "@/app/routes/shared/components/molecules/SanctuaryBadgeList";
import { GuideListItem } from "@/app/routes/shared/components/molecules/GuideListItem";
interface TrenchGuideProps {
  onBack: () => void;
  initialTerrain?: string | null;
}

export const LearnTrenchDetailView: React.FC<TrenchGuideProps> = ({
  onBack,
  initialTerrain,
}) => {
  const slides: Slide[] = useMemo(() => {
    const terrainSlides = TERRAIN_DETAILS.map(
      (terrain: (typeof TERRAIN_DETAILS)[number]) => {
        const IconComp = terrain.icon;
        const colorMatch = terrain.color.text.match(/text-(?:brand-)?([a-z]+)/);
        const colorName = colorMatch ? colorMatch[1] : "amber";
        const validColors = [
          "red",
          "blue",
          "emerald",
          "amber",
          "slate",
          "indigo",
        ];
        const finalColor = validColors.includes(colorName)
          ? colorName
          : "amber";

        return {
          id: terrain.key,
          title: terrain.label,
          subtitle: terrain.subtitle,
          color: finalColor as Slide["color"],
          topLabel: terrain.tagline,
          icon: IconComp,
          previewConfig: {
            mode: "2p-ns",
            protocol: "terrainiffic",
            showIcons: true,
            hideUnits: false,
            forcedTerrain: terrain.key,
            useDefaultFormation: true,
          },
          description: (
            <div className="space-y-6">
              <ul className="space-y-3">
                {terrain.flavorStats.map((stat: string, i: number) => (
                  <GuideListItem key={i} color="amber">
                    {stat}
                  </GuideListItem>
                ))}
              </ul>

              <div>
                <div className="section-divider-container mb-4">
                  <div className="section-divider-line bg-slate-200 dark:bg-white/10" />
                  <span className="section-divider-label text-slate-500">
                    Unit Interactions
                  </span>
                  <div className="section-divider-line bg-slate-200 dark:bg-white/10" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {terrain.sanctuaryUnits.map((pk: PieceType | string) => (
                    <UnitChip
                      key={`${terrain.key}-sanc-${pk}`}
                      pieceKey={pk as PieceType}
                      status="sanctuary"
                    />
                  ))}
                  {terrain.allowedUnits
                    .filter(
                      (pk: PieceType | string) =>
                        !terrain.sanctuaryUnits.includes(pk as PieceType),
                    )
                    .map((pk: PieceType | string) => (
                      <UnitChip
                        key={`${terrain.key}-allow-${pk}`}
                        pieceKey={pk as PieceType}
                        status="allow"
                      />
                    ))}
                  {terrain.blockedUnits.map((pk: PieceType | string) => (
                    <UnitChip
                      key={`${terrain.key}-block-${pk}`}
                      pieceKey={pk as PieceType}
                      status="block"
                    />
                  ))}
                </div>
              </div>
            </div>
          ),
          leftContent:
            terrain.sanctuaryUnits.length > 0 ? (
              <div className="flex items-center gap-6">
                <span className="text-badge-label text-slate-500 whitespace-nowrap">
                  Welcomes
                </span>
                <SanctuaryBadgeList terrain={terrain} />
              </div>
            ) : null,
        };
      },
    );

    const rulesSlide: Slide = {
      id: "sanctuary-rules",
      title: "Sanctuary Rule",
      subtitle: "The Trenchess True Power",
      color: "amber",
      topLabel: "Gameplay Rules",
      icon: ShieldPlus,
      previewConfig: {
        mode: "2p-ns",
        protocol: "terrainiffic",
        showIcons: true,
        hideUnits: false,
        useDefaultFormation: true,
      },
      description: (
        <div className="space-y-6 mt-4">
          <div className="flex gap-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-full border shrink-0 border-amber-500/30 bg-amber-500/10 text-amber-500 font-bold">
              1
            </div>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider text-sm">
                Invisible to Specific Enemies
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                When a unit occupies its Sanctuary Terrain, it becomes invisible
                to specific enemy classes — those enemies cannot target or
                attack it while it remains inside.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-full border shrink-0 border-amber-500/30 bg-amber-500/10 text-amber-500 font-bold">
              2
            </div>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider text-sm">
                Double Border = Protected
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                A unit with a double border is currently positioned inside its
                Sanctuary Terrain. The terrain tile will show a dotted border to
                indicate the protection relationship.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-full border shrink-0 border-amber-500/30 bg-amber-500/10 text-amber-500 font-bold">
              3
            </div>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider text-sm">
                Terrain Placement is Strategic
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Positioning your units in their Sanctuary Terrain is a core
                defensive strategy in Trenchess. Place terrain strategically
                before the game begins.
              </p>
            </div>
          </div>
        </div>
      ),
    };

    // If initialTerrain was provided, move it to the front
    const sortedSlides = [...terrainSlides];
    if (initialTerrain) {
      const idx = sortedSlides.findIndex((s) => s.id === initialTerrain);
      if (idx > 0) {
        const item = sortedSlides.splice(idx, 1)[0];
        sortedSlides.unshift(item);
      }
    }

    return [...sortedSlides, rulesSlide];
  }, [initialTerrain]);

  return (
    <InteractiveGuide
      title="The Trench: Trials & Tribulations"
      slides={slides}
      onBack={onBack}
      labelColor="amber"
    />
  );
};

export default LearnTrenchDetailView;
