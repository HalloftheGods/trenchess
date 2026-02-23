const fs = require("fs");
const path = require("path");

const rootDir = process.cwd();
const srcDir = path.resolve(rootDir, "src");

const aliases = [
  { name: "@atoms", prefix: "components/ui/atoms" },
  { name: "@molecules", prefix: "components/ui/molecules" },
  { name: "@organisms", prefix: "components/ui/organisms" },
  { name: "@templates", prefix: "components/ui/templates" },
  { name: "@views", prefix: "components/ui/views" },
  { name: "@ui", prefix: "components/ui" },
  { name: "@components", prefix: "components" },
  { name: "@hooks", prefix: "hooks" },
  { name: "@utils", prefix: "utils" },
  { name: "@types", prefix: "types" },
  { name: "@data", prefix: "data" },
  { name: "@assets", prefix: "assets" },
  { name: "@", prefix: "" },
];

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      if (file.endsWith(".ts") || file.endsWith(".tsx")) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

const files = getAllFiles(srcDir);

files.forEach((file) => {
  let content = fs.readFileSync(file, "utf8");
  let changed = false;

  // Regex to match imports and exports with paths
  // Supports: import ... from "path", import "path", export ... from "path", etc.
  content = content.replace(
    /(import|from|import\() (['"])(.*?)(\2)/g,
    (match, p1, p2, p3, p4) => {
      if (p3.startsWith(".") && !p3.startsWith("..") && p3.length === 1)
        return match; // Skip "."

      if (p3.startsWith(".")) {
        // Resolve the import path relative to the file's directory
        const fileDir = path.dirname(file);
        const absoluteImportPath = path.resolve(fileDir, p3);

        if (absoluteImportPath.startsWith(srcDir)) {
          // Get path relative to src
          let relativeToSrc = path.relative(srcDir, absoluteImportPath);
          // On Windows, path.relative might use backslashes
          relativeToSrc = relativeToSrc.replace(/\\/g, "/");

          // Find the most specific alias
          for (const alias of aliases) {
            if (
              relativeToSrc === alias.prefix ||
              relativeToSrc.startsWith(alias.prefix + "/")
            ) {
              let newPath;
              if (relativeToSrc === alias.prefix) {
                newPath = alias.name;
              } else {
                newPath =
                  alias.name +
                  "/" +
                  relativeToSrc.substring(
                    alias.prefix.length + (alias.prefix ? 1 : 0),
                  );
              }

              // Clean up any trailing / or leading /
              newPath = newPath.replace(/\/+/g, "/");

              if (newPath !== p3) {
                // console.log(`  ${p3} -> ${newPath}`);
                changed = true;
                return `${p1} ${p2}${newPath}${p4}`;
              }
              break; // Use the first (most specific) alias found
            }
          }
        }
      }
      return match;
    },
  );

  if (changed) {
    fs.writeFileSync(file, content, "utf8");
    console.log(`Updated ${path.relative(rootDir, file)}`);
  }
});

console.log("Refactor complete.");
