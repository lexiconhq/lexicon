import { http, HttpResponse } from 'msw';

import {
  TogglePollStatusInput,
  VotePollMutationVariables,
} from '../../../src/generatedAPI/server';
import { mockPostWithPoll } from '../data';
import { KeysToSnakeCase } from '../utils';

import { parseStringIntoNumber } from './helper';

export const pollHandler = [
  // vote poll
  http.put<never, KeysToSnakeCase<VotePollMutationVariables>>(
    '/polls/vote.json',
    async (req) => {
      const { options } = await req.request.json();

      const polls = mockPostWithPoll.polls || [];
      const poll = polls[0];
      const newOptions = poll.options.map((option) => {
        if (option.id === options[0]) {
          return {
            ...option,
            votes: option.votes + 1,
          };
        }
        return option;
      });

      return HttpResponse.json({
        poll: {
          ...poll,
          options: newOptions,
        },
        vote: options,
      });
    },
  ),

  // undo vote
  http.delete('/polls/vote.json', async (req) => {
    let uri = new URL(req.request.url);
    let postId = uri.searchParams.get('post_id') || '';
    let pollName = uri.searchParams.get('poll_name') || '';

    const parsePostId = parseStringIntoNumber(postId);
    if (!parsePostId || !pollName) {
      throw new Error('param post id or poll name cannot empty');
    }

    const poll = mockPostWithPoll.polls[0];

    if (mockPostWithPoll.id !== parsePostId) {
      throw new Error('incorrect post id');
    }

    const newOptions = poll.options.map((option) => {
      return {
        ...option,
        votes: 0,
      };
    });

    return HttpResponse.json({ poll: { ...poll, options: newOptions } });
  }),

  // toggle poll

  http.put<never, KeysToSnakeCase<TogglePollStatusInput>>(
    '/polls/toggle_status.json',
    async (req) => {
      const { post_id, status } = await req.request.json();

      if (!post_id || !status) {
        throw new Error('param post id or status cannot empty');
      }

      const poll = mockPostWithPoll.polls[0];

      if (mockPostWithPoll.id !== post_id) {
        throw new Error('incorrect post id');
      }

      return HttpResponse.json({
        poll: {
          ...poll,
          status,
        },
      });
    },
  ),
];
