import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/core';

import { ActivityIndicator, Text } from '../../core-ui';
import { makeStyles } from '../../theme';
import { StackNavProp } from '../../types';

type Props = {
  style?: StyleProp<ViewStyle>;
  loading?: boolean;
  author: boolean;
  numberOfLines?: number;
  onPressViewIgnoredContent?: () => void;
};

export function PostHidden(props: Props) {
  const { navigate } = useNavigation<StackNavProp<'PostDetail'>>();
  const styles = useStyles();

  const { style, loading, author, numberOfLines, onPressViewIgnoredContent } =
    props;

  return loading ? (
    <ActivityIndicator style={styles.spacingBottom} />
  ) : (
    <View style={style}>
      <Text style={styles.spacingBottom} color="textLight">
        {author ? (
          <>
            {t('Your post was flagged by the community. Please ')}
            <Text color="primary" onPress={() => navigate('Messages')}>
              {t('see your messages')}
            </Text>
            {t('.')}
          </>
        ) : (
          t('This post was flagged by the community and is temporarily hidden.')
        )}
      </Text>
      <Text
        style={styles.spacingBottom}
        numberOfLines={numberOfLines}
        color="primary"
        onPress={onPressViewIgnoredContent}
      >
        {t('View ignored content.')}
      </Text>
    </View>
  );
}

const useStyles = makeStyles(({ spacing }) => ({
  spacingBottom: {
    marginBottom: spacing.m,
  },
}));
