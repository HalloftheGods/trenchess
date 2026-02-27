import fs from "fs";
import path from "path";

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach((f) => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const directories = ["./src", "./__tests__"]; // Adjusted to look into __tests__ if it exists or just ./src

// But wait, the grep showed /__tests__ usually.
// Let's just walk ./src and ./__tests__ explicitly if they exist.

const targets = ["./src", "./__tests__"];

targets.forEach((target) => {
  if (!fs.existsSync(target)) return;
  walkDir(target, function (filePath) {
    if (filePath.endsWith(".ts") || filePath.endsWith(".tsx")) {
      let content = fs.readFileSync(filePath, "utf8");
      let original = content;

      // Replace from "constants" with from "@constants"
      // Match both double and single quotes
      content = content.replace(/from\s+"constants"/g, 'from "@constants"');
      content = content.replace(/from\s+'constants'/g, "from '@constants'");

      if (content !== original) {
        console.log(`Updated ${filePath}`);
        fs.writeFileSync(filePath, content, "utf8");
      }
    }
  });
});
