import { NewPrivateMessageReceiptsDraft } from '../generatedAPI/server';
import { UserMessageProps } from '../types';

export type UserMap = {
  usernames: Array<string>;
  userDetails: Array<UserMessageProps>;
};

/**
 * Converts recipients from a new private message response into a user map.
 *
 * @param recipients - The response data from the recipients draft NewPrivateMessageDraft.
 * @returns A userMap containing a list of usernames and a list of userDetails,
 *          where userDetails is an array of objects of type UserMessageProps.
 */

export function convertPrivateMessageRecipientsDraftIntoUserObject(
  recipients: Array<NewPrivateMessageReceiptsDraft>,
): UserMap {
  let userMap: UserMap = {
    usernames: [],
    userDetails: [],
  };

  recipients.forEach(({ recipient, recipientData }) => {
    if (recipientData) {
      userMap.usernames.push(recipient);
      userMap.userDetails.push({
        id: recipientData.id,
        avatar: recipientData.avatarTemplate,
        name: recipientData.name || '',
        username: recipientData.username,
      });
    }
  });
  return userMap;
}
