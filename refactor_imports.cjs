const fs = require("fs");
const path = require("path");

function walk(dir, callback) {
  fs.readdirSync(dir).forEach((f) => {
    let dirPath = path.join(dir, f);
    let isDir = fs.statSync(dirPath).isDirectory();
    if (isDir) {
      if (
        !dirPath.includes("node_modules") &&
        !dirPath.includes(".git") &&
        !dirPath.includes("_archive")
      ) {
        walk(dirPath, callback);
      }
    } else {
      callback(dirPath);
    }
  });
}

const CONSTANTS_REGEX =
  /import\s+\{([^}]+)\}\s+from\s+["'](\.\.?\/.*constants)["']/g;
const SRC_DIR = "./src";

walk(SRC_DIR, (filePath) => {
  if (!filePath.endsWith(".ts") && !filePath.endsWith(".tsx")) return;
  if (filePath.includes("constants.ts")) return; // skip the file itself
  if (filePath.includes("boardLayouts.ts")) return;
  if (filePath.includes("terrainDetails.tsx")) return;
  if (filePath.includes("unitDetails.ts")) return; // skip because it already has it

  let content = fs.readFileSync(filePath, "utf8");
  let originalContent = content;

  let hasChanges = false;

  let newMap = {
    TERRAIN_TYPES: "data/terrainDetails",
    TERRAIN_INTEL: "data/terrainDetails",
    getQuadrantBaseStyle: "utils/boardLayouts",
    isUnitProtected: "utils/gameLogic",
    PIECES: "data/unitDetails",
    INITIAL_ARMY: "data/unitDetails",
    UNIT_INTEL: "data/unitDetails",
  };

  content = content.replace(CONSTANTS_REGEX, (match, importsStr, fromPath) => {
    let imports = importsStr
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);
    let keptImports = [];
    let extractedImports = {
      "data/terrainDetails": [],
      "utils/boardLayouts": [],
      "utils/gameLogic": [],
      "data/unitDetails": [],
    };

    let changedThisMatch = false;
    for (const imp of imports) {
      if (newMap[imp]) {
        extractedImports[newMap[imp]].push(imp);
        changedThisMatch = true;
      } else {
        keptImports.push(imp);
      }
    }

    if (!changedThisMatch) return match;
    hasChanges = true;

    // Determine relative path depth from the importing file
    // fromPath is relative to the importing file, like "../constants" or "../../constants"
    let depth = fromPath.split("../").length - 1;
    let upDir = depth > 0 ? "../".repeat(depth) : "./";

    let replacements = [];
    if (keptImports.length > 0) {
      replacements.push(
        `import { ${keptImports.join(", ")} } from "${fromPath}"`,
      );
    }

    for (const [mod, imps] of Object.entries(extractedImports)) {
      if (imps.length > 0) {
        let newFromPath = upDir + mod;
        let newImportStr = `import { ${imps.join(", ")} } from "${newFromPath}"`;
        replacements.push(newImportStr);
      }
    }

    return replacements.join(";\n");
  });

  if (hasChanges) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Updated ${filePath}`);
  }
});
