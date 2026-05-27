import { useRoute } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import React from 'react';
import { ScrollView, View } from 'react-native';

import { CustomHeader } from '../../components';
import {
  ACCOUNT_PREFERENCES_URL,
  ADDITIONAL_RESOURCES,
} from '../../constants/accountResources';
import { Button, Text } from '../../core-ui';
import { makeStyles } from '../../theme';
import { StackRouteProp } from '../../types';

export default function AdditionalResourceDetail() {
  const styles = useStyles();
  const {
    params: { resourceType },
  } = useRoute<StackRouteProp<'AdditionalResourceDetail'>>();

  const resource = ADDITIONAL_RESOURCES[resourceType];

  const openAccountPreferences = () => {
    Linking.openURL(ACCOUNT_PREFERENCES_URL);
  };

  return (
    <View style={styles.container}>
      <CustomHeader title={resource.title()} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.card}>
          <Text style={styles.message}>{resource.message()}</Text>
          <View style={styles.stepsBox}>
            <Text variant="semiBold" size="m" style={styles.stepsLabel}>
              {t('On the website')}
            </Text>
            <Text color="textNormal" style={styles.steps}>
              {resource.steps()}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text color="textLight" style={styles.linkLabel}>
            {t('Account preferences')}
          </Text>
          <Text
            color="primary"
            style={styles.link}
            onPress={openAccountPreferences}
          >
            {ACCOUNT_PREFERENCES_URL}
          </Text>
          <Button
            content={t('Open account preferences')}
            onPress={openAccountPreferences}
            style={styles.button}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDarker,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    marginBottom: spacing.l,
  },
  message: {
    lineHeight: 22,
    color: colors.textNormal,
  },
  stepsBox: {
    marginTop: spacing.l,
    paddingTop: spacing.l,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  stepsLabel: {
    marginBottom: spacing.s,
  },
  steps: {
    lineHeight: 22,
  },
  linkLabel: {
    marginBottom: spacing.s,
    fontSize: 14,
  },
  link: {
    lineHeight: 20,
    marginBottom: spacing.l,
  },
  button: {
    alignSelf: 'stretch',
  },
}));
