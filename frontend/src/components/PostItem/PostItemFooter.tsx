import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { Divider } from '../../core-ui';
import { makeStyles } from '../../theme';
import { User } from '../../types';
import { AvatarRow } from '../AvatarRow';
import { Metrics, MetricsProp } from '../Metrics/Metrics';

type Props = MetricsProp & {
  frequentPosters: Array<User>;
  style?: StyleProp<ViewStyle>;
};

export function PostItemFooter(props: Props) {
  const styles = useStyles();

  const { frequentPosters, style, ...otherProps } = props;

  return (
    <View style={style}>
      <Metrics
        style={frequentPosters.length > 0 && styles.spacingBottom}
        {...otherProps}
      />
      {frequentPosters.length > 0 && (
        <>
          <Divider style={styles.spacingBottom} />
          <AvatarRow
            posters={frequentPosters}
            title={t('Top Participants')}
            titleStyle={styles.textFreqPoster}
          />
        </>
      )}
    </View>
  );
}

const useStyles = makeStyles(({ fontSizes, spacing }) => ({
  spacingBottom: {
    marginBottom: spacing.xl,
  },
  textFreqPoster: {
    fontSize: fontSizes.s,
  },
}));

export { Props as PostItemFooterProps };
