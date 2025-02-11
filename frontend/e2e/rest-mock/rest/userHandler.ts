import { http, HttpResponse } from 'msw';

import { mockUsers } from '../data';

export const userHandler = [
  http.get('/u/search/users.json', () => {
    return HttpResponse.json({
      groups: [],
      users: mockUsers,
    });
  }),
];
