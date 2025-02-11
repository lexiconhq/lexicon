import { http, HttpResponse } from 'msw';

import { EditUserStatusInput } from '../../../src/generatedAPI/server';
import { mockUsers } from '../data';
import { KeysToSnakeCase } from '../utils';

export const userStatusHandler = [
  http.put<never, KeysToSnakeCase<EditUserStatusInput>>(
    '/user-status.json',
    async (req) => {
      const { emoji, ends_at, description } = await req.request.json();

      if (mockUsers[0].status) {
        mockUsers[0].status = {
          ...mockUsers[0].status,
          ...{ emoji, endsAt: ends_at, description },
        };
      }

      return HttpResponse.json({ message: 'success' });
    },
  ),

  http.delete('/user-status.json', async () => {
    if (mockUsers[0].status) {
      mockUsers[0].status = null;
    }

    return HttpResponse.json({ message: 'success' });
  }),
];
