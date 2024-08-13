import { allTopics, allPosts } from '../data';

export const userActivityResolvers = {
  Query: {
    userActivity: (
      _: unknown,
      { username }: { username: string; offset: number; filter: string },
    ) => {
      let userActivities = allPosts.filter(
        (item) => item.username === username,
      );

      if (userActivities.length > 0) {
        return userActivities.map((item) => {
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
            markdownContent: item.markdownContent,
            title: topic?.title,
            username,
            hidden: false,
          };
        });
      }

      throw new Error('User not found');
    },
  },
};
