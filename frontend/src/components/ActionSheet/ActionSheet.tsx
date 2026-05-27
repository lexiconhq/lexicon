import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Modal,
  ModalProps,
  Platform,
  StyleProp,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ANIMATION_DURATION } from '../../constants/theme/animations';
import { makeStyles } from '../../theme';

import {
  ActionSheetItem,
  ActionSheetItemProps,
  ActionSheetItemVariant,
} from './ActionSheetItem';

export type ActionSheetOption = {
  label: string;
  disabled?: boolean;
  variant?: ActionSheetItemVariant;
};

type Props = ModalProps & {
  options: Array<ActionSheetOption>;
  cancelButtonIndex?: number;
  actionItemOnPress: (index: number, label: string) => void;
  onClose: () => void;
  style?: StyleProp<ViewStyle>;
};

export { Props as ActionSheetProps };

const ios = Platform.OS === 'ios';

export function ActionSheet(props: Props) {
  const styles = useStyles();

  const {
    options: optionsProp,
    cancelButtonIndex,
    actionItemOnPress,
    onClose,
    visible,
    animationType = 'fade',
    transparent = true,
    style,
    ...otherProps
  } = props;

  const displayOptions = useMemo(() => {
    const options = optionsProp.map((option) => ({ ...option }));
    if (cancelButtonIndex != null && options[cancelButtonIndex]) {
      const [cancel] = options.splice(cancelButtonIndex, 1);
      options.push({ ...cancel, variant: 'cancel' as const });
    }
    return options;
  }, [cancelButtonIndex, optionsProp]);

  const firstItemIndex = 0;
  const lastItemNoCancelIndex = displayOptions.length - (ios ? 2 : 1);
  const lastItemIndex = displayOptions.length - 1;

  const slideAnimation = useRef(new Animated.Value(0)).current;

  let slideIn = useCallback(() => {
    Animated.timing(slideAnimation, {
      toValue: 1,
      duration: ANIMATION_DURATION.s,
      useNativeDriver: true,
    }).start();
  }, [slideAnimation]);

  let slideOut = useCallback(() => {
    Animated.timing(slideAnimation, {
      toValue: 0,
      duration: ANIMATION_DURATION.s,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  }, [slideAnimation, onClose]);

  useEffect(() => {
    if (visible) {
      slideIn();
    }
  }, [visible, slideIn]);

  let renderOptions = () => (
    <View style={styles.optionsGroup}>
      {displayOptions.map(({ label, disabled, variant = 'default' }, index) => {
        const isCancelOption = index === lastItemIndex && ios;
        return (
          <ActionSheetItem
            key={`actionItem-${label}-${index}`}
            label={label}
            variant={variant}
            disabled={disabled}
            onPress={() => {
              if (!disabled) {
                actionItemOnPress(index, label);
                slideOut();
              }
            }}
            isTop={index === firstItemIndex && !isCancelOption}
            isBottom={index === lastItemNoCancelIndex && !isCancelOption}
            isCancelOption={isCancelOption}
          />
        );
      })}
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType={animationType}
      transparent={transparent}
      {...otherProps}
    >
      <TouchableWithoutFeedback onPressOut={slideOut}>
        <SafeAreaView style={[styles.container, style]}>
          {ios ? (
            <Animated.View
              style={[
                styles.sheet,
                {
                  transform: [
                    {
                      translateY: slideAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [200, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              {renderOptions()}
            </Animated.View>
          ) : (
            renderOptions()
          )}
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
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    paddingHorizontal: spacing.l,
    paddingBottom: ios ? spacing.xl : spacing.l,
  },
  sheet: {
    width: '100%',
  },
  optionsGroup: {
    width: '100%',
  },
}));
