import fs from 'fs';
import { globSync } from 'glob';

const files = globSync('src/**/*.{ts,tsx,js,jsx}');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  const initialContent = content;
  content = content.replace(/player1/g, 'red')
                   .replace(/player2/g, 'yellow')
                   .replace(/player3/g, 'green')
                   .replace(/player4/g, 'blue');
  if (content !== initialContent) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
}
