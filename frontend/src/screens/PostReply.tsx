import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Keyboard, Platform, SafeAreaView, View } from 'react-native';
import { useDebouncedCallback } from 'use-debounce';

import { client } from '../api/client';
import {
  BottomMenu,
  CustomHeader,
  HeaderItem,
  KeyboardTextAreaScrollView,
  ListCreatePoll,
  LocalRepliedPost,
  MentionList,
  ModalHeader,
  TextArea,
} from '../components';
import { FORM_DEFAULT_VALUES } from '../constants';
import { Divider, IconWithLabel, TextInputType } from '../core-ui';
import {
  PostDraftType,
  PostFragment,
  PostFragmentDoc,
  UploadTypeEnum,
} from '../generatedAPI/server';
import {
  BottomMenuNavigationParams,
  BottomMenuNavigationScreens,
  bottomMenu,
  createReactNativeFile,
  errorHandlerAlert,
  existingPostIsValid,
  formatExtensions,
  getHyperlink,
  getReplacedImageUploadStatus,
  insertHyperlink,
  insertImageUploadStatus,
  mentionHelper,
  newPostIsValid,
  onKeyPress,
  saveAndDiscardPostDraftAlert,
  useStorage,
} from '../helpers';
import {
  useAutoSavePostDraft,
  useCreateAndUpdatePostDraft,
  useDeletePostDraft,
  useKASVWorkaround,
  useMention,
  usePost,
  useSiteSettings,
  useStatefulUpload,
} from '../hooks';
import { makeStyles, useTheme } from '../theme';
import {
  CursorPosition,
  Image,
  NewPostForm,
  RootStackNavProp,
  RootStackParamList,
  RootStackRouteProp,
} from '../types';
import { useModal } from '../utils';

