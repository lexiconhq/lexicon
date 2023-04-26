export function extractAttributes(attributesCSV: string) {
  const split = attributesCSV.split(',');
  const attributeStrings = split.filter((item) => item.includes(':'));

  return attributeStrings.reduce<Record<string, string>>(
    (accumulator, current) => {
      const trimmed = current.trim();
      const [key, value] = trimmed.split(':');
      return {
        ...accumulator,
        [key]: value,
      };
    },
    {},
  );
}
