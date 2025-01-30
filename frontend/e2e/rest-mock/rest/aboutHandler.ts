import { http, HttpResponse } from 'msw';

import { mockTopicsRest } from '../data';

export const aboutHandler = [
  http.get('/about.json', () => {
    return HttpResponse.json({
      about: {
        stats: {
          topicCount: mockTopicsRest.length,
        },
      },
    });
  }),
];