export default function PostReply() {
  const { modal, setModal } = useModal();
  const styles = useStyles();
  const { colors } = useTheme();

  const navigation = useNavigation<RootStackNavProp<'PostReply'>>();
  const { navigate, goBack } = useNavigation<RootStackNavProp<'PostReply'>>();

  const { params } = useRoute<RootStackRouteProp<'PostReply'>>();
  /**
   * we need to save initial params because after image upload
   * the navigation done from the preview will empty all other params
   */
  const savedNavigationParams = useRef<RootStackParamList['PostReply']>(params);
  let {
    title,
    topicId,
    replyToPostId,
    focusedPostNumber,
    editPostId,
    oldContent = '',
    editedUser,
    hyperlinkTitle = '',
    hyperlinkUrl,
    imageUri = '',
  } = { ...savedNavigationParams.current, ...params };
  const replyingTo = client.readFragment<PostFragment>({
    id: `Post:${replyToPostId}`,
    fragment: PostFragmentDoc,
    fragmentName: 'PostFragment',
  });

  const ios = Platform.OS === 'ios';
  const repliedPost = useMemo(() => {
    if (replyToPostId) {
      return <LocalRepliedPost hideAuthor replyToPostId={replyToPostId} />;
    }
    return undefined;
  }, [replyToPostId]);

  const storage = useStorage();
  const user = storage.getItem('user');

  const { authorizedExtensions } = useSiteSettings();
  const extensions = authorizedExtensions?.split('|');
  const normalizedExtensions = formatExtensions(extensions);

  const kasv = useKASVWorkaround();

  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({
    start: 0,
    end: 0,
  });
  const [mentionLoading, setMentionLoading] = useState(false);
  const [mentionKeyword, setMentionKeyword] = useState('');

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    getFieldState,
    formState,
  } = useFormContext<NewPostForm>();
  const polls = watch('polls');

  const [imagesArray, setImagesArray] = useState<Array<Image>>([]);
  const [uri, setUri] = useState('');
  const [postValidity, setPostValidity] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const [currentUploadToken, setCurrentUploadToken] = useState(1);

  const uploadsInProgress = imagesArray.filter((image) => !image.done).length;

  const [isKeyboardShow, setKeyboardShow] = useState(false);

  const debounced = useDebouncedCallback((value, token) => {
    if (imagesArray[token - 1]) {
      let newText = getReplacedImageUploadStatus(
        value,
        token,
        imagesArray[token - 1].link,
      );

      setValue('raw', newText);
    }
  }, 1500);

  const postReplyRef = useRef<TextInputType>(null);

  const { upload, tempArray, completedToken } = useStatefulUpload(
    imagesArray,
    currentUploadToken,
  );

  const { createPostDraft, loading: loadingCreateAndUpdatePostDraft } =
    useCreateAndUpdatePostDraft({
      onError: (error) => {
        errorHandlerAlert(error);
      },
      onCompleted: ({ createAndUpdatePostDraft }) => {
        setValue('draftKey', createAndUpdatePostDraft?.draftKey);
        setValue('sequence', createAndUpdatePostDraft?.draftSequence);
        setValue('isDraft', true);
      },
    });
  const { deletePostDraft } = useDeletePostDraft();
  const { getPost, loading: loadingRepliedPost } = usePost();

  const { debounceSaveDraft } = useAutoSavePostDraft({
    createPostDraft,
    getValues,
    type: PostDraftType.PostReply,
    topicId,
    replyToPostId,
  });

  useEffect(() => {
    const { isDraft } = getValues();
    if (replyToPostId && isDraft) {
      getPost({ variables: { postId: replyToPostId } });
    }
  }, [getPost, getValues, replyToPostId]);

  useEffect(() => {
    const { raw } = getValues();
    if (completedToken) {
      debounced(raw, completedToken);
    }
    setImagesArray(tempArray);
  }, [getValues, tempArray, debounced, completedToken]);

  useEffect(() => setUri(imageUri), [imageUri]);

  const { mentionMembers } = useMention(
    mentionKeyword,
    showUserList,
    setMentionLoading,
  );

  useEffect(() => {
    if (!uri || !user) {
      return;
    }
    setImagesArray([...imagesArray, { link: '', done: false }]);
    setCurrentUploadToken(currentUploadToken + 1);
    const reactNativeFile = createReactNativeFile(uri);
    if (!reactNativeFile) {
      return;
    }
    const { raw } = getValues();
    let result = insertImageUploadStatus(
      raw,
      cursorPosition.start,
      imagesArray.length + 1,
    );
    setValue('raw', result);
    upload({
      variables: {
        input: {
          file: reactNativeFile,
          userId: user.id || 0,
          type: UploadTypeEnum.Composer,
          token: currentUploadToken,
        },
      },
    });
    setUri('');
  }, [
    currentUploadToken,
    cursorPosition.start,
    imagesArray,
    getValues,
    setValue,
    upload,
    uploadsInProgress,
    uri,
    user,
  ]);

  if (hyperlinkUrl) {
    let { newUrl, newTitle } = getHyperlink(hyperlinkUrl, hyperlinkTitle);
    hyperlinkUrl = newUrl;
    hyperlinkTitle = newTitle;
  }

  useEffect(() => {
    setModal(true);
  }, [setModal]);

  useEffect(() => {
    let postReplyObject = getValues();
    let result = insertHyperlink(
      postReplyObject.raw,
      hyperlinkTitle,
      hyperlinkUrl,
    );
    setValue('raw', result);
  }, [hyperlinkTitle, hyperlinkUrl, getValues, setValue]);

  const onNavigate = (
    screen: BottomMenuNavigationScreens,
    params: BottomMenuNavigationParams,
  ) => {
    navigate(screen, params);
  };

  const {
    onInsertImage,
    onInsertLink,
    onInsertPoll,
    onFontFormatting,
    onQuote,
    onListFormatting,
    onCollapsibleFormatting,
  } = bottomMenu({
    isKeyboardShow,
    user,
    navigate: onNavigate,
    prevScreen: 'PostReply',
    extensions: normalizedExtensions,
    title,
    topicId,
    replyToPostId,
  });

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        if (
          ((!formState.dirtyFields.raw && !formState.dirtyFields.polls) ||
            !modal) &&
          uploadsInProgress < 1
        ) {
          reset(FORM_DEFAULT_VALUES);
          return;
        }
        e.preventDefault();

        saveAndDiscardPostDraftAlert({
          deletePostDraft,
          createPostDraft,
          event: e,
          navigation,
          getValues,
          resetForm: reset,
          draftType: PostDraftType.PostReply,
          topicId,
          replyToPostId,
        });
      }),
    [
      postValidity,
      modal,
      navigation,
      uploadsInProgress,
      reset,
      getValues,
      deletePostDraft,
      createPostDraft,
      topicId,
      formState.dirtyFields.raw,
      replyToPostId,
      formState.dirtyFields.polls,
    ],
  );

  const onPreview = handleSubmit(() => {
    Keyboard.dismiss();
    setValue('title', title);
    navigate('PostPreview', {
      reply: true,
      postData: { topicId, postNumber: replyingTo?.postNumber, replyToPostId },
      focusedPostNumber,
      editPostId,
      editedUser,
    });
  });

  useEffect(() => {
    const { raw: content } = getValues();

    let currentPostValidity; // temp variable to get the value of existingPostIsValid or newPostIsValid helper

    if (editPostId) {
      currentPostValidity = existingPostIsValid({
        uploadsInProgress,
        title,
        oldTitle: title,
        content,
        oldContent,
        polls,
      });
      setPostValidity(currentPostValidity.isValid);
    } else {
      currentPostValidity = newPostIsValid(
        title,
        content,
        uploadsInProgress,
        polls,
      );
      setPostValidity(currentPostValidity);
    }
  }, [
    editPostId,
    formState,
    getFieldState,
    getValues,
    oldContent,
    polls,
    title,
    uploadsInProgress,
    hyperlinkUrl,
  ]);

  const setMentionValue = (text: string) => {
    setValue('raw', text);
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        title={editPostId ? t('Edit Post') : t('Reply')}
        rightTitle={t('Next')}
        onPressRight={onPreview}
        disabled={!postValidity || loadingCreateAndUpdatePostDraft}
        noShadow
      />
      {ios && (
        <ModalHeader
          title={editPostId ? t('Edit Post') : t('Reply')}
          left={
            <HeaderItem
              label={t('Cancel')}
              onPressItem={() => {
                goBack();
              }}
              left
              disabled={loadingCreateAndUpdatePostDraft}
            />
          }
          right={
            <HeaderItem
              label={t('Next')}
              onPressItem={onPreview}
              disabled={!postValidity || loadingCreateAndUpdatePostDraft}
            />
          }
        />
      )}
      <KeyboardTextAreaScrollView
        {...kasv.props}
        bottomMenu={
          <View>
            <MentionList
              showUserList={showUserList}
              members={mentionMembers}
              mentionLoading={mentionLoading}
              rawText={getValues('raw')}
              textRef={postReplyRef}
              setMentionValue={setMentionValue}
              setShowUserList={setShowUserList}
            />
            <BottomMenu
              onInsertImage={onInsertImage}
              onInsertLink={onInsertLink}
              onInsertPoll={onInsertPoll}
              onBold={() => {
                const { raw } = getValues();
                onFontFormatting({
                  content: raw,
                  cursorPosition,
                  setCursorPosition,
                  setValue,
                  type: 'Bold',
                });
              }}
              onItalic={() => {
                const { raw } = getValues();
                onFontFormatting({
                  content: raw,
                  cursorPosition,
                  setCursorPosition,
                  setValue,
                  type: 'Italic',
                });
              }}
              onQuote={() => {
                const { raw: content } = getValues();

                onQuote({
                  content,
                  cursorPosition,
                  setCursorPosition,
                  setValue,
                });
              }}
              onBulletedList={() => {
                const { raw } = getValues();
                onListFormatting({
                  content: raw,
                  cursorPosition,
                  setCursorPosition,
                  setValue,
                  type: 'Bullet',
                });
              }}
              onNumberedList={() => {
                const { raw } = getValues();
                onListFormatting({
                  content: raw,
                  cursorPosition,
                  setCursorPosition,
                  setValue,
                  type: 'Number',
                });
              }}
              onCollapsible={() => {
                const { raw } = getValues();
                onCollapsibleFormatting({
                  content: raw,
                  cursorPosition,
                  setCursorPosition,
                  setValue,
                });
              }}
            />
          </View>
        }
      >
        <IconWithLabel
          icon="Replies"
          color={colors.textLighter}
          label={title}
          fontStyle={styles.title}
          style={styles.titleContainer}
          numberOfLines={1}
        />
        <Divider style={styles.spacingBottom} horizontalSpacing="xxl" />
        {!loadingRepliedPost && repliedPost}
        <ListCreatePoll
          polls={polls || []}
          setValue={setValue}
          navigate={navigate}
          prevScreen="PostReply"
        />
        <Controller
          name="raw"
          defaultValue={oldContent}
          rules={{ required: polls?.length === 0 }}
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextArea
              value={value}
              large
              isKeyboardShow={isKeyboardShow}
              inputRef={postReplyRef}
              placeholder={t('Share your thoughts')}
              onKeyPress={(event) => {
                onKeyPress({
                  event,
                  text: value,
                  cursorPosition,
                  onChange,
                });
              }}
              onChangeValue={(text) => {
                mentionHelper(
                  text,
                  cursorPosition,
                  setShowUserList,
                  setMentionLoading,
                  setMentionKeyword,
                );
                onChange(text);
                debounced(text, currentUploadToken);
                debounceSaveDraft();

                let currentPostValidity; // temp variable to get the value of existingPostIsValid or newPostIsValid helper

                if (editPostId) {
                  currentPostValidity = existingPostIsValid({
                    uploadsInProgress,
                    title,
                    oldTitle: title,
                    content: text,
                    oldContent,
                  });
                  setPostValidity(currentPostValidity.isValid);
                } else {
                  currentPostValidity = newPostIsValid(
                    title,
                    text,
                    uploadsInProgress,
                  );
                  setPostValidity(currentPostValidity);
                }
              }}
              onFocus={(event) => {
                setKeyboardShow(true);
                kasv.scrollToFocusedInput(event);
              }}
              onBlur={() => {
                setKeyboardShow(false);
              }}
              onSelectedChange={(cursor) => {
                setCursorPosition(cursor);
              }}
              style={styles.markdownContainer}
              mentionToggled={showUserList}
              selectionCursor={cursorPosition}
              testID="PostReply:TextArea"
            />
          )}
        />
      </KeyboardTextAreaScrollView>
    </SafeAreaView>
  );
}

const useStyles = makeStyles(({ colors, fontVariants, spacing }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  titleContainer: {
    flex: 1,
    marginHorizontal: spacing.xxl,
    paddingTop: spacing.m,
    paddingBottom: spacing.xl,
  },
  title: {
    flex: 1,
    ...fontVariants.semiBold,
  },
  markdownContainer: {
    paddingHorizontal: spacing.xxl,
  },
  spacingBottom: {
    marginBottom: spacing.xl,
  },
}));
