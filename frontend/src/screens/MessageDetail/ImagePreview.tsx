import { useNavigation, useRoute } from '@react-navigation/native';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import {
  Alert,
  ImageBackground,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';

import { DEFAULT_IMAGE } from '../../../assets/images';
import { MentionList } from '../../components';
import { FORM_DEFAULT_VALUES } from '../../constants';
import { Icon, Text, TextInputType } from '../../core-ui';
import {
  GetMessageDetailDocument,
  UploadTypeEnum,
} from '../../generatedAPI/server';
import {
  combineDataMarkdownPollAndImageList,
  convertResultUploadIntoImageFormContext,
  convertUrl,
  createReactNativeFile,
  errorHandlerAlert,
  formatExtensions,
  imagePickerHandler,
  mentionHelper,
  useStorage,
} from '../../helpers';
import {
  useMention,
  useReplyTopic,
  useSiteSettings,
  useStatelessUpload,
} from '../../hooks';
import { makeStyles, useTheme } from '../../theme';
import {
  CursorPosition,
  NewPostForm,
  StackNavProp,
  StackRouteProp,
} from '../../types';

import { ListImageSelected, ReplyInputField } from './components';

const ios = Platform.OS === 'ios';

export default function ImagePreview() {
  const styles = useStyles();
  const { colors } = useTheme();

  const { navigate, goBack } = useNavigation<StackNavProp<'ImagePreview'>>();
  const {
    control,
    getValues,
    setValue,
    reset: resetForm,
  } = useFormContext<NewPostForm>();

  const { params } = useRoute<StackRouteProp<'ImagePreview'>>();

  const { topicId } = params;
  const {
    raw: message,
    imageMessageReplyList: imageList = [],
    polls,
  } = getValues();

  const [loading, setLoading] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({
    start: 0,
    end: 0,
  });
  const [showUserList, setShowUserList] = useState(false);
  const [mentionLoading, setMentionLoading] = useState(false);
  const [mentionKeyword, setMentionKeyword] = useState('');

  const messageRef = useRef<TextInputType>(null);

  const user = useStorage().getItem('user');

  const { authorizedExtensions } = useSiteSettings();
  const extensions = authorizedExtensions?.split('|');
  const normalizedExtensions = formatExtensions(extensions);

  const imageListUrl = imageList.map(({ url }) => url);

  const { reply } = useReplyTopic({
    onCompleted: ({ replyPost: { postNumber } }) => {
      /**
       * Add a delay before navigating to the message detail screen because after finishing the upload to Discourse, it takes time for Discourse to process the image and generate a link.
       * Here's an example of what we get without adding time:
       * {"uri": "https://uploads/default/original/1X/25d5f4828bf2c3eb2a0eedc0d4b0adca68846d52.jpeg"}
       */

      setTimeout(() => {
        resetForm(FORM_DEFAULT_VALUES);
        navigate('MessageDetail', {
          id: topicId,
          postNumber,
          emptied: true,
          hyperlinkUrl: '',
          hyperlinkTitle: '',
        });
      }, 4000);
    },
    refetchQueries(result) {
      return [
        {
          query: GetMessageDetailDocument,
          variables: {
            topicId,
            postNumber: result.data?.replyPost.postNumber,
          },
        },
      ];
    },
    onError: (error) => {
      setLoading(false);
      errorHandlerAlert(error);
    },
  });

  /**
   * Upload to discourse to get short link when add image
   */
  const { upload } = useStatelessUpload({
    onCompleted: ({ upload: result }) => {
      if (result) {
        const convertResult = convertResultUploadIntoImageFormContext(result);
        setValue('imageMessageReplyList', [...imageList, convertResult], {
          shouldDirty: true,
        });
        setLoading(false);
      }
    },
    onError: () => {
      setLoading(false);
    },
  });

  const { mentionMembers } = useMention(
    mentionKeyword,
    showUserList,
    setMentionLoading,
  );

  /**
   * Need to change handle add image later using form
   *
   */
  const onAddImage = async () => {
    try {
      let result = await imagePickerHandler(normalizedExtensions);
      if (!user || !result || !result.uri) {
        return;
      }
      const reactNativeFile = createReactNativeFile(result.uri);
      if (reactNativeFile) {
        setLoading(true);
        upload({
          variables: {
            input: {
              file: reactNativeFile,
              userId: user?.id,
              type: UploadTypeEnum.Avatar,
            },
          },
        });
      } else {
        Alert.alert(t('Failed Upload!'), t(`Please Try Again`), [
          { text: t('Got it') },
        ]);
      }
    } catch (error) {
      //empty
    }
    return;
  };

  const postToServer = (caption: string) => {
    setLoading(true);

    const updateContentWithPollAndImage = combineDataMarkdownPollAndImageList({
      content: caption,
      polls,
      imageList,
    });

    reply({
      variables: {
        replyInput: {
          topicId,
          raw: updateContentWithPollAndImage,
        },
      },
    });
  };

  /**
   * Need to change handle delete image later using form
   *
   */
  const onDeleteImage = (index: number) => {
    let newImageList = [
      ...imageList.slice(0, index),
      ...imageList.slice(index + 1),
    ];
    /**
     * Condition when there are no image in list will go back to message detail scene
     */
    if (newImageList.length === 0) {
      goBack();
    }
    setValue('imageMessageReplyList', newImageList, { shouldDirty: true });
  };

  const onPressCancel = () => {
    goBack();
  };

  const setMentionRawText = (text: string) => {
    setValue('raw', text);
  };

  const footer = (
    <View>
      <MentionList
        showUserList={showUserList}
        members={mentionMembers}
        mentionLoading={mentionLoading}
        rawText={message}
        textRef={messageRef}
        setRawText={setMentionRawText}
        setShowUserList={setShowUserList}
        viewStyle={styles.mentionList}
        fontStyle={styles.mentionText}
      />
      <View style={styles.inputContainer}>
        <Icon
          name="Add"
          color={colors.pureWhite}
          size="l"
          onPress={onAddImage}
          disabled={loading}
          style={styles.iconAdd}
        />
        <Controller
          name="raw"
          defaultValue={message}
          control={control}
          render={({ field: { onChange, value } }) => (
            <ReplyInputField
              inputRef={messageRef}
              onSelectedChange={(cursor) => {
                setCursorPosition(cursor);
              }}
              onChangeValue={(message: string) => {
                mentionHelper(
                  message,
                  cursorPosition,
                  setShowUserList,
                  setMentionLoading,
                  setMentionKeyword,
                );
                onChange(message);
              }}
              showButton
              inputPlaceholder={t('Write your caption here')}
              loading={loading}
              disabled={loading}
              onPressSend={postToServer}
              style={styles.inputField}
              message={value}
            />
          )}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style={'light'} />
      <SafeAreaView style={styles.fullContainer}>
        <View style={styles.headerContainer}>
          <Icon
            name="Close"
            color={colors.pureWhite}
            onPress={onPressCancel}
            disabled={loading}
            style={styles.iconContainer}
          />
          {polls && !!polls.length && (
            <TouchableOpacity
              style={styles.buttonPollContainer}
              onPress={() => {
                if (polls.length > 1) {
                  navigate('EditPollsList', { messageTopicId: topicId });
                } else {
                  navigate('NewPoll', {
                    prevScreen: 'ImagePreview',
                    messageTopicId: topicId,
                    pollIndex: 0,
                  });
                }
              }}
            >
              <Icon
                name="Chart"
                color={colors.pureWhite}
                style={styles.iconChart}
              />
              <Text color="pureWhite">
                {t('Poll ({total})', { total: polls.length })}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.fullContainer}>
          <ImageBackground
            source={{ uri: convertUrl(imageListUrl[0]) }}
            defaultSource={DEFAULT_IMAGE}
            resizeMode="contain"
            style={styles.imageBackground}
          />

          {!!imageListUrl.length && (
            <ListImageSelected
              imageUrls={imageListUrl}
              onDelete={onDeleteImage}
              style={styles.listImageContainer}
            />
          )}
        </View>
        <KeyboardAccessoryView
          androidAdjustResize
          inSafeAreaView
          alwaysVisible
          style={styles.inputViewContainer}
        >
          {footer}
        </KeyboardAccessoryView>
      </SafeAreaView>
    </View>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  container: {
    flexGrow: 1,
    backgroundColor: colors.pureBlack,
    paddingTop: ios ? 0 : Constants.statusBarHeight,
  },
  fullContainer: {
    flexGrow: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: spacing.l,
  },
  imageBackground: {
    flexGrow: 5,
  },

  listImageContainer: {
    marginTop: spacing.xl,
  },
  iconContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 100,
    padding: spacing.xxl,
    marginTop: spacing.m,
    marginLeft: ios ? spacing.l : spacing.xl,
  },
  buttonPollContainer: { flexDirection: 'row', alignItems: 'center' },
  iconChart: {
    marginRight: spacing.m,
  },
  inputViewContainer: {
    paddingTop: spacing.s,
    backgroundColor: 'transparent',
  },
  iconAdd: {
    marginBottom: spacing.xl,
    marginRight: spacing.m,
  },
  inputContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: spacing.xxl,
    paddingVertical: spacing.xl,
    paddingLeft: spacing.xl,
  },
  inputField: {
    marginBottom: spacing.xl,
    paddingVertical: spacing.s,
    paddingLeft: spacing.xl,
    paddingRight: spacing.s,
  },
  mentionList: {
    backgroundColor: colors.darkTransparentBackground,
  },
  mentionText: {
    color: colors.pureWhite,
  },
}));
