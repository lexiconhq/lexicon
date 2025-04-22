import { OperationVariables, useFragment_experimental } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';

import { Icon, Text } from '../../../core-ui';
import { ChatFragment, ChatFragmentDoc } from '../../../generatedAPI/server';
import { makeStyles, useTheme } from '../../../theme';
import { StackNavProp, ThreadDetailFirstContent } from '../../../types';

import { ChatMessageItem } from './ChatMessageItem';

type Props = {
  threadId?: number; // id of first thread message
  threadData?: ThreadDetailFirstContent;
};

function BaseThreadDetailsHeader(props: Props) {
  const { threadId, threadData } = props;
  const styles = useStyles();
  const { colors } = useTheme();
  const { navigate } = useNavigation<StackNavProp<'ThreadDetail'>>();

  const cacheMessageFragment = useFragment_experimental<
    ChatFragment,
    OperationVariables
  >({
    fragment: ChatFragmentDoc,
    fragmentName: 'ChatFragment',
    from: {
      __typename: 'ChatMessage',
      id: threadId,
    },
  });
  const cacheMessage = cacheMessageFragment.data;

  if (!cacheMessage && !threadData) {
    throw new Error('Message not found');
  }

  const safeMessage =
    cacheMessage && Object.keys(cacheMessage).length > 0
      ? cacheMessage
      : threadData!;

  const onPressAvatar = () => {
    navigate('UserInformation', {
      username: safeMessage.user.username,
    });
  };

  return (
    <>
      <View style={styles.container}>
        <ChatMessageItem
          content={safeMessage}
          sender={safeMessage.user}
          newTimestamp={true}
          onPressAvatar={() => onPressAvatar()}
          unread={false}
          settings={true}
          hideReplies
        />
      </View>
      <View style={styles.iconContainer}>
        <Icon name="Replies" color={colors.textLighter} />
        <Text variant="semiBold" style={styles.replyText}>
          Replies
        </Text>
      </View>
    </>
  );
}

const useStyles = makeStyles(({ colors, spacing, shadow }) => ({
  container: {
    justifyContent: 'flex-start',
    padding: spacing.xl,
    backgroundColor: colors.background,
    ...shadow,
  },
  iconContainer: {
    paddingHorizontal: spacing.xl,
    marginTop: spacing.l,
    flexDirection: 'row',
  },
  replyText: {
    lineHeight: 24,
  },
}));

let ThreadDetailsHeader = React.memo(BaseThreadDetailsHeader);

export { ThreadDetailsHeader };
