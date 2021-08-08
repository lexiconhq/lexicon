import React, { useEffect, useState } from 'react';
import { Image, Platform, SafeAreaView, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';

import { DEFAULT_IMAGE } from '../../assets/images';
import mock from '../__mocks__/mockData';
import {
  Author,
  CustomHeader,
  HeaderItem,
  Markdown,
  ModalHeader,
  PostGroupings,
  RepliedPost,
} from '../components';
import { CustomImage, Divider, IconWithLabel, Text } from '../core-ui';
import {
  errorHandlerAlert,
  getPostShortUrl,
  sortImageUrl,
  useStorage,
} from '../helpers';
import {
  useEditPost,
  useEditTopic,
  useLookupUrls,
  useNewTopic,
  useReplyTopic,
} from '../hooks';
import { makeStyles, useTheme } from '../theme';
import { RootStackNavProp, RootStackRouteProp, StackRouteProp } from '../types';
import { useModal } from '../utils';

const ios = Platform.OS === 'ios';

export default function PostPreview() {
  const { setModal } = useModal();
  const styles = useStyles();
  const { colors, spacing } = useTheme();

  const navigation = useNavigation<RootStackNavProp<'PostPreview'>>();
  const { navigate, reset, goBack } = navigation;

  const {
    params: {
      reply,
      postData,
      focusedPostNumber,
      editPostId,
      editTopicId,
      editedUser,
    },
  } = useRoute<RootStackRouteProp<'PostPreview'>>();

  const storage = useStorage();
  const channels = storage.getItem('channels');

  const [imageUrls, setImageUrls] = useState<Array<string>>();

  const { title, content } = postData;
  const shortUrls = getPostShortUrl(content) ?? [];
  const tags = 'tagIds' in postData ? postData.tagIds : [];
  const images = 'images' in postData ? postData.images : undefined;

  const navToPostDetail = ({
    topicId,
    selectedChannelId = ('post' in postData && postData.post?.channel.id) || 0,
    focusedPostNumber,
  }: StackRouteProp<'PostDetail'>['params']) => {
    const prevScreen = 'PostPreview';

    navigate('Main', {
      screen: 'PostDetail',
      params: {
        topicId,
        selectedChannelId,
        focusedPostNumber,
        prevScreen,
      },
    });
  };

  const { getImageUrls } = useLookupUrls({
    variables: { shortUrls },
    onCompleted: ({ lookupUrls }) => {
      setImageUrls(sortImageUrl(shortUrls, lookupUrls));
    },
  });

  const { newTopic, loading: newTopicLoading } = useNewTopic({
    onCompleted: ({ newTopic: result }) => {
      reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
      navToPostDetail({
        topicId: result.topicId,
        selectedChannelId: ('channelId' in postData && postData.channelId) || 0,
        focusedPostNumber,
      });
    },
  });

  const { reply: replyTopic, loading: replyLoading } = useReplyTopic({
    onCompleted: () => {
      navToPostDetail({
        topicId: ('topicId' in postData && postData.topicId) || 0,
        focusedPostNumber,
      });
    },
    onError: (error) => {
      errorHandlerAlert(error);
    },
  });

  const { editPost, loading: editPostLoading } = useEditPost({
    onCompleted: () => {
      !editTopicId && // if there's also editTopicId then don't do anything.
        navToPostDetail({
          topicId: ('topicId' in postData && postData.topicId) || 0,
          focusedPostNumber,
        });
    },
    onError: (error) => {
      errorHandlerAlert(error);
    },
  });

  const { editTopic, loading: editTopicLoading } = useEditTopic({
    onCompleted: () => {
      navToPostDetail({
        topicId: editTopicId || 0,
        focusedPostNumber,
      });
    },
    onError: (error) => {
      errorHandlerAlert(error);
    },
  });

  const loading = reply
    ? replyLoading || editPostLoading
    : newTopicLoading || editTopicLoading;

  useEffect(() => {
    if (shortUrls.length > 0) {
      getImageUrls();
    }
  }, [getImageUrls, shortUrls.length]);

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        if (loading) {
          e.preventDefault();
        }
      }),
    [loading, navigation],
  );

  const postToServer = () => {
    setModal(false);
    if (editPostId || editTopicId) {
      if (editPostId) {
        editPost({
          variables: {
            postId: editPostId,
            postInput: {
              raw: content,
            },
          },
        });
      }
      if (editTopicId) {
        editTopic({
          variables: {
            topicId: editTopicId,
            topicInput: {
              title,
              categoryId: ('channelId' in postData && postData.channelId) || 0,
              tags,
            },
          },
        });
      }
      return;
    }
    if (reply) {
      const post = 'post' in postData && postData.post;
      replyTopic({
        variables: {
          raw: content,
          topicId: ('topicId' in postData && postData.topicId) || 0,
          replyToPostNumber: post ? post.postNumber : null,
        },
      });
    } else {
      newTopic({
        variables: {
          newTopicInput: {
            title,
            category: ('channelId' in postData && postData.channelId) || 0,
            tags,
            raw: content,
          },
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        title={t('Preview')}
        rightIcon="Send"
        onPressRight={postToServer}
        isLoading={loading}
      />
      {ios && (
        <ModalHeader
          title={t('Preview')}
          left={
            <HeaderItem
              label={t('Cancel')}
              onPressItem={goBack}
              disabled={loading}
              left
            />
          }
          right={
            <HeaderItem
              label={t('Post')}
              onPressItem={postToServer}
              loading={loading}
            />
          }
        />
      )}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {reply ? (
          <>
            <IconWithLabel
              icon="Replies"
              color={colors.textLighter}
              label={title}
              fontStyle={styles.title}
              style={styles.titleContainer}
              numberOfLines={1}
            />
            <Divider style={styles.spacingBottom} horizontalSpacing="xxl" />
          </>
        ) : (
          <Text style={styles.spacingBottom} variant="semiBold" size="l">
            {title}
          </Text>
        )}
        <Author
          image={
            editedUser
              ? editedUser.avatar
              : storage.getItem('user')?.avatar || ''
          }
          title={
            editedUser
              ? editedUser.username
              : storage.getItem('user')?.username || ''
          }
          size="s"
          style={styles.spacingBottom}
        />

        {!reply && 'channelId' in postData && (
          <PostGroupings
            style={styles.spacingBottom}
            channel={
              channels?.find(({ id }) => id === postData.channelId) ||
              mock.channels[0]
            }
            tags={tags}
          />
        )}
        {reply && 'post' in postData && postData.post && (
          <RepliedPost replyTo={postData.post} />
        )}
        <Markdown
          style={styles.markdown}
          imageUrls={imageUrls}
          content={content}
          nonClickable={true}
        />
        {shortUrls.length > 0 &&
          !imageUrls &&
          shortUrls.map((_url, index) => (
            <View
              key={index}
              style={{
                paddingVertical: spacing.l,
                marginBottom: spacing.xl,
              }}
            >
              <Image
                source={DEFAULT_IMAGE}
                style={{
                  width: '100%',
                  height: 200,
                  borderRadius: 4,
                }}
              />
            </View>
          ))}

        {!reply &&
          images?.map((image, index) => (
            <CustomImage
              src={image}
              style={styles.spacingBottom}
              key={`images-${index}`}
            />
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const useStyles = makeStyles(({ colors, fontVariants, spacing }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingHorizontal: spacing.xxl,
    paddingTop: ios ? spacing.xl : spacing.xxl,
  },
  titleContainer: {
    flex: 1,
    paddingTop: spacing.m,
    paddingBottom: spacing.xl,
  },
  title: {
    flex: 1,
    ...fontVariants.semiBold,
  },
  markdown: {
    marginTop: spacing.xl,
  },
  spacingBottom: {
    marginBottom: spacing.xl,
  },
}));
