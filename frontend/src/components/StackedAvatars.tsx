import React from 'react';
import { ImageBackground, StyleProp, ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { Text } from '../core-ui';
import { makeStyles, useTheme } from '../theme';
import { AVATAR_ICON_SIZES, AVATAR_ICON_SIZE_VARIANTS } from '../constants';
import { convertUrl } from '../helpers';

type Props = {
  avatars: Array<string>;
  size?: AVATAR_ICON_SIZE_VARIANTS;
  style?: StyleProp<ViewStyle>;
  showCount?: boolean;
  onPress: () => void;
  max?: number;
};

export function StackedAvatars(props: Props) {
  const styles = useStyles();
  const { spacing } = useTheme();
  const {
    avatars,
    size = 's',
    style,
    showCount = true,
    onPress,
    max = 3,
  } = props;

  const finalSize = AVATAR_ICON_SIZES[size];
  const shownAvatars = avatars.slice(0, max);

  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
      {shownAvatars.map((avatar, index) => {
        return (
          <ImageBackground
            key={index}
            source={{ uri: convertUrl(avatar) }}
            style={{
              width: finalSize,
              height: finalSize,
              marginRight: finalSize / -2,
            }}
            imageStyle={styles.image}
          />
        );
      })}
      {showCount && (
        <Text
          size="s"
          style={{ marginLeft: finalSize / 2 + spacing.s + spacing.xs }}
          color="lightTextDarker"
        >
          {`${avatars.length} ${
            avatars.length === 1 ? t('person') : t('people')
          }`}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.pureWhite,
  },
}));
