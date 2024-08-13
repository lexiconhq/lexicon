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
    seen: boolean;
    type: number;
  };

export default function NotificationItem(props: Props) {
  const styles = useStyles();
  const { colors } = useTheme();

  const { name, message, createdAt, seen = false, type, ...otherProps } = props;
  const isMessage = type === 6 || type === 7;
  const isUpdate = type === 36;
  const hasIcon = isMessage || isUpdate;

  const content = (
    <View>
      <View style={styles.header}>
        {hasIcon && (
          <Icon
            name={isMessage ? 'Mail' : 'Notifications'}
            size="xs"
            color={seen ? colors.textLighter : colors.primary}
            style={styles.icon}
          />
        )}
        {!hasIcon && !seen && (
          <View style={styles.dotIcon}>
            <Dot />
          </View>
        )}
        <Text variant="semiBold" numberOfLines={1} style={styles.flex}>{`${
          isUpdate ? 'New Topic by ' : ''
        }${name}`}</Text>
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
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginLeft: 4,
  },
  divider: {
    flexGrow: 0,
  },
  flex: { flex: 1 },
}));
