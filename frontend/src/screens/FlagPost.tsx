import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Platform, ScrollView, View } from 'react-native';

import {
  CustomHeader,
  HeaderItem,
  KeyboardTextAreaScrollView,
  ModalHeader,
} from '../components';
import { Button, Divider, RadioButton, Text, TextInput } from '../core-ui';
import {
  errorHandlerAlert,
  flagTypeRequiresMessage,
  findFlagTypeById,
  LoginError,
  normalizeFlagTypeId,
  NOTIFY_MODERATORS_FLAG_ID,
  NOTIFY_USER_FLAG_ID,
  useStorage,
} from '../helpers';
import { useFlagPost, useSiteSettings } from '../hooks';
import { makeStyles } from '../theme';
import { RootStackNavProp, RootStackRouteProp } from '../types';

const htmlRegex = /(<([^>]+)>)/gi;

export default function FlagPost() {
  const styles = useStyles();
  const storage = useStorage();
  const currentUserId = storage.getItem('user')?.id;

  const { topicFlagTypes = [], postActionTypes = [] } = useSiteSettings();

  const ios = Platform.OS === 'ios';

  const notifyModeratorsFlag = useMemo(
    () =>
      findFlagTypeById(topicFlagTypes, NOTIFY_MODERATORS_FLAG_ID) ??
      findFlagTypeById(postActionTypes, NOTIFY_MODERATORS_FLAG_ID),
    [postActionTypes, topicFlagTypes],
  );

  const messageAuthorFlag = useMemo(
    () => findFlagTypeById(postActionTypes, NOTIFY_USER_FLAG_ID),
    [postActionTypes],
  );

  const { goBack } = useNavigation<RootStackNavProp<'FlagPost'>>();
  const navigation = useNavigation<RootStackNavProp<'FlagPost'>>();

  const {
    params: { postId, topicId, isPost = false, flaggedAuthor },
  } = useRoute<RootStackRouteProp<'FlagPost'>>();

  const [checked, setChecked] = useState<number>();
  const [flagMessage, setFlagMessage] = useState<string>();

  useEffect(() => {
    if (!currentUserId) {
      errorHandlerAlert(LoginError, navigation.navigate);
      goBack();
    }
  }, [currentUserId, goBack, navigation.navigate]);

  const selectedFlagId = checked != null ? normalizeFlagTypeId(checked) : undefined;
  const requiresMessage =
    selectedFlagId != null &&
    flagTypeRequiresMessage(
      selectedFlagId,
      isPost,
      topicFlagTypes,
      postActionTypes,
    );

  const isNotifyModeratorsSelected =
    selectedFlagId === NOTIFY_MODERATORS_FLAG_ID;
  const isMessageAuthorSelected = selectedFlagId === NOTIFY_USER_FLAG_ID;

  const { flag, loading } = useFlagPost({
    onCompleted: () => {
      Alert.alert(
        t('Your report was submitted'),
        t('Moderators will review it. Thank you for helping keep the community safe.'),
        [
          {
            text: t('Got it'),
            onPress: goBack,
          },
        ],
        { onDismiss: goBack },
      );
    },
  });

  const onSubmit = () => {
    if (!checked || !currentUserId) {
      return;
    }

    if (requiresMessage && !flagMessage?.trim()) {
      Alert.alert(
        t('Message required'),
        t('Please add details so moderators can understand your report.'),
        [{ text: t('Got it') }],
      );
      return;
    }

    flag({
      variables: {
        flagPostInput: {
          id: isPost ? topicId : postId,
          postActionTypeId: normalizeFlagTypeId(checked),
          message: flagMessage?.trim() || undefined,
          flagTopic: isPost,
        },
      },
    });
  };

  const flagOptions = isPost
    ? topicFlagTypes
    : postActionTypes.filter((flagType) => flagType.isFlag === true);

  if (!currentUserId) {
    return null;
  }

  return (
    <View style={styles.container}>
      {ios ? (
        <ModalHeader
          title={t('Report')}
          left={<HeaderItem left label={t('Cancel')} onPressItem={goBack} />}
          right={
            <HeaderItem
              label={t('Submit')}
              onPressItem={onSubmit}
              disabled={!checked || loading}
              loading={loading}
            />
          }
        />
      ) : (
        <CustomHeader title={t('Report')} noShadow />
      )}
      <KeyboardTextAreaScrollView>
        <View style={styles.textContainer}>
          <Text>
            {isPost
              ? t('Please tell us why you are reporting this post.')
              : t('Please tell us why you are reporting this comment.')}
          </Text>
        </View>
        <ScrollView contentContainerStyle={styles.radioGroup}>
          {flagOptions.length === 0 ? (
            <Text color="lightTextDarker">
              {t('Reporting is not available right now. Please try again later.')}
            </Text>
          ) : (
            flagOptions.map(({ id, name, description }) => (
              <View key={id}>
                <RadioButton
                  selected={checked === id}
                  onPress={() => setChecked(id)}
                  disabled={loading}
                  checkCircleIcon
                >
                  <Text style={styles.headerText} variant="bold">
                    {isPost
                      ? name
                      : name.replace('@%{username}', `${flaggedAuthor ?? ''}`)}
                  </Text>
                  {(isNotifyModeratorsSelected || isMessageAuthorSelected) &&
                  checked === id ? (
                    <TextInput
                      placeholder={t(
                        'Describe the issue and include links or examples when possible',
                      )}
                      multiline={true}
                      onChangeText={(text) => {
                        setFlagMessage(text);
                      }}
                    />
                  ) : (
                    <Text>{description.replace(htmlRegex, '')}</Text>
                  )}
                </RadioButton>
                <Divider />
              </View>
            ))
          )}
        </ScrollView>
        {!ios && (
          <Button
            content={t('Submit report')}
            style={styles.submitButton}
            onPress={onSubmit}
            loading={loading}
            disabled={!checked || flagOptions.length === 0}
            large
          />
        )}
      </KeyboardTextAreaScrollView>
    </View>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  textContainer: {
    marginTop: spacing.m,
    paddingHorizontal: spacing.xxl,
  },
  submitButton: {
    marginBottom: spacing.xl,
    marginHorizontal: spacing.xxl,
  },
  radioGroup: {
    flex: 1,
    paddingHorizontal: spacing.xxl,
  },
  headerText: {
    marginBottom: spacing.m,
  },
}));
