import { setConfig } from './config';
import { getLogger } from './helpers/logger';
import { resolveConfig } from './helpers/resolveConfig';
import { buildKeys } from './keysBuilder/buildKeys';
import { compareKeysToFiles } from './keysDetective/compareKeysToFiles';
import { getTranslationFilesPath } from './keysDetective/getTranslationFilesPath';
import { messages } from './messages';
import { Config } from './types';

export function findMissingKeys(inlineConfig: Config) {
  const logger = getLogger();
  const config = resolveConfig(inlineConfig);
  setConfig(config);

  const translationFiles = getTranslationFilesPath(config.translationsPath);

  if (translationFiles.length === 0) {
    console.log('No translation files found.');
    return;
  }

  logger.log('\n 🕵 🔎', `\x1b[4m${messages.startSearch}\x1b[0m`, '🔍 🕵\n');
  logger.startSpinner(`${messages.extract} `);

  const result = buildKeys(config);
  logger.success(`${messages.extract} 🗝`);

  compareKeysToFiles({
    scopeToKeys: result.scopeToKeys,
    translationPath: config.translationsPath,
    addMissingKeys: config.addMissingKeys,
    emitErrorOnExtraKeys: config.emitErrorOnExtraKeys,
    addEofNewline: config.addEofNewline
  });
}
