export function areAllMethodsPresent(existing: string[], incoming: string[]): boolean {
  if (existing.length === 0 || incoming.length === 0) {
    return false;
  }

  const existingSet = new Set(existing);

  return incoming.every(item => existingSet.has(item));
}