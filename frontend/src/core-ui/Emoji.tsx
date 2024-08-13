import React, { useState } from 'react';
import {
  ImageBackground,
  ImageBackgroundProps,
  TouchableOpacity,
} from 'react-native';

import {
  DEFAULT_EMOJI_STATUS,
  EMOJI_SIZES,
  EMOJI_SIZES_VARIANTS,
} from '../constants';
import { makeStyles } from '../theme';
import { useGetUrlEmoji } from '../hooks/user/useGetUrlEmoji';

type Props = Omit<ImageBackgroundProps, 'source'> & {
  emojiCode?: string;
  size?: EMOJI_SIZES_VARIANTS;
  defaultImage?: boolean;
  onPress?: () => void;
  disableOnPress?: boolean;
  testIDButton?: string;
};

export function Emoji(props: Props) {
  const styles = useStyles();

  const {
    emojiCode = '',
    size = 's',
    style,
    onPress,
    disableOnPress,
    testIDButton,
    ...otherProps
  } = props;

  const [error, setError] = useState(false);

  const finalSize = EMOJI_SIZES[size];

  const isDefaultValue = emojiCode === '' || error;
  const emojiUrl = useGetUrlEmoji(
    isDefaultValue ? DEFAULT_EMOJI_STATUS : emojiCode,
  );

  const imgSource = { uri: emojiUrl };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disableOnPress}
      testID={testIDButton}
    >
      <ImageBackground
        source={imgSource}
        style={[{ width: finalSize, height: finalSize }, style]}
        imageStyle={styles.circle}
        onError={() => setError(true)}
        {...otherProps}
      />
    </TouchableOpacity>
  );
}

const useStyles = makeStyles(() => ({
  circle: {
    borderRadius: 100,
  },
}));
