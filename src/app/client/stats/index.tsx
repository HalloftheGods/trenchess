import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import statsDataObj from "@assets/statistics.json";
import { PIECES, INITIAL_ARMY } from "@constants";
import { useRouteContext } from "@context";
import type { PieceStyle, CombatStats } from "@tc.types";
import { UnitStatTabs } from "./molecules/UnitStatTabs";
import { QuickStatsDashboard } from "./molecules/QuickStatsDashboard";
import { CombatStatBox } from "./organisms/CombatStatBox";
import { Box } from "@/shared/components/atoms/Box";
import { Flex } from "@/shared/components/atoms/Flex";
import { Heading } from "@/shared/components/atoms/Heading";
import { Text } from "@/shared/components/atoms/Text";

const statsData = statsDataObj as unknown as CombatStats;

const getUnitIcon = (type: string, pieceStyle: PieceStyle) => {
  const armyUnit = INITIAL_ARMY.find((u) => u.type === type);
  if (!armyUnit) return null;

  if (pieceStyle === "lucide") {
    const Icon = armyUnit.lucide;
    return <Icon className="w-full h-full" />;
  }
  if (pieceStyle === "custom") {
    const Icon = armyUnit.custom;
    return <Icon className="w-full h-full" />;
  }

  return (
    <Box as="span" className="text-lg leading-none">
      {armyUnit[pieceStyle as "emoji" | "bold" | "outlined"]}
    </Box>
  );
};

export const StatsView = () => {
  const navigate = useNavigate();
  const { pieceStyle } = useRouteContext();
  const [selectedPiece, setSelectedPiece] = useState<string>(PIECES.PAWN);

  const currentStats = statsData[selectedPiece];
  const handleBack = () => navigate(-1);

  return (
    <Box className="min-h-screen pt-24 pb-12 px-6 flex flex-col items-center animate-fade-in text-white z-10 relative">
      <Box className="w-full max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <Flex
          direction="col"
          align="center"
          justify="between"
          gap={8}
          className="lg:flex-row border-b border-white/10 pb-8 w-full"
        >
          <Flex align="center" gap={4}>
            <Box
              as="button"
              onClick={handleBack}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-blue shrink-0"
            >
              <ArrowLeft size={24} />
            </Box>
            <Box>
              <Heading
                level={1}
                weight="black"
                className="text-4xl uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500 drop-shadow-sm whitespace-nowrap"
              >
                Combat Statistics
              </Heading>
              <Text className="text-sm text-gray-400 capitalize font-medium tracking-wide mt-1">
                Threat Geometry & Capture Rates
              </Text>
            </Box>
          </Flex>
        </Flex>

        {/* Unit Selection & Dash Row - Naked row below divider */}
        <Flex
          align="center"
          justify="center"
          gap={12}
          className="w-full mb-12 flex-wrap"
        >
          <QuickStatsDashboard unitStats={currentStats} />

          <UnitStatTabs
            selectedPiece={selectedPiece}
            onSelect={setSelectedPiece}
            pieceStyle={pieceStyle}
          />
        </Flex>

        {/* Main Stats Content */}
        <CombatStatBox
          selectedPiece={selectedPiece}
          pieceStyle={pieceStyle}
          currentStats={currentStats}
          getUnitIcon={getUnitIcon}
        />
      </Box>
    </Box>
  );
};

export default StatsView;
