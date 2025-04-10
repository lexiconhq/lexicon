import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';

import { Apollo } from '../../../../types';
import { transformDraftData } from '../transformDraftData';

jest.mock('../../../dataLoader', () => ({
  createSearchUsersDataLoader: jest.fn(() => ({
    load: jest.fn(async (recipient) => ({
      id: recipient,
      username: recipient,
    })),
  })),
}));

describe('transformDraftData', () => {
  let mockClient: Apollo;

  beforeEach(() => {
    mockClient = new ApolloClient({
      cache: new InMemoryCache(),
      link: ApolloLink.empty(), // Prevents actual network requests
    });
  });

  it('should return null if draft data is invalid', async () => {
    const result = await transformDraftData(
      '{"test":"invalidJson"}',
      mockClient,
    );
    expect(result).toBeNull();
  });

  it('should transform a NewPostDraft correctly', async () => {
    const rawData = JSON.stringify({
      archetypeId: 'regular',
      action: 'create',
      reply: 'This is a new post',
      title: 'Post Title',
      categoryId: 1,
      tags: ['tag1', 'tag2'],
    });

    const result = await transformDraftData(rawData, mockClient);
    expect(result).toEqual({
      __typename: 'NewPostDraft',
      content: 'This is a new post',
      action: 'create',
      tags: ['tag1', 'tag2'],
      archetypeId: 'regular',
      postId: null,
      title: 'Post Title',
      categoryId: 1,
    });
  });

  it('should transform a PostReplyDraft correctly', async () => {
    const rawData = JSON.stringify({
      archetypeId: 'regular',
      action: 'reply',
      reply: 'This is a reply',
      categoryId: 2,
      tags: [],
    });

    const result = await transformDraftData(rawData, mockClient);
    expect(result).toEqual({
      __typename: 'PostReplyDraft',
      content: 'This is a reply',
      action: 'reply',
      tags: [],
      archetypeId: 'regular',
      postId: null,
      categoryId: 2,
    });
  });

  it('should transform a PrivateMessageReplyDraft correctly', async () => {
    const rawData = JSON.stringify({
      archetypeId: 'regular',
      action: 'reply',
      reply: 'This is a private message reply',
      tags: [],
      categoryId: null,
    });

    const result = await transformDraftData(rawData, mockClient);
    expect(result).toEqual({
      __typename: 'PrivateMessageReplyDraft',
      content: 'This is a private message reply',
      action: 'reply',
      tags: [],
      archetypeId: 'regular',
      postId: null,
    });
  });

  it('should transform a NewPrivateMessageDraft with recipients', async () => {
    const rawData = JSON.stringify({
      archetypeId: 'private_message',
      reply: 'This is a private message',
      title: 'Private Message Title',
      recipients: 'user1,user2',
      tags: [],
      categoryId: null,
      action: 'privateMessage',
    });

    const result = await transformDraftData(rawData, mockClient);
    expect(result).toEqual({
      __typename: 'NewPrivateMessageDraft',
      content: 'This is a private message',
      action: 'privateMessage',
      tags: [],
      archetypeId: 'private_message',
      postId: null,
      title: 'Private Message Title',
      recipients: [
        {
          __typename: 'NewPrivateMessageReceiptsDraft',
          recipientData: { id: 'user1', username: 'user1' },
          recipient: 'user1',
        },
        {
          __typename: 'NewPrivateMessageReceiptsDraft',
          recipientData: { id: 'user2', username: 'user2' },
          recipient: 'user2',
        },
      ],
    });
  });
});
