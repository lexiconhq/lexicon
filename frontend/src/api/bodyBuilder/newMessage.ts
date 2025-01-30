import { RestLink } from 'apollo-link-rest';

/**
 * For new private message we need change data targetRecipients from array of string into string
 * input: ["adam", "world"]
 * expect: "adam,world"
 *
 * beside that we need add default value archetype: 'private_message' every time time create new private message.
 */
export function newPrivateMessageBodyBuilder({
  args,
}: RestLink.RestLinkHelperProps) {
  const { newPrivateMessageInput } = args;

  return {
    ...newPrivateMessageInput,
    targetRecipients: newPrivateMessageInput.targetRecipients.join(','),
    archetype: 'private_message',
  };
}
