import { replaceDataPagination } from './paginationHandler';

export function getTopicDetailOutputCacheBehavior() {
  return {
    fields: {
      title: replaceDataPagination(),
      views: replaceDataPagination(),
      likeCount: replaceDataPagination(),
      postsCount: replaceDataPagination(),
      liked: replaceDataPagination(),
      categoryId: replaceDataPagination(),
      tags: replaceDataPagination(),
      createdAt: replaceDataPagination(),
      details: replaceDataPagination(),
    },
  };
}
