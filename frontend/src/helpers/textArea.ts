import {
  NativeSyntheticEvent,
  Platform,
  TextInputKeyPressEventData,
} from 'react-native';

import { CursorPosition } from '../types';

import {
  deleteLastLineEmptyBulletOrNumberingList,
  getTextBasedCursorPosition,
  isLastLineBulletOrNumbering,
} from './fontFormatting';

type OnKeyPressParams = {
  event: NativeSyntheticEvent<TextInputKeyPressEventData>;
  cursorPosition: CursorPosition;
  text: string;
  onChange: (...event: Array<unknown>) => void;
};

export function onKeyPress({
  event,
  cursorPosition,
  text,
  onChange,
}: OnKeyPressParams) {
  if (event.nativeEvent.key === 'Enter') {
    let newText = '';
    const { textBeforeCursorPosition, textAfterCursorPosition } =
      getTextBasedCursorPosition({
        text,
        cursorPosition,
      });

    /**
     * This condition is added due to the difference in event handling between Android and iOS.
     * In iOS, the `onKeyPress` event is triggered first, while in Android, the `onChange` event runs first.
     * This leads to a disparity in the text content between iOS and Android, where in Android, the text
     * at the cursor position reflects the text after pressing 'Enter', while in iOS, it represents the
     * text before the last 'Enter'.
     *
     * Reference: https://github.com/facebook/react-native/issues/18221
     */

    const previousTextBeforeCursorPlatform =
      Platform.OS === 'android'
        ? textBeforeCursorPosition.substring(
            0,
            textBeforeCursorPosition.lastIndexOf('\n'),
          )
        : textBeforeCursorPosition;
    const checkBulletNumbering = isLastLineBulletOrNumbering(
      previousTextBeforeCursorPlatform,
    );
    if (checkBulletNumbering.isBulletOrNumbering) {
      let checkResultDelete = deleteLastLineEmptyBulletOrNumberingList(
        previousTextBeforeCursorPlatform,
      );
      if (checkResultDelete.isEmptyBulletAndNumbering) {
        newText = `${checkResultDelete.text}${textAfterCursorPosition}`;
      } else {
        if (checkBulletNumbering.typeSymbol === 'Bullet') {
          newText = `${previousTextBeforeCursorPlatform}\n- ${textAfterCursorPosition}`;
        } else {
          newText = `${previousTextBeforeCursorPlatform}\n${checkBulletNumbering.nextNumber}. ${textAfterCursorPosition}`;
        }
      }

      setTimeout(() => {
        onChange(newText);
      }, 100);
    }
  }
}
