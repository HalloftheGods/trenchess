import { Crown } from "lucide-react";
import { Box, Flex, Grid, Text } from "@atoms";

export const MultiPlayerZonesGraphic = () => (
  <Flex
    direction="col"
    align="center"
    justify="center"
    className="w-full aspect-square bg-slate-900/40 rounded-[2.5rem] border-2 border-brand-blue/20 p-4 relative bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-blue/5 to-transparent"
  >
    <Grid cols={2} rows={2} gap={4} className="w-full h-full p-6 opacity-60">
      <Flex
        align="center"
        justify="center"
        className="bg-brand-blue/10 rounded-2xl border border-brand-blue/40 shadow-lg"
      >
        <Crown className="text-brand-blue" size={40} />
      </Flex>
      <Flex
        align="center"
        justify="center"
        className="bg-emerald-500/10 rounded-2xl border border-emerald-500/40 shadow-lg"
      >
        <Crown className="text-emerald-500" size={40} />
      </Flex>
      <Flex
        align="center"
        justify="center"
        className="bg-amber-500/10 rounded-2xl border border-amber-500/40 shadow-lg"
      >
        <Crown className="text-amber-500" size={40} />
      </Flex>
      <Flex
        align="center"
        justify="center"
        className="bg-brand-red/10 rounded-2xl border border-brand-red/40 shadow-lg"
      >
        <Crown className="text-brand-red" size={40} />
      </Flex>
    </Grid>
    <Text className="mt-auto text-[10px] font-black uppercase text-brand-blue/60 tracking-[0.3em] pt-2 z-10">
      Multi-Player Zones
    </Text>
  </Flex>
);

export const CtaTroopConversionGraphic = () => (
  <Flex
    direction="col"
    align="center"
    justify="center"
    className="w-full aspect-square bg-slate-900/40 rounded-[2.5rem] border-2 border-indigo-500/20 p-8 relative overflow-hidden"
  >
    <Box className="absolute inset-0 bg-indigo-950/20 animate-pulse" />
    <Flex gap={4} justify="center" className="relative z-10 w-full">
      <Flex direction="col" align="center" gap={2} className="w-1/2">
        <Flex
          align="center"
          justify="center"
          className="w-16 h-16 rounded-2xl bg-brand-blue/70 border-2 border-brand-blue/40 shadow-xl"
        >
          <Crown className="text-white" size={32} />
        </Flex>
        <Text className="text-3xl font-black text-indigo-500/80 my-2">→</Text>
        <Flex gap={2} justify="center" className="flex-wrap mt-2">
          <Box className="w-5 h-5 rounded-full bg-brand-blue/60 shadow-lg" />
          <Box className="w-5 h-5 rounded-full bg-brand-blue/60 shadow-lg" />
          <Box className="w-5 h-5 rounded-full bg-brand-blue/60 shadow-lg" />
        </Flex>
      </Flex>
      <Flex
        direction="col"
        align="center"
        gap={2}
        className="w-1/2 opacity-30 grayscale"
      >
        <Flex
          align="center"
          justify="center"
          className="w-16 h-16 rounded-2xl bg-brand-red/70 border-2 border-brand-red/40"
        >
          <Crown className="text-white" size={32} />
        </Flex>
        <Text className="text-3xl font-black text-transparent my-2">→</Text>
        <Flex gap={2} justify="center" className="flex-wrap mt-2">
          <Box className="w-5 h-5 rounded-full bg-brand-red/60" />
          <Box className="w-5 h-5 rounded-full bg-brand-red/60" />
          <Box className="w-5 h-5 rounded-full bg-brand-red/60" />
        </Flex>
      </Flex>
    </Flex>
    <Text className="mt-auto text-[10px] font-black uppercase text-indigo-500/60 tracking-[0.3em] text-center z-20">
      Troop Conversion
    </Text>
  </Flex>
);
