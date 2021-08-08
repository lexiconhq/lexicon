export function formatExtensions(extensions?: Array<string>) {
  if (!extensions) {
    return [];
  }

  const normalizedExtensions = extensions.map((ext) =>
    ext.includes('.') ? ext.substring(1) : ext,
  );

  return normalizedExtensions;
}
