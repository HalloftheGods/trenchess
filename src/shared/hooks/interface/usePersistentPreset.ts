import { useState, useEffect } from "react";

type Preset = "classic" | "quick" | "terrainiffic" | "custom" | "zen-garden";

export function usePersistentPreset() {
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("trenchess_preset");
      if (saved) return saved as Preset;
    }
    return null;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (selectedPreset) {
        localStorage.setItem("trenchess_preset", selectedPreset);
      } else {
        localStorage.removeItem("trenchess_preset");
      }
    }
  }, [selectedPreset]);

  return [selectedPreset, setSelectedPreset] as const;
}
