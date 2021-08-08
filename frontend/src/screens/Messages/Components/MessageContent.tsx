import React from 'react';
import { View } from 'react-native';

import { Text } from '../../../core-ui';
import { makeStyles } from '../../../theme';

type Props = {
  username: string;
  participantCount: number;
  message: string;
};

export function MessageContent(props: Props) {
  const styles = useStyles();

  const { username, participantCount, message } = props;

  const participants =
    participantCount > 1
      ? `${username} +${participantCount - 1} more`
      : username;

  return (
    <View style={styles.contentContainer}>
      <Text variant="semiBold" color="textNormal">
        {participants}
      </Text>
      <Text variant="normal" color="textLight">
        {message}
      </Text>
    </View>
  );
}

const useStyles = makeStyles(() => ({
  contentContainer: {
    flex: 3,
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
  },
}));
