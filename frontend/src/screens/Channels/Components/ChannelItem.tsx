import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { Text } from '../../../core-ui';
import { makeStyles } from '../../../theme';
import { Channel } from '../../../types';

type Props = {
  isSelected: boolean;
  channel: Channel;
  onPress: () => void;
};

export default function ChannelItem(props: Props) {
  const styles = useStyles();

  const { isSelected, channel, onPress } = props;
  const { id, color, name, description } = channel;
  const backgroundColor = `#${color}`;

  return (
    <View key={id}>
      <TouchableOpacity
        style={[styles.channelTouchable, isSelected && styles.selectedChannel]}
        onPress={onPress}
      >
        <View style={[styles.channelSide, isSelected && { backgroundColor }]} />
        <View style={styles.channelContentContainer}>
          <View style={styles.channelLabelContainer}>
            <View style={[styles.channelLabel, { backgroundColor }]} />
          </View>
          <View style={styles.channelTextContainer}>
            <View style={styles.channelNameContainer}>
              <Text style={styles.channelName}>{name}</Text>
            </View>
            <View style={styles.channelDescriptionContainer}>
              <Text style={styles.channelDescription}>{description || ''}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
      </View>
    </View>
  );
}

const useStyles = makeStyles(
  ({ colors, fontSizes, fontVariants, spacing }) => ({
    channelTouchable: {
      flexDirection: 'row',
    },
    channelContentContainer: {
      flex: 0.95,
      paddingRight: spacing.xl,
      flexDirection: 'row',
    },
    channelTextContainer: {
      paddingRight: spacing.xl,
    },
    channelNameContainer: {
      marginVertical: spacing.m,
    },
    channelDescriptionContainer: {
      marginBottom: spacing.l,
    },
    channelLabelContainer: {
      marginTop: spacing.m,
    },
    dividerContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
    channelName: {
      fontSize: fontSizes.m,
      ...fontVariants.bold,
      color: colors.textNormal,
    },
    channelDescription: {
      fontSize: fontSizes.s,
      color: colors.textLight,
    },
    channelLabel: {
      marginTop: spacing.s,
      marginLeft: spacing.xl,
      marginRight: spacing.m,
      height: 10,
      width: 10,
      borderRadius: 50,
    },
    channelSide: {
      width: 4,
      backgroundColor: colors.background,
    },
    divider: {
      flex: 0.9,
      height: 1,
      backgroundColor: colors.border,
    },
    selectedChannel: {
      backgroundColor: colors.backgroundDarker,
    },
  }),
);
