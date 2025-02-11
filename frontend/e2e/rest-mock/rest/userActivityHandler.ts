import { http, HttpResponse } from 'msw';

import { allPosts, allTopics } from '../data';

export const userActivityHandler = [
  http.get('/user_actions.json', (req) => {
    let uri = new URL(req.request.url);
    let username = uri.searchParams.get('username') || '';

    let userActivities = allPosts.filter((item) => item.username === username);

    if (!userActivities.length) {
      throw new Error('User not found');
    }

    return HttpResponse.json({
      user_actions: userActivities.map((item) => {
        let topic = allTopics.find((topic) => topic.id === item.topicId);

        return {
          topicId: item.topicId,
          postId: item.id,
          actionType: 4,
          avatarTemplate: item.avatarTemplate,
          createdAt: item.createdAt,
          excerpt: topic?.excerpt,
          categoryId: topic?.categoryId,
          postNumber: item.postNumber,
          title: topic?.title,
          username,
          hidden: false,
        };
      }),
    });
  }),
];
