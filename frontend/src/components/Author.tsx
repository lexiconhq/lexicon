import React, { ReactChild } from 'react';
import {
  ImageStyle,
  StyleProp,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';

import { Avatar, AvatarProps, Text } from '../core-ui';
import { FontVariant, makeStyles } from '../theme';

type Props = TouchableOpacityProps &
  Pick<AvatarProps, 'size'> & {
    image: string;
    title: string;
    avatarLabel?: string;
    variant?: FontVariant;
    subtitle?: string;
    children?: ReactChild;
    titleStyle?: StyleProp<TextStyle>;
    subtitleStyle?: StyleProp<TextStyle>;
    imageStyle?: StyleProp<ImageStyle>;
    onPressAuthor?: (username: string) => void;
    onPressEmptySpaceInPost?: () => void;
  };

export function Author(props: Props) {
  const styles = useStyles();

  const {
    image,
    title,
    avatarLabel = props.title[0],
    variant,
    subtitle,
    size = subtitle ? 's' : 'xs',
    style,
    titleStyle,
    subtitleStyle,
    imageStyle,
    children,
    onPressAuthor,
    onPressEmptySpaceInPost,
    ...otherProps
  } = props;

  const content = (
    <>
      <View style={styles.dataContainer}>
        <Avatar
          src={image}
          size={size}
          label={avatarLabel}
          style={[styles.image, imageStyle]}
          onPress={() => onPressAuthor && onPressAuthor(title)}
        />
        <View>
          <Text style={[styles.textTitle, titleStyle]} variant={variant}>
            {title}
          </Text>
          {subtitle && (
            <Text color="textLight" style={subtitleStyle}>
              {subtitle}
            </Text>
          )}
        </View>
        {onPressEmptySpaceInPost && (
          <TouchableOpacity
            style={styles.emptySpacePost}
            delayPressIn={300}
            onPress={onPressEmptySpaceInPost}
          />
        )}
      </View>
      <View style={styles.children}>{children}</View>
    </>
  );

  return onPressAuthor ? (
    <TouchableOpacity
      onPress={() => onPressAuthor(title)}
      style={[styles.container, style]}
      {...otherProps}
    >
      {content}
    </TouchableOpacity>
  ) : (
    <View style={[styles.container, style]}>{content}</View>
  );
}

const useStyles = makeStyles(({ spacing }) => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  dataContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  emptySpacePost: {
    alignSelf: 'stretch',
    flex: 1,
  },
  textTitle: {
    textTransform: 'capitalize',
    paddingBottom: spacing.xs,
  },
  image: {
    marginRight: spacing.m,
  },
  children: {
    alignSelf: 'center',
  },
}));
