import React, { useState } from 'react';
import { LayoutChangeEvent, View, ViewProps } from 'react-native';

import { ActivityIndicator, Divider, Icon } from '../core-ui';
import {
  deleteQuoteBbCode,
  formatRelativeTime,
  handleUnsupportedMarkdown,
  useStorage,
} from '../helpers';
import { usePostRaw } from '../hooks';
import { Color, makeStyles, useTheme } from '../theme';
import { Post } from '../types';

import { Author } from './Author';
import { Markdown } from './Markdown';
import { Metrics } from './Metrics/Metrics';
import { PostHidden } from './PostItem';
import {
  LocalRepliedPostProps,
  RepliedPost,
  RepliedPostProps,
} from './RepliedPost';

export type PressMoreParams = {
  id?: number;
  canFlag?: boolean;
  canEdit?: boolean;
  flaggedByCommunity?: boolean;
  fromPost?: boolean;
  author?: string;
};

export type PressReplyParams = Pick<LocalRepliedPostProps, 'replyToPostId'>;

/**
 * Omitting props below for reasons
 * - onLayout : Because we creating customOnLayout
 * - postId : Because it is equivalent with id from type Post
 */
type Props = Omit<ViewProps, 'onLayout'> &
  Omit<RepliedPostProps, 'postId'> & {
    showOptions: boolean;
    hasMetrics?: boolean;
    isLoading?: boolean;
    onLayout?: (params: { event: LayoutChangeEvent }) => void;
    onPressReply?: (params: PressReplyParams) => void;
    onPressMore?: (params: PressMoreParams) => void;
    onPressAuthor?: (username: string) => void;
  } & Post;

function BaseNestedComment(props: Props) {
  const storage = useStorage();
  const styles = useStyles();
  const { colors } = useTheme();
  const {
    id,
    topicId,
    likeCount,
    replyCount,
    isLiked,
    username,
    createdAt,
    mentionedUsers,
    avatar,
    canFlag,
    canEdit,
    content: contentFromGetTopicDetail,
    hidden,
    replyToPostNumber,
    hideAuthor,
    hasMetrics = true,
    style,
    showOptions,
    isLoading = false,
    replyToPostId,
    onPressReply,
    onPressMore,
    onPressAuthor,
    onLayout,
    ...otherProps
  } = props;

  const [content, setContent] = useState(contentFromGetTopicDetail);
  const [isHidden, setHidden] = useState(hidden ?? false);

  const isTopicOwner = username === storage.getItem('user')?.username;
  const time = formatRelativeTime(createdAt);
  const color: Color = hidden ? 'textLight' : 'textNormal';

  const { postRaw, loading } = usePostRaw({
    onCompleted: ({ postRaw: { markdownContent } }) => {
      setContent(markdownContent);
      setHidden(false);
    },
  });

  const onPressViewIgnoredContent = () => {
    if (content === '') {
      postRaw({ variables: { postId: id } });
    } else {
      setHidden(false);
    }
  };

  return (
    <View
      style={style}
      onLayout={(event) => onLayout?.({ event })}
      {...otherProps}
    >
      <View style={{ position: 'relative' }}>
        <View style={styles.authorContainer}>
          <Author
            image={avatar}
            title={username}
            subtitle={time}
            style={styles.author}
            subtitleStyle={styles.textTime}
            onPressAuthor={() => onPressAuthor && onPressAuthor(username)}
          >
            {showOptions ? (
              <Icon
                name="More"
                color={colors.textLighter}
                onPress={() => {
                  onPressMore?.({
                    id,
                    canFlag,
                    canEdit,
                    flaggedByCommunity: hidden,
                    fromPost: false,
                    author: username,
                  });
                }}
                hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
              />
            ) : undefined}
          </Author>
        </View>
        {replyToPostId && (
          <RepliedPost postId={id} replyToPostId={replyToPostId} />
        )}
        {isHidden ? (
          <PostHidden
            loading={loading}
            author={isTopicOwner}
            onPressViewIgnoredContent={onPressViewIgnoredContent}
          />
        ) : (
          <Markdown
            content={
              // If `replyToPostId` is truthy, then we delete the quote in outer comment,
              // because what's inside the quote is the inner part of a nested comment
              replyToPostId
                ? handleUnsupportedMarkdown(deleteQuoteBbCode(content))
                : handleUnsupportedMarkdown(content)
            }
            fontColor={colors[color]}
            mentions={mentionedUsers}
          />
        )}
        {hasMetrics && (
          <Metrics
            postId={id}
            postList={false}
            topicId={topicId}
            likeCount={likeCount}
            replyCount={replyCount}
            isCreator={isTopicOwner}
            isLiked={isLiked}
            onPressReply={() => onPressReply?.({ replyToPostId: id })}
            style={styles.metricSpacing}
          />
        )}
        {/* TODO: Replace with skeleton mask https://github.com/kodefox/lexicon/issues/794 */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator />
          </View>
        ) : null}
      </View>
      <Divider />
    </View>
  );
}

export let NestedComment = React.memo(BaseNestedComment);

const useStyles = makeStyles(({ fontSizes, spacing, colors }) => ({
  authorContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  author: {
    paddingVertical: spacing.xl,
  },
  loadingContainer: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundDarker,
  },
  metricSpacing: {
    paddingTop: spacing.m,
    paddingBottom: spacing.xl,
  },
  textTime: {
    fontSize: fontSizes.s,
  },
}));
