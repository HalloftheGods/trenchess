import React from "react";
import { Target, Shield } from "lucide-react";
import { Box } from "@/shared/components/atoms/Box";
import { Flex } from "@/shared/components/atoms/Flex";
import { Heading } from "@/shared/components/atoms/Heading";
import { Text } from "@/shared/components/atoms/Text";
import { Grid } from "@/shared/components/atoms/Grid";
import { StatBar } from "../molecules/StatBar";
import {
  PIECES,
  unitColorMap,
  UNIT_DETAILS,
  TERRAIN_DETAILS,
  TERRAIN_TYPES,
  INITIAL_ARMY,
} from "@constants";
import type { PieceStyle, TerrainType, MatchStatEntry } from "@tc.types";

interface CombatStatBoxProps {
  selectedPiece: string;
  pieceStyle: PieceStyle;
  currentStats: Record<string, MatchStatEntry>;
  getUnitIcon: (type: string, style: PieceStyle) => React.ReactNode;
}

export const CombatStatBox: React.FC<CombatStatBoxProps> = ({
  selectedPiece,
  pieceStyle,
  currentStats,
  getUnitIcon,
}) => {
  const selectedColor = unitColorMap[selectedPiece];
  const pieceKeys = Object.values(PIECES);
  const unit = INITIAL_ARMY.find((u) => u.type === selectedPiece);
  const HoverIcon = unit?.hoverIcon || Target;

  return (
    <Box
      className={`space-y-8 rounded-2xl border bg-black/40 backdrop-blur-xl p-8 relative overflow-hidden border-t-4 shadow-2xl transition-all duration-500 ${selectedColor?.border}`}
    >
      <Box
        className={`absolute top-0 right-0 p-8 opacity-10 ${selectedColor?.text}`}
      >
        <HoverIcon size={128} />
      </Box>

      <Flex
        align="center"
        gap={6}
        className="relative z-10 mb-8 pb-8 border-b border-white/10"
      >
        <Box
          className={`p-6 rounded-2xl flex items-center justify-center w-20 h-20 ${selectedColor?.bg} ${selectedColor?.text} ${selectedColor?.shadow} ${selectedColor?.ring} ring-1 text-4xl shadow-2xl`}
        >
          {getUnitIcon(selectedPiece, pieceStyle)}
        </Box>
        <Box>
          <Text className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">
            Threat Profile
          </Text>
          <Heading
            level={3}
            className="text-4xl font-black text-white capitalize drop-shadow-md"
          >
            {UNIT_DETAILS[selectedPiece]?.title || selectedPiece}
          </Heading>
          <Text className="text-sm text-gray-300 italic mt-2 opacity-80">
            {UNIT_DETAILS[selectedPiece]?.role || "Tactical Combat Unit."}
          </Text>
        </Box>
      </Flex>

      <Box className="space-y-6 relative z-10">
        <Flex align="center" gap={2}>
          <Shield size={16} className="text-gray-400" />
          <Text className="text-sm text-gray-400 font-bold uppercase tracking-widest">
            Advantage Against
          </Text>
        </Flex>

        <Grid cols={1} mdCols={2} gap={4}>
          {pieceKeys.map((defender) => {
            const matchStats = currentStats[defender];
            const defenderColor = unitColorMap[defender];
            const rate = matchStats?.rate || 0;

            return (
              <Box
                key={defender}
                className="bg-white/5 border border-white/5 rounded-xl p-4 hover:border-white/10 transition-all duration-300 group hover:bg-white/10"
              >
                <Flex justify="between" align="center" className="mb-1">
                  <Flex align="center" gap={2}>
                    <Box
                      className={`p-1.5 rounded-md flex items-center justify-center w-8 h-8 ${defenderColor.bg} ${defenderColor.text}`}
                    >
                      {getUnitIcon(defender, pieceStyle)}
                    </Box>
                    <Text className="font-semibold text-gray-200 capitalize group-hover:text-white transition-colors">
                      {defender}
                    </Text>
                  </Flex>
                  <Box className="text-right">
                    <Text
                      className={`text-xl font-bold ${
                        rate > 10
                          ? "text-green-400"
                          : rate > 4
                            ? "text-yellow-400"
                            : "text-red-400"
                      }`}
                    >
                      {rate.toFixed(1)}%
                    </Text>
                  </Box>
                </Flex>
                <StatBar
                  rate={rate}
                  colorClass={
                    rate > 10
                      ? "bg-gradient-to-r from-green-500 to-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]"
                      : rate > 4
                        ? "bg-gradient-to-r from-yellow-500 to-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                        : "bg-gradient-to-r from-red-500 to-red-400 shadow-[0_0_10px_rgba(248,113,113,0.5)]"
                  }
                />
                <Flex
                  justify="between"
                  className="mt-2 text-[10px] text-gray-500 font-medium tracking-wide uppercase"
                >
                  <Text>Threat</Text>
                  <Text>
                    {(matchStats?.captures || 0).toLocaleString()} of{" "}
                    {(matchStats?.total || 1).toLocaleString()} sims
                  </Text>
                </Flex>
              </Box>
            );
          })}
        </Grid>
      </Box>

      <Box>
        <Flex align="center" gap={2} className="mb-6">
          <Box className="p-2 bg-indigo-500/20 rounded-lg">
            <Shield size={20} className="text-indigo-400" />
          </Box>
          <Box>
            <Text className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400/80">
              Trench Advantage
            </Text>
            <Text className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
              Performance gain vs Flat Ground
            </Text>
          </Box>
        </Flex>

        <Grid cols={1} mdCols={2} gap={4}>
          {TERRAIN_DETAILS.map((terrain) => {
            const sanctuaryList =
              UNIT_DETAILS[selectedPiece]?.levelUp?.sanctuaryTerrain || [];
            const isSanctuary = sanctuaryList.includes(
              terrain.key as TerrainType,
            );

            const allDefenders = Object.values(currentStats);
            const tStats = allDefenders.map(
              (d) => d.terrainStats?.[terrain.key],
            );
            const flatStats = allDefenders.map(
              (d) => d.terrainStats?.[TERRAIN_TYPES.FLAT],
            );

            const totalT = tStats.reduce((acc, s) => acc + (s?.total || 0), 0);
            const capsT = tStats.reduce(
              (acc, s) => acc + (s?.captures || 0),
              0,
            );
            const rateT = totalT > 0 ? (capsT / totalT) * 100 : 0;

            const totalF = flatStats.reduce(
              (acc, s) => acc + (s?.total || 0),
              0,
            );
            const capsF = flatStats.reduce(
              (acc, s) => acc + (s?.captures || 0),
              0,
            );
            const rateF = totalF > 0 ? (capsF / totalF) * 100 : 0;

            const advantage = rateT - rateF;

            return (
              <Box
                key={terrain.key}
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  isSanctuary
                    ? "bg-emerald-500/5 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]"
                    : "bg-white/[0.02] border-white/5"
                }`}
              >
                <Flex justify="between" align="start" className="mb-3">
                  <Flex align="center" gap={3}>
                    <Box
                      className={`p-2 rounded-lg ${terrain.color?.bg} ${terrain.color?.text}`}
                    >
                      {terrain.icon && <terrain.icon size={16} />}
                    </Box>
                    <Box>
                      <Flex
                        align="center"
                        gap={2}
                        className="text-sm font-bold text-white"
                      >
                        {terrain.label}
                        {isSanctuary && (
                          <Box className="text-[8px] bg-emerald-500 text-black px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter">
                            Sanctuary
                          </Box>
                        )}
                      </Flex>
                      <Text className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">
                        {totalT.toLocaleString()} sims
                      </Text>
                    </Box>
                  </Flex>
                  <Box className="text-right">
                    <Text
                      className={`text-lg font-black ${
                        advantage > 0
                          ? "text-emerald-400"
                          : advantage < 0
                            ? "text-rose-400"
                            : "text-slate-400"
                      }`}
                    >
                      {advantage > 0 ? "+" : ""}
                      {advantage.toFixed(1)}%
                    </Text>
                    <Text className="text-[9px] text-slate-600 font-bold uppercase">
                      vs flat
                    </Text>
                  </Box>
                </Flex>
                <Flex justify="between" align="center" className="text-[10px]">
                  <Text className="text-slate-500">Capture Rate</Text>
                  <Text className="text-slate-300 font-mono">
                    {rateT.toFixed(1)}%
                  </Text>
                </Flex>
                <Box className="w-full h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                  <Box
                    className={`h-full transition-all duration-1000 ${
                      advantage > 0
                        ? "bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"
                        : "bg-white/10"
                    }`}
                    style={{ width: `${Math.min(rateT * 2, 100)}%` }}
                  />
                </Box>
              </Box>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
};
