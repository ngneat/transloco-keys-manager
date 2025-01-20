import { setConfig } from '../config';
import { buildKeys } from '../keys-builder/build-keys';
import { messages } from '../messages';
import { Config, ScopeMap } from '../types';
import { getLogger } from '../utils/logger';
import { resolveConfig } from '../utils/resolve-config';

import { compareKeysToFiles } from './compare-keys-to-files';
import { getTranslationFilesPath } from './get-translation-files-path';

export function findMissingKeys(inlineConfig: Config) {
  const logger = getLogger();
  const config = resolveConfig(inlineConfig);
  setConfig(config);

  const { translationsPath, fileFormat } = config;
  const translationFiles = getTranslationFilesPath(
    translationsPath,
    fileFormat,
  );

  if (translationFiles.length === 0) {
    console.log('No translation files found.');
    return;
  }

  logger.log('\n 🕵 🔎', `\x1b[4m${messages.startSearch}\x1b[0m`, '🔍 🕵\n');
  logger.startSpinner(`${messages.extract} `);

  const result = buildKeys(config);
  logger.success(`${messages.extract} 🗝`);
  if (config.scopedOnly) {
    if (Object.keys(result.scopeToKeys.__global).length) {
      logger.log(
        '\n\x1b[31m%s\x1b[0m',
        '⚠️',
        'Global keys found with scopedOnly flag active\n'
      );
      if (config.emitErrorOnExtraKeys) {
        process.exit(2);
      }
    }
    delete (result.scopeToKeys as Partial<ScopeMap>).__global;
  }

  const { addMissingKeys, emitErrorOnExtraKeys, unflat } = config;
  compareKeysToFiles({
    scopeToKeys: result.scopeToKeys,
    translationsPath,
    addMissingKeys,
    emitErrorOnExtraKeys,
    fileFormat,
    unflat,
  });
}
