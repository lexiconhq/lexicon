import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import {
  Alert,
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
import { FORM_DEFAULT_VALUES } from '../constants';
import { Divider, Icon, Text, TextInputType } from '../core-ui';
import { MessageListDocument, UploadTypeEnum } from '../generatedAPI/server';
import {
  BottomMenuNavigationParams,
  BottomMenuNavigationScreens,
  bottomMenu,
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
  useStorage,
} from '../helpers';
import {
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
  const { navigate, goBack } = navigation;

  let { params } = useRoute<RootStackRouteProp<'NewMessage'>>();

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState,
    watch,
    reset: resetForm,
  } = useFormContext();

  const users: Array<string> = watch('messageTargetSelectedUsers');
  const polls: Array<PollFormContextValues> = watch('polls');

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

  const { upload, tempArray, completedToken } = useStatefulUpload(
    imagesArray,
    currentUploadToken,
  );

  const { newMessage, loading: newMessageLoading } = useNewMessage({
    onCompleted: () => {
      resetForm(FORM_DEFAULT_VALUES);
      navigate('Messages');
    },
    onError: (error) => {
      errorHandlerAlert(error);
    },
    refetchQueries: [
      {
        query: MessageListDocument,
        variables: { username },
      },
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
  } = bottomMenu({
    isKeyboardShow,
    user,
    navigate: onNavigate,
    prevScreen: 'NewMessage',
    extensions: normalizedExtensions,
  });

  useEffect(() => {
    setSelectedUsers(users);
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
        if (uploadsInProgress < 1 && (!formState.isValid || !modal)) {
          resetForm(FORM_DEFAULT_VALUES);
          return;
        }
        e.preventDefault();
        Alert.alert(
          t('Discard Message?'),
          t('Are you sure you want to discard your message?'),
          [
            { text: t('Cancel') },
            {
              text: t('Discard'),
              onPress: () => {
                resetForm(FORM_DEFAULT_VALUES);
                navigation.dispatch(e.data.action);
              },
            },
          ],
        );
      }),
    [navigation, formState.isValid, modal, uploadsInProgress, resetForm],
  );

  const sendMessage = handleSubmit(() => {
    const { title, raw } = getValues();

    const updatedContentWithPoll = combineContentWithPollContent({
      content: raw,
      polls,
    });

    setModal(false);
    newMessage({
      variables: {
        newPrivateMessageInput: {
          title,
          raw: updatedContentWithPoll,
          targetRecipients: users,
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
            disabled={newMessageLoading}
          />
        }
        right={
          <HeaderItem
            label={t('Send')}
            onPressItem={sendMessage}
            disabled={
              !formState.isValid ||
              selectedUsers.length === 0 ||
              newMessageLoading
            }
          />
        }
      />
    ) : (
      <CustomHeader
        title={t('New Message')}
        rightTitle={t('Send')}
        onPressRight={sendMessage}
        disabled={!formState.isValid || selectedUsers.length === 0}
        noShadow
        isLoading={newMessageLoading}
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
                    onChangeText={onChange}
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
              polls={polls}
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
