import { unflatten } from 'flat';
import * as fsExtra from 'fs-extra';

import { getConfig } from '../config';
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
  addEofNewline = false
): FileAction {
  const currentTranslation = fsExtra.readJsonSync(path, { throws: false }) || {};
  const action: FileAction = { type: currentTranslation ? 'modified' : 'new', path };

  let newTranslation;
  if (getConfig().unflat) {
    translation = unflatten(translation, { object: true });
  }

  if (replace) {
    newTranslation = mergeDeep({}, translation);
  } else {
    newTranslation = mergeDeep(translation, currentTranslation);
  }

  fsExtra.outputFileSync(path, stringify(newTranslation) + (addEofNewline ? '\n' : ''));

  return action;
}
