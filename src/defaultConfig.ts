import { Config } from './types';

export type ProjectType = 'application' | 'library';

export function defaultConfig(projectType: ProjectType = 'application'): Config {
  const isApp = projectType === 'application';

  return {
    // The source directory for all files using the translation keys
    input: [isApp ? 'app' : 'lib'],

    // The target directory for all generated translation files
    output: 'assets/i18n',

    // The languages files to generate
    langs: ['en'],

    // The marker sign for dynamic values
    marker: 't',

    // Whether to sort the keys
    sort: false,

    /**
     *  Relevant only for the Extractor
     */

    // The default value of a generated key
    defaultValue: undefined,

    // Replace the contents of a translation file (if it exists) with the generated one (default value is false, in which case files are merged)
    replace: false,

    // Delete missing keys from existing file that were not found by the detective (default value is false)
    deleteMissingKeys: false,

    /**
     *   Relevant only for the Detective
     */

    // Add missing keys that were found by the detective (default value is false)
    addMissingKeys: false,

    // Emit an error and exit the process if extra keys were found (defaults to `false`)
    emitErrorOnExtraKeys: false,

    // The path for the root translation files (for example: assets/i18n)
    translationsPath: 'assets/i18n'
  };
}
