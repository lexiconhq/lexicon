export function stripHTML(str: string) {
  return str.replace(/<[^>\s]*>|<[^\s][^><]*>/g, '');
}
