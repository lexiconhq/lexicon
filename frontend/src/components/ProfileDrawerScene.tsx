import React, { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { makeStyles } from '../theme';
import { useDevice } from '../utils';

type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * Safe area wrapper for profile screens. On tablet landscape the profile drawer
 * sits above the tab bar, so bottom inset is omitted so the main pane aligns
 * with the sidebar bottom edge.
 */
export function ProfileDrawerScene({ children, style }: Props) {
  const { isTabletLandscape } = useDevice();
  const styles = useStyles();

  return (
    <SafeAreaView
      style={[styles.container, style]}
      edges={
        isTabletLandscape
          ? ['right']
          : ['top', 'right', 'bottom', 'left']
      }
    >
      {children}
    </SafeAreaView>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  container: {
    flex: 1,
  },
}));
