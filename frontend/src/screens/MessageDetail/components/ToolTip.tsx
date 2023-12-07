import React, { ReactNode, useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  Modal,
  Platform,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { makeStyles, useTheme } from '../../../theme';
import { Icon } from '../../../core-ui';
import { IconName } from '../../../icons';

type Props = {
  visible: boolean;
  anchorIconName: IconName;
  menu: ReactNode;
  anchorStyle?: StyleProp<ViewStyle>;
  onDismiss: () => void;
  anchorOnPress: () => void;
};

export function ToolTip(props: Props) {
  const {
    anchorIconName,
    menu,
    anchorStyle,
    visible,
    onDismiss,
    anchorOnPress,
  } = props;
  const { colors, spacing } = useTheme();
  const styles = useStyles();

  const [menuVerticalPosition, setMenuVerticalPosition] = useState(0);
  const [heightMenu, setHeightMenu] = useState(0);

  let menuAnchorRef = useRef<TouchableOpacity>(null);

  /**
   * This use effect will be calculate position of anchor after keyboard close
   */

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setTimeout(() => {
          measureDefaultPosition();
        }, 10);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleTooltip = () => {
    if (!Keyboard.isVisible()) {
      measureDefaultPosition();
    }

    anchorOnPress();
  };

  const measureDefaultPosition = () => {
    menuAnchorRef.current?.measure((_x, _y, _w, h, _pageX, pageY) => {
      setMenuVerticalPosition(
        Platform.OS === 'android' ? pageY - h - spacing.m : pageY,
      );
    });
  };

  return (
    <>
      <TouchableOpacity onPress={toggleTooltip} ref={menuAnchorRef}>
        <Icon
          name={anchorIconName}
          color={colors.textLighter}
          style={anchorStyle}
        />
      </TouchableOpacity>

      <Modal transparent visible={visible} animationType="fade">
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.backdrop} onPress={onDismiss} />
          <View
            style={[
              styles.tooltipContainer,
              {
                top: menuVerticalPosition - spacing.xl - heightMenu, // position 0 button icon - space based on design - max height of menu
              },
            ]}
            onLayout={(e) => {
              setHeightMenu(e.nativeEvent.layout.height);
            }}
          >
            {menu}
          </View>
        </View>
      </Modal>
    </>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => {
  return {
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
    },
    tooltipContainer: {
      backgroundColor: colors.background,
      padding: spacing.xl + spacing.s,
      position: 'absolute',
      maxHeight: 150,
      width: '100%',
    },
    backdrop: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
    },
  };
});
