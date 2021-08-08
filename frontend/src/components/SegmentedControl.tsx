import React, { useRef } from 'react';
import {
  Animated,
  Easing,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';

import { Text } from '../core-ui';
import { makeStyles, useTheme } from '../theme';

type Props<T> = {
  values: Array<T>;
  selectedIndex: number;
  width: number;
  labelExtractor: (item: T) => string;
  onItemPress: (item: T, index: number) => void;
};

const ios = Platform.OS === 'ios';

export function SegmentedControl<T>(props: Props<T>) {
  const styles = useStyles();
  const { spacing } = useTheme();

  const { values, selectedIndex, width, labelExtractor, onItemPress } = props;

  const positionValue = useRef(new Animated.Value(0)).current;

  const onSegmentSelected = (value: T, index: number) => {
    onItemPress(value, index);
    Animated.timing(positionValue, {
      toValue: index,
      duration: 100,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start(() => {});
  };

  // 20 is coming from the text line height (medium)
  // SPACING.s (4) is coming from the segment padding
  const IOS_SEGMENT_HEIGHT = 20 + spacing.s * 2;
  // SPACING.xxl (24) is coming from the padding inside the Home Screen (Left and Right)
  // SPACING.s (4) is coming from the initial (left) padding of the Segmented Control container
  const IOS_SEGMENT_WIDTH =
    (width - (spacing.xxl * 2 + spacing.s)) / values.length;

  return (
    <View style={styles.container}>
      {ios && (
        <Animated.View
          style={[
            {
              transform: [
                {
                  translateX: positionValue.interpolate({
                    inputRange: [0, values.length - 1],
                    // 4 is coming from initial padding of the container
                    outputRange: [4, (values.length - 1) * IOS_SEGMENT_WIDTH],
                  }),
                },
              ],
            },
            styles.animatedSegment,
            {
              height: IOS_SEGMENT_HEIGHT,
              width: IOS_SEGMENT_WIDTH,
            },
          ]}
        />
      )}
      {values.map((value, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.item, selectedIndex === index && styles.itemChosen]}
          onPress={() => onSegmentSelected(value, index)}
          disabled={selectedIndex === index}
        >
          <Text
            style={[styles.text, selectedIndex === index && styles.textChosen]}
          >
            {labelExtractor(value)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const useStyles = makeStyles(({ colors, fontVariants, shadow, spacing }) =>
  ios
    ? {
        container: {
          backgroundColor: colors.backgroundDarker,
          borderRadius: 4,
          padding: spacing.s,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginVertical: spacing.m,
        },
        item: {
          flex: 1,
          padding: spacing.s,
          textAlign: 'center',
        },
        animatedSegment: {
          borderRadius: 4,
          backgroundColor: colors.background,
          position: 'absolute',
          ...shadow,
        },
        text: {
          textAlign: 'center',
          color: colors.textLight,
        },
        textChosen: {
          color: colors.textNormal,
        },
      }
    : {
        container: {
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        item: {
          flex: 1,
          padding: spacing.xl,
          textAlign: 'center',
        },
        itemChosen: {
          borderBottomColor: colors.primary,
          borderBottomWidth: 2,
        },
        text: {
          textAlign: 'center',
          color: colors.textLight,
        },
        textChosen: {
          color: colors.textNormal,
          ...fontVariants.semiBold,
        },
      },
);
