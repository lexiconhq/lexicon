import { http, HttpResponse } from 'msw';

import { SITE, SITE_SETTINGS } from '../data';

export const siteHandler = [
  http.get('/site.json', (req) => {
    const token = req.request.headers.get('Authorization');
    if (!token) {
      throw new Error('Authorization Failed');
    }
    return HttpResponse.json({
      ...SITE,
    });
  }),
  http.get('/site/settings.json', (req) => {
    const token = req.request.headers.get('Authorization');
    if (!token) {
      throw new Error('Authorization Failed');
    }
    return HttpResponse.json({
      ...SITE_SETTINGS,
    });
  }),
];
