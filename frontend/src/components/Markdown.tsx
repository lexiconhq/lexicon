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
import * as Linking from 'expo-linking';
import { useReactiveVar } from '@apollo/client';

import { CustomImage } from '../core-ui/CustomImage';
import { Text } from '../core-ui/Text';
import { makeStyles } from '../theme';
import { StackNavProp } from '../types';
import CachedImage from '../core-ui/CachedImage';
import { isEmojiImage } from '../helpers/emojiHandler';
import {
  extractPathname,
  filterMarkdownContent,
  getValidDetailParams,
} from '../helpers';
import { discourseHostVar } from '../constants';

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
  const { navigate, push } = useNavigation<StackNavProp<'UserInformation'>>();
  let styles = useStyles();
  let discourseHost = useReactiveVar(discourseHostVar);

  let {
    content,
    fontColor,
    mentionColor,
    style,
    mentions,
    nonClickable,
    ...otherProps
  } = props;

  content = filterMarkdownContent(content).filteredMarkdown;

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

  const renderImage = ({ attributes: { src }, key, content }: ASTNode) => {
    if (isEmojiImage(content)) {
      return (
        <CachedImage
          source={{ uri: src }}
          key={key}
          style={styles.emojiImage}
        />
      );
    }
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

  const renderLink = ({ key, attributes }: ASTNode) => {
    if (typeof attributes.href !== 'string') {
      return;
    }

    let url = attributes.href;
    const isSameHost = url.startsWith(discourseHost);
    const pathname = isSameHost ? extractPathname(url) : '';

    if (isSameHost && pathname) {
      url = `/${pathname.replace(/t\//, 'topics/')}`;
    }

    const onLinkPress = () => {
      const detailParams = getValidDetailParams(pathname.split('/'));

      if (!detailParams) {
        Linking.openURL(url);
        return;
      }

      const { topicId, postNumber } = detailParams;
      push('PostDetail', { topicId, postNumber });
    };

    const handleLinkPress = () => {
      if (!isSameHost || !pathname) {
        Linking.openURL(url);
        return;
      }

      onLinkPress();
    };

    return (
      <Text key={key} onPress={handleLinkPress} style={styles.link}>
        {url}
      </Text>
    );
  };

  return (
    <View style={style}>
      <BaseMarkdown
        markdownit={markdownItInstance}
        rules={{
          image: renderImage,
          mention: renderMention,
          hashtag: renderHashtag, //need to add hashtag to prevent warning
          link: renderLink,
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
    emojiImage: {
      width: 20,
      height: 20,
    },
    link: { textDecorationLine: 'underline' },
  }),
);
