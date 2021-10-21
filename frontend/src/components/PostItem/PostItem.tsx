import React from 'react';
import { TouchableOpacity, View, ViewProps } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { NO_EXCERPT_WORDING } from '../../constants';
import { CustomImage, Text } from '../../core-ui';
import { formatRelativeTime, useStorage } from '../../helpers';
import { Color, makeStyles, useTheme } from '../../theme';
import { Post, StackNavProp } from '../../types';
import { Author } from '../Author';
import { Markdown } from '../Markdown';

import { PostGroupings } from './PostGroupings';
import { PostHidden } from './PostHidden';
import { PostItemFooter } from './PostItemFooter';

type Props = ViewProps & {
  data: Post;
  postList: boolean;
  showLabel?: boolean;
  currentUser?: string;
  hasFooter?: boolean;
  numberOfLines?: number;
  showImageRow?: boolean;
  nonclickable?: boolean;
  prevScreen?: string;
  onPressReply?: (postId: number) => void;
  likedTopic?: Array<number>;
  onPressAuthor?: (username: string) => void;
  content?: string;
  images?: Array<string>;
  mentionedUsers?: Array<string>;
  isHidden?: boolean;
  onPressViewIgnoredContent?: () => void;
};

export function PostItem(props: Props) {
  const { navigate } = useNavigation<StackNavProp<'TabNav'>>();
  const storage = useStorage();
  const styles = useStyles();
  const { colors } = useTheme();

  const {
    data,
    postList,
    showLabel,
    currentUser,
    hasFooter = true,
    numberOfLines = 0,
    showImageRow = false,
    nonclickable = false,
    style,
    prevScreen,
    onPressReply,
    likedTopic,
    onPressAuthor,
    content: contentFromPrevScreen,
    images: imagesFromPrevScreen,
    mentionedUsers: mentionFromPrevScreen,
    isHidden = false,
    onPressViewIgnoredContent = () => {},
    ...otherProps
  } = props;

  const {
    title,
    avatar,
    username,
    channel,
    tags,
    content: contentFromGetTopics,
    images: imagesFromGetTopics,
    mentionedUsers: mentionFromGetTopics,
    hidden: flagged,
    id,
    topicId,
    viewCount,
    replyCount,
    likeCount,
    isLiked,
    freqPosters,
    createdAt,
  } = data;

  const time =
    createdAt === ''
      ? t('Loading...')
      : (prevScreen === 'Home' ? t('Last Activity ') : '') +
        formatRelativeTime(createdAt);

  const isTopicOwner = username === storage.getItem('user')?.username;

  const onPressPost = () => {
    navigate('PostDetail', {
      topicId,
      prevScreen,
      focusedPostNumber: undefined,
    });
  };

  const color: Color = flagged ? 'textLight' : 'textNormal';

  const content = flagged
    ? contentFromPrevScreen ?? contentFromGetTopics
    : contentFromGetTopics;

  const images = flagged
    ? imagesFromPrevScreen ?? imagesFromGetTopics
    : imagesFromGetTopics;

  const mentionedUsers = flagged
    ? mentionFromPrevScreen ?? mentionFromGetTopics
    : mentionFromGetTopics;

  const isTapToView = content === NO_EXCERPT_WORDING;

  const contentTitle = (
    <Text style={styles.spacingBottom} variant="semiBold" size="l">
      {title}
    </Text>
  );

  const author = (
    <Author
      image={avatar}
      title={username}
      subtitle={time}
      style={styles.spacingBottom}
      subtitleStyle={styles.textTime}
      onPressAuthor={onPressAuthor}
      onPressEmptySpaceInPost={onPressPost}
      postList={postList}
    />
  );

  const mainContent = (
    <>
      {nonclickable && <PostGroupings channel={channel} tags={tags} />}
      {isHidden ? (
        <PostHidden
          style={styles.markdown}
          author={isTopicOwner}
          numberOfLines={numberOfLines}
          onPressViewIgnoredContent={onPressViewIgnoredContent}
        />
      ) : numberOfLines === 0 ? (
        <Markdown
          style={styles.markdown}
          imageUrls={images}
          content={content}
          fontColor={colors[color]}
          listOfMention={mentionedUsers}
        />
      ) : (
        <Text
          style={styles.text}
          numberOfLines={numberOfLines}
          color={isTapToView ? 'primary' : color}
          variant={isTapToView ? 'bold' : 'normal'}
        >
          {content}
        </Text>
      )}
    </>
  );

  const imageContent = images && showImageRow && (
    <CustomImage src={images[0]} style={styles.images} />
  );

  const wrappedMainContent = !nonclickable ? (
    <>
      {showLabel && isLiked && (
        <View>
          <Text
            style={styles.label}
            variant="bold"
            color="primary"
            numberOfLines={numberOfLines}
          >
            {currentUser === storage.getItem('user')?.username || ''
              ? t(`You liked this post`)
              : t(`{currentUser} liked this post`, { currentUser })}
          </Text>
        </View>
      )}
      <TouchableOpacity onPress={onPressPost} delayPressIn={200}>
        {contentTitle}
      </TouchableOpacity>
      {author}
      <PostGroupings channel={channel} tags={tags} />
      <TouchableOpacity onPress={onPressPost} delayPressIn={200}>
        {mainContent}
      </TouchableOpacity>
      {imageContent}
    </>
  ) : (
    <>
      {contentTitle}
      {author}
      {mainContent}
    </>
  );

  return (
    <View style={[styles.container, style]} {...otherProps}>
      {wrappedMainContent}
      {hasFooter && (
        <PostItemFooter
          postId={id}
          topicId={topicId}
          postList={postList}
          viewCount={viewCount}
          baseLikeCount={likeCount}
          replyCount={replyCount}
          onPressReply={onPressReply}
          baseIsLiked={isLiked}
          isCreator={isTopicOwner}
          frequentPosters={freqPosters.slice(1)}
          style={styles.spacingTop}
          onPressView={onPressPost}
          title={title}
          likedTopic={likedTopic}
        />
      )}
    </View>
  );
}

const useStyles = makeStyles(({ colors, fontSizes, shadow, spacing }) => ({
  container: {
    justifyContent: 'flex-start',
    padding: spacing.xxl,
    backgroundColor: colors.background,
    ...shadow,
  },
  markdown: {
    marginTop: spacing.xl,
  },
  label: {
    marginBottom: spacing.l,
    textTransform: 'capitalize',
  },
  images: {
    marginVertical: spacing.m,
  },
  spacingBottom: {
    marginBottom: spacing.xl,
  },
  spacingTop: {
    paddingTop: spacing.m,
  },
  text: {
    marginTop: spacing.xl,
    marginBottom: spacing.m,
  },
  textTime: {
    fontSize: fontSizes.s,
  },
}));
