import { QUOTE_CLOSE_REGEX, QUOTE_OPEN_REGEX } from '../constants';

import { extractAttributes } from './extractAttributes';

export function replaceQuotesWithMarkdown(input: string) {
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
    if (!openQuoteArray && !closeQuoteArray) {
      const prefix = '> '.repeat(indentation);
      replacedContent.push(`${prefix}${content.trim()}`);

      continue;
    }

    let replacedCode = content;
    if (openQuoteArray) {
      indentation++;

      replacedCode = replacedCode.replace(
        QUOTE_OPEN_REGEX,
        (_match, attribute: string) => {
          if (!attribute) {
            return '';
          }

          // If username is not in the attributes
          // we will replace it with "(unknown user)".
          let username = '(unknown user)';
          const extracted = extractAttributes(attribute);

          if (extracted?.username) {
            username = `@${extracted.username}`;
          } else {
            const quoteAttribute = attribute.split(', ');

            if (quoteAttribute.length > 0 && !quoteAttribute[0].includes(':')) {
              username = `@${quoteAttribute[0]}`;
            }
          }

          return `${'> '.repeat(indentation)}${username}`;
        },
      );
    }

    if (closeQuoteArray) {
      indentation--;
      replacedCode = replacedCode.replace(QUOTE_CLOSE_REGEX, '');
      replacedContent.push(`${'> '.repeat(indentation)}`);
    }

    if (replacedCode.length > 0) {
      replacedContent.push(`${replacedCode}`);
    }
  }

  return replacedContent.join('\n');
}
