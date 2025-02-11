import React, { useRef, useState } from 'react';
import {
  TouchableOpacity,
  View,
  ScrollView,
  StyleProp,
  ViewStyle,
  Dimensions,
  Modal,
  Platform,
} from 'react-native';

import { Icon, Text, TextInput } from '../core-ui';
import { makeStyles, useTheme } from '../theme';

type DropdownOption = {
  value: string;
  label: string;
};

type DropdownTextInputProps = {
  label?: string;
  value: string;
  placeholder?: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

type Props = {
  selectedIndex?: number | Array<number>;
  onSelect: (option: DropdownOption, index: number) => void;
  options: Array<DropdownOption>;
  style?: StyleProp<ViewStyle>;
} & Pick<DropdownTextInputProps, 'label' | 'placeholder' | 'disabled'>;

const MaxDropDownHeight = 160;
export function DropdownTextInput(props: DropdownTextInputProps) {
  const { label, value, placeholder, onPress, style, disabled = false } = props;
  const { colors } = useTheme();

  return (
    <TouchableOpacity onPress={onPress} style={style} disabled={disabled}>
      <TextInput
        label={label}
        value={value}
        placeholder={placeholder}
        rightIcon="Triangle"
        rightIconColor={colors.icon}
        editable={false}
        disabled={disabled}
        pointerEvents="none"
      />
    </TouchableOpacity>
  );
}

export function Dropdown(props: Props) {
  const {
    label,
    selectedIndex,
    placeholder = '',
    onSelect,
    options,
    style,
    disabled,
  } = props;

  const styles = useStyles();
  const [showOptions, setShowOptions] = useState(false);
  const { spacing } = useTheme();
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    maxHeight: number;
  }>({
    top: 0,
    maxHeight: MaxDropDownHeight,
  });
  const isMultiple = Array.isArray(selectedIndex);

  const inputRef = useRef<View>(null);
  const isIos = Platform.OS === 'ios';

  const handlePress = () => {
    if (inputRef.current) {
      /**
       * Calculate the position of the dropdown items when the dropdown input field is clicked.
       */
      inputRef.current.measure((_x, _y, _width, height, _px, py) => {
        const { height: windowHeight } = Dimensions.get('window');
        const bottomSpace = windowHeight - py - height; // Calculate the space available below the dropdown input field
        const maxHeight = Math.min(MaxDropDownHeight, bottomSpace - 20); // Leave some space at the bottom

        if (bottomSpace < MaxDropDownHeight) {
          // If there isn't enough space below, show the dropdown above the input field
          setDropdownPosition({
            top:
              py -
              (options.length <= 3 ? options.length * 50 : MaxDropDownHeight) -
              (isIos ? 0 : spacing.xxxl + spacing.m), // Calculate the position using the total number of options if there are 3 or fewer
            maxHeight: Math.min(MaxDropDownHeight, py - 20), // Leave some space at the top
          });
        } else {
          setDropdownPosition({
            top: py + height + (isIos ? spacing.m : -spacing.xxxl), // Android has a greater height value, which causes the dropdown items to appear lower.
            maxHeight,
          });
        }
        setShowOptions(!showOptions);
      });
    }
  };

  return (
    /**
     * collapsable used because bug from issue https://github.com/facebook/react-native/issues/29712 for android
     */
    <View style={style} ref={inputRef} collapsable={false}>
      <DropdownTextInput
        label={label}
        value={
          isMultiple
            ? selectedIndex.map((index) => options[index].label).join(', ')
            : (selectedIndex !== undefined && options[selectedIndex].label) ||
              ''
        }
        onPress={handlePress}
        placeholder={placeholder}
        disabled={disabled}
      />

      <Modal transparent visible={showOptions}>
        <View style={styles.overlayContainer}>
          <TouchableOpacity
            style={styles.backdrop}
            onPress={() => {
              setShowOptions(false);
            }}
          />
          <View
            style={[
              styles.dropdown,
              styles.shadow,
              {
                top: dropdownPosition.top,
              },
            ]}
          >
            <ScrollView
              style={[
                styles.scrollContainer,
                { maxHeight: dropdownPosition.maxHeight },
              ]}
              contentContainerStyle={styles.scrollContentContainer}
            >
              {options.map((option, index) => {
                const isSelectedMultiple =
                  isMultiple && selectedIndex.includes(index);
                return (
                  <TouchableOpacity
                    key={`option-${index}`}
                    style={[
                      styles.optionItem,
                      isSelectedMultiple ? styles.activeOptionMultiple : null,
                    ]}
                    onPress={() => {
                      onSelect(option, index);
                      !isMultiple && setShowOptions(false);
                    }}
                  >
                    {isSelectedMultiple && (
                      <Icon name="Done" size="xs" style={styles.icon} />
                    )}
                    <Text>{option.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const useStyles = makeStyles(({ spacing, colors }) => ({
  scrollContainer: { maxHeight: MaxDropDownHeight, width: '100%' },
  scrollContentContainer: {
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.xl,
  },
  dropdown: {
    position: 'absolute',
    width: '90%',
    backgroundColor: colors.background,
    zIndex: 100011, // Ensure dropdown appears above other elements
    marginHorizontal: spacing.xl,
  },
  shadow: {
    backgroundColor: colors.background,
    shadowColor: colors.pureBlack,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.2,
    elevation: 2,
  },
  optionItem: { paddingVertical: spacing.l },
  activeOptionMultiple: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: spacing.s,
  },
  overlayContainer: { width: '100%', height: '100%' },
  backdrop: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
}));
