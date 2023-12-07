export function generateSlug(text: string): string {
  const lowercaseText = text.toLowerCase();
  const slug = lowercaseText.replace(/\s/g, '_');
  return slug.replace(/^_+|_+$/g, '');
}
