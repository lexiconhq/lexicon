import React, { Dispatch, RefObject, SetStateAction, useState } from 'react';
import { TextInput, View, ViewProps } from 'react-native';

import {
  ActivityIndicator,
  Icon,
  MentionedText,
  TextInputType,
} from '../../../core-ui';
import { makeStyles, useTheme } from '../../../theme';
import { CursorPosition } from '../../../types';

type Props = ViewProps & {
  loading?: boolean;
  showButton?: boolean;
  disabled?: boolean;
  inputPlaceholder?: string;
  message?: string;
  setMessage?: Dispatch<SetStateAction<string>>;
  onPressSend: (message: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onSelectedChange: (cursor: CursorPosition) => void;
  onChangeValue: (value: string) => void;
  inputRef?: RefObject<TextInputType>;
};

export function ReplyInputField(props: Props) {
  const styles = useStyles();
  const { colors } = useTheme();

  const {
    loading = false,
    showButton = false,
    disabled = false,
    inputPlaceholder = t('Write your reply here'),
    message = '',
    setMessage,
    onPressSend,
    onFocus,
    onBlur,
    onSelectedChange,
    onChangeValue,
    style,
    inputRef,
    ...otherProps
  } = props;

  const [expandedHeight, setExpandedHeight] = useState(40);

  const onSendReply = () => {
    onPressSend(message);
  };

  const updateSize = (height: number) => {
    if (expandedHeight <= 100) {
      setExpandedHeight(height);
    }
  };

  return (
    <View style={[styles.inputContainer, style]} {...otherProps}>
      <View style={styles.textInputContainer}>
        <TextInput
          ref={inputRef}
          onSelectionChange={(cursor) => {
            onSelectedChange(cursor.nativeEvent.selection);
          }}
          style={[styles.textInput, { height: expandedHeight }]}
          editable={!disabled}
          autoCorrect={false}
          onChangeText={(value) => onChangeValue(value)}
          placeholder={inputPlaceholder}
          placeholderTextColor={colors.textLighter}
          multiline={true}
          textAlignVertical="center"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onFocus={onFocus}
          onBlur={onBlur}
          onContentSizeChange={(e) => {
            updateSize(e.nativeEvent.contentSize.height);
          }}
        >
          <MentionedText textValue={message} />
        </TextInput>
      </View>
      {loading ? (
        <ActivityIndicator />
      ) : (
        (message.trim() !== '' || showButton) && (
          <Icon name="ArrowUpward" size="xl" onPress={onSendReply} />
        )
      )}
    </View>
  );
}

const useStyles = makeStyles(({ colors, fontSizes, spacing }) => {
  return {
    inputContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',

      flex: 1,
      backgroundColor: colors.backgroundDarker,
      borderColor: colors.border,
      borderRadius: 21,
      borderWidth: 1,
      paddingLeft: spacing.xl,
      paddingVertical: spacing.s,
      paddingRight: spacing.s,
    },
    textInputContainer: {
      flex: 1,
      justifyContent: 'center',
      paddingBottom: spacing.s,
      maxHeight: 140,
    },

    textInput: {
      color: colors.textNormal,
      fontSize: fontSizes.m,
      /**
       *   By default, the height for the textInput is 24.3.
       *   However, because we set the height based on the native layout size,
       *   the default size becomes 19.3, causing the placeholder text in the text input to be cut off.
       *   To address this issue, we have set the minimum height as 25, which should fix the problem.
       */
      minHeight: 25,
    },
  };
});
