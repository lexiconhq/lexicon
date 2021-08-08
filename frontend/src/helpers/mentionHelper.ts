import { SetStateAction } from 'react';

import { CursorPosition } from '../types';

export function mentionHelper(
  text: string,
  cursorPosition: CursorPosition,
  setShowUserList: (value: SetStateAction<boolean>) => void,
  setMentionLoading: (value: SetStateAction<boolean>) => void,
  setMentionKeyword: (value: SetStateAction<string>) => void,
) {
  if (text.charAt(cursorPosition.end - 2) === '@') {
    setShowUserList(true);
  }

  if (text.charAt(cursorPosition.end - 2) === ' ' || !text.includes('@')) {
    setShowUserList(false);
  }

  let keywords = text.match(/@[A-Za-z0-9._-]*$/);
  setMentionKeyword(keywords ? keywords[0].substr(1) : '');

  if (keywords && keywords[0].substr(1).length > 0) {
    setMentionLoading(true);
  }
}
