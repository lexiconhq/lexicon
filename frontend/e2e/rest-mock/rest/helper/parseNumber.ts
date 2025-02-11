export function parseStringIntoNumber(data: string): number | null {
  const parsed = Number.parseInt(data.trim(), 10);
  return isNaN(parsed) ? null : parsed;
}
