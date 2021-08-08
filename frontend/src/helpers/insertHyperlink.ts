export function insertHyperlink(
  raw: string,
  hyperlinkTitle: string,
  hyperlinkUrl: string | undefined,
) {
  if (hyperlinkUrl) {
    raw = `${raw !== '' ? `${raw} ` : ''}[${hyperlinkTitle}](${hyperlinkUrl})`;
  }

  return raw;
}
