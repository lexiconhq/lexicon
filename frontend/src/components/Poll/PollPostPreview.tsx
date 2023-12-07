import React from 'react';
import { View } from 'react-native';

import { makeStyles } from '../../theme';
import { Text } from '../../core-ui';
import { PollChartType } from '../../generated/server';
import { PollOption } from '../../helpers';

import { PollOptionItem } from './PollOptionItem';

type Props = {
  options: Array<PollOption | string>;
  title?: string;
};

export function PollPostPreview(props: Props) {
  const styles = useStyles();
  const { options, title } = props;

  return (
    <View style={styles.container}>
      {title && (
        <Text variant="semiBold" style={styles.title}>
          {title}
        </Text>
      )}
      {options.map((option, index) => {
        return (
          <PollOptionItem
            key={index}
            option={typeof option === 'string' ? option : option.option}
            percentage={0}
            selected={false}
            showResult={false}
            chartType={PollChartType.Bar}
          />
        );
      })}
      <View style={styles.pollStatusContainer}>
        <Text size="xs" color="lightTextDarker" style={styles.flex}>
          {t(`Total: {number} voter`, { number: 0 })}
        </Text>
        <Text size="xs" color="lightTextDarker">
          {t('Poll Open')}
        </Text>
      </View>
    </View>
  );
}

const useStyles = makeStyles(({ spacing }) => ({
  flex: { flex: 1 },
  container: { marginTop: spacing.xl },
  title: { marginBottom: spacing.l },
  pollStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.s,
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
}));
