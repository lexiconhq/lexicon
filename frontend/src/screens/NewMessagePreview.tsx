import React, { useEffect, useState } from 'react';
import { Platform, SafeAreaView, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';

import {
  AvatarRow,
  CustomHeader,
  HeaderItem,
  ModalHeader,
} from '../components';
import { ChatBubble } from '../core-ui';
import { MESSAGE } from '../graphql/server/message';
import {
  errorHandlerAlert,
  getPostShortUrl,
  handleUnsupportedMarkdown,
  sortImageUrl,
  useStorage,
  generateMarkdownContent,
} from '../helpers';
import { useLookupUrls, useNewMessage } from '../hooks';
import { makeStyles } from '../theme';
import { RootStackRouteProp, RootStackNavProp } from '../types';
import { useModal } from '../utils';

const ios = Platform.OS === 'ios';

export default function NewMessagePreview() {
  const { setModal } = useModal();
  const styles = useStyles();

  const navigation = useNavigation<RootStackNavProp<'NewMessagePreview'>>();
  const { navigate, goBack } = navigation;

  const {
    params: { title, raw, targetRecipients, userList },
  } = useRoute<RootStackRouteProp<'NewMessagePreview'>>();

  const storage = useStorage();
  const username = storage.getItem('user')?.username ?? '';

  const [imageUrls, setImageUrls] = useState<Array<string>>();

  const shortUrls = getPostShortUrl(raw) ?? [];

  const { getImageUrls } = useLookupUrls({
    variables: { shortUrls },
    onCompleted: ({ lookupUrls }) => {
      setImageUrls(sortImageUrl(shortUrls, lookupUrls));
    },
  });

  const { newMessage, loading } = useNewMessage({
    onCompleted: () => {
      navigate('Main', { screen: 'Messages' });
    },
    onError: (error) => {
      errorHandlerAlert(error);
    },
    refetchQueries: [
      {
        query: MESSAGE,
        variables: { username },
      },
    ],
  });

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

  const sendMessage = () => {
    setModal(false);
    newMessage({
      variables: {
        newPrivateMessageInput: {
          title,
          raw,
          targetRecipients,
        },
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        title={t('Preview')}
        rightIcon="Send"
        onPressRight={sendMessage}
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
              label={t('Send')}
              onPressItem={sendMessage}
              loading={loading}
            />
          }
        />
      )}

      <AvatarRow
        title={title}
        posters={userList}
        style={styles.participants}
        extended
      />
      <ScrollView>
        <View style={styles.contentContainer}>
          <ChatBubble
            message={t('{message}', {
              message: handleUnsupportedMarkdown(
                generateMarkdownContent(raw, imageUrls),
              ),
            })}
            bgColor={'primary'}
            nonClickable={true}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const useStyles = makeStyles(({ colors, shadow, spacing }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingHorizontal: spacing.xxl,
    paddingTop: ios ? spacing.xl : spacing.xxl,
    flexDirection: 'row-reverse',
    paddingRight: 88,
  },
  participants: {
    backgroundColor: colors.background,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xxl,
    ...shadow,
  },
}));
