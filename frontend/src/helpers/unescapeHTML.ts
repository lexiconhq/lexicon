const htmlEntities: { [key: string]: string } = {
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&amp;': '&',
  '&hellip;': '...',
};

export function unescapeHTML(str: string) {
  return str.replace(
    /&lt;|&gt;|&quot;|&#39;|&amp;|&hellip;/g,
    (match: string) => htmlEntities[match],
  );
}
