import {
  CommonActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import {
  Platform,
  SafeAreaView,
  TextInput,
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
  LoadingOrError,
  MentionList,
  ModalHeader,
  TextArea,
} from '../components';
import { FORM_DEFAULT_VALUES, refetchQueriesPostDraft } from '../constants';
import { Divider, Icon, Text, TextInputType } from '../core-ui';
import {
  MessageListDocument,
  PostDraftType,
  UploadTypeEnum,
} from '../generatedAPI/server';
// import { LIST_POST_DRAFT } from '../graphql/server/postDraft';
import {
  bottomMenu,
  BottomMenuNavigationParams,
  BottomMenuNavigationScreens,
  combineContentWithPollContent,
  createReactNativeFile,
  errorHandlerAlert,
  formatExtensions,
  getHyperlink,
  getReplacedImageUploadStatus,
  insertHyperlink,
  insertImageUploadStatus,
  mentionHelper,
  onKeyPress,
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
  useNewMessage,
  useSiteSettings,
  useStatefulUpload,
} from '../hooks';
import { makeStyles, useTheme } from '../theme';
import {
  CursorPosition,
  Image,
  NewPostForm,
  PollFormContextValues,
  RootStackNavProp,
  RootStackRouteProp,
} from '../types';
import { useModal } from '../utils';

export default function NewMessage() {
  const { modal, setModal } = useModal();
  const styles = useStyles();
  const { colors, spacing } = useTheme();

  const storage = useStorage();
  const user = storage.getItem('user');

  const { authorizedExtensions } = useSiteSettings();
  const extensions = authorizedExtensions?.split('|');
  const normalizedExtensions = formatExtensions(extensions);

  const ios = Platform.OS === 'ios';

  const navigation = useNavigation<RootStackNavProp<'NewMessage'>>();
  const { navigate, goBack, dispatch } = navigation;

  let { params } = useRoute<RootStackRouteProp<'NewMessage'>>();

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { dirtyFields, isValid },
    watch,
    reset: resetForm,
  } = useFormContext<NewPostForm>();

  const users: Array<string> | undefined = watch('messageTargetSelectedUsers');
  const polls: Array<PollFormContextValues> | undefined = watch('polls');
  const { isDraft, draftKey } = getValues();

  let { hyperlinkUrl, hyperlinkTitle, imageUri } = useMemo(() => {
    return {
      hyperlinkUrl: params?.hyperlinkUrl || '',
      hyperlinkTitle: params?.hyperlinkTitle || '',
      imageUri: params?.imageUri || '',
    };
  }, [params]);

  const kasv = useKASVWorkaround();

  const [imagesArray, setImagesArray] = useState<Array<Image>>([]);
  const [selectedUsers, setSelectedUsers] = useState<Array<string>>([]);
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({
    start: 0,
    end: 0,
  });
  const [uri, setUri] = useState('');
  const [isKeyboardShow, setKeyboardShow] = useState(false);
  const [showLeftMenu, setShowLeftMenu] = useState(true);
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

  const username = storage.getItem('user')?.username ?? '';

  const navToMessages = () => {
    dispatch((state) => {
      let newRoutesFilter = state.routes.filter(
        ({ name }) => name !== 'NewMessage',
      );

      let routesMap = [...newRoutesFilter];

      /**
       * This condition is used if we edit a new message from the post draft scene.
       * When we click send, it will navigate to the message, and when we go back, it will return to the post draft.
       */

      if (
        isDraft &&
        state.routes[state.routes.length - 2].name === 'PostDraft'
      ) {
        routesMap = [
          ...routesMap,
          {
            name: 'Messages',
            key: 'messages',
          },
        ];
      }

      return CommonActions.reset({
        ...state,
        routes: routesMap,
        index: routesMap.length - 1,
      });
    });
  };

  const { upload, tempArray, completedToken } = useStatefulUpload(
    imagesArray,
    currentUploadToken,
  );

  const { newMessage, loading: newMessageLoading } = useNewMessage({
    onCompleted: () => {
      resetForm(FORM_DEFAULT_VALUES);
      navToMessages();
    },
    onError: (error) => {
      errorHandlerAlert(error);
    },
    refetchQueries: [
      {
        query: MessageListDocument,
        variables: { username },
      },
      ...(isDraft ? refetchQueriesPostDraft : []),
    ],
  });

  useEffect(() => {
    const { raw } = getValues();
    if (completedToken) {
      debounced(raw, completedToken);
    }
    setImagesArray(tempArray);
  }, [getValues, tempArray, debounced, completedToken]);

  const [showUserList, setShowUserList] = useState(false);
  const [mentionLoading, setMentionLoading] = useState(false);
  const [mentionKeyword, setMentionKeyword] = useState('');

  const newMessageRef = useRef<TextInputType>(null);

  const { mentionMembers } = useMention(
    mentionKeyword,
    showUserList,
    setMentionLoading,
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

  const { debounceSaveDraft } = useAutoSavePostDraft({
    createPostDraft,
    getValues,
    type: PostDraftType.NewPrivateMessage,
  });

  useAutoSaveManager();

  useEffect(() => {
    setModal(true);
  }, [setModal]);

  useEffect(() => {
    setUri(imageUri);
  }, [imageUri]);

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
    prevScreen: 'NewMessage',
    extensions: normalizedExtensions,
  });

  useEffect(() => {
    setSelectedUsers(users || []);
  }, [users]);

  const { length } = selectedUsers;

  if (hyperlinkUrl) {
    let { newUrl, newTitle } = getHyperlink(hyperlinkUrl, hyperlinkTitle);
    hyperlinkUrl = newUrl;
    hyperlinkTitle = newTitle;
  }

  useEffect(() => {
    let messageObject = getValues();
    let result = insertHyperlink(
      messageObject.raw,
      hyperlinkTitle,
      hyperlinkUrl,
    );
    setValue('raw', result);
  }, [hyperlinkTitle, hyperlinkUrl, getValues, setValue]);

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        if (
          uploadsInProgress < 1 &&
          ((!dirtyFields.title && !dirtyFields.raw && !dirtyFields.polls) ||
            !modal)
        ) {
          resetForm(FORM_DEFAULT_VALUES);
          return;
        }
        e.preventDefault();
        saveAndDiscardPostDraftAlert({
          deletePostDraft,
          createPostDraft,
          event: e,
          navigation,
          getValues,
          resetForm,
          draftType: PostDraftType.NewPrivateMessage,
        });
      }),
    [
      navigation,
      modal,
      uploadsInProgress,
      resetForm,
      deletePostDraft,
      createPostDraft,
      getValues,
      dirtyFields.title,
      dirtyFields.raw,
      dirtyFields.polls,
    ],
  );

  const sendMessage = handleSubmit(() => {
    const { title, raw } = getValues();

    // Make sure auto save draft not save draft when create message

    debounceSaveDraft.cancel();

    const updatedContentWithPoll = combineContentWithPollContent({
      content: raw,
      polls: polls || [],
    });

    setModal(false);
    newMessage({
      variables: {
        newPrivateMessageInput: {
          title,
          raw: updatedContentWithPoll,
          targetRecipients: users || [],
          draftKey,
        },
      },
    });
  });

  const onPressSelectUser = () => {
    navigate('SelectUser');
  };

  const setMentionValue = (text: string) => {
    setValue('raw', text);
  };

  const Header = () =>
    ios ? (
      <ModalHeader
        title={t('New Message')}
        left={
          <HeaderItem
            label={t('Cancel')}
            onPressItem={goBack}
            left
            disabled={newMessageLoading || loadingCreateAndUpdatePostDraft}
          />
        }
        right={
          <HeaderItem
            label={t('Send')}
            onPressItem={sendMessage}
            disabled={
              !isValid ||
              selectedUsers.length === 0 ||
              newMessageLoading ||
              loadingCreateAndUpdatePostDraft
            }
          />
        }
      />
    ) : (
      <CustomHeader
        title={t('New Message')}
        rightTitle={t('Send')}
        onPressRight={sendMessage}
        disabled={!isValid || selectedUsers.length === 0}
        noShadow
        isLoading={newMessageLoading || loadingCreateAndUpdatePostDraft}
      />
    );

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      {newMessageLoading ? (
        <LoadingOrError loading />
      ) : (
        <KeyboardTextAreaScrollView
          {...kasv.props}
          bottomMenu={
            <View>
              <MentionList
                showUserList={showUserList}
                members={mentionMembers}
                mentionLoading={mentionLoading}
                rawText={getValues('raw')}
                textRef={newMessageRef}
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
            <View style={styles.formContainer}>
              <Text style={styles.label}>{t('Subject')}</Text>
              <Controller
                name="title"
                defaultValue=""
                rules={{ required: true }}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[
                      styles.textInput,
                      { marginLeft: spacing.m, textAlign: 'right' },
                    ]}
                    value={value}
                    onChangeText={(text) => {
                      onChange(text);
                      debounceSaveDraft();
                    }}
                    onFocus={() => setShowLeftMenu(false)}
                    placeholder={t('What do you want to talk about?')}
                    placeholderTextColor={colors.darkTextLighter}
                    testID="NewMessage:TextInput:Title"
                    autoCorrect
                  />
                )}
              />
            </View>

            <Divider horizontalSpacing="xxl" />

            <View style={styles.formContainer}>
              <Text style={styles.label}>{t('Recipients')}</Text>
              <TouchableOpacity
                style={styles.row}
                onPress={onPressSelectUser}
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                testID="NewMessage:Button:SelectUser"
              >
                <Text
                  style={{
                    color: length ? colors.textNormal : colors.darkTextLighter,
                    paddingRight: spacing.m,
                  }}
                >
                  {length > 0
                    ? t('{users} {length}', {
                        users: selectedUsers[0],
                        length:
                          length - 1 > 0
                            ? '+' +
                              (length - 1) +
                              (length - 1 === 1 ? ' other' : ' others')
                            : '',
                      })
                    : t('Add a recipient')}
                </Text>
                <Icon name="ChevronRight" color={colors.textLighter} />
              </TouchableOpacity>
            </View>

            <Divider horizontalSpacing="xxl" />

            <ListCreatePoll
              polls={polls || []}
              setValue={setValue}
              navigate={navigate}
              prevScreen="NewMessage"
            />

            <Controller
              name="raw"
              defaultValue=""
              rules={{ required: true }}
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextArea
                  isKeyboardShow={isKeyboardShow}
                  value={value}
                  inputRef={newMessageRef}
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
                    debounced(text, currentUploadToken);
                    debounceSaveDraft();
                  }}
                  style={styles.spacingHorizontal}
                  onFocus={(event) => {
                    kasv.scrollToFocusedInput(event);
                    setKeyboardShow(true);
                    setShowLeftMenu(true);
                  }}
                  onBlur={() => {
                    setKeyboardShow(false);
                  }}
                  onSelectedChange={(cursor) => {
                    setCursorPosition(cursor);
                  }}
                  placeholder={t('Type a message')}
                  mentionToggled={showUserList}
                  testID="NewMessage:TextArea"
                />
              )}
            />
          </>
        </KeyboardTextAreaScrollView>
      )}
    </SafeAreaView>
  );
}

const useStyles = makeStyles(({ colors, fontSizes, spacing }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  formContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xxl,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: colors.textLight,
    fontSize: fontSizes.m,
  },
  textInput: {
    flex: 1,
    color: colors.textNormal,
    fontSize: fontSizes.m,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spacingHorizontal: {
    marginHorizontal: spacing.xxl,
  },
}));
