import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Platform,
  SafeAreaView,
  TextInput,
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
import { Divider, Icon, Text, TextInputType } from '../core-ui';
import { UploadTypeEnum } from '../generated/server';
import {
  bottomMenu,
  createReactNativeFile,
  formatExtensions,
  getHyperlink,
  getImage,
  insertHyperlink,
  mentionHelper,
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
  UserMessageProps,
} from '../types';
import { useModal } from '../utils';

type Form = {
  title: string;
  raw: string;
};

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

  let {
    params: {
      users = [],
      listOfUser = [],
      hyperlinkTitle = '',
      hyperlinkUrl,
      imageUri = '',
    },
  } = useRoute<RootStackRouteProp<'NewMessage'>>();

  const { control, handleSubmit, setValue, getValues, formState } =
    useForm<Form>({ mode: 'onChange' });

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
      reformatMarkdownAfterUpload(value, imagesArray, token, setValue);
    }
  }, 1500);

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
        if (uploadsInProgress < 1 || !formState.isValid || !modal) {
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
              onPress: () => navigation.dispatch(e.data.action),
            },
          ],
        );
      }),
    [navigation, formState.isValid, modal, uploadsInProgress],
  );

  const onFinishComposingMessage = handleSubmit(({ title, raw }) => {
    const userList: Array<UserMessageProps> = [];
    let index = 0;
    listOfUser.forEach(({ username, avatar, name }) => {
      userList.push({
        id: index++,
        username: username,
        avatar: getImage(avatar),
        name: name,
      });
    });
    navigate('NewMessagePreview', {
      raw,
      targetRecipients: selectedUsers,
      userList,
      title,
    });
  });

  const onPressSelectUser = () => {
    navigate('SelectUser', { users, listOfUser });
  };

  const Header = () =>
    ios ? (
      <ModalHeader
        title={t('New Message')}
        left={<HeaderItem label={t('Cancel')} onPressItem={goBack} left />}
        right={
          <HeaderItem
            label={t('Next')}
            onPressItem={onFinishComposingMessage}
            disabled={!formState.isValid || selectedUsers.length === 0}
          />
        }
      />
    ) : (
      <CustomHeader
        title={t('New Message')}
        rightTitle={t('Next')}
        onPressRight={onFinishComposingMessage}
        disabled={!formState.isValid || selectedUsers.length === 0}
        noShadow
      />
    );

  return (
    <SafeAreaView style={styles.container}>
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
              textRef={newMessageRef}
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
          <View style={styles.formContainer}>
            <Text style={styles.label}>{t('Subject')}</Text>
            <Controller
              name="title"
              defaultValue=""
              rules={{ required: true }}
              control={control}
              render={({ onChange, value }) => (
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

          <Controller
            name="raw"
            defaultValue=""
            rules={{ required: true }}
            control={control}
            render={({ onChange, value }) => (
              <TextArea
                isKeyboardShow={isKeyboardShow}
                value={value}
                inputRef={newMessageRef}
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
              />
            )}
          />
        </>
      </KeyboardTextAreaScrollView>
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
