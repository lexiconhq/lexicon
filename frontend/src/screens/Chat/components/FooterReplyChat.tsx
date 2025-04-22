import React, {
  Dispatch,
  forwardRef,
  RefObject,
  SetStateAction,
  useState,
} from 'react';
import { View, VirtualizedList } from 'react-native';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';

import { MentionList } from '../../../components';
import { TextInputType } from '../../../core-ui';
import { mentionHelper } from '../../../helpers';
import { useMention } from '../../../hooks';
import { makeStyles } from '../../../theme';
import { CursorPosition } from '../../../types';
import { useDevice } from '../../../utils';
import { ReplyInputField } from '../../MessageDetail/components';

type Props<T> = {
  listRef: React.RefObject<VirtualizedList<T>>; // A reference to the chat list component.
  setInputFocused: React.Dispatch<React.SetStateAction<boolean>>; // Function to update the state of text input focus.
  onReply: (message: string) => void; // Callback function invoked when the reply button is clicked.
  replyLoading?: boolean; // loading when try hit hook reply chat
  message: string; // state text input message
  setMessage: Dispatch<SetStateAction<string>>; // set state value text input message
  onFocus?: () => void;
  onBlur?: () => void;
  testID?: string;
};

function BaseFooterReplyChat<T>(
  props: Props<T>,
  ref: RefObject<TextInputType>,
) {
  const {
    setInputFocused,
    onReply,
    replyLoading,
    message,
    setMessage,
    ...other
  } = props;
  const styles = useStyles();

  const { isTablet } = useDevice();

  const [showUserList, setShowUserList] = useState(false);
  const [mentionLoading, setMentionLoading] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({
    start: 0,
    end: 0,
  });
  const [mentionKeyword, setMentionKeyword] = useState('');

  const { mentionMembers } = useMention(
    mentionKeyword,
    showUserList,
    setMentionLoading,
  );

  return (
    <KeyboardAccessoryView
      androidAdjustResize
      inSafeAreaView
      hideBorder
      alwaysVisible
      style={styles.keyboardAcc}
    >
      <MentionList
        showUserList={showUserList}
        members={mentionMembers}
        mentionLoading={mentionLoading}
        rawText={message}
        textRef={ref}
        setRawText={setMessage}
        setShowUserList={setShowUserList}
      />
      <View
        style={[
          styles.footerContainer,
          isTablet ? styles.tabletTextInput : false,
        ]}
      >
        <ReplyInputField
          inputRef={ref}
          onPressSend={onReply}
          loading={replyLoading}
          style={styles.inputContainer}
          message={message}
          onSelectedChange={(cursor) => {
            setCursorPosition(cursor);
          }}
          onChangeValue={(message: string) => {
            mentionHelper(
              message,
              cursorPosition,
              setShowUserList,
              setMentionLoading,
              setMentionKeyword,
            );
            setMessage(message);
          }}
          onFocus={() => {
            setInputFocused(true);
          }}
          onBlur={() => {
            setInputFocused(false);
          }}
          {...other}
        />
      </View>
    </KeyboardAccessoryView>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  footerContainer: {
    backgroundColor: colors.background,
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.xl,
    minHeight: 54,
  },
  keyboardAcc: {
    backgroundColor: colors.background,
  },
  inputContainer: {
    flex: 1,
    paddingLeft: spacing.xl,
    paddingVertical: spacing.m,
    paddingRight: spacing.s,
    backgroundColor: colors.backgroundDarker,
  },
  tabletTextInput: { marginBottom: spacing.l },
}));

const FooterReplyChat = forwardRef(BaseFooterReplyChat);
export { FooterReplyChat };
