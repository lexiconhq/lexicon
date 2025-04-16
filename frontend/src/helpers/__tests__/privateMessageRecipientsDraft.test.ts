import { NewPrivateMessageReceiptsDraft } from '../../generatedAPI/server';
import { convertPrivateMessageRecipientsDraftIntoUserObject } from '../privateMessageRecipientsDraft';

describe('convertPrivateMessageRecipientsDraftIntoUserObject', () => {
  it('should convert recipients into userMap correctly', () => {
    const mockRecipients: Array<NewPrivateMessageReceiptsDraft> = [
      {
        recipient: 'john',
        recipientData: {
          id: 1,
          avatarTemplate: 'avatar1.png',
          name: 'John',
          username: 'john',
        },
      },
      {
        recipient: 'doe',
        recipientData: {
          id: 2,
          avatarTemplate: 'avatar2.png',
          name: 'Doe',
          username: 'doe',
        },
      },
      {
        recipient: 'adam',
        recipientData: {
          id: 3,
          avatarTemplate: 'avatar3.png',
          name: null,
          username: 'adam',
        },
      },
      {
        recipient: 'empty',
        recipientData: null,
      },
    ];
    const result =
      convertPrivateMessageRecipientsDraftIntoUserObject(mockRecipients);
    expect(result).toEqual({
      usernames: ['john', 'doe', 'adam'],
      userDetails: [
        {
          id: 1,
          avatar: 'avatar1.png',
          name: 'John',
          username: 'john',
        },
        {
          id: 2,
          avatar: 'avatar2.png',
          name: 'Doe',
          username: 'doe',
        },
        {
          id: 3,
          avatar: 'avatar3.png',
          name: '',
          username: 'adam',
        },
      ],
    });
  });

  it('should return empty arrays when recipients is empty', () => {
    const mockRecipients: Array<NewPrivateMessageReceiptsDraft> = [];
    const result =
      convertPrivateMessageRecipientsDraftIntoUserObject(mockRecipients);
    expect(result).toEqual({
      usernames: [],
      userDetails: [],
    });
  });
});
