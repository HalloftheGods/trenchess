import fs from "fs";
import path from "path";

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach((f) => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const UNITS_EXPORTS = [
  "PIECE_STYLES",
  "PLAYER_CONFIGS",
  "UNIT_COLORS",
  "UNIT_NAMES",
  "ALL_UNITS",
  "CHESS_NAME",
  "PIECES",
  "UNIT_DETAILS",
  "INITIAL_ARMY",
  "UNIT_INTEL",
  "PieceStyle",
  "unitColorMap",
];
const TERRAIN_EXPORTS = [
  "TERRAIN_TYPES",
  "MAX_TERRAIN_PER_PLAYER",
  "TERRAIN_CARDS_PER_TYPE",
  "TERRAIN_LIST",
  "TERRAIN_DETAILS",
  "TERRAIN_INTEL",
  "TerrainDetail",
  "TerrainType",
];

walkDir("./src", function (filePath) {
  if (filePath.endsWith(".ts") || filePath.endsWith(".tsx")) {
    let content = fs.readFileSync(filePath, "utf8");
    let original = content;

    // Direct replacements for paths
    content = content.replace(
      /@\/core\/constants\/core\.constants/g,
      "@/core/data/game",
    );
    content = content.replace(
      /@\/core\/constants\/terrain\.constants/g,
      "@/core/data/terrain",
    );
    content = content.replace(
      /@\/core\/constants\/unit\.constants/g,
      "@/core/data/units",
    );
    content = content.replace(
      /@\/core\/data\/unitDetails/g,
      "@/core/data/units",
    );
    content = content.replace(
      /@\/core\/data\/terrainDetails/g,
      "@/core/data/terrain",
    );

    // For intel.constants
    if (content.includes("@/core/constants/intel.constants")) {
      // Handle the case where the import spans multiple lines or single line
      content = content.replace(
        /import\s*\{([\s\S]+?)\}\s*from\s*"@\/core\/constants\/intel\.constants";/g,
        (match, p1) => {
          let imports = p1
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
          // Strip 'type ' from imports if present
          let cleanImports = imports.map((i) => i.replace(/^type\s+/, ""));

          let unitImports = imports.filter((i, idx) =>
            UNITS_EXPORTS.includes(cleanImports[idx]),
          );
          let terrainImports = imports.filter((i, idx) =>
            TERRAIN_EXPORTS.includes(cleanImports[idx]),
          );

          let res = "";
          if (unitImports.length)
            res += `import { ${unitImports.join(", ")} } from "@/core/data/units";\n`;
          if (terrainImports.length)
            res += `import { ${terrainImports.join(", ")} } from "@/core/data/terrain";\n`;
          if (!unitImports.length && !terrainImports.length) return match;
          return res.trim();
        },
      );
    }

    if (content !== original) {
      fs.writeFileSync(filePath, content, "utf8");
    }
  }
});
