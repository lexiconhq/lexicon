import React, { ReactNode, useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { makeStyles } from '../../theme';
import { useDevice } from '../../utils';

import ChannelSideBarContent, {
  ChannelSideBarContentProps,
} from './ChannelSideBarContent';

/** Must match SIDE_BAR_WIDTH; local literal for Reanimated worklets. */
const DRAWER_WIDTH = 320;

type Props = ChannelSideBarContentProps & {
  isShow: boolean;
  children: ReactNode;
};

export default function ChannelSideBarDrawer(props: Props) {
  const { isShow, children, ...otherProps } = props;

  const styles = useStyles();
  const { isTablet } = useDevice();

  const sidebarWidth = useSharedValue(isShow ? DRAWER_WIDTH : 0);

  const sidebarAnimatedStyle = useAnimatedStyle(() => ({
    width: sidebarWidth.value,
    overflow: 'hidden',
  }));

  useEffect(() => {
    sidebarWidth.value = withTiming(isShow ? DRAWER_WIDTH : 0, {
      duration: 300,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShow]);

  if (!isTablet) {
    return <>{children}</>;
  }

  return (
    <View style={[styles.flex, styles.row]}>
      <Animated.View style={sidebarAnimatedStyle}>
        <ChannelSideBarContent
          embeddedInDrawer
          showToggle={false}
          {...otherProps}
        />
      </Animated.View>
      <View style={styles.flex}>{children}</View>
    </View>
  );
}

const useStyles = makeStyles(() => ({
  flex: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
}));
