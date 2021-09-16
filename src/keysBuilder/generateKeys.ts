import { TranslocoConfig } from '@ngneat/transloco-utils';
import { unflatten } from 'flat';
import * as glob from 'glob';
import * as nodePath from 'path';

import { mergeDeep } from '../helpers/mergeDeep';
import { readFile } from '../helpers/readFile';
import { writeFile } from '../helpers/writeFile';
import { ScopeMap, Config } from '../types';

type Params = {
  translationPath: string;
  scopeToKeys: ScopeMap;
  config: Config & TranslocoConfig;
};

function filterLangs(config: Params['config']) {
  return function (path: string) {
    return config.langs.find(lang => lang === nodePath.basename(path).replace('.json', ''));
  };
}

/**
 * In use in the Webpack Plugin
 */
export function generateKeys({ translationPath, scopeToKeys, config }: Params) {
  const scopePaths = config.scopePathMap || {};

  let result = [];

  for (const [scope, path] of Object.entries(scopePaths)) {
    const keys = scopeToKeys[scope];
    if (keys) {
      result.push({
        keys,
        files: glob.sync(`${path}/*.json`).filter(filterLangs(config))
      });
    }
  }

  for (const [scope, keys] of Object.entries(scopeToKeys)) {
    if (keys) {
      const isGlobal = scope === '__global';

      result.push({
        keys,
        files: glob.sync(`${translationPath}/${isGlobal ? '' : scope}*.json`).filter(filterLangs(config))
      });
    }
  }

  for (let { files, keys } of result) {
    if (config.unflat) {
      keys = unflatten(keys);
    }
    for (const filePath of files) {
      const translation = readFile(filePath, { parse: true });
      writeFile(filePath, mergeDeep({}, keys, translation), config.addEofNewline);
    }
  }
}
