import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { Icon, Text } from '../../core-ui';
import { makeStyles, useTheme } from '../../theme';

type Props = {
  choice: string;
  totalOption: number;
  onEdit: () => void;
  onDelete: () => void;
  style?: StyleProp<ViewStyle>;
};

export function PollChoiceCard(props: Props) {
  const { choice, totalOption, onDelete, onEdit, style } = props;
  const { colors } = useTheme();
  const styles = useStyles();

  return (
    <View style={[styles.container, style]}>
      <Icon name="Chart" size="l" style={styles.pollIcon} />
      <View>
        <Text style={styles.textChoice}>{choice}</Text>
        <Text size="s" color="lightTextDarker">
          {t('{total} options', { total: totalOption })}
        </Text>
      </View>
      <View style={styles.iconContainer}>
        <Icon
          name="Edit"
          size="l"
          color={colors.textLighter}
          style={styles.ediIcon}
          onPress={onEdit}
        />
        <Icon
          name="Delete"
          size="l"
          color={colors.textLighter}
          onPress={onDelete}
        />
      </View>
    </View>
  );
}

const useStyles = makeStyles(({ spacing, colors }) => ({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.l,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    borderRadius: 4,
  },
  textChoice: {
    marginBottom: spacing.xs,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flex: 1,
  },
  pollIcon: {
    marginRight: spacing.m,
  },
  ediIcon: {
    marginRight: spacing.xl,
  },
}));
