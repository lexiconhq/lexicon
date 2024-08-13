import {
  formatWithNewLine,
  getTextBasedCursorPosition,
  separateTextByNewLine,
  isLastLineBulletOrNumbering,
  isEmptyBulletAndNumbering,
} from '../fontFormatting';
describe('formatWithNewLine', () => {
  it('should generate new line from previous text', () => {
    const inputPreviousText = 'This is test';
    const inputPreviousText2 = 'hello\n';

    expect(formatWithNewLine(inputPreviousText, 'Before')).toEqual(
      'This is test\n\n',
    );
    expect(formatWithNewLine(inputPreviousText2, 'Before')).toEqual(
      'hello\n\n',
    );
  });

  it('should generate new line from after text', () => {
    const inputAfterText = 'hello';
    const inputAfterText2 = '\njust test';

    expect(formatWithNewLine(inputAfterText, 'After')).toEqual('\n\nhello');
    expect(formatWithNewLine(inputAfterText2, 'After')).toEqual(
      '\n\njust test',
    );
  });

  it('should not generate new line', () => {
    const inputText = '\n\n';
    expect(expect(formatWithNewLine(inputText, 'Before')).toEqual('\n\n'));
    expect(expect(formatWithNewLine(inputText, 'After')).toEqual('\n\n'));
    expect(expect(formatWithNewLine('', 'Before')).toEqual(''));
    expect(expect(formatWithNewLine('', 'After')).toEqual(''));
  });
});

describe('separateTextByNewLine', () => {
  it('should separate text by new lines and filter out empty lines', () => {
    const inputText = 'This\n\nJust Test\n\n';
    const result = separateTextByNewLine(inputText);
    expect(result).toEqual(['This', 'Just Test']);
  });

  it('should handle empty input text', () => {
    const inputText = '';
    const result = separateTextByNewLine(inputText);
    expect(result).toEqual([]);
  });

  it('should handle input with only whitespace', () => {
    const inputText = ' \n  \n  \n';
    const result = separateTextByNewLine(inputText);
    expect(result).toEqual([]);
  });
});

describe('getTextBasedCursorPosition', () => {
  test('should correctly extract text before and after the cursor', () => {
    const text = 'This is a sample text.';
    const cursorPosition = { start: 5, end: 8 };

    const result = getTextBasedCursorPosition({ text, cursorPosition });

    expect(result.textBeforeCursorPosition).toBe('This ');
    expect(result.textAfterCursorPosition).toBe('a sample text.');
    expect(result.selectedText).toBe('is ');
  });

  test('should handle the case when no text is selected', () => {
    const text = 'No text selected.';
    const cursorPosition = { start: 8, end: 8 };

    const result = getTextBasedCursorPosition({ text, cursorPosition });

    expect(result.textBeforeCursorPosition).toBe('No text ');
    expect(result.textAfterCursorPosition).toBe('selected.');
    expect(result.selectedText).toBe('');
  });
});

describe('isLastLineBulletOrNumbering', () => {
  it('should check is last line bullet or numbering', () => {
    const text1 = `Here List of food:\n- Pizza\n- Macaroni`;
    const text2 = 'Here List of food:\n1. Pizza\n2. Macaroni';

    expect(isLastLineBulletOrNumbering(text1)).toEqual({
      isBulletOrNumbering: true,
      typeSymbol: 'Bullet',
      nextNumber: undefined,
    });

    expect(isLastLineBulletOrNumbering(text2)).toEqual({
      isBulletOrNumbering: true,
      typeSymbol: 'Numbering',
      nextNumber: 3,
    });
  });

  it('should return invalid bullet or numbering', () => {
    const text1 = 'Hello this is just empty paragraph';
    const text2 =
      'Combination list and number\n1. This is list\n- this is bullet\nempty paragraph';

    expect(isLastLineBulletOrNumbering(text1)).toEqual({
      isBulletOrNumbering: false,
      typeSymbol: undefined,
      nextNumber: undefined,
    });

    expect(isLastLineBulletOrNumbering(text2)).toEqual({
      isBulletOrNumbering: false,
      typeSymbol: undefined,
      nextNumber: undefined,
    });
  });
  describe('isEmptyBulletAndNumbering', () => {
    test('should check list or number not empty', () => {
      const text = '1. hello';
      const text1 = '- hello';
      const text2 = 'hello';

      expect(isEmptyBulletAndNumbering(text)).toBeFalsy();
      expect(isEmptyBulletAndNumbering(text1)).toBeFalsy();
      expect(isEmptyBulletAndNumbering(text2)).toBeFalsy();
    });

    test('should check list is empty', () => {
      const text = '1. ';
      const text1 = '- ';

      expect(isEmptyBulletAndNumbering(text)).toBeTruthy();
      expect(isEmptyBulletAndNumbering(text1)).toBeTruthy();
    });
  });
});
