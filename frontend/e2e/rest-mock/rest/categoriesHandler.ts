import { http, HttpResponse } from 'msw';

import { mockCategories } from '../data';

export const categoriesHandler = [
  http.get('/categories.json', () => {
    return HttpResponse.json({
      categoryList: {
        canCreateCategory: false,
        canCreateTopic: true,
        categories: mockCategories,
      },
    });
  }),
];
