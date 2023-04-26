import React, { useRef } from 'react';
import { Platform, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Controller, useForm } from 'react-hook-form';

import { CustomHeader, HeaderItem, ModalHeader } from '../components';
import { TextInput, TextInputType } from '../core-ui';
import { makeStyles } from '../theme';
import { RootStackNavProp, RootStackRouteProp } from '../types';

type HyperlinkForm = {
  url: string;
  title: string;
};

export default function Hyperlink() {
  const styles = useStyles();

  const { navigate, goBack } = useNavigation<RootStackNavProp<'HyperLink'>>();

  const {
    params: { prevScreen, title, id, replyToPostId, postNumber },
  } = useRoute<RootStackRouteProp<'HyperLink'>>();

  const { control, errors, formState, getValues } = useForm<HyperlinkForm>({
    mode: 'onChange',
  });

  const titleInputRef = useRef<TextInputType>(null);

  const ios = Platform.OS === 'ios';

  const onPressAdd = () => {
    const { url: hyperlinkUrl, title: hyperlinkTitle } = getValues();
    if (prevScreen === 'NewPost' || prevScreen === 'NewMessage') {
      navigate(prevScreen, {
        hyperlinkUrl,
        hyperlinkTitle,
      });
    } else if (prevScreen === 'PostReply') {
      if (title && id) {
        navigate(prevScreen, {
          title,
          topicId: id,
          replyToPostId,
          hyperlinkUrl,
          hyperlinkTitle,
        });
      }
    } else if (prevScreen === 'MessageDetail') {
      if (id && postNumber) {
        navigate('Main', {
          screen: prevScreen,
          params: {
            id,
            postNumber,
            emptied: false,
            hyperlinkUrl,
            hyperlinkTitle,
          },
        });
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {ios ? (
        <ModalHeader
          title={t('Insert Hyperlink')}
          left={<HeaderItem label={t('Cancel')} onPressItem={goBack} left />}
          right={
            <HeaderItem
              label={t('Add')}
              onPressItem={onPressAdd}
              disabled={!formState.isValid}
            />
          }
        />
      ) : (
        <CustomHeader
          title={t('Insert Hyperlink')}
          rightTitle={t('Add')}
          onPressRight={onPressAdd}
          disabled={!formState.isValid}
          noShadow
        />
      )}
      <ScrollView style={styles.inputContainer}>
        <Controller
          name="url"
          defaultValue=""
          rules={{ required: true }}
          control={control}
          render={({ value, onChange, onBlur }) => (
            <TextInput
              label={t('URL')}
              placeholder={t('Insert URL')}
              error={errors.url != null}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              returnKeyType="next"
              onSubmitEditing={() => titleInputRef.current?.focus()}
              autoCapitalize="none"
              style={styles.spacingBottom}
            />
          )}
        />
        <Controller
          name="title"
          defaultValue=""
          control={control}
          render={({ value, onChange, onBlur }) => (
            <TextInput
              inputRef={titleInputRef}
              label={t('Title (Optional)')}
              placeholder={t('Insert Title')}
              error={errors.title != null}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="none"
              style={styles.spacingBottom}
            />
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inputContainer: {
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.xxl,
  },
  spacingBottom: {
    paddingBottom: spacing.xxl,
  },
}));
