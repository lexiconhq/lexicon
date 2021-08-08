import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Avatar } from '../../../core-ui';
import { getImage } from '../../../helpers';
import { makeStyles } from '../../../theme';
import { StackNavProp } from '../../../types';

type Props = {
  participants: Array<{ avatar: string; username: string }>;
};

export function MessageAvatar(props: Props) {
  const styles = useStyles();

  const { participants } = props;
  const isMoreThanOne = participants.length > 1;

  const { navigate } = useNavigation<StackNavProp<'Messages'>>();

  const onPressAvatar = (username: string) => {
    navigate('UserInformation', { username });
  };

  return (
    <View style={styles.avatarContainer}>
      {participants.map(({ avatar, username }, idx) => {
        return (
          <Avatar
            key={`Avatar-${idx}`}
            style={
              isMoreThanOne && [
                styles.avatarArray,
                { top: idx * 6, left: idx * 6 },
              ]
            }
            src={getImage(avatar)}
            size={isMoreThanOne ? 's' : 'm'}
            label={username[0]}
            onPress={() => onPressAvatar(username)}
          />
        );
      })}
    </View>
  );
}

const useStyles = makeStyles(() => ({
  avatarContainer: {
    flex: 1,
  },
  avatarArray: {
    position: 'absolute',
  },
}));
