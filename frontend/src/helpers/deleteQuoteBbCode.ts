import { QUOTE_CLOSE_REGEX, QUOTE_OPEN_REGEX } from '../constants';

export function deleteQuoteBbCode(input: string) {
  // Check whether there is a quote or not
  if (!input.includes('[quote')) {
    return input;
  }

  const contentArray = input.split('\n');
  const replacedContent = [];
  let indentation = 0;

  for (const content of contentArray) {
    const openQuoteArray = content.match(QUOTE_OPEN_REGEX);
    const closeQuoteArray = content.match(QUOTE_CLOSE_REGEX);

    // If the current line has no open quote and close quote,
    // push the contents to the array and continue to the next loop
    if (!openQuoteArray && !closeQuoteArray && indentation === 0) {
      replacedContent.push(`${content.trim()}`);
      continue;
    }

    if (openQuoteArray) {
      indentation++;
    }

    if (closeQuoteArray) {
      indentation--;
    }
  }

  return replacedContent.join('\n');
}
