import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDebouncedCallback } from 'use-debounce';

import {
  BottomMenu,
  CustomHeader,
  HeaderItem,
  KeyboardTextAreaScrollView,
  ListCreatePoll,
  MentionList,
  ModalHeader,
  TextArea,
} from '../components';
import { NO_CHANNEL_FILTER, isNoChannelFilter } from '../constants';
import {
  Chip,
  Divider,
  Dot,
  Icon,
  Text,
  TextInput,
  TextInputType,
} from '../core-ui';
import { PostDraftType, UploadTypeEnum } from '../generatedAPI/server';
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
  goBackWithoutSaveDraftAlert,
  insertHyperlink,
  insertImageUploadStatus,
  mentionHelper,
  newPostIsValid,
  onKeyPress,
  parseInt,
  saveAndDiscardPostDraftAlert,
  useStorage,
} from '../helpers';
import {
  useAutoSaveManager,
  useAutoSavePostDraft,
  useCreateAndUpdatePostDraft,
  useDeletePostDraft,
  useKASVWorkaround,
  useMention,
  useSiteSettings,
  useStatefulUpload,
} from '../hooks';
import { makeStyles, useTheme } from '../theme';
import {
  CursorPosition,
  Image,
  NewPostForm,
  RootStackNavProp,
  RootStackRouteProp,
} from '../types';
import { useModal } from '../utils';

