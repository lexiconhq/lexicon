import { objectType } from 'nexus';

export let SearchOutput = objectType({
  name: 'SearchOutput',
  definition(t) {
    t.field('groupedSearchResult', { type: 'GroupedSearchResult' });
    t.list.field('posts', { type: 'SearchPost' });
    t.list.field('topics', { type: 'SearchTopic' });
  },
});

/**
 * Not used yet:
 * groups
 * categories
 * tags
 * users
 */
