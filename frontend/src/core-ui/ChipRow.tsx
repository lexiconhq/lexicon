import React, { ComponentProps } from 'react';
import { ScrollViewProps } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

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
