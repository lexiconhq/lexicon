import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Controller, useForm } from 'react-hook-form';
import { useDebouncedCallback } from 'use-debounce';

import {
  BottomMenu,
  CustomHeader,
  HeaderItem,
  KeyboardTextAreaScrollView,
  MentionList,
  ModalHeader,
  TextArea,
} from '../components';
import {
  Chip,
  Divider,
  Dot,
  Icon,
  Text,
  TextInput,
  TextInputType,
} from '../core-ui';
import { UploadTypeEnum } from '../generated/server';
import {
  bottomMenu,
  createReactNativeFile,
  existingPostIsValid,
  formatExtensions,
  getHyperlink,
  insertHyperlink,
  mentionHelper,
  newPostIsValid,
  reformatMarkdownAfterUpload,
  reformatMarkdownBeforeUpload,
  useStorage,
} from '../helpers';
import {
  useKASVWorkaround,
  useMention,
  useSiteSettings,
  useStatefulUpload,
} from '../hooks';
import { makeStyles, useTheme } from '../theme';
import {
  CursorPosition,
  Image,
  RootStackNavProp,
  RootStackParamList,
  RootStackRouteProp,
} from '../types';
import { useModal } from '../utils';
import { isNoChannelFilter } from '../constants';

type Form = {
  title: string;
  raw: string;
};

