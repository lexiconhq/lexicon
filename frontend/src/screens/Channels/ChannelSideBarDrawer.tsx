import React, { ReactNode, useEffect } from 'react';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { makeStyles } from '../../theme';
import { useDevice } from '../../utils';

import ChannelSideBarContent, {
  ChannelSideBarContentProps,
} from './ChannelSideBarContent';

const SIDE_BAR_WIDTH = 320;

type Props = ChannelSideBarContentProps & {
  isShow: boolean;
  children: ReactNode;
};

export default function ChannelSideBarDrawer(props: Props) {
  const { isShow, children, ...otherProps } = props;

  const styles = useStyles();
  const { isTablet, isPortrait } = useDevice();

  /**
   * This is explanation about how animation work at drawer
   *
   * Here is what we want when the sidebar is open:              Here is what the screen looks like when the drawer is hidden:                    Here is what happens when the sidebar is opened:
   * - The drawer position will be outside the screen,            - The drawer is positioned outside the screen at -320px,                        - The drawer's x position will be transformed to 0,
   *   using -320px in this case.                                   and the right content takes up the full screen.                                 and we will add a left margin to the right content
   * - The right content will be resized and adjusted so          - This ensures that the right content remains within the screen                  based on the drawer width (320px), ensuring the right
   *   that it does not move outside the screen.                    and is properly resized.                                                       content remains visible and resized appropriately.
   *
   * |------------------------------|                              XXXXXXXXXXXXX|-----------------------|                                    |-----------------X---------------------------------|
   * |       |                      |                              X           X|                       |                                    |                 X                                 |
   * |       |                      |                              X Drawer    X|                       |                                    |                 X                                 |
   * |Drawer |    Right Content     |                              X           X|  Right Content        |                                    |    Drawer       X    Right Content                |
   * |       |                      |                              X           X|                       |                                    |                 X                                 |
   * |       |                      |                              X           X|                       |                                    |                 X                                 |
   * |------------------------------|                              XXXXXXXXXXXXX|-----------------------|                                    |-----------------X---------------------------------|
   *                                                                                                                                          {----------------}
   *                                                                                                                                         Margin Left from right content 320
   *
   */

  const sideBarTranslateX = useSharedValue(-SIDE_BAR_WIDTH);

  const sideBarAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: sideBarTranslateX.value }],
    };
  });

  const contentAnimatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      sideBarTranslateX.value,
      [-SIDE_BAR_WIDTH, 0],
      [0, SIDE_BAR_WIDTH],
    );
    return {
      marginLeft: translateX,
    };
  });

  useEffect(() => {
    sideBarTranslateX.value = withTiming(isShow ? 0 : -SIDE_BAR_WIDTH, {
      duration: 300,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShow]);

  return (
    <Animated.View
      style={[
        styles.flex,
        isTablet && !isPortrait && styles.outerContainerTablet,
      ]}
    >
      <Animated.View
        style={[styles.flex, styles.sideBarContainer, sideBarAnimatedStyle]}
      >
        {isTablet && !isPortrait && <ChannelSideBarContent {...otherProps} />}
      </Animated.View>
      <Animated.View style={[styles.flex, contentAnimatedStyle]}>
        {children}
      </Animated.View>
    </Animated.View>
  );
}

const useStyles = makeStyles(() => ({
  flex: {
    flex: 1,
  },
  outerContainerTablet: { flexDirection: 'row' },
  sideBarContainer: {
    position: 'absolute',
    width: SIDE_BAR_WIDTH,
    height: '100%',
    zIndex: 1,
  },
}));
