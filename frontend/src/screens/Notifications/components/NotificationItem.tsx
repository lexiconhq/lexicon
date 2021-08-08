import React, { Fragment } from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewProps,
} from 'react-native';

import { Divider, Dot, Icon, Text } from '../../../core-ui';
import { formatRelativeTime } from '../../../helpers';
import { makeStyles, useTheme } from '../../../theme';

type Props = TouchableOpacityProps &
  ViewProps & {
    name: string;
    message: string;
    createdAt: string;
    isMessage: boolean;
    seen: boolean;
  };

export default function NotificationItem(props: Props) {
  const styles = useStyles();
  const { colors } = useTheme();

  const {
    name,
    message,
    createdAt,
    isMessage = false,
    seen = false,
    ...otherProps
  } = props;

  const content = (
    <View>
      <View style={styles.header}>
        {isMessage && (
          <Icon
            name="Mail"
            size="xs"
            color={seen ? colors.textLighter : colors.primary}
            style={styles.icon}
          />
        )}
        {!isMessage && !seen && (
          <View style={styles.dotIcon}>
            <Dot />
          </View>
        )}
        <Text variant="semiBold">{name}</Text>
        <View style={styles.date}>
          <Text size="s" color="textLight">
            {formatRelativeTime(createdAt)}
          </Text>
        </View>
      </View>
      <Text color="textLight" numberOfLines={1}>
        {message}
      </Text>
    </View>
  );

  return (
    <Fragment>
      <TouchableOpacity
        style={seen ? styles.containerRead : styles.container}
        {...otherProps}
      >
        {content}
      </TouchableOpacity>
      <Divider style={styles.divider} />
    </Fragment>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  containerRead: {
    backgroundColor: colors.backgroundDarker,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xxl,
  },
  container: {
    backgroundColor: colors.background,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: spacing.m,
  },
  icon: {
    paddingRight: spacing.m,
  },
  dotIcon: {
    paddingRight: spacing.l,
  },
  date: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  divider: {
    flexGrow: 0,
  },
}));
