import React from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';

import { Text } from '../../../core-ui';
import { makeStyles } from '../../../theme';
import { Channel } from '../../../types';

type Props = {
  isSelected: boolean;
  channel: Channel;
  onPress: () => void;
  isSidebar?: boolean;
};

export default function ChannelItem(props: Props) {
  const styles = useStyles();

  const { isSelected, channel, onPress, isSidebar } = props;
  const { id, color, name, description } = channel;
  const backgroundColor = `#${color}`;
  const ios = Platform.OS === 'ios';
  const styleSelected = {
    title: isSidebar
      ? ios
        ? styles.selectedChannelNameSideBarIos
        : styles.selectedChannelNameSideBarAndroid
      : {},
    background: isSidebar
      ? ios
        ? styles.selectedChannelSideBarIos
        : styles.selectedChannelSideBarAndroid
      : styles.selectedChannel,
    label: isSidebar
      ? ios
        ? styles.selectedChannelLabelSideBarIos
        : styles.selectedChannelLabelSideBarAndroid
      : {},
  };

  return (
    <View key={id}>
      <TouchableOpacity
        style={[
          styles.channelTouchable,
          isSelected && styleSelected.background,
        ]}
        onPress={onPress}
      >
        {!isSidebar && (
          <View
            style={[styles.channelSide, isSelected && { backgroundColor }]}
          />
        )}
        <View
          style={[
            styles.channelContentContainer,
            isSidebar && styles.channelContentContainerSideBar,
          ]}
        >
          <View style={!isSidebar && styles.channelLabelContainer}>
            <View
              style={[
                styles.channelLabel,
                { backgroundColor },
                isSelected && styleSelected.label,
              ]}
            />
          </View>
          <View style={styles.channelTextContainer}>
            <View style={styles.channelNameContainer}>
              <Text
                variant={isSidebar ? 'normal' : 'bold'}
                style={[styles.channelName, isSelected && styleSelected.title]}
              >
                {name}
              </Text>
            </View>
            {!isSidebar && (
              <View style={styles.channelDescriptionContainer}>
                <Text style={styles.channelDescription}>
                  {description || ''}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
      {!isSidebar && (
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
        </View>
      )}
    </View>
  );
}

const useStyles = makeStyles(({ colors, fontSizes, spacing }) => ({
  channelTouchable: {
    flexDirection: 'row',
  },
  channelContentContainer: {
    flex: 0.95,
    paddingRight: spacing.xl,
    flexDirection: 'row',
  },
  channelContentContainerSideBar: {
    alignItems: 'center',
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
    color: colors.textNormal,
  },
  selectedChannelNameSideBarIos: {
    color: colors.background,
  },
  selectedChannelNameSideBarAndroid: {
    color: colors.primary,
  },
  selectedChannelLabelSideBarIos: {
    backgroundColor: colors.background,
  },
  selectedChannelLabelSideBarAndroid: {
    backgroundColor: colors.primary,
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
  selectedChannelSideBarIos: {
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  selectedChannelSideBarAndroid: {
    backgroundColor: colors.activeSideBarAndroid,
    borderRadius: 16,
  },
}));
