import React, { RefObject } from 'react';
import {
  FlatList,
  StyleProp,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';

import { ActivityIndicator, TextInputType } from '../core-ui';
import { makeStyles } from '../theme';
import { SelectedUserProps } from '../types';

import { Author } from './Author';

type Props = ViewProps & {
  showUserList: boolean;
  members?: Array<SelectedUserProps>;
  mentionLoading: boolean;
  rawText: string;
  textRef: RefObject<TextInputType>;
  setRawText?: (value: string) => void;
  setMentionValue?: (varName: string, cookedText: string) => void;
  setShowUserList: (value: boolean) => void;
  viewStyle?: StyleProp<ViewStyle>;
  fontStyle?: StyleProp<TextStyle>;
};

export function MentionList(props: Props) {
  const styles = useStyles();

  const {
    showUserList,
    members,
    mentionLoading,
    rawText,
    textRef,
    setRawText,
    setMentionValue,
    setShowUserList,
    viewStyle,
    fontStyle,
    ...otherProps
  } = props;

  const onPressUser = (username: string) => {
    const replacedText = rawText.replace(/@[A-Za-z0-9._-]*$/, `@${username}`);
    textRef.current?.focus();
    if (setMentionValue) {
      setMentionValue('raw', replacedText);
    } else if (setRawText) {
      setRawText(replacedText);
    }
    setShowUserList(false);
  };

  return (
    <View {...otherProps}>
      {showUserList &&
        members &&
        (!mentionLoading ? (
          <FlatList
            data={members}
            style={[styles.mentionFlatlist, viewStyle]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              return (
                <Author
                  image={item.avatar}
                  title={item.username}
                  subtitle={item.name || '-'}
                  size="s"
                  titleStyle={fontStyle}
                  variant={'semiBold'}
                  onPressAuthor={onPressUser}
                  style={styles.mentionContainer}
                />
              );
            }}
          />
        ) : (
          <ActivityIndicator style={[styles.mentionLoading, viewStyle]} />
        ))}
    </View>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  mentionFlatlist: {
    maxHeight: 130,
    borderTopRightRadius: 4,
    borderTopLeftRadius: 4,
    borderTopWidth: 0.5,
    backgroundColor: colors.transparentBackground,
    borderColor: colors.transparentBackground,
  },
  mentionContainer: {
    flex: 1,
    height: 45,
    flexDirection: 'row',
    paddingLeft: spacing.l,
    marginVertical: spacing.l,
  },
  mentionLoading: {
    height: 65,
    backgroundColor: colors.transparentBackground,
  },
}));
