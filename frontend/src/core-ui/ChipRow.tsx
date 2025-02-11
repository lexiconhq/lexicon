import React, { ComponentProps } from 'react';
import { ScrollViewProps, ScrollView } from 'react-native';
/**
 * Change ScrollView to use React Native's ScrollView due to a type problem with the `hitSlop` prop, which is not the same as ScrollViewProps.
 *
 * To use react-native-gesture-handler, we need to update to the latest version. Currently, we cannot update because the version recommended by Expo is ~2.16.1.
 */

// import { ScrollView } from 'react-native-gesture-handler';

import { useTheme } from '../theme';

import { Chip } from './Chip';

type ChipRowItems = Array<ComponentProps<typeof Chip>>;

type Props = {
  items: ChipRowItems;
  scrollViewProps?: Partial<ScrollViewProps>;
};

/**
 *
 * `ChipRow` accepts an array of `Chip`s and renders them in a horizontal
 * `ScrollView` with the proper layout (spacing).
 */
export function ChipRow(props: Props) {
  const { spacing } = useTheme();

  const { items, scrollViewProps = {} } = props;

  const chipSpacingStyle = { marginEnd: spacing.m };

  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      {...scrollViewProps}
    >
      {items.map((chipProps, index) => {
        const isLastItem = index === items.length - 1;
        const style = isLastItem ? undefined : chipSpacingStyle;
        return <Chip key={index} style={style} {...chipProps} />;
      })}
    </ScrollView>
  );
}
