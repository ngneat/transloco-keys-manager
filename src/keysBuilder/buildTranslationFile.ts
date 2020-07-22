import { unflatten } from 'flat';
import * as fsExtra from 'fs-extra';

import { getConfig } from '../config';
import { deleteMissingKeys } from '../helpers/deleteMissingKeys';
import { mergeDeep } from '../helpers/mergeDeep';
import { stringify } from '../helpers/stringify';

export type FileAction = {
  path: string;
  type: 'new' | 'modified';
};

export function buildTranslationFile(
  path: string,
  translation = {},
  replace = false,
  deleteMissing = false
): FileAction {
  let currentTranslation = fsExtra.readJsonSync(path, { throws: false }) || {};
  const action: FileAction = { type: currentTranslation ? 'modified' : 'new', path };

  let newTranslation;
  if (getConfig().unflat) {
    translation = unflatten(translation, { object: true });
  }

  if (replace) {
    newTranslation = mergeDeep({}, translation);
  } else {
    if (deleteMissing) {
      currentTranslation = deleteMissingKeys(currentTranslation, translation);
    }
    newTranslation = mergeDeep(translation, currentTranslation);
  }

  fsExtra.outputFileSync(path, stringify(newTranslation));

  return action;
}
