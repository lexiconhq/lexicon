import React, { memo } from 'react';
import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';

import { getDistanceToNow, getPollChoiceLabel } from '../../../helpers';
import { makeStyles, useTheme } from '../../../theme';
import { Poll } from '../../../types';
import { PollStatus } from '../../../generated/server';
import { Divider, Icon, Text } from '../../../core-ui';

type Props = {
  noBorder?: boolean;
  poll: Poll;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
};

const PollChatBubble = memo((props: Props) => {
  const styles = useStyles();
  const { colors } = useTheme();

  const { noBorder = false, style, poll, onPress } = props;

  const isClosed =
    poll.status === PollStatus.Closed ||
    (poll.close && new Date(poll.close) < new Date());

  return (
    <TouchableOpacity
      style={[styles.container, !noBorder && styles.border, style]}
      onPress={onPress}
    >
      <View style={styles.rowContainer}>
        <View style={[styles.rowCenter, styles.flex]}>
          <Icon name="Chart" size="l" style={styles.pollIcon} />
          <Text numberOfLines={2} style={styles.flex}>
            {getPollChoiceLabel({
              title: poll.title ?? undefined,
              pollType: poll.type,
            })}
          </Text>
        </View>
        <Icon name="ChevronRight" size="l" color={colors.textLighter} />
      </View>
      <Divider style={styles.divider} />
      <View style={styles.rowContainer}>
        <Text color="lightTextDarker">
          {poll.voters > 1
            ? t(`{number} votes`, { number: poll.voters })
            : t(`{number} vote`, { number: poll.voters })}
        </Text>
        {isClosed ? (
          <View style={styles.rowCenter}>
            <Icon
              name="Lock"
              size="xxs"
              color={colors.lightTextDarker}
              style={styles.pollClosedIcon}
            />
            <Text size="xs" color="lightTextDarker">
              {t('Poll Closed')}
            </Text>
          </View>
        ) : poll?.close ? (
          <View style={styles.rowCenter}>
            <Icon name="Clock" size="xxs" style={styles.pollClosedIcon} />
            <Text size="xs" color="primary">
              {t(`Poll closed in {duration}`, {
                duration: getDistanceToNow(poll.close),
              })}
            </Text>
          </View>
        ) : (
          <Text size="xs" color="lightTextDarker">
            {t('Poll Open')}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
});

export { PollChatBubble };

const useStyles = makeStyles(({ colors, spacing }) => ({
  container: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.l,
    paddingBottom: spacing.l,
    borderRadius: 18,
    width: 251,
    backgroundColor: colors.background,
  },
  border: {
    borderColor: colors.border,
    borderWidth: 1,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pollIcon: { marginRight: spacing.m },
  divider: { marginVertical: spacing.l },
  pollClosedIcon: { marginRight: spacing.s },
  flex: { flex: 1 },
}));
