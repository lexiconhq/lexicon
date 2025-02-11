import React, { ReactNode } from 'react';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewProps,
} from 'react-native-keyboard-aware-scroll-view';

import { makeStyles } from '../theme';
import { useDevice } from '../utils';

type Props = {
  children?: ReactNode;
  bottomMenu?: ReactNode;
  bottomMenuAlwaysVisible?: boolean;
} & KeyboardAwareScrollViewProps;

export function KeyboardTextAreaScrollView(props: Props) {
  const styles = useStyles();

  const { children, bottomMenu, bottomMenuAlwaysVisible, ...otherProps } =
    props;

  const { isTabletLandscape } = useDevice();

  return (
    <>
      <KeyboardAwareScrollView
        scrollEventThrottle={0}
        enableOnAndroid
        keyboardDismissMode="on-drag"
        scrollEnabled
        extraHeight={isTabletLandscape ? 150 : 300}
        keyboardShouldPersistTaps="always"
        {...otherProps}
      >
        {children}
      </KeyboardAwareScrollView>
      <KeyboardAccessoryView
        style={styles.bottomMenu}
        androidAdjustResize
        inSafeAreaView
        hideBorder
        alwaysVisible={bottomMenuAlwaysVisible}
      >
        {bottomMenu}
      </KeyboardAccessoryView>
    </>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  bottomMenu: {
    paddingTop: spacing.s,
    backgroundColor: colors.background,
  },
}));
