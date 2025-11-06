#!/usr/bin/env node

/**
 * Extracts TypeScript data arrays and emits JSON files for the Flutter app.
 *
 * The script is intentionally light-weight: it reads the TS source, finds the
 * exported array literal, evaluates it inside a Node VM sandbox, and writes
 * the resulting JavaScript objects as JSON. This lets us keep the single source
 * of truth in the Next.js project while shipping precompiled assets with the
 * Flutter client.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

function extractArrayLiteral(content, exportName) {
  const exportIndex = content.indexOf(`export const ${exportName}`);
  if (exportIndex === -1) {
    throw new Error(`Could not find export "${exportName}" in source file.`);
  }

  const equalsIndex = content.indexOf('=', exportIndex);
  if (equalsIndex === -1) {
    throw new Error(`Could not find assignment for "${exportName}".`);
  }

  const bracketStart = content.indexOf('[', equalsIndex);
  if (bracketStart === -1) {
    throw new Error(`Could not find array start for "${exportName}".`);
  }

  let i = bracketStart;
  let depth = 0;
  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;
  let prevChar = '';

  for (; i < content.length; i += 1) {
    const char = content[i];
    const isEscaped = prevChar === '\\';

    if (!isEscaped) {
      if (char === "'" && !inDouble && !inTemplate) {
        inSingle = !inSingle;
      } else if (char === '"' && !inSingle && !inTemplate) {
        inDouble = !inDouble;
      } else if (char === '`' && !inSingle && !inDouble) {
        inTemplate = !inTemplate;
      }
    }

    if (!inSingle && !inDouble && !inTemplate) {
      if (char === '[') {
        depth += 1;
      } else if (char === ']') {
        depth -= 1;
        if (depth === 0) {
          return content.slice(bracketStart, i + 1);
        }
      }
    }

    prevChar = isEscaped ? '' : char;
  }

  throw new Error(`Could not determine array end for "${exportName}".`);
}

function evaluateArray(arrayLiteral, label) {
  try {
    const script = new vm.Script(`(${arrayLiteral})`, { filename: label });
    return script.runInNewContext({});
  } catch (error) {
    console.error(`Failed to evaluate array literal for "${label}":`, error);
    throw error;
  }
}

function writeJson(data, outputPath) {
  const dir = path.dirname(outputPath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  console.log(`✓ Wrote ${outputPath}`);
}

const rootDir = process.cwd();

const datasets = [
  {
    source: path.join(rootDir, 'src/app/data/guess-festival/data-guess-festival.en.ts'),
    exportName: 'festivalsEn',
    output: path.join(rootDir, 'piro_momo_games/assets/data/guess_festival_en.json'),
  },
  {
    source: path.join(rootDir, 'src/app/data/guess-festival/data-guess-festival.np.ts'),
    exportName: 'festivalsNp',
    output: path.join(rootDir, 'piro_momo_games/assets/data/guess_festival_np.json'),
  },
  {
    source: path.join(rootDir, 'src/app/data/gau-khane-katha/gaukhanedata-en.ts'),
    exportName: 'englishRiddles',
    output: path.join(rootDir, 'piro_momo_games/assets/data/gau_khane_katha_en.json'),
  },
  {
    source: path.join(rootDir, 'src/app/data/gau-khane-katha/gaukhanedata-np.ts'),
    exportName: 'nepaliRiddles',
    output: path.join(rootDir, 'piro_momo_games/assets/data/gau_khane_katha_np.json'),
  },
];

datasets.forEach(({ source, exportName, output }) => {
  const content = fs.readFileSync(source, 'utf8');
  const literal = extractArrayLiteral(content, exportName);
  const data = evaluateArray(literal, `${path.basename(source)}::${exportName}`);
  writeJson(data, output);
});