export default function NewPost() {
  const { modal, setModal } = useModal();
  const styles = useStyles();
  const { spacing, colors } = useTheme();

  const storage = useStorage();
  const user = storage.getItem('user');
  const channels = storage.getItem('channels');

  const {
    canCreateTag,
    canTagTopics,
    authorizedExtensions,
    uncategorizedCategoryId,
  } = useSiteSettings();
  const extensions = authorizedExtensions?.split('|');
  const normalizedExtensions = formatExtensions(extensions);

  const ios = Platform.OS === 'ios';

  const DEFAULT_CHANNEL_ID = channels?.[0].id || 1;

  const navigation = useNavigation<RootStackNavProp<'NewPost'>>();
  const { navigate, goBack } = navigation;

  let {
    params: {
      selectedChannelId = DEFAULT_CHANNEL_ID,
      selectedTagsIds = [],
      oldContent = '',
      oldTitle = '',
      oldChannel = DEFAULT_CHANNEL_ID,
      oldTags = [],
      editPostId,
      editTopicId,
      editedUser,
      hyperlinkUrl = '',
      hyperlinkTitle = '',
      imageUri = '',
    },
  } = useRoute<RootStackRouteProp<'NewPost'>>();

  const [selectedChannel, setSelectedChannel] = useState(1);
  const [selectedTags, setSelectedTags] = useState<Array<string>>([]);
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
      reformatMarkdownAfterUpload(value, imagesArray, token, setValue);
    }
  }, 1500);

  const { control, handleSubmit, errors, setValue, getValues } = useForm<Form>({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

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

  useEffect(() => {
    setSelectedChannel(
      isNoChannelFilter(selectedChannelId)
        ? uncategorizedCategoryId || 1
        : selectedChannelId,
    );
    setSelectedTags(selectedTagsIds);
  }, [uncategorizedCategoryId, selectedChannelId, selectedTagsIds]);

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
    navigate('Channels', {
      prevScreen: 'NewPost',
      selectedChannelId: selectedChannelId,
    });
  };

  const getPostData = () => {
    const { title, raw } = getValues();
    return {
      title,
      content: raw,
      channelId: selectedChannel,
      tagIds: selectedTags,
      createdAt: new Date().toISOString(),
      topicId: editTopicId,
    };
  };

  const onPressSelectTags = () => {
    navigate('Tags', {
      selectedTagsIds,
      canCreateTag: canCreateTag || false,
    });
  };

  const doneCreatePost = handleSubmit(() => {
    navigate('PostPreview', {
      reply: false,
      postData: getPostData(),
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
    const { raw } = getValues();
    reformatMarkdownBeforeUpload(
      raw,
      cursorPosition.start,
      imagesArray,
      setValue,
    );
    upload({
      variables: {
        file: reactNativeFile,
        userId: user.id || 0,
        type: UploadTypeEnum.Composer,
        token: currentUploadToken,
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
    screen: 'PostImagePreview' | 'HyperLink',
    params:
      | RootStackParamList['PostImagePreview']
      | RootStackParamList['HyperLink'],
  ) => {
    navigate(screen, params);
  };

  const { onInsertImage, onInsertLink } = bottomMenu({
    isKeyboardShow,
    user,
    navigate: onNavigate,
    prevScreen: 'NewPost',
    extensions: normalizedExtensions,
  });

  useEffect(() => {
    const { title, raw: content } = getValues();

    let currentPostValidity; // temp variable to get the value of existingPostIsValid or newPostIsValid helper

    if (editTopicId || editPostId) {
      currentPostValidity = existingPostIsValid(
        uploadsInProgress,
        title,
        oldTitle,
        content,
        oldContent,
        selectedChannel,
        oldChannel,
        selectedTags,
        oldTags,
      );

      setPostValidity(currentPostValidity.isValid);
      setEditPostType(currentPostValidity.editType);
    } else {
      currentPostValidity = newPostIsValid(title, content, uploadsInProgress);
      setPostValidity(currentPostValidity);
    }
  }, [
    editTopicId,
    editPostId,
    getValues,
    oldChannel,
    oldContent,
    oldTags,
    oldTitle,
    selectedChannel,
    selectedTags,
    uploadsInProgress,
  ]);

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        if ((!postValidity || !modal) && uploadsInProgress < 1) {
          return;
        }
        e.preventDefault();
        Alert.alert(
          t('Discard Post?'),
          t('Are you sure you want to discard your post?'),
          [
            { text: t('Cancel') },
            {
              text: t('Discard'),
              onPress: () => navigation.dispatch(e.data.action),
            },
          ],
        );
      }),
    [postValidity, modal, navigation, uploadsInProgress],
  );

  const Header = () =>
    ios ? (
      <ModalHeader
        title={editTopicId || editPostId ? t('Edit Post') : t('New Post')}
        left={<HeaderItem label={t('Cancel')} left onPressItem={goBack} />}
        right={
          <HeaderItem
            label={t('Next')}
            onPressItem={doneCreatePost}
            disabled={!postValidity}
          />
        }
      />
    ) : (
      <CustomHeader
        title={editTopicId || editPostId ? t('Edit Post') : t('New Post')}
        rightTitle={t('Next')}
        disabled={!postValidity}
        onPressRight={doneCreatePost}
      />
    );

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      {
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
                setMentionValue={setValue}
                setShowUserList={setShowUserList}
              />
              <BottomMenu
                onInsertImage={onInsertImage}
                onInsertLink={onInsertLink}
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
                render={({ onChange, value }) => (
                  <TextInput
                    value={value}
                    label={t('Title')}
                    placeholder={t("What's on your mind?")}
                    onChangeText={(text) => {
                      const { raw: content } = getValues();

                      let currentPostValidity; // temp variable to get the value of existingPostIsValid or newPostIsValid helper

                      if (editTopicId || editPostId) {
                        currentPostValidity = existingPostIsValid(
                          uploadsInProgress,
                          text,
                          oldTitle,
                          content,
                          oldContent,
                          selectedChannel,
                          oldChannel,
                          selectedTags,
                          oldTags,
                        );
                        setPostValidity(currentPostValidity.isValid);
                        setEditPostType(currentPostValidity.editType);
                      } else {
                        currentPostValidity = newPostIsValid(
                          text,
                          content,
                          uploadsInProgress,
                        );
                        setPostValidity(currentPostValidity);
                      }
                      onChange(text);
                    }}
                    onFocus={() => setShowLeftMenu(false)}
                    error={errors.title != null}
                  />
                )}
              />
            </View>

            <View style={[styles.formContainer, styles.row]}>
              <Text style={styles.label}>{t('Channel')}</Text>
              <TouchableOpacity
                style={styles.row}
                onPress={onPressSelectChannel}
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
            )}

            <Divider horizontalSpacing="xxl" />

            <Controller
              name="raw"
              defaultValue={oldContent}
              rules={{ required: true }}
              control={control}
              render={({ onChange, value }) => (
                <TextArea
                  value={value}
                  isKeyboardShow={isKeyboardShow}
                  inputRef={newPostRef}
                  placeholder={t('Enter a description')}
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

                    const { title } = getValues();

                    let currentPostValidity; // temp variable to get the value of existingPostIsValid or newPostIsValid helper

                    if (editTopicId || editPostId) {
                      currentPostValidity = existingPostIsValid(
                        uploadsInProgress,
                        title,
                        oldTitle,
                        text,
                        oldContent,
                        selectedChannel,
                        oldChannel,
                        selectedTags,
                        oldTags,
                      );
                      setPostValidity(currentPostValidity.isValid);
                      setEditPostType(currentPostValidity.editType);
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
                />
              )}
            />
          </>
        </KeyboardTextAreaScrollView>
      }
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
