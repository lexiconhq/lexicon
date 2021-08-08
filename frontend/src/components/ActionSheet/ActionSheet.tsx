import React from 'react';
import {
  Modal,
  ModalProps,
  Platform,
  StyleProp,
  TouchableWithoutFeedback,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { makeStyles } from '../../theme';

import { ActionSheetItem, ActionSheetItemProps } from './ActionSheetItem';

type Props = ModalProps & {
  options: Array<Pick<ActionSheetItemProps, 'label' | 'disabled'>>;
  cancelButtonIndex?: number;
  actionItemOnPress: (index: number) => void;
  onClose: () => void;
  style?: StyleProp<ViewStyle>;
};

export { Props as ActionSheetProps };

const ios = Platform.OS === 'ios';

export function ActionSheet(props: Props) {
  const styles = useStyles();

  const {
    options,
    cancelButtonIndex,
    actionItemOnPress,
    onClose,
    visible,
    animationType = 'none',
    transparent = true,
    style,
    ...otherProps
  } = props;

  //reorder cancel item
  const cancelOption =
    cancelButtonIndex != null && options.splice(cancelButtonIndex, 1);
  cancelOption && options.push(cancelOption[0]);

  const firstItemIndex = 0;
  const lastItemNoCancelIndex = options.length - (!cancelOption ? 1 : 2);
  const lastItemIndex = cancelOption ? options.length - 1 : -1;

  return (
    <Modal
      visible={visible}
      animationType={animationType}
      transparent={transparent}
      {...otherProps}
    >
      <TouchableWithoutFeedback onPressOut={onClose}>
        <SafeAreaView style={[styles.container, style]}>
          {options.map(({ label, disabled }, index) => (
            <ActionSheetItem
              key={`actionItem-${index}`}
              label={label}
              disabled={disabled}
              onPress={() => {
                !disabled && actionItemOnPress(index);
                !disabled && onClose();
              }}
              isTop={index === firstItemIndex}
              isBottom={index === lastItemNoCancelIndex}
              isCancelOption={index === lastItemIndex}
            />
          ))}
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const useStyles = makeStyles(({ spacing }) => ({
  container: {
    flex: 1,
    justifyContent: ios ? 'flex-end' : 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: spacing.m,
  },
}));
