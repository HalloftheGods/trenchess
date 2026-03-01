const fs = require("fs");
const path = require("path");

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith(".tsx") || file.endsWith(".ts")) {
      results.push(file);
    }
  });
  return results;
}

const files = walk("./src/app/client");
files.push("./src/shared/components/organisms/RouteBreadcrumbs.tsx");
files.push("./src/shared/hooks/interface/useCommandDispatcher.ts");
files.push("./src/shared/hooks/navigation/useRouteContextValue.ts");

files.forEach((file) => {
  let content = fs.readFileSync(file, "utf8");
  let original = content;

  // Replace ROUTES.a.b.c with getPath("a.b.c")
  content = content.replace(
    /ROUTES\.([a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)*)/g,
    (match, pathKeys) => {
      return `getPath("${pathKeys}")`;
    },
  );

  if (content !== original) {
    if (!content.includes("import { getPath }")) {
      // add import if missing
      content = `import { getPath } from "@/app/router/router";\n` + content;
      // also remove unused ROUTES if possible
      content = content.replace(
        /import\s*\{\s*ROUTES\s*\}\s*from\s*["']@\/app\/router\/router["'];?/g,
        "",
      );
    } else {
      if (
        content.match(
          /import\s*\{\s*ROUTES\s*\}\s*from\s*["']@\/app\/router\/router["'];?/g,
        )
      ) {
        content = content.replace(/ROUTES\s*,?\s*/g, "");
        content = content.replace(
          /import\s*\{\s*\}\s*from\s*["']@\/app\/router\/router["'];?\n*/g,
          "",
        );
      }
    }
    fs.writeFileSync(file, content, "utf8");
    console.log(`Updated ${file}`);
  }
});
