import { CursorPosition, RootStackParamList, User } from '../types';

import { errorHandlerAlert } from './errorHandler';
import {
  formatWithNewLine,
  getTextBasedCursorPosition,
  separateTextByNewLine,
} from './fontFormatting';
import { imagePickerHandler } from './imagePickerHandler';

export type BottomMenuNavigationScreens =
  | 'PostImagePreview'
  | 'HyperLink'
  | 'NewPoll';
export type BottomMenuNavigationParams =
  | RootStackParamList['PostImagePreview']
  | RootStackParamList['HyperLink']
  | RootStackParamList['NewPoll'];

type BottomMenuParams = {
  isKeyboardShow: boolean;
  user: User | null;
  navigate: (
    screen: BottomMenuNavigationScreens,
    params: BottomMenuNavigationParams,
  ) => void;
  prevScreen: 'NewPost' | 'PostReply' | 'NewMessage';
  extensions?: Array<string>;
  title?: string;
  topicId?: number;
  postId?: number;
  replyToPostId?: number;
};

type SetCursorPosition = (value: React.SetStateAction<CursorPosition>) => void;

type ButtonBarParams = {
  content: string;
  cursorPosition: CursorPosition;
  setCursorPosition: SetCursorPosition;
  setValue: (name: 'raw', value: string) => void;
};

type FontParams = ButtonBarParams & { type: 'Bold' | 'Italic' };
type ListParams = ButtonBarParams & { type: 'Number' | 'Bullet' };

