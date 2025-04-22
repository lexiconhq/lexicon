import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { Dot, Text } from '../../../core-ui';
import { ChannelList as ChannelType } from '../../../generatedAPI/server';
import { makeStyles } from '../../../theme';

type Props = {
  data: ChannelType; // Channel type use for mock
  onPressItem: () => void;
  onPressButton: () => void;
  unseen: boolean;
  canJoin: boolean;
  testId?: string;
};

export default function ChannelItem(props: Props) {
  const { data, onPressButton, onPressItem, canJoin, unseen, testId } = props;
  const { title, description, color, status } = data;
  const styles = useStyles();
  const backgroundColor = `#${color}`;
  const hideButtonJoinLeave = status === 'closed' && canJoin; // hide button join if status close and can join. But still show button if can leave

  return (
    <View style={styles.container} testID={testId}>
      <TouchableOpacity
        style={styles.leftContainer}
        onPress={onPressItem}
        // disable button to navigate chat detail if not join or status close
        disabled={canJoin || hideButtonJoinLeave}
        testID={`Channel:ChannelItem:Button:Item:${data.id}`}
      >
        <Dot variant="large" style={styles.dot} color={backgroundColor} />
        <View style={styles.textContainer}>
          <View style={styles.titleContainer}>
            <Text variant="bold" style={styles.titleText}>
              {title}
            </Text>
            {unseen ? (
              <Dot
                variant="extraLarge"
                testID={`Channel:ChannelItem:Dot:Unread:${data.id}`}
              />
            ) : undefined}
          </View>
          {description ? (
            <Text
              size="s"
              style={styles.descText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {description}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={onPressButton}
        disabled={hideButtonJoinLeave}
        testID={`Channel:ChannelItem:Button:JoinOrLeave:${data.id}`}
      >
        <Text
          variant={canJoin ? 'bold' : 'normal'}
          style={canJoin ? styles.buttonText : styles.leaveText}
        >
          {!hideButtonJoinLeave ? (canJoin ? t('Join') : t('Leave')) : ''}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl + spacing.s,
  },
  leftContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  dot: {
    marginRight: spacing.xl,
  },
  textContainer: {
    flexShrink: 1, // Ensures text does not overflow out of the view
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    lineHeight: 24,
  },
  descText: {
    lineHeight: 20,
    color: colors.textLight,
    flexWrap: 'wrap',
  },
  buttonContainer: {
    justifyContent: 'center',
    paddingHorizontal: spacing.s,
  },
  buttonText: {
    color: colors.primary,
    justifyContent: 'center',
  },
  leaveText: {
    justifyContent: 'center',
    color: colors.alertErrorText,
  },
}));
