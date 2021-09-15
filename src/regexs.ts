import { sanitizeForRegex } from './helpers/sanitizeForRegex';

export const regexs = {
  templateKey: varName => new RegExp(`\\b${varName}\\((?![^,)+]*\\+)\\s*('|")(?<key>.*?)\\1`, 'g'),
  directive: () => new RegExp(`\\stransloco\\s*=\\s*("|')(?<key>[^]+?)\\1`, 'g'),
  directiveTernary: () => new RegExp(`\\s\\[transloco\\]\\s*=\\s*("|')[^"'?]*\\?(?<key>[^]+?)\\1`, 'g'),
  structuralDirectiveTernary: varName =>
    new RegExp(`\\b${varName}\\([^?}]+\\?\\s*("|')(?<keyA>[^'":]+)\\1\\s*:\\s*("|')(?<keyB>[^'"]*)\\3\\s*\\)`, 'g'),
  pipe: () =>
    /(?:(?:\{\{(?![^^}\|+]*\+)[^}\|'"]*)|(?:\[[^\]]*\]=(?:"|')(?![^'"+]*\+)[^'"]*))('|")(?<key>[^'"\[>=]*?)\1[^'"\|\[}]*(?:('|")(?<key2>[^"'\[>]*?)\3)?[^\|}>\[=]*?\|[^}>\[]*?transloco/g,
  tsCommentsSection: () => /\/\*\*[^]+?\*\//g,
  templateCommentsSection: () => /<!--[^]+?-->/g,
  templateValidComment: marker => new RegExp(`<!--(\\s*${sanitizeForRegex(marker)}\\(([^)]+)\\)\\s*)+\\s*-->`),
  markerValues: marker => new RegExp(`\\b${sanitizeForRegex(marker)}\\(([^)]+)\\)`, 'g'),
  /** use the translate function directly */
  directImport: /import\s*{\s*[^}]*translate[^}]*}\s*from\s*("|')@ngneat\/transloco\1/
};
