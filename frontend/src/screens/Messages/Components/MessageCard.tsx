import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { TouchableOpacity } from 'react-native';

import { FORM_DEFAULT_VALUES } from '../../../constants';
import {
  formatRelativeTime,
  processDraftPollAndImageForPrivateMessageReply,
} from '../../../helpers';
import { useLazyCheckPostDraft } from '../../../hooks';
import { makeStyles, useTheme } from '../../../theme';
import { MessageParticipants, NewPostForm, StackNavProp } from '../../../types';

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

  const { setValue, reset: resetForm } = useFormContext<NewPostForm>();
  const { participantsToShow } = messageParticipants ?? {
    participantsToShow: [],
  };

  const firstParticipant = participantsToShow[0] ?? { username: '' };

  const { navigate } = useNavigation<StackNavProp<'MessageDetail'>>();

  const navToMessageDetail = () => {
    navigate('MessageDetail', {
      id,
      postNumber,
      hyperlinkUrl: '',
      hyperlinkTitle: '',
    });
  };

  const { checkPostDraft } = useLazyCheckPostDraft({
    nextFetchPolicy: 'cache-and-network',
    fetchPolicy: 'network-only',
    onCompleted: ({ checkPostDraft }) => {
      setValue('sequence', checkPostDraft.sequence);

      if (
        checkPostDraft.draft &&
        // eslint-disable-next-line no-underscore-dangle
        checkPostDraft.draft.__typename === 'PrivateMessageReplyDraft'
      ) {
        let draftData = checkPostDraft.draft;

        const { imageMessageReplyList, newContentFilterRaw, polls } =
          processDraftPollAndImageForPrivateMessageReply({
            content: draftData.content,
          });

        resetForm({
          ...FORM_DEFAULT_VALUES,
          raw: newContentFilterRaw,
          isDraft: true,
          sequence: checkPostDraft.sequence,
          polls,
          imageMessageReplyList,
          draftKey: `topic_${id}`,
        });
      } else {
        resetForm(FORM_DEFAULT_VALUES);
      }
      navToMessageDetail();
    },
    onError: () => {
      resetForm(FORM_DEFAULT_VALUES);
      navToMessageDetail();
    },
  });

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

  const onPressItem = async () => {
    if (!seen) {
      setSeen(true);
    }
    await checkPostDraft({
      variables: { draftKey: `topic_${id}` },
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
