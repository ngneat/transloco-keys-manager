import { setConfig } from './config';
import { countKeys } from './helpers/countKeys';
import { getLogger } from './helpers/logger';
import { resolveConfig } from './helpers/resolveConfig';
import { buildKeys } from './keysBuilder/buildKeys';
import { createTranslationFiles } from './keysBuilder/createTranslationFiles';
import { messages } from './messages';
import { Config } from './types';

/** The main function, collects the settings and starts the files build. */
export function buildTranslationFiles(inlineConfig: Config) {
  const logger = getLogger();
  const config = resolveConfig(inlineConfig);

  setConfig(config);
  logger.log('\x1b[4m%s\x1b[0m', `\n${messages.startBuild(config.langs.length)} 👷🏗\n`);
  logger.startSpinner(`${messages.extract} 🗝`);

  const result = buildKeys(config);
  const { scopeToKeys, fileCount } = result;

  logger.success(`${messages.extract} 🗝`);

  let keysFound = 0;
  for (const [_, scopeKeys] of Object.entries(scopeToKeys)) {
    keysFound += countKeys(scopeKeys as object);
  }

  logger.log('\x1b[34m%s\x1b[0m', 'ℹ', messages.keysFound(keysFound, fileCount));

  createTranslationFiles({
    scopeToKeys,
    scopes: config.scopes,
    langs: config.langs,
    outputPath: config.output,
    replace: config.replace,
    deleteMissingKeys: config.deleteMissingKeys
  });
}
