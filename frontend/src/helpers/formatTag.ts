export function formatTag(text: string, maxLength?: number): string {
  let words = text.match(/[a-z0-9]+/gi);

  if (!words) {
    return '';
  }

  if (maxLength) {
    return words
      .map((word) => word.toLocaleLowerCase())
      .join('-')
      .slice(0, maxLength);
  }

  return words.map((word) => word.toLocaleLowerCase()).join('-');
}
