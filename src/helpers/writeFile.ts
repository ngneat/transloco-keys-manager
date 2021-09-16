import * as fs from 'fs';

import { stringify } from './stringify';

export function writeFile(fileName: string, content: object, addEofNewline = false) {
  return fs.writeFileSync(fileName, stringify(content) + (addEofNewline ? '\n' : ''), { encoding: 'UTF-8' });
}
