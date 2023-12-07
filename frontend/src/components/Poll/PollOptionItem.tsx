import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import ProgressBar from 'react-native-animated-progress';

import { makeStyles, useTheme } from '../../theme';
import { RadioButton, Text } from '../../core-ui';
import { PollChartType } from '../../generated/server';
import { StackedAvatars } from '../StackedAvatars';
import { StackAvatarUser } from '../../types';

type PollOptionItemProps = {
  option: string;
  usersVoters?: Array<StackAvatarUser>;
  percentage: number;
  selected: boolean;
  showResult: boolean;
  chartType?: PollChartType;
  onSelect?: () => void;
  style?: StyleProp<ViewStyle>;
  legendColor?: string;
  disabled?: boolean;
  onPressStackAvatar?: () => void;
};

export function PollOptionItem(props: PollOptionItemProps) {
  const styles = useStyles();
  const { colors, spacing } = useTheme();
  const {
    option,
    selected,
    onSelect,
    showResult,
    chartType,
    percentage,
    usersVoters,
    style,
    legendColor,
    disabled,
    onPressStackAvatar,
  } = props;

  return (
    <RadioButton
      selected={selected}
      onPress={() => {
        onSelect && onSelect();
      }}
      disabled={disabled}
      style={[styles.radioButton, style]}
      checkCircleIcon={true}
      inactiveOpacity={1}
    >
      <View style={styles.pollOptionContainer}>
        <Text style={styles.flex}>{option}</Text>
        {showResult && chartType && (
          <>
            <Text>{`${percentage}%`}</Text>
            {chartType === PollChartType.Pie && (
              <View
                style={[
                  styles.pieChartLegend,
                  { backgroundColor: legendColor },
                ]}
              />
            )}
          </>
        )}
      </View>
      {showResult && chartType === PollChartType.Bar && (
        <>
          <ProgressBar
            progress={percentage}
            height={spacing.s + spacing.xs}
            backgroundColor={
              disabled ? colors.lightTextDarkest : colors.primary
            }
            trackColor={colors.lightBorder}
          />
          {usersVoters && usersVoters.length > 0 && (
            <StackedAvatars
              size="xs"
              avatars={usersVoters.map(({ avatar }) => avatar)}
              style={styles.stackedAvatars}
              onPress={() => {
                onPressStackAvatar && onPressStackAvatar();
              }}
            />
          )}
        </>
      )}
    </RadioButton>
  );
}

const useStyles = makeStyles(({ spacing }) => ({
  radioButton: { paddingVertical: 0, paddingBottom: spacing.xl },
  pollOptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  flex: { flex: 1 },
  pieChartLegend: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginLeft: spacing.s + spacing.xs,
  },
  stackedAvatars: { marginTop: spacing.m },
}));
