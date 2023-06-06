import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { TouchableOpacity, View, ViewProps } from 'react-native';

import { NO_EXCERPT_WORDING } from '../../constants';
import { CustomImage, Text } from '../../core-ui';
import { formatRelativeTime, useStorage } from '../../helpers';
import { Color, makeStyles, useTheme } from '../../theme';
import { Channel, StackNavProp } from '../../types';
import { Author } from '../Author';
import { Markdown } from '../Markdown';

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
    />
  );

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
        <Markdown
          style={styles.markdown}
          content={content}
          fontColor={colors[color]}
          mentions={mentionedUsers}
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
      {footer}
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
  text: {
    marginTop: spacing.xl,
    marginBottom: spacing.m,
  },
  textTime: {
    fontSize: fontSizes.s,
  },
}));
let PostItem = React.memo(BasePostItem);
export { Props as PostItemProps, PostItem };
