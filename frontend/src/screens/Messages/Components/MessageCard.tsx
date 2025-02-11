import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { formatRelativeTime } from '../../../helpers';
import { makeStyles, useTheme } from '../../../theme';
import { MessageParticipants, StackNavProp } from '../../../types';

import { MessageAvatar } from './MessageAvatar';
import { MessageContent } from './MessageContent';
import { MessageNotification } from './MessageNotification';

type Props = {
  id: number;
  message: string;
  messageParticipants: MessageParticipants;
  postNumber: number;
  allowedUserCount?: number | null;
  date: string;
  seen?: boolean;
  testID?: string;
};

export { Props as MessageCardProps };

export function MessageCard(props: Props) {
  const styles = useStyles();
  const { colors } = useTheme();

  const {
    id,
    message,
    messageParticipants,
    date,
    seen: seenProps,
    allowedUserCount,
    postNumber,
    testID,
  } = props;

  const { participantsToShow } = messageParticipants ?? {
    participantsToShow: [],
  };

  const firstParticipant = participantsToShow[0] ?? { username: '' };

  const { navigate } = useNavigation<StackNavProp<'MessageDetail'>>();

  const [seen, setSeen] = useState(seenProps);

  /**
   * This useEffect ensures that when navigating to the message details directly, such as via a deep link without clicking onPressItem,
   * the seenProps value is correctly synced with the local state. Without this, the initial message in the list might incorrectly display
   * seen = false, even though seenProps is true.
   */

  useEffect(() => {
    if (seen !== seenProps) {
      setSeen(seenProps);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seenProps]);

  const onPressItem = () => {
    if (!seen) {
      setSeen(true);
    }
    navigate('MessageDetail', {
      id,
      postNumber,
      hyperlinkUrl: '',
      hyperlinkTitle: '',
    });
  };

  return (
    <TouchableOpacity
      style={[
        styles.messageContainer,
        seen && { backgroundColor: colors.backgroundDarker },
      ]}
      onPress={onPressItem}
      testID={testID}
    >
      <MessageAvatar
        participants={participantsToShow.map(({ avatar, username }) => ({
          avatar,
          username,
        }))}
      />
      <MessageContent
        username={firstParticipant.username}
        participantCount={(allowedUserCount || 1) - 1}
        message={message}
      />
      <MessageNotification date={formatRelativeTime(date)} seen={seen} />
    </TouchableOpacity>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  messageContainer: {
    flexGrow: 1,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xl,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderBottomWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
}));
