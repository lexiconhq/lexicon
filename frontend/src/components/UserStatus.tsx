import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { makeStyles, useTheme } from '../theme';
import { Emoji, Icon, Text } from '../core-ui';

type Props = {
  emojiCode: string;
  status: string;
  showEditIcon?: boolean;
  onPressIcon?: () => void;
  styleContainer?: StyleProp<ViewStyle>;
};

export function UserStatus(props: Props) {
  const styles = useStyles();
  const { colors } = useTheme();

  const { emojiCode, status, showEditIcon, onPressIcon, styleContainer } =
    props;

  return (
    <View style={[styles.container, styleContainer]}>
      <Emoji style={styles.emoji} emojiCode={emojiCode} disableOnPress />
      <Text style={styles.statusText} color="lightTextDarker">
        {status.length > 15 ? `${status.slice(0, 15)}...` : status}
      </Text>
      {showEditIcon && (
        <Icon name="Edit" onPress={onPressIcon} color={colors.textLighter} />
      )}
    </View>
  );
}

const useStyles = makeStyles(({ spacing }) => ({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emoji: {
    marginRight: spacing.s,
  },
  statusText: {
    marginRight: spacing.s,
  },
}));
