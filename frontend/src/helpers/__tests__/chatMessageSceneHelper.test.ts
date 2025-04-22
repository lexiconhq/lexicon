import { DirectionPagination } from '../../generatedAPI/server';
import { ChatMessageContent } from '../../types';
import {
  FetchMore,
  fetchPaginatedMessages,
  isSameSenderAsPreviousMessage,
  shouldDisplayTimestamp,
} from '../chatMessageSceneHelper';

jest.mock('@apollo/client');

describe('fetchPaginatedMessages', () => {
  let fetchMoreMock: FetchMore;

  beforeEach(() => {
    fetchMoreMock = jest.fn().mockResolvedValue({
      data: {},
    });
  });

  it('should call fetchMore with correct parameters when conditions are met', async () => {
    fetchPaginatedMessages({
      loadingState: false,
      hasMoreMessages: true,
      isInitialRequest: false,
      fetchMore: fetchMoreMock,
      channelId: 1,
      pageSize: 20,
      targetMessageId: 50,
      direction: DirectionPagination.Future,
    });

    expect(fetchMoreMock).toHaveBeenCalledWith({
      variables: {
        channelId: 1,
        pageSize: 20,
        targetMessageId: 50,
        direction: DirectionPagination.Future,
      },
    });
  });
  it('should not call fetchMore if loadingState is true', () => {
    fetchPaginatedMessages({
      loadingState: true,
      hasMoreMessages: true,
      isInitialRequest: false,
      fetchMore: fetchMoreMock,
      channelId: 1,
      pageSize: 20,
      targetMessageId: 100,
      direction: DirectionPagination.Future,
    });

    expect(fetchMoreMock).not.toHaveBeenCalled();
  });
});

const messages: Array<ChatMessageContent> = [
  {
    id: 1,
    markdownContent: 'Hello ?',
    time: '2025-02-06T10:00:00Z',
    user: { id: 1, username: 'test', avatar: '' },
    mentionedUsers: [],
    uploads: [],
  },
  {
    id: 2,
    markdownContent: 'Hey',
    time: '2025-02-06T10:01:00Z',
    user: { id: 2, username: 'adam', avatar: '' },
    mentionedUsers: [],
    uploads: [],
  },
  {
    id: 3,
    markdownContent: 'Nice to hear',
    time: '2025-02-07T10:04:00Z',
    user: { id: 1, username: 'test', avatar: '' },
    mentionedUsers: [],
    uploads: [],
  },
  {
    id: 4,
    markdownContent: 'Any updates?',
    time: '2025-02-07T10:09:00Z',
    user: { id: 2, username: 'adam', avatar: '' },
    mentionedUsers: [],
    uploads: [],
  },
  {
    id: 5,
    markdownContent: 'It’s been quite a while with no updates',
    time: '2025-02-07T10:12:00Z',
    user: { id: 2, username: 'adam', avatar: '' },
    mentionedUsers: [],
    uploads: [],
  },
];

describe('isSameSenderAsPreviousMessage', () => {
  it('should return false if messages array is empty and currentIndex 0', () => {
    expect(isSameSenderAsPreviousMessage([], 1)).toBe(false);
    expect(isSameSenderAsPreviousMessage(messages, 0)).toBe(false);
  });

  it('should return true when the current and previous messages have the same sender', () => {
    expect(isSameSenderAsPreviousMessage(messages, 4)).toBe(true);
  });

  it('should return false when the current and previous messages have different senders', () => {
    expect(isSameSenderAsPreviousMessage(messages, 2)).toBe(false);
    expect(isSameSenderAsPreviousMessage(messages, 3)).toBe(false);
  });

  describe('shouldDisplayTimestamp', () => {
    it('should return true when currIndex is -1 and sender is different from the previous message', () => {
      expect(shouldDisplayTimestamp(messages, -1)).toBe(true);
      expect(shouldDisplayTimestamp(messages, 2)).toBe(true);
    });

    it('should return value of compareTime when sender is the same as previous', () => {
      // For more tests on compareTime, refer to the compareTime.test.ts file.
      // Returns true if the time difference exceeds 15 minutes.
      expect(shouldDisplayTimestamp(messages, 2)).toBe(true);

      expect(shouldDisplayTimestamp(messages, 4)).toBe(false);
    });
  });
});
