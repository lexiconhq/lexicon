import React, { useState } from 'react';
import {
  TouchableOpacity,
  View,
  ScrollView,
  StyleProp,
  ViewStyle,
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
  const isMultiple = Array.isArray(selectedIndex);

  return (
    <View style={style}>
      <DropdownTextInput
        label={label}
        value={
          isMultiple
            ? selectedIndex.map((index) => options[index].label).join(', ')
            : (selectedIndex !== undefined && options[selectedIndex].label) ||
              ''
        }
        onPress={() => setShowOptions(!showOptions)}
        placeholder={placeholder}
        disabled={disabled}
      />
      {showOptions && (
        <View style={styles.shadow}>
          <ScrollView
            style={styles.scrollContainer}
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
      )}
    </View>
  );
}

const useStyles = makeStyles(({ spacing, colors }) => ({
  scrollContainer: { maxHeight: 160 },
  scrollContentContainer: {
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.xl,
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
  optionItem: { paddingVertical: spacing.m },
  activeOptionMultiple: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: spacing.s,
  },
}));
