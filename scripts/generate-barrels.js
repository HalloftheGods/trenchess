import fs from "node:fs";
import path from "node:path";

const TARGET_DIRS = [
  "src/app/routes/game/components/atoms",
  "src/app/routes/game/components/molecules",
  "src/app/routes/game/components/organisms",
  "src/app/routes/game/components/templates",
  "src/app/routes/game/components",
  "src/shared/components/atoms",
  "src/shared/components/molecules",
  "src/shared/components/organisms",
  "src/shared/components/templates",
  "src/shared/components",
];

const generateBarrel = (dir) => {
  const absolutePath = path.resolve(process.cwd(), dir);

  if (!fs.existsSync(absolutePath)) {
    console.warn(`Directory not found: ${dir}`);
    return;
  }

  const items = fs.readdirSync(absolutePath);

  const files = items.filter((file) => {
    const isTsFile = file.endsWith(".ts") || file.endsWith(".tsx");
    const isNotIndex = file !== "index.ts" && file !== "index.tsx";
    return isTsFile && isNotIndex;
  });

  const subDirs = items.filter((item) => {
    const subPath = path.join(absolutePath, item);
    return (
      fs.statSync(subPath).isDirectory() &&
      (fs.existsSync(path.join(subPath, "index.ts")) ||
        fs.existsSync(path.join(subPath, "index.tsx")))
    );
  });

  if (files.length === 0 && subDirs.length === 0) return;

  const fileExports = files.map((file) => {
    const name = file.replace(/\.tsx?$/, "");
    return `export * from './${name}';`;
  });

  const dirExports = subDirs.map((subDir) => `export * from './${subDir}';`);

  const exports = [...fileExports, ...dirExports].sort().join("\n");

  const content = `${exports}\n`;
  const indexPath = path.join(absolutePath, "index.ts");

  fs.writeFileSync(indexPath, content);
  console.log(`✅ Generated barrel for ${dir}`);
};

const run = () => {
  const args = process.argv.slice(2);
  // Sort by depth descending to process children before parents
  const defaultDirs = [...TARGET_DIRS].sort(
    (a, b) => b.split("/").length - a.split("/").length,
  );
  const dirsToProcess = args.length > 0 ? args : defaultDirs;

  dirsToProcess.forEach(generateBarrel);
};

run();
