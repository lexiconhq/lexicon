import { objectType } from '@nexus/schema';

export let SearchOutput = objectType({
  name: 'SearchOutput',
  definition(t) {
    t.field('groupedSearchResult', { type: 'GroupedSearchResult' });
    t.field('posts', { type: 'SearchPost', list: true });
    t.field('topics', { type: 'SearchTopic', list: true });
  },
});

/**
 * Not used yet:
 * groups
 * categories
 * tags
 * users
 */
