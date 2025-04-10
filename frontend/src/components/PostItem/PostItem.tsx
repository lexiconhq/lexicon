import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { TouchableOpacity, View, ViewProps } from 'react-native';

import { NO_EXCERPT_WORDING } from '../../constants';
import { CustomImage, Icon, Text } from '../../core-ui';
import {
  formatRelativeTime,
  replaceTagsInContent,
  unescapeHTML,
  useStorage,
} from '../../helpers';
import { Color, makeStyles, useTheme } from '../../theme';
import { Channel, Poll, PollsVotes, StackNavProp } from '../../types';
import { Author } from '../Author';
import { MarkdownContent } from '../MarkdownContent';
import { PollPreview } from '../Poll';

import { PostGroupings } from './PostGroupings';
import { PostHidden } from './PostHidden';

type Props = ViewProps & {
  topicId: number;
  title: string;
  content: string;
  username: string;
  avatar: string;
  channel: Channel;
  createdAt: string;
  isLiked: boolean;
  tags?: Array<string>;
  hidden?: boolean;
  showLabel?: boolean;
  currentUser?: string;
  numberOfLines?: number;
  showImageRow?: boolean;
  nonclickable?: boolean;
  prevScreen?: string;
  images?: Array<string>;
  isHidden?: boolean;
  footer?: React.ReactNode;
  mentionedUsers?: Array<string>;
  onPressViewIgnoredContent?: () => void;
  showStatus?: boolean;
  emojiCode?: string;
  polls?: Array<Poll>;
  pollsVotes?: Array<PollsVotes>;
  postId?: number;
  testIDStatus?: string;
  pinned?: boolean;
};

function BasePostItem(props: Props) {
  const { navigate } = useNavigation<StackNavProp<'TabNav'>>();
  const storage = useStorage();
  const styles = useStyles();
  const { colors } = useTheme();

  const {
    topicId,
    title,
    username,
    avatar,
    channel,
    createdAt,
    isLiked,
    tags,
    hidden,
    showLabel,
    currentUser,
    prevScreen,
    content,
    style,
    numberOfLines = 0,
    showImageRow = false,
    nonclickable = false,
    images,
    mentionedUsers,
    isHidden = false,
    footer,
    onPressViewIgnoredContent = () => {},
    showStatus,
    emojiCode,
    polls,
    pollsVotes,
    postId,
    testIDStatus,
    pinned,
    ...otherProps
  } = props;

  const time =
    createdAt === ''
      ? t('Loading...')
      : (prevScreen === 'Home' ? t('Last Activity ') : '') +
        formatRelativeTime(createdAt);

  const isCreator = username === storage.getItem('user')?.username;

  const color: Color = hidden ? 'textLight' : 'textNormal';

  const isTapToView = content === NO_EXCERPT_WORDING;

  const onPressPost = () => {
    navigate('PostDetail', {
      topicId,
      prevScreen,
      focusedPostNumber: undefined,
      hidden: isHidden,
    });
  };

  const onPressAuthor = useCallback(
    (username: string) => {
      navigate('UserInformation', { username });
    },
    [navigate],
  );

  const contentTitle = (
    <Text
      style={[styles.spacingBottom, styles.flex]}
      variant="semiBold"
      size="l"
    >
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
      showStatus={showStatus}
      emojiCode={emojiCode}
      testIDStatus={testIDStatus}
    />
  );

  const renderPolls = () => {
    if (!polls) {
      return null;
    }

    return polls?.map((poll, index) => {
      const pollVotes = pollsVotes?.find(
        (pollVotes) => pollVotes.pollName === poll.name,
      );

      return (
        <PollPreview
          key={index}
          poll={poll}
          pollVotes={pollVotes?.pollOptionIds}
          isCreator={isCreator}
          postId={postId}
          topicId={topicId}
          postCreatedAt={createdAt}
        />
      );
    });
  };

  const mainContent = (
    <>
      {nonclickable && <PostGroupings channel={channel} tags={tags} />}
      {isHidden ? (
        <PostHidden
          style={styles.markdown}
          author={isCreator}
          numberOfLines={numberOfLines}
          onPressViewIgnoredContent={onPressViewIgnoredContent}
        />
      ) : numberOfLines === 0 ? (
        <>
          {renderPolls()}
          <MarkdownContent
            content={content}
            style={styles.markdown}
            fontColor={colors[color]}
            mentions={mentionedUsers}
          />
        </>
      ) : (
        <Text
          style={styles.text}
          numberOfLines={numberOfLines}
          color={isTapToView ? 'primary' : color}
          variant={isTapToView ? 'bold' : 'normal'}
        >
          {replaceTagsInContent(unescapeHTML(content))}
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
            {currentUser === storage.getItem('user')?.username
              ? t(`You liked this post`)
              : t(`{currentUser} liked this post`, { currentUser })}
          </Text>
        </View>
      )}
      <TouchableOpacity
        onPress={onPressPost}
        delayPressIn={200}
        style={styles.contentTitle}
      >
        {contentTitle}
        {pinned && <Icon name="Pin" style={styles.pinned} />}
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
    <View
      style={[styles.container, pinned && styles.pinnedBorder, style]}
      {...otherProps}
    >
      {wrappedMainContent}
      {footer}
    </View>
  );
}

const useStyles = makeStyles(({ colors, fontSizes, shadow, spacing }) => ({
  flex: { flex: 1 },
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
  text: {
    marginTop: spacing.xl,
    marginBottom: spacing.m,
  },
  textTime: {
    fontSize: fontSizes.s,
  },
  contentTitle: { flexDirection: 'row', justifyContent: 'space-between' },
  pinned: { marginLeft: spacing.s },
  pinnedBorder: { borderLeftWidth: 4, borderColor: colors.primary },
}));
let PostItem = React.memo(BasePostItem);
export { PostItem, Props as PostItemProps };
