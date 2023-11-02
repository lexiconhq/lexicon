import React, { useState } from 'react';
import { Alert, Platform, ScrollView, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import {
  CustomHeader,
  HeaderItem,
  KeyboardTextAreaScrollView,
  ModalHeader,
} from '../components';
import { Button, Divider, RadioButton, Text, TextInput } from '../core-ui';
import { useFlagPost, useSiteSettings } from '../hooks';
import { makeStyles } from '../theme';
import { RootStackNavProp, RootStackRouteProp } from '../types';

const htmlRegex = /(<([^>]+)>)/gi;

export default function FlagPost() {
  const styles = useStyles();

  const { topicFlagTypes = [], postActionTypes = [] } = useSiteSettings();

  const ios = Platform.OS === 'ios';

  const FLAG_NOTIFY_MODERATORS = 7;
  const FLAG_NOTIFY_USERS = 6;

  const notifyModeratorsFlag = topicFlagTypes.find(
    (flag) => flag.id === FLAG_NOTIFY_MODERATORS,
  );

  const messageAuthorFlag = postActionTypes.find(
    (flag) => flag.id === FLAG_NOTIFY_USERS,
  );

  const { goBack } = useNavigation<RootStackNavProp<'FlagPost'>>();

  const {
    params: { postId, isPost, flaggedAuthor },
  } = useRoute<RootStackRouteProp<'FlagPost'>>();

  const [checked, setChecked] = useState<number>();
  const [flagMessage, setFlagMessage] = useState<string>();

  const isNotifyModeratorsSelected = checked === notifyModeratorsFlag?.id;
  const isMessageAuthorSelected = checked === messageAuthorFlag?.id;

  const { flag, loading } = useFlagPost({
    onCompleted: () => {
      Alert.alert(
        t('The post has been flagged successfully'),
        t('Please wait until the admin process the request'),
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
    if (checked) {
      flag({
        variables: {
          postId: postId,
          postAction: checked,
          message: flagMessage,
        },
      });
    }
  };

  return (
    <View style={styles.container}>
      {ios ? (
        <ModalHeader
          title={t('Flag')}
          left={<HeaderItem left label={t('Cancel')} onPressItem={goBack} />}
          right={
            <HeaderItem
              label={t('Report')}
              onPressItem={onSubmit}
              disabled={!checked}
              loading={loading}
            />
          }
        />
      ) : (
        <CustomHeader title={t('Flag')} noShadow />
      )}
      <KeyboardTextAreaScrollView>
        <View style={styles.textContainer}>
          <Text>{t('Please tell us why you want to flag this post.')}</Text>
        </View>
        <ScrollView contentContainerStyle={styles.radioGroup}>
          {isPost
            ? topicFlagTypes.map(({ id, name, description }) => (
                <View key={id}>
                  <RadioButton
                    selected={checked === id}
                    onPress={() => setChecked(id)}
                    disabled={loading}
                    checkCircleIcon
                  >
                    <Text style={styles.headerText} variant="bold">
                      {name}
                    </Text>
                    {isNotifyModeratorsSelected && checked === id ? (
                      <TextInput
                        placeholder={t(
                          'Let the author know specifically what are you concerned about, and provide relevant links and examples where possible',
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
            : postActionTypes
                .filter((flagType) => {
                  return flagType.isFlag === true;
                })
                .map(({ id, name, description }) => (
                  <View key={id}>
                    <RadioButton
                      selected={checked === id}
                      onPress={() => setChecked(id)}
                      disabled={loading}
                      checkCircleIcon
                    >
                      <Text style={styles.headerText} variant="bold">
                        {name.replace('@%{username}', `${flaggedAuthor}`)}
                      </Text>
                      {(isNotifyModeratorsSelected ||
                        isMessageAuthorSelected) &&
                      checked === id ? (
                        <TextInput
                          placeholder={t(
                            'Let the author know specifically what are you concerned about, and provide relevant links and examples where possible',
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
                ))}
        </ScrollView>
        {!ios && (
          <Button
            content={t('Flag Post')}
            style={styles.submitButton}
            onPress={onSubmit}
            loading={loading}
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
