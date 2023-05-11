import React, { useState } from 'react';
import {
  ImageBackground,
  ImageBackgroundProps,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { DEFAULT_IMAGE } from '../../assets/images';
import { ShowImageModal } from '../components/ShowImageModal';
import { makeStyles } from '../theme';
import { isImageValidUrl } from '../helpers';

import CachedImage from './CachedImage';

const variantSize = {
  s: 84,
  m: 200,
};

type Props = Omit<ImageBackgroundProps, 'source' | 'style'> & {
  src: string;
  size?: keyof typeof variantSize;
  square?: boolean;
  style?: StyleProp<ViewStyle>;
  defaultImage?: string;
  onPress?: () => void;
};

export function CustomImage(props: Props) {
  const styles = useStyles();

  const {
    src,
    size = 'm',
    square = false,
    style,
    defaultImage = DEFAULT_IMAGE,
    ...otherProps
  } = props;

  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);

  const sizeStyle = {
    height: variantSize[size],
    ...(square && { width: variantSize[size] }),
  };

  const imgSource = isImageValidUrl(src) ? { uri: src } : DEFAULT_IMAGE;

  const hideImage = src === '' || error;

  const onPress = () => {
    setShow(true);
  };

  const onPressCancel = () => {
    setShow(false);
  };

  const content = (
    <ImageBackground
      source={defaultImage}
      style={[styles.image, sizeStyle]}
      resizeMode="cover"
      {...otherProps}
    >
      <CachedImage
        source={imgSource}
        style={[styles.image, sizeStyle]}
        resizeMode="cover"
        onError={() => setError(true)}
        {...otherProps}
      />
    </ImageBackground>
  );

  return !hideImage ? (
    <>
      <TouchableOpacity
        delayPressIn={100}
        style={[styles.container, style]}
        onPress={onPress}
      >
        {content}
      </TouchableOpacity>

      <ShowImageModal
        show={show}
        userImage={imgSource}
        onPressCancel={onPressCancel}
      />
    </>
  ) : (
    <View style={styles.noContent} />
  );
}

const useStyles = makeStyles(({ spacing }) => ({
  container: {
    flexDirection: 'row',
  },
  noContent: {
    paddingBottom: spacing.l,
  },
  image: {
    borderRadius: 4,
    overflow: 'hidden',
    width: '100%',
  },
}));
