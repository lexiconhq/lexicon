import React, { useRef, useState } from 'react';
import { ImageBackground, Platform, SafeAreaView, View } from 'react-native';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import { useNavigation, useRoute } from '@react-navigation/native';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';

import { MentionList } from '../../components';
import { Icon, TextInputType } from '../../core-ui';
import { UploadTypeEnum } from '../../generated/server';
import {
  createReactNativeFile,
  errorHandlerAlert,
  mentionHelper,
  useStorage,
} from '../../helpers';
import { useMention, useReplyPost } from '../../hooks';
import { makeStyles, useTheme } from '../../theme';
import { CursorPosition, StackNavProp, StackRouteProp } from '../../types';

import { ReplyInputField } from './components';

const ios = Platform.OS === 'ios';

export default function ImagePreview() {
  const styles = useStyles();
  const { colors } = useTheme();

  const { navigate, goBack } = useNavigation<StackNavProp<'ImagePreview'>>();

  const { params } = useRoute<StackRouteProp<'ImagePreview'>>();
  const { topicId, imageUri, message } = params;

  const [loading, setLoading] = useState(false);
  const [imageMessage, setImageMessage] = useState(message);
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({
    start: 0,
    end: 0,
  });
  const [showUserList, setShowUserList] = useState(false);
  const [mentionLoading, setMentionLoading] = useState(false);
  const [mentionKeyword, setMentionKeyword] = useState('');

  const messageRef = useRef<TextInputType>(null);

  const user = useStorage().getItem('user');

  const { reply } = useReplyPost({
    onCompleted: ({ reply: { postNumber } }) => {
      navigate('MessageDetail', {
        id: topicId,
        postNumber,
        emptied: true,
        hyperlinkUrl: '',
        hyperlinkTitle: '',
      });
    },
    onError: (error) => {
      setLoading(false);
      errorHandlerAlert(error);
    },
  });

  const { mentionMembers } = useMention(
    mentionKeyword,
    showUserList,
    setMentionLoading,
  );

  const reactNativeFile = createReactNativeFile(imageUri);

  const postToServer = (caption: string) => {
    setLoading(true);
    reply({
      variables: {
        replyInput: {
          topicId,
          raw: caption,
        },
        file: reactNativeFile,
        userId: user?.id,
        type: UploadTypeEnum.Composer,
      },
    });
  };

  const onPressCancel = () => {
    goBack();
  };

  const footer = (
    <View>
      <MentionList
        showUserList={showUserList}
        members={mentionMembers}
        mentionLoading={mentionLoading}
        rawText={imageMessage}
        textRef={messageRef}
        setRawText={setImageMessage}
        setShowUserList={setShowUserList}
        viewStyle={styles.mentionList}
        fontStyle={styles.mentionText}
      />
      <View style={styles.inputContainer}>
        <ReplyInputField
          inputRef={messageRef}
          onSelectedChange={(cursor) => {
            setCursorPosition(cursor);
          }}
          onChangeValue={(imageMessage: string) => {
            mentionHelper(
              imageMessage,
              cursorPosition,
              setShowUserList,
              setMentionLoading,
              setMentionKeyword,
            );
            setImageMessage(imageMessage);
          }}
          showButton
          inputPlaceholder={t('Write your caption here')}
          loading={loading}
          disabled={loading}
          onPressSend={postToServer}
          style={styles.inputField}
          message={imageMessage}
          setMessage={setImageMessage}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style={'light'} />
      <SafeAreaView style={styles.fullContainer}>
        <ImageBackground
          source={{ uri: imageUri }}
          resizeMode="contain"
          style={styles.fullContainer}
        >
          <Icon
            name="Close"
            color={colors.pureWhite}
            onPress={onPressCancel}
            disabled={loading}
            style={styles.iconContainer}
          />
        </ImageBackground>
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
  inputViewContainer: {
    paddingTop: spacing.s,
    backgroundColor: 'transparent',
  },
  inputContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xl,
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
