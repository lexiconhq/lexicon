import { objectType } from '@nexus/schema';

export let GroupedSearchResult = objectType({
  name: 'GroupedSearchResult',
  definition(t) {
    t.boolean('canCreateTopic');
    t.int('categoryIds', { list: true });
    t.int('groupIds', { list: true });
    t.boolean('moreCategories', { nullable: true });
    t.boolean('moreFullPageResults', { nullable: true });
    t.boolean('morePosts', { nullable: true });
    t.boolean('moreUsers', { nullable: true });
    t.int('postIds', { list: true });
    t.int('searchLogId');
    t.int('tagIds', { list: true });
    t.string('term');
    t.int('userIds', { list: true });
  },
});

/**
 * Missing:
 * error
 */
