import React, { memo } from 'react';
import { StyleProp, TextStyle, View, ViewProps } from 'react-native';

import { Markdown } from '../components/Markdown';
import { automaticFontColor } from '../helpers';
import { Color, makeStyles, useTheme } from '../theme';

type Props = ViewProps & {
  message: string;
  bgColor?: Color;
  noBorder?: boolean;
  fontStyle?: StyleProp<TextStyle>;
  mentions?: Array<string>;
  nonClickable?: boolean;
};

const ChatBubble = memo((props: Props) => {
  const styles = useStyles();
  const { colors } = useTheme();

  const {
    message,
    bgColor = 'background',
    noBorder = false,
    fontStyle,
    mentions,
    nonClickable,
    style,
    ...otherProps
  } = props;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors[bgColor] },
        !noBorder && styles.border,
        style,
      ]}
      {...otherProps}
    >
      <Markdown
        fontColor={automaticFontColor(colors[bgColor])}
        mentionColor={bgColor}
        content={message}
        mentions={mentions}
        nonClickable={nonClickable}
      />
    </View>
  );
});

export { ChatBubble };

const useStyles = makeStyles(({ colors, spacing }) => ({
  container: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.l,
    paddingBottom: spacing.s,
    borderRadius: 18,
  },
  border: {
    borderColor: colors.border,
    borderWidth: 1,
  },
}));
