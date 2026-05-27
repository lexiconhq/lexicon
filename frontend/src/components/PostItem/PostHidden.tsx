import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { navigateToProfileTab } from '../../helpers/navigateInProfile';
import { ActivityIndicator, Text } from '../../core-ui';
import { makeStyles } from '../../theme';

type Props = {
  style?: StyleProp<ViewStyle>;
  loading?: boolean;
  author: boolean;
  numberOfLines?: number;
  onPressViewIgnoredContent?: () => void;
};

export function PostHidden(props: Props) {
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
            {t('Your post was reported by the community. Please ')}
            <Text color="primary" onPress={() => navigateToProfileTab('Messages')}>
              {t('see your messages')}
            </Text>
            {t('.')}
          </>
        ) : (
          t('This post was reported by the community and is temporarily hidden.')
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
