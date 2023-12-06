import React, { Fragment } from 'react';
import { Platform, StyleProp, View, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Avatar, ChatBubble, Divider, Text } from '../../../core-ui';
import {
  filterMarkdownContent,
  formatDateTime,
  handleUnsupportedMarkdown,
  useStorage,
} from '../../../helpers';
import { makeStyles, useTheme } from '../../../theme';
import { MessageContent, Poll, StackNavProp, User } from '../../../types';

import { PollChatBubble } from './PollChatBubble';

type Props = {
  content: MessageContent;
  sender: User | undefined;
  newTimestamp: boolean;
  isPrev: boolean | undefined;
  settings: boolean;
  onPressAvatar?: () => void;
  topicId: number;
};

export function MessageItem(props: Props) {
  const styles = useStyles();
  const { spacing } = useTheme();
  const { navigate } = useNavigation<StackNavProp<'MessageDetail'>>();

  const {
    content,
    sender,
    newTimestamp,
    isPrev,
    settings,
    onPressAvatar,
    topicId,
  } = props;

  const storage = useStorage();
  const myUsername = storage.getItem('user')?.username || '';
  const isMe = sender?.username === myUsername;
  const noUsername = sender?.username === undefined;
  const {
    polls,
    pollsVotes,
    id,
    time,
    message,
    mentions: mentionedUsers,
  } = content;

  const chatBubbleStyle: StyleProp<ViewStyle> = [
    {
      marginTop: isMe && (!isPrev || newTimestamp) ? spacing.xl : spacing.m,
    },
    isMe || noUsername ? styles.myMessage : styles.otherUserMessage,
  ];

  const navToPoll = (poll: Poll) => {
    const pollVotes = pollsVotes?.find(
      (pollVotes) => pollVotes.pollName === poll.name,
    );

    navigate('Poll', {
      poll,
      pollVotes: pollVotes?.pollOptionIds,
      isCreator: isMe,
      topicId,
      postId: id,
      author: sender,
      createdAt: time,
    });
  };

  const renderFirstChatBubble = (poll?: Poll) => {
    const filteredMessage = filterMarkdownContent(message).filteredMarkdown;

    return (
      <>
        <Text color="textLight" style={styles.name}>
          {t('{sender}', { sender: sender?.username })}
        </Text>
        <View style={styles.messageItem}>
          <Avatar
            src={sender?.avatar}
            style={styles.avatar}
            onPress={onPressAvatar}
          />
          {poll ? (
            <PollChatBubble poll={poll} onPress={() => navToPoll(poll)} />
          ) : (
            <ChatBubble
              message={handleUnsupportedMarkdown(filteredMessage)}
              mentions={mentionedUsers}
            />
          )}
        </View>
      </>
    );
  };

  const renderPolls = () => {
    if (!polls) {
      return null;
    }

    return polls.map((poll, index) => {
      if (index === 0 && !(isMe || noUsername)) {
        return (
          <Fragment key={`message-${id}-poll-${index}`}>
            {renderFirstChatBubble(poll)}
          </Fragment>
        );
      }
      return (
        <View key={`message-${id}-poll-${index}`} style={chatBubbleStyle}>
          <PollChatBubble poll={poll} onPress={() => navToPoll(poll)} />
        </View>
      );
    });
  };

  const renderChatBubble = () => {
    const filteredMessage = filterMarkdownContent(message).filteredMarkdown;

    if (!filteredMessage) {
      return null;
    }

    return (
      <View style={chatBubbleStyle}>
        <ChatBubble
          message={t('{message}', {
            message: handleUnsupportedMarkdown(filteredMessage),
          })}
          bgColor={isMe || noUsername ? 'primary' : undefined}
          mentions={mentionedUsers}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Fragment key={id}>
        {newTimestamp && (
          <Fragment>
            <Text color="textLight" style={styles.time}>
              {formatDateTime(time, 'medium', true)}
            </Text>
            <Divider style={styles.divider} />
          </Fragment>
        )}

        {polls ? (
          <>
            {renderPolls()}
            {renderChatBubble()}
          </>
        ) : settings && !isMe && !noUsername ? (
          <Fragment>{renderFirstChatBubble()}</Fragment>
        ) : (
          renderChatBubble()
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