export function bottomMenu(params: BottomMenuParams) {
  let {
    isKeyboardShow,
    user,
    navigate,
    prevScreen,
    extensions,
    title,
    topicId,
    replyToPostId,
  } = params;
  const onInsertImage = async () => {
    if (!isKeyboardShow) {
      return;
    }
    try {
      const result = await imagePickerHandler(extensions);
      if (!user || !result || !result.uri) {
        return;
      }
      const imageUri = result.uri;
      navigate('PostImagePreview', {
        imageUri,
        prevScreen,
        title,
      });
    } catch (unknownError) {
      // TODO: Eventually fix this so the type can resolve to ApolloError as well
      errorHandlerAlert(unknownError as string);
    }
    return;
  };

  const setTextInputCursorPosition = ({
    position,
    setCursorPosition,
  }: {
    position: CursorPosition;
    setCursorPosition: SetCursorPosition;
  }) => {
    setTimeout(() => {
      setCursorPosition(position);
    }, 50);
  };

  const onInsertLink = () => {
    if (!isKeyboardShow) {
      return;
    }
    navigate('HyperLink', {
      title,
      id: topicId,
      replyToPostId,
      prevScreen,
    });
  };

  const onInsertPoll = () => {
    if (!isKeyboardShow) {
      return;
    }
    navigate('NewPoll', { prevScreen });
  };

  /**
   * Handles font formatting in a text editor. This function is designed to apply
   * formatting, such as making text bold or italic, based on the specified font type.
   *
   * @param content The current content of the editor.
   * @param cursorPosition The current cursor position in the editor.
   * @param setCursorPosition A function to update the cursor position in the editor.
   * @param setValue A function to set the new content value in the editor.
   * @param type: The font type to be applied ('Italic' or 'Bold').
   */

  const onFontFormatting = ({
    content,
    cursorPosition,
    setCursorPosition,
    setValue,
    type,
  }: FontParams) => {
    const textFormattingConfig =
      type === 'Bold'
        ? { format: '**', positionCursor: 2 }
        : { format: '*', positionCursor: 1 };

    const { selectedText, textAfterCursorPosition, textBeforeCursorPosition } =
      getTextBasedCursorPosition({ cursorPosition, text: content });

    let newContent = '';
    if (cursorPosition.start === cursorPosition.end) {
      /**
       * First condition is used if there are no text highligh so cursor start and end will be same value
       */

      newContent = `${textBeforeCursorPosition}${textFormattingConfig.format}Change Text${textFormattingConfig.format}${textAfterCursorPosition}`;

      setTextInputCursorPosition({
        setCursorPosition,
        position: {
          start: cursorPosition.start + textFormattingConfig.positionCursor,
          end: cursorPosition.end + textFormattingConfig.positionCursor + 11,
        },
      });
    } else {
      /**
       * This condition used for highligh text
       */

      newContent = `${textBeforeCursorPosition}${textFormattingConfig.format}${selectedText}${textFormattingConfig.format}${textAfterCursorPosition}`;

      setTextInputCursorPosition({
        setCursorPosition,
        position: {
          start: cursorPosition.start + textFormattingConfig.positionCursor,
          end: cursorPosition.end + textFormattingConfig.positionCursor,
        },
      });
    }

    setValue('raw', newContent);
  };

  /**
   * Handles the "Quote" action in a button bar.
   * Inserts a quoted text block based on the current cursor position and selected text.
   *
   * @param content The current content of the editor.
   * @param cursorPosition The current cursor position in the editor.
   * @param setCursorPosition A function to update the cursor position in the editor.
   * @param setValue A function to set the new content value in the editor.
   */

  const onQuote = ({
    content,
    cursorPosition,
    setCursorPosition,
    setValue,
  }: ButtonBarParams) => {
    let newContent = '';

    const { selectedText, textAfterCursorPosition, textBeforeCursorPosition } =
      getTextBasedCursorPosition({ cursorPosition, text: content });

    if (cursorPosition.start === cursorPosition.end) {
      newContent = `${formatWithNewLine(
        textBeforeCursorPosition,
        'Before',
      )}> Quote Text${formatWithNewLine(textAfterCursorPosition, 'After')}`;

      setTextInputCursorPosition({
        setCursorPosition,
        position: {
          start:
            formatWithNewLine(textBeforeCursorPosition, 'Before').length + 2,
          end:
            formatWithNewLine(textBeforeCursorPosition, 'Before').length + 12,
        },
      });
    } else {
      const selectedTextArray = separateTextByNewLine(selectedText);

      const isEmptySelectedText = selectedTextArray.length === 0;

      /**
       * This condition check is selected text empty space or newline.
       * If empty space we want replace it into quote default
       *
       * > Quote Text
       */

      if (isEmptySelectedText) {
        newContent = `${formatWithNewLine(
          textBeforeCursorPosition,
          'Before',
        )}> Quote Text${formatWithNewLine(textAfterCursorPosition, 'After')}`;

        setTextInputCursorPosition({
          setCursorPosition,
          position: {
            start:
              formatWithNewLine(textBeforeCursorPosition, 'Before').length + 2,
            end:
              formatWithNewLine(textBeforeCursorPosition, 'Before').length + 12,
          },
        });
      } else {
        /**
         * This condition will combine selected text with new line with > at first text
         *
         * example
         * this is just test
         * Hello World
         *
         * became
         * > this is just test
         * > Hello World
         */

        const combineSelectedText = selectedTextArray.reduce(
          (result, item, index, array) =>
            result + `> ${item}${index === array.length - 1 ? '' : '\n'}`,
          '',
        );

        newContent = `${formatWithNewLine(
          textBeforeCursorPosition,
          'Before',
        )}${combineSelectedText}${formatWithNewLine(
          textAfterCursorPosition,
          'After',
        )}`;

        setTextInputCursorPosition({
          setCursorPosition,
          position: {
            start:
              formatWithNewLine(textBeforeCursorPosition, 'Before').length + 2,
            end:
              formatWithNewLine(textBeforeCursorPosition, 'Before').length +
              combineSelectedText.length,
          },
        });
      }
    }

    setValue('raw', newContent);
  };

  const onListFormatting = ({
    content,
    cursorPosition,
    setCursorPosition,
    setValue,
    type,
  }: ListParams) => {
    const textFormattingConfig =
      type === 'Number'
        ? { format: '1. ', positionCursor: 3 }
        : { format: '- ', positionCursor: 2 };
    const { selectedText, textAfterCursorPosition, textBeforeCursorPosition } =
      getTextBasedCursorPosition({ cursorPosition, text: content });

    let newContent = '';
    if (cursorPosition.start === cursorPosition.end) {
      /**
       * First condition is used if there are no text highligh so cursor start and end will be same value
       */

      const formattedTextBeforeCursor = formatWithNewLine(
        textBeforeCursorPosition,
        'Before',
      );
      newContent =
        formattedTextBeforeCursor +
        textFormattingConfig.format +
        'List Item' +
        formatWithNewLine(textAfterCursorPosition, 'After');

      setTextInputCursorPosition({
        setCursorPosition,
        position: {
          start:
            formattedTextBeforeCursor.length +
            textFormattingConfig.positionCursor,
          end:
            formattedTextBeforeCursor.length +
            textFormattingConfig.positionCursor +
            9,
        },
      });
    } else {
      /**
       * This condition used for highligh text
       */
      const itemList = separateTextByNewLine(selectedText.trim())
        .map((item, index) =>
          type === 'Number'
            ? `${index + 1}. ${item}`
            : `${textFormattingConfig.format} ${item}`,
        )
        .join('\n');
      newContent = `${formatWithNewLine(
        textBeforeCursorPosition,
        'Before',
      )}${itemList}${formatWithNewLine(textAfterCursorPosition, 'After')}`;
    }

    setValue('raw', newContent);
  };

  return {
    onInsertImage,
    onInsertLink,
    onInsertPoll,
    onFontFormatting,
    onQuote,
    onListFormatting,
  };
}
