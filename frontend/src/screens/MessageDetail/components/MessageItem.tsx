import React, { Fragment } from 'react';
import { Platform, View } from 'react-native';

import { Avatar, ChatBubble, Divider, Text } from '../../../core-ui';
import {
  formatDateTime,
  handleUnsupportedMarkdown,
  useStorage,
} from '../../../helpers';
import { makeStyles, useTheme } from '../../../theme';
import { MessageContent, User } from '../../../types';

type Props = {
  content: MessageContent;
  sender: User | undefined;
  newTimestamp: boolean;
  isPrev: boolean | undefined;
  settings: boolean;
  onPressAvatar?: () => void;
};

export function MessageItem(props: Props) {
  const styles = useStyles();
  const { spacing } = useTheme();

  const { content, sender, newTimestamp, isPrev, settings, onPressAvatar } =
    props;

  const storage = useStorage();
  const myUsername = storage.getItem('user')?.username || '';
  const isMe = sender?.username === myUsername;
  const noUsername = sender?.username === undefined;
  const mentionedUsers = content.mentions;

  return (
    <View style={styles.container}>
      <Fragment key={content.id}>
        {newTimestamp && (
          <Fragment>
            <Text color="textLight" style={styles.time}>
              {formatDateTime(content.time, 'medium', true)}
            </Text>
            <Divider style={styles.divider} />
          </Fragment>
        )}

        {settings && !isMe && !noUsername ? (
          <Fragment>
            <Text color="textLight" style={styles.name}>
              {t('{sender}', { sender: sender?.username })}
            </Text>
            <View style={styles.messageItem}>
              <Avatar
                src={sender?.avatar}
                style={styles.avatar}
                onPress={onPressAvatar}
              />
              <ChatBubble
                message={handleUnsupportedMarkdown(content.message)}
                mentions={mentionedUsers}
              />
            </View>
          </Fragment>
        ) : (
          <View
            style={[
              {
                marginTop:
                  isMe && (!isPrev || newTimestamp) ? spacing.xl : spacing.m,
              },
              isMe || noUsername ? styles.myMessage : styles.otherUserMessage,
            ]}
          >
            <ChatBubble
              message={t('{message}', {
                message: handleUnsupportedMarkdown(content.message),
              })}
              bgColor={isMe || noUsername ? 'primary' : undefined}
              mentions={mentionedUsers}
            />
          </View>
        )}
      </Fragment>
    </View>
  );
}

const useStyles = makeStyles(({ spacing }) => {
  const ios = Platform.OS === 'ios';

  return {
    container: {
      flex: 1,
      paddingHorizontal: spacing.xxl,
    },
    time: {
      alignSelf: 'center',
      paddingTop: spacing.xl,
    },
    divider: {
      marginTop: spacing.xl,
    },
    name: {
      paddingTop: spacing.xl,
      paddingBottom: spacing.m,
      paddingLeft: 52,
    },
    messageItem: {
      flexDirection: 'row',
      paddingRight: ios ? 48 : 68,
    },
    avatar: {
      marginRight: spacing.l,
    },
    myMessage: {
      flexDirection: 'row-reverse',
      paddingRight: 88,
    },
    otherUserMessage: {
      flexDirection: 'row',
      marginLeft: 52,
    },
  };
});
