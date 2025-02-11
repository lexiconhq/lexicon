import { http, HttpResponse } from 'msw';

export const notificationsHandler = [
  http.get('/notifications.json', (req) => {
    let url = new URL(req.request.url);
    /**
     * unread condition used for profile
     */
    if (url.searchParams.get('filter') === 'unread') {
      return HttpResponse.json({
        notifications: [],
      });
    }
    return HttpResponse.json({
      notifications: [],
    });
  }),
];
