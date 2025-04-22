import React, { Fragment } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { Markdown } from '../../../components';
import { MetricItem } from '../../../components/Metrics/MetricItem';
import { Avatar, Icon, Text } from '../../../core-ui';
import {
  automaticFontColor,
  filterMarkdownContentPoll,
  formatDateTime,
  formatTime,
  getImage,
  handleUnsupportedMarkdown,
} from '../../../helpers';
import { makeStyles, useTheme } from '../../../theme';
import {
  ChatMessageContent,
  ThreadDetailFirstContent,
  User,
} from '../../../types';

type Props = {
  content: ChatMessageContent | ThreadDetailFirstContent;
  sender: User;
  newTimestamp: boolean;
  onPressAvatar?: () => void;
  unread?: boolean;
  settings: boolean;
  firstChatBubbleStyle?: StyleProp<ViewStyle>;
  onPressReplies?: () => void;
  hideReplies?: boolean;
  testID?: string;
  isLoading?: boolean;
};

export function ChatMessageItem(props: Props) {
  const styles = useStyles();
  const { colors } = useTheme();

  const {
    content,
    sender,
    newTimestamp,
    onPressAvatar,
    unread,
    settings,
    firstChatBubbleStyle,
    onPressReplies,
    hideReplies,
    testID,
    isLoading,
  } = props;

  const { id, time, markdownContent } = content;

  const filteredMessage = filterMarkdownContentPoll(
    markdownContent || '',
  ).filteredMarkdown;
  const markdownContentScene = handleUnsupportedMarkdown(filteredMessage);
  const unsupported = 'uploads' in content ? content.uploads.length > 0 : false;

  const renderUnsupported = () => {
    return (
      <View style={styles.unsupported}>
        <Icon
          name="Information"
          size="xl"
          color={colors.textLighter}
          style={styles.unsupportedIcon}
        />
        <Text size="xs" color="textLight" style={styles.unsupportedText}>
          {t('Unsupported file type.')}
        </Text>
        <Text size="xs" color="textLight" style={styles.unsupportedText}>
          {t('To open, please visit Discourse web.')}
        </Text>
      </View>
    );
  };

  const renderFirstChatBubble = () => {
    return (
      <View style={[styles.firstItem, firstChatBubbleStyle]}>
        <Avatar
          src={getImage(sender.avatar)}
          style={styles.avatar}
          onPress={onPressAvatar}
          size="xs"
        />
        <View style={styles.flex}>
          <Text color="textLight" size="xs" style={styles.name}>
            {t('{sender} • {time}', {
              sender: sender?.username,
              time: formatTime({ dateString: time, hour12: true }),
            })}
          </Text>
          <Markdown
            fontColor={automaticFontColor(colors.backgroundDarker)}
            mentionColor="backgroundDarker"
            content={markdownContentScene}
          />
          {unsupported ? renderUnsupported() : null}
        </View>
      </View>
    );
  };

  const renderChatBubble = () => {
    if (!filteredMessage) {
      return null;
    }

    return (
      <View style={styles.nextItem}>
        <Markdown
          fontColor={automaticFontColor(colors.backgroundDarker)}
          mentionColor="backgroundDarker"
          content={markdownContentScene}
        />
        {unsupported ? renderUnsupported() : null}
      </View>
    );
  };

  return (
    <View style={styles.flex} testID={testID}>
      <Fragment key={id}>
        {newTimestamp && (
          <Text
            color="textLight"
            size="xs"
            style={[styles.timestamp, styles.time]}
          >
            {formatDateTime(time, 'medium')}
          </Text>
        )}

        <View style={styles.messageItem}>
          {settings ? renderFirstChatBubble() : renderChatBubble()}
          {!hideReplies &&
          'replyCount' in content &&
          content.replyCount != null &&
          content.replyCount !== undefined ? (
            <View style={[styles.nextItem, styles.threadButton]}>
              <MetricItem
                type="Thread"
                count={content.replyCount}
                fontStyle={styles.metric}
                onPress={onPressReplies}
                testID={`Chat:ChatItem:MetricItem:IconWithLabel:${id}`}
                isLoading={isLoading}
                disabled={isLoading}
              />
            </View>
          ) : null}
        </View>

        {unread && (
          <View style={styles.unread}>
            <Text color="textLight" size="xs" style={styles.time}>
              {t('Unread Messages')}
            </Text>
          </View>
        )}
      </Fragment>
    </View>
  );
}

const useStyles = makeStyles(({ spacing, colors }) => {
  return {
    flex: { flex: 1 },
    time: { alignSelf: 'center' },
    name: { paddingBottom: spacing.s },
    messageItem: { paddingHorizontal: spacing.xl },
    firstItem: {
      flexDirection: 'row',
      backgroundColor: colors.background,
    },
    nextItem: { marginLeft: spacing.xxxxl },
    avatar: { marginRight: spacing.l },
    timestamp: { marginBottom: spacing.m },
    unread: {
      borderTopWidth: 1,
      borderBottomWidth: 1,
      paddingVertical: spacing.m,
      borderColor: colors.border,
      backgroundColor: colors.backgroundDarker,
      marginBottom: spacing.m,
    },
    unsupported: {
      borderWidth: 1,
      borderColor: colors.border,
      height: 100,
      borderRadius: 4,
      backgroundColor: colors.backgroundDarker,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.m,
    },
    unsupportedIcon: { marginBottom: spacing.s },
    unsupportedText: { textAlign: 'center' },
    threadButton: {
      borderWidth: 1,
      borderColor: colors.border,
      height: 28,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 4,
      paddingHorizontal: spacing.m,
      alignSelf: 'flex-start',
      flexDirection: 'row',
      marginBottom: spacing.m,
    },
    metric: { flexGrow: 0 },
  };
});
