/* eslint-disable styles/style-maker-no-unused */
import React from 'react';
import { Platform, StyleProp, View, ViewStyle } from 'react-native';
import BaseMarkdown, {
  ASTNode,
  MarkdownIt,
  MarkdownProps,
} from 'react-native-markdown-display';
import { useNavigation } from '@react-navigation/core';
import mentionFlowDock from 'markdown-it-flowdock';

import { CustomImage } from '../core-ui/CustomImage';
import { Text } from '../core-ui/Text';
import { makeStyles } from '../theme';
import { StackNavProp } from '../types';

type Props = Omit<MarkdownProps, 'rules' | 'style'> & {
  content: string;
  fontColor?: string;
  style?: StyleProp<ViewStyle>;
  mentionColor?: string;
  mentions?: Array<string>;
  nonClickable?: boolean;
};

const ios = Platform.OS === 'ios';

export function Markdown(props: Props) {
  const { navigate } = useNavigation<StackNavProp<'UserInformation'>>();
  let styles = useStyles();

  let {
    content,
    fontColor,
    mentionColor,
    style,
    mentions,
    nonClickable,
    ...otherProps
  } = props;

  content = content || '';

  styles = fontColor
    ? { ...styles, ...{ body: { ...styles.body, color: fontColor } } }
    : styles;

  const markdownItInstance = MarkdownIt({ typographer: true }).use(
    mentionFlowDock,
    { containerClassName: 'mention' },
  );

  const onPressMention = (username: string) => {
    navigate('UserInformation', { username });
  };

  const renderImage = ({ attributes: { src }, key }: ASTNode) => {
    return <CustomImage src={src} key={key} style={styles.image} />;
  };

  const renderMention = ({ key, content }: ASTNode) => (
    <Text
      key={key}
      variant="bold"
      style={mentionColor === 'primary' ? styles.mentionByMe : styles.mention}
      onPress={() => {
        !nonClickable && onPressMention(content);
      }}
    >
      {`@${content}`}
    </Text>
  );

  const renderHashtag = ({ key, content }: ASTNode) => (
    <Text key={key}>{t('#{content}', { content })}</Text>
  );

  return (
    <View style={style}>
      <BaseMarkdown
        markdownit={markdownItInstance}
        rules={{
          image: renderImage,
          mention: renderMention,
          hashtag: renderHashtag, //need to add hashtag to prevent warning
        }}
        style={styles}
        {...otherProps}
      >
        {content}
      </BaseMarkdown>
    </View>
  );
}

const useStyles = makeStyles(
  ({ colors, fontSizes, headingFontSizes, spacing }) => ({
    body: {
      fontSize: fontSizes.m,
      margin: 0,
      padding: 0,
      color: colors.textNormal,
    },
    heading1: { fontSize: headingFontSizes.h1, paddingVertical: spacing.m },
    heading2: { fontSize: headingFontSizes.h2, paddingVertical: spacing.m },
    heading3: { fontSize: headingFontSizes.h3, paddingVertical: spacing.m },
    heading4: { fontSize: headingFontSizes.h4, paddingVertical: spacing.m },
    heading5: { fontSize: headingFontSizes.h5, paddingVertical: spacing.m },
    heading6: { fontSize: headingFontSizes.h6, paddingVertical: spacing.m },
    hr: { backgroundColor: colors.border, marginVertical: spacing.m },
    table: { borderColor: colors.border },
    tr: { borderColor: colors.border },
    paragraph: { marginTop: 0, marginBottom: spacing.m },
    image: { paddingVertical: spacing.l },
    bullet_list_icon: {
      flex: 1,
      fontSize: ios ? 52 : 28,
      lineHeight: ios ? 36 : 24,
      textAlign: 'right',
      marginLeft: 0,
    },
    ordered_list_icon: {
      flex: 1,
      fontSize: fontSizes.m,
      lineHeight: ios ? 0 : 16,
      textAlign: 'right',
      marginLeft: 0,
    },
    bullet_list_content: { flex: 8 },
    ordered_list_content: { flex: 8 },
    blockquote: {
      color: colors.textNormal,
      backgroundColor: colors.border,
      paddingHorizontal: spacing.l,
      paddingTop: spacing.l,
      marginBottom: spacing.l,
    },
    code_inline: {
      color: colors.textNormal,
      backgroundColor: colors.border,
    },
    code_block: {
      color: colors.textNormal,
      borderColor: colors.grey,
      backgroundColor: colors.border,
      padding: spacing.xl,
      marginBottom: spacing.m,
      borderRadius: 4,
    },
    fence: {
      color: colors.textNormal,
      borderColor: colors.grey,
      backgroundColor: colors.border,
      padding: spacing.xl,
      marginBottom: spacing.m,
      borderRadius: 8,
    },
    mentionByMe: {
      color: colors.pureWhite,
    },
    mention: {
      color: colors.primary,
    },
  }),
);
