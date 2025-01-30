import { http, HttpResponse } from 'msw';

export const timingsHandler = [
  http.post('/topics/timings.json', () => {
    return HttpResponse.json({ message: 'success' });
  }),
];
