/**
 * Generates a new line based on the given text and type. this function is used for quote, bullet, and number list
 * If type is 'Previous', it checks the last two characters of the text,
 * if type is 'After', it checks the first two characters of the text.
 *
 * @param text The input text.
 * @param type The type of line to generate, either 'Previous' or 'After'.
 * @returns A string representing the generated new line(s).
 */

import { CursorPosition } from '../types';

export function formatWithNewLine(text: string, type: 'Before' | 'After') {
  const lastTwoChars = type === 'Before' ? text.slice(-2) : text.slice(0, 2);
  const lastChar = type === 'Before' ? text.slice(-1) : text.slice(0, 1);

  if (!lastChar) {
    return text;
  }

  if (lastTwoChars !== '\n\n') {
    const newLineSuffix = lastChar === '\n' ? '\n' : '\n\n';
    const newText =
      type === 'Before' ? `${text}${newLineSuffix}` : `${newLineSuffix}${text}`;
    return newText;
  }

  return text;
}

/**
 * Splits a given text into an array of lines based on newline characters ('\n').
 * Filters out any empty lines from the result.
 *
 * @param text - The input text to be separated.
 * @returns An array of non-empty lines extracted from the input text.
 */

export function separateTextByNewLine(text: string) {
  const separatedText = text.split('\n');
  return separatedText.filter((line) => line.trim() !== '');
}

/**
 * Retrieves information about the text based on the cursor position.
 *
 * @param text input text content.
 * @param cursorPosition position cursor in text input {start:number,end:number}.
 * @returns An object with information about the text before and after the cursor,
 * as well as the selected text if there is a range selected.
 */

export function getTextBasedCursorPosition({
  text,
  cursorPosition,
}: {
  text: string;
  cursorPosition: CursorPosition;
}) {
  const textBeforeCursorPosition = text.substring(0, cursorPosition.start);

  const textAfterCursorPosition = text.substring(
    cursorPosition.end,
    text.length,
  );

  const selectedText =
    cursorPosition.start !== cursorPosition.end
      ? text.substring(cursorPosition.start, cursorPosition.end)
      : '';

  return { textBeforeCursorPosition, textAfterCursorPosition, selectedText };
}

/**
 * Checks if the last line before the cursor in the input text is a bullet or numbering.
 * @param text Input text content paragraph.
 * @returns An object containing information about the last line:
 * - isBulletOrNumbering: Whether the last line is a bullet or numbering.
 * - typeSymbol: Type of the symbol used ('Bullet' or 'Numbering').
 * - nextNumber: The next number in the numbering sequence (if applicable).
 */

export function isLastLineBulletOrNumbering(text: string) {
  let lastLine = text.match(/(?:^|)(\d+\.|-)([^\n]+)$/);
  let typeSymbol: 'Numbering' | 'Bullet' | undefined;
  let nextNumber;
  const isBulletOrNumbering = !!lastLine && lastLine.length > 0;
  if (lastLine && lastLine.length > 0) {
    const symbol = lastLine[1];
    if (symbol === '-') {
      typeSymbol = 'Bullet';
    } else {
      nextNumber = Number(symbol.replace('.', '')) + 1;
      typeSymbol = 'Numbering';
    }
  }
  return { isBulletOrNumbering, typeSymbol, nextNumber };
}

/**
 * Checks if the provided text represents an empty bullet or numbering list.
 * @param text The input text to be checked.
 * @returns A boolean indicating whether the text represents an empty bullet or numbering list.
 *
 * Note Text input in here not paragraph just one line sentence
 */

export function isEmptyBulletAndNumbering(text: string) {
  const emptyListRegex = /^(\d+\.\s*|-\s*)$/;
  return emptyListRegex.test(text);
}

/**
 * Deletes the last line from the input text if it represents an empty bullet or numbering list.
 * @param text The input text paragraph from which the last line is to be deleted.
 * @returns An object containing the modified text with the last line removed if it represented an empty bullet or numbering list, and a boolean indicating whether the list was empty or not.
 */

export function deleteLastLineEmptyBulletOrNumberingList(text: string) {
  let lines = text.split('\n');
  let newText = text;
  let isEmptyList = false;
  if (isEmptyBulletAndNumbering(lines[lines.length - 1])) {
    lines[lines.length - 1] = '';
    newText = lines.join('\n');
    isEmptyList = true;
  }
  return { text: newText, isEmptyBulletAndNumbering: isEmptyList };
}
