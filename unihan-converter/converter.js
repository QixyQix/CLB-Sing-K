import path, { dirname } from 'path';
import fs, { writeFile } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const readFile = (fileName) => {
    return fs
        .readFileSync(path.join(__dirname, '/Unihan/' + fileName), 'utf8')
        .toString()
        .trim()
        .split('\n');
}

const unicodeStrToChar = (unicodeStr) => {
    let decimal = parseInt(unicodeStr.replace('U+', ''), 16);
    return String.fromCodePoint(decimal);
}

// Process unihan
const variantsFileContent = readFile('Unihan_Variants.txt');
let tradToSimpMap = {}
for (let line of variantsFileContent) {
    if (line[0] === '#') continue;
    if (line.length < 1) continue;

    const lineFields = line.split('\t');
    if (lineFields[1] === 'kSimplifiedVariant') {
        let tradChar = unicodeStrToChar(lineFields[0]);
        let simpChar = unicodeStrToChar(lineFields[2]);
        if (tradToSimpMap[tradChar]) {
            console.log('CLASH FOR: ' + tradChar)
        } else {
            tradToSimpMap[tradChar] = simpChar;
        }
    }
}

// console.dir(tradToSimpMap);
const t2sObjLiteral = `const tradToSimp = ${JSON.stringify(tradToSimpMap, null, 4)};`;
fs.writeFileSync(path.join(__dirname, '/Output/t2s.js'), t2sObjLiteral);

