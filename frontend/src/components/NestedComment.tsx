import React, { useEffect, useState } from 'react';
import { View, ViewProps } from 'react-native';

import { Divider, Icon } from '../core-ui';
import {
  formatRelativeTime,
  handleSpecialMarkdown,
  useStorage,
} from '../helpers';
import { usePostRaw } from '../hooks';
import { Color, makeStyles, useTheme } from '../theme';
import { Post } from '../types';

import { Author } from './Author';
import { Markdown } from './Markdown';
import { Metrics } from './Metrics/Metrics';
import { PostHidden } from './PostItem';
import { RepliedPost, RepliedPostProps } from './RepliedPost';

type Props = ViewProps &
  RepliedPostProps & {
    data: Post;
    showOptions: boolean;
    hasMetrics?: boolean;
    onPressReply?: () => void;
    onPressMore?: () => void;
    onPressAuthor?: (username: string) => void;
  };

export function NestedComment(props: Props) {
  const storage = useStorage();
  const styles = useStyles();
  const { colors } = useTheme();

  const {
    data: {
      id,
      topicId,
      likeCount,
      replyCount,
      isLiked,
      username,
      createdAt,
      mentionedUsers,
      avatar,
      images,
      content: contentFromGetTopicDetail,
      hidden: flagged,
    },
    hideAuthor,
    replyTo,
    hasMetrics = true,
    onPressReply,
    onPressMore,
    onPressAuthor,
    style,
    showOptions,
    ...otherProps
  } = props;

  const [content, setContent] = useState('');
  const [isHidden, setHidden] = useState(false);

  const isTopicOwner = username === storage.getItem('user')?.username;
  const time = formatRelativeTime(createdAt);
  const color: Color = flagged ? 'textLight' : 'textNormal';

  useEffect(() => {
    setContent(contentFromGetTopicDetail);
    setHidden(flagged || false);
  }, [contentFromGetTopicDetail, flagged]);

  const { postRaw, loading } = usePostRaw({
    onCompleted: ({ postRaw: { raw } }) => {
      setContent(raw);
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
    <View style={style} {...otherProps}>
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
              onPress={onPressMore}
              hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
            />
          ) : undefined}
        </Author>
      </View>
      {replyTo && <RepliedPost replyTo={replyTo} />}
      {isHidden ? (
        <PostHidden
          loading={loading}
          author={isTopicOwner}
          onPressViewIgnoredContent={onPressViewIgnoredContent}
        />
      ) : (
        <Markdown
          imageUrls={images}
          content={handleSpecialMarkdown(content)}
          fontColor={colors[color]}
          listOfMention={mentionedUsers}
        />
      )}
      {hasMetrics && (
        <Metrics
          postId={id}
          topicId={topicId}
          baseLikeCount={likeCount}
          replyCount={replyCount}
          onPressReply={onPressReply}
          isCreator={isTopicOwner}
          baseIsLiked={isLiked}
          style={styles.metricSpacing}
          nestedComment
        />
      )}
      <Divider />
    </View>
  );
}

const useStyles = makeStyles(({ fontSizes, spacing }) => ({
  authorContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  author: {
    paddingVertical: spacing.xl,
  },
  metricSpacing: {
    paddingTop: spacing.m,
    paddingBottom: spacing.xl,
  },
  textTime: {
    fontSize: fontSizes.s,
  },
}));
