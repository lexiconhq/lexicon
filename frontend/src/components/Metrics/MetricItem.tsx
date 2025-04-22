import React from 'react';

import {
  ActivityIndicator,
  IconWithLabel,
  IconWithLabelProps,
} from '../../core-ui';
import { formatCount } from '../../helpers';
import { IconName } from '../../icons';
import { makeStyles, useTheme } from '../../theme';

type Label = { singular: string; plural: string };

type MetricTypes = {
  [key: string]: { icon: IconName; label: Label };
};

const metricTypes: MetricTypes = {
  Views: { icon: 'Views', label: { singular: 'No Views', plural: 'Views' } },
  Likes: { icon: 'Likes', label: { singular: '0 Likes', plural: 'Likes' } },
  Replies: {
    icon: 'Replies',
    label: { singular: 'No Replies', plural: 'Replies' },
  },
  Thread: {
    icon: 'Replies',
    label: { singular: 'Reply', plural: 'Replies' },
  },
};

type Props = Omit<IconWithLabelProps, 'label' | 'icon'> & {
  type: keyof typeof metricTypes;
  count: number;
  isLoading?: boolean;
};

const metricLabel = (count: number, { singular, plural }: Label): string => {
  const countString = formatCount(count);

  return count === 0
    ? t('{message}', { message: singular })
    : t('{countString} {message}', {
        countString,
        message: plural,
      });
};

export function MetricItem(props: Props) {
  const styles = useStyles();
  const { colors } = useTheme();

  const {
    count,
    type,
    color = colors.textLighter,
    fontStyle,
    isLoading,
    ...otherProps
  } = props;

  const { icon, label } = metricTypes[type];

  return isLoading ? (
    <ActivityIndicator size={'small'} />
  ) : (
    <IconWithLabel
      icon={icon}
      size="m"
      label={metricLabel(count, label)}
      color={color}
      fontStyle={[styles.text, fontStyle]}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      {...otherProps}
    />
  );
}

const useStyles = makeStyles(({ colors, fontSizes }) => ({
  text: {
    color: colors.textLight,
    fontSize: fontSizes.s,
  },
}));
