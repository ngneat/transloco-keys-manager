export function marker<T extends string | string[]>(
  key: T,
  params?: unknown,
  lang?: string
): T {
  return key;
}
