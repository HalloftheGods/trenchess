const fs = require('fs');
const path = require('path');

const dirs = [
  'src/app/routes/game/components/atoms',
  'src/app/routes/game/components/molecules',
  'src/app/routes/game/components/organisms',
  'src/app/routes/game/components/templates',
  'src/shared/components/atoms',
  'src/shared/components/molecules',
  'src/shared/components/organisms',
  'src/shared/components/templates',
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx') || f.endsWith('.ts') && f !== 'index.ts');
  const exports = files.map(f => {
    const name = f.replace(/\.tsx?$/, '');
    return `export * from './${name}';`;
  }).join('\n');
  
  if (exports) {
    fs.writeFileSync(path.join(dir, 'index.ts'), exports + '\n');
    console.log(`Generated barrel for ${dir}`);
  }
});
