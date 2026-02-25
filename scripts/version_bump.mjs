import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageJsonPath = path.resolve(__dirname, "../package.json");

const getFormattedDate = () => {
  const now = new Date();
  const year = String(now.getFullYear()).slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
};

const bumpVersion = () => {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  const currentVersion = packageJson.version || "0.0.0";
  const currentDatePrefix = getFormattedDate();

  let nextVersion;
  const versionRegex = /^v(\d{2}\.\d{2}\.\d{2})\.rc(\d+)$/;
  const match = currentVersion.match(versionRegex);

  if (match) {
    const [, datePart, rcPart] = match;
    if (datePart === currentDatePrefix) {
      const nextRc = String(parseInt(rcPart, 10) + 1).padStart(2, "0");
      nextVersion = `v${currentDatePrefix}.rc${nextRc}`;
    } else {
      nextVersion = `v${currentDatePrefix}.rc01`;
    }
  } else {
    nextVersion = `v${currentDatePrefix}.rc01`;
  }

  packageJson.version = nextVersion;
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2) + "\n",
  );
  console.log(`Version bumped to: ${nextVersion}`);
};

bumpVersion();
