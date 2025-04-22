import { http, HttpResponse } from 'msw';

import {
  CreateThreadInput,
  MarkReadChatInput,
  ReplyChatInput,
} from '../../../src/generatedAPI/server';
import {
  mockChatChannelMessages,
  mockChatChannels,
  mockNewChat,
  mockNewThread,
  mockThreads,
} from '../data';
import { KeysToSnakeCase } from '../utils';

import { parseStringIntoNumber } from './helper';

type ChannelIdParam = {
  channelId: string;
};

type threadDetailParam = {
  channelId: string;
  threadId: string;
};

export const chatHandler = [
  // Get Channel List
  http.get('/chat/api/channels', (req) => {
    let url = new URL(req.request.url);
    const filter = url.searchParams.get('filter') || '';
    const statusParam = url.searchParams.get('status') || 'all';
    let result = mockChatChannels;
    if (filter) {
      result = result.filter(({ title }) =>
        title.toLowerCase().includes(filter.toLowerCase()),
      );
    }

    if (statusParam && statusParam !== 'all') {
      result = result.filter(
        ({ status }) => status === statusParam.toLowerCase(),
      );
    }

    return HttpResponse.json({
      channels: result,
      meta: { loadMoreUrl: '' },
    });
  }),

  // Join Channel
  http.post<ChannelIdParam>(
    '/chat/api/channels/:channelId/memberships/me.json',
    async (req) => {
      const { channelId } = req.params;
      const parsedChannelId = parseStringIntoNumber(channelId);
      if (!parsedChannelId) {
        return HttpResponse.json(
          { error: 'Invalid channel ID' },
          { status: 400 },
        );
      }

      const channelIndex = mockChatChannels.findIndex(
        (c) => c.id === parsedChannelId,
      );

      if (channelIndex === -1) {
        return HttpResponse.json(
          { error: 'Channel not found' },
          { status: 500 },
        );
      }

      mockChatChannels[channelIndex] = {
        ...mockChatChannels[channelIndex],
        currentUserMembership: {
          following: true,
          lastReadMessageId: null,
        },
      };

      return HttpResponse.json({
        membership: { chatChannelId: parsedChannelId },
      });
    },
  ),

  // Leave Channel
  http.delete<ChannelIdParam>(
    '/chat/api/channels/:channelId/memberships/me/follows.json',
    async (req) => {
      const { channelId } = req.params;
      const parsedChannelId = parseStringIntoNumber(channelId);
      if (!parsedChannelId) {
        return HttpResponse.json(
          { error: 'Invalid channel ID' },
          { status: 400 },
        );
      }

      const channelIndex = mockChatChannels.findIndex(
        (c) => c.id === parsedChannelId,
      );

      if (channelIndex === -1) {
        return HttpResponse.json(
          { error: 'Channel not found' },
          { status: 500 },
        );
      }

      mockChatChannels[channelIndex] = {
        ...mockChatChannels[channelIndex],
        currentUserMembership: {
          following: false,
          lastReadMessageId: null,
        },
      };

      return HttpResponse.json({
        membership: { chatChannelId: parsedChannelId },
      });
    },
  ),

  // Mark Read Chat
  http.put<ChannelIdParam, KeysToSnakeCase<MarkReadChatInput>>(
    '/chat/api/channels/:channelId/read.json',
    async (req) => {
      const { channelId } = req.params;
      const parsedChannelId = parseStringIntoNumber(channelId);
      const { message_id } = await req.request.json();

      if (!parsedChannelId || !message_id) {
        return HttpResponse.json({ error: 'Invalid Input' }, { status: 400 });
      }

      const channelIndex = mockChatChannels.findIndex(
        (c) => c.id === parsedChannelId,
      );

      if (channelIndex === -1) {
        return HttpResponse.json(
          { error: 'Channel not found' },
          { status: 500 },
        );
      }

      mockChatChannels[channelIndex] = {
        ...mockChatChannels[channelIndex],
        currentUserMembership: {
          following: true,
          lastReadMessageId: message_id,
        },
      };

      return HttpResponse.json({ success: 'OK' });
    },
  ),

  // Chat Channel Detail
  http.get<ChannelIdParam>(
    '/chat/api/channels/:channelId/messages.json',
    async (req) => {
      const { channelId } = req.params;
      const parsedChannelId = parseStringIntoNumber(channelId);

      if (!parsedChannelId) {
        return HttpResponse.json(
          { error: 'Invalid channel ID' },
          { status: 400 },
        );
      }

      return HttpResponse.json({
        messages:
          parsedChannelId === mockChatChannels[1].id
            ? mockChatChannelMessages
            : [],
        meta: { canLoadMorePast: false },
      });
    },
  ),

  // Reply Chat
  http.post<ChannelIdParam, KeysToSnakeCase<ReplyChatInput>>(
    '/chat/:channelId.json',
    async (req) => {
      const { channelId } = req.params;
      const parsedChannelId = parseStringIntoNumber(channelId);
      if (!parsedChannelId) {
        return HttpResponse.json(
          { error: 'Invalid channel ID' },
          { status: 400 },
        );
      }

      const channelIndex = mockChatChannels.findIndex(
        (c) => c.id === parsedChannelId,
      );

      if (channelIndex === -1) {
        return HttpResponse.json(
          { error: 'Channel not found' },
          { status: 500 },
        );
      }

      const { thread_id } = await req.request.json();
      let messageId = 0;

      if (thread_id) {
        if (
          mockNewThread.chatChannelId !== parsedChannelId &&
          mockNewThread.threadId !== thread_id
        ) {
          return HttpResponse.json(
            { error: 'Thread not found' },
            { status: 500 },
          );
        }
        // add data new thread
        mockThreads.push(mockNewThread);
        messageId = mockNewThread.id;
      } else {
        mockChatChannelMessages.push(mockNewChat);
        messageId = mockNewChat.id;
      }

      return HttpResponse.json({
        messageId,
      });
    },
  ),

  // thread messages
  http.get<threadDetailParam>(
    '/chat/api/channels/:channelId/threads/:threadId/messages.json',
    (req) => {
      const { channelId, threadId } = req.params;
      const parsedChannelId = parseStringIntoNumber(channelId);
      const parsedThreadId = parseStringIntoNumber(threadId);
      if (!parsedChannelId || !parsedThreadId) {
        return HttpResponse.json({ error: 'Invalid input' }, { status: 400 });
      }

      let findChatMockThread = mockChatChannelMessages.find(
        ({ threadId }) => threadId === parsedThreadId,
      );

      let result = mockThreads.filter(
        ({ threadId, chatChannelId }) =>
          threadId === parsedThreadId && parsedChannelId === chatChannelId,
      );

      return HttpResponse.json({
        messages: [findChatMockThread, ...result],
        meta: {
          targetMessageId: findChatMockThread ? findChatMockThread.id : null,
          canLoadMoreFuture: false,
          canLoadMorePast: false,
        },
      });
    },
  ),

  // threadDetail
  http.get<threadDetailParam>(
    '/chat/api/channels/:channelId/threads/:threadId',
    (req) => {
      const { channelId, threadId } = req.params;
      const parsedChannelId = parseStringIntoNumber(channelId);
      const parsedThreadId = parseStringIntoNumber(threadId);
      if (!parsedChannelId || !parsedThreadId) {
        return HttpResponse.json({ error: 'Invalid input' }, { status: 400 });
      }

      let findChatMockThread = mockChatChannelMessages.find(
        ({ threadId }) => threadId === parsedThreadId,
      );

      return HttpResponse.json({
        thread: {
          id: parsedThreadId,
          originalMessage: findChatMockThread,
        },
      });
    },
  ),

  // Create Thread
  http.post<ChannelIdParam, KeysToSnakeCase<CreateThreadInput>>(
    '/chat/api/channels/:channelId/threads',
    async (req) => {
      const { channelId } = req.params;
      const parsedChannelId = parseStringIntoNumber(channelId);
      const { original_message_id } = await req.request.json();
      const threadId = 3;

      if (!parsedChannelId) {
        return HttpResponse.json(
          { error: 'Invalid channel ID' },
          { status: 400 },
        );
      }

      mockChatChannelMessages[0].threadId = threadId;

      return HttpResponse.json({
        id: threadId,
        lastMessageId: original_message_id,
      });
    },
  ),
];
