import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { Divider, Icon, Text } from '../../../core-ui';
import { IconName } from '../../../icons';
import { makeStyles } from '../../../theme';

type Props = {
  tagName: string;
  rightLabel?: string;
  rightIcon?: IconName;
  onItemPress?: (tagName: string) => void;
};

export function TagItem(props: Props) {
  const styles = useStyles();

  const { tagName, rightLabel, rightIcon, onItemPress } = props;

  const content = (
    <>
      <Text numberOfLines={1} style={styles.tagName}>
        {tagName}
      </Text>
      {rightLabel != null && (
        <Text variant="bold" color="primary">
          {rightLabel}
        </Text>
      )}
      {rightIcon != null && <Icon name={rightIcon} />}
    </>
  );

  const wrappedContent = onItemPress ? (
    <TouchableOpacity
      onPress={() => onItemPress(tagName)}
      style={styles.content}
    >
      {content}
    </TouchableOpacity>
  ) : (
    <View style={styles.content}>{content}</View>
  );

  return (
    <View>
      {wrappedContent}
      <Divider />
    </View>
  );
}

const useStyles = makeStyles(({ spacing }) => ({
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xl,
  },
  tagName: {
    flex: 1,
  },
}));
