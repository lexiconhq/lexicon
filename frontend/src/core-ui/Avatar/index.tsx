import React, { useState } from 'react';
import {
  ImageBackground,
  ImageBackgroundProps,
  TouchableOpacity,
} from 'react-native';

import {
  AVATAR_ICON_SIZES,
  AVATAR_ICON_SIZE_VARIANTS,
  AVATAR_LETTER_SIZES,
} from '../../constants';
import { makeStyles, useTheme } from '../../theme';
import { convertUrl } from '../../helpers';

import { LetterAvatar } from './LetterAvatar';

type Props = Omit<ImageBackgroundProps, 'source'> & {
  src?: string;
  size?: AVATAR_ICON_SIZE_VARIANTS;
  label?: string;
  color?: string;
  defaultImage?: boolean;
  onPress?: () => void;
};

export { Props as AvatarProps };

export function Avatar(props: Props) {
  const styles = useStyles();
  const { colors } = useTheme();

  const {
    src = '',
    size = 's',
    color = colors.textLighter,
    style,
    label = '',
    onPress,
    ...otherProps
  } = props;

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const finalSize = AVATAR_ICON_SIZES[size];
  const fontSize = AVATAR_LETTER_SIZES[size];

  const loadChild = src === '' || error;
  const imgSource = { uri: convertUrl(src) };

  const letterAvatar = (
    <LetterAvatar
      size={finalSize}
      color={color}
      label={label}
      style={style}
      fontSize={fontSize}
    />
  );

  return (
    <TouchableOpacity onPress={onPress}>
      {src === '' && loading ? (
        letterAvatar
      ) : (
        <ImageBackground
          source={imgSource}
          style={[{ width: finalSize, height: finalSize }, style]}
          imageStyle={styles.circle}
          onError={() => setError(true)}
          // TODO: Decide what to display onLoading
          onLoadEnd={() => setLoading(false)}
          {...otherProps}
        >
          {loadChild && letterAvatar}
        </ImageBackground>
      )}
    </TouchableOpacity>
  );
}

const useStyles = makeStyles(() => ({
  circle: {
    borderRadius: 100,
  },
}));
