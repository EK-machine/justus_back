export function filterIds(existingIds: number[], incomingIds: number[]): number[] {
  if(existingIds.length === 0) {
    return incomingIds;
  }
  const existingSet = new Set(existingIds);
  return incomingIds.filter(id => !existingSet.has(id));
}