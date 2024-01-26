import React from 'react';
import { View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import { makeStyles, useTheme } from '../../theme';

type Props = {
  isLoading: boolean;
};
export default function (props: Props) {
  const { isLoading } = props;
  const styles = useStyles();
  const { colors } = useTheme();

  return (
    <SkeletonPlaceholder
      enabled={isLoading}
      borderRadius={4}
      backgroundColor={colors.skeletonLoadingBackgroundMode}
      highlightColor={colors.skeletonLoadingHighlightMode}
    >
      <View style={styles.container}>
        <View style={styles.titleBox} />
        <View style={styles.avatarContainer}>
          <View style={styles.avatar} />
          <View style={styles.nameBox} />
        </View>
        <View style={styles.contentBox} />
        <View style={styles.smallContainer}>
          <View style={styles.smallTextBox} />
          <View style={styles.smallAvatar} />
        </View>

        <View style={styles.avatarContainer}>
          <View style={styles.avatar} />
          <View style={styles.nameBox} />
        </View>
        <View style={styles.contentBoxReply} />
        <View style={styles.avatarContainer}>
          <View style={styles.avatar} />
          <View style={styles.nameBox} />
        </View>
        <View style={styles.contentBoxReply} />
      </View>
    </SkeletonPlaceholder>
  );
}

const useStyles = makeStyles(({ spacing }) => ({
  container: {
    padding: spacing.xxl,
  },
  titleBox: { marginBottom: spacing.xl, height: 30, width: '100%' },

  avatarContainer: {
    alignContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  nameBox: { marginLeft: spacing.m, flex: 1, height: 20 },
  contentBox: {
    width: '100%',
    height: '30%',
    marginBottom: spacing.xl,
  },
  smallContainer: {
    alignContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },

  smallTextBox: {
    height: 20,
    width: '50%',
  },
  smallAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  contentBoxReply: {
    width: '100%',
    height: '15%',
    marginBottom: spacing.xl,
  },
}));
