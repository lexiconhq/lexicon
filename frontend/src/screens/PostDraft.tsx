import { useNavigation } from '@react-navigation/native';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useFormContext } from 'react-hook-form';
import { Platform, SafeAreaView, TouchableOpacity, View } from 'react-native';

import {
  ActionSheet,
  ActionSheetProps,
  CustomFlatList,
  CustomHeader,
  FooterLoadingIndicator,
  LoadingOrError,
  Markdown,
  PostGroupings,
} from '../components';
import { defaultArgsListPostDraft } from '../constants/postDraft';
import { Icon, Text } from '../core-ui';
import {
  PostDraftList,
  convertPollMarkdown,
  filterMarkdownContentPoll,
  postDraftContentHandler,
  processDraftPollAndImageForPrivateMessageReply,
  replaceImageMarkdownWithPlaceholder,
  useStorage,
} from '../helpers';
import { useDeletePostDraft, useListPostDrafts } from '../hooks';
import { makeStyles, useTheme } from '../theme';
import { NewPostForm, RootStackNavProp } from '../types';

type ListPostDraftsRenderItem = { item: PostDraftList; index: number };

export default function PostDraft() {
  const styles = useStyles();
  const { colors } = useTheme();
  const storage = useStorage();

  const draftKeyOnFocusRef = useRef<string>();
  const draftKeyOnFocus = draftKeyOnFocusRef.current;

  const ios = Platform.OS === 'ios';
  let channels = storage.getItem('channels') ?? [];

  const navigation = useNavigation<RootStackNavProp<'PostDraft'>>();
  const { navigate } = navigation;

  const [showActionSheet, setShowActionSheet] = useState(false);
  const [loadingRefresh, setLoadingRefresh] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isInitialRequest, setIsInitialRequest] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const { setValue, reset: resetForm } = useFormContext<NewPostForm>();

  const {
    getListPostDraft,
    data,
    refetch,
    loading: loadingPostDraft,
    fetchMore,
  } = useListPostDrafts({
    onCompleted: ({ listPostDrafts }) => {
      if (listPostDrafts.length < page * defaultArgsListPostDraft.limit) {
        setHasMore(false);
      }
      setLoadingMore(false);
    },
  });

  const { deletePostDraft } = useDeletePostDraft({
    onCompleted: () => {
      refreshPostDrafts();
    },
  });

  let postDrafts = useMemo(() => {
    if (!data) {
      return;
    }
    return postDraftContentHandler(data.listPostDrafts);
  }, [data]);

  // make sure query is called every time change tab
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getListPostDraft({
        variables: { page: 1 },
      });
      setIsInitialRequest(false);
    });

    return unsubscribe;
  }, [getListPostDraft, navigation, page]);

  const navToEditPost = () => {
    const focusedDraft = postDrafts?.find(
      (draft) => draft.draftKey === draftKeyOnFocus,
    );

    if (focusedDraft && focusedDraft.draft) {
      const { sequence, draft, topicTitle, topicId, draftKey } = focusedDraft;
      const newContentFilter = filterMarkdownContentPoll(draft?.content);
      const polls = convertPollMarkdown(newContentFilter.pollMarkdowns);
      // NOTE: We only support editing draft with type 'NewTopic' and 'PostReply' for now
      if (draft.draftType === 'NewTopic') {
        resetForm({
          title: draft?.title || '',
          raw: newContentFilter.filteredMarkdown,
          tags: draft?.tags,
          channelId: draft?.categoryId || undefined,
          sequence: sequence,
          isDraft: true,
          draftKey,
          polls,
        });
        setValue('oldContent', newContentFilter.filteredMarkdown);
        setValue('oldTitle', topicTitle || '');
        navigate('NewPost');
      } else if (draft.draftType === 'PostReply' && topicId) {
        resetForm({
          raw: newContentFilter.filteredMarkdown,
          tags: draft?.tags,
          channelId: draft?.categoryId || undefined,
          sequence: sequence,
          isDraft: true,
          draftKey,
          polls,
        });
        setValue('oldContent', newContentFilter.filteredMarkdown);

        navigate('PostReply', {
          topicId,
          title: topicTitle || '',
          replyToPostId: draft?.postId || undefined,
        });
      } else if (draft.draftType === 'NewPrivateMessage') {
        resetForm({
          title: draft.title || '',
          raw: newContentFilter.filteredMarkdown,
          tags: draft.tags || [],
          sequence: sequence,
          isDraft: true,
          draftKey,
          messageTargetSelectedUsers: draft.recipients?.usernames || [],
          messageUsersList: draft.recipients?.userDetails || [],
          polls,
        });
        navigate('NewMessage');
      } else if (draft.draftType === 'PrivateMessageReply' && topicId) {
        const { imageMessageReplyList, newContentFilterRaw } =
          processDraftPollAndImageForPrivateMessageReply({
            content: newContentFilter.filteredMarkdown,
          });

        resetForm({
          raw: newContentFilterRaw,
          isDraft: true,
          sequence: sequence,
          polls,
          imageMessageReplyList,
          draftKey,
        });
        navigate('MessageDetail', {
          id: topicId,
          hyperlinkUrl: '',
          hyperlinkTitle: '',
        });
      }
    }
  };

  const deleteDraft = () => {
    const focusedDraft = postDrafts?.find(
      (draft) => draft.draftKey === draftKeyOnFocus,
    );

    if (focusedDraft && focusedDraft.draft) {
      const { sequence } = focusedDraft;

      return deletePostDraft({
        variables: {
          sequence,
          draftKey: focusedDraft.draftKey,
        },
      });
    }
  };

  const refreshPostDrafts = async () => {
    setPage(1);
    setLoadingRefresh(true);
    refetch().then(() => {
      setLoadingRefresh(false);
    });
  };

  const onPressMore = useCallback((params: { draftKey: string }) => {
    draftKeyOnFocusRef.current = params.draftKey;
    setShowActionSheet(true);
  }, []);

  const actionItemOptions = () => {
    let options: ActionSheetProps['options'] = [];
    ios && options.push({ label: t('Cancel') });
    options.push({ label: t('Edit Draft') });
    options.push({ label: t('Delete Draft') });

    return options;
  };

  const loadMoreDrafts = async () => {
    if (!postDrafts?.length || !hasMore) {
      return;
    }
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMore({ variables: { page: nextPage } });
  };

  const actionItemOnPress = (btnIndex: number) => {
    switch (btnIndex) {
      case 0: {
        return navToEditPost();
      }
      case 1: {
        return deleteDraft();
      }
    }
  };

  const getChannel = (categoryId: number | null | undefined) => {
    if (!categoryId) {
      return;
    }
    return channels.find((channel) => channel.id === categoryId);
  };

  const renderItem = ({ item, index }: ListPostDraftsRenderItem) => {
    const { draft, topicTitle, draftKey, isReply, isPrivateMessage } = item;

    const draftTitle = !isReply ? draft?.title : topicTitle;
    const channel = getChannel(draft?.categoryId);

    return (
      <View style={styles.postDraftItem} key={index}>
        <View style={styles.postTitleContainer}>
          <View style={styles.postTitle}>
            <Text
              variant="semiBold"
              size="s"
              color={!isPrivateMessage ? 'primary' : 'success'}
            >
              {`${isPrivateMessage ? t('PRIVATE MESSAGE') : t('POST')} ${
                isReply ? t('REPLY') : ''
              }`}
            </Text>
            {draftTitle && (
              <Text variant="semiBold" size="l">
                {draftTitle}
              </Text>
            )}
          </View>

          <Icon
            name="More"
            color={colors.primary}
            onPress={() => {
              onPressMore({ draftKey });
            }}
            hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
            testID={`PostDraft:IconMore:${draftTitle}`}
          />
        </View>
        <Markdown
          style={styles.postContent}
          content={
            replaceImageMarkdownWithPlaceholder({
              content: item.excerpt,
              placeholder: '[Image]',
            }).filterMarkdown
          }
          fontColor={colors.textNormal}
        />
        {channel && <PostGroupings channel={channel} tags={item.draft?.tags} />}
      </View>
    );
  };

  return (
    <>
      <SafeAreaView style={styles.container} testID="PostDraft:SafeAreaView">
        <CustomHeader title={t('Draft')} hideHeaderLeft noShadow />
        {loadingPostDraft && !data && !loadingRefresh && !loadingMore ? (
          <LoadingOrError loading />
        ) : (
          <CustomFlatList
            data={postDrafts || []}
            renderItem={renderItem}
            keyExtractor={(_, index) => index.toString()}
            onRefresh={refreshPostDrafts}
            refreshing={loadingRefresh}
            refreshControlTintColor={colors.loading}
            testID="PostDraft:List"
            contentContainerStyle={styles.flexGrow}
            onEndReachedThreshold={0.1}
            onEndReached={() => loadMoreDrafts()}
            ListEmptyComponent={
              <View
                style={[styles.center, styles.noDataContainer, styles.flexGrow]}
              >
                <View style={[styles.noDataIcon, styles.center]}>
                  <Icon name="Folder" size="xxl" color={colors.grey} />
                </View>
                <Text
                  size="l"
                  variant="bold"
                  style={[styles.textCenter, styles.draftText]}
                >
                  {t('Drafts Will Appear Here')}
                </Text>
                <Text style={styles.textCenter}>
                  {t(
                    'All your posts, replies, and message drafts will be saved here. Start creating today!',
                  )}
                </Text>
              </View>
            }
            ListFooterComponent={
              <FooterLoadingIndicator
                isHidden={isInitialRequest || !loadingMore}
              />
            }
          />
        )}
      </SafeAreaView>
      <TouchableOpacity>
        <ActionSheet
          visible={showActionSheet}
          options={actionItemOptions()}
          cancelButtonIndex={ios ? 0 : undefined}
          actionItemOnPress={actionItemOnPress}
          onClose={() => {
            setShowActionSheet(false);
          }}
          style={!ios && styles.androidModalContainer}
        />
      </TouchableOpacity>
    </>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  postDraftItem: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.l,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  postTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  postTitle: { marginRight: spacing.s },
  postContent: { marginBottom: spacing.xl },
  androidModalContainer: {
    paddingHorizontal: spacing.xxxl,
  },
  textCenter: { textAlign: 'center' },
  center: { justifyContent: 'center', alignItems: 'center' },
  noDataContainer: { paddingHorizontal: spacing.xl },
  noDataIcon: {
    width: 120,
    height: 120,
    backgroundColor: colors.backgroundDarker,
    borderRadius: 60,
    marginBottom: spacing.xxl,
  },
  draftText: { marginBottom: spacing.m },
  flexGrow: { flexGrow: 1 },
}));
