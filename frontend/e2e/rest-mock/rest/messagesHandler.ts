import { http, HttpResponse } from 'msw';

import { LeaveMessageInput } from '../../../src/generatedAPI/server';
import { mockMessages, mockUsers } from '../data';
import { KeysToSnakeCase } from '../utils';

import { parseStringIntoNumber } from './helper';

type TopicIDParams = {
  topicId: string;
};

export const messagesHandler = [
  // Message list
  http.get(`/topics/private-messages/:username.json`, (req) => {
    const { username } = req.params;
    if (!username) {
      throw new Error('User not found');
    }

    return HttpResponse.json({
      primaryGroups: [],
      topicList: {
        topics: [],
      },
      users: [],
    });
  }),

  http.get(`/topics/private-messages-sent/:username.json`, (req) => {
    const { username } = req.params;
    if (!username) {
      throw new Error('User not found');
    }

    return HttpResponse.json({
      primaryGroups: [],
      topicList: {
        topics: mockMessages,
      },
      users: mockUsers,
    });
  }),

  // Leave message
  http.put<TopicIDParams, KeysToSnakeCase<LeaveMessageInput>>(
    '/t/:topicId/remove-allowed-user.json',
    async (req) => {
      const { topicId } = req.params;
      const parsedTopicId = parseStringIntoNumber(topicId);
      if (!parsedTopicId) {
        return HttpResponse.json({ success: '' });
      }

      const indexToRemove = mockMessages.findIndex(
        ({ id }) => id === parsedTopicId,
      );

      if (indexToRemove !== -1) {
        mockMessages.splice(indexToRemove, 1);
      }

      return HttpResponse.json({ success: 'OK' });
    },
  ),
];
