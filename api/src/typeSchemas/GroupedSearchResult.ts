import { objectType } from 'nexus';

export let GroupedSearchResult = objectType({
  name: 'GroupedSearchResult',
  definition(t) {
    t.boolean('canCreateTopic');
    t.list.int('categoryIds');
    t.list.int('groupIds');
    t.nullable.boolean('moreCategories');
    t.nullable.boolean('moreFullPageResults');
    t.nullable.boolean('morePosts');
    t.nullable.boolean('moreUsers');
    t.list.int('postIds');
    t.int('searchLogId');
    t.list.int('tagIds');
    t.string('term');
    t.list.int('userIds');
  },
});

/**
 * Missing:
 * error
 */
