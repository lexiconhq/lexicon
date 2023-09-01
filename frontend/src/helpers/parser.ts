export function parseInt(param: string) {
  const parsed = Number.parseInt(param, 10);
  return Number.isNaN(parsed) ? undefined : parsed;
}
