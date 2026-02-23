import { readdirSync, statSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

function walkDir(dir) {
  let results = [];
  const list = readdirSync(dir);
  list.forEach((file) => {
    file = join(dir, file);
    const stat = statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(file));
    } else {
      if (
        file.endsWith(".ts") ||
        file.endsWith(".tsx") ||
        file.endsWith(".js") ||
        file.endsWith(".jsx")
      ) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walkDir("./src");

files.forEach((file) => {
  let content = readFileSync(file, "utf8");
  let newContent = content
    .replace(/player1/g, "red")
    .replace(/player2/g, "yellow")
    .replace(/player3/g, "green")
    .replace(/player4/g, "blue")
    .replace(/Player 1/g, "Red")
    .replace(/Player 2/g, "Yellow")
    .replace(/Player 3/g, "Green")
    .replace(/Player 4/g, "Blue");
  // Ensure display strings that say 'NORTH' become 'RED (North)' or something,
  // Wait, let's keep it simple. Only replace IDs for now.
  if (content !== newContent) {
    writeFileSync(file, newContent);
    console.log("Updated", file);
  }
});
