import React, { useMemo } from "react";
import { ShieldPlus } from "lucide-react";
import InteractiveGuide, {
  type Slide,
} from "@/shared/components/templates/InteractiveGuide";
import { TERRAIN_DETAILS } from "@/client/game/theme";
import type { PreviewConfig } from "@/shared/types/game";

// Shared Route Components
import { GuideListItem } from "@/shared/components/molecules/GuideListItem";
import { TerrainUnitGrid } from "@/shared/components/molecules/TerrainUnitGrid";
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
          "purple",
          "orange",
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
          } as PreviewConfig,
          description: (
            <div className="space-y-4">
              <ul className="space-y-3">
                {terrain.flavorStats.map((stat: string, i: number) => (
                  <GuideListItem key={i} color="amber">
                    {stat}
                  </GuideListItem>
                ))}
              </ul>
            </div>
          ),
          sideContent: <TerrainUnitGrid terrain={terrain} />,
          leftContent: null,
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
      } as PreviewConfig,
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
