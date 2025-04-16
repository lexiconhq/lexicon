const collapsibleRegex =
  /\[details="[^[\]]*"\](?:(?!(\[details="[^[\]]*"\]|\[\/details\])).)*\[\/details\]/gs;
const collapsibleMarkerRegex = /\[collapsible-\d]/g;

function replaceCollapsible(
  content: string,
  collapsible: { [key: string]: string },
) {
  const collapsibleMarkers = content.match(collapsibleMarkerRegex);

  if (!collapsibleMarkers) {
    return content;
  }

  collapsibleMarkers.forEach((collapsibleKey) => {
    content = content.replace(collapsibleKey, collapsible[collapsibleKey]);
  });

  return replaceCollapsible(content, collapsible);
}

/**
 * Extracting only the collapsible markdown from the full markdown content.
 *
 * @param content - Markdown content
 * @returns List of collapsible markdown
 */
function extractCollapsible(content: string) {
  let collapsibleCount = 1;
  const extractedCollapsible: { [key: string]: string } = {};

  // This loop is for handling nested collapsible.
  while (content.length) {
    // Match every collapsible markdown that doesn't contains another collapsible (most inner collapsible)
    const matchedCollapsible = content.match(collapsibleRegex);

    if (!matchedCollapsible) {
      break;
    }

    /** 
     * Replace the matched collapsibles with the keyword [collapsible-{index}].
     * We repeat the process again, working on the collapsible one level above the previous iteration,
     * until we reached the most outer level of the collapsible.
     * 
     * Ex:
     * -> Before: [details="Outer collapsible"]
                  [details="Inner collapsible"]
                  [details="Collapsible"]
                  Content
                  [/details]
                  [/details]
                  [/details]
     * -> 1st: [details="Outer collapsible"]
               [details="Inner collapsible"]
               [collapsible-1]
               [/details]
               [/details]
     * -> 2nd: [details="Outer collapsible"]
               [collapsible-2]
               [/details]
     * -> 3rd: [collapsible-3]
     */
    matchedCollapsible.forEach((collapsible) => {
      const collapsibleKey = `[collapsible-${collapsibleCount}]`;
      content = content.replace(collapsible, collapsibleKey);
      extractedCollapsible[collapsibleKey] = collapsible;
      collapsibleCount += 1;
    });
  }

  // Match all the collapsible keywords in content. Example: ['[collapsible-3]']
  const mostOuterCollapsibles = content.match(collapsibleMarkerRegex);

  if (!mostOuterCollapsibles) {
    return [];
  }

  /**
   * We replace back collapsible markdown before returning the result.
   * replaceCollapsible reverse the steps in the while loop above, replacing the keyword
   * with the corresponding collapsible markdown from the most outer level to the most inner level.
   * 
   * Ex:
   * -> Before: [collapsible-3] 
   * -> 1st: [details="Outer collapsible"]
             [collapsible-2]
             [/details]
   * -> 2nd: [details="Outer collapsible"]
             [details="Inner collapsible"]
             [collapsible-1]
             [/details]
             [/details]
   * -> 3rd: [details="Outer collapsible"]
             [details="Inner collapsible"]
             [details="Collapsible"]
             Content
             [/details]
             [/details]
             [/details]
   */
  return mostOuterCollapsibles.map((collapsibleKey) =>
    replaceCollapsible(
      extractedCollapsible[collapsibleKey],
      extractedCollapsible,
    ),
  );
}

export function extractCollapsibleContent(collapsible: string) {
  let title =
    collapsible
      .match(/^\[details="(.*?)"\]/)
      ?.pop()
      ?.trim() || '';
  let details =
    collapsible
      .match(/^\[details=".*?"\](.+?)\[\/details\]$/s)
      ?.pop()
      ?.trim() || '';

  return { title, details };
}

export function isCollapsible(content: string) {
  const regex = /^\[details="[^[\]]+"\].*\[\/details\]$/s;
  return regex.test(content);
}

export function separateCollapsibleInContent(content: string) {
  const collapsibles = extractCollapsible(content);

  if (!collapsibles.length) {
    return [content];
  }

  let splittedContent: Array<string> = [];
  collapsibles.forEach((collapsible, index) => {
    let endIndex = content.indexOf(collapsible);

    const beforeCollapsible = content.substring(0, endIndex).trim();
    if (beforeCollapsible) {
      splittedContent.push(beforeCollapsible);
    }
    splittedContent.push(collapsible);
    content = content.slice(endIndex + collapsible.length + 1);

    if (index === collapsibles.length - 1 && content) {
      splittedContent.push(content);
    }
  });

  return splittedContent;
}
