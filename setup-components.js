const fs = require('fs');
const path = require('path');

// Create directories if they don't exist
const uiDir = path.join(__dirname, 'src', 'components', 'ui');
const libDir = path.join(__dirname, 'src', 'lib');

if (!fs.existsSync(uiDir)) {
  fs.mkdirSync(uiDir, { recursive: true });
}

if (!fs.existsSync(libDir)) {
  fs.mkdirSync(libDir, { recursive: true });
}

// Create utils.ts if it doesn't exist
const utilsPath = path.join(libDir, 'utils.ts');
if (!fs.existsSync(utilsPath)) {
  const utilsContent = `
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`;
  fs.writeFileSync(utilsPath, utilsContent.trim());
  console.log('Created utils.ts');
}

// Copy components from @ directory if it exists
const atComponentsDir = path.join(__dirname, '@', 'components', 'ui');
if (fs.existsSync(atComponentsDir)) {
  const files = fs.readdirSync(atComponentsDir);
  files.forEach(file => {
    const sourcePath = path.join(atComponentsDir, file);
    const destPath = path.join(uiDir, file);
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copied ${file} to src/components/ui`);
  });
}

console.log('Setup complete!'); 