export default function NewPost() {
  const { modal, setModal } = useModal();
  const styles = useStyles();
  const { spacing, colors } = useTheme();

  const storage = useStorage();
  const user = storage.getItem('user');
  const channels = storage.getItem('channels');

  const defaultChannelId = channels?.[0].id || NO_CHANNEL_FILTER.id;

  const { canCreateTag, canTagTopics, authorizedExtensions } = useSiteSettings({
    onCompleted: ({
      site: {
        uncategorizedCategoryId,
        siteSettings: { defaultComposerCategory, allowUncategorizedTopics },
      },
    }) => {
      if (isNoChannelFilter(selectedChannel)) {
        const parsed = parseInt(defaultComposerCategory);
        if (parsed) {
          setValue('channelId', parsed);
        } else {
          setValue(
            'channelId',
            allowUncategorizedTopics
              ? uncategorizedCategoryId
              : defaultChannelId,
          );
        }
      }
    },
  });

  const extensions = authorizedExtensions?.split('|');
  const normalizedExtensions = formatExtensions(extensions);

  const ios = Platform.OS === 'ios';

  const navigation = useNavigation<RootStackNavProp<'NewPost'>>();
  const { navigate, goBack } = navigation;

  const {
    control,
    handleSubmit,
    formState: { errors, dirtyFields },
    formState,
    setValue,
    getValues,
    watch,
    reset: resetForm,
    getFieldState,
  } = useFormContext<NewPostForm>();

  let { params } = useRoute<RootStackRouteProp<'NewPost'>>();
  let {
    editPostId,
    editTopicId,
    oldContent,
    oldTitle,
    editedUser,
    hyperlinkUrl,
    hyperlinkTitle,
    imageUri,
    sequence,
    isDraft,
  } = useMemo(() => {
    const values = getValues();

    return {
      editPostId: values?.editPostId,
      editTopicId: values?.editTopicId,
      oldContent: values?.oldContent || '',
      oldTitle: values?.oldTitle || '',
      editedUser: params?.editedUser,
      hyperlinkUrl: params?.hyperlinkUrl || '',
      hyperlinkTitle: params?.hyperlinkTitle || '',
      imageUri: params?.imageUri || '',
      sequence: values?.sequence,
      isDraft: values.isDraft ?? false,
    };
  }, [params, getValues]);

  /**
   * Using the watch function to update the values of the channel and tags fields when changes occur in the form.
   * This prevents a bug where, after selecting a channel in the channel scene, the value of selectedChannel does not change because it does not trigger a re-render.
   */

  const selectedChannel: number = watch('channelId');

  const selectedTags: Array<string> = watch('tags');
  const polls = watch('polls');

  const [imagesArray, setImagesArray] = useState<Array<Image>>([]);
  const [uri, setUri] = useState('');
  const [postValidity, setPostValidity] = useState(false);
  const [editPostType, setEditPostType] = useState('');
  const [isKeyboardShow, setKeyboardShow] = useState(false);
  const [showLeftMenu, setShowLeftMenu] = useState(true);
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({
    start: 0,
    end: 0,
  });
  const [showUserList, setShowUserList] = useState(false);
  const [mentionLoading, setMentionLoading] = useState(false);
  const [mentionKeyword, setMentionKeyword] = useState('');
  const [currentUploadToken, setCurrentUploadToken] = useState(1);

  const uploadsInProgress = imagesArray.filter((image) => !image.done).length;

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

  useAutoSaveManager();
  const kasv = useKASVWorkaround();

  const newPostRef = useRef<TextInputType>(null);

  if (hyperlinkUrl) {
    let { newUrl, newTitle } = getHyperlink(hyperlinkUrl, hyperlinkTitle);
    hyperlinkUrl = newUrl;
    hyperlinkTitle = newTitle;
  }

  useEffect(() => {
    setModal(true);
  }, [setModal]);

  useEffect(() => {
    setUri(imageUri);
  }, [imageUri]);

  const { mentionMembers } = useMention(
    mentionKeyword,
    showUserList,
    setMentionLoading,
  );

  useEffect(() => {
    if (!hyperlinkUrl || !hyperlinkTitle) {
      return;
    }
    let { raw } = getValues();
    let result = insertHyperlink(raw, hyperlinkTitle, hyperlinkUrl);
    setValue('raw', result);
  }, [getValues, setValue, hyperlinkUrl, hyperlinkTitle]);

  const onPressSelectChannel = () => {
    navigate('Channels', { prevScreen: 'NewPost' });
  };

  const onPressSelectTags = () => {
    navigate('Tags', {
      canCreateTag: canCreateTag || false,
    });
  };

  const doneCreatePost = handleSubmit(() => {
    navigate('PostPreview', {
      reply: false,
      postData: { topicId: editTopicId || 0 },
      editPostId:
        editPostType === 'Post' || editPostType === 'Both'
          ? editPostId
          : undefined,
      editTopicId:
        editPostType === 'Topic' || editPostType === 'Both'
          ? editTopicId
          : undefined,
      editedUser,
      focusedPostNumber: editTopicId ? 1 : undefined,
    });
  });

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

  // debounce save draft new post every time type text input
  const { debounceSaveDraft } = useAutoSavePostDraft({
    createPostDraft,
    getValues,
    type: PostDraftType.NewTopic,
    skip: !!(editPostId || editTopicId),
  });

  useEffect(() => {
    const { raw } = getValues();
    if (completedToken) {
      debounced(raw, completedToken);
    }
    setImagesArray(tempArray);
  }, [getValues, tempArray, debounced, completedToken]);

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
    prevScreen: 'NewPost',
    extensions: normalizedExtensions,
  });

  useEffect(() => {
    const { title, raw: content, polls } = getValues();

    let currentPostValidity; // temp variable to get the value of existingPostIsValid or newPostIsValid helper

    if (editTopicId || editPostId) {
      currentPostValidity = existingPostIsValid({
        uploadsInProgress,
        title,
        content,
        getFieldState,
        formState,
        polls,
      });

      setPostValidity(currentPostValidity.isValid);
      setEditPostType(currentPostValidity.editType);
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
    editTopicId,
    editPostId,
    getValues,
    oldContent,
    oldTitle,
    selectedChannel,
    selectedTags,
    uploadsInProgress,
    getFieldState,
    formState,
  ]);

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        /**
         * Add condition only when change title or content we show alert
         */
        if (
          ((!dirtyFields.title && !dirtyFields.raw && !dirtyFields.polls) ||
            !modal) &&
          uploadsInProgress < 1
        ) {
          return;
        }
        e.preventDefault();

        // make sure not show save draft alert when edit post
        !editPostId || !editTopicId
          ? saveAndDiscardPostDraftAlert({
              deletePostDraft,
              createPostDraft,
              event: e,
              navigation,
              getValues,
              resetForm,
              draftType: PostDraftType.NewTopic,
            })
          : goBackWithoutSaveDraftAlert({ event: e, navigation, resetForm });
      }),
    [
      postValidity,
      modal,
      navigation,
      uploadsInProgress,
      resetForm,
      createPostDraft,
      deletePostDraft,
      sequence,
      getValues,
      selectedChannel,
      selectedTags,
      isDraft,
      dirtyFields,
      editPostId,
      editTopicId,
    ],
  );

  const setMentionValue = (text: string) => {
    setValue('raw', text);
  };

  const Header = () =>
    ios ? (
      <ModalHeader
        title={editTopicId || editPostId ? t('Edit Post') : t('New Post')}
        left={
          <HeaderItem
            label={t('Cancel')}
            left
            onPressItem={() => {
              goBack();
            }}
            disabled={loadingCreateAndUpdatePostDraft}
          />
        }
        right={
          <HeaderItem
            label={t('Next')}
            onPressItem={doneCreatePost}
            disabled={!postValidity || loadingCreateAndUpdatePostDraft}
          />
        }
      />
    ) : (
      <CustomHeader
        title={editTopicId || editPostId ? t('Edit Post') : t('New Post')}
        rightTitle={t('Next')}
        disabled={!postValidity || loadingCreateAndUpdatePostDraft}
        onPressRight={doneCreatePost}
      />
    );

  return (
    <SafeAreaView style={styles.container} testID="NewPost:SafeAreaView">
      <Header />
      <KeyboardTextAreaScrollView
        {...kasv.props}
        bottomMenu={
          <View>
            <MentionList
              showUserList={showUserList}
              members={mentionMembers}
              mentionLoading={mentionLoading}
              rawText={getValues('raw')}
              textRef={newPostRef}
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
              showLeftMenu={showLeftMenu}
            />
          </View>
        }
      >
        <>
          <View style={styles.titleInputContainer}>
            <Controller
              name="title"
              defaultValue={oldTitle}
              rules={{ required: true }}
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  autoCorrect
                  value={value}
                  label={t('Title')}
                  placeholder={t("What's on your mind?")}
                  onChangeText={(text) => {
                    const { raw: content, polls } = getValues();

                    let currentPostValidity; // temp variable to get the value of existingPostIsValid or newPostIsValid helper

                    if (editTopicId || editPostId) {
                      currentPostValidity = existingPostIsValid({
                        uploadsInProgress,
                        title: text,
                        content,
                        getFieldState,
                        formState,
                        polls,
                      });
                      setPostValidity(currentPostValidity.isValid);
                      setEditPostType(currentPostValidity.editType);
                    } else {
                      currentPostValidity = newPostIsValid(
                        text,
                        content,
                        uploadsInProgress,
                        polls,
                      );
                      setPostValidity(currentPostValidity);
                    }
                    onChange(text);
                    debounceSaveDraft();
                  }}
                  onFocus={() => setShowLeftMenu(false)}
                  error={errors.title != null}
                  testID="NewPost:TextInput:Title"
                  multiline
                  textAlignVertical="top"
                />
              )}
            />
          </View>

          <View style={[styles.formContainer, styles.row]}>
            <Text style={styles.label}>{t('Channel')}</Text>
            <TouchableOpacity
              style={styles.row}
              onPress={onPressSelectChannel}
              testID="NewPost:Button:Channel"
            >
              <Dot
                variant="large"
                color={`#${
                  channels?.find(({ id }) => id === selectedChannel)?.color
                }`}
                style={{ marginEnd: spacing.m }}
              />
              <Text color="textNormal">
                {channels?.find(({ id }) => id === selectedChannel)?.name}
              </Text>
              <Icon
                name="ChevronRight"
                size="l"
                style={styles.iconRight}
                color={colors.textLighter}
              />
            </TouchableOpacity>
          </View>

          <Divider horizontalSpacing="xxl" />

          {canTagTopics && (
            <>
              <View style={[styles.formContainer, styles.row]}>
                <Text style={[styles.label, { flex: 1 }]}>{t('Tags')}</Text>
                <TouchableOpacity
                  style={[styles.row, { flex: 3, justifyContent: 'flex-end' }]}
                  onPress={onPressSelectTags}
                >
                  <View style={styles.tagsViewContainer}>
                    {selectedTags.length ? (
                      <ScrollView
                        scrollEnabled={false}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.row}
                      >
                        {selectedTags.map((tag, index) => {
                          const spacingStyle = { marginEnd: spacing.m };
                          return (
                            <Chip
                              key={tag}
                              content={tag}
                              style={
                                index !== selectedTags.length - 1
                                  ? spacingStyle
                                  : undefined
                              }
                            />
                          );
                        })}
                      </ScrollView>
                    ) : (
                      <Text
                        style={[
                          styles.label,
                          { color: colors.darkTextLighter },
                        ]}
                      >
                        {t('Add a tag')}
                      </Text>
                    )}
                  </View>
                  <Icon
                    name="ChevronRight"
                    size="l"
                    style={styles.iconRight}
                    color={colors.textLighter}
                  />
                </TouchableOpacity>
              </View>
              <Divider horizontalSpacing="xxl" />
            </>
          )}

          <ListCreatePoll
            polls={polls || []}
            setValue={setValue}
            navigate={navigate}
            editPostId={editPostId}
            prevScreen="NewPost"
          />

          <Controller
            name="raw"
            defaultValue={oldContent}
            rules={{ required: polls?.length === 0 }}
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextArea
                value={value}
                isKeyboardShow={isKeyboardShow}
                inputRef={newPostRef}
                placeholder={t('Enter a description')}
                selectionCursor={cursorPosition}
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

                  debounceSaveDraft();
                  debounced(text, currentUploadToken);

                  const { title, polls } = getValues();

                  let currentPostValidity; // temp variable to get the value of existingPostIsValid or newPostIsValid helper

                  if (editTopicId || editPostId) {
                    currentPostValidity = existingPostIsValid({
                      uploadsInProgress,
                      title,
                      content: text,
                      getFieldState,
                      formState,
                      polls,
                    });
                    setPostValidity(currentPostValidity.isValid);
                    setEditPostType(currentPostValidity.editType);
                  } else {
                    currentPostValidity = newPostIsValid(
                      title,
                      text,
                      uploadsInProgress,
                      polls,
                    );
                    setPostValidity(currentPostValidity);
                  }
                }}
                onFocus={(event) => {
                  kasv.scrollToFocusedInput(event);
                  setKeyboardShow(true);
                  setShowLeftMenu(true);
                }}
                onSelectedChange={(cursor) => {
                  setCursorPosition(cursor);
                }}
                onBlur={() => {
                  setKeyboardShow(false);
                }}
                style={styles.spacingHorizontal}
                mentionToggled={showUserList}
                testID="NewPost:TextArea"
              />
            )}
          />
        </>
      </KeyboardTextAreaScrollView>
    </SafeAreaView>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  formContainer: {
    height: 52,
    marginHorizontal: spacing.xxl,
    justifyContent: 'space-between',
  },
  spacingHorizontal: {
    marginHorizontal: spacing.xxl,
  },
  titleInputContainer: {
    paddingTop: spacing.xl,
    marginHorizontal: spacing.xxl,
  },
  tagsViewContainer: { flex: 1, alignItems: 'flex-end' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconRight: { marginStart: spacing.m },
  label: { color: colors.textLight },
}));
