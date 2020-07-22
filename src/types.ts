export type Config = {
  input?: string[];
  config?: string;
  project?: string;
  translationsPath?: string;
  langs?: string[];
  defaultValue?: undefined | string;
  replace?: boolean;
  addMissingKeys?: boolean;
  deleteMissingKeys?: boolean;
  emitErrorOnExtraKeys?: boolean;
  scopes?: Scopes;
  scopePathMap?: {
    [scopeAlias: string]: string;
  };
  files?: string[];
  output?: string;
  marker?: string;
  sort?: boolean;
  unflat?: boolean;
  command?: 'extract' | 'find';
};

export type ExtractionResult = {
  scopeToKeys: ScopeMap;
  fileCount?: number;
};

export type ExtractorConfig = {
  file: string;
  scopes: Scopes;
  defaultValue: string;
  scopeToKeys: ScopeMap;
};

export type Scopes = {
  // scope/path => scopePath
  scopeToAlias: {
    [scope: string]: string;
  };
  // scopePath => scope/path
  aliasToScope: {
    [scopeAlias: string]: string;
  };
};

export type ScopeMap = {
  __global: object;
  [scopePath: string]: object;
};

export enum TEMPLATE_TYPE {
  STRUCTURAL,
  NG_TEMPLATE
}

export type BaseParams = {
  defaultValue: string;
  scopeToKeys: ScopeMap;
  scopes: Scopes;
};
