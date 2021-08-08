import React from 'react';
import { View } from 'react-native';

import { Icon, Text } from '../../../core-ui';
import { makeStyles } from '../../../theme';

import { MessageCardProps } from './MessageCard';

type Props = Pick<MessageCardProps, 'date' | 'seen'>;

export function MessageNotification(props: Props) {
  const styles = useStyles();

  const { date, seen = false } = props;

  return (
    <View style={styles.notificationContainer}>
      <Text variant="normal" color="textLight" size="s" style={styles.message}>
        {date}
      </Text>
      {!seen && <Icon name="Mail" size="xs" style={styles.messageIcon} />}
    </View>
  );
}

const useStyles = makeStyles(({ spacing }) => ({
  notificationContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  messageIcon: {
    alignItems: 'flex-end',
  },
  message: {
    alignItems: 'flex-start',
    marginLeft: spacing.m,
  },
}));
